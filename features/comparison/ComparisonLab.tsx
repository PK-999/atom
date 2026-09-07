"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  ComplexitySelector,
  useComplexityPreference,
} from "@/components/settings/ComplexitySelector";

import { ComparisonControls } from "./ComparisonControls";
import { ComparisonEvidenceActions } from "./ComparisonEvidence";
import { ComparisonInterpretation } from "./ComparisonInterpretation";
import { ComparisonResults } from "./ComparisonResults";
import {
  DEFAULT_COMPARISON_STATE,
  serializeComparisonState,
} from "./comparison-url";
import type {
  ComparisonState,
  ComplexityLevel,
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

  const [activeLevel, setActiveLevel] = useComplexityPreference(
    initialState.level,
  );
  const [view, setView] = useState<"chart" | "table">("chart");
  const [prevInitialState, setPrevInitialState] = useState(initialState);
  const [prevActiveLevel, setPrevActiveLevel] = useState(activeLevel);
  const [activeState, setActiveState] = useState<ComparisonState>({
    ...initialState,
    level: activeLevel,
  });

  if (initialState !== prevInitialState || activeLevel !== prevActiveLevel) {
    setPrevInitialState(initialState);
    setPrevActiveLevel(activeLevel);
    setActiveState({ ...initialState, level: activeLevel });
  }

  const updateState = (updater: (prev: ComparisonState) => ComparisonState) => {
    setActiveState((current) => {
      const next = updater(current);
      const query = serializeComparisonState(next);
      startTransition(() => {
        router.push(`${pathname}?${query.toString()}`, { scroll: false });
      });
      return next;
    });
  };

  const handleComplexityChange = (newLevel: ComplexityLevel) => {
    setActiveLevel(newLevel);
    updateState((s) => ({ ...s, level: newLevel }));
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
    setActiveLevel(DEFAULT_COMPARISON_STATE.level);
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
        // Source added but not yet in comparison props
        resolved.push({
          technologyId: id,
          technologyName: id.charAt(0).toUpperCase() + id.slice(1),
          color: "#737373",
          marker: "circle",
          typicalValue: 0,
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
      return `${window.location.origin}${pathname}?${query.toString()}`;
    }
    return `${pathname}?${query.toString()}`;
  }, [activeState, pathname]);

  return (
    <main className={styles.page}>
      <Image
        alt=""
        aria-hidden
        className={styles.backgroundImage}
        data-background-asset
        fill
        sizes="100vw"
        src="/assets/comparison/museum-light-background.png"
      />
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
          <ComplexitySelector
            onChange={handleComplexityChange}
            value={activeLevel}
          />
        </header>

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
            onRestoreDefaultSources={handleRestoreSources}
            onViewChange={setView}
            selectedObservations={selectedObservations}
            view={view}
          />

          <ComparisonInterpretation
            displayMode={activeState.mode}
            level={activeLevel}
            metricId={comparison.metricId}
            metricName={comparison.metricName}
          />
        </section>

        <ComparisonEvidenceActions
          comparison={comparison}
          observation={evidenceObservation}
        />
      </div>
    </main>
  );
}
