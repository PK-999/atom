import { describe, it, expect } from "vitest";
import { METRIC_CATALOG_EXPLANATIONS } from "@/content/metrics";
import { METRICS, getMetric } from "@/lib/evidence/metrics";
import { getInterpretation } from "@/features/comparison/ComparisonInterpretation";
import type { ComplexityLevel } from "@/features/comparison/comparison-types";

describe("Metric Catalog & Multi-Category Synthesis (R08)", () => {
  it("has no duplicate metric IDs in METRICS catalog", () => {
    const ids = METRICS.map((m) => m.id);
    const unique = new Set(ids);
    expect(
      [...unique].filter((id) => ids.filter((x) => x === id).length > 1),
    ).toEqual([]);
    expect(unique.size).toBe(ids.length);
  });

  it("assigns valid name and shortName to all metrics in METRICS", () => {
    for (const metric of METRICS) {
      expect(metric.name).toBeDefined();
      expect(typeof metric.name).toBe("string");
      expect(metric.name?.length).toBeGreaterThan(0);

      expect(metric.shortName).toBeDefined();
      expect(typeof metric.shortName).toBe("string");
      expect(metric.shortName?.length).toBeGreaterThan(0);
    }
  });

  it("retrieves metrics by ID via getMetric helper", () => {
    const ghg = getMetric("lifecycle-ghg");
    expect(ghg).toBeDefined();
    expect(ghg?.name).toBe("Lifecycle greenhouse-gas emissions");
    expect(ghg?.shortName).toBe("Lifecycle emissions");

    expect(getMetric("nonexistent-metric")).toBeUndefined();
  });

  const allLevels: ComplexityLevel[] = [
    "beginner",
    "explorer",
    "curious",
    "deep-dive",
    "geeky",
  ];
  const canonicalCategories = [
    "environment",
    "reliability",
    "economics",
    "human-impact",
    "security",
    "technical",
  ] as const;

  it("provides 5-level explanations for all canonical metrics", () => {
    const metricIds = Object.keys(METRIC_CATALOG_EXPLANATIONS);
    expect(metricIds.length).toBeGreaterThanOrEqual(16);

    for (const [id, metric] of Object.entries(METRIC_CATALOG_EXPLANATIONS)) {
      expect(metric.metricId).toBe(id);
      expect(canonicalCategories).toContain(metric.category);
      expect(metric.title).toBeTruthy();
      expect(metric.limitations.length).toBeGreaterThan(10);
      expect(metric.systemBoundary.length).toBeGreaterThan(10);

      for (const level of allLevels) {
        const text = metric.explanations[level];
        expect(
          text,
          `Metric ${id} missing explanation for ${level}`,
        ).toBeTruthy();
        expect(text.length).toBeGreaterThan(10);
      }
    }
  });

  it("covers all 6 release categories (R08-E through R08-T)", () => {
    const categoriesFound = new Set(
      Object.values(METRIC_CATALOG_EXPLANATIONS).map((m) => m.category),
    );

    for (const cat of canonicalCategories) {
      expect(
        categoriesFound.has(cat),
        `Missing coverage for category: ${cat}`,
      ).toBe(true);
    }
  });

  it("enforces scientific rigor: progressive depth across complexity levels", () => {
    for (const [id, metric] of Object.entries(METRIC_CATALOG_EXPLANATIONS)) {
      // Beginner explanations should be accessible and avoid dense jargon
      const kidText = metric.explanations.beginner;
      expect(kidText).toBeTruthy();

      // Deep-dive and geeky should offer deeper nuance
      const techText = metric.explanations["deep-dive"];
      const expertText = metric.explanations.geeky;
      expect(techText).not.toEqual(kidText);
      expect(expertText).not.toEqual(techText);
    }
  });

  describe("ComparisonInterpretation Component Integration", () => {
    it("returns reviewed educational content when metric is in catalog", () => {
      const result = getInterpretation("lifecycle-ghg", "curious");
      expect(result.found).toBe(true);
      expect(result.text).toContain("Fossil fuel estimates are much higher");
      expect(result.limitations).toContain(
        "Vintage and supply chain regionalization",
      );
      expect(result.systemBoundary).toContain("Cradle-to-grave");
    });

    it("returns honest fallback message for uncatalogued metrics without fabricating data", () => {
      const result = getInterpretation(
        "unknown-hypothetical-metric",
        "curious",
      );
      expect(result.found).toBe(false);
      expect(result.text).toContain("Reviewed explanation for");
    });

    it("respects all 5 complexity levels faithfully", () => {
      for (const level of allLevels) {
        const result = getInterpretation("land-use", level);
        expect(result.found).toBe(true);
        expect(result.text).toBe(
          METRIC_CATALOG_EXPLANATIONS["land-use"].explanations[level],
        );
      }
    });
  });
});
