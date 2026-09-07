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
      label: "Range evidence unavailable",
    });
  });
});
