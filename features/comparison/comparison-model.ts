import type {
  DisplayMode,
  ObservationProjection,
  PreviewObservation,
} from "./comparison-types";

export function projectObservation(
  observation: PreviewObservation,
  mode: DisplayMode,
): ObservationProjection {
  if (mode === "typical") {
    return {
      kind: "value",
      label: String(observation.typicalValue),
      value: observation.typicalValue,
    };
  }

  if (mode === "range") {
    return {
      kind: "unavailable",
      label: "Range evidence pending review",
    };
  }

  return {
    kind: "unavailable",
    label: "Raw evidence unavailable for this preview",
  };
}

export function getComparisonScale(observations: PreviewObservation[]): number {
  return Math.max(
    1,
    ...observations.map((observation) => observation.typicalValue),
  );
}
