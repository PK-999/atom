import type { ReactNode } from "react";

import { Skeleton, StatePanel } from "@/components/ui/Feedback";
import { Tooltip } from "@/components/ui/Tooltip";

import type { ChartState, ComparisonDatum } from "./chart-types";
import styles from "./charts.module.css";

export function ChartStateSurface({
  emptyMessage = "No observations are available.",
  state,
}: {
  emptyMessage?: string;
  state?: ChartState;
}) {
  if (state?.tone === "loading") {
    return <Skeleton label={state.title} />;
  }

  return (
    <StatePanel
      message={state?.message ?? emptyMessage}
      title={state?.title ?? "Empty chart"}
      tone={state?.tone ?? "empty"}
    />
  );
}

export function ChartNarrativeSummary({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.narrative} role="note">
      <strong>What this shows</strong>
      <p>{children}</p>
    </aside>
  );
}

export function ChartTooltip({
  content,
  label,
}: {
  content: string;
  label: string;
}) {
  return <Tooltip content={content} label={label} />;
}

export function ChartTableFallback({
  caption,
  data,
}: {
  caption: string;
  data: ReadonlyArray<ComparisonDatum>;
}) {
  return (
    <div className={styles.tableScroll}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Value</th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.id}>
              <th scope="row">{datum.label}</th>
              <td>{datum.formattedValue}</td>
              <td>{datum.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
