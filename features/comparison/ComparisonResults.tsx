"use client";

import { Table } from "@phosphor-icons/react/Table";
import type { CSSProperties } from "react";

import { EvidenceDialog } from "./ComparisonEvidence";
import { SourceMarker } from "./ComparisonControls";
import { ComparisonWarnings } from "./ComparisonWarnings";
import { getComparisonScale, projectObservation } from "./comparison-model";
import type {
  DisplayMode,
  PreviewComparison,
  PreviewObservation,
  UnitMode,
} from "./comparison-types";
import styles from "./ComparisonLab.module.css";

interface ComparisonResultsProps {
  comparison: PreviewComparison;
  displayMode: DisplayMode;
  selectedObservations: PreviewObservation[];
  view: "chart" | "table";
  onViewChange: (view: "chart" | "table") => void;
  onRestoreDefaultSources: () => void;
  unitMode?: UnitMode;
}

type ChartStyle = CSSProperties & {
  "--bar-color": string;
  "--bar-size": string;
};

export function ComparisonResults({
  comparison,
  displayMode,
  selectedObservations,
  view,
  onViewChange,
  onRestoreDefaultSources,
  unitMode = "scientific",
}: ComparisonResultsProps) {
  // Automatic table view when 9 or more technologies are selected
  const effectiveView = selectedObservations.length >= 9 ? "table" : view;

  const scaleMaximum = getComparisonScale(selectedObservations);

  return (
    <div className={styles.chartPanel}>
      <div className={styles.chartHeader}>
        <div>
          <h2 id="metric-title">{comparison.metricName}</h2>
          <p>{comparison.unit}</p>
        </div>
        <button
          aria-pressed={effectiveView === "table"}
          className={styles.viewButton}
          onClick={() =>
            onViewChange(effectiveView === "chart" ? "table" : "chart")
          }
          type="button"
        >
          <Table aria-hidden size={19} />
          {effectiveView === "chart" ? "Table view" : "Chart view"}
        </button>
      </div>

      <ComparisonWarnings warnings={comparison.warnings} />

      {selectedObservations.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No technologies selected</h3>
          <p>
            Add at least one energy technology from the controls above to
            compare.
          </p>
          <button
            onClick={onRestoreDefaultSources}
            type="button"
            className={styles.emptyStateButton}
          >
            Restore default technologies
          </button>
        </div>
      ) : effectiveView === "chart" ? (
        <div className={styles.chart}>
          <span className={styles.zero}>0</span>
          {selectedObservations.map((observation) => {
            const projection = projectObservation(
              observation,
              displayMode,
              unitMode,
              comparison.metricId,
            );
            const chartStyle: ChartStyle = {
              "--bar-color": observation.color,
              "--bar-size": `${((observation.typicalValue ?? 0) / scaleMaximum) * 100}%`,
            };

            return (
              <div
                className={styles.chartRow}
                key={observation.technologyId}
                style={chartStyle}
              >
                <span className={styles.marker}>
                  <SourceMarker marker={observation.marker} />
                </span>
                <span data-chart-label className={styles.technologyLabel}>
                  {observation.technologyName}
                </span>
                <span className={styles.chartMeasure}>
                  {projection.kind === "value" ? (
                    <span className={styles.barTrack} aria-hidden>
                      <span className={styles.bar} />
                    </span>
                  ) : (
                    <span className={styles.pendingTrack} aria-hidden />
                  )}
                  <EvidenceDialog
                    comparison={comparison}
                    displayLabel={projection.label}
                    observation={observation}
                    triggerLabel={`Inspect evidence for ${observation.technologyName}`}
                  />
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.tableScroll}>
          <table aria-label={`${comparison.metricName} comparison`}>
            <thead>
              <tr>
                <th scope="col">Technology</th>
                <th scope="col">Value</th>
                <th scope="col">Unit</th>
                <th scope="col">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {selectedObservations.map((observation) => {
                const projection = projectObservation(
                  observation,
                  displayMode,
                  unitMode,
                  comparison.metricId,
                );
                return (
                  <tr key={observation.technologyId}>
                    <th scope="row">{observation.technologyName}</th>
                    <td>{projection.label}</td>
                    <td>{comparison.unit}</td>
                    <td>
                      <EvidenceDialog
                        appearance="inline"
                        comparison={comparison}
                        observation={observation}
                        triggerLabel={`Inspect evidence for ${observation.technologyName}`}
                      />
                      <span>
                        {observation.evidenceStatus === "reviewed"
                          ? "Published record"
                          : "Review pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ul aria-label="Accessible comparison summary" className={styles.srOnly}>
        {selectedObservations.map((observation) => {
          const projection = projectObservation(
            observation,
            displayMode,
            unitMode,
            comparison.metricId,
          );
          return (
            <li key={observation.technologyId}>
              {observation.technologyName}: {projection.label}
              {projection.kind === "value" ? ` ${comparison.unit}` : ""}
            </li>
          );
        })}
      </ul>

      <p className={styles.previewNotice}>
        Preview data for interface development only — not for citation or
        decision-making.
      </p>
    </div>
  );
}
