import type { IngestionManifest } from "@/data/schemas/ingestion-manifest";
import type { Metric, Observation } from "@/lib/evidence/schemas";
import { sha256 } from "./checksum";

// Synthetic software fixtures only. Never import this module into a command or app.
export const metric: Metric = {
  id: "synthetic-power",
  category: "technical",
  definition: "Synthetic power.",
  valueKind: "numeric",
  canonicalUnit: "MW",
  supportedUnits: ["MW", "GW"],
  rangeSemantics: "point-or-range",
  geographySupport: ["global"],
};
export const license = {
  id: "synthetic-license",
  name: "Synthetic test license",
  redistribution: "allowed" as const,
};
export function observation(overrides: Partial<Observation> = {}): Observation {
  return {
    id: "synthetic-row",
    datasetId: "synthetic-dataset",
    sourceId: "synthetic-source",
    metricId: metric.id,
    studyId: "synthetic-study",
    technologyId: "synthetic-technology",
    geographyId: "synthetic-global",
    geographyScope: "global",
    license,
    kind: "numeric",
    valueSemantics: "point",
    value: 1,
    unit: "GW",
    representativeKind: "source-observation",
    period: { startYear: 2025, endYear: 2025 },
    methodology: "Synthetic method.",
    systemBoundary: "Synthetic boundary.",
    uncertainty: "Synthetic uncertainty.",
    lastVerifiedAt: "2026-09-01",
    publicationStatus: "draft",
    rawAccess: "permitted",
    transformation: [
      { kind: "identity", description: "Read synthetic test bytes." },
    ],
    ...overrides,
  } as Observation;
}
export function artifact(records = [observation()]): Uint8Array {
  return new TextEncoder().encode(
    JSON.stringify({
      header: "atom-evidence-observations-v1",
      expectedIds: records.map((r) => r.id),
      rows: records,
    }),
  );
}
export function manifest(
  bytes = artifact(),
  overrides: Partial<IngestionManifest> = {},
): IngestionManifest {
  return {
    datasetId: "synthetic-dataset",
    sourceId: "synthetic-source",
    sourceVersion: "synthetic-v1",
    sourceUrl: "https://example.invalid/synthetic",
    accessDate: "2026-09-01",
    licence: license,
    sourceTier: "A",
    conflictDisclosure: "Synthetic test only.",
    checksumAlgorithm: "sha256",
    checksum: sha256(bytes),
    parserId: "observation-envelope-v1",
    transformationVersion: "1.0.0",
    canonicalUnits: { [metric.id]: "MW" },
    reviewerRoles: ["scientific", "editorial", "licensing"],
    redistribution: "allowed",
    ...overrides,
  };
}
