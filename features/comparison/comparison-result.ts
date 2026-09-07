import type { ComparisonState } from "./comparison-types";

export type ComparisonStatus =
  "ready" | "partial" | "empty" | "unavailable" | "error";

export type RangeSemantics =
  "min-max" | "p10-p90" | "p25-p75" | "confidence-interval" | "scenarios";

export interface ComparisonRange {
  min: number;
  max: number;
  semantics: RangeSemantics;
}

export interface AvailableComparisonEntry {
  kind: "available";
  technologyId: string;
  observationIds: readonly string[];
  scientificLabel: string;
  displayLabel: string;
  evidenceId: string;
  valueKind: "numeric" | "categorical";
  value: number | string;
  numericValue: number | null;
  unit: string;
  range: ComparisonRange | null;
  source: {
    name: string;
    url: string | null;
  } | null;
  verifiedAt: string | null;
  datasetVersionId?: string;
  methodology?: string;
  systemBoundary?: string;
  uncertainty?: string;
}

export interface UnavailableComparisonEntry {
  kind: "missing" | "restricted" | "incompatible";
  technologyId: string;
  message: string;
}

export type ComparisonEntry =
  AvailableComparisonEntry | UnavailableComparisonEntry;

export interface ComparisonResult {
  state: ComparisonState;
  status: ComparisonStatus;
  entries: readonly ComparisonEntry[];
  effectiveGeographyId: string | null;
  datasetVersionIds: readonly string[];
  warnings: readonly string[];
}
