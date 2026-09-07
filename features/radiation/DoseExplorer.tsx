"use client";

import { useState } from "react";
import type {
  RadiationScenario,
  ScenarioCategory,
} from "@/lib/radiation/schemas";
import {
  REVIEWED_RADIATION_SCENARIOS,
  formatDose,
  calculateLogPosition,
} from "@/lib/radiation/radiation-model";
import styles from "./DoseExplorer.module.css";

interface DoseExplorerProps {
  scenarios?: readonly RadiationScenario[];
}

const CATEGORIES: Array<{ id: "all" | ScenarioCategory; label: string }> = [
  { id: "all", label: "All Scenarios" },
  { id: "everyday", label: "Everyday & Travel" },
  { id: "medical", label: "Medical Diagnostics" },
  { id: "occupational", label: "Occupational Limits" },
  { id: "safety-limit", label: "Emergency Limits" },
  { id: "acute-severe", label: "Acute / Extreme" },
];

export function DoseExplorer({
  scenarios = REVIEWED_RADIATION_SCENARIOS,
}: DoseExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ScenarioCategory
  >("all");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    scenarios[3]?.id ?? "chest-xray",
  );

  const filteredScenarios =
    selectedCategory === "all"
      ? scenarios
      : scenarios.filter((s) => s.category === selectedCategory);

  const selectedScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0];

  const selectedDose = selectedScenario
    ? formatDose(selectedScenario.doseMicroSv)
    : null;

  return (
    <div className={styles.explorerContainer} data-testid="dose-explorer">
      <header className={styles.header}>
        <h1 className={styles.title}>Radiation Dose Explorer</h1>
        <p className={styles.subtitle}>
          Compare everyday, medical, occupational, and acute radiation exposures
          on an 8-order-of-magnitude logarithmic scale. All values represent
          whole-body Effective Dose in Sieverts (Sv) with verified citations.
        </p>
      </header>

      {/* Mandatory Physical & Medical Disclaimer */}
      <div
        className={styles.disclaimerCard}
        role="note"
        data-testid="disclaimer"
      >
        <p className={styles.disclaimerText}>
          <strong>Physical Distinction & Educational Disclaimer:</strong>{" "}
          Radiation quantities in this explorer measure whole-body{" "}
          <em>effective dose</em> (Sv). Absorbed dose (Gy) cannot be directly
          converted to effective dose (Sv) without explicit radiation and tissue
          weighting factors. This tool is strictly for educational literacy and
          physical comparisons; it does not calculate personal risk or provide
          medical diagnostic guidance.
        </p>
      </div>

      {/* Category Filter Controls */}
      <nav
        aria-label="Filter scenarios by category"
        className={styles.filterBar}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`${styles.filterButton} ${
              selectedCategory === cat.id ? styles.filterButtonActive : ""
            }`}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
            data-testid={`filter-${cat.id}`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Selected Scenario Inspector Card */}
      {selectedScenario && selectedDose && (
        <section
          className={styles.inspectorCard}
          aria-labelledby="scenario-inspector-title"
          data-testid="scenario-inspector"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <span className={styles.scenarioBadge}>
              {selectedScenario.category}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Quantity: {selectedScenario.quantity}
            </span>
          </div>

          <h2
            id="scenario-inspector-title"
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              margin: "0 0 0.5rem 0",
            }}
          >
            {selectedScenario.title}
          </h2>

          <div className={styles.inspectorGrid}>
            <div className={styles.inspectorStat}>
              <div className={styles.inspectorStatVal}>
                {selectedDose.microSv}
              </div>
              <div className={styles.inspectorStatLabel}>
                Micro-Sieverts (µSv)
              </div>
            </div>
            <div className={styles.inspectorStat}>
              <div className={styles.inspectorStatVal}>
                {selectedDose.milliSv}
              </div>
              <div className={styles.inspectorStatLabel}>
                Milli-Sieverts (mSv)
              </div>
            </div>
            <div className={styles.inspectorStat}>
              <div className={styles.inspectorStatVal}>{selectedDose.sv}</div>
              <div className={styles.inspectorStatLabel}>Sieverts (Sv)</div>
            </div>
          </div>

          <p className={styles.inspectorContext}>
            <strong>Physical Context:</strong> {selectedScenario.context}.{" "}
            {selectedScenario.description}
          </p>

          <p className={styles.inspectorSource}>
            <strong>Source Basis:</strong> {selectedScenario.source.name} (
            {selectedScenario.source.publicationYear}
            {selectedScenario.source.reportTitle &&
              ` — ${selectedScenario.source.reportTitle}`}
            )
          </p>
        </section>
      )}

      {/* Interactive Logarithmic Scale List */}
      <section
        className={styles.continuumCard}
        aria-labelledby="log-continuum-heading"
      >
        <div className={styles.continuumHeader}>
          <h2 id="log-continuum-heading" className={styles.continuumTitle}>
            Logarithmic Exposure Continuum (0.1 µSv to 10,000,000 µSv)
          </h2>
          <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
            Select a scenario to inspect
          </span>
        </div>

        <div className={styles.scaleAxis} aria-hidden="true">
          <div className={styles.axisLabels}>
            <span>0.1 µSv (Food)</span>
            <span>100 µSv (X-ray)</span>
            <span>2.4 mSv (Annual)</span>
            <span>20 mSv (Worker)</span>
            <span>1 Sv (Sickness)</span>
            <span>4 Sv (Lethal)</span>
          </div>
        </div>

        <div
          className={styles.scenarioMarkers}
          role="listbox"
          aria-label="Radiation Scenarios Continuum"
        >
          {filteredScenarios.map((item) => {
            const isSelected = item.id === selectedScenarioId;
            const logPercent = calculateLogPosition(item.doseMicroSv);
            const formatted = formatDose(item.doseMicroSv);

            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelectedScenarioId(item.id)}
                className={`${styles.scenarioRow} ${
                  isSelected ? styles.scenarioRowSelected : ""
                }`}
                data-testid={`scenario-row-${item.id}`}
              >
                <span
                  style={{
                    width: "2.5rem",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontWeight: 700,
                  }}
                >
                  {logPercent.toFixed(0)}%
                </span>
                <span className={styles.scenarioBadge}>{item.category}</span>
                <span className={styles.scenarioRowTitle}>{item.title}</span>
                <span className={styles.scenarioDoseVal}>
                  {formatted.bestFormatted}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accessible Table Fallback */}
      <section
        className={styles.tableContainer}
        aria-labelledby="table-heading"
      >
        <div
          style={{ padding: "1.25rem 1rem", borderBottom: "1px solid #e5e7eb" }}
        >
          <h2
            id="table-heading"
            style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}
          >
            Accessible Radiation Scenarios Reference Table
          </h2>
        </div>
        <table
          className={styles.table}
          aria-label="Radiation Scenarios Reference Table"
        >
          <thead>
            <tr>
              <th scope="col">Scenario</th>
              <th scope="col">Category</th>
              <th scope="col">Dose (µSv)</th>
              <th scope="col">Dose (mSv)</th>
              <th scope="col">Physical Context</th>
              <th scope="col">Authoritative Source</th>
            </tr>
          </thead>
          <tbody>
            {filteredScenarios.map((s) => (
              <tr key={s.id}>
                <th scope="row" style={{ fontWeight: 600 }}>
                  {s.title}
                </th>
                <td>
                  <span className={styles.scenarioBadge}>{s.category}</span>
                </td>
                <td style={{ fontFamily: "monospace" }}>
                  {s.doseMicroSv.toLocaleString()}
                </td>
                <td style={{ fontFamily: "monospace" }}>
                  {(s.doseMicroSv / 1_000).toLocaleString(undefined, {
                    maximumFractionDigits: 3,
                  })}
                </td>
                <td style={{ color: "#4b5563" }}>{s.context}</td>
                <td style={{ color: "#64748b", fontSize: "0.8125rem" }}>
                  {s.source.name} ({s.source.publicationYear})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
