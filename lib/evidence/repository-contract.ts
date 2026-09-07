import { describe, expect, it } from "vitest";

import type { EvidenceSnapshot } from "./local-repository";
import type { EvidenceRepository } from "./repository";
import type { NumericPointObservation } from "./schemas";

export type EvidenceRepositoryFactory = (
  snapshot: EvidenceSnapshot,
) => EvidenceRepository | Promise<EvidenceRepository>;
export type EvidenceSnapshotFactory = () => EvidenceSnapshot;

export function createEvidenceRepositoryContractSnapshot(): EvidenceSnapshot {
  return {
    geographies: [
      { id: "fixture-region", name: "Fixture region", scope: "region" },
      { id: "fixture-global", name: "Fixture global", scope: "global" },
    ],
    metricReleases: [
      {
        activeDatasetVersionId: "fixture-version-active",
        availabilityStatus: "supported",
        featureEnabled: true,
        geographyIds: ["fixture-region", "fixture-global"],
        metricId: "fixture-metric-2",
        publicationStatus: "published",
        technologyIds: ["fixture-technology-b", "fixture-technology-a"],
      },
      {
        activeDatasetVersionId: "fixture-version-active",
        availabilityStatus: "supported",
        featureEnabled: true,
        geographyIds: ["fixture-region", "fixture-global"],
        metricId: "fixture-metric",
        publicationStatus: "published",
        technologyIds: ["fixture-technology-b", "fixture-technology-a"],
      },
    ],
    metrics: [
      {
        canonicalUnit: "MW",
        category: "fixture-category",
        definition:
          "A synthetic metric used only for repository contract tests.",
        geographySupport: ["global", "region"],
        id: "fixture-metric",
        rangeSemantics: "point-or-range",
        supportedUnits: ["MW"],
        valueKind: "numeric",
      },
      {
        canonicalUnit: "MW",
        category: "fixture-category",
        definition: "A draft metric that must never be returned.",
        geographySupport: ["global"],
        id: "fixture-draft-metric",
        rangeSemantics: "point",
        supportedUnits: ["MW"],
        valueKind: "numeric",
      },
      {
        canonicalUnit: "MW",
        category: "fixture-category",
        definition: "A second published metric used for ordering tests.",
        geographySupport: ["global", "region"],
        id: "fixture-metric-2",
        rangeSemantics: "point",
        supportedUnits: ["MW"],
        valueKind: "numeric",
      },
    ],
    observations: [
      pointObservation({
        id: "fixture-observation-b",
        technologyId: "fixture-technology-b",
        value: 2,
      }),
      pointObservation({
        id: "fixture-observation-a",
        technologyId: "fixture-technology-a",
        value: 1,
      }),
      pointObservation({
        id: "fixture-observation-inactive",
        technologyId: "fixture-technology-a",
        value: 3,
      }),
      pointObservation({
        id: "fixture-observation-draft",
        publicationStatus: "draft",
        technologyId: "fixture-technology-a",
        value: 4,
      }),
      pointObservation({
        id: "fixture-observation-raw-restricted",
        period: { endYear: 2016, startYear: 2016 },
        rawAccess: "restricted",
        technologyId: "fixture-technology-a",
        value: 5,
      }),
      pointObservation({
        id: "fixture-observation-raw-unavailable",
        period: { endYear: 2017, startYear: 2017 },
        rawAccess: "unavailable",
        technologyId: "fixture-technology-a",
        value: 6,
      }),
      pointObservation({
        id: "fixture-observation-redistribution-restricted",
        license: {
          id: "fixture-license-restricted",
          name: "Synthetic restricted fixture license",
          redistribution: "restricted" as const,
          url: "https://example.com/restricted-license",
        },
        period: { endYear: 2018, startYear: 2018 },
        rawAccess: "restricted",
        technologyId: "fixture-technology-a",
        value: 7,
      }),
      pointObservation({
        id: "fixture-observation-redistribution-unknown",
        license: {
          id: "fixture-license-unknown",
          name: "Synthetic unknown fixture license",
          redistribution: "unknown" as const,
          url: "https://example.com/unknown-license",
        },
        period: { endYear: 2019, startYear: 2019 },
        rawAccess: "unavailable",
        technologyId: "fixture-technology-a",
        value: 8,
      }),
    ],
    observationDatasetVersionIds: {
      "fixture-observation-a": "fixture-version-active",
      "fixture-observation-b": "fixture-version-active",
      "fixture-observation-draft": "fixture-version-active",
      "fixture-observation-inactive": "fixture-version-inactive",
      "fixture-observation-raw-restricted": "fixture-version-active",
      "fixture-observation-raw-unavailable": "fixture-version-active",
      "fixture-observation-redistribution-restricted": "fixture-version-active",
      "fixture-observation-redistribution-unknown": "fixture-version-active",
    },
    technologies: [
      {
        description: "Second synthetic technology.",
        id: "fixture-technology-b",
        name: "Beta technology",
      },
      {
        description: "First synthetic technology.",
        id: "fixture-technology-a",
        name: "Alpha technology",
      },
      {
        description: "An unpublished development technology.",
        id: "fixture-technology-draft",
        name: "Draft technology",
      },
    ],
  };
}

