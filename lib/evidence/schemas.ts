import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);
const CalendarDateSchema = z.iso.date();
const YearSchema = z.number().int().min(1800).max(3000);

export const ComplexityLevelSchema = z.enum([
  "kid",
  "simple",
  "curious",
  "technical",
  "expert",
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
  });

export const LicenseSchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    redistribution: z.enum(["allowed", "restricted", "unknown"]),
    url: z.url().optional(),
  })
  .strict();

export const TechnologySchema = z
  .object({
    description: NonEmptyStringSchema,
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    variant: NonEmptyStringSchema.optional(),
  })
  .strict();

export const GeographySchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    scope: GeographyScopeSchema,
  })
  .strict();

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
  .strict();

export const StudySchema = z
  .object({
    id: IdentifierSchema,
    methodology: NonEmptyStringSchema,
    period: PeriodSchema,
    sourceIds: z.array(IdentifierSchema).min(1),
    systemBoundary: NonEmptyStringSchema,
    title: NonEmptyStringSchema,
  })
  .strict();

export const DatasetSchema = z
  .object({
    checksum: NonEmptyStringSchema,
    id: IdentifierSchema,
    lastVerifiedAt: CalendarDateSchema,
    license: LicenseSchema,
    sourceIds: z.array(IdentifierSchema).min(1),
    studyIds: z.array(IdentifierSchema).min(1),
    title: NonEmptyStringSchema,
    version: NonEmptyStringSchema,
  })
  .strict();

export const MetricSchema = z
  .object({
    canonicalUnit: NonEmptyStringSchema,
    category: IdentifierSchema,
    definition: NonEmptyStringSchema,
    geographySupport: z.array(GeographyScopeSchema).min(1),
    id: IdentifierSchema,
    rangeSemantics: z.enum(["point", "range", "point-or-range", "categorical"]),
    supportedUnits: z.array(NonEmptyStringSchema).min(1),
    valueKind: z.enum(["numeric", "categorical"]),
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
      (metric.valueKind === "categorical") !==
      (metric.rangeSemantics === "categorical")
    ) {
      context.addIssue({
        code: "custom",
        message: "Categorical metrics must use categorical range semantics.",
        path: ["rangeSemantics"],
      });
    }
  });

export const CitationSchema = z
  .object({
    claimId: IdentifierSchema,
    id: IdentifierSchema,
    locator: NonEmptyStringSchema,
    sourceId: IdentifierSchema,
  })
  .strict();

export const ClaimSchema = z
  .object({
    citationIds: z.array(IdentifierSchema).min(1),
    claimType: z.enum(["quantitative", "qualitative", "methodological"]),
    id: IdentifierSchema,
    metricId: IdentifierSchema.optional(),
    text: NonEmptyStringSchema,
  })
  .strict();

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
      .strict(),
    subjectId: IdentifierSchema,
    subjectType: z.enum(["metric", "technology", "claim", "concept"]),
  })
  .strict();

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
  .strict();

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
    }
  });

export const RepresentativeKindSchema = z.enum([
  "mean",
  "median",
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
  .strict();

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
  representativeKind: RepresentativeKindSchema,
  sourceId: IdentifierSchema,
  studyId: IdentifierSchema,
  systemBoundary: NonEmptyStringSchema,
  technologyId: IdentifierSchema,
  transformation: TransformationSchema,
  uncertainty: NonEmptyStringSchema,
} as const;

export const NumericPointObservationSchema = z
  .object({
    ...CommonObservationFields,
    kind: z.literal("numeric"),
    range: z.undefined().optional(),
    unit: NonEmptyStringSchema,
    value: z.number().finite(),
    valueSemantics: z.literal("point"),
  })
  .strict();

export const NumericRangeObservationSchema = z
  .object({
    ...CommonObservationFields,
    kind: z.literal("numeric"),
    range: z
      .object({
        kind: z.enum(["min-max", "interval"]),
        lower: z.number().finite(),
        representative: z.number().finite(),
        upper: z.number().finite(),
      })
      .strict()
      .superRefine(({ lower, representative, upper }, context) => {
        if (lower > representative || representative > upper) {
          context.addIssue({
            code: "custom",
            message:
              "Range values must satisfy lower <= representative <= upper.",
          });
        }
      }),
    unit: NonEmptyStringSchema,
    value: z.undefined().optional(),
    valueSemantics: z.literal("range"),
  })
  .strict();

export const NumericObservationSchema = z.discriminatedUnion("valueSemantics", [
  NumericPointObservationSchema,
  NumericRangeObservationSchema,
]);

export const CategoricalObservationSchema = z
  .object({
    ...CommonObservationFields,
    categoryDefinition: NonEmptyStringSchema,
    kind: z.literal("categorical"),
    unit: z.undefined().optional(),
    value: NonEmptyStringSchema,
    valueSemantics: z.literal("categorical"),
  })
  .strict();

export const ObservationSchema = z.union([
  NumericObservationSchema,
  CategoricalObservationSchema,
]);

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
