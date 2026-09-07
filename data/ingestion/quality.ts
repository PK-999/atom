import type { IngestionManifest } from "@/data/schemas/ingestion-manifest";
import {
  ObservationSchema,
  validateObservationAgainstMetric,
  type Metric,
  type Observation,
} from "@/lib/evidence/schemas";
import { normalizeObservation } from "@/lib/evidence/units";

export interface QualityDependencies {
  getMetricDefinition(metricId: string): Promise<Metric | null>;
}

export interface ValidatedIngestionRecords {
  readonly source: readonly Observation[];
  readonly normalized: readonly Observation[];
  readonly sourceRecordCount: number;
}

export async function validateAndNormalize(
  records: readonly Observation[],
  manifest: IngestionManifest,
  dependencies: QualityDependencies,
): Promise<ValidatedIngestionRecords> {
  const identities = new Set<string>();
  const ids = new Set<string>();
  const normalized: Observation[] = [];
  const source: Observation[] = [];

  if (!records.length)
    throw new Error("An artifact requires at least one observation.");
  if (manifest.redistribution !== manifest.licence.redistribution) {
    throw new Error(
      "Manifest redistribution restriction does not match its licence.",
    );
  }
  if (
    manifest.revision &&
    (!manifest.supersedesVersionId ||
      manifest.revision.decidedOn < manifest.accessDate ||
      new Set(manifest.revision.affectedObservationIds).size !==
        manifest.revision.affectedObservationIds.length)
  )
    throw new Error("Correction identity or chronology is invalid.");

  for (const record of records) {
    const observation = ObservationSchema.parse(record);
    source.push(observation);
    if (observation.publicationStatus !== "draft")
      throw new Error("Parser input must be draft only.");
    if (
      observation.datasetId !== manifest.datasetId ||
      observation.sourceId !== manifest.sourceId
    ) {
      throw new Error(
        "Observation dataset/source identity does not match manifest.",
      );
    }
    if (
      observation.license.id !== manifest.licence.id ||
      observation.license.name !== manifest.licence.name ||
      observation.license.url !== manifest.licence.url ||
      observation.license.redistribution !== manifest.redistribution
    ) {
      throw new Error("Observation licence does not match manifest.");
    }
    if (
      observation.rawAccess === "permitted" &&
      manifest.redistribution !== "allowed"
    )
      throw new Error("Redistribution restriction forbids raw access.");
    if (observation.lastVerifiedAt < manifest.accessDate)
      throw new Error("Observation verification precedes acquisition.");
    if (
      manifest.revision?.affectedObservationIds.includes(observation.id) &&
      manifest.revision.decidedOn > observation.lastVerifiedAt
    )
      throw new Error("Correction decision follows verification.");
    if (ids.has(observation.id)) throw new Error("Duplicate observation ID.");
    ids.add(observation.id);
    const identity = [
      observation.metricId,
      observation.technologyId,
      observation.geographyId,
      observation.studyId,
      observation.sourceId,
      observation.period.startYear,
      observation.period.endYear,
    ].join(":");
    if (identities.has(identity)) {
      throw new Error(`Duplicate observation identity: ${identity}.`);
    }
    identities.add(identity);

    const metric = await dependencies.getMetricDefinition(observation.metricId);
    if (!metric)
      throw new Error(`Metric definition not found: ${observation.metricId}.`);
    const compatibility = validateObservationAgainstMetric(observation, metric);
    if (!compatibility.valid) {
      const issues = compatibility.issues.map((issue) =>
        issue.replaceAll("-", " "),
      );
      throw new Error(
        `Observation ${observation.id} is incompatible with metric ${metric.id}: ${issues.join(", ")}.`,
      );
    }

    const canonicalUnit = manifest.canonicalUnits[observation.metricId];
    if (observation.kind === "numeric") {
      if (
        !canonicalUnit ||
        metric.valueKind !== "numeric" ||
        canonicalUnit !== metric.canonicalUnit
      ) {
        throw new Error(
          `Manifest canonical unit must equal metric ${observation.metricId}'s canonical unit.`,
        );
      }
      const converted = ObservationSchema.parse(
        normalizeObservation(observation, canonicalUnit),
      );
      if (!validateObservationAgainstMetric(converted, metric).valid)
        throw new Error("Normalized observation is incompatible with metric.");
      normalized.push(converted);
    } else {
      if (canonicalUnit !== undefined)
        throw new Error("Categorical metrics cannot declare canonical units.");
      normalized.push(observation);
    }
  }

  if (manifest.revision?.affectedObservationIds.some((id) => !ids.has(id)))
    throw new Error("Correction refers to a missing observation.");
  return { normalized, source, sourceRecordCount: records.length };
}
