import { describe, expect, it } from "vitest";

import {
  NumericObservationSchema,
  PublicationRecordSchema,
  SourceSchema,
  assessComparability,
  canPublishObservation,
  normalizeObservation,
  selectRepresentative,
} from ".";

describe("public evidence-domain contract", () => {
  it("supports the complete framework-independent decision flow", () => {
    const license = {
      id: "fixture-license",
      name: "Synthetic fixture license",
      redistribution: "allowed" as const,
    };
    const source = SourceSchema.parse({
      accessedAt: "2026-08-30",
      conflictDisclosure: "No known fixture conflict.",
      id: "fixture-source",
      license,
      publishedAt: "2025-01-15",
      publisher: "Fixture institution",
      sourceTier: "A",
      title: "Synthetic institutional source",
      url: "https://example.com/source",
    });
    const observation = NumericObservationSchema.parse({
      datasetId: "fixture-dataset",
      geographyId: "fixture-global",
      geographyScope: "global",
      id: "fixture-observation",
      kind: "numeric",
      lastVerifiedAt: "2026-08-30",
      license,
      methodology: "Synthetic integration method.",
      metricId: "fixture-power",
      period: { endYear: 2025, startYear: 2020 },
      publicationStatus: "published",
      rawAccess: "permitted",
      representativeKind: "source-observation",
      sourceId: "fixture-source",
      studyId: "fixture-study",
      systemBoundary: "Synthetic integration boundary.",
      technologyId: "fixture-technology",
      transformation: {
        description: "No transformation applied.",
        kind: "identity",
      },
      uncertainty: "Synthetic uncertainty note.",
      unit: "GW",
      value: 1,
      valueSemantics: "point",
    });
    const publication = PublicationRecordSchema.parse({
      datasetVersion: "fixture-v1",
      entityId: "fixture-observation",
      entityType: "observation",
      id: "fixture-publication",
      publishedAt: "2026-08-30",
      reviewedAt: "2026-08-29",
      reviewedBy: "fixture-reviewer",
      status: "published",
    });
    const normalized = normalizeObservation(observation, "MW");

    expect(normalized).toMatchObject({ unit: "MW", value: 1_000 });
    expect(selectRepresentative([normalized], "mean")).toMatchObject({
      ok: true,
      value: 1_000,
    });
    expect(assessComparability([normalized, normalized])).toEqual({
      comparable: true,
      issues: [],
    });
    expect(canPublishObservation(observation, { publication, source })).toEqual(
      { eligible: true, reasons: [] },
    );
  });
});
