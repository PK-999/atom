"use client";

import { useState } from "react";

import {
  ChartNarrativeSummary,
  ChartTableFallback,
  ChartTooltip,
} from "@/components/charts/ChartDetails";
import { ComparisonBar } from "@/components/charts/ComparisonBar";
import { DistributionPlot } from "@/components/charts/DistributionPlot";
import { RangePlot } from "@/components/charts/RangePlot";
import type {
  ComparisonDatum,
  RangeDatum,
} from "@/components/charts/chart-types";
import { ChallengeNumber } from "@/components/evidence/ChallengeNumber";
import { DataPassport } from "@/components/evidence/DataPassport";
import { EvidenceBadge } from "@/components/evidence/EvidenceBadge";
import {
  ConfidenceNote,
  MethodologySummary,
} from "@/components/evidence/EvidenceNotes";
import { SourceDrawer } from "@/components/evidence/SourceDrawer";
import type { EvidenceViewModel } from "@/components/evidence/evidence-view-model";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { Skeleton, StatePanel } from "@/components/ui/Feedback";
import { OverlayPanel } from "@/components/ui/OverlayPanel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";

import styles from "./DesignSystemPlayground.module.css";

const comparisonData: ReadonlyArray<ComparisonDatum> = [
  {
    color: "var(--atom-energy-nuclear)",
    formattedValue: "25 fixture units",
    id: "alpha",
    label: "Alpha fixture",
    marker: "circle",
    unit: "fixture units",
    value: 25,
  },
  {
    color: "var(--atom-energy-solar)",
    formattedValue: "70 fixture units",
    id: "beta",
    label: "Beta fixture",
    marker: "square",
    unit: "fixture units",
    value: 70,
  },
  {
    color: "var(--atom-energy-wind)",
    formattedValue: "48 fixture units",
    id: "gamma",
    label: "Gamma fixture",
    marker: "triangle",
    unit: "fixture units",
    value: 48,
  },
];

const rangeData: ReadonlyArray<RangeDatum> = [
  {
    color: "var(--atom-energy-wind)",
    formattedLower: "10 fixture units",
    formattedRepresentative: "20 fixture units",
    formattedUpper: "35 fixture units",
    id: "range-alpha",
    label: "Range fixture",
    lower: 10,
    marker: "triangle",
    rangeKind: "Synthetic min–max",
    representative: 20,
    unit: "fixture units",
    upper: 35,
  },
];

const evidenceFixture: EvidenceViewModel = {
  alternatives: [
    {
      difference: "Uses a different synthetic boundary.",
      label: "Alternative fixture",
      value: "Alternative fixture value",
    },
  ],
  differenceReasons: ["Fixture boundary", "Fixture period"],
  geography: "Synthetic geography",
  lastVerified: "2026-08-30",
  limitations: ["Synthetic component fixture — not scientific evidence."],
  method: "Synthetic method used only to verify interface layout.",
  metric: "Synthetic metric",
  period: "Synthetic period",
  publicationVersion: "Fixture version 1",
  range: "Synthetic min–max",
  representativeKind: "Fixture median",
  source: {
    title: "Example institutional source",
    url: "https://example.com/source",
  },
  status: "published",
  systemBoundary: "Synthetic system boundary",
  technology: "Synthetic technology",
  transformation: "Synthetic normalization note.",
  uncertainty: "This note demonstrates uncertainty presentation only.",
  unit: "fixture units",
  value: "Synthetic representative value",
};

