import type { EvidenceRepository } from "@/lib/evidence/repository";
import { LocalEvidenceRepository } from "@/lib/evidence/local-repository";
import { PUBLISHED_EVIDENCE_SNAPSHOT } from "@/lib/evidence/published-evidence";
import { getComparisonResult } from "./comparison-engine";
import type {
  ComparisonState,
  PreviewComparison,
  PreviewObservation,
} from "./comparison-types";
import type { ComparisonResult } from "./comparison-result";
import {
  TECHNOLOGY_MARKERS as MARKER_MAP,
  TECHNOLOGY_COLORS as COLOR_MAP,
  getTechnology,
} from "./comparison-technology-catalog";
import { getMetric } from "@/lib/evidence/metrics";
import { getUnitDisplayLabel } from "@/lib/evidence/units";

const GEOGRAPHY_DISPLAY: Record<string, string> = {
  global: "Global",
  india: "India",
};

const defaultEvidenceRepository = new LocalEvidenceRepository(
  PUBLISHED_EVIDENCE_SNAPSHOT,
);

// Internal helper — not exported. Use fetchComparisonData for all external callers.
async function resolveComparisonData(
  state: ComparisonState,
): Promise<{ result: ComparisonResult; comparison: PreviewComparison }> {
  const repository: EvidenceRepository = defaultEvidenceRepository;

  const result = await getComparisonResult(state, repository);
  const comparison = mapResultToPreviewComparison(result, state);

  return { result, comparison };
}

export async function fetchComparisonData(
  state: ComparisonState,
): Promise<PreviewComparison> {
  const { comparison } = await resolveComparisonData(state);
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
          : (entry.numericValue ?? null);

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
        technologyName:
          getTechnology(techId)?.name ??
          techId.charAt(0).toUpperCase() + techId.slice(1),
        color,
        marker,
        typicalValue: null,
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
  const unit = getUnitDisplayLabel(rawUnit);

  const metricDef = getMetric(state.metric);
  const metricName =
    metricDef?.name ??
    (availableEntry?.kind === "available"
      ? availableEntry.scientificLabel
      : state.metric);
  const metricShortName =
    metricDef?.shortName ?? metricDef?.name ?? state.metric;

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
