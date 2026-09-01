import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  GeographySchema,
  MetricSchema,
  ObservationSchema,
  TechnologySchema,
  type Geography,
  type Metric,
  type Observation,
  type Technology,
} from "@/lib/evidence/schemas";
import type {
  EvidenceRepository,
  MetricRelease,
  ObservationQuery,
} from "@/lib/evidence/repository";
import type { Database } from "./database.types";

type Client = SupabaseClient<Database>;
type Row<Table extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][Table]["Row"];
type MetricReleaseRow = Pick<
  Row<"metric_releases">,
  | "metric_id"
  | "active_dataset_version_id"
  | "availability_status"
  | "feature_enabled"
  | "geography_ids"
  | "technology_ids"
  | "publication_status"
  | "redistribution_decision"
>;
type DatasetVersionRow = Pick<
  Row<"dataset_versions">,
  "id" | "dataset_id" | "publication_status"
>;
type DatasetRow = Pick<
  Row<"datasets">,
  | "id"
  | "source_id"
  | "licence_name"
  | "licence_url"
  | "raw_access"
  | "redistribution"
  | "publication_status"
>;
type MetricRow = Pick<Row<"metrics">, "id" | "publication_status">;
type TechnologyRow = Pick<Row<"technologies">, "id" | "publication_status">;
type GeographyRow = Pick<
  Row<"geographies">,
  "id" | "scope" | "publication_status"
>;
type StudyRow = Pick<Row<"studies">, "id" | "source_id" | "publication_status">;
type SourceRow = Pick<
  Row<"sources">,
  "id" | "publication_status" | "redistribution"
>;
type TransformationRow = Pick<
  Row<"observation_transformations">,
  "id" | "observation_id" | "step_order" | "operation_name" | "explanatory_note"
>;
type ObservationRow = Pick<
  Row<"observations">,
  | "id"
  | "metric_id"
  | "technology_id"
  | "geography_id"
  | "study_id"
  | "source_id"
  | "dataset_version_id"
  | "value_kind"
  | "value_semantics"
  | "value"
  | "lower_value"
  | "representative_value"
  | "upper_value"
  | "category_value"
  | "category_definition"
  | "unit"
  | "representative_kind"
  | "range_kind"
  | "interval_level"
  | "source_range_label"
  | "methodology"
  | "system_boundary"
  | "period_start_year"
  | "period_end_year"
  | "uncertainty"
  | "last_verified_on"
  | "raw_access"
  | "redistribution"
  | "publication_status"
>;

const published = "published";

const metricReleaseColumns =
  "metric_id, active_dataset_version_id, availability_status, feature_enabled, geography_ids, technology_ids, publication_status, redistribution_decision" as const;

export class SupabaseEvidenceRepository implements EvidenceRepository {
  constructor(private readonly client: Client) {}

  async getMetricDefinition(metricId: string): Promise<Metric | null> {
    if (!(await this.activeRelease(metricId))) return null;

    const { data, error } = await this.client
      .from("metrics")
      .select(
        "id, canonical_unit, supported_units, value_kind, range_semantics, geography_support, definition, registry_category, publication_status",
      )
      .eq("id", metricId)
      .eq("publication_status", published)
      .maybeSingle();
    if (error) throw error;
    return data ? deepFreeze(mapMetric(data)) : null;
  }

  async listMetricReleases(): Promise<readonly MetricRelease[]> {
    const rows = await this.publishedMetricReleaseRows();
    return deepFreeze(rows.map(mapMetricRelease));
  }

