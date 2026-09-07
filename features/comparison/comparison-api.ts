import { createClient } from "@/lib/supabase/server";
import { SupabaseEvidenceRepository } from "@/lib/supabase/published-evidence-repository";
import type { EvidenceRepository } from "@/lib/evidence/repository";
import { getComparisonResult } from "./comparison-engine";
import type {
  ComparisonState,
  PreviewComparison,
  PreviewObservation,
  EnergyMarker,
} from "./comparison-types";
import type { ComparisonResult } from "./comparison-result";

const MARKER_MAP: Record<string, EnergyMarker> = {
  nuclear: "circle",
  solar: "square",
  wind: "triangle",
  gas: "diamond",
  coal: "pentagon",
  hydro: "triangle",
  storage: "square",
  biomass: "pentagon",
  geothermal: "diamond",
};

const COLOR_MAP: Record<string, string> = {
  nuclear: "#7B61FF",
  solar: "#FFB020",
  wind: "#00CF9D",
  gas: "#FF5E5E",
  coal: "#737373",
  hydro: "#2B8CEE",
  storage: "#FF8A00",
  biomass: "#48A868",
  geothermal: "#E05638",
};

const GEOGRAPHY_DISPLAY: Record<string, string> = {
  global: "Global",
  india: "India",
};

const METRIC_LABELS: Record<string, { name: string; shortName: string }> = {
  "lifecycle-ghg": {
    name: "Lifecycle greenhouse-gas emissions",
    shortName: "Lifecycle emissions",
  },
  "land-use": {
    name: "Direct and indirect land use",
    shortName: "Land use",
  },
  "water-withdrawal": {
    name: "Operational water withdrawal",
    shortName: "Water withdrawal",
  },
  "water-consumption": {
    name: "Operational water consumption",
    shortName: "Water consumption",
  },
  "capacity-factor": {
    name: "Annual capacity factor",
    shortName: "Capacity factor",
  },
};

function formatUnit(unit: string): string {
  if (unit === "gCO2e/kWh") return "g CO₂e / kWh";
  if (unit === "kgCO2e/MWh") return "kg CO₂e / MWh";
  if (unit === "m2/MWh") return "m² / MWh";
  if (unit === "ha/TWh") return "ha / TWh";
  if (unit === "L/MWh") return "L / MWh";
  if (unit === "m3/MWh") return "m³ / MWh";
  if (unit === "t/TWh") return "t / TWh";
  if (unit === "kg/MWh") return "kg / MWh";
  return unit;
}

export async function getComparisonData(
  state: ComparisonState,
): Promise<{ result: ComparisonResult; comparison: PreviewComparison }> {
  let repository: EvidenceRepository | null = null;
  try {
    const supabase = await createClient();
    repository = new SupabaseEvidenceRepository(supabase);
  } catch {
    repository = null;
  }

  const result = await getComparisonResult(state, repository);
  const comparison = mapResultToPreviewComparison(result, state);

  return { result, comparison };
}

export async function fetchComparisonData(
  state: ComparisonState,
): Promise<PreviewComparison> {
  const { comparison } = await getComparisonData(state);
  return comparison;
}

function mapResultToPreviewComparison(
  result: ComparisonResult,
  state: ComparisonState,
): PreviewComparison {
  const observations: PreviewObservation[] = [];

  for (const entry of result.entries) {
    const techId = entry.technologyId;
    const color = COLOR_MAP[techId] ?? "#737373";
    const marker = MARKER_MAP[techId] ?? "circle";

    if (entry.kind === "available") {
      const typicalValue =
        typeof entry.value === "number"
          ? entry.value
          : (entry.numericValue ?? 0);

      observations.push({
        technologyId: techId,
        technologyName: entry.displayLabel,
        color,
        marker,
        typicalValue,
        range: entry.range
          ? {
              min: entry.range.min,
              max: entry.range.max,
              semantics: entry.range.semantics,
            }
          : null,
        evidenceStatus: "reviewed",
        source: entry.source,
        verifiedAt: entry.verifiedAt,
        datasetVersionId: entry.datasetVersionId ?? null,
        methodology: entry.methodology ?? null,
        systemBoundary: entry.systemBoundary ?? null,
        uncertainty: entry.uncertainty ?? null,
        evidenceId: entry.evidenceId ?? null,
      });
    } else {
      observations.push({
        technologyId: techId,
        technologyName: techId.charAt(0).toUpperCase() + techId.slice(1),
        color,
        marker,
        typicalValue: 0,
        range: null,
        evidenceStatus: "unreviewed",
        source: null,
        verifiedAt: null,
        datasetVersionId: null,
        methodology: null,
        systemBoundary: null,
        uncertainty: null,
        evidenceId: null,
      });
    }
  }

  const availableEntry = result.entries.find((e) => e.kind === "available");
  const rawUnit =
    availableEntry?.kind === "available" ? availableEntry.unit : "unknown";
  const unit = formatUnit(rawUnit);

  const metricLabel = METRIC_LABELS[state.metric];
  const metricName =
    metricLabel?.name ??
    (availableEntry?.kind === "available"
      ? availableEntry.scientificLabel
      : state.metric);
  const metricShortName = metricLabel?.shortName ?? state.metric;

  const geographyId = result.effectiveGeographyId ?? state.region;
  const geography = GEOGRAPHY_DISPLAY[geographyId] ?? geographyId;

  return {
    metricId: state.metric,
    metricName,
    metricShortName,
    geography,
    unit,
    defaultComplexity: state.level,
    defaultMode: state.mode,
    observations,
    datasetVersionIds: result.datasetVersionIds,
    warnings: result.warnings,
  };
}
