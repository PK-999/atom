import type {
  DisplayMode,
  ObservationProjection,
  PreviewObservation,
} from "./comparison-types";

export function projectObservation(
  observation: PreviewObservation,
  mode: DisplayMode,
): ObservationProjection {
  if (observation.evidenceStatus === "unreviewed") {
    return {
      kind: "unavailable",
      label:
        "We do not currently have reliable comparable data for this technology and metric.",
    };
  }

  if (mode === "typical") {
    return {
      kind: "value",
      label: String(observation.typicalValue),
      value: observation.typicalValue,
    };
  }

  if (mode === "range") {
    if (observation.range) {
      return {
        kind: "value",
        label: `${observation.range.min} - ${observation.range.max}`,
        value: observation.typicalValue, // for the bar chart typical dot
      };
    }
    return {
      kind: "unavailable",
      label: "Range evidence unavailable",
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