export function DesignSystemPlayground() {
  const [chipSelected, setChipSelected] = useState(true);
  const [displayMode, setDisplayMode] = useState("typical");
  const [commandSelection, setCommandSelection] =
    useState("No metric selected");

  return (
    <div className={styles.playground}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Stage 4 verification surface</p>
        <h1>ATOM component playground</h1>
        <p>
          Shared controls, evidence interactions, chart grammar, and resilient
          states for the evidence-first product shell.
        </p>
        <aside className={styles.fixtureNotice}>
          All values below are synthetic interface geometry. They are not
          scientific evidence and must not be cited.
        </aside>
      </header>

      <section className={styles.section} aria-labelledby="controls-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Foundation</p>
          <h2 id="controls-title">Controls and overlays</h2>
        </div>
        <div className={styles.cardGrid}>
          <article className={styles.card}>
            <h3>Buttons and chips</h3>
            <div className={styles.controlRow}>
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="quiet">Quiet action</Button>
              <Button loading>Loading action</Button>
              <Button disabled>Disabled action</Button>
            </div>
            <div className={styles.controlRow}>
              <Chip onSelectedChange={setChipSelected} selected={chipSelected}>
                Selected source
              </Chip>
              <Chip
                disabled
                onSelectedChange={() => undefined}
                selected={false}
              >
                Unavailable source
              </Chip>
            </div>
          </article>

          <article className={styles.card}>
            <h3>Selection and explanation</h3>
            <SegmentedControl
              label="Playground display mode"
              onValueChange={setDisplayMode}
              options={[
                { label: "Typical", value: "typical" },
                { label: "Range", value: "range" },
                { label: "Raw", value: "raw" },
              ]}
              value={displayMode}
            />
            <Tabs
              items={[
                {
                  content:
                    "A concise default view keeps the primary task clear.",
                  id: "playground-summary",
                  label: "Summary",
                },
                {
                  content: "Methods and boundaries remain reachable on demand.",
                  id: "playground-method",
                  label: "Method",
                },
              ]}
              label="Playground evidence views"
            />
            <Tooltip
              content="Tooltip content is available by focus and touch, not hover alone."
              label="Define this control"
            />
          </article>

          <article className={styles.card}>
            <h3>Search and panels</h3>
            <div className={styles.controlRow}>
              <CommandMenu
                items={[
                  {
                    description: "Synthetic environmental fixture",
                    id: "fixture-environment",
                    label: "Environment fixture",
                  },
                  {
                    description: "Synthetic reliability fixture",
                    id: "fixture-reliability",
                    label: "Reliability fixture",
                  },
                ]}
                label="Browse fixture metrics"
                onSelect={(item) => setCommandSelection(item.label)}
                trigger="Open command menu"
              />
              <OverlayPanel
                description="Centered modal behavior."
                title="Dialog example"
                trigger="Open dialog"
              >
                <p>Dialogs preserve focus and close with Escape.</p>
              </OverlayPanel>
              <OverlayPanel
                description="Side panel behavior."
                title="Drawer example"
                trigger="Open drawer"
                variant="drawer"
              >
                <p>Drawers become bottom sheets on narrow screens.</p>
              </OverlayPanel>
              <OverlayPanel
                description="Mobile-first filter panel behavior."
                title="Bottom sheet example"
                trigger="Open bottom sheet"
                variant="sheet"
              >
                <p>Sheets retain complete keyboard access.</p>
              </OverlayPanel>
            </div>
            <output className={styles.output}>{commandSelection}</output>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="evidence-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Inspectability</p>
          <h2 id="evidence-title">Evidence primitives</h2>
        </div>
        <div className={styles.badgeRow}>
          <EvidenceBadge status="published" />
          <EvidenceBadge status="unreviewed" />
          <EvidenceBadge status="missing" />
          <EvidenceBadge status="restricted" />
          <EvidenceBadge status="stale" />
          <EvidenceBadge status="disputed" />
        </div>
        <div className={styles.evidenceLayout}>
          <div className={styles.card}>
            <h3>Evidence actions</h3>
            <div className={styles.controlRow}>
              <DataPassport
                evidence={evidenceFixture}
                trigger="Why this number?"
              />
              <ChallengeNumber
                evidence={evidenceFixture}
                trigger="Challenge this number"
              />
              <SourceDrawer
                sources={[evidenceFixture.source!]}
                trigger="Review sources"
              />
            </div>
          </div>
          <div className={styles.noteStack}>
            <ConfidenceNote>{evidenceFixture.uncertainty}</ConfidenceNote>
            <MethodologySummary>{evidenceFixture.method}</MethodologySummary>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="charts-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Visualization grammar</p>
          <h2 id="charts-title">Chart primitives</h2>
        </div>
        <div className={styles.chartGrid}>
          <ComparisonBar
            data={comparisonData}
            summary="Beta fixture is largest in this synthetic geometry demonstration."
            title="Synthetic comparison"
          />
          <RangePlot data={rangeData} title="Synthetic range" />
          <DistributionPlot
            observations={[
              { formattedValue: "12 fixture units", id: "one", value: 12 },
              { formattedValue: "18 fixture units", id: "two", value: 18 },
              { formattedValue: "31 fixture units", id: "three", value: 31 },
            ]}
            title="Synthetic distribution"
            unit="fixture units"
          />
          <article className={styles.card}>
            <ChartNarrativeSummary>
              Narrative interpretation remains available beside visual geometry.
            </ChartNarrativeSummary>
            <ChartTooltip
              content="Synthetic observation metadata"
              label="Inspect synthetic observation"
            />
            <ChartTableFallback
              caption="Synthetic comparison table"
              data={comparisonData}
            />
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="states-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Resilience</p>
          <h2 id="states-title">System states</h2>
        </div>
        <div className={styles.stateGrid}>
          <Skeleton label="Loading comparison geometry" />
          <StatePanel
            message="No items match the current filters."
            title="Empty result"
            tone="empty"
          />
          <StatePanel
            message="We do not currently have reliable comparable data for this metric and technology."
            title="Missing evidence"
            tone="missing"
          />
          <StatePanel
            message="These estimates use materially different methodologies and should not be interpreted as directly equivalent."
            title="Methodological mismatch"
            tone="mismatch"
          />
          <StatePanel
            message="The last verification date remains visible while review is overdue."
            title="Stale evidence"
            tone="stale"
          />
          <StatePanel
            message="The requested source could not be loaded."
            title="Source error"
            tone="error"
          />
          <StatePanel
            message="The reviewed record is ready for publication."
            title="Review passed"
            tone="success"
          />
        </div>
      </section>
    </div>
  );
}
