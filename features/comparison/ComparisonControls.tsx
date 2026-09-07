"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { Circle } from "@phosphor-icons/react/Circle";
import { Diamond } from "@phosphor-icons/react/Diamond";
import { Flask } from "@phosphor-icons/react/Flask";
import { Globe } from "@phosphor-icons/react/Globe";
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { Pentagon } from "@phosphor-icons/react/Pentagon";
import { ShareNetwork } from "@phosphor-icons/react/ShareNetwork";
import { Square } from "@phosphor-icons/react/Square";
import { Triangle } from "@phosphor-icons/react/Triangle";
import { X } from "@phosphor-icons/react/X";
import { useState, useMemo, type CSSProperties } from "react";

import { METRICS } from "@/lib/evidence/metrics";
import type { Metric } from "@/lib/evidence/schemas";
import type {
  ComparisonState,
  DisplayMode,
  EnergyMarker,
  PreviewObservation,
  UnitMode,
} from "./comparison-types";
import styles from "./ComparisonLab.module.css";

export interface TechnologyInfo {
  id: string;
  name: string;
  marker: EnergyMarker;
  color: string;
}

export const AVAILABLE_TECHNOLOGIES: readonly TechnologyInfo[] = [
  { id: "nuclear", name: "Nuclear", marker: "circle", color: "#7B61FF" },
  { id: "solar", name: "Solar", marker: "square", color: "#FFB020" },
  { id: "wind", name: "Wind", marker: "triangle", color: "#00CF9D" },
  { id: "gas", name: "Gas", marker: "diamond", color: "#FF5E5E" },
  { id: "coal", name: "Coal", marker: "pentagon", color: "#737373" },
  { id: "hydro", name: "Hydro", marker: "triangle", color: "#2B8CEE" },
  { id: "storage", name: "Storage", marker: "square", color: "#FF8A00" },
  { id: "biomass", name: "Biomass", marker: "pentagon", color: "#48A868" },
  { id: "geothermal", name: "Geothermal", marker: "diamond", color: "#E05638" },
];

export function SourceMarker({ marker }: { marker: EnergyMarker }) {
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

const RECENT_METRICS_KEY = "atom_recent_metrics";

export function getRecentMetrics(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_METRICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (id): id is string =>
        typeof id === "string" && METRICS.some((m) => m.id === id),
    );
  } catch {
    return [];
  }
}

export function addRecentMetric(metricId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentMetrics().filter((id) => id !== metricId);
    const updated = [metricId, ...current].slice(0, 5);
    window.localStorage.setItem(RECENT_METRICS_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or restriction; recover silently
  }
}

const CATEGORY_NAMES: Record<string, string> = {
  environment: "Environment",
  reliability: "Reliability and Grid",
  economics: "Economics and Cost",
  "human-impact": "Human Impact and Safety",
  security: "Energy Security",
  technical: "Technical Characteristics",
};

interface ComparisonControlsProps {
  state: ComparisonState;
  selectedObservations: PreviewObservation[];
  metricShortName: string;
  geography: string;
  onAddSource: (techId: string) => void;
  onRemoveSource: (techId: string) => void;
  onRestoreSources: () => void;
  onMetricChange: (metricId: string) => void;
  onGeographyChange: (geography: string) => void;
  onModeChange: (mode: DisplayMode) => void;
  onUnitsChange: (units: UnitMode) => void;
  onResetComparison: () => void;
  canonicalUrl: string;
}

