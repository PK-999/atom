import type { CSSProperties } from "react";

import { ChartMarker } from "./ChartMarker";
import type { RangeDatum } from "./chart-types";
import styles from "./charts.module.css";

type RangeStyle = CSSProperties & {
  "--chart-color": string;
  "--range-end": string;
  "--range-start": string;
  "--representative": string;
};

export function RangePlot({
  data,
  title,
}: {
  data: ReadonlyArray<RangeDatum>;
  title: string;
}) {
  const lower = Math.min(...data.map((datum) => datum.lower), 0);
  const upper = Math.max(...data.map((datum) => datum.upper), 1);
  const span = Math.max(upper - lower, 1);

  return (
    <figure aria-label={title} className={styles.figure}>
      <figcaption>
        <h3>{title}</h3>
        {data[0]?.unit ? <p>{data[0].unit}</p> : null}
      </figcaption>
      <ul aria-label={`${title} ranges`} className={styles.rangeList}>
        {data.map((datum) => (
          <li
            data-marker={datum.marker}
            key={datum.id}
            style={
              {
                "--chart-color": datum.color,
                "--range-end": `${((datum.upper - lower) / span) * 100}%`,
                "--range-start": `${((datum.lower - lower) / span) * 100}%`,
                "--representative": `${((datum.representative - lower) / span) * 100}%`,
              } as RangeStyle
            }
          >
            <span className={styles.marker}>
              <ChartMarker marker={datum.marker} />
            </span>
            <strong>{datum.label}</strong>
            <span className={styles.rangeKind}>{datum.rangeKind}</span>
            <span className={styles.rangeTrack} aria-hidden>
              <span className={styles.rangeLine} />
              <span className={styles.rangePoint} />
            </span>
            <span className={styles.rangeValues}>
              <span>{datum.formattedLower}</span>
              <strong>{datum.formattedRepresentative}</strong>
              <span>{datum.formattedUpper}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
