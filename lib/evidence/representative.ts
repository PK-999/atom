import type { NumericObservation, Observation } from "./schemas";
import { canConvertUnit, convertUnit } from "./units";

export type RepresentativeRule =
  "mean" | "median" | "central-estimate" | "regulator-value" | "model-default";

export type RepresentativeErrorCode =
  | "empty-input"
  | "non-numeric"
  | "mixed-metrics"
  | "incompatible-units"
  | "missing-representative"
  | "ambiguous-representative";

export type RepresentativeResult =
  | {
      observationIds: string[];
      ok: true;
      rule: RepresentativeRule;
      unit: string;
      value: number;
    }
  | {
      code: RepresentativeErrorCode;
      message: string;
      observationIds: string[];
      ok: false;
    };

function error(
  code: RepresentativeErrorCode,
  message: string,
  observations: readonly Observation[],
): RepresentativeResult {
  return {
    code,
    message,
    observationIds: observations.map(({ id }) => id),
    ok: false,
  };
}

function numericValue(observation: NumericObservation): number {
  return observation.valueSemantics === "point"
    ? observation.value
    : observation.range.representative;
}

export function selectRepresentative(
  observations: readonly Observation[],
  rule: RepresentativeRule,
): RepresentativeResult {
  if (observations.length === 0) {
    return error(
      "empty-input",
      "A representative value cannot be selected without observations.",
      observations,
    );
  }
  if (observations.some(({ kind }) => kind !== "numeric")) {
    return error(
      "non-numeric",
      "Representative numeric policies cannot be applied to categorical evidence.",
      observations,
    );
  }

  const numericObservations = observations as readonly NumericObservation[];
  const metricId = numericObservations[0].metricId;
  if (
    numericObservations.some((observation) => observation.metricId !== metricId)
  ) {
    return error(
      "mixed-metrics",
      "Observations from different metrics cannot share a representative value.",
      observations,
    );
  }

  const targetUnit = numericObservations[0].unit;
  if (
    numericObservations.some(
      (observation) => !canConvertUnit(observation.unit, targetUnit),
    )
  ) {
    return error(
      "incompatible-units",
      "Observation units do not share a physical dimension.",
      observations,
    );
  }

  if (
    rule === "central-estimate" ||
    rule === "regulator-value" ||
    rule === "model-default"
  ) {
    const candidates = numericObservations.filter(
      ({ representativeKind }) => representativeKind === rule,
    );
    if (candidates.length === 0) {
      return error(
        "missing-representative",
        `No observation is explicitly identified as ${rule}.`,
        observations,
      );
    }
    if (candidates.length > 1) {
      return error(
        "ambiguous-representative",
        `More than one observation is explicitly identified as ${rule}.`,
        candidates,
      );
    }

    const candidate = candidates[0];
    return {
      observationIds: [candidate.id],
      ok: true,
      rule,
      unit: candidate.unit,
      value: numericValue(candidate),
    };
  }

  const values = numericObservations.map((observation) =>
    convertUnit(numericValue(observation), observation.unit, targetUnit),
  );
  const value =
    rule === "mean"
      ? values.reduce((sum, current) => sum + current, 0) / values.length
      : (() => {
          const sorted = [...values].sort((left, right) => left - right);
          const midpoint = Math.floor(sorted.length / 2);
          return sorted.length % 2 === 0
            ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
            : sorted[midpoint];
        })();

  return {
    observationIds: numericObservations.map(({ id }) => id),
    ok: true,
    rule,
    unit: targetUnit,
    value,
  };
}