export function ComparisonControls({
  state,
  selectedObservations,
  metricShortName,
  geography,
  onAddSource,
  onRemoveSource,
  onRestoreSources,
  onMetricChange,
  onGeographyChange,
  onModeChange,
  onUnitsChange,
  onResetComparison,
  canonicalUrl,
}: ComparisonControlsProps) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [metricSearchOpen, setMetricSearchOpen] = useState(false);
  const [metricQuery, setMetricQuery] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const selectedIds = state.sources;
  const unselectedTechnologies = useMemo(
    () => AVAILABLE_TECHNOLOGIES.filter((t) => !selectedIds.includes(t.id)),
    [selectedIds],
  );

  const recentMetricIds = useMemo(
    () => (metricSearchOpen ? getRecentMetrics() : []),
    [metricSearchOpen],
  );

  const filteredMetrics = useMemo(() => {
    const q = metricQuery.toLowerCase().trim();
    if (!q) return METRICS;
    return METRICS.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.definition.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }, [metricQuery]);

  const groupedMetrics = useMemo(() => {
    const groups = new Map<string, Metric[]>();
    for (const m of filteredMetrics) {
      const list = groups.get(m.category) ?? [];
      list.push(m as unknown as Metric);
      groups.set(m.category, list);
    }
    return groups;
  }, [filteredMetrics]);

  const currentMetricDef = useMemo(
    () => METRICS.find((m) => m.id === state.metric),
    [state.metric],
  );

  const relatedMetrics = useMemo(() => {
    if (!currentMetricDef) return [];
    return METRICS.filter(
      (m) => m.category === currentMetricDef.category && m.id !== state.metric,
    ).slice(0, 3);
  }, [currentMetricDef, state.metric]);

  const handleSelectMetric = (metricId: string) => {
    addRecentMetric(metricId);
    onMetricChange(metricId);
    setMetricSearchOpen(false);
    setMetricQuery("");
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 3000);
      }
    } catch {
      // Clipboard write failed (e.g. lack of permissions); selectable dialog will still display
    }
    setShareDialogOpen(true);
  };

  return (
    <>
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
            {selectedObservations.length > 0 ? (
              <>
                {selectedObservations[0]?.technologyName}
                {selectedObservations[1]
                  ? ` · ${selectedObservations[1].technologyName}`
                  : ""}
                {selectedIds.length > 2 ? ` · +${selectedIds.length - 2}` : ""}
              </>
            ) : (
              "No technologies selected"
            )}
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
              key={observation.technologyId}
              onClick={() => onRemoveSource(observation.technologyId)}
              style={{ "--source-color": observation.color } as CSSProperties}
              type="button"
            >
              <SourceMarker marker={observation.marker} />
              <span>{observation.technologyName}</span>
              <X aria-hidden size={16} />
            </button>
          ))}

          <Dialog.Root open={addSourceOpen} onOpenChange={setAddSourceOpen}>
            <Dialog.Trigger asChild>
              <button
                className={styles.addSource}
                disabled={unselectedTechnologies.length === 0}
                type="button"
                aria-label="Add source"
              >
                Add source
                {unselectedTechnologies.length === 0 ? (
                  <span className={styles.soon}>all selected</span>
                ) : null}
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={styles.dialogOverlay} />
              <Dialog.Content className={styles.dialogContent}>
                <div className={styles.dialogHeader}>
                  <div>
                    <p className={styles.dialogEyebrow}>Compare Technologies</p>
                    <Dialog.Title className={styles.dialogTitle}>
                      Add Technology
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close add source"
                      className={styles.iconButton}
                      type="button"
                    >
                      <X aria-hidden size={22} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className={styles.dialogDescription}>
                  Select an electricity technology to add to the comparison
                  exhibit.
                </Dialog.Description>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "12px",
                    marginTop: "16px",
                  }}
                >
                  {unselectedTechnologies.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => {
                        onAddSource(tech.id);
                        setAddSourceOpen(false);
                      }}
                      type="button"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 16px",
                        border: "1px solid #d1cec5",
                        borderRadius: "10px",
                        background: "#fffdf8",
                        cursor: "pointer",
                        fontWeight: 600,
                        color: "#101823",
                      }}
                    >
                      <span style={{ color: tech.color }}>
                        <SourceMarker marker={tech.marker} />
                      </span>
                      <span>{tech.name}</span>
                    </button>
                  ))}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {selectedIds.length === 0 ? (
            <button
              className={styles.addSource}
              onClick={onRestoreSources}
              type="button"
            >
              Restore defaults
            </button>
          ) : null}
        </div>
      </section>

      <section aria-label="Comparison controls" className={styles.contextBar}>
        <Dialog.Root open={metricSearchOpen} onOpenChange={setMetricSearchOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                border: 0,
                color: "inherit",
                cursor: "pointer",
                font: "inherit",
              }}
              aria-label={`Current metric: ${metricShortName}. Click to change.`}
            >
              <BookOpen aria-hidden size={20} />
              <span>{metricShortName}</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.dialogOverlay} />
            <Dialog.Content className={styles.dialogContent}>
              <div className={styles.dialogHeader}>
                <div>
                  <p className={styles.dialogEyebrow}>Catalog Registry</p>
                  <Dialog.Title className={styles.dialogTitle}>
                    Select Metric
                  </Dialog.Title>
                </div>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close metric search"
                    className={styles.iconButton}
                    type="button"
                  >
                    <X aria-hidden size={22} />
                  </button>
                </Dialog.Close>
              </div>

              <div
                style={{
                  position: "relative",
                  marginBlock: "16px 20px",
                }}
              >
                <input
                  type="search"
                  placeholder="Search metrics by name or definition..."
                  value={metricQuery}
                  onChange={(e) => setMetricQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 42px",
                    borderRadius: "10px",
                    border: "1px solid #c7c4bb",
                    background: "#fffdf8",
                    font: "inherit",
                    color: "#101823",
                  }}
                  aria-label="Search comparison metrics"
                />
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    translate: "0 -50%",
                    color: "#6b7280",
                    pointerEvents: "none",
                  }}
                >
                  <MagnifyingGlass aria-hidden size={18} />
                </span>
              </div>

              {recentMetricIds.length > 0 && !metricQuery ? (
                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#5553b9",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 8px",
                    }}
                  >
                    Recently Viewed
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {recentMetricIds.map((id) => {
                      const m = METRICS.find((def) => def.id === id);
                      if (!m) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => handleSelectMetric(id)}
                          type="button"
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid #d1cec5",
                            background: "#fffdf8",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          {m.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {relatedMetrics.length > 0 && !metricQuery ? (
                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#5553b9",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 8px",
                    }}
                  >
                    Related in{" "}
                    {
                      CATEGORY_NAMES[
                        currentMetricDef?.category ?? "environment"
                      ]
                    }
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {relatedMetrics.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMetric(m.id)}
                        type="button"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #d1cec5",
                          background: "#fffdf8",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        {m.id}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div
                style={{
                  display: "grid",
                  gap: "18px",
                  maxHeight: "50vh",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {Array.from(groupedMetrics.entries()).map(
                  ([category, items]) => (
                    <div key={category}>
                      <h3
                        style={{
                          margin: "0 0 8px",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#293545",
                        }}
                      >
                        {CATEGORY_NAMES[category]}
                      </h3>
                      <div style={{ display: "grid", gap: "6px" }}>
                        {items.map((metric) => (
                          <button
                            key={metric.id}
                            onClick={() => handleSelectMetric(metric.id)}
                            type="button"
                            style={{
                              textAlign: "left",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #e5e3db",
                              background:
                                metric.id === state.metric
                                  ? "#eef0ff"
                                  : "#fffdf8",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <strong style={{ color: "#101823" }}>
                                {metric.id}
                              </strong>
                              <span
                                style={{
                                  fontSize: "0.78rem",
                                  color: "#556170",
                                  background: "#ece8df",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                {metric.canonicalUnit}
                              </span>
                            </div>
                            <p
                              style={{
                                margin: "4px 0 0",
                                fontSize: "0.85rem",
                                color: "#556170",
                              }}
                            >
                              {metric.definition}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <span aria-hidden className={styles.separator}>
          •
        </span>

        <button
          onClick={() =>
            onGeographyChange(state.region === "global" ? "india" : "global")
          }
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: 0,
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
          }}
          aria-label={`Geography: ${geography}. Click to toggle.`}
        >
          <Globe aria-hidden size={20} />
          <span>{geography}</span>
        </button>

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
              aria-pressed={state.mode === mode}
              key={mode}
              onClick={() => onModeChange(mode)}
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

        <button
          onClick={() =>
            onUnitsChange(state.units === "scientific" ? "human" : "scientific")
          }
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: 0,
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
          }}
          aria-label={`Unit system: ${state.units}. Click to toggle.`}
        >
          <Flask aria-hidden size={20} />
          <span>{state.units === "scientific" ? "Scientific" : "Human"}</span>
        </button>

        <span aria-hidden className={styles.separator}>
          •
        </span>

        <button
          onClick={handleShare}
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: 0,
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
          }}
          aria-label="Share canonical comparison URL"
        >
          <ShareNetwork aria-hidden size={18} />
          <span>{copiedNotification ? "Copied!" : "Share"}</span>
        </button>

        <span aria-hidden className={styles.separator}>
          •
        </span>

        <button
          onClick={onResetComparison}
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: 0,
            color: "#a9b6c8",
            cursor: "pointer",
            font: "inherit",
            fontSize: "0.85rem",
          }}
          aria-label="Reset comparison to default parameters"
        >
          Reset
        </button>
      </section>

      <Dialog.Root open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <div>
                <p className={styles.dialogEyebrow}>Share Comparison</p>
                <Dialog.Title className={styles.dialogTitle}>
                  Canonical Link
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close share dialog"
                  className={styles.iconButton}
                  type="button"
                >
                  <X aria-hidden size={22} />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className={styles.dialogDescription}>
              Select and copy this link to share the exact comparison
              parameters.
            </Dialog.Description>
            <div style={{ marginTop: "16px" }}>
              <input
                readOnly
                type="text"
                value={canonicalUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #c7c4bb",
                  background: "#fffdf8",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.9rem",
                  color: "#101823",
                }}
                aria-label="Canonical comparison link"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
