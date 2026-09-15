import { z } from "zod";

import { canConvertUnit } from "./unit-registry";

export const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);
const CalendarDateSchema = z.iso.date();
const YearSchema = z.number().int().min(1800).max(3000);

export const ComplexityLevelSchema = z.enum([
  "beginner",
  "explorer",
  "curious",
  "deep-dive",
  "geeky",
]);

export const GeographyScopeSchema = z.enum([
  "global",
  "country",
  "region",
  "grid",
  "facility",
]);

export const PeriodSchema = z
  .object({
    endYear: YearSchema,
    startYear: YearSchema,
  })
  .strict()
  .superRefine(({ endYear, startYear }, context) => {
    if (endYear < startYear) {
      context.addIssue({
        code: "custom",
        message: "Period end year must not precede its start year.",
        path: ["endYear"],
      });
    }
  })
  .readonly();

export const LicenseSchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    redistribution: z.enum(["allowed", "restricted", "unknown"]),
    url: z.url().optional(),
  })
  .strict()
  .readonly();

export const TechnologySchema = z
  .object({
    description: NonEmptyStringSchema,
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    variant: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export const GeographySchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    scope: GeographyScopeSchema,
  })
  .strict()
  .readonly();

export const SourceTierSchema = z.enum(["A", "B", "C"]);

export const SourceSchema = z
  .object({
    accessedAt: CalendarDateSchema,
    conflictDisclosure: NonEmptyStringSchema,
    id: IdentifierSchema,
    license: LicenseSchema,
    publishedAt: CalendarDateSchema,
    publisher: NonEmptyStringSchema,
    sourceTier: SourceTierSchema,
    title: NonEmptyStringSchema,
    url: z.url(),
  })
  .strict()
  .superRefine((source, context) => {
    if (source.publishedAt > source.accessedAt) {
      context.addIssue({
        code: "custom",
        message: "A source cannot be accessed before it is published.",
        path: ["accessedAt"],
      });
    }
  })
  .readonly();

