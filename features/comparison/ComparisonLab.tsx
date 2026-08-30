"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { Circle } from "@phosphor-icons/react/Circle";
import { Diamond } from "@phosphor-icons/react/Diamond";
import { Flask } from "@phosphor-icons/react/Flask";
import { Globe } from "@phosphor-icons/react/Globe";
import { Info } from "@phosphor-icons/react/Info";
import { Pentagon } from "@phosphor-icons/react/Pentagon";
import { Square } from "@phosphor-icons/react/Square";
import { Table } from "@phosphor-icons/react/Table";
import { Triangle } from "@phosphor-icons/react/Triangle";
import { X } from "@phosphor-icons/react/X";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

import { getComparisonScale, projectObservation } from "./comparison-model";
import type {
  ComplexityLevel,
  DisplayMode,
  EnergyMarker,
  PreviewComparison,
  PreviewObservation,
} from "./comparison-types";
import styles from "./ComparisonLab.module.css";

const complexityLevels: Array<{
  value: ComplexityLevel;
  short: string;
  label: string;
}> = [
  { value: "kid", short: "1", label: "Kid" },
  { value: "simple", short: "2", label: "Simple" },
  { value: "curious", short: "3", label: "Curious" },
  { value: "technical", short: "4", label: "Technical" },
  { value: "expert", short: "5", label: "Expert" },
];

const explanations: Record<ComplexityLevel, string> = {
  kid: "Some ways of making electricity release much more climate pollution than others, even after we count building them.",
  simple:
    "Fossil fuel estimates are much higher in this comparison. The way a study counts the full lifecycle still matters.",
  curious:
    "Fossil fuel estimates are much higher in this comparison. Lifecycle methods and system boundaries still matter.",
  technical:
    "The representative values differ substantially, but system boundaries, technology vintage, and upstream assumptions affect the comparison.",
  expert:
    "These interface values are not a published synthesis. Observation-level methods, distributions, boundaries, and transformations remain unavailable until evidence review.",
};

interface ComparisonLabProps {
  comparison: PreviewComparison;
}

type ChartStyle = CSSProperties & {
  "--bar-color": string;
  "--bar-size": string;
};

function SourceMarker({ marker }: { marker: EnergyMarker }) {
  const iconProps = { size: 18, weight: "fill" as const, "aria-hidden": true };

  switch (marker) {
    case "circle":
      return <Circle {...iconProps} />;
    case "square":
      return <Square {...iconProps} />;
    case "triangle":
      return <Triangle {...iconProps} />;
    case "diamond":
      return <Diamond {...iconProps} />;
    case "pentagon":
      return <Pentagon {...iconProps} />;
  }
}

