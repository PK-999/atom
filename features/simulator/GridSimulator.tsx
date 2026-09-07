import React, { useMemo, useState } from "react";
import type { GridScenario } from "../../lib/simulator/schemas";
import { simulateAnnualGrid } from "../../lib/simulator/grid-model";

export function GridSimulator({
  initialScenario,
}: {
  initialScenario: GridScenario;
}) {
  const [scenario, setScenario] = useState(initialScenario);

  const simulationResult = useMemo(
    () => simulateAnnualGrid(scenario),
    [scenario],
  );

  return (
    <section aria-labelledby={`simulator-title-${scenario.id}`}>
      <h2 id={`simulator-title-${scenario.id}`}>
        Grid Simulator: {scenario.id}
      </h2>

      <div className="grid-controls">
        <h3>Generation Sources</h3>
        {/* Sliders will go here, currently read-only scaffold */}
        <ul>
          {scenario.sources.map((source) => (
            <li key={source.id}>
              {source.name}: {source.capacityMw} MW (
              {source.capacityFactor * 100}% CF)
            </li>
          ))}
        </ul>
      </div>

      <div className="grid-results">
        <h3>Annual Results</h3>
        <dl>
          <dt>Total Demand</dt>
          <dd>{simulationResult.totalDemandMwh.toLocaleString()} MWh</dd>

          <dt>Total Generation</dt>
          <dd>{simulationResult.totalGenerationMwh.toLocaleString()} MWh</dd>

          <dt>Shortfall</dt>
          <dd>{simulationResult.shortfallMwh.toLocaleString()} MWh</dd>

          <dt>Reliability</dt>
          <dd>{simulationResult.reliabilityPercent.toFixed(1)}%</dd>
        </dl>
      </div>
    </section>
  );
}