  async listTechnologies(): Promise<readonly Technology[]> {
    const releases = await this.listMetricReleases();
    const technologyIds = unique(
      releases.flatMap((release) => release.technologyIds),
    );
    if (!technologyIds.length) return deepFreeze([]);

    const { data, error } = await this.client
      .from("technologies")
      .select("id, name, description, variant, publication_status")
      .in("id", technologyIds)
      .eq("publication_status", published)
      .order("name", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw error;
    return deepFreeze((data ?? []).map(mapTechnology));
  }

  async listGeographies(metricId: string): Promise<readonly Geography[]> {
    const release = await this.activeRelease(metricId);
    if (!release) return deepFreeze([]);

    const { data, error } = await this.client
      .from("geographies")
      .select("id, name, scope, publication_status")
      .in("id", release.geographyIds)
      .eq("publication_status", published)
      .order("name", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw error;
    return deepFreeze((data ?? []).map(mapGeography));
  }

  async getPublishedObservations(
    query: ObservationQuery,
  ): Promise<readonly Observation[]> {
    const release = await this.activeRelease(query.metricId);
    if (!release) return deepFreeze([]);
    const technologyFilter = (
      query.technologyIds ?? release.technologyIds
    ).filter((technologyId) => release.technologyIds.includes(technologyId));
    const geographyFilter = (query.geographyIds ?? release.geographyIds).filter(
      (geographyId) => release.geographyIds.includes(geographyId),
    );
    if (!technologyFilter.length || !geographyFilter.length) {
      return deepFreeze([]);
    }

    const observationQuery = this.client
      .from("observations")
      .select(
        "id, metric_id, technology_id, geography_id, study_id, source_id, dataset_version_id, value_kind, value_semantics, value, lower_value, representative_value, upper_value, category_value, category_definition, unit, representative_kind, range_kind, interval_level, source_range_label, methodology, system_boundary, period_start_year, period_end_year, uncertainty, last_verified_on, raw_access, redistribution, publication_status",
      )
      .eq("metric_id", query.metricId)
      .eq("dataset_version_id", release.activeDatasetVersionId)
      .eq("publication_status", published)
      .eq("raw_access", "permitted")
      .eq("redistribution", "allowed")
      .in("technology_id", technologyFilter)
      .in("geography_id", geographyFilter)
      .order("id", { ascending: true });
    const { data: observations, error: observationsError } =
      await observationQuery;
    if (observationsError) throw observationsError;
    if (!observations?.length) return deepFreeze([]);

    const [
      metric,
      version,
      dataset,
      technologies,
      geographies,
      studies,
      sources,
      transformations,
    ] = await Promise.all([
      this.getMetricDefinition(query.metricId),
      this.publishedDatasetVersion(release.activeDatasetVersionId),
      this.publishedDatasetForVersion(release.activeDatasetVersionId),
      this.publishedTechnologies(ids(observations, "technology_id")),
      this.publishedGeographies(ids(observations, "geography_id")),
      this.publishedStudies(ids(observations, "study_id")),
      this.publishedSources(ids(observations, "source_id")),
      this.transformationsFor(ids(observations, "id")),
    ]);
    if (!metric || !version || !dataset) return deepFreeze([]);

    const technologyIds = new Set(technologies.map((row) => row.id));
    const geographyById = new Map(geographies.map((row) => [row.id, row]));
    const studyById = new Map(studies.map((row) => [row.id, row]));
    const sourceIds = new Set(sources.map((row) => row.id));
    const transformationsByObservation = new Map<string, TransformationRow[]>();
    for (const transformation of transformations) {
      const steps =
        transformationsByObservation.get(transformation.observation_id) ?? [];
      steps.push(transformation);
      transformationsByObservation.set(transformation.observation_id, steps);
    }

    return deepFreeze(
      observations
        .filter((observation) => {
          const study = studyById.get(observation.study_id);
          return (
            technologyIds.has(observation.technology_id) &&
            geographyById.has(observation.geography_id) &&
            sourceIds.has(observation.source_id) &&
            study?.source_id === observation.source_id &&
            dataset.source_id === observation.source_id &&
            transformationsByObservation.has(observation.id)
          );
        })
        .map((observation) =>
          mapObservation(
            observation,
            geographyById.get(observation.geography_id)!,
            dataset,
            transformationsByObservation.get(observation.id)!,
          ),
        ),
    );
  }

  private async activeRelease(metricId: string): Promise<MetricRelease | null> {
    const [row] = await this.publishedMetricReleaseRows(metricId);
    return row ? mapMetricRelease(row) : null;
  }

  private async publishedMetricReleaseRows(
    metricId?: string,
  ): Promise<MetricReleaseRow[]> {
    let releaseQuery = this.client
      .from("metric_releases")
      .select(metricReleaseColumns)
      .eq("publication_status", published)
      .eq("feature_enabled", true)
      .eq("availability_status", "supported")
      .eq("redistribution_decision", "allowed")
      .not("active_dataset_version_id", "is", null);
    if (metricId !== undefined) {
      releaseQuery = releaseQuery.eq("metric_id", metricId);
    }

    const { data, error } = await releaseQuery.order("metric_id", {
      ascending: true,
    });
    if (error) throw error;
    const rows = data ?? [];
    if (!rows.length) return [];

    const versionIds = unique(
      rows.flatMap((row) =>
        row.active_dataset_version_id ? [row.active_dataset_version_id] : [],
      ),
    );
    const metricIds = unique(rows.map((row) => row.metric_id));
    const technologyIds = unique(rows.flatMap((row) => row.technology_ids));
    const geographyIds = unique(rows.flatMap((row) => row.geography_ids));
    const [versions, metrics, technologies, geographies] = await Promise.all([
      this.publishedDatasetVersions(versionIds),
      this.publishedMetrics(metricIds),
      this.publishedTechnologies(technologyIds),
      this.publishedGeographies(geographyIds),
    ]);
    const datasetIds = unique(versions.map((version) => version.dataset_id));
    const datasets = await this.publishedDatasets(datasetIds);
    const sourceIds = unique(datasets.map((dataset) => dataset.source_id));
    const sources = await this.publishedSources(sourceIds);

    const versionById = new Map(
      versions.map((version) => [version.id, version]),
    );
    const datasetById = new Map(
      datasets.map((dataset) => [dataset.id, dataset]),
    );
    const sourceIdsSet = new Set(sources.map((source) => source.id));
    const metricIdsSet = new Set(metrics.map((metric) => metric.id));
    const technologyIdsSet = new Set(
      technologies.map((technology) => technology.id),
    );
    const geographyIdsSet = new Set(
      geographies.map((geography) => geography.id),
    );

    return rows.filter((row) => {
      const version = row.active_dataset_version_id
        ? versionById.get(row.active_dataset_version_id)
        : undefined;
      const dataset = version ? datasetById.get(version.dataset_id) : undefined;
      return Boolean(
        version &&
        dataset &&
        sourceIdsSet.has(dataset.source_id) &&
        metricIdsSet.has(row.metric_id) &&
        row.technology_ids.every((technologyId) =>
          technologyIdsSet.has(technologyId),
        ) &&
        row.geography_ids.every((geographyId) =>
          geographyIdsSet.has(geographyId),
        ),
      );
    });
  }

  private async publishedDatasetVersions(
    identifiers: readonly string[],
  ): Promise<DatasetVersionRow[]> {
    if (!identifiers.length) return [];
    const { data, error } = await this.client
      .from("dataset_versions")
      .select("id, dataset_id, publication_status")
      .in("id", identifiers)
      .eq("publication_status", published);
    if (error) throw error;
    return data ?? [];
  }

  private async publishedMetrics(
    identifiers: readonly string[],
  ): Promise<MetricRow[]> {
    if (!identifiers.length) return [];
    const { data, error } = await this.client
      .from("metrics")
      .select("id, publication_status")
      .in("id", identifiers)
      .eq("publication_status", published);
    if (error) throw error;
    return data ?? [];
  }

  private async publishedDatasets(
    identifiers: readonly string[],
  ): Promise<DatasetRow[]> {
    if (!identifiers.length) return [];
    const { data, error } = await this.client
      .from("datasets")
      .select(
        "id, source_id, licence_name, licence_url, raw_access, redistribution, publication_status",
      )
      .in("id", identifiers)
      .eq("publication_status", published)
      .eq("raw_access", "permitted")
      .eq("redistribution", "allowed");
    if (error) throw error;
    return data ?? [];
  }

  private async publishedDatasetVersion(
    id: string,
  ): Promise<DatasetVersionRow | null> {
    const { data, error } = await this.client
      .from("dataset_versions")
      .select("id, dataset_id, publication_status")
      .eq("id", id)
      .eq("publication_status", published)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  private async publishedDatasetForVersion(
    versionId: string,
  ): Promise<DatasetRow | null> {
    const version = await this.publishedDatasetVersion(versionId);
    if (!version) return null;
    const { data, error } = await this.client
      .from("datasets")
      .select(
        "id, source_id, licence_name, licence_url, raw_access, redistribution, publication_status",
      )
      .eq("id", version.dataset_id)
      .eq("publication_status", published)
      .eq("raw_access", "permitted")
      .eq("redistribution", "allowed")
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  private async publishedTechnologies(
    identifiers: readonly string[],
  ): Promise<TechnologyRow[]> {
    if (!identifiers.length) return [];
    const { data, error } = await this.client
      .from("technologies")
      .select("id, publication_status")
      .in("id", identifiers)
      .eq("publication_status", published);
    if (error) throw error;
    return data ?? [];
  }

  private async publishedGeographies(
    identifiers: readonly string[],
  ): Promise<GeographyRow[]> {
    if (!identifiers.length) return [];
    const { data, error } = await this.client
      .from("geographies")
      .select("id, scope, publication_status")
      .in("id", identifiers)
      .eq("publication_status", published);
    if (error) throw error;
    return data ?? [];
  }

  private async publishedStudies(ids: readonly string[]): Promise<StudyRow[]> {
    if (!ids.length) return [];
    const { data, error } = await this.client
      .from("studies")
      .select("id, source_id, publication_status")
      .in("id", ids)
      .eq("publication_status", published);
    if (error) throw error;
    return data ?? [];
  }

  private async publishedSources(ids: readonly string[]): Promise<SourceRow[]> {
    if (!ids.length) return [];
    const { data, error } = await this.client
      .from("sources")
      .select("id, publication_status, redistribution")
      .in("id", ids)
      .eq("publication_status", published)
      .eq("redistribution", "allowed");
    if (error) throw error;
    return data ?? [];
  }

  private async transformationsFor(
    observationIds: readonly string[],
  ): Promise<TransformationRow[]> {
    if (!observationIds.length) return [];
    const { data, error } = await this.client
      .from("observation_transformations")
      .select(
        "id, observation_id, step_order, operation_name, explanatory_note",
      )
      .in("observation_id", observationIds)
      .order("observation_id", { ascending: true })
      .order("step_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }
}

function mapMetric(
  row: Pick<
    Row<"metrics">,
    | "id"
    | "canonical_unit"
    | "supported_units"
    | "value_kind"
    | "range_semantics"
    | "geography_support"
    | "definition"
    | "registry_category"
    | "publication_status"
  >,
): Metric {
  if (row.publication_status !== "published") {
    throw new Error("Published metric query returned an unpublished metric.");
  }
  if (row.value_kind === "categorical") {
    return MetricSchema.parse({
      category: row.registry_category,
      definition: row.definition,
      geographySupport: row.geography_support,
      id: row.id,
      rangeSemantics: "categorical",
      valueKind: "categorical",
    });
  }
  return MetricSchema.parse({
    canonicalUnit: row.canonical_unit,
    category: row.registry_category,
    definition: row.definition,
    geographySupport: row.geography_support,
    id: row.id,
    rangeSemantics: row.range_semantics,
    supportedUnits: row.supported_units,
    valueKind: "numeric",
  });
}

function mapTechnology(
  row: Pick<
    Row<"technologies">,
    "id" | "name" | "description" | "variant" | "publication_status"
  >,
): Technology {
  if (row.publication_status !== "published") {
    throw new Error(
      "Published technology query returned an unpublished technology.",
    );
  }
  return TechnologySchema.parse({
    description: row.description,
    id: row.id,
    name: row.name,
    ...(row.variant ? { variant: row.variant } : {}),
  });
}

function mapGeography(
  row: Pick<Row<"geographies">, "id" | "name" | "scope" | "publication_status">,
): Geography {
  if (row.publication_status !== "published") {
    throw new Error(
      "Published geography query returned an unpublished geography.",
    );
  }
  return GeographySchema.parse({
    id: row.id,
    name: row.name,
    scope: row.scope,
  });
}

function mapMetricRelease(
  row: Pick<
    Row<"metric_releases">,
    | "metric_id"
    | "active_dataset_version_id"
    | "availability_status"
    | "feature_enabled"
    | "geography_ids"
    | "technology_ids"
    | "publication_status"
    | "redistribution_decision"
  >,
): MetricRelease {
  if (
    row.active_dataset_version_id === null ||
    row.publication_status !== "published" ||
    row.availability_status !== "supported" ||
    !row.feature_enabled ||
    row.redistribution_decision !== "allowed"
  ) {
    throw new Error(
      "Published metric release did not satisfy the repository boundary.",
    );
  }
  return deepFreeze({
    activeDatasetVersionId: row.active_dataset_version_id,
    availabilityStatus: "supported",
    featureEnabled: true,
    geographyIds: [...row.geography_ids],
    metricId: row.metric_id,
    publicationStatus: "published",
    technologyIds: [...row.technology_ids],
  });
}

function mapObservation(
  row: ObservationRow,
  geography: Pick<Row<"geographies">, "scope">,
  dataset: Pick<
    Row<"datasets">,
    "id" | "licence_name" | "licence_url" | "redistribution"
  >,
  transformations: readonly Pick<
    Row<"observation_transformations">,
    "operation_name" | "explanatory_note"
  >[],
): Observation {
  if (
    row.publication_status !== "published" ||
    row.raw_access !== "permitted" ||
    row.redistribution !== "allowed" ||
    dataset.redistribution !== "allowed"
  ) {
    throw new Error(
      "Published observation query returned a restricted observation.",
    );
  }
  const common = {
    datasetId: dataset.id,
    geographyId: row.geography_id,
    geographyScope: geography.scope,
    id: row.id,
    lastVerifiedAt: row.last_verified_on,
    license: {
      id: `${dataset.id}-license`,
      name: dataset.licence_name,
      redistribution: dataset.redistribution,
      ...(dataset.licence_url ? { url: dataset.licence_url } : {}),
    },
    methodology: row.methodology,
    metricId: row.metric_id,
    period: { endYear: row.period_end_year, startYear: row.period_start_year },
    publicationStatus: row.publication_status,
    rawAccess: row.raw_access,
    sourceId: row.source_id,
    studyId: row.study_id,
    systemBoundary: row.system_boundary,
    technologyId: row.technology_id,
    transformation: transformations.map((transformation) => ({
      description: transformation.explanatory_note,
      kind: transformation.operation_name,
    })),
    uncertainty: row.uncertainty,
  };
  if (row.value_kind === "categorical") {
    return ObservationSchema.parse({
      ...common,
      categoryDefinition: row.category_definition,
      kind: "categorical",
      representativeKind: row.representative_kind,
      value: row.category_value,
      valueSemantics: "categorical",
    });
  }
  if (row.value_semantics === "point") {
    return ObservationSchema.parse({
      ...common,
      kind: "numeric",
      representativeKind: row.representative_kind,
      unit: row.unit,
      value: row.value,
      valueSemantics: "point",
    });
  }
  return ObservationSchema.parse({
    ...common,
    kind: "numeric",
    range: mapRange(row),
    representativeKind: row.representative_kind,
    unit: row.unit,
    valueSemantics: "range",
  });
}

function mapRange(row: ObservationRow) {
  if (row.range_kind === "min-max") {
    return {
      kind: "min-max" as const,
      lower: row.lower_value,
      representative: row.representative_value,
      upper: row.upper_value,
    };
  }
  return {
    intervalType: row.range_kind,
    kind: "interval" as const,
    ...(row.interval_level === null ? {} : { level: row.interval_level }),
    lower: row.lower_value,
    representative: row.representative_value,
    ...(row.source_range_label === null
      ? {}
      : { sourceLabel: row.source_range_label }),
    upper: row.upper_value,
  };
}

function ids(
  rows: readonly ObservationRow[],
  key: keyof ObservationRow,
): string[] {
  return unique(rows.map((row) => String(row[key])));
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}
