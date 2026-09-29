import { CostScenarioSchema, type CostScenario } from "./cost-schema";

export interface CostCashFlow {
  period: number;
  generationMwh: number;
  constructionCost: number;
  fixedOpex: number;
  fuelCost: number;
  decommissioningCost: number;
  discountedCost: number;
  discountedGenerationMwh: number;
}

export type CostResult =
  | {
      status: "ready";
      lcoePerMwh: number;
      discountedCosts: number;
      discountedGenerationMwh: number;
      cashFlows: readonly CostCashFlow[];
      assumptions: {
        included: readonly string[];
        excluded: readonly string[];
      };
    }
  | {
      status: "unavailable" | "invalid";
      message: string;
      cashFlows: readonly CostCashFlow[];
    };

const HOURS_PER_YEAR = 8760;

export function calculateGenerationCost(input: CostScenario): CostResult {
  const parsed = CostScenarioSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "invalid",
      message:
        "Check the assumptions: values must be finite and within their stated bounds.",
      cashFlows: [],
    };
  }

  const scenario = parsed.data;
  const cashFlows: CostCashFlow[] = [];
  const discount = (period: number) =>
    1 / Math.pow(1 + scenario.discountRate, period);

  for (
    let period = 0;
    period < scenario.constructionCostByYear.length;
    period += 1
  ) {
    const factor = discount(period);
    cashFlows.push({
      period,
      generationMwh: 0,
      constructionCost: scenario.constructionCostByYear[period],
      fixedOpex: 0,
      fuelCost: 0,
      decommissioningCost: 0,
      discountedCost: scenario.constructionCostByYear[period] * factor,
      discountedGenerationMwh: 0,
    });
  }

  const operationStart = scenario.constructionCostByYear.length;
  for (let year = 0; year < scenario.operatingYears; year += 1) {
    const period = operationStart + year;
    const factor = discount(period);
    const generationMwh =
      scenario.capacityMw * scenario.capacityFactor * HOURS_PER_YEAR;
    const fixedOpex = scenario.capacityMw * scenario.fixedOpexPerMwYear;
    const fuelCost = generationMwh * scenario.fuelCostPerMwh;
    const decommissioningCost =
      year === scenario.operatingYears - 1 ? scenario.decommissioningCost : 0;
    const generationFactor = discount(period + scenario.outputDelayYears);
    cashFlows.push({
      period,
      generationMwh,
      constructionCost: 0,
      fixedOpex,
      fuelCost,
      decommissioningCost,
      discountedCost: (fixedOpex + fuelCost + decommissioningCost) * factor,
      discountedGenerationMwh: generationMwh * generationFactor,
    });
  }

  const discountedCosts = cashFlows.reduce(
    (total, flow) => total + flow.discountedCost,
    0,
  );
  const discountedGenerationMwh = cashFlows.reduce(
    (total, flow) => total + flow.discountedGenerationMwh,
    0,
  );

  if (discountedGenerationMwh <= 0) {
    return {
      status: "unavailable",
      message:
        "Generation is zero under these assumptions, so a unit cost cannot be calculated.",
      cashFlows,
    };
  }

  return {
    status: "ready",
    lcoePerMwh: discountedCosts / discountedGenerationMwh,
    discountedCosts,
    discountedGenerationMwh,
    cashFlows,
    assumptions: {
      included: [
        "Construction cash flow",
        "Fixed operating cost",
        "Fuel cost",
        "Decommissioning cost",
      ],
      excluded: [
        "Transmission and system costs",
        "Taxes, subsidies, and financing structure",
        "Retail tariffs and market prices",
      ],
    },
  };
}
