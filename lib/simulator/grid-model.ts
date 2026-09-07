import type { GridScenario } from "./schemas";

export interface GridSimulationResult {
  totalGenerationMwh: number;
  totalDemandMwh: number;
  shortfallMwh: number;
  dispatchableGenerationMwh: number;
  variableGenerationMwh: number;
  reliabilityPercent: number;
}

export function simulateAnnualGrid(
  scenario: GridScenario,
): GridSimulationResult {
  const HOURS_IN_YEAR = 8760;

  // Simplified annual arithmetic model
  // A real model would calculate chronologically (hourly dispatch), but this is a static annual projection.

  // Average demand is typically ~60% of peak (Load Factor)
  const loadFactor = 0.6;
  const avgDemandMw = scenario.peakDemandMw * loadFactor;
  const totalDemandMwh = avgDemandMw * HOURS_IN_YEAR;

  let dispatchableGenerationMwh = 0;
  let variableGenerationMwh = 0;

  for (const source of scenario.sources) {
    const annualGenerationMwh =
      source.capacityMw * source.capacityFactor * HOURS_IN_YEAR;
    if (source.isDispatchable) {
      dispatchableGenerationMwh += annualGenerationMwh;
    } else {
      variableGenerationMwh += annualGenerationMwh;
    }
  }

  const totalGenerationMwh = dispatchableGenerationMwh + variableGenerationMwh;
  const shortfallMwh = Math.max(0, totalDemandMwh - totalGenerationMwh);

  // Very naive reliability proxy
  const reliabilityPercent =
    totalGenerationMwh >= totalDemandMwh
      ? 100
      : (totalGenerationMwh / totalDemandMwh) * 100;

  return {
    totalGenerationMwh,
    totalDemandMwh,
    shortfallMwh,
    dispatchableGenerationMwh,
    variableGenerationMwh,
    reliabilityPercent,
  };
}
