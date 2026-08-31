import type { CSSProperties } from "react";

import { ChartStateSurface } from "./ChartDetails";
import { getPaddedExtent } from "./chart-scale";
import type { ChartState, DistributionObservation } from "./chart-types";
import styles from "./charts.module.css";

type PointStyle = CSSProperties & { "--point-position": string };

export function DistributionPlot({
  observations,
  state,
  title,
  unit,
}: {
  observations: ReadonlyArray<DistributionObservation>;
  state?: ChartState;
  title: string;
  unit: string;
}) {
  const { minimum, span } = getPaddedExtent(
    observations.map((item) => item.value),
  );

  return (
    <figure aria-label={title} className={styles.figure}>
      <figcaption>
        <h3>{title}</h3>
        <p>{unit}</p>
      </figcaption>
      {state || observations.length === 0 ? (
        <ChartStateSurface state={state} />
      ) : (
        <>
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
        </>
      )}
    </figure>
  );
}
