import { describe, expect, it } from "vitest";
import {
  simulateAnnualGrid,
  getDefaultScenario,
  HOURLY_ADEQUACY_DISCLAIMER,
} from "./grid-model";
import type { GridScenario } from "./schemas";

describe("Annual Grid Model Arithmetic (R17)", () => {
  it("computes exact canonical case: 1000 MW * 0.9 * 8760 = 7,884,000 MWh", () => {
    const scenario: GridScenario = {
      id: "canonical-nuclear",
      name: "Canonical Nuclear 1000 MW",
      year: 2025,
      hoursPerYear: 8760,
      annualDemandMwh: 10000000,
      sources: [
        {
          id: "nuclear",
          name: "Nuclear",
          capacityMw: 1000,
          capacityFactor: 0.9,
          isDispatchable: true,
        },
      ],
    };

    const result = simulateAnnualGrid(scenario);
    expect(result.totalGenerationMwh).toBe(7884000);
    expect(result.dispatchableGenerationMwh).toBe(7884000);
    expect(result.variableGenerationMwh).toBe(0);
    expect(result.totalDemandMwh).toBe(10000000);
    expect(result.shortfallMwh).toBe(10000000 - 7884000); // 2,116,000
    expect(result.surplusMwh).toBe(0);
    expect(result.annualEnergyCoveragePercent).toBeCloseTo(78.84, 2);
  });

  it("handles leap year with 8784 hours: 1000 MW * 0.9 * 8784 = 7,905,600 MWh", () => {
    const scenario: GridScenario = {
      id: "leap-case",
      name: "Leap Case 2024",
      year: 2024,
      hoursPerYear: 8784,
      annualDemandMwh: 10000000,
      sources: [
        {
          id: "nuclear",
          name: "Nuclear",
          capacityMw: 1000,
          capacityFactor: 0.9,
          isDispatchable: true,
        },
      ],
    };

    const result = simulateAnnualGrid(scenario);
    expect(result.totalGenerationMwh).toBe(7905600);
  });

  it("handles all zeros edge case (demand = 0, generation = 0)", () => {
    const scenario: GridScenario = {
      id: "all-zeros",
      name: "All Zeros",
      year: 2025,
      hoursPerYear: 8760,
      annualDemandMwh: 0,
      sources: [
        {
          id: "solar",
          name: "Solar",
          capacityMw: 0,
          capacityFactor: 0,
          isDispatchable: false,
        },
      ],
    };

    const result = simulateAnnualGrid(scenario);
    expect(result.totalGenerationMwh).toBe(0);
    expect(result.totalDemandMwh).toBe(0);
    expect(result.shortfallMwh).toBe(0);
    expect(result.surplusMwh).toBe(0);
    expect(result.annualEnergyCoveragePercent).toBeNull(); // N/A when demand is 0
  });

  it("handles capacity factor edge cases (0 and 1)", () => {
    const scenario: GridScenario = {
      id: "factor-extremes",
      name: "Factor Extremes",
      year: 2025,
      hoursPerYear: 8760,
      annualDemandMwh: 10000000,
      sources: [
        {
          id: "offline",
          name: "Zero Factor Source",
          capacityMw: 500,
          capacityFactor: 0,
          isDispatchable: true,
        },
        {
          id: "continuous",
          name: "Full Factor Source",
          capacityMw: 500,
          capacityFactor: 1,
          isDispatchable: true,
        },
      ],
    };

    const result = simulateAnnualGrid(scenario);
    expect(result.totalGenerationMwh).toBe(500 * 1 * 8760); // 4,380,000 MWh
    expect(result.sourcesBreakdown[0].annualGenerationMwh).toBe(0);
    expect(result.sourcesBreakdown[1].annualGenerationMwh).toBe(4380000);
  });

  it("handles fractional inputs accurately", () => {
    const scenario: GridScenario = {
      id: "fractional-inputs",
      name: "Fractional Inputs",
      year: 2025,
      hoursPerYear: 8760,
      annualDemandMwh: 543210.5,
      sources: [
        {
          id: "wind",
          name: "Wind",
          capacityMw: 123.45,
          capacityFactor: 0.345,
          isDispatchable: false,
        },
      ],
    };

    const result = simulateAnnualGrid(scenario);
    const expected = 123.45 * 0.345 * 8760;
    expect(result.totalGenerationMwh).toBeCloseTo(expected, 3);
  });

  it("calculates surplus correctly when generation exceeds demand", () => {
    const scenario: GridScenario = {
      id: "surplus-case",
      name: "Surplus Grid",
      year: 2025,
      hoursPerYear: 8760,
      annualDemandMwh: 5000000,
      sources: [
        {
          id: "nuclear",
          name: "Nuclear",
          capacityMw: 1000,
          capacityFactor: 0.9,
          isDispatchable: true,
        }, // 7,884,000 MWh
      ],
    };

    const result = simulateAnnualGrid(scenario);
    expect(result.totalGenerationMwh).toBe(7884000);
    expect(result.shortfallMwh).toBe(0);
    expect(result.surplusMwh).toBe(7884000 - 5000000); // 2,884,000
    expect(result.annualEnergyCoveragePercent).toBe(100);
  });

  it("provides explicit hourly adequacy disclaimer", () => {
    const scenario = getDefaultScenario();
    const result = simulateAnnualGrid(scenario);

    expect(result.hourlyAdequacyDisclaimer).toBe(HOURLY_ADEQUACY_DISCLAIMER);
    expect(result.hourlyAdequacyDisclaimer).toContain(
      "NOT represent real-time hourly reliability",
    );
  });

  it("calculates weighted lifecycle carbon intensity and annual emissions", () => {
    const scenario = getDefaultScenario();
    const result = simulateAnnualGrid(scenario);

    // Balanced clean scenario consists of low-carbon sources (nuclear, solar, wind, hydro)
    // Weighted carbon intensity should be well below 50 gCO2e/kWh
    expect(result.weightedCarbonIntensityGPerKwh).toBeGreaterThan(10);
    expect(result.weightedCarbonIntensityGPerKwh).toBeLessThan(50);
    expect(result.totalAnnualCarbonEmissionsTonnes).toBeGreaterThan(0);

    // Verify individual source carbon attributes
    const nuclearSource = result.sourcesBreakdown.find(
      (s) => s.id === "nuclear",
    );
    expect(nuclearSource?.carbonIntensityGPerKwh).toBe(12);
    expect(nuclearSource?.annualCarbonEmissionsTonnes).toBeGreaterThan(0);
  });
});
