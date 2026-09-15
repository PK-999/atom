import type { EnergyMarker } from "./comparison-types";

export interface TechnologyCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly marker: EnergyMarker;
  readonly color: string;
}

export const TECHNOLOGY_CATALOG: readonly TechnologyCatalogEntry[] = [
  { id: "nuclear", name: "Nuclear", marker: "circle", color: "#7B61FF" },
  { id: "solar", name: "Solar", marker: "square", color: "#FFB020" },
  { id: "wind", name: "Wind", marker: "triangle", color: "#00CF9D" },
  { id: "gas", name: "Gas", marker: "diamond", color: "#FF5E5E" },
  { id: "coal", name: "Coal", marker: "pentagon", color: "#737373" },
  { id: "hydro", name: "Hydro", marker: "triangle", color: "#2B8CEE" },
  { id: "storage", name: "Storage", marker: "square", color: "#FF8A00" },
  { id: "biomass", name: "Biomass", marker: "pentagon", color: "#48A868" },
  { id: "geothermal", name: "Geothermal", marker: "diamond", color: "#E05638" },
] as const;

export const TECHNOLOGY_MAP: ReadonlyMap<string, TechnologyCatalogEntry> =
  new Map(TECHNOLOGY_CATALOG.map((entry) => [entry.id, entry]));

export const TECHNOLOGY_COLORS: Record<string, string> = Object.fromEntries(
  TECHNOLOGY_CATALOG.map((t) => [t.id, t.color]),
);

export const TECHNOLOGY_MARKERS: Record<string, EnergyMarker> =
  Object.fromEntries(TECHNOLOGY_CATALOG.map((t) => [t.id, t.marker]));

export function getTechnology(id: string): TechnologyCatalogEntry | undefined {
  return TECHNOLOGY_MAP.get(id);
}
