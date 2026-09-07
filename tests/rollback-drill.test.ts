// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";
import { getSupabaseServerConfig } from "@/lib/supabase/server-config";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createEvidenceCliDependencies } from "@/scripts/evidence/server-adapter";
import { SupabaseEvidenceRepository } from "@/lib/supabase/published-evidence-repository";
import {
  artifact,
  license,
  manifest,
  observation,
} from "@/data/ingestion/test-fixtures";
import { runIngestion } from "@/data/ingestion/pipeline";

const url =
  process.env.ATOM_TEST_DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
const config = getSupabaseServerConfig({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
});

describe.skipIf(!url || !config)(
  "Metric release rollback and version activation drill",
  () => {
    const db = postgres(url ?? "postgres://localhost/unused", { max: 2 });
    let adapter: Awaited<ReturnType<typeof createEvidenceCliDependencies>>;
    let repo: SupabaseEvidenceRepository;

    const runSuffix = Math.random().toString(36).slice(2, 8);
    const testMetricId = `rollback-metric-${runSuffix}`;
    const testDatasetId = `rollback-dataset-${runSuffix}`;
    const testSourceId = `rollback-source-${runSuffix}`;
    const testStudyId = `rollback-study-${runSuffix}`;
    const testTechId = `rollback-tech-${runSuffix}`;

    beforeAll(async () => {
      adapter = await createEvidenceCliDependencies({
        SUPABASE_DATABASE_URL: url,
      });
      const client = createSupabaseServerClient(config!);
      repo = new SupabaseEvidenceRepository(client);

      const metadata = {
        publication_status: "published",
        reviewed_by: "synthetic-parent-review",
        reviewed_at: "2026-09-01T00:00:00Z",
        published_at: "2026-09-01T00:00:00Z",
      };

      // Ensure prerequisite records exist
      await db`insert into public.technologies ${db({
        id: testTechId,
        name: "Rollback Drill Tech",
        description: "Fixture for rollback drill",
        lifecycle_status: "active",
        ...metadata,
      })} on conflict (id) do nothing`;

      await db`insert into public.geographies ${db({
        id: "synthetic-global",
        name: "Global",
        scope: "global",
        ...metadata,
      })} on conflict (id) do nothing`;

      await db`insert into public.metrics ${db({
        id: testMetricId,
        canonical_unit: "MW",
        supported_units: ["MW", "GW"],
        value_kind: "numeric",
        range_semantics: "point-or-range",
        representative_rule: "source-observation",
        geography_support: ["global"],
        definition: "Rollback drill metric.",
        explanation_content: "Synthetic only",
        registry_category: "technical",
        ...metadata,
      })} on conflict (id) do nothing`;

      await db`insert into public.sources ${db({
        id: testSourceId,
        source_tier: "A",
        title: "Rollback source",
        publisher: "Rollback Institute",
        url: "https://example.invalid/rollback",
        conflict_disclosure: "Rollback drill only.",
        licence_id: license.id,
        licence_name: license.name,
        redistribution: "allowed",
        published_on: "2026-08-01",
        accessed_on: "2026-09-01",
        last_verified_on: "2026-09-01",
        ...metadata,
      })} on conflict (id) do nothing`;

      await db`insert into public.studies ${db({
        id: testStudyId,
        source_id: testSourceId,
        title: "Rollback study",
        methodology: "Synthetic method.",
        system_boundary: "Synthetic boundary.",
        period_start_year: 2025,
        period_end_year: 2025,
        publication_label: "rollback-v1",
        ...metadata,
      })} on conflict (id) do nothing`;

      await db`insert into public.datasets ${db({
        id: testDatasetId,
        source_id: testSourceId,
        title: "Rollback dataset",
        publisher: "Rollback Institute",
        licence_id: license.id,
        licence_name: license.name,
        redistribution: "allowed",
        raw_access: "permitted",
        ...metadata,
      })} on conflict (id) do nothing`;

      for (const role of ["scientific", "editorial", "licensing"]) {
        await db`insert into private.evidence_reviewers (id, identity_reference, display_name, approved_roles)
        values (${`synthetic-${role}`}, ${`https://example.invalid/synthetic-reviewer/${role}`}, ${`Synthetic ${role} reviewer`}, array['scientific', 'editorial', 'licensing'])
        on conflict (id) do nothing`;
      }

      await db`insert into public.metric_releases (
      metric_id, availability_status, technology_ids, geography_ids, redistribution_decision,
      message, publication_status, feature_enabled, reviewed_by, reviewed_at, published_at
    ) values (
      ${testMetricId}, 'unreviewed', array[${testTechId}], array['synthetic-global'], 'allowed',
      'Rollback drill release', 'published', false, 'synthetic-release-review', now(), now()
    ) on conflict (metric_id) do nothing`;
    });

    afterAll(async () => {
      await adapter?.close();
      await db.end();
    });

    async function ingestAndPublishVersion(
      versionLabel: string,
      value: number,
    ): Promise<string> {
      const obs = observation({
        id: `obs-${runSuffix}-${versionLabel}`,
        metricId: testMetricId,
        datasetId: testDatasetId,
        sourceId: testSourceId,
        studyId: testStudyId,
        technologyId: testTechId,
        value,
      });
      const bytes = artifact([obs]);
      const m = manifest(bytes, {
        datasetId: testDatasetId,
        sourceId: testSourceId,
        sourceVersion: versionLabel,
        sourceUrl: "https://example.invalid/rollback",
        conflictDisclosure: "Rollback drill only.",
        canonicalUnits: { [testMetricId]: "MW" },
      });

      const ingestionResult = await runIngestion(
        { artifactPath: "synthetic-only", manifest: m },
        {
          ...adapter.ingestion,
          files: {
            async read() {
              return bytes;
            },
          },
        },
      );

      // Approve through all 3 required gates
      for (const role of ["scientific", "editorial", "licensing"] as const) {
        await adapter.review({
          datasetVersionId: ingestionResult.datasetVersionId,
          role,
          reviewerId: `synthetic-${role}`,
          artifactChecksum: (
            await db`select checksum_digest from public.dataset_versions where id = ${ingestionResult.datasetVersionId}`
          )[0].checksum_digest,
          manifestDigest: (
            await db`select manifest_digest from private.version_artifacts where dataset_version_id = ${ingestionResult.datasetVersionId}`
          )[0].manifest_digest,
        });
      }

      // Publish
      await adapter.publish({
        datasetVersionId: ingestionResult.datasetVersionId,
      });

      return ingestionResult.datasetVersionId;
    }

    it("drills activation and rollback while preserving observations and logging audit operations", async () => {
      // 1. Ingest & publish V1 (value = 100)
      const v1Id = await ingestAndPublishVersion("v1", 100);
      await adapter.activate({
        datasetVersionId: v1Id,
        metricId: testMetricId,
        reason: "Initial activation of V1",
      });

      // Enable feature and set availability now that an active dataset version exists
      await db`update public.metric_releases set
      feature_enabled = true,
      availability_status = 'supported',
      period_start_year = 2025,
      period_end_year = 2025,
      typical_mode = 'available',
      raw_mode = 'available'
    where metric_id = ${testMetricId}`;

      // 2. Ingest & publish V2 (value = 200)
      const v2Id = await ingestAndPublishVersion("v2", 200);
      await adapter.activate({
        datasetVersionId: v2Id,
        metricId: testMetricId,
        reason: "Activation of V2",
      });

      // Verify V2 is currently the active release pointer
      const activeReleaseV2 = await db`
      select active_dataset_version_id, feature_enabled
      from public.metric_releases
      where metric_id = ${testMetricId}
    `;
      expect(activeReleaseV2[0].active_dataset_version_id).toBe(v2Id);

      // Query through repository - should observe V2
      const comparisonBefore = await repo.getPublishedObservations({
        metricId: testMetricId,
        technologyIds: [testTechId],
      });
      expect(comparisonBefore).toHaveLength(1);
      expect(comparisonBefore[0].value).toBe(200000); // 200 GW normalized to MW

      // 3. Roll back to V1
      await adapter.rollback({
        datasetVersionId: v1Id,
        metricId: testMetricId,
        reason:
          "Methodology anomaly detected in V2; reverting to reviewed V1 baseline",
      });

      // 4. Assert active pointer changed back to V1
      const activeReleaseAfter = await db`
      select active_dataset_version_id, feature_enabled
      from public.metric_releases
      where metric_id = ${testMetricId}
    `;
      expect(activeReleaseAfter[0].active_dataset_version_id).toBe(v1Id);

      // 5. Assert all observations and dataset versions are PRESERVED (no deletion)
      const versions = await db`
      select id from public.dataset_versions where dataset_id = ${testDatasetId}
    `;
      expect(versions.map((v) => v.id)).toContain(v1Id);
      expect(versions.map((v) => v.id)).toContain(v2Id);

      const obsCount = await db`
      select count(*) as total from public.observations
      where dataset_version_id in (${v1Id}, ${v2Id})
    `;
      expect(Number(obsCount[0].total)).toBe(2);

      // 6. Assert audit operation was appended with 'rollback'
      const auditOps = await db`
      select operation, reason, target_dataset_version_id
      from private.release_operations
      where metric_id = ${testMetricId}
      order by occurred_at desc
      limit 1
    `;
      expect(auditOps[0].operation).toBe("rollback");
      expect(auditOps[0].target_dataset_version_id).toBe(v1Id);
      expect(auditOps[0].reason).toContain(
        "Methodology anomaly detected in V2",
      );

      // 7. Assert public repository queries now serve V1 data (cache invalidation by version)
      const comparisonAfter = await repo.getPublishedObservations({
        metricId: testMetricId,
        technologyIds: [testTechId],
      });
      expect(comparisonAfter).toHaveLength(1);
      expect(comparisonAfter[0].value).toBe(100000); // 100 GW normalized to MW
    });
  },
);
