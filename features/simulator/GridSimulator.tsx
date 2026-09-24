"use client";

import React, { useMemo, useState } from "react";
import type { GridScenario } from "../../lib/simulator/schemas";
import {
  simulateAnnualGrid,
  DEFAULT_PRESET_SCENARIOS,
  getDefaultScenario,
} from "../../lib/simulator/grid-model";
import { isLeapYear, getHoursForYear } from "../../lib/simulator/schemas";
import styles from "./GridSimulator.module.css";

export function GridSimulator({
  initialScenario = getDefaultScenario(),
  embedded = false,
}: {
  initialScenario?: GridScenario;
  embedded?: boolean;
}) {
  const [scenario, setScenario] = useState<GridScenario>(initialScenario);

  const Heading = embedded ? "h2" : "h1";

  const simulationResult = useMemo(() => {
    try {
      return simulateAnnualGrid(scenario);
    } catch {
      return null;
    }
  }, [scenario]);

  const handlePresetChange = (presetId: string) => {
    const selected = DEFAULT_PRESET_SCENARIOS[presetId];
    if (selected) {
      setScenario(selected);
    }
  };

  const handleReset = () => {
    setScenario(getDefaultScenario());
  };

  const handleYearChange = (year: number) => {
    const hours = getHoursForYear(year);
    setScenario((prev) => ({
      ...prev,
      year,
      hoursPerYear: hours,
    }));
  };

  const handleDemandChange = (demandMwh: number) => {
    const valid = Math.max(0, Number.isFinite(demandMwh) ? demandMwh : 0);
    setScenario((prev) => ({
      ...prev,
      annualDemandMwh: valid,
    }));
  };

  const handleCapacityChange = (sourceId: string, capacityMw: number) => {
    const valid = Math.max(0, Number.isFinite(capacityMw) ? capacityMw : 0);
    setScenario((prev) => ({
      ...prev,
      sources: prev.sources.map((s) =>
        s.id === sourceId ? { ...s, capacityMw: valid } : s,
      ),
    }));
  };

  const handleCapacityFactorChange = (
    sourceId: string,
    capacityFactorPercent: number,
  ) => {
    const clamped = Math.min(
      1,
      Math.max(
        0,
        (Number.isFinite(capacityFactorPercent) ? capacityFactorPercent : 0) /
          100,
      ),
    );
    setScenario((prev) => ({
      ...prev,
      sources: prev.sources.map((s) =>
        s.id === sourceId ? { ...s, capacityFactor: clamped } : s,
      ),
    }));
  };

  const isLeap = isLeapYear(scenario.year);

  return (
    <article className={styles.container} aria-labelledby="simulator-heading">
      <header className={styles.header}>
        <span className={styles.badge}>Interactive Tool · Grid Literacy</span>
        <Heading id="simulator-heading" className={styles.title}>
          Annual Electricity Grid Simulator
        </Heading>
        <p className={styles.lead}>
          Explore how varying generation capacities and capacity factors
          determine annual energy balance. Observe firsthand why 100% annual
          energy equivalence does not equate to instantaneous real-time grid
          reliability.
        </p>

        {/* Preset & Calendar Controls */}
        <div className={styles.presetBar}>
          <div className={styles.yearInputGroup}>
            <label htmlFor="preset-select" className={styles.presetLabel}>
              Load Scenario:
            </label>
            <select
              id="preset-select"
              className={styles.presetSelect}
              value={scenario.id in DEFAULT_PRESET_SCENARIOS ? scenario.id : ""}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              {Object.values(DEFAULT_PRESET_SCENARIOS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className={styles.btnReset}
          >
            Reset Defaults
          </button>

          <div className={styles.calendarRow}>
            <div className={styles.yearInputGroup}>
              <label htmlFor="calendar-year" className={styles.presetLabel}>
                Year:
              </label>
              <input
                id="calendar-year"
                type="number"
                min="1950"
                max="2100"
                value={scenario.year}
                onChange={(e) =>
                  handleYearChange(parseInt(e.target.value, 10) || 2025)
                }
                className={styles.yearInput}
              />
            </div>
            <span className={styles.leapTag}>
              {scenario.hoursPerYear} Hours{" "}
              {isLeap ? "(Leap Year)" : "(Standard Year)"}
            </span>
          </div>
        </div>
      </header>

      {/* Metrics Summary */}
      {simulationResult && (
        <div
          className={styles.metricsGrid}
          role="region"
          aria-label="Simulation Summary Metrics"
        >
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Demand</div>
            <div className={styles.metricValue}>
              {(simulationResult.totalDemandMwh / 1_000_000).toFixed(2)} TWh
            </div>
            <div className={styles.metricSub}>
              {simulationResult.totalDemandMwh.toLocaleString()} MWh
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Generation</div>
            <div className={styles.metricValue}>
              {(simulationResult.totalGenerationMwh / 1_000_000).toFixed(2)} TWh
            </div>
            <div className={styles.metricSub}>
              {simulationResult.totalGenerationMwh.toLocaleString()} MWh
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Energy Coverage</div>
            <div className={styles.metricValue}>
              {simulationResult.annualEnergyCoveragePercent !== null
                ? `${simulationResult.annualEnergyCoveragePercent.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className={styles.metricSub}>
              min(Gen/Demand, 1) · Gross Energy Balance
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Net Balance</div>
            {simulationResult.surplusMwh > 0 ? (
              <>
                <div className={`${styles.metricValue} ${styles.surplusValue}`}>
                  +{(simulationResult.surplusMwh / 1_000_000).toFixed(2)} TWh
                </div>
                <div className={styles.metricSub}>Annual Energy Surplus</div>
              </>
            ) : simulationResult.shortfallMwh > 0 ? (
              <>
                <div
                  className={`${styles.metricValue} ${styles.shortfallValue}`}
                >
                  -{(simulationResult.shortfallMwh / 1_000_000).toFixed(2)} TWh
                </div>
                <div className={styles.metricSub}>Annual Energy Shortfall</div>
              </>
            ) : (
              <>
                <div className={styles.metricValue}>0.00 TWh</div>
                <div className={styles.metricSub}>Exact Annual Balance</div>
              </>
            )}
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Grid Carbon Intensity</div>
            <div className={styles.metricValue}>
              {simulationResult.weightedCarbonIntensityGPerKwh === null
                ? "Unavailable"
                : `${simulationResult.weightedCarbonIntensityGPerKwh} gCO₂e/kWh`}
            </div>
            <p className={styles.metricSub}>
              Illustrative lifecycle factors; not a reviewed portfolio estimate.
              Missing factors remain unavailable.{" "}
              <a href="/methodology">Inspect scope and limitations</a>.
            </p>
          </div>
        </div>
      )}

      {/* Demand Setting */}
      <section
        className={styles.section}
        aria-labelledby="demand-section-title"
      >
        <h2 id="demand-section-title" className={styles.sectionTitle}>
          1. Grid Annual Electricity Demand
        </h2>
        <div className={styles.demandCard}>
          <div className={styles.demandHeader}>
            <span className={styles.demandTitle}>Total Annual System Load</span>
            <span className={styles.demandTwh}>
              {(scenario.annualDemandMwh / 1_000_000).toFixed(1)} TWh/year
            </span>
          </div>
          <div className={styles.demandControlRow}>
            <input
              type="range"
              min="0"
              max="150000000"
              step="1000000"
              value={scenario.annualDemandMwh}
              onChange={(e) => handleDemandChange(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Annual Demand Slider in MWh"
            />
            <input
              type="number"
              min="0"
              max="500000000"
              step="500000"
              value={scenario.annualDemandMwh}
              onChange={(e) =>
                handleDemandChange(parseFloat(e.target.value) || 0)
              }
              className={styles.numInput}
              aria-label="Annual Demand Numeric Input in MWh"
            />
            <span
              style={{ fontSize: "0.85rem", color: "var(--atom-text-muted)" }}
            >
              MWh
            </span>
          </div>
        </div>
      </section>

      {/* Generation Sources Controls */}
      <section
        className={styles.section}
        aria-labelledby="sources-section-title"
      >
        <h2 id="sources-section-title" className={styles.sectionTitle}>
          2. Generation Sources Capacity & Capacity Factor
        </h2>
        <div className={styles.sourcesList}>
          {scenario.sources.map((source) => {
            const breakdown = simulationResult?.sourcesBreakdown.find(
              (b) => b.id === source.id,
            );
            return (
              <div key={source.id} className={styles.sourceCard}>
                <div className={styles.sourceHeader}>
                  <div className={styles.sourceTitleGroup}>
                    <span
                      className={styles.sourcePill}
                      style={{ backgroundColor: source.color || "#64748b" }}
                      aria-hidden="true"
                    />
                    <h3 className={styles.sourceName}>{source.name}</h3>
                    <span
                      className={`${styles.typeBadge} ${
                        source.isDispatchable
                          ? styles.dispatchable
                          : styles.variable
                      }`}
                    >
                      {source.isDispatchable
                        ? "Firm Dispatchable"
                        : "Variable Renewable"}
                    </span>
                  </div>
                  {breakdown && (
                    <div className={styles.sourceOutputStat}>
                      {(breakdown.annualGenerationMwh / 1_000_000).toFixed(2)}{" "}
                      TWh ({breakdown.generationSharePercent.toFixed(1)}% of
                      gen)
                    </div>
                  )}
                </div>

                <div className={styles.controlGrid}>
                  {/* Capacity Control */}
                  <div className={styles.controlCol}>
                    <div className={styles.controlLabel}>
                      <span>Installed Capacity:</span>
                      <strong>{source.capacityMw.toLocaleString()} MW</strong>
                    </div>
                    <div className={styles.controlInputs}>
                      <input
                        type="range"
                        min="0"
                        max="30000"
                        step="100"
                        value={source.capacityMw}
                        onChange={(e) =>
                          handleCapacityChange(
                            source.id,
                            parseFloat(e.target.value),
                          )
                        }
                        className={styles.slider}
                        aria-label={`${source.name} Capacity Slider in MW`}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100000"
                        step="50"
                        value={source.capacityMw}
                        onChange={(e) =>
                          handleCapacityChange(
                            source.id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={styles.numInput}
                        aria-label={`${source.name} Capacity Numeric Input in MW`}
                      />
                    </div>
                  </div>

                  {/* Capacity Factor Control */}
                  <div className={styles.controlCol}>
                    <div className={styles.controlLabel}>
                      <span>Annual Capacity Factor:</span>
                      <strong>
                        {(source.capacityFactor * 100).toFixed(0)}%
                      </strong>
                    </div>
                    <div className={styles.controlInputs}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={Math.round(source.capacityFactor * 100)}
                        onChange={(e) =>
                          handleCapacityFactorChange(
                            source.id,
                            parseFloat(e.target.value),
                          )
                        }
                        className={styles.slider}
                        aria-label={`${source.name} Capacity Factor Slider`}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={Math.round(source.capacityFactor * 100)}
                        onChange={(e) =>
                          handleCapacityFactorChange(
                            source.id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={styles.numInput}
                        aria-label={`${source.name} Capacity Factor Numeric Input`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Generation Mix Breakdown Table & Visual Bar */}
      {simulationResult && (
        <section
          className={styles.section}
          aria-labelledby="breakdown-section-title"
        >
          <h2 id="breakdown-section-title" className={styles.sectionTitle}>
            3. Generation Mix Breakdown
          </h2>

          {/* Stacked visualization bar */}
          <div
            className={styles.stackedBarContainer}
            role="img"
            aria-label="Annual Generation Mix Proportions"
          >
            {simulationResult.sourcesBreakdown.map((item) => (
              <div
                key={item.id}
                className={styles.stackedSegment}
                style={{
                  width: `${item.generationSharePercent}%`,
                  backgroundColor: item.color || "#64748b",
                }}
                title={`${item.name}: ${item.generationSharePercent.toFixed(1)}%`}
              />
            ))}
          </div>

          <div className={styles.tableCard}>
            <table
              className={styles.table}
              aria-label="Annual Generation Simulation Breakdown Table"
            >
              <thead>
                <tr>
                  <th scope="col">Technology</th>
                  <th scope="col">Grid Role</th>
                  <th scope="col">Capacity (MW)</th>
                  <th scope="col">Capacity Factor</th>
                  <th scope="col">Annual Gen (TWh)</th>
                  <th scope="col">Gen Share (%)</th>
                </tr>
              </thead>
              <tbody>
                {simulationResult.sourcesBreakdown.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span
                        className={styles.sourcePill}
                        style={{
                          backgroundColor: row.color || "#64748b",
                          display: "inline-block",
                          marginRight: "0.5rem",
                          verticalAlign: "middle",
                        }}
                        aria-hidden="true"
                      />
                      <strong>{row.name}</strong>
                    </td>
                    <td>
                      {row.isDispatchable
                        ? "Firm Dispatchable"
                        : "Variable Renewable"}
                    </td>
                    <td>{row.capacityMw.toLocaleString()} MW</td>
                    <td>{(row.capacityFactor * 100).toFixed(1)}%</td>
                    <td>{(row.annualGenerationMwh / 1_000_000).toFixed(2)}</td>
                    <td>{row.generationSharePercent.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <strong>Total Fleet</strong>
                  </td>
                  <td>—</td>
                  <td>
                    <strong>
                      {simulationResult.sourcesBreakdown
                        .reduce((sum, s) => sum + s.capacityMw, 0)
                        .toLocaleString()}{" "}
                      MW
                    </strong>
                  </td>
                  <td>—</td>
                  <td>
                    <strong>
                      {(
                        simulationResult.totalGenerationMwh / 1_000_000
                      ).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {simulationResult.totalGenerationMwh > 0
                        ? "100.0%"
                        : "Not applicable"}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}

      {/* Section 4: Critical Educational Callout */}
      <section
        className={styles.disclaimerBox}
        role="region"
        aria-labelledby="disclaimer-title"
      >
        <div id="disclaimer-title" className={styles.disclaimerTitle}>
          <span>⚠️</span>
          <span>
            Core Concept: Annual Energy Balance ≠ Real-Time Hourly Reliability
          </span>
        </div>
        <p>
          A common energy literacy mistake is assuming that generating 100% of
          annual electricity demand means a grid is reliable and blackout-free.
          Annual electricity simulation evaluates total MWh produced over{" "}
          {scenario.hoursPerYear} hours. However, real-world power grids operate
          on millisecond-to-hourly balance. A grid with 100% annual energy
          coverage can still face severe hourly blackouts due to fundamental
          physics:
        </p>

        <div className={styles.educationGrid}>
          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              1. Hourly Intermittency & The &quot;Dunkelflaute&quot;
            </div>
            <p>
              Solar PV produces 0 MW at night and peaks at midday. Wind energy
              varies with weather systems and can drop to near zero for
              consecutive days across entire continents (termed{" "}
              <em>Dunkelflaute</em> or dark doldrums).
            </p>
          </div>

          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              2. Instantaneous Peak Demand
            </div>
            <p>
              System demand spikes during freezing winter evenings or extreme
              summer heatwaves. Meeting peak demand requires firm, immediately
              dispatchable capacity, regardless of annual averages.
            </p>
          </div>

          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              3. Mechanical Grid Inertia & Frequency
            </div>
            <p>
              Large spinning turbines in nuclear, hydro, and thermal generators
              provide physical kinetic inertia, naturally resisting sudden grid
              frequency deviations (50/60 Hz). Solar and wind connect via
              inverters with zero inherent mechanical inertia.
            </p>
          </div>

          <div className={styles.educationCard}>
            <div className={styles.educationCardTitle}>
              4. Seasonal Storage Requirements
            </div>
            <p>
              Surplus energy produced during sunny summer days cannot be easily
              transferred to dark winter months without massive multi-week
              energy storage (e.g. hydrogen or synthetic fuels), which incurs
              high round-trip efficiency losses (~50–65%).
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
