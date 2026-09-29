import { describe, expect, it } from "vitest";

import { calculateGenerationCost } from "./cost-model";
import type { CostScenario } from "./cost-schema";

const baseScenario = (overrides: Partial<CostScenario> = {}): CostScenario => ({
  capacityMw: 1,
  capacityFactor: 1,
  constructionCostByYear: [0],
  operatingYears: 1,
  fixedOpexPerMwYear: 0,
  fuelCostPerMwh: 100,
  decommissioningCost: 0,
  discountRate: 0,
  outputDelayYears: 0,
  currency: "illustrative currency",
  baseYear: 2025,
  ...overrides,
});

describe("generation cost model", () => {
  it("matches the zero-discount arithmetic oracle", () => {
    const result = calculateGenerationCost(baseScenario());
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    expect(result.discountedGenerationMwh).toBe(8760);
    expect(result.discountedCosts).toBe(876000);
    expect(result.lcoePerMwh).toBe(100);
  });

  it("treats zero generation as unavailable rather than zero cost", () => {
    const result = calculateGenerationCost(
      baseScenario({ capacityMw: 0, fuelCostPerMwh: 500 }),
    );
    expect(result).toMatchObject({ status: "unavailable" });
    if (result.status === "ready") return;
    expect(result.message).toMatch(/zero/i);
  });

  it("changes output discounting when only the output is delayed", () => {
    const immediate = calculateGenerationCost(
      baseScenario({ discountRate: 0.1 }),
    );
    const delayed = calculateGenerationCost(
      baseScenario({ discountRate: 0.1, outputDelayYears: 5 }),
    );
    expect(immediate.status).toBe("ready");
    expect(delayed.status).toBe("ready");
    if (immediate.status !== "ready" || delayed.status !== "ready") return;
    expect(delayed.discountedGenerationMwh).toBeLessThan(
      immediate.discountedGenerationMwh,
    );
    expect(delayed.lcoePerMwh).toBeGreaterThan(immediate.lcoePerMwh);
  });

  it("does not change with a calendar-year label when the time origin is the same", () => {
    const first = calculateGenerationCost(baseScenario({ baseYear: 2025 }));
    const second = calculateGenerationCost(baseScenario({ baseYear: 2040 }));
    expect(first).toMatchObject({ status: "ready" });
    expect(second).toMatchObject({ status: "ready" });
    if (first.status !== "ready" || second.status !== "ready") return;
    expect(second.lcoePerMwh).toBe(first.lcoePerMwh);
  });
});
