// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";
import { spawnSync } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createEvidenceCliDependencies } from "@/scripts/evidence/server-adapter";
import {
  artifact,
  license,
  manifest,
  metric,
  observation,
} from "./test-fixtures";
import { runIngestion } from "./pipeline";
import { ParserRegistry } from "./parser-registry";

const url =
  process.env.ATOM_TEST_DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
if (process.env.ATOM_REQUIRE_INGESTION_INTEGRATION === "1" && !url)
  throw new Error(
    "Local ingestion integration requires ATOM_TEST_DATABASE_URL or SUPABASE_DATABASE_URL.",
  );
if (url && !["127.0.0.1", "localhost"].includes(new URL(url).hostname))
  throw new Error("Integration tests require a disposable local database.");

describe.skipIf(!url)(
  "durable Postgres evidence lifecycle (synthetic only)",
  () => {
    const db = postgres(url ?? "postgres://localhost/unused", { max: 2 });
    let adapter: Awaited<ReturnType<typeof createEvidenceCliDependencies>>;
    const bytes = artifact();
    let versionId: string;
    let fixtureDirectory: string;
    beforeAll(async () => {
      adapter = await createEvidenceCliDependencies({
        SUPABASE_DATABASE_URL: url,
      });
      fixtureDirectory = await mkdtemp(join(tmpdir(), "atom-r04-synthetic-"));
      await writeFile(join(fixtureDirectory, "artifact.json"), bytes);
      await writeFile(
        join(fixtureDirectory, "manifest.json"),
        JSON.stringify(manifest(bytes)),
      );
      const metadata = {
        publication_status: "published",
        reviewed_by: "synthetic-parent-review",
        reviewed_at: "2026-09-01T00:00:00Z",
        published_at: "2026-09-01T00:00:00Z",
      };
      await db`insert into public.technologies ${db({ id: "synthetic-technology", name: "Synthetic", description: "Synthetic software fixture", lifecycle_status: "active", ...metadata })}`;
      await db`insert into public.geographies ${db({ id: "synthetic-global", name: "Synthetic", scope: "global", ...metadata })}`;
      await db`insert into public.metrics ${db({ id: metric.id, canonical_unit: "MW", supported_units: ["MW", "GW"], value_kind: "numeric", range_semantics: "point-or-range", representative_rule: "source-observation", geography_support: ["global"], definition: "Synthetic power.", explanation_content: "Synthetic only", registry_category: "technical", ...metadata })}`;
      await db`insert into public.sources ${db({ id: "synthetic-source", source_tier: "A", title: "Synthetic only", publisher: "Synthetic institution", url: "https://example.invalid/synthetic", conflict_disclosure: "Synthetic test only.", licence_id: license.id, licence_name: license.name, redistribution: "allowed", published_on: "2026-08-01", accessed_on: "2026-09-01", last_verified_on: "2026-09-01", ...metadata })}`;
      await db`insert into public.studies ${db({ id: "synthetic-study", source_id: "synthetic-source", title: "Synthetic study", methodology: "Synthetic method.", system_boundary: "Synthetic boundary.", period_start_year: 2025, period_end_year: 2025, publication_label: "synthetic-v1", ...metadata })}`;
      await db`insert into public.datasets ${db({ id: "synthetic-dataset", source_id: "synthetic-source", title: "Synthetic dataset", publisher: "Synthetic institution", licence_id: license.id, licence_name: license.name, redistribution: "allowed", raw_access: "permitted", ...metadata })}`;
      for (const role of ["scientific", "editorial", "licensing"]) {
        await db`insert into private.evidence_reviewers (id, identity_reference, display_name, approved_roles) values (${`synthetic-${role}`}, ${`https://example.invalid/synthetic-reviewer/${role}`}, ${`Synthetic ${role} reviewer — software test only`}, array['scientific', 'editorial', 'licensing'])`;
      }
    });
    afterAll(async () => {
      await adapter?.close();
      await db.end();
      if (fixtureDirectory) await rm(fixtureDirectory, { recursive: true });
    });

    async function ingest(data = bytes, m = manifest(data)) {
      return runIngestion(
        { artifactPath: "synthetic-only", manifest: m },
        {
          ...adapter.ingestion,
          files: {
            async read() {
              return data;
            },
          },
        },
      );
    }
    async function approve(id: string) {
      for (const role of ["scientific", "editorial", "licensing"] as const) {
        await adapter.review({
          datasetVersionId: id,
          role,
          reviewerId: `synthetic-${role}`,
          artifactChecksum: (
            await db`select checksum_digest from public.dataset_versions where id = ${id}`
          )[0].checksum_digest,
          manifestDigest: (
            await db`select manifest_digest from private.version_artifacts where dataset_version_id = ${id}`
          )[0].manifest_digest,
        });
      }
    }
    it("persists one normalized draft and returns it on exact repeat", async () => {
      const child = spawnSync(
        process.execPath,
        [
          "--conditions=react-server",
          "--import",
          "tsx",
          "scripts/evidence/ingest.ts",
          "ingest",
          "--manifest",
          join(fixtureDirectory, "manifest.json"),
          "--artifact",
          join(fixtureDirectory, "artifact.json"),
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          env: {
            PATH: process.env.PATH,
            NODE_ENV: "test",
            SUPABASE_DATABASE_URL: url,
          },
        },
      );
      expect(child.status, child.stderr).toBe(0);
      const first = JSON.parse(child.stdout);
      versionId = first.datasetVersionId;
      expect(await ingest()).toEqual(first);
      const rows =
        await db`select value, unit, publication_status from public.observations where dataset_version_id = ${versionId}`;
      expect(rows).toEqual([
        { value: "1000", unit: "MW", publication_status: "draft" },
      ]);
      expect(
        (
          await db`select input_unit, output_unit from public.observation_transformations where observation_id in (select id from public.observations where dataset_version_id = ${versionId}) and operation_name = 'unit-conversion'`
        )[0],
      ).toEqual({ input_unit: "GW", output_unit: "MW" });
      expect(
        (
          await db`select status, accepted_record_count from private.ingestion_runs where id = ${first.runId}`
        )[0],
      ).toMatchObject({ status: "succeeded", accepted_record_count: "1" });
      expect(
        (
          await db`select event_type from private.ingestion_events where ingestion_run_id = ${first.runId} order by sequence_number`
        ).map((r) => r.event_type),
      ).toEqual([
        "acquisition",
        "validation",
        "normalization",
        "conversion",
        "quality-checks",
        "derivation",
      ]);
    });
    it("rejects changed manifest metadata under the same idempotency identity", async () => {
      await expect(
        ingest(bytes, manifest(bytes, { conflictDisclosure: "Changed" })),
      ).rejects.toThrow(/manifest/i);
    });
    it("requires independent reviews bound to the exact artifact", async () => {
      await expect(
        adapter.publish({ datasetVersionId: versionId }),
      ).rejects.toThrow(/review/i);
      const digest = (
        await db`select manifest_digest from private.version_artifacts where dataset_version_id = ${versionId}`
      )[0].manifest_digest;
      await expect(
        adapter.review({
          datasetVersionId: versionId,
          role: "scientific",
          reviewerId: "synthetic-scientific",
          artifactChecksum: "0".repeat(64),
          manifestDigest: digest,
        }),
      ).rejects.toThrow(/artifact/i);
      await adapter.review({
        datasetVersionId: versionId,
        role: "scientific",
        reviewerId: "synthetic-scientific",
        artifactChecksum: manifest().checksum,
        manifestDigest: digest,
      });
      await expect(
        adapter.review({
          datasetVersionId: versionId,
          role: "editorial",
          reviewerId: "synthetic-scientific",
          artifactChecksum: manifest().checksum,
          manifestDigest: digest,
        }),
      ).rejects.toThrow(/unique|duplicate/i);
      for (const role of ["editorial", "licensing"] as const)
        await adapter.review({
          datasetVersionId: versionId,
          role,
          reviewerId: `synthetic-${role}`,
          artifactChecksum: manifest().checksum,
          manifestDigest: digest,
        });
      await expect(
        adapter.review({
          datasetVersionId: versionId,
          role: "scientific",
          reviewerId: "synthetic-other",
          artifactChecksum: manifest().checksum,
          manifestDigest: digest,
        }),
      ).rejects.toThrow();
      const reviews =
        await db`select reviewer_id, review_role, reviewed_at, artifact_checksum, manifest_digest from private.dataset_version_reviews where dataset_version_id = ${versionId}`;
      expect(reviews).toHaveLength(3);
      expect(new Set(reviews.map((r) => r.reviewer_id)).size).toBe(3);
      expect(
        reviews.every(
          (r) =>
            r.manifest_digest === digest &&
            r.artifact_checksum === manifest().checksum &&
            r.reviewed_at,
        ),
      ).toBe(true);
    });
    it("publishes atomically while retaining a disabled feature and immutable evidence", async () => {
      const child = spawnSync(
        process.execPath,
        [
          "--conditions=react-server",
          "--import",
          "tsx",
          "scripts/evidence/ingest.ts",
          "publish",
          "--dataset-version",
          versionId,
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          env: {
            PATH: process.env.PATH,
            NODE_ENV: "test",
            SUPABASE_DATABASE_URL: url,
          },
        },
      );
      expect(child.status, child.stderr).toBe(0);
      expect(JSON.parse(child.stdout)).toMatchObject({
        status: "published",
        observationCount: 1,
      });
      expect(
        (
          await db`select publication_status, reviewed_at, published_at from public.dataset_versions where id = ${versionId}`
        )[0],
      ).toMatchObject({
        publication_status: "published",
        reviewed_at: expect.any(Date),
        published_at: expect.any(Date),
      });
      expect(
        await db`select * from public.metric_releases where metric_id = ${metric.id}`,
      ).toHaveLength(0);
      await expect(
        adapter.publish({ datasetVersionId: versionId }),
      ).rejects.toThrow();
      await expect(
        db`update public.observations set value = 999 where dataset_version_id = ${versionId}`,
      ).rejects.toThrow(/immutable/i);
    });
    it("rolls publication back when a later database write fails", async () => {
      const result = await ingest(
        bytes,
        manifest(bytes, { transformationVersion: "5.0.0" }),
      );
      await approve(result.datasetVersionId);
      await db`create function private.synthetic_fail_publication() returns trigger language plpgsql as $$ begin if new.publication_status = 'published' then raise exception 'Synthetic publication failure'; end if; return new; end; $$`;
      await db`create trigger synthetic_publication_failure before update on public.dataset_versions for each row execute function private.synthetic_fail_publication()`;
      try {
        await expect(
          adapter.publish({ datasetVersionId: result.datasetVersionId }),
        ).rejects.toThrow(/Synthetic publication failure/);
      } finally {
        await db`drop trigger synthetic_publication_failure on public.dataset_versions`;
        await db`drop function private.synthetic_fail_publication()`;
      }
      expect(
        (
          await db`select publication_status from public.dataset_versions where id = ${result.datasetVersionId}`
        )[0].publication_status,
      ).toBe("in-review");
      expect(
        (
          await db`select publication_status from public.observations where dataset_version_id = ${result.datasetVersionId}`
        )[0].publication_status,
      ).toBe("draft");
    });
    it("rejects changed source redistribution and dataset raw-access restrictions before publication", async () => {
      const result = await ingest(
        bytes,
        manifest(bytes, { transformationVersion: "6.0.0" }),
      );
      await approve(result.datasetVersionId);
      await db`update public.sources set redistribution = 'restricted' where id = 'synthetic-source'`;
      try {
        await expect(
          adapter.publish({ datasetVersionId: result.datasetVersionId }),
        ).rejects.toThrow(/licence|restriction/i);
      } finally {
        await db`update public.sources set redistribution = 'allowed' where id = 'synthetic-source'`;
      }
      await db`update public.datasets set raw_access = 'restricted' where id = 'synthetic-dataset'`;
      try {
        await expect(
          adapter.publish({ datasetVersionId: result.datasetVersionId }),
        ).rejects.toThrow(/restriction/i);
      } finally {
        await db`update public.datasets set raw_access = 'permitted' where id = 'synthetic-dataset'`;
      }
      expect(
        (
          await db`select publication_status from public.observations where dataset_version_id = ${result.datasetVersionId}`
        )[0].publication_status,
      ).toBe("draft");
    });
    it("retains failed audit and no partial writes, then retries as a new attempt", async () => {
      const next = manifest(bytes, {
        sourceVersion: "synthetic-failure",
        transformationVersion: "2.0.0",
      });
      // A real DB constraint failure after the version and first observation were inserted.
      await db`create function private.synthetic_fail_transformation() returns trigger language plpgsql as $$ begin raise exception 'private failure sentinel password=do-not-log'; end; $$`;
      await db`create trigger synthetic_failure before insert on public.observation_transformations for each row execute function private.synthetic_fail_transformation()`;
      try {
        await expect(ingest(bytes, next)).rejects.toThrow(/persistence/i);
      } finally {
        await db`drop trigger synthetic_failure on public.observation_transformations`;
        await db`drop function private.synthetic_fail_transformation()`;
      }
      const failed = (
        await db`select id, status, failure_summary from private.ingestion_runs where pipeline_version = 'recovery-r04' and status = 'failed' order by created_at desc`
      )[0];
      expect(failed).toMatchObject({
        status: "failed",
        failure_summary: "persistence:database-error",
      });
      expect(
        await db`select id from public.dataset_versions where transformation_version = '2.0.0'`,
      ).toHaveLength(0);
      const retry = await ingest(bytes, next);
      expect(retry.runId).not.toBe(failed.id);
      expect(
        (
          await db`select status from private.ingestion_runs where id = ${failed.id}`
        )[0].status,
      ).toBe("failed");
    });
    it("rejects concurrent claim and preserves a single successful version", async () => {
      const next = manifest(bytes, { transformationVersion: "3.0.0" });
      let unblock!: () => void;
      const gate = new Promise<void>((resolve) => {
        unblock = resolve;
      });
      let started!: () => void;
      const ready = new Promise<void>((resolve) => {
        started = resolve;
      });
      const parsers = new ParserRegistry();
      parsers.register({
        id: next.parserId,
        async parse() {
          started();
          await gate;
          return [observation()];
        },
      });
      const first = runIngestion(
        { artifactPath: "synthetic", manifest: next },
        {
          ...adapter.ingestion,
          parsers,
          files: {
            async read() {
              return bytes;
            },
          },
        },
      );
      await ready;
      try {
        await expect(ingest(bytes, next)).rejects.toThrow(/in.progress/i);
      } finally {
        unblock();
      }
      const result = await first;
      expect(await ingest(bytes, next)).toEqual(result);
    });
    it("activates and rolls back using the private function with append-only history", async () => {
      const next = await ingest(
        artifact([
          observation({ value: 2 } as Partial<ReturnType<typeof observation>>),
        ]),
        manifest(
          artifact([
            observation({ value: 2 } as Partial<
              ReturnType<typeof observation>
            >),
          ]),
          {
            sourceVersion: "synthetic-v2",
            transformationVersion: "4.0.0",
            supersedesVersionId: versionId,
          },
        ),
      );
      await approve(next.datasetVersionId);
      await adapter.publish({ datasetVersionId: next.datasetVersionId });
      await db`insert into public.metric_releases (metric_id, availability_status, technology_ids, geography_ids, redistribution_decision, message, publication_status, reviewed_by, reviewed_at, published_at) values (${metric.id}, 'unreviewed', array['synthetic-technology'], array['synthetic-global'], 'allowed', 'Synthetic test release only', 'published', 'synthetic-release-review', now(), now())`;
      await adapter.activate({
        datasetVersionId: versionId,
        metricId: metric.id,
        reason: "Synthetic activation drill",
      });
      await adapter.activate({
        datasetVersionId: next.datasetVersionId,
        metricId: metric.id,
        reason: "Synthetic next version",
      });
      await adapter.rollback({
        datasetVersionId: versionId,
        metricId: metric.id,
        reason: "Synthetic rollback drill",
      });
      expect(
        (
          await db`select active_dataset_version_id, feature_enabled from public.metric_releases where metric_id = ${metric.id}`
        )[0],
      ).toEqual({
        active_dataset_version_id: versionId,
        feature_enabled: false,
      });
      const ops =
        await db`select operation from private.release_operations where metric_id = ${metric.id} order by occurred_at`;
      expect(ops.map((r) => r.operation)).toEqual([
        "activation",
        "activation",
        "rollback",
      ]);
      await expect(
        db`update private.release_operations set reason = 'changed' where metric_id = ${metric.id}`,
      ).rejects.toThrow(/append.only/i);
    });
    it.each(["anon", "authenticated"])(
      "denies private reads and public writes to %s and hides inactive drafts",
      async (role) => {
        await expect(
          db.begin(async (sql) => {
            await sql`select set_config('role', ${role}, true)`;
            await sql`select * from private.dataset_version_reviews`;
          }),
        ).rejects.toThrow(/permission/i);
        await expect(
          db.begin(async (sql) => {
            await sql`select set_config('role', ${role}, true)`;
            await sql`update public.observations set value = 0`;
          }),
        ).rejects.toThrow(/permission/i);
        await db.begin(async (sql) => {
          await sql`select set_config('role', ${role}, true)`;
          expect(
            await sql`select id from public.observations where metric_id = ${metric.id}`,
          ).toHaveLength(0);
        });
      },
    );
    it("records a material correction with chronological provenance and withdraws only inactive versions", async () => {
      const revisedBytes = artifact([
        observation({ value: 3 } as Partial<ReturnType<typeof observation>>),
      ]);
      const revision = {
        materialImpact: "material" as const,
        reason: "Synthetic correction drill",
        decidedOn: "2026-09-01",
        affectedObservationIds: ["synthetic-row"],
      };
      const corrected = await ingest(
        revisedBytes,
        manifest(revisedBytes, {
          transformationVersion: "7.0.0",
          supersedesVersionId: versionId,
          revision,
        }),
      );
      await approve(corrected.datasetVersionId);
      await adapter.publish({ datasetVersionId: corrected.datasetVersionId });
      expect(
        (
          await db`select previous_dataset_version_id, corrected_dataset_version_id, publication_status from public.corrections where corrected_dataset_version_id = ${corrected.datasetVersionId}`
        )[0],
      ).toEqual({
        previous_dataset_version_id: versionId,
        corrected_dataset_version_id: corrected.datasetVersionId,
        publication_status: "published",
      });
      await expect(
        ingest(
          revisedBytes,
          manifest(revisedBytes, {
            transformationVersion: "8.0.0",
            supersedesVersionId: versionId,
            revision: { ...revision, decidedOn: "2026-08-01" },
          }),
        ),
      ).rejects.toThrow();
      await db`update public.metric_releases set feature_enabled = true, availability_status = 'supported', period_start_year = 2025, period_end_year = 2025, typical_mode = 'available', raw_mode = 'available' where metric_id = ${metric.id}`;
      for (const role of ["anon", "authenticated"]) {
        await db.begin(async (sql) => {
          await sql`select set_config('role', ${role}, true)`;
          expect(
            await sql`select value, unit from public.observations where metric_id = ${metric.id}`,
          ).toEqual([{ value: "1000", unit: "MW" }]);
        });
      }
      await expect(
        adapter.withdraw({
          datasetVersionId: versionId,
          reason: "Synthetic active withdrawal",
        }),
      ).rejects.toThrow(/active/i);
      await adapter.withdraw({
        datasetVersionId: corrected.datasetVersionId,
        reason: "Synthetic inactive withdrawal",
      });
      expect(
        (
          await db`select publication_status from public.dataset_versions where id = ${corrected.datasetVersionId}`
        )[0].publication_status,
      ).toBe("withdrawn");
      expect(
        (
          await db`select reason from private.version_withdrawals where dataset_version_id = ${corrected.datasetVersionId}`
        )[0].reason,
      ).toBe("Synthetic inactive withdrawal");
      await expect(
        adapter.publish({ datasetVersionId: corrected.datasetVersionId }),
      ).rejects.toThrow();
      await expect(
        db`update public.dataset_versions set publication_status = 'in-review' where id = ${corrected.datasetVersionId}`,
      ).rejects.toThrow(/terminal/i);
      await db`update public.metric_releases set feature_enabled = false where metric_id = ${metric.id}`;
    });
  },
);
