import { expect, test } from "vitest";
import { simulateAnnualGrid } from "./grid-model";
import type { GridScenario } from "./schemas";

test("simulateAnnualGrid correctly calculates annual generation and shortfall", () => {
  const scenario: GridScenario = {
    id: "test",
    cityPopulation: 1000000,
    peakDemandMw: 1000, // Avg Demand = 600 MW -> Total Demand = 600 * 8760 = 5,256,000 MWh
    sources: [
      {
        id: "nuclear",
        name: "Nuclear",
        capacityMw: 500,
        capacityFactor: 0.9,
        isDispatchable: true,
      }, // Gen = 500 * 0.9 * 8760 = 3,942,000 MWh
      {
        id: "solar",
        name: "Solar",
        capacityMw: 500,
        capacityFactor: 0.2,
        isDispatchable: false,
      }, // Gen = 500 * 0.2 * 8760 = 876,000 MWh
    ],
  };

  const result = simulateAnnualGrid(scenario);

  expect(result.totalDemandMwh).toBe(5256000);
  expect(result.dispatchableGenerationMwh).toBe(3942000);
  expect(result.variableGenerationMwh).toBe(876000);
  expect(result.totalGenerationMwh).toBe(4818000);
  expect(result.shortfallMwh).toBe(5256000 - 4818000); // 438,000 MWh
  expect(result.reliabilityPercent).toBeLessThan(100);
});
