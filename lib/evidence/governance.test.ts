import { describe, expect, it } from "vitest";

import type {
  Correction,
  Dataset,
  Geography,
  Metric,
  NumericObservation,
  PublicationRecord,
  Source,
  Study,
  Technology,
} from "./schemas";
import {
  EvidenceAvailabilitySchema,
  assessFreshness,
  canPublishObservation,
  canPublishRawObservation,
  canReadPublication,
  transitionPublication,
} from "./governance";

const license = {
  id: "fixture-license",
  name: "Synthetic fixture license",
  redistribution: "allowed" as const,
};

const observation = {
  datasetId: "fixture-dataset",
  geographyId: "fixture-global",
  geographyScope: "global" as const,
  id: "fixture-observation",
  kind: "numeric" as const,
  lastVerifiedAt: "2026-08-30",
  license,
  methodology: "Synthetic governance method.",
  metricId: "fixture-power",
  period: { endYear: 2025, startYear: 2020 },
  publicationStatus: "published" as const,
  rawAccess: "permitted" as const,
  representativeKind: "source-observation" as const,
  sourceId: "fixture-source",
  studyId: "fixture-study",
  systemBoundary: "Synthetic governance boundary.",
  technologyId: "fixture-technology",
  transformation: [
    {
      description: "No transformation applied.",
      kind: "identity" as const,
    },
  ],
  uncertainty: "Synthetic uncertainty note.",
  unit: "MW",
  value: 1,
  valueSemantics: "point" as const,
} satisfies NumericObservation;

const source = {
  accessedAt: "2026-08-30",
  conflictDisclosure: "No known fixture conflict.",
  id: "fixture-source",
  license,
  publishedAt: "2025-01-15",
  publisher: "Fixture institution",
  sourceTier: "A" as const,
  title: "Synthetic institutional source",
  url: "https://example.com/source",
} satisfies Source;

const publication = {
  datasetVersion: "fixture-v1",
  entityId: "fixture-observation",
  entityType: "observation" as const,
  id: "fixture-publication",
  publishedAt: "2026-08-30",
  reviewedAt: "2026-08-29",
  reviewedBy: "fixture-reviewer",
  status: "published" as const,
} satisfies PublicationRecord;

const technology = {
  description: "Synthetic technology.",
  id: "fixture-technology",
  name: "Fixture technology",
} satisfies Technology;

const geography = {
  id: "fixture-global",
  name: "Fixture global geography",
  scope: "global" as const,
} satisfies Geography;

const study = {
  id: "fixture-study",
  methodology: observation.methodology,
  period: observation.period,
  sourceIds: ["fixture-source"],
  systemBoundary: observation.systemBoundary,
  title: "Synthetic study",
} satisfies Study;

const dataset = {
  checksum: "sha256:fixture-checksum",
  id: "fixture-dataset",
  lastVerifiedAt: "2026-08-30",
  license,
  sourceIds: ["fixture-source"],
  studyIds: ["fixture-study"],
  title: "Synthetic dataset",
  version: "fixture-v1",
} satisfies Dataset;

const metric = {
  category: "technical",
  definition: "Synthetic power metric.",
  canonicalUnit: "MW",
  geographySupport: ["global" as const],
  id: "fixture-power",
  rangeSemantics: "point-or-range" as const,
  supportedUnits: ["MW", "GW"],
  valueKind: "numeric" as const,
} satisfies Metric;

const publicationContext = {
  dataset,
  geography,
  metric,
  publication,
  source,
  study,
  technology,
};

describe("freshness governance", () => {
  it("treats the exact review interval boundary as fresh and the next day as stale", () => {
    expect(
      assessFreshness({
        asOf: "2026-08-30",
        lastVerifiedAt: "2025-08-30",
        reviewIntervalDays: 365,
      }),
    ).toEqual({ ageDays: 365, dueAt: "2026-08-30", status: "fresh" });
    expect(
      assessFreshness({
        asOf: "2026-08-31",
        lastVerifiedAt: "2025-08-30",
        reviewIntervalDays: 365,
      }),
    ).toEqual({ ageDays: 366, dueAt: "2026-08-30", status: "stale" });
  });

  it("rejects invalid dates and review intervals", () => {
    expect(() =>
      assessFreshness({
        asOf: "2026-02-30",
        lastVerifiedAt: "2025-01-01",
        reviewIntervalDays: 365,
      }),
    ).toThrow();
    expect(() =>
      assessFreshness({
        asOf: "2026-01-01",
        lastVerifiedAt: "2025-01-01",
        reviewIntervalDays: 0,
      }),
    ).toThrow();
  });
});

describe("availability states", () => {
  it("represents disputed evidence without numeric confidence", () => {
    expect(
      EvidenceAvailabilitySchema.parse({
        alternativeObservationIds: ["fixture-alternative"],
        broadAgreement: "Synthetic agreement statement.",
        disagreementSummary: "Synthetic methods produce different results.",
        remainingUncertainty: "Synthetic uncertainty remains.",
        representativeObservationId: "fixture-observation",
        status: "disputed",
      }),
    ).toMatchObject({ status: "disputed" });
    expect(
      EvidenceAvailabilitySchema.safeParse({
        status: "disputed",
        confidence: 0.9,
      }).success,
    ).toBe(false);
  });

  it.each([
    "supported",
    "partial",
    "incompatible",
    "unavailable",
    "restricted",
    "stale",
  ] as const)("parses an explicit %s state", (status) => {
    expect(
      EvidenceAvailabilitySchema.parse({
        message: "Synthetic availability explanation.",
        status,
      }),
    ).toEqual({ message: "Synthetic availability explanation.", status });
  });
});

