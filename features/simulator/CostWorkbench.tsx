"use client";

import { useMemo, useState } from "react";

import { calculateGenerationCost } from "@/lib/simulator/cost-model";
import type { CostScenario } from "@/lib/simulator/cost-schema";

import styles from "./CostWorkbench.module.css";

const INITIAL_SCENARIO: CostScenario = {
  capacityMw: 1,
  capacityFactor: 0.9,
  constructionCostByYear: [0],
  operatingYears: 1,
  fixedOpexPerMwYear: 0,
  fuelCostPerMwh: 100,
  decommissioningCost: 0,
  discountRate: 0,
  outputDelayYears: 0,
  currency: "illustrative currency",
  baseYear: 2025,
};

export function CostWorkbench() {
  const [scenario, setScenario] = useState(INITIAL_SCENARIO);
  const [constructionSchedule, setConstructionSchedule] = useState("0");
  const result = useMemo(() => calculateGenerationCost(scenario), [scenario]);

  const update = <K extends keyof CostScenario>(
    key: K,
    value: CostScenario[K],
  ) => setScenario((current) => ({ ...current, [key]: value }));

  const updateSchedule = (value: string) => {
    setConstructionSchedule(value);
    const numbers = value
      .split(",")
      .map((entry) => Number(entry.trim()))
      .filter((entry) => Number.isFinite(entry) && entry >= 0);
    if (numbers.length > 0) update("constructionCostByYear", numbers);
  };

  return (
    <section
      className={styles.workbench}
      aria-labelledby="cost-workbench-title"
    >
      <header className={styles.header}>
        <span className={styles.eyebrow}>Contextual cost experiment</span>
        <h2 id="cost-workbench-title" className={styles.title}>
          Cost workbench
        </h2>
        <p className={styles.lead}>
          Move one assumption and see how a modeled generation cost changes. The
          starting values are illustrative inputs, not a market estimate.
        </p>
      </header>

      <div className={styles.controls}>
        <Field
          label="Capacity (MW)"
          value={scenario.capacityMw}
          onChange={(value) => update("capacityMw", value)}
        />
        <Field
          label="Capacity factor (%)"
          value={scenario.capacityFactor * 100}
          onChange={(value) =>
            update("capacityFactor", Math.min(100, Math.max(0, value)) / 100)
          }
        />
        <Field
          label="Operating years"
          value={scenario.operatingYears}
          onChange={(value) => update("operatingYears", Math.round(value))}
        />
        <Field
          label="Fixed O&M / MW-year"
          value={scenario.fixedOpexPerMwYear}
          onChange={(value) => update("fixedOpexPerMwYear", value)}
        />
        <Field
          label="Fuel cost / MWh"
          value={scenario.fuelCostPerMwh}
          onChange={(value) => update("fuelCostPerMwh", value)}
        />
        <Field
          label="Decommissioning cost"
          value={scenario.decommissioningCost}
          onChange={(value) => update("decommissioningCost", value)}
        />
        <Field
          label="Discount rate (%)"
          value={scenario.discountRate * 100}
          onChange={(value) =>
            update("discountRate", Math.min(99, Math.max(-99, value)) / 100)
          }
        />
        <Field
          label="Output delay (years)"
          value={scenario.outputDelayYears}
          onChange={(value) => update("outputDelayYears", Math.round(value))}
        />
        <div className={styles.field}>
          <label htmlFor="construction-schedule">
            Construction cash flow by year
          </label>
          <input
            id="construction-schedule"
            inputMode="decimal"
            value={constructionSchedule}
            onChange={(event) => updateSchedule(event.target.value)}
          />
          <small>
            Comma-separated currency amounts from construction start.
          </small>
        </div>
      </div>

      {result.status === "ready" ? (
        <div className={styles.result} aria-live="polite">
          <h3>Modeled result</h3>
          <div className={styles.lcoe}>
            {result.lcoePerMwh.toFixed(2)} {scenario.currency}/MWh
          </div>
          <div className={styles.resultGrid}>
            <div className={styles.resultCell}>
              <strong>Discounted costs</strong>
              <span>{result.discountedCosts.toFixed(0)}</span>
            </div>
            <div className={styles.resultCell}>
              <strong>Discounted generation</strong>
              <span>{result.discountedGenerationMwh.toFixed(0)} MWh</span>
            </div>
            <div className={styles.resultCell}>
              <strong>Rows in cash flow</strong>
              <span>{result.cashFlows.length}</span>
            </div>
          </div>
          <table className={styles.table}>
            <caption>Discounted cost composition</caption>
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Included cost</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Construction", "constructionCost"],
                  ["Fixed O&M", "fixedOpex"],
                  ["Fuel", "fuelCost"],
                  ["Decommissioning", "decommissioningCost"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>
                    {result.cashFlows
                      .reduce((total, flow) => {
                        const undiscounted = flow[key];
                        const discounted =
                          key === "constructionCost" ||
                          key === "fixedOpex" ||
                          key === "fuelCost" ||
                          key === "decommissioningCost"
                            ? undiscounted /
                              Math.pow(1 + scenario.discountRate, flow.period)
                            : 0;
                        return total + discounted;
                      }, 0)
                      .toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className={styles.assumptions}>
            <div>
              <dt>Included</dt>
              <dd>{result.assumptions.included.join(" · ")}</dd>
            </div>
            <div>
              <dt>Excluded</dt>
              <dd>{result.assumptions.excluded.join(" · ")}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className={styles.unavailable} role="status">
          {result.message}
        </p>
      )}

      <p className={styles.note}>
        LCOE here means discounted included costs divided by discounted
        electricity from one modeled project. It does not establish a retail
        price, a national forecast, or a universal cheapest technology.
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = `cost-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        step="any"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
