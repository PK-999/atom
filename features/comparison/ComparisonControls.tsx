"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
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
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type CSSProperties,
} from "react";

import { METRICS } from "@/lib/evidence/metrics";
import type { Metric } from "@/lib/evidence/schemas";
import { getUnitDisplayLabel } from "@/lib/evidence/units";
import type {
  ComparisonState,
  DisplayMode,
  EnergyMarker,
  PreviewObservation,
  UnitMode,
} from "./comparison-types";
import styles from "./ComparisonLab.module.css";

import {
  TECHNOLOGY_CATALOG,
  type TechnologyCatalogEntry,
} from "./comparison-technology-catalog";

export type TechnologyInfo = TechnologyCatalogEntry;
export const AVAILABLE_TECHNOLOGIES: readonly TechnologyInfo[] =
  TECHNOLOGY_CATALOG;

export interface GeographyOption {
  readonly id: string;
  readonly name: string;
}

export const AVAILABLE_GEOGRAPHIES: readonly GeographyOption[] = [
  { id: "global", name: "Global" },
  { id: "india", name: "India" },
] as const;

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
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up the clipboard-copied timer on unmount to avoid setState on an
  // unmounted component (React 19 silences this, but it is still a resource leak).
  useEffect(
    () => () => {
      if (copiedTimerRef.current !== null) clearTimeout(copiedTimerRef.current);
    },
    [],
  );

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
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.shortName && m.shortName.toLowerCase().includes(q)) ||
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
        if (copiedTimerRef.current !== null)
          clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(
          () => setCopiedNotification(false),
          3000,
        );
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
                <div className={styles.dialogTechGrid}>
                  {unselectedTechnologies.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => {
                        onAddSource(tech.id);
                        setAddSourceOpen(false);
                      }}
                      type="button"
                      className={styles.dialogTechButton}
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
              className={styles.contextButton}
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

              <div className={styles.searchWrapper}>
                <input
                  type="search"
                  placeholder="Search metrics by name or definition..."
                  value={metricQuery}
                  onChange={(e) => setMetricQuery(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search comparison metrics"
                />
                <span className={styles.searchIcon}>
                  <MagnifyingGlass aria-hidden size={18} />
                </span>
              </div>

              {recentMetricIds.length > 0 && !metricQuery ? (
                <div className={styles.metricSection}>
                  <p className={styles.metricSectionTitle}>Recently Viewed</p>
                  <div className={styles.metricChipRow}>
                    {recentMetricIds.map((id) => {
                      const m = METRICS.find((def) => def.id === id);
                      if (!m) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => handleSelectMetric(id)}
                          type="button"
                          className={styles.metricChip}
                        >
                          {m.shortName ?? m.name ?? m.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {relatedMetrics.length > 0 && !metricQuery ? (
                <div className={styles.metricSection}>
                  <p className={styles.metricSectionTitle}>
                    Related in{" "}
                    {
                      CATEGORY_NAMES[
                        currentMetricDef?.category ?? "environment"
                      ]
                    }
                  </p>
                  <div className={styles.metricChipRow}>
                    {relatedMetrics.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMetric(m.id)}
                        type="button"
                        className={styles.metricChip}
                      >
                        {m.shortName ?? m.name ?? m.id}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={styles.metricListScroll}>
                {Array.from(groupedMetrics.entries()).map(
                  ([category, items]) => (
                    <div key={category}>
                      <h3 className={styles.metricSectionTitle}>
                        {CATEGORY_NAMES[category]}
                      </h3>
                      <div className={styles.metricGroupItems}>
                        {items.map((metric) => (
                          <button
                            key={metric.id}
                            onClick={() => handleSelectMetric(metric.id)}
                            type="button"
                            className={styles.metricRow}
                            data-active={metric.id === state.metric}
                          >
                            <div className={styles.metricRowTop}>
                              <strong className={styles.metricRowTitle}>
                                {metric.shortName ?? metric.name ?? metric.id}
                              </strong>
                              <span className={styles.metricRowUnit}>
                                {metric.canonicalUnit
                                  ? getUnitDisplayLabel(metric.canonicalUnit)
                                  : ""}
                              </span>
                            </div>
                            <p className={styles.metricRowDesc}>
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

        <div className={styles.geographySelectWrapper}>
          <Globe aria-hidden size={20} />
          <label htmlFor="geography-select" className={styles.srOnly}>
            Select comparison geography
          </label>
          <select
            id="geography-select"
            value={state.region}
            onChange={(e) => onGeographyChange(e.target.value)}
            className={styles.geographySelect}
            aria-label={`Geography: ${geography}`}
          >
            {AVAILABLE_GEOGRAPHIES.map((geo) => (
              <option key={geo.id} value={geo.id}>
                {geo.name}
              </option>
            ))}
          </select>
          <CaretDown
            aria-hidden
            size={14}
            className={styles.geographySelectArrow}
          />
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
          className={styles.contextButton}
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
          className={styles.contextButton}
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
          className={`${styles.contextButton} ${styles.contextButtonReset}`}
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
            <div className={styles.shareInputWrapper}>
              <input
                readOnly
                type="text"
                value={canonicalUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className={styles.shareInput}
                aria-label="Canonical comparison link"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
