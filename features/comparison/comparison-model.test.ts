import { describe, expect, it } from "vitest";

import { projectObservation } from "./comparison-model";
import { mockComparison } from "./test-fixtures";

describe("projectObservation", () => {
  it("keeps the preview representative value visible in typical mode", () => {
    const nuclear = mockComparison.observations.find(
      (observation) => observation.technologyId === "nuclear",
    );

    expect(nuclear).toBeDefined();
    expect(projectObservation(nuclear!, "typical")).toEqual({
      kind: "value",
      label: "12",
      value: 12,
    });
  });

  it("reports unavailable range evidence instead of manufacturing a range", () => {
    const nuclear = mockComparison.observations.find(
      (observation) => observation.technologyId === "nuclear",
    );

    expect(nuclear).toBeDefined();
    expect(projectObservation(nuclear!, "range")).toEqual({
      kind: "unavailable",
      label: "Range evidence pending review",
    });
  });

  it("calculates human equivalents when unitMode is human and assumption exists", () => {
    const nuclear = mockComparison.observations.find(
      (observation) => observation.technologyId === "nuclear",
    );
    expect(nuclear).toBeDefined();

    // Nuclear 12 gCO2e/kWh / 120 g/km = 0.1 km driving eq.
    const projection = projectObservation(
      nuclear!,
      "typical",
      "human",
      "lifecycle-ghg",
    );
    expect(projection).toEqual({
      kind: "value",
      label: "0.1 km driving eq.",
      value: 0.1,
    });
  });

  it("calculates human equivalents for range mode when range exists", () => {
    const obsWithRange = {
      ...mockComparison.observations[0],
      range: {
        min: 6,
        max: 24,
        semantics: "min-max" as const,
      },
    };

    // 6 / 120 = 0.05, 24 / 120 = 0.2
    const projection = projectObservation(
      obsWithRange,
      "range",
      "human",
      "lifecycle-ghg",
    );
    expect(projection).toEqual({
      kind: "value",
      label: "0.05 – 0.2 km driving eq.",
      value: obsWithRange.typicalValue,
    });
  });

  it("returns scientific values when unitMode is scientific even if human equivalent exists", () => {
    const nuclear = mockComparison.observations.find(
      (observation) => observation.technologyId === "nuclear",
    );
    const projection = projectObservation(
      nuclear!,
      "typical",
      "scientific",
      "lifecycle-ghg",
    );
    expect(projection).toEqual({
      kind: "value",
      label: "12",
      value: 12,
    });
  });
});
