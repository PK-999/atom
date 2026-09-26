/** Synthetic review graph for tests only. Never import into application code. */
import type { EvidenceSnapshot } from "./local-repository";
import { digestVersion, type EvidenceProvenance } from "./release-provenance";

export function withSyntheticReview(input: EvidenceSnapshot): EvidenceSnapshot {
  const snapshot = structuredClone(input);
  const observations = snapshot.observations.map((o) => ({
    ...o,
    studyId: `${o.studyId}-${o.id}`,
  }));
  const sourceIds = [...new Set(observations.map((o) => o.sourceId))];
  if (!sourceIds.length) sourceIds.push("fixture-source");
  const license = {
    id: "fixture-license",
    name: "Synthetic test licence",
    redistribution: "allowed" as const,
  };
  const provenance: EvidenceProvenance = {
    sources: sourceIds.map((id) => ({
      id,
      title: "Synthetic source — not scientific evidence",
      publisher: "Test fixture",
      url: "https://example.com/synthetic",
      sourceTier: "A",
      publishedAt: "2020-01-01",
      accessedAt: "2026-09-01",
      license: observations.find((o) => o.sourceId === id)?.license ?? license,
      conflictDisclosure: "Synthetic test-only record",
    })),
    studies: observations.map((o) => ({
      id: o.studyId,
      title: "Synthetic study",
      sourceIds: [o.sourceId],
      period: o.period,
      methodology: o.methodology,
      systemBoundary: o.systemBoundary,
    })),
    versions: [],
    publications: [],
  };
  const versionIds = [
    ...new Set([
      ...Object.values(snapshot.observationDatasetVersionIds),
      ...snapshot.metricReleases.map((r) => r.activeDatasetVersionId),
    ]),
  ];
  for (const id of versionIds) {
    const records = observations.filter(
      (o) => snapshot.observationDatasetVersionIds[o.id] === id,
    );
    const first = records[0];
    const sourceIds = [...new Set(records.map((o) => o.sourceId))];
    if (!sourceIds.length) sourceIds.push("fixture-source");
    const studyIds = records.map((o) => o.studyId);
    if (!studyIds.length) {
      studyIds.push(`fixture-study-${id}`);
      provenance.studies.push({
        id: studyIds[0],
        title: "Synthetic empty study",
        sourceIds,
        period: { startYear: 2020, endYear: 2024 },
        methodology: "Synthetic",
        systemBoundary: "Synthetic",
      });
    }
    const dataset = {
      id: first?.datasetId ?? "fixture-dataset",
      version: id,
      title: "Synthetic dataset",
      checksum: "1".repeat(64),
      lastVerifiedAt: "2026-09-01",
      license: first?.license ?? license,
      sourceIds,
      studyIds,
    };
    const version = {
      id,
      dataset,
      status: "published" as const,
      publishedAt: "2026-09-03",
      artifacts: sourceIds.map((sourceId) => ({
        sourceId,
        url: "https://example.com/synthetic.csv",
        locator: "Synthetic table 1",
        sha256: "1".repeat(64),
      })),
      reviews: [] as EvidenceProvenance["versions"][number]["reviews"],
    };
    provenance.versions.push(version);
    const entities = [
      ["dataset", dataset.id],
      ...sourceIds.map((id) => ["source", id]),
      ...studyIds.map((id) => ["study", id]),
      ...records.map((o) => ["observation", o.id]),
    ] as const;
    for (const [entityType, entityId] of entities)
      provenance.publications.push({
        id: `publication-${id}-${entityType}-${entityId}`,
        entityType: entityType as
          "dataset" | "source" | "study" | "observation",
        entityId,
        datasetVersion: id,
        status: "published",
        reviewedBy: "synthetic-reviewer",
        reviewedAt: "2026-09-02",
        publishedAt: "2026-09-03",
      });
  }
  const reviewed = { ...snapshot, observations, provenance };
  for (const version of provenance.versions)
    version.reviews = (["scientific", "editorial", "licensing"] as const).map(
      (kind) => ({
        kind,
        decision: "approved",
        reviewerId: `synthetic-${kind}-reviewer`,
        recordReference: "Synthetic test decision, not a real approval",
        reviewedAt: "2026-09-02",
        datasetVersionId: version.id,
        payloadSha256: digestVersion(reviewed, version),
      }),
    );
  return reviewed;
}
