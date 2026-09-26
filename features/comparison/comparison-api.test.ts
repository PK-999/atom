import { describe, it, expect } from "vitest";
import { fetchComparisonData } from "./comparison-api";
import {
  PUBLISHED_EVIDENCE_SNAPSHOT,
  PUBLISHED_METRICS,
} from "@/lib/evidence/published-evidence";
import { LocalEvidenceRepository } from "@/lib/evidence/local-repository";
import { createEvidenceRepositoryContractSnapshot } from "@/lib/evidence/repository-contract";
import type { ComparisonState } from "./comparison-types";

const base: ComparisonState = {
  sources: ["nuclear", "solar", "gas"],
  metric: "lifecycle-ghg",
  region: "global",
  mode: "typical",
  units: "scientific",
  level: "curious",
};
describe("comparison API release boundary", () => {
  it("keeps known metric names/units while unreviewed numerical releases are unavailable", async () => {
    for (const metric of PUBLISHED_METRICS) {
      const comparison = await fetchComparisonData({
        ...base,
        metric: metric.id,
      });
      expect(comparison.metricName).toBe(metric.name);
      expect(comparison.unit).not.toBe("unknown");
      expect(comparison.observations).toHaveLength(3);
      expect(
        comparison.observations.every(
          (o) =>
            o.typicalValue === null &&
            o.range === null &&
            o.evidenceStatus === "unreviewed",
        ),
      ).toBe(true);
      expect(comparison.datasetVersionIds).toEqual([]);
      expect(comparison.warnings?.join(" ")).toMatch(/not yet released/);
    }
  });
  it("does not create observations, licences, dates or reviews for the legacy catalog", () => {
    expect(PUBLISHED_EVIDENCE_SNAPSHOT.observations).toEqual([]);
    expect(PUBLISHED_EVIDENCE_SNAPSHOT.metricReleases).toEqual([]);
    expect(PUBLISHED_EVIDENCE_SNAPSHOT.provenance?.versions).toEqual([]);
  });
  it("projects eligible synthetic evidence through the same adapter", async () => {
    const repository = new LocalEvidenceRepository(
      createEvidenceRepositoryContractSnapshot(),
    );
    const result = await fetchComparisonData(
      {
        ...base,
        metric: "fixture-metric",
        sources: ["fixture-technology-a", "missing-technology"],
        region: "fixture-global",
      },
      repository,
    );
    expect(result.observations[0]).toMatchObject({
      typicalValue: 1,
      evidenceStatus: "reviewed",
      datasetVersionId: "fixture-version-active",
    });
    expect(result.observations[1]).toMatchObject({
      typicalValue: null,
      evidenceStatus: "unreviewed",
    });
  });
  it("preserves unknown requests without borrowing another metric's unit or value", async () => {
    const result = await fetchComparisonData({
      ...base,
      metric: "unknown-metric",
      sources: ["fusion-experimental"],
    });
    expect(result.metricId).toBe("unknown-metric");
    expect(result.observations[0].typicalValue).toBeNull();
    expect(result.observations[0].source).toBeNull();
    expect(result.unit).not.toContain("CO₂");
  });
});
