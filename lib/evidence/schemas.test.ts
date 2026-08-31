import { describe, expect, it } from "vitest";

import {
  CategoricalObservationSchema,
  CitationSchema,
  ClaimSchema,
  CorrectionSchema,
  DatasetSchema,
  ExplanationSchema,
  GeographySchema,
  MetricSchema,
  NumericObservationSchema,
  PublicationRecordSchema,
  SourceSchema,
  StudySchema,
  TechnologySchema,
} from "./schemas";

const license = {
  id: "fixture-license",
  name: "Synthetic fixture license",
  redistribution: "allowed" as const,
  url: "https://example.com/license",
};

const period = { endYear: 2025, startYear: 2020 };

const pointObservation = {
  datasetId: "fixture-dataset",
  geographyId: "fixture-global",
  geographyScope: "global" as const,
  id: "fixture-point-observation",
  kind: "numeric" as const,
  lastVerifiedAt: "2026-08-30",
  license,
  methodology: "Synthetic method for domain contract tests.",
  metricId: "fixture-metric",
  period,
  publicationStatus: "published" as const,
  rawAccess: "permitted" as const,
  representativeKind: "source-observation" as const,
  sourceId: "fixture-source",
  studyId: "fixture-study",
  systemBoundary: "Synthetic boundary for contract tests.",
  technologyId: "fixture-technology",
  transformation: {
    description: "No transformation applied.",
    kind: "identity" as const,
  },
  uncertainty: "Synthetic uncertainty note.",
  unit: "fixture-unit",
  value: 42,
  valueSemantics: "point" as const,
};

describe("evidence entity schemas", () => {
  it("parses the required evidence entities and their relationships", () => {
    const entities = [
      TechnologySchema.parse({
        description: "Synthetic technology used only in tests.",
        id: "fixture-technology",
        name: "Fixture technology",
        variant: "Fixture variant",
      }),
      GeographySchema.parse({
        id: "fixture-global",
        name: "Fixture global geography",
        scope: "global",
      }),
      SourceSchema.parse({
        accessedAt: "2026-08-30",
        conflictDisclosure: "No known fixture conflict.",
        id: "fixture-source",
        license,
        publishedAt: "2025-01-15",
        publisher: "Fixture institution",
        sourceTier: "A",
        title: "Synthetic institutional source",
        url: "https://example.com/source",
      }),
      StudySchema.parse({
        id: "fixture-study",
        methodology: "Synthetic study method.",
        period,
        sourceIds: ["fixture-source"],
        systemBoundary: "Synthetic study boundary.",
        title: "Synthetic study",
      }),
      DatasetSchema.parse({
        checksum: "sha256:fixture-checksum",
        id: "fixture-dataset",
        lastVerifiedAt: "2026-08-30",
        license,
        sourceIds: ["fixture-source"],
        studyIds: ["fixture-study"],
        title: "Synthetic dataset",
        version: "fixture-v1",
      }),
      MetricSchema.parse({
        category: "environment",
        definition: "A synthetic metric definition for contract tests.",
        canonicalUnit: "fixture-unit",
        geographySupport: ["global"],
        id: "fixture-metric",
        rangeSemantics: "point-or-range",
        supportedUnits: ["fixture-unit"],
        valueKind: "numeric",
      }),
      CitationSchema.parse({
        claimId: "fixture-claim",
        id: "fixture-citation",
        locator: "Synthetic table 1",
        sourceId: "fixture-source",
      }),
      ClaimSchema.parse({
        citationIds: ["fixture-citation"],
        claimType: "quantitative",
        id: "fixture-claim",
        metricId: "fixture-metric",
        text: "Synthetic quantitative claim for schema verification.",
      }),
      ExplanationSchema.parse({
        id: "fixture-explanation",
        levels: {
          curious: "Curious fixture explanation.",
          expert: "Expert fixture explanation with assumptions.",
          kid: "Kid fixture explanation.",
          simple: "Simple fixture explanation.",
          technical: "Technical fixture explanation.",
        },
        subjectId: "fixture-metric",
        subjectType: "metric",
      }),
      CorrectionSchema.parse({
        affectedEntityId: "fixture-point-observation",
        affectedEntityType: "observation",
        correctedAt: "2026-08-30",
        correctedVersion: "fixture-v2",
        id: "fixture-correction",
        materialImpact: "none",
        priorVersion: "fixture-v1",
        reason: "Synthetic correction workflow test.",
      }),
      PublicationRecordSchema.parse({
        datasetVersion: "fixture-v1",
        entityId: "fixture-point-observation",
        entityType: "observation",
        id: "fixture-publication",
        publishedAt: "2026-08-30",
        reviewedAt: "2026-08-29",
        reviewedBy: "fixture-reviewer",
        status: "published",
      }),
    ];

    expect(entities).toHaveLength(11);
  });
});

describe("observation schemas", () => {
  it("parses complete numeric point and range observations", () => {
    expect(NumericObservationSchema.parse(pointObservation)).toMatchObject({
      value: 42,
      valueSemantics: "point",
    });
    expect(
      NumericObservationSchema.parse({
        ...pointObservation,
        id: "fixture-range-observation",
        range: {
          kind: "min-max",
          lower: 10,
          representative: 20,
          upper: 30,
        },
        representativeKind: "median",
        valueSemantics: "range",
        value: undefined,
      }),
    ).toMatchObject({
      range: { lower: 10, representative: 20, upper: 30 },
      valueSemantics: "range",
    });
  });

  it("parses a categorical observation with the same provenance contract", () => {
    const result = CategoricalObservationSchema.parse({
      ...pointObservation,
      categoryDefinition: "Synthetic category definition.",
      id: "fixture-categorical-observation",
      kind: "categorical",
      representativeKind: "source-observation",
      unit: undefined,
      value: "fixture-category",
      valueSemantics: "categorical",
    });

    expect(result.value).toBe("fixture-category");
    expect(result.sourceId).toBe("fixture-source");
  });

  it.each([
    ["missing source provenance", { sourceId: undefined }],
    ["missing licensing metadata", { license: undefined }],
    ["empty methodology", { methodology: "" }],
    ["empty system boundary", { systemBoundary: "" }],
    ["missing verification date", { lastVerifiedAt: undefined }],
    ["reversed period", { period: { endYear: 2019, startYear: 2020 } }],
  ])("rejects %s", (_label, change) => {
    expect(
      NumericObservationSchema.safeParse({ ...pointObservation, ...change })
        .success,
    ).toBe(false);
  });

  it("rejects reversed ranges and point/range semantic mismatches", () => {
    expect(
      NumericObservationSchema.safeParse({
        ...pointObservation,
        range: {
          kind: "min-max",
          lower: 30,
          representative: 20,
          upper: 10,
        },
        value: undefined,
        valueSemantics: "range",
      }).success,
    ).toBe(false);
    expect(
      NumericObservationSchema.safeParse({
        ...pointObservation,
        range: {
          kind: "min-max",
          lower: 10,
          representative: 20,
          upper: 30,
        },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid calendar dates", () => {
    expect(
      NumericObservationSchema.safeParse({
        ...pointObservation,
        lastVerifiedAt: "2026-02-30",
      }).success,
    ).toBe(false);
  });
});
