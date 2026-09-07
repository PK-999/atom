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
};

const COLOR_MAP: Record<string, string> = {
  nuclear: "#7B61FF",
  solar: "#FFB020",
  wind: "#00CF9D",
  gas: "#FF5E5E",
  coal: "#737373",
};

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
      });
    }
  }

  const availableEntry = result.entries.find((e) => e.kind === "available");
  const unit =
    availableEntry?.kind === "available" ? availableEntry.unit : "unknown";

  return {
    metricId: state.metric,
    metricName:
      availableEntry?.kind === "available"
        ? availableEntry.scientificLabel
        : state.metric,
    metricShortName: state.metric,
    geography: result.effectiveGeographyId ?? state.region,
    unit,
    defaultComplexity: state.level,
    defaultMode: state.mode,
    observations,
  };
}
