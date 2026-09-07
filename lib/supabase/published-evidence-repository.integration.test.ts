import { beforeAll, describe, expect, it } from "vitest";

import {
  createEvidenceRepositoryContractSnapshot,
  runEvidenceRepositoryContract,
} from "@/lib/evidence/repository-contract";
import { getSupabaseServerConfig } from "@/lib/supabase/server-config";
import { SupabaseEvidenceRepository } from "./published-evidence-repository";
import { createSupabaseServerClient } from "./server-client";

const config = getSupabaseServerConfig({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
});
const requiresSupabaseIntegration =
  process.env.ATOM_REQUIRE_SUPABASE_INTEGRATION === "1";
if (!config && requiresSupabaseIntegration) {
  throw new Error(
    "Supabase integration is required; set SUPABASE_URL and SUPABASE_SECRET_KEY.",
  );
}
const runId = Math.random().toString(36).slice(2, 8);
const fixturePrefix = `repofix-${runId}-`;
const fixtureId = (name: string) => `${fixturePrefix}${name}`;
const integrationSnapshot = remapFixtureIds(
  createEvidenceRepositoryContractSnapshot(),
  fixturePrefix,
);

describe("SupabaseEvidenceRepository integration", () => {
  if (!config) {
    it.skip("requires a local server-only Supabase configuration", () => {});
    return;
  }

  const client = createSupabaseServerClient(config!);
  const repository = new SupabaseEvidenceRepository(client);

  beforeAll(async () => {
    await seedSyntheticEvidence();
  });

  runEvidenceRepositoryContract(
    () => repository,
    () => integrationSnapshot,
  );

  it("does not expose releases backed by unpublished metrics or dataset versions", async () => {
    const releases = await repository.listMetricReleases();
    expect(releases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ metricId: fixtureId("metric") }),
        expect.objectContaining({ metricId: fixtureId("metric-2") }),
      ]),
    );
    expect(releases.some((r) => r.metricId === fixtureId("draft-metric"))).toBe(
      false,
    );
    expect(
      releases.some((r) => r.metricId === fixtureId("draft-version-metric")),
    ).toBe(false);
    await expect(
      repository.getMetricDefinition(fixtureId("draft-metric")),
    ).resolves.toBeNull();
    await expect(
      repository.getMetricDefinition(fixtureId("draft-version-metric")),
    ).resolves.toBeNull();
  });

  it("maps a published observation to its logical dataset identifier", async () => {
    const observations = await repository.getPublishedObservations({
      metricId: fixtureId("metric"),
    });

    expect(observations[0]?.datasetId).toBe(fixtureId("dataset"));
  });

  async function seedSyntheticEvidence(): Promise<void> {
    const snapshot = integrationSnapshot;
    const publishableObservationIds = snapshot.observations
      .filter((observation) => observation.publicationStatus === "published")
      .map((observation) => observation.id);
    // Test-only fixture setup follows the publication lifecycle. The product seed
    // remains intentionally empty of scientific observations.
    await client
      .from("technologies")
      .insert(
        snapshot.technologies.map((technology) => ({
          ...technology,
          lifecycle_status: "active",
          publication_status: "published",
          published_at: "2026-09-01T00:00:00Z",
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
        })),
      )
      .throwOnError();
    await client
      .from("geographies")
      .insert(
        snapshot.geographies.map((geography) => ({
          ...geography,
          publication_status: "published",
          published_at: "2026-09-01T00:00:00Z",
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
        })),
      )
      .throwOnError();
    await client
      .from("metrics")
      .insert([
        ...snapshot.metrics.map((metric) => ({
          canonical_unit: metric.canonicalUnit,
          definition: metric.definition,
          explanation_content: "Synthetic repository-contract explanation.",
          geography_support: [...metric.geographySupport],
          id: metric.id,
          publication_status:
            metric.id === fixtureId("draft-metric")
              ? ("draft" as const)
              : ("published" as const),
          published_at: "2026-09-01T00:00:00Z",
          range_semantics: metric.rangeSemantics,
          registry_category: metric.category,
          representative_rule: "source-observation",
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
          supported_units: metric.supportedUnits
            ? [...metric.supportedUnits]
            : null,
          value_kind: metric.valueKind,
        })),
        {
          canonical_unit: "MW",
          definition:
            "A synthetic metric whose active dataset version is still draft.",
          explanation_content: "Synthetic repository-contract explanation.",
          geography_support: ["global"],
          id: fixtureId("draft-version-metric"),
          publication_status: "published",
          published_at: "2026-09-01T00:00:00Z",
          range_semantics: "point",
          registry_category: "fixture-category",
          representative_rule: "source-observation",
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
          supported_units: ["MW"],
          value_kind: "numeric",
        },
      ])
      .throwOnError();
    await client
      .from("sources")
      .insert({
        accessed_on: "2026-09-01",
        conflict_disclosure: "No synthetic fixture conflict.",
        id: fixtureId("source"),
        last_verified_on: "2026-09-01",
        licence_name: "Synthetic fixture license",
        licence_url: "https://example.com/license",
        publication_status: "published",
        published_at: "2026-09-01T00:00:00Z",
        published_on: "2020-01-01",
        publisher: "Fixture institution",
        redistribution: "allowed",
        reviewed_at: "2026-08-31T00:00:00Z",
        reviewed_by: "fixture-reviewer",
        source_tier: "A",
        title: "Synthetic repository-contract source",
        url: "https://example.com/source",
      })
      .throwOnError();
    await client
      .from("studies")
      .insert({
        id: fixtureId("study"),
        methodology: "Synthetic repository-contract methodology.",
        period_end_year: 2025,
        period_start_year: 2020,
        publication_label: "Synthetic fixture study",
        publication_status: "published",
        published_at: "2026-09-01T00:00:00Z",
        reviewed_at: "2026-08-31T00:00:00Z",
        reviewed_by: "fixture-reviewer",
        source_id: fixtureId("source"),
        system_boundary: "Synthetic repository-contract boundary.",
        title: "Synthetic repository-contract study",
      })
      .throwOnError();
    await client
      .from("datasets")
      .insert({
        id: fixtureId("dataset"),
        licence_name: "Synthetic fixture license",
        licence_url: "https://example.com/license",
        publication_status: "published",
        published_at: "2026-09-01T00:00:00Z",
        publisher: "Fixture institution",
        raw_access: "permitted",
        redistribution: "allowed",
        reviewed_at: "2026-08-31T00:00:00Z",
        reviewed_by: "fixture-reviewer",
        source_id: fixtureId("source"),
        title: "Synthetic repository-contract dataset",
      })
      .throwOnError();
    await client
      .from("dataset_versions")
      .insert([
        {
          acquired_on: "2026-09-01",
          checksum_algorithm: "sha256",
          checksum_digest: "a".repeat(64),
          dataset_id: fixtureId("dataset"),
          id: fixtureId("version-active"),
          transformation_version: "1.0.0",
        },
        {
          acquired_on: "2026-09-01",
          checksum_algorithm: "sha256",
          checksum_digest: "b".repeat(64),
          dataset_id: fixtureId("dataset"),
          id: fixtureId("version-inactive"),
          transformation_version: "1.0.0",
        },
      ])
      .throwOnError();
    await client
      .from("observations")
      .insert(
        snapshot.observations.map((observation) => ({
          dataset_version_id:
            snapshot.observationDatasetVersionIds?.[observation.id] ??
            observation.datasetId,
          geography_id: observation.geographyId,
          id: observation.id,
          last_verified_on: observation.lastVerifiedAt,
          methodology: observation.methodology,
          metric_id: observation.metricId,
          period_end_year:
            observation.id === fixtureId("observation-draft")
              ? observation.period.endYear - 1
              : observation.period.endYear,
          period_start_year: observation.period.startYear,
          raw_access: observation.rawAccess,
          redistribution: observation.license.redistribution,
          representative_kind: observation.representativeKind,
          source_id: observation.sourceId,
          study_id: observation.studyId,
          system_boundary: observation.systemBoundary,
          technology_id: observation.technologyId,
          uncertainty: observation.uncertainty,
          unit: observation.kind === "numeric" ? observation.unit : null,
          value:
            observation.kind === "numeric" &&
            observation.valueSemantics === "point"
              ? observation.value
              : null,
          value_kind: observation.kind,
          value_semantics: observation.valueSemantics,
        })),
      )
      .throwOnError();
    await client
      .from("observation_transformations")
      .insert(
        snapshot.observations.map((observation) => ({
          explanatory_note: observation.transformation[0].description,
          id: `${observation.id}-transformation`,
          observation_id: observation.id,
          operation_name: observation.transformation[0].kind,
          software_version: "1.0.0",
          step_order: 1,
        })),
      )
      .throwOnError();
    await client
      .from("observations")
      .update({
        publication_status: "in-review",
      })
      .in("id", publishableObservationIds)
      .throwOnError();
    await client
      .from("observations")
      .update({
        publication_status: "published",
        published_at: "2026-09-01T00:00:00Z",
        reviewed_at: "2026-08-31T00:00:00Z",
        reviewed_by: "fixture-reviewer",
      })
      .in("id", publishableObservationIds)
      .throwOnError();
    await client
      .from("dataset_versions")
      .update({ publication_status: "in-review" })
      .eq("id", fixtureId("version-active"))
      .throwOnError();
    await client
      .from("dataset_versions")
      .update({
        publication_status: "published",
        published_at: "2026-09-01T00:00:00Z",
        reviewed_at: "2026-08-31T00:00:00Z",
        reviewed_by: "fixture-reviewer",
      })
      .eq("id", fixtureId("version-active"))
      .throwOnError();
    await client
      .from("metric_releases")
      .insert([
        ...snapshot.metricReleases.map((release) => ({
          active_dataset_version_id: release.activeDatasetVersionId,
          availability_status: release.availabilityStatus,
          feature_enabled: release.featureEnabled,
          geography_ids: [...release.geographyIds],
          message: `Synthetic ${release.metricId} release.`,
          metric_id: release.metricId,
          period_end_year: 2025,
          period_start_year: 2020,
          publication_status: release.publicationStatus,
          published_at: "2026-09-01T00:00:00Z",
          range_mode: "available" as const,
          raw_mode: "available" as const,
          redistribution_decision: "allowed" as const,
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
          technology_ids: [...release.technologyIds],
          typical_mode: "available" as const,
        })),
        {
          active_dataset_version_id: fixtureId("version-active"),
          availability_status: "supported",
          feature_enabled: true,
          geography_ids: [fixtureId("global")],
          message: "Synthetic draft metric release.",
          metric_id: fixtureId("draft-metric"),
          period_end_year: 2025,
          period_start_year: 2020,
          publication_status: "published",
          published_at: "2026-09-01T00:00:00Z",
          range_mode: "available",
          raw_mode: "available",
          redistribution_decision: "allowed",
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
          technology_ids: [
            fixtureId("technology-a"),
            fixtureId("technology-b"),
          ],
          typical_mode: "available",
        },
        {
          active_dataset_version_id: fixtureId("version-inactive"),
          availability_status: "supported",
          feature_enabled: true,
          geography_ids: [fixtureId("global")],
          message: "Synthetic draft dataset-version release.",
          metric_id: fixtureId("draft-version-metric"),
          period_end_year: 2025,
          period_start_year: 2020,
          publication_status: "published",
          published_at: "2026-09-01T00:00:00Z",
          range_mode: "available",
          raw_mode: "available",
          redistribution_decision: "allowed",
          reviewed_at: "2026-08-31T00:00:00Z",
          reviewed_by: "fixture-reviewer",
          technology_ids: [
            fixtureId("technology-a"),
            fixtureId("technology-b"),
          ],
          typical_mode: "available",
        },
      ])
      .throwOnError();
  }
});

function remapFixtureIds(
  snapshot: ReturnType<typeof createEvidenceRepositoryContractSnapshot>,
  prefix: string,
) {
  return JSON.parse(
    JSON.stringify(snapshot).replaceAll('"fixture-', `"${prefix}`),
  ) as ReturnType<typeof createEvidenceRepositoryContractSnapshot>;
}
