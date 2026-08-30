export type ChartMarker =
  "circle" | "square" | "triangle" | "diamond" | "pentagon";

export interface ComparisonDatum {
  color: string;
  formattedValue: string;
  id: string;
  label: string;
  marker: ChartMarker;
  unit: string;
  value: number;
}

export interface RangeDatum {
  color: string;
  formattedLower: string;
  formattedRepresentative: string;
  formattedUpper: string;
  id: string;
  label: string;
  lower: number;
  marker: ChartMarker;
  rangeKind: string;
  representative: number;
  unit: string;
  upper: number;
}

export interface DistributionObservation {
  formattedValue: string;
  id: string;
  value: number;
}

export interface ChartState {
  message: string;
  title: string;
  tone: "empty" | "missing" | "mismatch" | "stale" | "error";
}
