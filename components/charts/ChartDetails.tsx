import type { ReactNode } from "react";

import { Tooltip } from "@/components/ui/Tooltip";

import type { ComparisonDatum } from "./chart-types";
import styles from "./charts.module.css";

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
