import type { CSSProperties } from "react";

import { StatePanel } from "@/components/ui/Feedback";

import { ChartNarrativeSummary } from "./ChartDetails";
import { ChartMarker } from "./ChartMarker";
import type { ChartState, ComparisonDatum } from "./chart-types";
import styles from "./charts.module.css";

type BarStyle = CSSProperties & {
  "--chart-color": string;
  "--chart-size": string;
};

export function ComparisonBar({
  data,
  state,
  summary,
  title,
}: {
  data: ReadonlyArray<ComparisonDatum>;
  state?: ChartState;
  summary: string;
  title: string;
}) {
  const maximum = Math.max(...data.map((datum) => Math.abs(datum.value)), 1);

  return (
    <figure aria-label={title} className={styles.figure}>
      <figcaption>
        <h3>{title}</h3>
        {data[0]?.unit ? <p>{data[0].unit}</p> : null}
      </figcaption>
      {state || data.length === 0 ? (
        <StatePanel
          message={state?.message ?? "No observations are available."}
          title={state?.title ?? "Empty chart"}
          tone={state?.tone ?? "empty"}
        />
      ) : (
        <ul aria-label={`${title} values`} className={styles.barList}>
          {data.map((datum) => (
            <li
              data-marker={datum.marker}
              key={datum.id}
              style={
                {
                  "--chart-color": datum.color,
                  "--chart-size": `${(Math.abs(datum.value) / maximum) * 100}%`,
                } as BarStyle
              }
            >
              <span className={styles.marker}>
                <ChartMarker marker={datum.marker} />
              </span>
              <strong>{datum.label}</strong>
              <span className={styles.barTrack} aria-hidden>
                <span className={styles.bar} />
              </span>
              <span className={styles.directValue}>{datum.formattedValue}</span>
            </li>
          ))}
        </ul>
      )}
      <ChartNarrativeSummary>{summary}</ChartNarrativeSummary>
    </figure>
  );
}
