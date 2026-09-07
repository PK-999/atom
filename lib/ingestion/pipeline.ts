import { createClient } from "@supabase/supabase-js";
import {
  ObservationSchema,
  validateObservationAgainstMetric,
  MetricSchema,
} from "../evidence/schemas";

// Admin client for backend ingestion tasks using the service role key
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase environment variables not set for backend ingestion.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function ingestObservation(rawObservationData: unknown) {
  const supabase = getAdminClient();

  // 1. Validate data against the Zod schema
  const parseResult = ObservationSchema.safeParse(rawObservationData);
  if (!parseResult.success) {
    throw new Error(`Invalid observation data: ${parseResult.error.message}`);
  }
  const observation = parseResult.data;

  // 2. Fetch the referenced metric
  const { data: metricData, error: metricError } = await supabase
    .from("metrics")
    .select("*")
    .eq("id", observation.metricId)
    .single();

  if (metricError || !metricData) {
    throw new Error(`Metric ${observation.metricId} not found in database.`);
  }

  const metricParseResult = MetricSchema.safeParse({
    id: metricData.id,
    category: metricData.category,
    definition: metricData.definition,
    valueKind: metricData.value_kind,
    canonicalUnit: metricData.canonical_unit,
    rangeSemantics: metricData.range_semantics,
    geographySupport: metricData.geography_support,
    supportedUnits: metricData.supported_units,
  });

  if (!metricParseResult.success) {
    throw new Error(
      `Invalid metric data in DB: ${metricParseResult.error.message}`,
    );
  }

  // 3. Validate the observation against the metric constraints
  const validation = validateObservationAgainstMetric(
    observation,
    metricParseResult.data,
  );
  if (!validation.valid) {
    throw new Error(
      `Observation validation failed: ${validation.issues.join(", ")}`,
    );
  }

  // 4. Ingest into the database
  const dbRecord = {
    id: observation.id,
    kind: observation.kind,
    value_semantics: observation.valueSemantics,
    dataset_id: observation.datasetId,
    metric_id: observation.metricId,
    geography_id: observation.geographyId,
    geography_scope: observation.geographyScope,
    technology_id: observation.technologyId,
    source_id: observation.sourceId,
    study_id: observation.studyId,
    license_id: observation.license.id,
    last_verified_at: observation.lastVerifiedAt,
    publication_status: observation.publicationStatus,
    raw_access: observation.rawAccess,
    system_boundary: observation.systemBoundary,
    methodology: observation.methodology,
    uncertainty: observation.uncertainty,
    period_start_year: observation.period.startYear,
    period_end_year: observation.period.endYear,
    transformation: observation.transformation,
    representative_kind: observation.representativeKind,
    unit: observation.kind === "numeric" ? observation.unit : null,
    value:
      observation.kind === "numeric" && observation.valueSemantics === "point"
        ? observation.value
        : null,
    range:
      observation.kind === "numeric" && observation.valueSemantics === "range"
        ? observation.range
        : null,
    category_definition:
      observation.kind === "categorical"
        ? observation.categoryDefinition
        : null,
    categorical_value:
      observation.kind === "categorical" ? observation.value : null,
  };

  const { error: insertError } = await supabase
    .from("observations")
    .upsert(dbRecord);

  if (insertError) {
    throw new Error(`Failed to insert observation: ${insertError.message}`);
  }

  return observation;
}
