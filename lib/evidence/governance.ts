import { z } from "zod";

import {
  CorrectionSchema,
  DatasetSchema,
  GeographySchema,
  MetricSchema,
  ObservationSchema,
  PublicationRecordSchema,
  SourceSchema,
  StudySchema,
  TechnologySchema,
  validateObservationAgainstMetric,
  type Correction,
  type Dataset,
  type Geography,
  type Metric,
  type Observation,
  type PublicationRecord,
  type Source,
  type Study,
  type Technology,
} from "./schemas";

const ExplainedAvailabilitySchema = z
  .object({
    message: z.string().trim().min(1),
    status: z.enum([
      "supported",
      "partial",
      "incompatible",
      "unavailable",
      "restricted",
      "stale",
    ]),
  })
  .strict();

const DisputedAvailabilitySchema = z
  .object({
    alternativeObservationIds: z.array(z.string().trim().min(1)).min(1),
    broadAgreement: z.string().trim().min(1),
    disagreementSummary: z.string().trim().min(1),
    remainingUncertainty: z.string().trim().min(1),
    representativeObservationId: z.string().trim().min(1),
    status: z.literal("disputed"),
  })
  .strict();

export const EvidenceAvailabilitySchema = z.discriminatedUnion("status", [
  ExplainedAvailabilitySchema,
  DisputedAvailabilitySchema,
]);

export type EvidenceAvailability = z.infer<typeof EvidenceAvailabilitySchema>;

function parseCalendarDate(value: string): Date {
  if (!z.iso.date().safeParse(value).success) {
    throw new Error(`Invalid calendar date: ${value}.`);
  }
  return new Date(`${value}T00:00:00.000Z`);
}

function formatCalendarDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export interface FreshnessInput {
  asOf: string;
  lastVerifiedAt: string;
  reviewIntervalDays: number;
}

export interface FreshnessResult {
  ageDays: number;
  dueAt: string;
  status: "fresh" | "stale";
}

export function assessFreshness(input: FreshnessInput): FreshnessResult {
  if (
    !Number.isInteger(input.reviewIntervalDays) ||
    input.reviewIntervalDays <= 0
  ) {
    throw new Error("Review intervals must be positive whole days.");
  }
  const verified = parseCalendarDate(input.lastVerifiedAt);
  const asOf = parseCalendarDate(input.asOf);
  const millisecondsPerDay = 86_400_000;
  const ageDays = (asOf.getTime() - verified.getTime()) / millisecondsPerDay;
  if (ageDays < 0 || !Number.isInteger(ageDays)) {
    throw new Error(
      "The verification date cannot be after the assessment date.",
    );
  }
  const due = new Date(
    verified.getTime() + input.reviewIntervalDays * millisecondsPerDay,
  );

  return {
    ageDays,
    dueAt: formatCalendarDate(due),
    status: ageDays <= input.reviewIntervalDays ? "fresh" : "stale",
  };
}

export type PublicationEligibilityReason =
  | "invalid-observation"
  | "invalid-source"
  | "invalid-study"
  | "invalid-dataset"
  | "invalid-metric"
  | "invalid-geography"
  | "invalid-technology"
  | "invalid-publication-record"
  | "source-relationship-mismatch"
  | "study-source-mismatch"
  | "dataset-source-mismatch"
  | "dataset-study-mismatch"
  | "dataset-version-mismatch"
  | "observation-dataset-relationship-mismatch"
  | "observation-study-relationship-mismatch"
  | "metric-relationship-mismatch"
  | "geography-relationship-mismatch"
  | "technology-relationship-mismatch"
  | "observation-study-mismatch"
  | "observation-metric-mismatch"
  | "observation-license-mismatch"
  | "publication-relationship-mismatch"
  | "not-published"
  | "missing-material-correction"
  | "redistribution-restricted"
  | "raw-access-restricted";

export interface PublicationEligibility {
  eligible: boolean;
  reasons: PublicationEligibilityReason[];
}

export interface PublicationContext {
  corrections?: readonly Correction[];
  dataset: Dataset;
  geography: Geography;
  materialRevisionFrom?: string;
  metric: Metric;
  publication: PublicationRecord;
  source: Source;
  study: Study;
  technology: Technology;
}

