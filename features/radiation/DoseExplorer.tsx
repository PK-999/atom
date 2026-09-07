import React from "react";
import type { RadiationScenario } from "../../lib/radiation/schemas";

export function DoseExplorer({
  scenarios,
}: {
  scenarios: readonly RadiationScenario[];
}) {
  return (
    <section aria-labelledby="dose-explorer-title">
      <h2 id="dose-explorer-title">Radiation Dose Explorer</h2>
      <div className="logarithmic-scale-placeholder">
        {/* We will implement a logarithmic scale with D3 here later */}
      </div>
      <table aria-label="Radiation Scenarios">
        <thead>
          <tr>
            <th scope="col">Scenario</th>
            <th scope="col">Dose</th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <th scope="row">{scenario.title}</th>
              <td>{scenario.value}</td>
              <td>{scenario.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
