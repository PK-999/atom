"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { ComparisonControls } from "./ComparisonControls";
import { getTechnology } from "./comparison-technology-catalog";
import { ComparisonEvidenceActions } from "./ComparisonEvidence";
import { ComparisonInterpretation } from "./ComparisonInterpretation";
import { ComparisonResults } from "./ComparisonResults";
import { CostWorkbench } from "@/features/simulator/CostWorkbench";
import {
  DEFAULT_COMPARISON_STATE,
  serializeComparisonState,
} from "./comparison-url";
import type {
  ComparisonState,
  DisplayMode,
  PreviewComparison,
  UnitMode,
} from "./comparison-types";
import styles from "./ComparisonLab.module.css";

interface ComparisonLabProps {
  comparison: PreviewComparison;
  initialState: ComparisonState;
}

export function ComparisonLab({
  comparison,
  initialState,
}: ComparisonLabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [view, setView] = useState<"chart" | "table">("chart");
  const [prevInitialState, setPrevInitialState] = useState(initialState);
  const [activeState, setActiveState] = useState<ComparisonState>(initialState);
  if (initialState !== prevInitialState) {
    setPrevInitialState(initialState);
    setActiveState(initialState);
  }

  const updateState = (updater: (prev: ComparisonState) => ComparisonState) => {
    const next = updater(activeState);
    setActiveState(next);
    const query = serializeComparisonState(next);
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}${window.location.hash}`, {
        scroll: false,
      });
    });
  };

  const handleAddSource = (technologyId: string) => {
    updateState((s) => {
      if (s.sources.includes(technologyId)) return s;
      return { ...s, sources: [...s.sources, technologyId] };
    });
  };

  const handleRemoveSource = (technologyId: string) => {
    updateState((s) => ({
      ...s,
      sources: s.sources.filter((id) => id !== technologyId),
    }));
  };

  const handleRestoreSources = () => {
    updateState((s) => ({
      ...s,
      sources: [...DEFAULT_COMPARISON_STATE.sources],
    }));
  };

  const handleMetricChange = (metricId: string) => {
    updateState((s) => ({ ...s, metric: metricId }));
  };

  const handleGeographyChange = (geography: string) => {
    updateState((s) => ({ ...s, region: geography }));
  };

  const handleModeChange = (mode: DisplayMode) => {
    updateState((s) => ({ ...s, mode }));
  };

  const handleUnitsChange = (units: UnitMode) => {
    updateState((s) => ({ ...s, units }));
  };

  const handleResetComparison = () => {
    updateState(() => ({ ...DEFAULT_COMPARISON_STATE }));
  };

  const selectedObservations = useMemo(() => {
    const map = new Map(
      comparison.observations.map((obs) => [obs.technologyId, obs]),
    );
    const resolved: typeof comparison.observations = [];
    for (const id of activeState.sources) {
      const obs = map.get(id);
      if (obs) {
        resolved.push(obs);
      } else {
        // Source listed in URL but no observation returned from the evidence
        // catalog yet — show an honest "pending" placeholder row rather than
        // a fabricated zero value.
        const techInfo = getTechnology(id);
        resolved.push({
          technologyId: id,
          technologyName:
            techInfo?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
          color: techInfo?.color ?? "#737373",
          marker: techInfo?.marker ?? "circle",
          typicalValue: null,
          range: null,
          evidenceStatus: "unreviewed",
          source: null,
          verifiedAt: null,
        });
      }
    }
    return resolved;
  }, [comparison, activeState.sources]);

  const evidenceObservation =
    selectedObservations[0] ?? comparison.observations[0] ?? null;

  const canonicalUrl = useMemo(() => {
    const query = serializeComparisonState(activeState);
    if (typeof window !== "undefined") {
      return `${window.location.origin}${pathname}?${query.toString()}${window.location.hash}`;
    }
    return `${pathname}?${query.toString()}`;
  }, [activeState, pathname]);

  return (
    <div className={styles.page}>
      <Image
        alt=""
        aria-hidden
        className={styles.backgroundImage}
        data-background-asset
        fill
        sizes="100vw"
        src="/assets/comparison/museum-light-background.png"
      />
      <div className={styles.shell}>
        <div className={styles.labSubheader}>
          <div className={styles.labMeta}>
            <span className={styles.labBadge}>
              <span className={styles.badgePulse} aria-hidden="true">
                ⚛
              </span>
              Interactive Comparison Lab
            </span>
            <span className={styles.labMetaDivider} aria-hidden="true">
              •
            </span>
            <span className={styles.labSubtitle}>
              Lifecycle and grid estimates, with source records and limitations
            </span>
          </div>
        </div>

        <section className={styles.intro} aria-labelledby="comparison-title">
          <p className={styles.eyebrow}>Energy Comparison Lab</p>
          <h1 id="comparison-title">See the energy trade-offs</h1>
          <p>Compare electricity technologies. Inspect every number.</p>
        </section>

        <ComparisonControls
          canonicalUrl={canonicalUrl}
          geography={comparison.geography}
          metricShortName={comparison.metricShortName}
          onAddSource={handleAddSource}
          onGeographyChange={handleGeographyChange}
          onMetricChange={handleMetricChange}
          onModeChange={handleModeChange}
          onRemoveSource={handleRemoveSource}
          onResetComparison={handleResetComparison}
          onRestoreSources={handleRestoreSources}
          onUnitsChange={handleUnitsChange}
          selectedObservations={selectedObservations}
          state={activeState}
        />

        <section
          className={styles.exhibit}
          id="comparison-exhibit"
          aria-labelledby="metric-title"
        >
          <ComparisonResults
            comparison={comparison}
            displayMode={activeState.mode}
            unitMode={activeState.units}
            onRestoreDefaultSources={handleRestoreSources}
            onViewChange={setView}
            selectedObservations={selectedObservations}
            view={view}
          />

          <ComparisonInterpretation
            hasEvidence={selectedObservations.some(
              (o) => o.evidenceStatus === "reviewed" && o.typicalValue !== null,
            )}
            displayMode={activeState.mode}
            metricId={comparison.metricId}
            metricName={comparison.metricName}
          />
        </section>

        <ComparisonEvidenceActions
          comparison={comparison}
          observation={evidenceObservation}
        />

        <details className={styles.costDetails}>
          <summary>Open the cost workbench</summary>
          <CostWorkbench />
        </details>
      </div>
    </div>
  );
}
