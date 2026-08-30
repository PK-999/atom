export type { ComplexityLevel } from "@/lib/preferences/complexity-preference";

export type DisplayMode = "typical" | "range" | "raw";

export type EnergyMarker =
  "circle" | "square" | "triangle" | "diamond" | "pentagon";

export interface PreviewObservation {
  technologyId: string;
  technologyName: string;
  color: string;
  marker: EnergyMarker;
  typicalValue: number;
  range: null;
  evidenceStatus: "unreviewed";
  source: null;
  verifiedAt: null;
}

export interface PreviewComparison {
  metricId: string;
  metricName: string;
  metricShortName: string;
  geography: "Global";
  unit: "g CO₂e / kWh";
  defaultComplexity: "curious";
  defaultMode: "typical";
  observations: PreviewObservation[];
}

export type ObservationProjection =
  | { kind: "value"; label: string; value: number }
  | { kind: "unavailable"; label: string };
