import type {
  DisplayMode,
  ObservationProjection,
  PreviewObservation,
  UnitMode,
} from "./comparison-types";
import {
  calculateHumanEquivalent,
  type HumanEquivalentAssumption,
} from "@/lib/evidence/units";

export const HUMAN_EQUIVALENTS: Record<string, HumanEquivalentAssumption> = {
  "lifecycle-ghg": {
    label: "km driving eq.",
    quantityPerEquivalent: 120, // ~120 g CO2e / km in passenger vehicle
    sourceNote: "Average passenger vehicle emits ~120 g CO₂e / km (EEA 2023).",
    unit: "gCO2e/kWh",
  },
};

export function projectObservation(
  observation: PreviewObservation,
  mode: DisplayMode,
  unitMode: UnitMode = "scientific",
  metricId?: string,
): ObservationProjection {
  if (observation.evidenceStatus === "unreviewed") {
    return {
      kind: "unavailable",
      label:
        "We do not currently have reliable comparable data for this technology and metric.",
    };
  }

  const assumption =
    unitMode === "human" && metricId ? HUMAN_EQUIVALENTS[metricId] : undefined;

  if (mode === "typical") {
    if (assumption) {
      try {
        const eq = calculateHumanEquivalent({
          scientific: {
            value: observation.typicalValue,
            unit: assumption.unit,
          },
          assumption,
        });
        const rounded = Number(eq.equivalents.toFixed(2));
        return {
          kind: "value",
          label: `${rounded} ${assumption.label}`,
          value: rounded,
        };
      } catch {
        // Fallback to scientific value if conversion assumption fails
      }
    }

    return {
      kind: "value",
      label: String(observation.typicalValue),
      value: observation.typicalValue,
    };
  }

  if (mode === "range") {
    if (observation.range) {
      if (assumption) {
        try {
          const minEq = calculateHumanEquivalent({
            scientific: { value: observation.range.min, unit: assumption.unit },
            assumption,
          });
          const maxEq = calculateHumanEquivalent({
            scientific: { value: observation.range.max, unit: assumption.unit },
            assumption,
          });
          const roundedMin = Number(minEq.equivalents.toFixed(2));
          const roundedMax = Number(maxEq.equivalents.toFixed(2));
          return {
            kind: "value",
            label: `${roundedMin} – ${roundedMax} ${assumption.label}`,
            value: observation.typicalValue,
          };
        } catch {
          // Fallback to scientific range
        }
      }

      return {
        kind: "value",
        label: `${observation.range.min} - ${observation.range.max}`,
        value: observation.typicalValue, // for the bar chart typical dot
      };
    }
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