function pointObservation(
  overrides: Partial<NumericPointObservation>,
): NumericPointObservation {
  return {
    datasetId: "fixture-dataset",
    geographyId: "fixture-global",
    geographyScope: "global" as const,
    id: "fixture-observation",
    kind: "numeric" as const,
    lastVerifiedAt: "2026-09-01",
    license: {
      id: "fixture-license",
      name: "Synthetic fixture license",
      redistribution: "allowed" as const,
      url: "https://example.com/license",
    },
    methodology: "Synthetic repository-contract methodology.",
    metricId: "fixture-metric",
    period: { endYear: 2025, startYear: 2020 },
    publicationStatus: "published" as const,
    rawAccess: "permitted" as const,
    representativeKind: "source-observation" as const,
    sourceId: "fixture-source",
    studyId: "fixture-study",
    systemBoundary: "Synthetic repository-contract boundary.",
    technologyId: "fixture-technology-a",
    transformation: [
      {
        description: "The fixture has no transformation.",
        kind: "identity" as const,
      },
    ],
    uncertainty: "Synthetic contract uncertainty.",
    unit: "MW",
    value: 1,
    valueSemantics: "point" as const,
    ...overrides,
  };
}

export function runEvidenceRepositoryContract(
  createRepository: EvidenceRepositoryFactory,
  createSnapshot: EvidenceSnapshotFactory = createEvidenceRepositoryContractSnapshot,
): void {
  describe("EvidenceRepository contract", () => {
    const snapshot = createSnapshot();
    const [metric, draftMetric] = snapshot.metrics;
    const secondMetricId = snapshot.metricReleases
      .map((release) => release.metricId)
      .filter((metricId) => metricId !== metric.id)
      .sort()[0]!;
    const secondMetric = snapshot.metrics.find(
      (candidate) => candidate.id === secondMetricId,
    )!;
    const global = snapshot.geographies.find((geography) =>
      geography.id.endsWith("global"),
    )!;
    const region = snapshot.geographies.find((geography) =>
      geography.id.endsWith("region"),
    )!;
    const technologyB = snapshot.technologies.find((technology) =>
      technology.id.endsWith("technology-b"),
    )!;
    const technologyA = snapshot.technologies.find((technology) =>
      technology.id.endsWith("technology-a"),
    )!;
    const observationA = snapshot.observations.find((observation) =>
      observation.id.endsWith("observation-a"),
    )!;
    const observationB = snapshot.observations.find((observation) =>
      observation.id.endsWith("observation-b"),
    )!;

    async function repository() {
      return createRepository(snapshot);
    }

    it("returns a published metric and null for a missing metric", async () => {
      const subject = await repository();

      await expect(
        subject.getMetricDefinition(metric.id),
      ).resolves.toMatchObject({
        id: metric.id,
      });
      await expect(
        subject.getMetricDefinition(`missing-${draftMetric.id}`),
      ).resolves.toBeNull();
    });

    it("returns releases, technologies, and metric geographies in stable order", async () => {
      const subject = await repository();

      const releases = await subject.listMetricReleases();
      expect(releases).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ metricId: metric.id }),
          expect.objectContaining({ metricId: secondMetric.id }),
        ]),
      );
      const technologies = await subject.listTechnologies();
      expect(technologies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: technologyA.id }),
          expect.objectContaining({ id: technologyB.id }),
        ]),
      );
      await expect(subject.listGeographies(metric.id)).resolves.toEqual([
        expect.objectContaining({ id: global.id }),
        expect.objectContaining({ id: region.id }),
      ]);
    });

    it("filters observations by technology and geography", async () => {
      const subject = await repository();

      await expect(
        subject.getPublishedObservations({
          geographyIds: [global.id],
          metricId: metric.id,
          technologyIds: [technologyB.id],
        }),
      ).resolves.toMatchObject([{ id: observationB.id }]);
      await expect(
        subject.getPublishedObservations({
          geographyIds: [region.id],
          metricId: metric.id,
        }),
      ).resolves.toEqual([]);
    });

    it("returns only permitted observations from the release active version", async () => {
      const subject = await repository();

      await expect(
        subject.getPublishedObservations({ metricId: metric.id }),
      ).resolves.toEqual([
        expect.objectContaining({ id: observationA.id }),
        expect.objectContaining({ id: observationB.id }),
      ]);
    });

    it("deep freezes records returned to callers", async () => {
      const subject = await repository();
      const metricDefinition = await subject.getMetricDefinition(metric.id);
      const releases = await subject.listMetricReleases();
      const technologies = await subject.listTechnologies();
      const geographies = await subject.listGeographies(metric.id);
      const observations = await subject.getPublishedObservations({
        metricId: metric.id,
      });

      expect(metricDefinition).not.toBeNull();
      expect(Object.isFrozen(metricDefinition)).toBe(true);
      expect(Object.isFrozen(metricDefinition!.geographySupport)).toBe(true);
      if (metricDefinition!.valueKind === "numeric") {
        expect(Object.isFrozen(metricDefinition!.supportedUnits)).toBe(true);
      }
      expect(Object.isFrozen(releases)).toBe(true);
      expect(Object.isFrozen(releases[0])).toBe(true);
      expect(Object.isFrozen(releases[0].technologyIds)).toBe(true);
      expect(Object.isFrozen(technologies)).toBe(true);
      expect(Object.isFrozen(technologies[0])).toBe(true);
      expect(Object.isFrozen(geographies)).toBe(true);
      expect(Object.isFrozen(geographies[0])).toBe(true);
      expect(Object.isFrozen(observations)).toBe(true);
      expect(Object.isFrozen(observations[0])).toBe(true);
      expect(Object.isFrozen(observations[0].period)).toBe(true);
      expect(Object.isFrozen(observations[0].transformation)).toBe(true);
      expect(Object.isFrozen(observations[0].transformation[0])).toBe(true);
    });
  });
}
