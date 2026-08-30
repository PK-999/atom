import type { CSSProperties } from "react";

import type { DistributionObservation } from "./chart-types";
import styles from "./charts.module.css";

type PointStyle = CSSProperties & { "--point-position": string };

export function DistributionPlot({
  observations,
  title,
  unit,
}: {
  observations: ReadonlyArray<DistributionObservation>;
  title: string;
  unit: string;
}) {
  const minimum = Math.min(...observations.map((item) => item.value), 0);
  const maximum = Math.max(...observations.map((item) => item.value), 1);
  const span = Math.max(maximum - minimum, 1);

  return (
    <figure aria-label={title} className={styles.figure}>
      <figcaption>
        <h3>{title}</h3>
        <p>{unit}</p>
      </figcaption>
      <div className={styles.distributionTrack} aria-hidden>
        {observations.map((observation) => (
          <span
            className={styles.distributionPoint}
            key={observation.id}
            style={
              {
                "--point-position": `${((observation.value - minimum) / span) * 100}%`,
              } as PointStyle
            }
          />
        ))}
      </div>
      <ul
        aria-label="Distribution observations"
        className={styles.observationList}
      >
        {observations.map((observation) => (
          <li key={observation.id}>{observation.formattedValue}</li>
        ))}
      </ul>
    </figure>
  );
}