export const StudySchema = z
  .object({
    id: IdentifierSchema,
    methodology: NonEmptyStringSchema,
    period: PeriodSchema,
    sourceIds: z.array(IdentifierSchema).min(1).readonly(),
    systemBoundary: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const DatasetSchema = z
  .object({
    checksum: NonEmptyStringSchema,
    id: IdentifierSchema,
    lastVerifiedAt: CalendarDateSchema,
    license: LicenseSchema,
    sourceIds: z.array(IdentifierSchema).min(1).readonly(),
    studyIds: z.array(IdentifierSchema).min(1).readonly(),
    title: NonEmptyStringSchema,
    version: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

const NumericMetricSchema = z
  .object({
    canonicalUnit: NonEmptyStringSchema,
    category: IdentifierSchema,
    definition: NonEmptyStringSchema,
    geographySupport: z.array(GeographyScopeSchema).min(1).readonly(),
    id: IdentifierSchema,
    name: NonEmptyStringSchema.optional(),
    rangeSemantics: z.enum(["point", "range", "point-or-range"]),
    shortName: NonEmptyStringSchema.optional(),
    supportedUnits: z.array(NonEmptyStringSchema).min(1).readonly(),
    valueKind: z.literal("numeric"),
  })
  .strict()
  .superRefine((metric, context) => {
    if (!metric.supportedUnits.includes(metric.canonicalUnit)) {
      context.addIssue({
        code: "custom",
        message: "The canonical unit must be included in supported units.",
        path: ["supportedUnits"],
      });
    }
    if (
      metric.supportedUnits.some(
        (unit) => !canConvertUnit(metric.canonicalUnit, unit),
      )
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Every supported unit must be registered and convertible to the canonical unit.",
        path: ["supportedUnits"],
      });
    }
  });

const CategoricalMetricSchema = z
  .object({
    canonicalUnit: z.undefined().optional(),
    category: IdentifierSchema,
    definition: NonEmptyStringSchema,
    geographySupport: z.array(GeographyScopeSchema).min(1).readonly(),
    id: IdentifierSchema,
    name: NonEmptyStringSchema.optional(),
    rangeSemantics: z.literal("categorical"),
    shortName: NonEmptyStringSchema.optional(),
    supportedUnits: z.undefined().optional(),
    valueKind: z.literal("categorical"),
  })
  .strict();

export const MetricSchema = z
  .discriminatedUnion("valueKind", [
    NumericMetricSchema,
    CategoricalMetricSchema,
  ])
  .readonly();

export const CitationSchema = z
  .object({
    claimId: IdentifierSchema,
    id: IdentifierSchema,
    locator: NonEmptyStringSchema,
    sourceId: IdentifierSchema,
  })
  .strict()
  .readonly();

export const ClaimSchema = z
  .object({
    citationIds: z.array(IdentifierSchema).min(1).readonly(),
    claimType: z.enum(["quantitative", "qualitative", "methodological"]),
    id: IdentifierSchema,
    metricId: IdentifierSchema.optional(),
    text: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const ExplanationSchema = z
  .object({
    id: IdentifierSchema,
    levels: z
      .object({
        curious: NonEmptyStringSchema,
        expert: NonEmptyStringSchema,
        kid: NonEmptyStringSchema,
        simple: NonEmptyStringSchema,
        technical: NonEmptyStringSchema,
      })
      .strict()
      .readonly(),
    subjectId: IdentifierSchema,
    subjectType: z.enum(["metric", "technology", "claim", "concept"]),
  })
  .strict()
  .readonly();

export const CorrectionSchema = z
  .object({
    affectedEntityId: IdentifierSchema,
    affectedEntityType: z.enum([
      "observation",
      "source",
      "study",
      "dataset",
      "claim",
    ]),
    correctedAt: CalendarDateSchema,
    correctedVersion: NonEmptyStringSchema,
    id: IdentifierSchema,
    materialImpact: z.enum(["none", "minor", "material"]),
    priorVersion: NonEmptyStringSchema,
    reason: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const PublicationStatusSchema = z.enum([
  "draft",
  "in-review",
  "published",
  "withdrawn",
]);

export const PublicationRecordSchema = z
  .object({
    datasetVersion: NonEmptyStringSchema,
    entityId: IdentifierSchema,
    entityType: z.enum(["observation", "source", "study", "dataset", "claim"]),
    id: IdentifierSchema,
    publishedAt: CalendarDateSchema.optional(),
    reviewedAt: CalendarDateSchema.optional(),
    reviewedBy: NonEmptyStringSchema.optional(),
    status: PublicationStatusSchema,
  })
  .strict()
  .superRefine((record, context) => {
    if (record.status === "published") {
      for (const field of [
        "publishedAt",
        "reviewedAt",
        "reviewedBy",
      ] as const) {
        if (!record[field]) {
          context.addIssue({
            code: "custom",
            message: `Published records require ${field}.`,
            path: [field],
          });
        }
      }
      if (
        record.reviewedAt &&
        record.publishedAt &&
        record.reviewedAt > record.publishedAt
      ) {
        context.addIssue({
          code: "custom",
          message: "A record cannot be published before it is reviewed.",
          path: ["publishedAt"],
        });
      }
    }
  })
  .readonly();

export const RepresentativeKindSchema = z.enum([
  "mean",
  "median",
  "central-estimate",
  "regulator-value",
  "model-default",
  "source-observation",
]);

export const CategoricalRepresentativeKindSchema = z.enum([
  "central-estimate",
  "regulator-value",
  "model-default",
  "source-observation",
]);

export const TransformationSchema = z
  .object({
    description: NonEmptyStringSchema,
    kind: z.enum(["identity", "unit-conversion", "derived", "model-output"]),
  })
  .strict()
  .readonly();

const CommonObservationFields = {
  datasetId: IdentifierSchema,
  geographyId: IdentifierSchema,
  geographyScope: GeographyScopeSchema,
  id: IdentifierSchema,
  lastVerifiedAt: CalendarDateSchema,
  license: LicenseSchema,
  methodology: NonEmptyStringSchema,
  metricId: IdentifierSchema,
  period: PeriodSchema,
  publicationStatus: PublicationStatusSchema,
  rawAccess: z.enum(["permitted", "restricted", "unavailable"]),
  sourceId: IdentifierSchema,
  studyId: IdentifierSchema,
  systemBoundary: NonEmptyStringSchema,
  technologyId: IdentifierSchema,
  transformation: z.array(TransformationSchema).min(1).readonly(),
  uncertainty: NonEmptyStringSchema,
} as const;

const NumericPointObservationObjectSchema = z
  .object({
    ...CommonObservationFields,
    kind: z.literal("numeric"),
    range: z.undefined().optional(),
    representativeKind: RepresentativeKindSchema,
    unit: NonEmptyStringSchema,
    value: z.number().finite(),
    valueSemantics: z.literal("point"),
  })
  .strict();

const MinMaxRangeSchema = z
  .object({
    kind: z.literal("min-max"),
    lower: z.number().finite(),
    representative: z.number().finite(),
    upper: z.number().finite(),
  })
  .strict();

const IntervalRangeSchema = z
  .object({
    intervalType: z.enum([
      "confidence",
      "credible",
      "interquartile",
      "prediction",
      "source-defined",
    ]),
    kind: z.literal("interval"),
    level: z.number().finite().gt(0).lte(1).optional(),
    lower: z.number().finite(),
    representative: z.number().finite(),
    sourceLabel: NonEmptyStringSchema.optional(),
    upper: z.number().finite(),
  })
  .strict()
  .superRefine((range, context) => {
    if (
      (range.intervalType === "confidence" ||
        range.intervalType === "credible" ||
        range.intervalType === "prediction") &&
      range.level === undefined
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Confidence, credible, and prediction intervals require a level.",
        path: ["level"],
      });
    }
    if (
      range.intervalType === "source-defined" &&
      range.sourceLabel === undefined
    ) {
      context.addIssue({
        code: "custom",
        message: "Source-defined intervals require a display label.",
        path: ["sourceLabel"],
      });
    }
  });

const RangeSchema = z
  .discriminatedUnion("kind", [MinMaxRangeSchema, IntervalRangeSchema])
  .superRefine(({ lower, representative, upper }, context) => {
    if (lower > representative || representative > upper) {
      context.addIssue({
        code: "custom",
        message: "Range values must satisfy lower <= representative <= upper.",
      });
    }
  })
  .readonly();

const NumericRangeObservationObjectSchema = z
  .object({
    ...CommonObservationFields,
    kind: z.literal("numeric"),
    range: RangeSchema,
    representativeKind: RepresentativeKindSchema,
    unit: NonEmptyStringSchema,
    value: z.undefined().optional(),
    valueSemantics: z.literal("range"),
  })
  .strict();

export const NumericPointObservationSchema =
  NumericPointObservationObjectSchema.readonly();
export const NumericRangeObservationSchema =
  NumericRangeObservationObjectSchema.readonly();
export const NumericObservationSchema = z
  .discriminatedUnion("valueSemantics", [
    NumericPointObservationObjectSchema,
    NumericRangeObservationObjectSchema,
  ])
  .readonly();

export const CategoricalObservationSchema = z
  .object({
    ...CommonObservationFields,
    categoryDefinition: NonEmptyStringSchema,
    kind: z.literal("categorical"),
    representativeKind: CategoricalRepresentativeKindSchema,
    unit: z.undefined().optional(),
    value: NonEmptyStringSchema,
    valueSemantics: z.literal("categorical"),
  })
  .strict()
  .readonly();

export const ObservationSchema = z.union([
  NumericObservationSchema,
  CategoricalObservationSchema,
]);

export type ObservationMetricIssue =
  | "metric-id-mismatch"
  | "value-kind-mismatch"
  | "unsupported-unit"
  | "unsupported-geography"
  | "unsupported-value-semantics";

export function validateObservationAgainstMetric(
  observation: z.infer<typeof ObservationSchema>,
  metric: z.infer<typeof MetricSchema>,
): { issues: ObservationMetricIssue[]; valid: boolean } {
  const issues: ObservationMetricIssue[] = [];
  if (observation.metricId !== metric.id) issues.push("metric-id-mismatch");
  if (observation.kind !== metric.valueKind) {
    issues.push("value-kind-mismatch");
  } else if (observation.kind === "numeric" && metric.valueKind === "numeric") {
    if (!metric.supportedUnits.includes(observation.unit)) {
      issues.push("unsupported-unit");
    }
    if (
      metric.rangeSemantics !== "point-or-range" &&
      observation.valueSemantics !== metric.rangeSemantics
    ) {
      issues.push("unsupported-value-semantics");
    }
  }
  if (!metric.geographySupport.includes(observation.geographyScope)) {
    issues.push("unsupported-geography");
  }
  return { issues, valid: issues.length === 0 };
}

export type Technology = z.infer<typeof TechnologySchema>;
export type Geography = z.infer<typeof GeographySchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Study = z.infer<typeof StudySchema>;
export type Dataset = z.infer<typeof DatasetSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;
export type Correction = z.infer<typeof CorrectionSchema>;
export type PublicationRecord = z.infer<typeof PublicationRecordSchema>;
export type NumericPointObservation = z.infer<
  typeof NumericPointObservationSchema
>;
export type NumericRangeObservation = z.infer<
  typeof NumericRangeObservationSchema
>;
export type NumericObservation = z.infer<typeof NumericObservationSchema>;
export type CategoricalObservation = z.infer<
  typeof CategoricalObservationSchema
>;
export type Observation = z.infer<typeof ObservationSchema>;