describe("publication policy", () => {
  it.each(["A", "B", "C"] as const)(
    "permits reviewed complete Tier %s evidence",
    (sourceTier) => {
      expect(
        canPublishObservation(observation, {
          ...publicationContext,
          source: { ...source, sourceTier },
        }),
      ).toEqual({ eligible: true, reasons: [] });
    },
  );

  it("rejects incomplete metadata and anonymous draft reads", () => {
    expect(
      canPublishObservation(
        { ...observation, methodology: "" } as NumericObservation,
        publicationContext,
      ),
    ).toMatchObject({ eligible: false, reasons: ["invalid-observation"] });
    expect(
      canReadPublication({ ...publication, status: "draft" }, "anonymous"),
    ).toBe(false);
    expect(canReadPublication(publication, "anonymous")).toBe(true);
    expect(
      canReadPublication({ ...publication, status: "draft" }, "editor"),
    ).toBe(true);
  });

  it("publishes raw observations only when access and redistribution permit", () => {
    expect(canPublishRawObservation(observation, publicationContext)).toEqual({
      eligible: true,
      reasons: [],
    });
    expect(
      canPublishRawObservation(
        {
          ...observation,
          license: { ...license, redistribution: "restricted" },
        },
        publicationContext,
      ),
    ).toMatchObject({
      eligible: false,
      reasons: ["observation-license-mismatch", "redistribution-restricted"],
    });
    expect(
      canPublishRawObservation(
        { ...observation, rawAccess: "restricted" },
        publicationContext,
      ),
    ).toMatchObject({ eligible: false, reasons: ["raw-access-restricted"] });
  });

  it("requires correction history for a material revision of published evidence", () => {
    const correction = {
      affectedEntityId: "fixture-observation",
      affectedEntityType: "observation" as const,
      correctedAt: "2026-08-30",
      correctedVersion: "fixture-v2",
      id: "fixture-correction",
      materialImpact: "material" as const,
      priorVersion: "fixture-v1",
      reason: "Synthetic material correction.",
    } satisfies Correction;
    const revisedPublication = { ...publication, datasetVersion: "fixture-v2" };

    expect(
      canPublishObservation(observation, {
        corrections: [],
        ...publicationContext,
        dataset: { ...dataset, version: "fixture-v2" },
        materialRevisionFrom: "fixture-v1",
        publication: revisedPublication,
      }),
    ).toMatchObject({
      eligible: false,
      reasons: ["missing-material-correction"],
    });
    expect(
      canPublishObservation(observation, {
        corrections: [correction],
        ...publicationContext,
        dataset: { ...dataset, version: "fixture-v2" },
        materialRevisionFrom: "fixture-v1",
        publication: revisedPublication,
      }),
    ).toEqual({ eligible: true, reasons: [] });
  });

  it("rejects dangling relationships, dataset versions, and metric contracts", () => {
    expect(
      canPublishObservation(observation, {
        ...publicationContext,
        dataset: { ...dataset, sourceIds: ["fixture-other-source"] },
      }),
    ).toMatchObject({
      eligible: false,
      reasons: ["dataset-source-mismatch"],
    });
    expect(
      canPublishObservation(observation, {
        ...publicationContext,
        publication: { ...publication, datasetVersion: "fixture-v2" },
      }),
    ).toMatchObject({
      eligible: false,
      reasons: ["dataset-version-mismatch"],
    });
    expect(
      canPublishObservation(
        { ...observation, unit: "MWh" },
        publicationContext,
      ),
    ).toMatchObject({
      eligible: false,
      reasons: ["observation-metric-mismatch"],
    });
  });

  it("uses authoritative source and dataset licences for raw publication", () => {
    expect(
      canPublishRawObservation(observation, {
        ...publicationContext,
        source: {
          ...source,
          license: { ...license, redistribution: "restricted" },
        },
      }),
    ).toMatchObject({
      eligible: false,
      reasons: ["redistribution-restricted"],
    });
    expect(
      canPublishObservation(observation, {
        ...publicationContext,
        dataset: {
          ...dataset,
          license: { ...license, redistribution: "restricted" },
        },
      }),
    ).toMatchObject({
      eligible: false,
      reasons: ["observation-license-mismatch"],
    });
  });
});

describe("publication workflow", () => {
  it("allows review and reviewed publication transitions", () => {
    const draft = { ...publication, status: "draft" as const };
    const review = transitionPublication(draft, "in-review");
    expect(review).toMatchObject({ ok: true, record: { status: "in-review" } });
    if (!review.ok) throw new Error("Expected review transition to succeed.");
    expect(
      transitionPublication(review.record, "published", {
        publishedAt: "2026-08-30",
        reviewedAt: "2026-08-29",
        reviewedBy: "fixture-reviewer",
      }),
    ).toMatchObject({ ok: true, record: { status: "published" } });
  });

  it("rejects skipped review and incomplete publication metadata", () => {
    expect(
      transitionPublication({ ...publication, status: "draft" }, "published"),
    ).toMatchObject({ code: "forbidden-transition", ok: false });
    expect(
      transitionPublication(
        { ...publication, status: "in-review" },
        "published",
        { reviewedBy: "fixture-reviewer" },
      ),
    ).toMatchObject({ code: "invalid-publication-metadata", ok: false });
    expect(
      transitionPublication(
        { ...publication, status: "in-review" },
        "published",
        {
          publishedAt: "2026-08-29",
          reviewedAt: "2026-08-30",
          reviewedBy: "fixture-reviewer",
        },
      ),
    ).toMatchObject({ code: "invalid-publication-metadata", ok: false });
  });
});
