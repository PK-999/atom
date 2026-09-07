import "server-only";
import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import {
  IngestionManifestSchema,
  type IngestionManifest,
} from "@/data/schemas/ingestion-manifest";
import {
  MetricSchema,
  ObservationSchema,
  type Observation,
} from "@/lib/evidence/schemas";
import type { IngestionResult, IngestionStore } from "./pipeline";
import type {
  PublicationCandidate,
  PublicationStore,
  ReviewDatasetVersionInput,
  ReviewRecord,
  RollbackMetricReleaseInput,
} from "./publication";

type Sql = postgres.Sql;
type Transaction = postgres.TransactionSql;
const identifier = (prefix: string) => `${prefix}-${randomUUID()}`;
const day = (value: string | Date) =>
  typeof value === "string"
    ? value.slice(0, 10)
    : value.toISOString().slice(0, 10);

/** Direct Postgres only: this adapter is never a Data API/browser client. */
export class PostgresEvidenceStore implements IngestionStore, PublicationStore {
  constructor(
    private readonly pool: Sql,
    private readonly tx?: Transaction,
  ) {}
  private get sql(): Sql | Transaction {
    return this.tx ?? this.pool;
  }
  async inTransaction<T>(
    operation: (store: PublicationStore) => Promise<T>,
  ): Promise<T> {
    if (this.tx) return operation(this);
    return this.pool.begin(async (tx) =>
      operation(new PostgresEvidenceStore(this.pool, tx)),
    ) as Promise<T>;
  }
  async claimRun(input: {
    idempotencyKey: string;
    manifestDigest: string;
    manifest: IngestionManifest;
    pipelineVersion: string;
  }) {
    return this.pool.begin(async (sql) => {
      await sql`select pg_advisory_xact_lock(hashtextextended(${input.idempotencyKey}, 0))`;
      const prior =
        await sql`select * from private.ingestion_runs where idempotency_key = ${input.idempotencyKey} order by attempt desc limit 1`;
      const row = prior[0];
      if (row && row.manifest_digest !== input.manifestDigest)
        throw new Error(
          "Manifest identity changed under an existing ingestion key.",
        );
      if (row?.status === "succeeded")
        return { runId: row.id as string, existing: resultFromRow(row) };
      if (row?.status === "running" || row?.status === "pending")
        throw new Error(
          "Ingestion is in-progress for this identity; inspect the existing run before retrying.",
        );
      const runId = identifier("run");
      await sql`insert into private.ingestion_runs (id, idempotency_key, input_checksum, pipeline_version, manifest_digest, attempt, status, started_at) values (${runId}, ${input.idempotencyKey}, ${input.manifest.checksum}, ${input.pipelineVersion}, ${input.manifestDigest}, ${row ? row.attempt + 1 : 1}, 'running', clock_timestamp())`;
      return { runId };
    });
  }
  async recordEvent(runId: string, type: string, summary: string) {
    const sql = this.sql;
    await sql`insert into private.ingestion_events (id, ingestion_run_id, sequence_number, event_type, summary) select ${identifier("event")}, ${runId}, coalesce(max(sequence_number), 0) + 1, ${type}, ${summary} from private.ingestion_events where ingestion_run_id = ${runId}`;
  }
  async failRun(runId: string, category: string) {
    const codes: Record<string, string> = {
      acquisition: "acquisition:artifact-error",
      validation: "validation:invalid-evidence",
      persistence: "persistence:database-error",
    };
    await this
      .pool`update private.ingestion_runs set status = 'failed', completed_at = clock_timestamp(), failure_summary = ${codes[category] ?? "validation:invalid-evidence"} where id = ${runId} and status = 'running'`;
  }
  async getMetricDefinition(metricId: string) {
    const sql = this.sql;
    const rows =
      await sql`select * from public.metrics where id = ${metricId} and publication_status <> 'withdrawn'`;
    return rows[0] ? metricFromRow(rows[0]) : null;
  }
  async validateManifest(manifest: IngestionManifest) {
    const sql = this.sql;
    const rows =
      await sql`select to_jsonb(d) as dataset, to_jsonb(s) as source from public.datasets d join public.sources s on s.id = d.source_id where d.id = ${manifest.datasetId}`;
    const row = rows[0];
    if (!row || row.source.id !== manifest.sourceId)
      throw new Error("Manifest dataset/source relationship mismatch.");
    for (const entity of [row.source, row.dataset]) {
      if (
        entity.publication_status === "withdrawn" ||
        entity.licence_id !== manifest.licence.id ||
        entity.licence_name !== manifest.licence.name ||
        (entity.licence_url ?? undefined) !== manifest.licence.url ||
        entity.redistribution !== manifest.redistribution
      )
        throw new Error("Manifest licence/status binding mismatch.");
    }
    if (
      row.source.url !== manifest.sourceUrl ||
      row.source.source_tier !== manifest.sourceTier ||
      row.source.conflict_disclosure !== manifest.conflictDisclosure ||
      day(row.source.accessed_on) !== manifest.accessDate
    )
      throw new Error("Manifest source metadata binding mismatch.");
    if (
      manifest.redistribution !== manifest.licence.redistribution ||
      (row.dataset.raw_access === "permitted" &&
        manifest.redistribution !== "allowed")
    )
      throw new Error("Manifest redistribution restriction mismatch.");
  }
  async persistDraft(input: {
    runId: string;
    manifest: IngestionManifest;
    manifestDigest: string;
    observations: readonly Observation[];
    sourceObservations: readonly Observation[];
  }): Promise<IngestionResult> {
    return this.pool.begin(async (sql) => {
      const store = new PostgresEvidenceStore(this.pool, sql);
      await sql`select id from private.ingestion_runs where id = ${input.runId} and status = 'running' for update`;
      await store.validateManifest(input.manifest);
      const versionId = identifier("version");
      const m = input.manifest;
      if (m.supersedesVersionId) {
        const prior =
          await sql`select id from public.dataset_versions where id = ${m.supersedesVersionId} and dataset_id = ${m.datasetId} and acquired_on <= ${m.accessDate} and publication_status = 'published'`;
        if (!prior.length)
          throw new Error(
            "Supersession requires a published version of the same dataset.",
          );
      }
      await sql`insert into public.dataset_versions (id, dataset_id, checksum_algorithm, checksum_digest, acquired_on, transformation_version, source_version, supersedes_version_id) values (${versionId}, ${m.datasetId}, 'sha256', ${m.checksum}, ${m.accessDate}, ${m.transformationVersion}, ${m.sourceVersion}, ${m.supersedesVersionId ?? null})`;
      await sql`insert into private.version_artifacts (dataset_version_id, manifest, manifest_digest, artifact_checksum) values (${versionId}, ${sql.json(JSON.parse(JSON.stringify(m)))}, ${input.manifestDigest}, ${m.checksum})`;
      for (const record of input.observations) {
        const original = input.sourceObservations.find(
          (source) => source.id === record.id,
        );
        if (!original)
          throw new Error("Source observation missing from normalized result.");
        const row = ObservationSchema.parse({
          ...record,
          id: `${versionId}-${record.id}`,
        });
        const range =
          row.kind === "numeric" && row.valueSemantics === "range"
            ? row.range
            : null;
        await sql`insert into public.observations ${sql({
          id: row.id,
          dataset_version_id: versionId,
          metric_id: row.metricId,
          technology_id: row.technologyId,
          geography_id: row.geographyId,
          study_id: row.studyId,
          source_id: row.sourceId,
          value_kind: row.kind,
          value_semantics: row.valueSemantics,
          unit: row.kind === "numeric" ? row.unit : null,
          value:
            row.kind === "numeric" && row.valueSemantics === "point"
              ? row.value
              : null,
          lower_value: range?.lower ?? null,
          representative_value: range?.representative ?? null,
          upper_value: range?.upper ?? null,
          range_kind: range
            ? range.kind === "min-max"
              ? "min-max"
              : range.intervalType
            : null,
          interval_level:
            range?.kind === "interval" ? (range.level ?? null) : null,
          source_range_label:
            range?.kind === "interval" ? (range.sourceLabel ?? null) : null,
          category_value: row.kind === "categorical" ? row.value : null,
          category_definition:
            row.kind === "categorical" ? row.categoryDefinition : null,
          representative_kind: row.representativeKind,
          methodology: row.methodology,
          system_boundary: row.systemBoundary,
          period_start_year: row.period.startYear,
          period_end_year: row.period.endYear,
          uncertainty: row.uncertainty,
          last_verified_on: row.lastVerifiedAt,
          raw_access: row.rawAccess,
          redistribution: row.license.redistribution,
        })}`;
        await sql`insert into private.ingestion_observations (observation_id, payload) values (${row.id}, ${sql.json(JSON.parse(JSON.stringify(row)))})`;
        for (const [index, step] of row.transformation.entries()) {
          const normalizedStep = index >= original.transformation.length;
          const inputUnit =
            original.kind === "numeric" &&
            (normalizedStep || step.kind === "identity")
              ? original.unit
              : null;
          const outputUnit =
            normalizedStep && row.kind === "numeric" ? row.unit : inputUnit;
          await sql`insert into public.observation_transformations (id, observation_id, step_order, operation_name, input_unit, output_unit, parameters, software_version, explanatory_note) values (${identifier("transform")}, ${row.id}, ${index + 1}, ${step.kind}, ${inputUnit}, ${outputUnit}, ${sql.json({ sourceRecordId: record.id, artifactChecksum: m.checksum })}, ${m.transformationVersion}, ${step.description})`;
        }
        if (m.revision?.affectedObservationIds.includes(record.id)) {
          await sql`insert into public.corrections (id, observation_id, previous_dataset_version_id, corrected_dataset_version_id, reason, material_impact, decided_on) values (${identifier("correction")}, ${row.id}, ${m.supersedesVersionId!}, ${versionId}, ${m.revision.reason}, ${m.revision.materialImpact}, ${m.revision.decidedOn})`;
        }
      }
      const rows =
        await sql`update private.ingestion_runs set dataset_version_id = ${versionId}, status = 'succeeded', completed_at = clock_timestamp(), source_record_count = ${input.observations.length}, accepted_record_count = ${input.observations.length} where id = ${input.runId} returning *`;
      return resultFromRow(rows[0]);
    });
  }
  private async lockVersion(id: string) {
    if (!this.tx)
      throw new Error("Publication operations require a transaction.");
    const rows = await this
      .tx`select * from public.dataset_versions where id = ${id} for update`;
    if (
      !rows[0] ||
      !["draft", "in-review"].includes(rows[0].publication_status)
    )
      throw new Error("A draft or in-review dataset version is required.");
    return rows[0];
  }
  async recordReview(input: ReviewDatasetVersionInput): Promise<ReviewRecord> {
    const version = await this.lockVersion(input.datasetVersionId);
    const sql = this.sql;
    if (
      !/^[a-f0-9]{64}$/.test(input.artifactChecksum) ||
      !/^[a-f0-9]{64}$/.test(input.manifestDigest)
    )
      throw new Error("Artifact and manifest digest are required.");
    const rows =
      await sql`insert into private.dataset_version_reviews (id, dataset_version_id, review_role, reviewer_id, artifact_checksum, manifest_digest, reviewed_at) values (${identifier("review")}, ${version.id}, ${input.role}, ${input.reviewerId.trim()}, ${input.artifactChecksum}, ${input.manifestDigest}, clock_timestamp()) returning *`;
    await sql`update public.dataset_versions set publication_status = 'in-review' where id = ${version.id}`;
    return reviewFromRow(rows[0]);
  }
  async listReviews(id: string): Promise<readonly ReviewRecord[]> {
    await this.lockVersion(id);
    const sql = this.sql;
    return (
      await sql`select * from private.dataset_version_reviews where dataset_version_id = ${id} order by review_role`
    ).map(reviewFromRow);
  }
  async getPublicationCandidates(
    id: string,
  ): Promise<readonly PublicationCandidate[]> {
    const version = await this.lockVersion(id);
    const sql = this.sql;
    const [artifact] =
      await sql`select * from private.version_artifacts where dataset_version_id = ${id}`;
    if (!artifact)
      throw new Error("An ingested manifest is required for publication.");
    const manifest = IngestionManifestSchema.parse(artifact.manifest);
    await this.validateManifest(manifest);
    const reviews = await this.listReviews(id);
    if (
      reviews.some(
        (r) =>
          r.artifactChecksum !== artifact.artifact_checksum ||
          r.manifestDigest !== artifact.manifest_digest,
      )
    )
      throw new Error("Stale artifact review.");
    const rows =
      await sql`select p.payload, to_jsonb(o) as observation, to_jsonb(d) as dataset, to_jsonb(s) as source, to_jsonb(st) as study, to_jsonb(t) as technology, to_jsonb(g) as geography, to_jsonb(m) as metric from public.observations o join private.ingestion_observations p on p.observation_id = o.id join public.datasets d on d.id = ${version.dataset_id} join public.sources s on s.id = o.source_id join public.studies st on st.id = o.study_id join public.technologies t on t.id = o.technology_id join public.geographies g on g.id = o.geography_id join public.metrics m on m.id = o.metric_id where o.dataset_version_id = ${id} for share of d,s,st,t,g,m`;
    const count =
      await sql`select count(*) from public.observations where dataset_version_id = ${id}`;
    if (Number(count[0].count) !== rows.length)
      throw new Error("Unbound observations in dataset version.");
    const reviewedAt = reviews
      .map((r) => r.reviewedAt)
      .sort()
      .at(-1);
    if (!reviewedAt) throw new Error("Reviews are required.");
    const publishedAt = day(new Date());
    const lastVerifiedAt =
      rows
        .map((r) => day(r.observation.last_verified_on))
        .sort()
        .at(-1) ?? manifest.accessDate;
    const corrections =
      await sql`select * from public.corrections where corrected_dataset_version_id = ${id}`;
    return rows.map((row) => {
      if (row.dataset.raw_access !== "permitted")
        throw new Error("Dataset raw-access restriction blocks publication.");
      for (const parent of [
        row.dataset,
        row.source,
        row.study,
        row.technology,
        row.geography,
        row.metric,
      ]) {
        if (parent.publication_status !== "published")
          throw new Error(
            "Parent evidence must be separately reviewed and published.",
          );
      }
      const observation = ObservationSchema.parse({
        ...row.payload,
        publicationStatus: row.observation.publication_status,
      });
      return {
        observation,
        context: {
          ...(manifest.revision?.materialImpact === "material" &&
          manifest.revision.affectedObservationIds.some(
            (sourceId) => observation.id === `${id}-${sourceId}`,
          )
            ? { materialRevisionFrom: manifest.supersedesVersionId }
            : {}),
          corrections: corrections.map((c) => ({
            id: c.id,
            affectedEntityId: c.observation_id,
            affectedEntityType: "observation" as const,
            correctedAt: day(c.decided_on),
            correctedVersion: c.corrected_dataset_version_id,
            priorVersion: c.previous_dataset_version_id,
            materialImpact: c.material_impact,
            reason: c.reason,
          })),
          dataset: {
            id: version.dataset_id,
            title: row.dataset.title,
            version: id,
            checksum: version.checksum_digest,
            lastVerifiedAt,
            license: manifest.licence,
            sourceIds: [row.dataset.source_id],
            studyIds: [...new Set(rows.map((r) => r.study.id as string))],
          },
          source: {
            id: row.source.id,
            accessedAt: day(row.source.accessed_on),
            publishedAt: day(row.source.published_on),
            conflictDisclosure: row.source.conflict_disclosure,
            license: {
              id: row.source.licence_id,
              name: row.source.licence_name,
              redistribution: row.source.redistribution,
              ...(row.source.licence_url
                ? { url: row.source.licence_url }
                : {}),
            },
            publisher: row.source.publisher,
            sourceTier: row.source.source_tier,
            title: row.source.title,
            url: row.source.url,
          },
          study: {
            id: row.study.id,
            title: row.study.title,
            sourceIds: [row.study.source_id],
            methodology: row.study.methodology,
            systemBoundary: row.study.system_boundary,
            period: {
              startYear: row.study.period_start_year,
              endYear: row.study.period_end_year,
            },
          },
          metric: metricFromRow(row.metric),
          geography: {
            id: row.geography.id,
            name: row.geography.name,
            scope: row.geography.scope,
          },
          technology: {
            id: row.technology.id,
            name: row.technology.name,
            description: row.technology.description,
            ...(row.technology.variant
              ? { variant: row.technology.variant }
              : {}),
          },
          publication: {
            id: `${observation.id}-publication`,
            entityId: observation.id,
            entityType: "observation" as const,
            datasetVersion: id,
            reviewedAt: day(reviewedAt),
            reviewedBy: reviews.map((r) => r.reviewerId).join(", "),
            publishedAt,
            status: "in-review" as const,
          },
        },
      };
    });
  }
  async publishDraftVersion(id: string) {
    await this.lockVersion(id);
    const sql = this.sql;
    // Preserve Postgres microseconds; a JS Date round trip truncates them and can
    // make publication metadata appear to precede the actual review.
    const [reviews] =
      await sql`select max(reviewed_at)::text as reviewed_at, string_agg(reviewer_id, ', ' order by review_role) as reviewed_by from private.dataset_version_reviews where dataset_version_id = ${id}`;
    await sql`update public.observations set publication_status = 'in-review' where dataset_version_id = ${id} and publication_status = 'draft'`;
    await sql`update public.dataset_versions set publication_status = 'in-review' where id = ${id} and publication_status = 'draft'`;
    await sql`update public.observations set publication_status = 'published', reviewed_by = ${reviews.reviewed_by}, reviewed_at = ${reviews.reviewed_at}::text::timestamptz, published_at = clock_timestamp() where dataset_version_id = ${id}`;
    await sql`update public.corrections set publication_status = 'in-review' where corrected_dataset_version_id = ${id} and publication_status = 'draft'`;
    await sql`update public.corrections set publication_status = 'published', reviewed_by = ${reviews.reviewed_by}, reviewed_at = ${reviews.reviewed_at}::text::timestamptz, published_at = clock_timestamp() where corrected_dataset_version_id = ${id}`;
    await sql`update public.dataset_versions set publication_status = 'published', reviewed_by = ${reviews.reviewed_by}, reviewed_at = ${reviews.reviewed_at}::text::timestamptz, published_at = clock_timestamp() where id = ${id}`;
  }
  async recordLifecycleEvent(id: string, type: "review" | "publication") {
    const sql = this.sql;
    const [run] =
      await sql`select id from private.ingestion_runs where dataset_version_id = ${id} and status = 'succeeded'`;
    if (!run) throw new Error("Ingestion run not found.");
    await this.recordEvent(run.id, type, `Dataset version ${type} recorded.`);
  }
  async activateMetricRelease(input: RollbackMetricReleaseInput) {
    if (!this.tx) throw new Error("Activation requires a transaction.");
    await this.tx`set local role service_role`;
    await this
      .tx`select private.activate_metric_release(${input.metricId}, ${input.datasetVersionId}, ${input.reason})`;
    await this.tx`reset role`;
    return {
      datasetVersionId: input.datasetVersionId,
      metricId: input.metricId,
      status: "activated" as const,
    };
  }
  async withdrawVersion(input: { datasetVersionId: string; reason: string }) {
    if (!input.reason.trim()) throw new Error("Withdrawal reason is required.");
    return this.pool.begin(async (sql) => {
      const rows =
        await sql`update public.dataset_versions set publication_status = 'withdrawn' where id = ${input.datasetVersionId} and publication_status = 'published' returning id`;
      if (!rows.length)
        throw new Error("Withdrawal requires a published version.");
      await sql`insert into private.version_withdrawals (id, dataset_version_id, reason, initiated_by) values (${identifier("withdrawal")}, ${input.datasetVersionId}, ${input.reason}, session_user)`;
      return {
        datasetVersionId: input.datasetVersionId,
        status: "withdrawn" as const,
      };
    });
  }
}

function metricFromRow(row: postgres.Row) {
  return MetricSchema.parse({
    id: row.id,
    category: row.registry_category,
    definition: row.definition,
    geographySupport: row.geography_support,
    valueKind: row.value_kind,
    rangeSemantics: row.range_semantics,
    ...(row.value_kind === "numeric"
      ? {
          canonicalUnit: row.canonical_unit,
          supportedUnits: row.supported_units,
        }
      : {}),
  });
}
function resultFromRow(row: postgres.Row): IngestionResult {
  return {
    runId: row.id,
    datasetVersionId: row.dataset_version_id,
    checksum: row.input_checksum,
    status: "succeeded",
    acceptedRecordCount: Number(row.accepted_record_count),
    rejectedRecordCount: Number(row.rejected_record_count),
    sourceRecordCount: Number(row.source_record_count),
  };
}
function reviewFromRow(row: postgres.Row): ReviewRecord {
  return {
    id: row.id,
    datasetVersionId: row.dataset_version_id,
    reviewerId: row.reviewer_id,
    role: row.review_role,
    status: "approved",
    artifactChecksum: row.artifact_checksum,
    manifestDigest: row.manifest_digest,
    reviewedAt: new Date(row.reviewed_at).toISOString(),
  };
}