export function canPublishObservation(
  observation: Observation,
  context: PublicationContext,
): PublicationEligibility {
  const reasons: PublicationEligibilityReason[] = [];
  if (!ObservationSchema.safeParse(observation).success) {
    reasons.push("invalid-observation");
  }
  if (!SourceSchema.safeParse(context.source).success) {
    reasons.push("invalid-source");
  }
  if (!StudySchema.safeParse(context.study).success) {
    reasons.push("invalid-study");
  }
  if (!DatasetSchema.safeParse(context.dataset).success) {
    reasons.push("invalid-dataset");
  }
  if (!MetricSchema.safeParse(context.metric).success) {
    reasons.push("invalid-metric");
  }
  if (!GeographySchema.safeParse(context.geography).success) {
    reasons.push("invalid-geography");
  }
  if (!TechnologySchema.safeParse(context.technology).success) {
    reasons.push("invalid-technology");
  }
  if (!PublicationRecordSchema.safeParse(context.publication).success) {
    reasons.push("invalid-publication-record");
  }
  if (reasons.length > 0) return { eligible: false, reasons };

  if (observation.sourceId !== context.source.id) {
    reasons.push("source-relationship-mismatch");
  }
  if (!context.study.sourceIds.includes(context.source.id)) {
    reasons.push("study-source-mismatch");
  }
  if (!context.dataset.sourceIds.includes(context.source.id)) {
    reasons.push("dataset-source-mismatch");
  }
  if (!context.dataset.studyIds.includes(context.study.id)) {
    reasons.push("dataset-study-mismatch");
  }
  if (context.publication.datasetVersion !== context.dataset.version) {
    reasons.push("dataset-version-mismatch");
  }
  if (observation.studyId !== context.study.id) {
    reasons.push("observation-study-relationship-mismatch");
  }
  if (observation.datasetId !== context.dataset.id) {
    reasons.push("observation-dataset-relationship-mismatch");
  }
  if (observation.metricId !== context.metric.id) {
    reasons.push("metric-relationship-mismatch");
  }
  if (observation.geographyId !== context.geography.id) {
    reasons.push("geography-relationship-mismatch");
  }
  if (observation.technologyId !== context.technology.id) {
    reasons.push("technology-relationship-mismatch");
  }
  if (
    observation.methodology !== context.study.methodology ||
    observation.systemBoundary !== context.study.systemBoundary ||
    observation.period.startYear !== context.study.period.startYear ||
    observation.period.endYear !== context.study.period.endYear
  ) {
    reasons.push("observation-study-mismatch");
  }
  if (!validateObservationAgainstMetric(observation, context.metric).valid) {
    reasons.push("observation-metric-mismatch");
  }
  if (
    observation.geographyScope !== context.geography.scope ||
    !context.metric.geographySupport.includes(context.geography.scope)
  ) {
    reasons.push("geography-relationship-mismatch");
  }
  if (
    observation.license.id !== context.dataset.license.id ||
    observation.license.redistribution !==
      context.dataset.license.redistribution
  ) {
    reasons.push("observation-license-mismatch");
  }
  if (
    context.publication.entityId !== observation.id ||
    context.publication.entityType !== "observation"
  ) {
    reasons.push("publication-relationship-mismatch");
  }
  if (
    observation.publicationStatus !== "published" ||
    context.publication.status !== "published"
  ) {
    reasons.push("not-published");
  }

  if (context.materialRevisionFrom) {
    const hasMaterialCorrection = (context.corrections ?? []).some(
      (correction) =>
        CorrectionSchema.safeParse(correction).success &&
        correction.affectedEntityId === observation.id &&
        correction.affectedEntityType === "observation" &&
        correction.materialImpact === "material" &&
        correction.priorVersion === context.materialRevisionFrom &&
        correction.correctedVersion === context.publication.datasetVersion,
    );
    if (!hasMaterialCorrection) reasons.push("missing-material-correction");
  }

  return { eligible: reasons.length === 0, reasons: [...new Set(reasons)] };
}

export function canPublishRawObservation(
  observation: Observation,
  context: PublicationContext,
): PublicationEligibility {
  const publication = canPublishObservation(observation, context);
  const reasons = [...publication.reasons];
  if (observation.rawAccess !== "permitted") {
    reasons.push("raw-access-restricted");
  }
  if (
    observation.license.redistribution !== "allowed" ||
    context.dataset.license.redistribution !== "allowed" ||
    context.source.license.redistribution !== "allowed"
  ) {
    reasons.push("redistribution-restricted");
  }
  return { eligible: reasons.length === 0, reasons: [...new Set(reasons)] };
}

export function canReadPublication(
  record: PublicationRecord,
  audience: "anonymous" | "editor",
): boolean {
  if (!PublicationRecordSchema.safeParse(record).success) return false;
  return audience === "editor" || record.status === "published";
}

type PublicationTransitionMetadata = Partial<
  Pick<PublicationRecord, "publishedAt" | "reviewedAt" | "reviewedBy">
>;

export type PublicationTransitionResult =
  | { ok: true; record: PublicationRecord }
  | {
      code: "forbidden-transition" | "invalid-publication-metadata";
      message: string;
      ok: false;
    };

const ALLOWED_TRANSITIONS: Readonly<
  Record<PublicationRecord["status"], readonly PublicationRecord["status"][]>
> = {
  draft: ["in-review"],
  "in-review": ["draft", "published"],
  published: ["in-review", "withdrawn"],
  withdrawn: ["in-review"],
};

export function transitionPublication(
  record: PublicationRecord,
  target: PublicationRecord["status"],
  metadata: PublicationTransitionMetadata = {},
): PublicationTransitionResult {
  if (!ALLOWED_TRANSITIONS[record.status].includes(target)) {
    return {
      code: "forbidden-transition",
      message: `Publication cannot transition from ${record.status} to ${target}.`,
      ok: false,
    };
  }

  if (
    target === "published" &&
    (!metadata.publishedAt || !metadata.reviewedAt || !metadata.reviewedBy)
  ) {
    return {
      code: "invalid-publication-metadata",
      message: "Publishing requires explicit review and publication metadata.",
      ok: false,
    };
  }

  const candidate = { ...record, ...metadata, status: target };
  const parsed = PublicationRecordSchema.safeParse(candidate);
  if (!parsed.success) {
    return {
      code: "invalid-publication-metadata",
      message:
        "The target publication state is missing required review metadata.",
      ok: false,
    };
  }
  return { ok: true, record: parsed.data };
}
