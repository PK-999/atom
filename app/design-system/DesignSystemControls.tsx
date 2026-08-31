"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { OverlayPanel } from "@/components/ui/OverlayPanel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";

import styles from "./DesignSystemPlayground.module.css";

export function DesignSystemControls() {
  const [chipSelected, setChipSelected] = useState(true);
  const [displayMode, setDisplayMode] = useState("typical");
  const [commandSelection, setCommandSelection] =
    useState("No metric selected");

  return (
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
            <Chip disabled onSelectedChange={() => undefined} selected={false}>
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
                content: "A concise default view keeps the primary task clear.",
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
  );
}
