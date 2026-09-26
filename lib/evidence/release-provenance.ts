/** Server-side release metadata. Never serialize reviewer records into client props. */
import { createHash } from "node:crypto";
import { z } from "zod";
import { canPublishRawObservation } from "./governance";
import {
  DatasetSchema,
  IdentifierSchema,
  PublicationRecordSchema,
  SourceSchema,
  StudySchema,
  type Observation,
} from "./schemas";
import type { EvidenceSnapshot } from "./local-repository";

const Sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const Text = z.string().trim().min(1);
export const DatasetVersionSchema = z
  .object({
    id: IdentifierSchema,
    dataset: DatasetSchema,
    status: z.enum(["draft", "in-review", "published", "withdrawn"]),
    publishedAt: z.iso.date().optional(),
    artifacts: z
      .array(
        z
          .object({
            sourceId: IdentifierSchema,
            url: z.url(),
            locator: Text,
            sha256: Sha256,
          })
          .strict(),
      )
      .min(1),
    reviews: z.array(
      z
        .object({
          kind: z.enum(["scientific", "editorial", "licensing"]),
          decision: z.enum(["approved", "rejected"]),
          reviewerId: IdentifierSchema,
          recordReference: Text,
          reviewedAt: z.iso.date(),
          datasetVersionId: IdentifierSchema,
          payloadSha256: Sha256,
        })
        .strict(),
    ),
  })
  .strict();
export const EvidenceProvenanceSchema = z
  .object({
    sources: z.array(SourceSchema),
    studies: z.array(StudySchema),
    versions: z.array(DatasetVersionSchema),
    publications: z.array(PublicationRecordSchema),
  })
  .strict();
export type DatasetVersion = z.infer<typeof DatasetVersionSchema>;
export type EvidenceProvenance = z.infer<typeof EvidenceProvenanceSchema>;

export function validateProvenance(
  value: EvidenceProvenance | undefined,
): EvidenceProvenance {
  const parsed = EvidenceProvenanceSchema.parse(
    value ?? { sources: [], studies: [], versions: [], publications: [] },
  );
  for (const records of [
    parsed.sources,
    parsed.studies,
    parsed.versions,
    parsed.publications,
  ]) {
    if (new Set(records.map((record) => record.id)).size !== records.length)
      throw new Error("Duplicate evidence provenance identity.");
  }
  const publicationKeys = parsed.publications.map(
    (p) => `${p.entityType}:${p.entityId}:${p.datasetVersion}`,
  );
  if (new Set(publicationKeys).size !== publicationKeys.length)
    throw new Error("Ambiguous publication records.");
  return parsed;
}

