import { describe, expect, it } from "vitest";
import {
  EnergyMixSchema,
  ThreeStageProgramStageSchema,
  NationalScenarioSchema,
} from "./schemas";

describe("National Profile Schemas (R16-I)", () => {
  it("validates a complete energy mix with distinct generation and capacity shares summing to 100%", () => {
    const validMix = {
      year: 2024,
      reportingPeriod: "FY 2023-24",
      totalCapacityGw: 440,
      totalGenerationTwh: 1700,
      isComplete: true,
      source: {
        id: "cea-source",
        title: "CEA Report",
        publisher: "CEA",
        asOf: "2024-03-31",
      },
      entries: [
        {
          source: "Coal",
          capacityGw: 220,
          capacitySharePercent: 50.0,
          generationTwh: 1275,
          generationSharePercent: 75.0,
        },
        {
          source: "Solar",
          capacityGw: 88,
          capacitySharePercent: 20.0,
          generationTwh: 170,
          generationSharePercent: 10.0,
        },
        {
          source: "Nuclear",
          capacityGw: 8.8,
          capacitySharePercent: 2.0,
          generationTwh: 51,
          generationSharePercent: 3.0,
        },
        {
          source: "Others",
          capacityGw: 123.2,
          capacitySharePercent: 28.0,
          generationTwh: 204,
          generationSharePercent: 12.0,
        },
      ],
    };

    const parsed = EnergyMixSchema.parse(validMix);
    expect(parsed.year).toBe(2024);
    expect(parsed.entries).toHaveLength(4);
  });

  it("rejects complete energy mixes whose sums violate declared rounding tolerance", () => {
    const brokenSumMix = {
      year: 2024,
      reportingPeriod: "FY 2023-24",
      totalCapacityGw: 440,
      totalGenerationTwh: 1700,
      isComplete: true,
      source: {
        id: "cea-source",
        title: "CEA Report",
        publisher: "CEA",
        asOf: "2024-03-31",
      },
      entries: [
        {
          source: "Coal",
          capacityGw: 220,
          capacitySharePercent: 40.0, // only sums to 50%, missing 50%!
          generationTwh: 1275,
          generationSharePercent: 50.0,
        },
        {
          source: "Nuclear",
          capacityGw: 8.8,
          capacitySharePercent: 10.0,
          generationTwh: 51,
          generationSharePercent: 10.0,
        },
      ],
    };

    expect(() => EnergyMixSchema.parse(brokenSumMix)).toThrow();
  });

  it("validates three-stage program schema and stage bounds", () => {
    const stage = {
      stageNumber: 1,
      name: "Stage 1: PHWR",
      reactorTech: "PHWR",
      inputFuel: "Natural Uranium",
      outputFuel: "Plutonium-239",
      status: "Commercial",
      description: "Uses natural uranium fuel.",
      keyMilestone: "Standardized fleet.",
    };
    expect(ThreeStageProgramStageSchema.parse(stage).stageNumber).toBe(1);

    const invalidStage = {
      ...stage,
      stageNumber: 4, // only stages 1, 2, 3 allowed
    };
    expect(() => ThreeStageProgramStageSchema.parse(invalidStage)).toThrow();
  });

  it("validates 2050 scenario schema requiring explicit assumptions", () => {
    const scenario = {
      targetYear: 2047,
      targetCapacityGw: 100,
      projectedGenerationSharePercent: 12.5,
      basisAndAssumptions: "DAE Net Zero roadmap combining PHWR, LWR, FBR.",
      source: "DAE 2024 Perspective Planning",
    };
    const parsed = NationalScenarioSchema.parse(scenario);
    expect(parsed.targetYear).toBe(2047);
  });
});
