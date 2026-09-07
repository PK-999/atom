import { createClient } from "@/lib/supabase/server";
import type { ComparisonState } from "./comparison-types";
import type {
  PreviewComparison,
  PreviewObservation,
  EnergyMarker,
} from "./comparison-types";

// Map database technologies to UI markers
// For a production system this might be stored in the DB, but for now we map it.
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

export async function fetchComparisonData(
  state: ComparisonState,
): Promise<PreviewComparison> {
  const supabase = await createClient();

  // 1. Fetch the requested metric
  const { data: metricData, error: metricError } = await supabase
    .from("metrics")
    .select("*")
    .eq("id", state.metric)
    .single();

  if (metricError || !metricData) {
    // Return a fallback/empty comparison if metric not found
    return {
      metricId: state.metric,
      metricName: "Unknown Metric",
      metricShortName: "Unknown",
      geography: state.region as "Global",
      unit: "unknown",
      defaultComplexity: state.level,
      defaultMode: state.mode,
      observations: [],
    };
  }

  // 2. Fetch the requested technologies
  const { data: techData } = await supabase
    .from("technologies")
    .select("*")
    .in("id", state.sources);

  const technologies = techData ?? [];

  // 3. Fetch observations for this metric and these technologies
  const { data: obsData } = await supabase
    .from("observations")
    .select("*, sources(*)")
    .eq("metric_id", state.metric)
    .in("technology_id", state.sources)
    .eq("publication_status", "published");

  const observations = obsData ?? [];

  // 4. Map DB observations to UI PreviewObservation format
  const mappedObservations: PreviewObservation[] = technologies.map(
    (tech: { id: string; name: string }) => {
      // Find a matching observation
      const obs = observations.find(
        (o: {
          technology_id: string;
          value: number | string;
          range?: unknown;
          sources?: unknown;
          last_verified_at?: string;
        }) => o.technology_id === tech.id,
      );

      return {
        technologyId: tech.id,
        technologyName: tech.name,
        color: COLOR_MAP[tech.id] ?? "#CCCCCC",
        marker: MARKER_MAP[tech.id] ?? "circle",
        typicalValue: obs ? Number(obs.value) : 0,
        range: obs?.range ?? null,
        evidenceStatus: obs ? "reviewed" : "unreviewed",
        source: obs?.sources
          ? { name: obs.sources.publisher, url: obs.sources.url }
          : null,
        verifiedAt: obs?.last_verified_at ?? null,
      };
    },
  );

  // Sort them to match the order in the `sources` array
  mappedObservations.sort(
    (a, b) =>
      state.sources.indexOf(a.technologyId) -
      state.sources.indexOf(b.technologyId),
  );

  return {
    metricId: metricData.id,
    metricName: metricData.definition, // Or name if it existed, we used definition
    metricShortName: metricData.category,
    geography: state.region as "Global",
    unit: metricData.canonical_unit as "g CO₂e / kWh",
    defaultComplexity: state.level,
    defaultMode: state.mode,
    observations: mappedObservations,
  };
}