// Sort object keys, preserve scientifically meaningful array order (e.g. transformations).
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => [k, canonical(v)]),
    );
  return value;
}
function byId<T extends { readonly id: string }>(records: readonly T[]) {
  return [...records].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function digestVersion(
  snapshot: EvidenceSnapshot,
  version: DatasetVersion,
): string {
  const observations = byId(
    snapshot.observations.filter(
      (o) => snapshot.observationDatasetVersionIds[o.id] === version.id,
    ),
  );
  const provenance = snapshot.provenance;
  const sourceIds = new Set(version.dataset.sourceIds);
  const studyIds = new Set(version.dataset.studyIds);
  const payload = {
    id: version.id,
    dataset: version.dataset,
    artifacts: version.artifacts,
    sources: byId(
      (provenance?.sources ?? []).filter((s) => sourceIds.has(s.id)),
    ),
    studies: byId(
      (provenance?.studies ?? []).filter((s) => studyIds.has(s.id)),
    ),
    // Publishing is a separate transition; scientific contents are immutable across it.
    observations: observations.map((o) => {
      const { publicationStatus, ...scientific } = o;
      void publicationStatus;
      return scientific;
    }),
    metrics: byId(
      snapshot.metrics.filter((m) =>
        observations.some((o) => o.metricId === m.id),
      ),
    ),
    technologies: byId(
      snapshot.technologies.filter((t) =>
        observations.some((o) => o.technologyId === t.id),
      ),
    ),
    geographies: byId(
      snapshot.geographies.filter((g) =>
        observations.some((o) => o.geographyId === g.id),
      ),
    ),
  };
  return createHash("sha256")
    .update(JSON.stringify(canonical(payload)))
    .digest("hex");
}

export function isReviewedVersion(
  snapshot: EvidenceSnapshot,
  versionId: string,
): boolean {
  const provenance = snapshot.provenance;
  const version = provenance?.versions.find((v) => v.id === versionId);
  if (
    !version ||
    version.status !== "published" ||
    !version.publishedAt ||
    version.dataset.license.redistribution !== "allowed"
  )
    return false;
  if (
    version.dataset.sourceIds.some(
      (id) =>
        !provenance!.sources.some(
          (s) => s.id === id && s.license.redistribution === "allowed",
        ) || !version.artifacts.some((a) => a.sourceId === id),
    )
  )
    return false;
  if (
    version.artifacts.some(
      (a) => !version.dataset.sourceIds.includes(a.sourceId),
    )
  )
    return false;
  if (
    version.dataset.studyIds.some(
      (id) =>
        !provenance!.studies.some(
          (s) =>
            s.id === id &&
            s.sourceIds.every((sourceId) =>
              version.dataset.sourceIds.includes(sourceId),
            ),
        ),
    )
  )
    return false;
  const hash = digestVersion(snapshot, version);
  const latestInputDate = [
    version.dataset.lastVerifiedAt,
    ...provenance!.sources
      .filter((s) => version.dataset.sourceIds.includes(s.id))
      .map((s) => s.accessedAt),
    ...snapshot.observations
      .filter((o) => snapshot.observationDatasetVersionIds[o.id] === versionId)
      .map((o) => o.lastVerifiedAt),
  ]
    .sort()
    .at(-1)!;
  return (["scientific", "editorial", "licensing"] as const).every((kind) => {
    const decisions = version.reviews.filter((r) => r.kind === kind);
    return (
      decisions.length === 1 &&
      decisions[0].decision === "approved" &&
      decisions[0].datasetVersionId === versionId &&
      decisions[0].payloadSha256 === hash &&
      decisions[0].reviewedAt >= latestInputDate &&
      decisions[0].reviewedAt <= version.publishedAt!
    );
  });
}

export function hasPublicationProvenance(
  snapshot: EvidenceSnapshot,
  observation: Observation,
): boolean {
  const provenance = snapshot.provenance;
  const versionId = snapshot.observationDatasetVersionIds[observation.id];
  const version = provenance?.versions.find((v) => v.id === versionId);
  if (!version || !isReviewedVersion(snapshot, versionId)) return false;
  const source = provenance!.sources.find((s) => s.id === observation.sourceId);
  const study = provenance!.studies.find((s) => s.id === observation.studyId);
  const metric = snapshot.metrics.find((m) => m.id === observation.metricId);
  const geography = snapshot.geographies.find(
    (g) => g.id === observation.geographyId,
  );
  const technology = snapshot.technologies.find(
    (t) => t.id === observation.technologyId,
  );
  const publication = provenance!.publications.find(
    (p) =>
      p.entityType === "observation" &&
      p.entityId === observation.id &&
      p.datasetVersion === version.dataset.version,
  );
  if (!source || !study || !metric || !geography || !technology || !publication)
    return false;
  const parents = [
    ["source", source.id],
    ["study", study.id],
    ["dataset", version.dataset.id],
  ] as const;
  if (
    !parents.every(([type, id]) =>
      provenance!.publications.some(
        (p) =>
          p.entityType === type &&
          p.entityId === id &&
          p.datasetVersion === version.dataset.version &&
          p.status === "published" &&
          p.publishedAt! <= version.publishedAt!,
      ),
    )
  )
    return false;
  return (
    publication.publishedAt! <= version.publishedAt! &&
    canPublishRawObservation(observation, {
      source,
      study,
      dataset: version.dataset,
      metric,
      geography,
      technology,
      publication,
    }).eligible
  );
}

/** A pure pointer change. Callers commit the new snapshot; the old one remains intact. */
export function activateEvidenceVersion(
  snapshot: EvidenceSnapshot,
  metricId: string,
  versionId: string,
): EvidenceSnapshot {
  const candidate = structuredClone(snapshot);
  if (!isReviewedVersion(candidate, versionId))
    throw new Error(
      "Cannot activate an unreviewed or withdrawn dataset version.",
    );
  const release = candidate.metricReleases.find((r) => r.metricId === metricId);
  if (!release)
    throw new Error(
      "Activation requires an explicit metric release and coverage.",
    );
  const matching = candidate.observations.filter(
    (o) =>
      o.metricId === metricId &&
      candidate.observationDatasetVersionIds[o.id] === versionId &&
      release.technologyIds.includes(o.technologyId) &&
      release.geographyIds.includes(o.geographyId),
  );
  if (
    !matching.length ||
    !matching.every((o) => hasPublicationProvenance(candidate, o))
  )
    throw new Error(
      "Cannot activate observations without complete publication provenance.",
    );
  return {
    ...candidate,
    metricReleases: candidate.metricReleases.map((r) =>
      r.metricId === metricId ? { ...r, activeDatasetVersionId: versionId } : r,
    ),
  };
}

/** Before committing a new authoring snapshot, preserve every historical version. */
export function assertImmutableVersionHistory(
  previous: EvidenceSnapshot,
  next: EvidenceSnapshot,
): void {
  for (const version of previous.provenance?.versions ?? []) {
    const successor = next.provenance?.versions.find(
      (v) => v.id === version.id,
    );
    if (
      !successor ||
      digestVersion(previous, version) !== digestVersion(next, successor)
    )
      throw new Error(
        `Immutable evidence version changed or removed: ${version.id}. Create a new version instead.`,
      );
    if (version.status === "withdrawn" && successor.status !== "withdrawn")
      throw new Error(
        "A withdrawn version cannot be reactivated. Publish a new reviewed version.",
      );
    for (const review of version.reviews) {
      if (
        !successor.reviews.some(
          (r) =>
            JSON.stringify(canonical(r)) === JSON.stringify(canonical(review)),
        )
      )
        throw new Error("Historical review decisions must be preserved.");
    }
  }
  for (const record of previous.provenance?.publications ?? []) {
    if (
      record.status === "published" &&
      !next.provenance?.publications.some(
        (p) =>
          p.id === record.id &&
          JSON.stringify(canonical(p)) === JSON.stringify(canonical(record)),
      )
    )
      throw new Error("Historical publication records must be preserved.");
  }
}

export function appendEvidenceSnapshot(
  previous: EvidenceSnapshot,
  next: EvidenceSnapshot,
): EvidenceSnapshot {
  assertImmutableVersionHistory(previous, next);
  validateProvenance(next.provenance);
  return structuredClone(next);
}
