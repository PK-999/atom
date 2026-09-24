import { describe, it, expect } from "vitest";
import { fetchComparisonData } from "./comparison-api";
import { PUBLISHED_METRIC_RELEASES } from "@/lib/evidence/published-evidence";
import { getMetric } from "@/lib/evidence/metrics";
import { getUnitDisplayLabel } from "@/lib/evidence/units";
import type { ComparisonState } from "./comparison-types";

describe("comparison-api", () => {
  const baseState: ComparisonState = {
    sources: ["nuclear", "solar", "wind", "gas", "coal"],
    metric: "lifecycle-ghg",
    region: "global",
    mode: "typical",
    units: "scientific",
    level: "curious",
  };

  it("fetches preview comparison data for default state", async () => {
    const comparison = await fetchComparisonData(baseState);

    expect(comparison.metricId).toBe("lifecycle-ghg");
    expect(comparison.metricName).toBe("Lifecycle greenhouse-gas emissions");
    expect(comparison.metricShortName).toBe("Lifecycle emissions");
    expect(comparison.unit).toBe("g CO₂e / kWh");
    expect(comparison.observations.length).toBeGreaterThanOrEqual(5);

    const nuclear = comparison.observations.find(
      (o) => o.technologyId === "nuclear",
    );
    expect(nuclear).toBeDefined();
    expect(nuclear?.evidenceStatus).toBe("reviewed");
    expect(nuclear?.typicalValue).toBe(12);
  });

  it("ensures every published metric release has a valid metric definition with name and shortName", () => {
    expect(PUBLISHED_METRIC_RELEASES.length).toBeGreaterThan(0);

    for (const release of PUBLISHED_METRIC_RELEASES) {
      const metric = getMetric(release.metricId);
      expect(
        metric,
        `Metric ${release.metricId} from PUBLISHED_METRIC_RELEASES must exist in METRICS catalog`,
      ).toBeDefined();

      expect(metric?.name).toBeTruthy();
      expect(metric?.shortName).toBeTruthy();
      if (metric?.valueKind === "numeric") {
        expect(metric.canonicalUnit).toBeTruthy();
        const displayUnit = getUnitDisplayLabel(metric.canonicalUnit);
        expect(displayUnit).toBeTruthy();
      }
    }
  });

  it("successfully fetches comparison data for every published metric release", async () => {
    for (const release of PUBLISHED_METRIC_RELEASES) {
      const state: ComparisonState = {
        ...baseState,
        metric: release.metricId,
        sources: [...release.technologyIds.slice(0, 3)],
      };

      const comparison = await fetchComparisonData(state);
      expect(comparison.metricId).toBe(release.metricId);
      expect(comparison.metricName).toBeTruthy();
      expect(comparison.metricShortName).toBeTruthy();
      expect(comparison.unit).toBeTruthy();
      expect(comparison.observations).toBeDefined();
      expect(Array.isArray(comparison.observations)).toBe(true);
    }
  });

  it("handles unknown metrics gracefully without throwing", async () => {
    const state: ComparisonState = {
      ...baseState,
      metric: "unknown-metric",
    };

    const comparison = await fetchComparisonData(state);
    expect(comparison.metricId).toBe("unknown-metric");
    expect(comparison.observations).toBeDefined();
  });

  it("handles unreviewed/unknown technologies by returning placeholder rows", async () => {
    const state: ComparisonState = {
      ...baseState,
      sources: ["nuclear", "fusion-experimental"],
    };

    const comparison = await fetchComparisonData(state);
    const placeholder = comparison.observations.find(
      (o) => o.technologyId === "fusion-experimental",
    );
    expect(placeholder).toBeDefined();
    expect(placeholder?.evidenceStatus).toBe("unreviewed");
    expect(placeholder?.typicalValue).toBeNull();
  });
});
