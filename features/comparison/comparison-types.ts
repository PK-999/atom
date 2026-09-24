import type { ComplexityLevel } from "@/lib/preferences/complexity-preference";
export type { ComplexityLevel };

export type DisplayMode = "typical" | "range" | "raw";

export type UnitMode = "scientific" | "human";

export interface ComparisonState {
  sources: string[];
  metric: string;
  region: string;
  mode: DisplayMode;
  units: UnitMode;
  level: ComplexityLevel;
}

export type EnergyMarker =
  "circle" | "square" | "triangle" | "diamond" | "pentagon";

export interface PreviewObservation {
  technologyId: string;
  technologyName: string;
  color: string;
  marker: EnergyMarker;
  typicalValue: number | null;
  range: {
    min: number;
    max: number;
    semantics:
      "min-max" | "p10-p90" | "p25-p75" | "confidence-interval" | "scenarios";
  } | null;
  evidenceStatus: "reviewed" | "unreviewed";
  source: {
    name: string;
    url: string | null;
  } | null;
  verifiedAt: string | null;
  datasetVersionId?: string | null;
  methodology?: string | null;
  systemBoundary?: string | null;
  uncertainty?: string | null;
  evidenceId?: string | null;
}

export interface PreviewComparison {
  metricId: string;
  metricName: string;
  metricShortName: string;
  geography: string;
  unit: string;
  defaultComplexity: ComplexityLevel;
  defaultMode: DisplayMode;
  observations: PreviewObservation[];
  datasetVersionIds?: readonly string[];
  warnings?: readonly string[];
}

export type ObservationProjection =
  | { kind: "value"; label: string; value: number }
  | { kind: "unavailable"; label: string };
