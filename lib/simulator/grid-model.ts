import { type GridScenario, GridScenarioSchema } from "./schemas";

export interface SourceSimulationBreakdown {
  id: string;
  name: string;
  capacityMw: number;
  capacityFactor: number;
  annualGenerationMwh: number;
  generationSharePercent: number;
  isDispatchable: boolean;
  color?: string;
}

export interface GridSimulationResult {
  totalGenerationMwh: number;
  totalDemandMwh: number;
  shortfallMwh: number;
  surplusMwh: number;
  annualEnergyCoveragePercent: number | null; // null if demand is zero
  dispatchableGenerationMwh: number;
  variableGenerationMwh: number;
  sourcesBreakdown: SourceSimulationBreakdown[];
  hourlyAdequacyDisclaimer: string;
}

export const HOURLY_ADEQUACY_DISCLAIMER =
  "Annual Energy Coverage measures gross energy equality over a full calendar year. It does NOT represent real-time hourly reliability, instantaneous supply-demand matching, dispatch flexibility, or transmission/inertia stability.";

export function simulateAnnualGrid(
  scenario: GridScenario,
): GridSimulationResult {
  const validatedScenario = GridScenarioSchema.parse(scenario);
  const hours = validatedScenario.hoursPerYear;

  let totalGenerationMwh = 0;
  let dispatchableGenerationMwh = 0;
  let variableGenerationMwh = 0;

  // Step 1: Compute annual generation per source
  const preliminaryBreakdown = validatedScenario.sources.map((source) => {
    const annualGen = source.capacityMw * source.capacityFactor * hours;
    totalGenerationMwh += annualGen;
    if (source.isDispatchable) {
      dispatchableGenerationMwh += annualGen;
    } else {
      variableGenerationMwh += annualGen;
    }
    return {
      id: source.id,
      name: source.name,
      capacityMw: source.capacityMw,
      capacityFactor: source.capacityFactor,
      annualGenerationMwh: annualGen,
      isDispatchable: source.isDispatchable,
      color: source.color,
    };
  });

  // Step 2: Calculate shares
  const sourcesBreakdown: SourceSimulationBreakdown[] =
    preliminaryBreakdown.map((item) => ({
      ...item,
      generationSharePercent:
        totalGenerationMwh > 0
          ? (item.annualGenerationMwh / totalGenerationMwh) * 100
          : 0,
    }));

  const demand = validatedScenario.annualDemandMwh;
  const shortfallMwh = Math.max(0, demand - totalGenerationMwh);
  const surplusMwh = Math.max(0, totalGenerationMwh - demand);

  // Annual energy coverage: if demand is 0, coverage is not applicable (null)
  const annualEnergyCoveragePercent =
    demand === 0 ? null : Math.min(1, totalGenerationMwh / demand) * 100;

  return {
    totalGenerationMwh,
    totalDemandMwh: demand,
    shortfallMwh,
    surplusMwh,
    annualEnergyCoveragePercent,
    dispatchableGenerationMwh,
    variableGenerationMwh,
    sourcesBreakdown,
    hourlyAdequacyDisclaimer: HOURLY_ADEQUACY_DISCLAIMER,
  };
}

export const DEFAULT_PRESET_SCENARIOS: Record<string, GridScenario> = {
  "balanced-clean": {
    id: "balanced-clean",
    name: "Balanced Clean Transition (50 TWh System)",
    description:
      "A diversified low-carbon grid combining firm nuclear base-load with solar, wind, and firm hydro balancing.",
    year: 2025,
    hoursPerYear: 8760,
    annualDemandMwh: 50000000,
    sources: [
      {
        id: "nuclear",
        name: "Nuclear Power",
        capacityMw: 3500,
        capacityFactor: 0.9,
        isDispatchable: true,
        color: "#10b981",
      },
      {
        id: "solar",
        name: "Solar PV",
        capacityMw: 8000,
        capacityFactor: 0.22,
        isDispatchable: false,
        color: "#f59e0b",
      },
      {
        id: "wind",
        name: "Onshore Wind",
        capacityMw: 5000,
        capacityFactor: 0.35,
        isDispatchable: false,
        color: "#06b6d4",
      },
      {
        id: "hydro",
        name: "Hydro Reservoir",
        capacityMw: 2500,
        capacityFactor: 0.45,
        isDispatchable: true,
        color: "#3b82f6",
      },
    ],
  },
  "nuclear-firm-base": {
    id: "nuclear-firm-base",
    name: "Nuclear-Dominant Base-load Grid",
    description:
      "High nuclear deployment ensuring ~70%+ firm low-carbon generation with supporting wind and storage hydro.",
    year: 2025,
    hoursPerYear: 8760,
    annualDemandMwh: 50000000,
    sources: [
      {
        id: "nuclear",
        name: "Nuclear Power",
        capacityMw: 5000,
        capacityFactor: 0.9,
        isDispatchable: true,
        color: "#10b981",
      },
      {
        id: "wind",
        name: "Wind Power",
        capacityMw: 3000,
        capacityFactor: 0.35,
        isDispatchable: false,
        color: "#06b6d4",
      },
      {
        id: "hydro",
        name: "Hydro Reservoir",
        capacityMw: 1500,
        capacityFactor: 0.4,
        isDispatchable: true,
        color: "#3b82f6",
      },
    ],
  },
  "renewable-heavy": {
    id: "renewable-heavy",
    name: "High Renewable Overbuild Grid",
    description:
      "Large variable renewable capacity designed to produce high total TWh, requiring significant seasonal curtailment or storage.",
    year: 2025,
    hoursPerYear: 8760,
    annualDemandMwh: 50000000,
    sources: [
      {
        id: "nuclear",
        name: "Nuclear Power",
        capacityMw: 1000,
        capacityFactor: 0.9,
        isDispatchable: true,
        color: "#10b981",
      },
      {
        id: "solar",
        name: "Solar PV",
        capacityMw: 15000,
        capacityFactor: 0.22,
        isDispatchable: false,
        color: "#f59e0b",
      },
      {
        id: "wind",
        name: "Onshore Wind",
        capacityMw: 10000,
        capacityFactor: 0.35,
        isDispatchable: false,
        color: "#06b6d4",
      },
    ],
  },
};

export function getDefaultScenario(): GridScenario {
  return DEFAULT_PRESET_SCENARIOS["balanced-clean"];
}