function EvidenceDialog({
  observation,
  comparison,
  triggerLabel,
  primary = false,
}: {
  observation: PreviewObservation;
  comparison: PreviewComparison;
  triggerLabel: string;
  primary?: boolean;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={primary ? styles.primaryAction : styles.secondaryAction}
          type="button"
        >
          {primary ? (
            <Flask aria-hidden size={22} />
          ) : (
            <Info aria-hidden size={20} />
          )}
          <span>{triggerLabel}</span>
          {primary ? <ArrowRight aria-hidden size={19} /> : null}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>Data passport preview</p>
              <Dialog.Title className={styles.dialogTitle}>
                Why this number?
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close evidence"
                className={styles.iconButton}
                type="button"
              >
                <X aria-hidden size={22} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className={styles.dialogDescription}>
            This passport shows the fields ATOM will expose after scientific and
            editorial review.
          </Dialog.Description>
          <dl className={styles.passportGrid}>
            <div>
              <dt>Technology</dt>
              <dd>{observation.technologyName}</dd>
            </div>
            <div>
              <dt>Representative value</dt>
              <dd>
                {observation.typicalValue} {comparison.unit}
              </dd>
            </div>
            <div>
              <dt>Geography</dt>
              <dd>{comparison.geography}</dd>
            </div>
            <div>
              <dt>Publication status</dt>
              <dd>Not yet published</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>Evidence review pending</dd>
            </div>
            <div>
              <dt>Method and system boundary</dt>
              <dd>Not available in this interface preview</dd>
            </div>
          </dl>
          <div className={styles.dialogNotice}>
            <Info aria-hidden size={20} />
            <p>
              Do not cite these preview values. The published Lab will link
              every quantitative claim to inspectable evidence.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ComparisonLab({ comparison }: ComparisonLabProps) {
  const [selectedIds, setSelectedIds] = useState(() =>
    comparison.observations.map((observation) => observation.technologyId),
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    comparison.defaultMode,
  );
  const [complexity, setComplexity] = useState<ComplexityLevel>(
    comparison.defaultComplexity,
  );
  const [view, setView] = useState<"chart" | "table">("chart");
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const selectedObservations = useMemo(
    () =>
      comparison.observations.filter((observation) =>
        selectedIds.includes(observation.technologyId),
      ),
    [comparison.observations, selectedIds],
  );
  const scaleMaximum = getComparisonScale(comparison.observations);
  const evidenceObservation =
    selectedObservations[0] ?? comparison.observations[0];

  function removeSource(technologyId: string) {
    setSelectedIds((current) =>
      current.length <= 2
        ? current
        : current.filter((id) => id !== technologyId),
    );
  }

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#comparison-exhibit">
        Skip to comparison
      </a>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link className={styles.wordmark} href="/" aria-label="ATOM home">
            ATOM
          </Link>
          <nav aria-label="Primary navigation" className={styles.navigation}>
            <Link aria-current="page" href="/compare">
              Compare
            </Link>
            <Link href="/methodology">Learn</Link>
          </nav>
          <div className={styles.complexity}>
            <span className={styles.controlLabel}>Complexity</span>
            <div
              aria-label="Complexity level"
              className={styles.levels}
              role="group"
            >
              {complexityLevels.map((level) => (
                <button
                  aria-label={level.label}
                  aria-pressed={complexity === level.value}
                  className={styles.levelButton}
                  key={level.value}
                  onClick={() => setComplexity(level.value)}
                  title={level.label}
                  type="button"
                >
                  <span aria-hidden>{level.short}</span>
                </button>
              ))}
            </div>
            <strong>
              {
                complexityLevels.find((level) => level.value === complexity)
                  ?.label
              }
            </strong>
          </div>
        </header>

        <section className={styles.intro} aria-labelledby="comparison-title">
          <p className={styles.eyebrow}>Energy Comparison Lab</p>
          <h1 id="comparison-title">See the energy trade-offs</h1>
          <p>Compare electricity technologies. Inspect every number.</p>
        </section>

        <section
          aria-label="Selected technologies"
          className={styles.sourceSection}
          data-expanded={sourcesExpanded}
        >
          <button
            aria-expanded={sourcesExpanded}
            aria-label={`${selectedIds.length} technologies selected`}
            className={styles.mobileSourceButton}
            onClick={() => setSourcesExpanded((current) => !current)}
            type="button"
          >
            <span aria-hidden className={styles.mobileMarkers}>
              {selectedObservations.map((observation) => (
                <span
                  key={observation.technologyId}
                  style={{ color: observation.color }}
                >
                  <SourceMarker marker={observation.marker} />
                </span>
              ))}
            </span>
            <span aria-hidden>
              {selectedObservations[0]?.technologyName} ·{" "}
              {selectedObservations[1]?.technologyName}
              {selectedIds.length > 2 ? ` · +${selectedIds.length - 2}` : ""}
            </span>
            <ArrowRight aria-hidden size={18} />
          </button>
          <span className={styles.sourceCount}>
            {selectedIds.length} technologies selected
          </span>
          <div className={styles.sourceChips}>
            {selectedObservations.map((observation) => (
              <button
                aria-label={`Remove ${observation.technologyName}`}
                className={styles.sourceChip}
                disabled={selectedIds.length <= 2}
                key={observation.technologyId}
                onClick={() => removeSource(observation.technologyId)}
                style={{ "--source-color": observation.color } as CSSProperties}
                type="button"
              >
                <SourceMarker marker={observation.marker} />
                <span>{observation.technologyName}</span>
                <X aria-hidden size={16} />
              </button>
            ))}
            <button className={styles.addSource} disabled type="button">
              Add source
              <span className={styles.soon}>soon</span>
            </button>
          </div>
        </section>

        <section aria-label="Comparison controls" className={styles.contextBar}>
          <div>
            <BookOpen aria-hidden size={20} />
            <span>{comparison.metricShortName}</span>
          </div>
          <span aria-hidden className={styles.separator}>
            •
          </span>
          <div>
            <Globe aria-hidden size={20} />
            <span>{comparison.geography}</span>
          </div>
          <span aria-hidden className={styles.separator}>
            •
          </span>
          <div
            className={styles.modeGroup}
            aria-label="Display mode"
            role="group"
          >
            {(["typical", "range", "raw"] as const).map((mode) => (
              <button
                aria-label={`${mode[0].toUpperCase()}${mode.slice(1)}`}
                aria-pressed={displayMode === mode}
                key={mode}
                onClick={() => setDisplayMode(mode)}
                type="button"
              >
                {mode[0].toUpperCase()}
                {mode.slice(1)}
              </button>
            ))}
          </div>
          <span aria-hidden className={styles.separator}>
            •
          </span>
          <div>
            <Flask aria-hidden size={20} />
            <span>Scientific</span>
          </div>
        </section>

        <section
          className={styles.exhibit}
          id="comparison-exhibit"
          aria-labelledby="metric-title"
        >
          <div className={styles.chartPanel}>
            <div className={styles.chartHeader}>
              <div>
                <h2 id="metric-title">{comparison.metricName}</h2>
                <p>{comparison.unit}</p>
              </div>
              <button
                aria-pressed={view === "table"}
                className={styles.viewButton}
                onClick={() =>
                  setView((current) =>
                    current === "chart" ? "table" : "chart",
                  )
                }
                type="button"
              >
                <Table aria-hidden size={19} />
                {view === "chart" ? "Table view" : "Chart view"}
              </button>
            </div>

            {view === "chart" ? (
              <div
                aria-label={`${comparison.metricName} comparison`}
                className={styles.chart}
                role="img"
              >
                <span className={styles.zero}>0</span>
                {selectedObservations.map((observation) => {
                  const projection = projectObservation(
                    observation,
                    displayMode,
                  );
                  const chartStyle: ChartStyle = {
                    "--bar-color": observation.color,
                    "--bar-size": `${(observation.typicalValue / scaleMaximum) * 100}%`,
                  };

                  return (
                    <div
                      aria-label={
                        projection.kind === "value"
                          ? `${observation.technologyName}: ${projection.label} ${comparison.unit}`
                          : `${observation.technologyName}: ${projection.label}`
                      }
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
                        <strong className={styles.value}>
                          {projection.label}
                        </strong>
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
                      );
                      return (
                        <tr key={observation.technologyId}>
                          <th scope="row">{observation.technologyName}</th>
                          <td>{projection.label}</td>
                          <td>{comparison.unit}</td>
                          <td>Review pending</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className={styles.previewNotice}>
              Preview data for interface development only — not for citation or
              decision-making.
            </p>
          </div>

          <aside
            className={styles.interpretation}
            aria-labelledby="meaning-title"
          >
            <p className={styles.eyebrow}>What this means</p>
            <h2 id="meaning-title" className={styles.srOnly}>
              Interpretation
            </h2>
            <p>{explanations[complexity]}</p>
            <Link href="/methodology">Read how ATOM reviews evidence</Link>
          </aside>
        </section>

        <section className={styles.actions} aria-label="Evidence actions">
          <EvidenceDialog
            comparison={comparison}
            observation={evidenceObservation}
            primary
            triggerLabel="Explore the evidence"
          />
          <EvidenceDialog
            comparison={comparison}
            observation={evidenceObservation}
            triggerLabel="Challenge this number"
          />
          <div className={styles.evidenceStatus} role="status">
            <Info aria-hidden size={18} />
            <span>Evidence review pending</span>
          </div>
        </section>
      </div>
    </main>
  );
}
