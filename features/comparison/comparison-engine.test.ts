import { withSyntheticReview } from "@/lib/evidence/release-fixtures.test-support";
import { describe, expect, it } from "vitest";

import { LocalEvidenceRepository } from "@/lib/evidence/local-repository";
import type {
  Geography,
  Metric,
  NumericObservation,
  Observation,
  Technology,
} from "@/lib/evidence/schemas";
import type { MetricRelease } from "@/lib/evidence/repository";
import { getComparisonResult } from "./comparison-engine";
import type { ComparisonState } from "./comparison-types";
import type { AvailableComparisonEntry } from "./comparison-result";

describe("getComparisonResult (headless comparison engine)", () => {
  const mockTechA: Technology = {
    id: "tech-nuclear",
    name: "Nuclear",
    description: "Nuclear fission power",
  };

  const mockTechB: Technology = {
    id: "tech-solar",
    name: "Solar",
    description: "Solar photovoltaic power",
  };

  const mockTechC: Technology = {
    id: "tech-coal",
    name: "Coal",
    description: "Coal combustion power",
  };

  const mockGeoGlobal: Geography = {
    id: "global",
    name: "Global",
    scope: "global",
  };

  const mockGeoDE: Geography = {
    id: "de",
    name: "Germany",
    scope: "country",
  };

  const mockGeoFR: Geography = {
    id: "fr",
    name: "France",
    scope: "country",
  };

  const mockMetricGhg: Metric = {
    id: "lifecycle-ghg",
    category: "environment",
    definition: "Lifecycle GHG emissions per unit electricity.",
    valueKind: "numeric",
    canonicalUnit: "gCO2e/kWh",
    rangeSemantics: "point-or-range",
    geographySupport: ["global", "country"],
    supportedUnits: ["gCO2e/kWh", "kgCO2e/MWh"],
  };

  const mockMetricCategorical: Metric = {
    id: "dispatchability",
    category: "technical",
    definition: "Dispatchability profile.",
    valueKind: "categorical",
    rangeSemantics: "categorical",
    geographySupport: ["global"],
  };

  const baseRelease: MetricRelease = {
    metricId: "lifecycle-ghg",
    activeDatasetVersionId: "version-1",
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: ["global", "de", "fr"],
    publicationStatus: "published",
    technologyIds: ["tech-nuclear", "tech-solar", "tech-coal"],
  };

  const categoricalRelease: MetricRelease = {
    metricId: "dispatchability",
    activeDatasetVersionId: "version-1",
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: ["global"],
    publicationStatus: "published",
    technologyIds: ["tech-nuclear", "tech-solar"],
  };

  function createBaseObservation(
    overrides: Partial<NumericObservation>,
  ): NumericObservation {
    return {
      id: "obs-1",
      metricId: "lifecycle-ghg",
      technologyId: "tech-nuclear",
      geographyId: "global",
      geographyScope: "global",
      datasetId: "dataset-1",
      sourceId: "source-1",
      studyId: "study-1",
      methodology: "LCA standard ISO 14040",
      systemBoundary: "Cradle to grave",
      period: { startYear: 2020, endYear: 2024 },
      lastVerifiedAt: "2026-09-01",
      publicationStatus: "published",
      rawAccess: "permitted",
      license: {
        id: "lic-cc0",
        name: "CC0",
        redistribution: "allowed",
      },
      transformation: [{ kind: "identity", description: "Direct extraction" }],
      uncertainty: "p50 central",
      kind: "numeric",
      unit: "gCO2e/kWh",
      valueSemantics: "point",
      representativeKind: "source-observation",
      value: 12,
      ...overrides,
    } as NumericObservation;
  }

  function createRepo(params: {
    observations?: Observation[];
    metrics?: Metric[];
    releases?: MetricRelease[];
    geographies?: Geography[];
    technologies?: Technology[];
    versionMap?: Record<string, string>;
  }) {
    const observations = params.observations ?? [];
    const versionMap: Record<string, string> = params.versionMap ?? {};
    for (const obs of observations) {
      if (!versionMap[obs.id]) {
        versionMap[obs.id] = "version-1";
      }
    }

    return new LocalEvidenceRepository(
      withSyntheticReview({
        geographies: params.geographies ?? [
          mockGeoGlobal,
          mockGeoDE,
          mockGeoFR,
        ],
        technologies: params.technologies ?? [mockTechA, mockTechB, mockTechC],
        metrics: params.metrics ?? [mockMetricGhg, mockMetricCategorical],
        metricReleases: params.releases ?? [baseRelease, categoricalRelease],
        observations,
        observationDatasetVersionIds: versionMap,
      }),
    );
  }

  it("handles absent repository config with honest unavailable status", async () => {
    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, null);
    expect(result.status).toBe("unavailable");
    expect(result.warnings).toContain(
      "Evidence repository is currently unavailable.",
    );
    expect(result.entries[0]).toEqual({
      kind: "missing",
      technologyId: "tech-nuclear",
      message: "Evidence repository is currently unavailable.",
    });
  });

  it("handles unknown metrics with honest unavailable status and warnings", async () => {
    const repo = createRepo({});
    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "non-existent-metric",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    expect(result.status).toBe("unavailable");
    expect(result.warnings[0]).toMatch(/unknown metric/i);
    expect(result.entries[0].kind).toBe("missing");
  });

  it("handles repository query failures gracefully without crashing", async () => {
    const faultyRepo = {
      getMetricDefinition: () => Promise.reject(new Error("Connection reset")),
      listMetricReleases: () => Promise.resolve([]),
      listTechnologies: () => Promise.resolve([]),
      listGeographies: () => Promise.resolve([]),
      getPublishedObservations: () => Promise.resolve([]),
    };

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, faultyRepo);
    expect(result.status).toBe("error");
    expect(result.warnings[0]).toMatch(/failed to retrieve/i);
  });

  it("proves two regions never cross-contaminate", async () => {
    const obsDE = createBaseObservation({
      id: "obs-de",
      technologyId: "tech-nuclear",
      geographyId: "de",
      geographyScope: "country",
      value: 15,
    });
    const obsFR = createBaseObservation({
      id: "obs-fr",
      technologyId: "tech-nuclear",
      geographyId: "fr",
      geographyScope: "country",
      value: 6,
    });

    const repo = createRepo({ observations: [obsDE, obsFR] });

    const stateDE: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "de",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const resultDE = await getComparisonResult(stateDE, repo);
    expect(resultDE.status).toBe("ready");
    expect(resultDE.effectiveGeographyId).toBe("de");
    const entryDE = resultDE.entries[0] as AvailableComparisonEntry;
    expect(entryDE.value).toBe(15);
    expect(entryDE.observationIds).toEqual(["obs-de"]);
    expect(entryDE.observationIds).not.toContain("obs-fr");

    const stateFR: ComparisonState = {
      ...stateDE,
      region: "fr",
    };
    const resultFR = await getComparisonResult(stateFR, repo);
    expect(resultFR.effectiveGeographyId).toBe("fr");
    const entryFR = resultFR.entries[0] as AvailableComparisonEntry;
    expect(entryFR.value).toBe(6);
    expect(entryFR.observationIds).toEqual(["obs-fr"]);
    expect(entryFR.observationIds).not.toContain("obs-de");
  });

  it("yields identical representative when retrieval order is shuffled", async () => {
    const obs1 = createBaseObservation({
      id: "obs-1",
      technologyId: "tech-nuclear",
      value: 10,
    });
    const obs2 = createBaseObservation({
      id: "obs-2",
      technologyId: "tech-nuclear",
      value: 20,
    });

    const repoInOrder = createRepo({ observations: [obs1, obs2] });
    const repoReversed = createRepo({ observations: [obs2, obs1] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result1 = await getComparisonResult(state, repoInOrder);
    const result2 = await getComparisonResult(state, repoReversed);

    expect(result1.entries[0]).toEqual(result2.entries[0]);
    const entry = result1.entries[0] as AvailableComparisonEntry;
    expect(entry.value).toBe(15); // mean of 10 and 20
    expect(entry.observationIds).toEqual(["obs-1", "obs-2"]);
  });

  it("normalizes 1 kgCO2e/MWh to 1 gCO2e/kWh", async () => {
    const obs = createBaseObservation({
      id: "obs-emissions-intensity",
      unit: "kgCO2e/MWh",
      value: 1,
    });

    const repo = createRepo({ observations: [obs] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    const entry = result.entries[0] as AvailableComparisonEntry;
    expect(entry.kind).toBe("available");
    expect(entry.unit).toBe("gCO2e/kWh");
    expect(entry.value).toBe(1);
    expect(entry.numericValue).toBe(1);
  });

  it("retains endpoints for range-only records", async () => {
    const obs = createBaseObservation({
      id: "obs-range",
      valueSemantics: "range",
      value: undefined,
      range: {
        kind: "min-max",
        lower: 5,
        representative: 12,
        upper: 25,
      },
    });

    const repo = createRepo({ observations: [obs] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    const entry = result.entries[0] as AvailableComparisonEntry;
    expect(entry.kind).toBe("available");
    expect(entry.range).toEqual({
      min: 5,
      max: 25,
      semantics: "min-max",
    });
    expect(entry.value).toBe(12);
    expect(entry.numericValue).toBe(12);
  });

  it("ensures a missing record has no numeric field", async () => {
    const repo = createRepo({ observations: [] }); // empty observations

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    expect(result.status).toBe("empty");
    const entry = result.entries[0];
    expect(entry.kind).toBe("missing");
    expect("value" in entry).toBe(false);
    expect("numericValue" in entry).toBe(false);
    if (entry.kind === "missing") {
      expect(entry.message).toMatch(/no published observation found/i);
    }
  });

  it("preserves categorical values as strings without numeric coercion", async () => {
    const catObs: Observation = {
      id: "obs-cat",
      metricId: "dispatchability",
      technologyId: "tech-nuclear",
      geographyId: "global",
      geographyScope: "global",
      datasetId: "dataset-1",
      sourceId: "source-1",
      studyId: "study-1",
      methodology: "Grid stability classification",
      systemBoundary: "Operational dispatch",
      period: { startYear: 2024, endYear: 2024 },
      lastVerifiedAt: "2026-09-01",
      publicationStatus: "published",
      rawAccess: "permitted",
      license: { id: "lic-cc0", name: "CC0", redistribution: "allowed" },
      transformation: [
        { kind: "identity", description: "Direct classification" },
      ],
      uncertainty: "Deterministic",
      kind: "categorical",
      valueSemantics: "categorical",
      representativeKind: "source-observation",
      categoryDefinition: "Firm baseload dispatchability",
      value: "baseload",
    };

    const repo = createRepo({ observations: [catObs] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "dispatchability",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    const entry = result.entries[0] as AvailableComparisonEntry;
    expect(entry.kind).toBe("available");
    expect(entry.valueKind).toBe("categorical");
    expect(entry.value).toBe("baseload");
    expect(entry.numericValue).toBeNull();
  });

  it("produces an incompatible entry when observation boundaries conflict", async () => {
    const obsCradle = createBaseObservation({
      id: "obs-cradle",
      systemBoundary: "Cradle to grave",
      value: 12,
    });
    const obsGate = createBaseObservation({
      id: "obs-gate",
      systemBoundary: "Gate to gate",
      value: 2,
    });

    const repo = createRepo({ observations: [obsCradle, obsGate] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    const entry = result.entries[0];
    expect(entry.kind).toBe("incompatible");
    if (entry.kind === "incompatible") {
      expect(entry.message).toMatch(/incompatible.*boundaries/i);
    }
  });

  it("hides restricted raw observations when mode is raw", async () => {
    const restrictedObs = createBaseObservation({
      id: "obs-restricted",
      rawAccess: "restricted",
      value: 12,
    });

    const repo = {
      getMetricDefinition: () => Promise.resolve(mockMetricGhg),
      listMetricReleases: () => Promise.resolve([baseRelease]),
      listTechnologies: () => Promise.resolve([mockTechA]),
      listGeographies: () => Promise.resolve([mockGeoGlobal]),
      getPublishedObservations: () => Promise.resolve([restrictedObs]),
    };

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "raw",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    const restrictedEntry = result.entries[0];
    expect(restrictedEntry.kind).toBe("restricted");
    expect("value" in restrictedEntry).toBe(false);
    if (restrictedEntry.kind === "restricted") {
      expect(restrictedEntry.message).toMatch(
        /raw observation access is restricted/i,
      );
    }
  });

  it("handles restricted metric releases with honest restricted status", async () => {
    const restrictedRelease: MetricRelease = {
      ...baseRelease,
      availabilityStatus: "restricted",
    };
    const repo = createRepo({ releases: [restrictedRelease] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    expect(result.status).toBe("unavailable");
    expect(result.entries[0].kind).toBe("missing");
  });

  it("falls back to global with warning when country data is missing", async () => {
    const globalObs = createBaseObservation({
      id: "obs-global",
      geographyId: "global",
      value: 12,
    });

    const repo = createRepo({ observations: [globalObs] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "de", // Request Germany, but only Global exists
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    expect(result.effectiveGeographyId).toBe("global");
    expect(
      result.warnings.some((w) => w.includes("Showing Global estimates")),
    ).toBe(true);
    const entry = result.entries[0] as AvailableComparisonEntry;
    expect(entry.kind).toBe("available");
    expect(entry.value).toBe(12);
  });

  it("resolves output provenance IDs to exact observations used", async () => {
    const obs = createBaseObservation({
      id: "exact-obs-id-999",
      datasetId: "stable-dataset-777",
      value: 12,
    });

    const repo = createRepo({ observations: [obs] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    const entry = result.entries[0] as AvailableComparisonEntry;
    expect(entry.evidenceId).toBe("exact-obs-id-999");
    expect(entry.observationIds).toEqual(["exact-obs-id-999"]);
    expect(result.datasetVersionIds).toEqual(["version-1"]);
    expect(entry.datasetVersionId).toBe("version-1");
    expect(result.datasetVersionIds).not.toContain("stable-dataset-777");
  });

  it("resolves explicit representative and emits warning when multi-study observations differ in methodology", async () => {
    const studyA = createBaseObservation({
      id: "obs-study-a",
      methodology: "IPCC AR5 Annex III lifecycle assessment",
      representativeKind: "central-estimate",
      value: 12,
    });
    const studyB = createBaseObservation({
      id: "obs-study-b",
      methodology: "NREL Harmonization review methodology",
      representativeKind: "source-observation",
      value: 14,
    });

    const repo = createRepo({ observations: [studyA, studyB] });

    const state: ComparisonState = {
      sources: ["tech-nuclear"],
      metric: "lifecycle-ghg",
      region: "global",
      mode: "typical",
      units: "scientific",
      level: "curious",
    };

    const result = await getComparisonResult(state, repo);
    expect(result.status).toBe("ready");
    expect(
      result.warnings.some((w) =>
        w.includes("materially different methodologies"),
      ),
    ).toBe(true);

    const entry = result.entries[0];
    expect(entry.kind).toBe("available");
    if (entry.kind === "available") {
      expect(entry.value).toBe(12);
      expect(entry.observationIds).toEqual(["obs-study-a"]);
    }
  });
});
