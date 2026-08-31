import type { Observation } from "./schemas";
import { canConvertUnit } from "./units";

export type ComparabilityIssueCode =
  | "metric-mismatch"
  | "value-kind-mismatch"
  | "convertible-units"
  | "incompatible-unit-dimensions"
  | "geography-mismatch"
  | "period-mismatch"
  | "methodology-mismatch"
  | "system-boundary-mismatch";

export interface ComparabilityIssue {
  affectedObservationIds: string[];
  code: ComparabilityIssueCode;
  message: string;
  severity: "warning" | "blocker";
}

export interface ComparabilityAssessment {
  comparable: boolean;
  issues: ComparabilityIssue[];
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export function assessComparability(
  observations: readonly Observation[],
): ComparabilityAssessment {
  if (observations.length < 2) return { comparable: true, issues: [] };

  const affectedObservationIds = observations.map(({ id }) => id);
  const issues: ComparabilityIssue[] = [];
  const addIssue = (
    code: ComparabilityIssueCode,
    severity: ComparabilityIssue["severity"],
    message: string,
  ) => issues.push({ affectedObservationIds, code, message, severity });

  if (unique(observations.map(({ metricId }) => metricId)).length > 1) {
    addIssue(
      "metric-mismatch",
      "blocker",
      "These observations describe different metrics.",
    );
  }

  const kinds = unique(observations.map(({ kind }) => kind));
  if (kinds.length > 1) {
    addIssue(
      "value-kind-mismatch",
      "blocker",
      "Numeric and categorical observations cannot be directly compared.",
    );
  } else if (kinds[0] === "numeric") {
    const numeric = observations.filter(
      (observation) => observation.kind === "numeric",
    );
    const units = unique(numeric.map(({ unit }) => unit));
    if (units.length > 1) {
      const target = units[0];
      if (units.every((unit) => canConvertUnit(unit, target))) {
        addIssue(
          "convertible-units",
          "warning",
          "Units differ but share a physical dimension and can be normalized.",
        );
      } else {
        addIssue(
          "incompatible-unit-dimensions",
          "blocker",
          "Units describe different physical dimensions or are not registered.",
        );
      }
    }
  }

  const geographyIds = unique(
    observations.map(({ geographyId }) => geographyId),
  );
  const allExplicitlyGlobal = observations.every(
    ({ geographyScope }) => geographyScope === "global",
  );
  if (geographyIds.length > 1 && !allExplicitlyGlobal) {
    addIssue(
      "geography-mismatch",
      "blocker",
      "The observations apply to different non-global geographies.",
    );
  }

  const periods = unique(
    observations.map(({ period }) => `${period.startYear}:${period.endYear}`),
  );
  if (periods.length > 1) {
    addIssue(
      "period-mismatch",
      "warning",
      "The observations cover different periods; interpret the comparison with care.",
    );
  }

  if (unique(observations.map(({ methodology }) => methodology)).length > 1) {
    addIssue(
      "methodology-mismatch",
      "blocker",
      "The observations use materially different methodologies.",
    );
  }

  if (
    unique(observations.map(({ systemBoundary }) => systemBoundary)).length > 1
  ) {
    addIssue(
      "system-boundary-mismatch",
      "blocker",
      "The observations use different system boundaries.",
    );
  }

  return {
    comparable: !issues.some(({ severity }) => severity === "blocker"),
    issues,
  };
}
