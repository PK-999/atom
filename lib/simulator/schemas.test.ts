import { describe, expect, it } from "vitest";
import {
  GridScenarioSchema,
  GenerationSourceSchema,
  isLeapYear,
  getHoursForYear,
} from "./schemas";

describe("Simulator Schemas & Calendar Validation", () => {
  it("determines leap years accurately", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(1900)).toBe(false); // Century non-leap

    expect(getHoursForYear(2024)).toBe(8784);
    expect(getHoursForYear(2025)).toBe(8760);
  });

  it("validates a valid non-leap grid scenario with 8760 hours", () => {
    const valid = {
      id: "test-grid",
      name: "Test Grid",
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

    const parsed = GridScenarioSchema.parse(valid);
    expect(parsed.id).toBe("test-grid");
    expect(parsed.hoursPerYear).toBe(8760);
  });

  it("validates a valid leap-year grid scenario with 8784 hours", () => {
    const validLeap = {
      id: "leap-grid",
      name: "Leap Year Grid",
      year: 2024,
      hoursPerYear: 8784,
      annualDemandMwh: 10000000,
      sources: [
        {
          id: "solar",
          name: "Solar",
          capacityMw: 2000,
          capacityFactor: 0.2,
          isDispatchable: false,
        },
      ],
    };

    const parsed = GridScenarioSchema.parse(validLeap);
    expect(parsed.hoursPerYear).toBe(8784);
  });

  it("rejects mismatch between calendar year and hoursPerYear", () => {
    // 2023 is non-leap (8760), passing 8784 should fail
    const mismatch1 = {
      id: "mismatch-1",
      name: "Mismatch 1",
      year: 2023,
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

    expect(() => GridScenarioSchema.parse(mismatch1)).toThrow();

    // 2024 is leap (8784), passing 8760 should fail
    const mismatch2 = {
      id: "mismatch-2",
      name: "Mismatch 2",
      year: 2024,
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

    expect(() => GridScenarioSchema.parse(mismatch2)).toThrow();
  });

  it("rejects invalid capacity factors, negative values, NaN, and Infinity", () => {
    expect(() =>
      GenerationSourceSchema.parse({
        id: "bad-cf",
        name: "Bad CF",
        capacityMw: 100,
        capacityFactor: 1.5, // > 1
        isDispatchable: true,
      }),
    ).toThrow();

    expect(() =>
      GenerationSourceSchema.parse({
        id: "neg-capacity",
        name: "Neg",
        capacityMw: -50,
        capacityFactor: 0.5,
        isDispatchable: true,
      }),
    ).toThrow();

    expect(() =>
      GenerationSourceSchema.parse({
        id: "nan-capacity",
        name: "NaN",
        capacityMw: Number.NaN,
        capacityFactor: 0.5,
        isDispatchable: true,
      }),
    ).toThrow();

    expect(() =>
      GenerationSourceSchema.parse({
        id: "inf-capacity",
        name: "Inf",
        capacityMw: Number.POSITIVE_INFINITY,
        capacityFactor: 0.5,
        isDispatchable: true,
      }),
    ).toThrow();
  });
});
