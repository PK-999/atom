import {
  GeographySchema,
  IdentifierSchema,
  MetricSchema,
  ObservationSchema,
  TechnologySchema,
  type Geography,
  type Metric,
  type Observation,
  type Technology,
} from "./schemas";
import type {
  EvidenceRepository,
  MetricRelease,
  ObservationQuery,
} from "./repository";

export interface EvidenceSnapshot {
  readonly geographies: readonly Geography[];
  readonly metricReleases: readonly MetricRelease[];
  readonly metrics: readonly Metric[];
  readonly observations: readonly Observation[];
  readonly observationDatasetVersionIds?: Readonly<Record<string, string>>;
  readonly technologies: readonly Technology[];
}

export class LocalEvidenceRepository implements EvidenceRepository {
  private readonly snapshot: EvidenceSnapshot;

  constructor(snapshot: EvidenceSnapshot) {
    const observationDatasetVersionIds = snapshot.observationDatasetVersionIds
      ? Object.fromEntries(
          Object.entries(snapshot.observationDatasetVersionIds).map(
            ([observationId, datasetVersionId]) => [
              IdentifierSchema.parse(observationId),
              IdentifierSchema.parse(datasetVersionId),
            ],
          ),
        )
      : undefined;
    this.snapshot = deepFreeze({
      geographies: snapshot.geographies.map((geography) =>
        GeographySchema.parse(structuredClone(geography)),
      ),
      metricReleases: snapshot.metricReleases.map((release) =>
        validateMetricRelease(structuredClone(release)),
      ),
      metrics: snapshot.metrics.map((metric) =>
        MetricSchema.parse(structuredClone(metric)),
      ),
      observations: snapshot.observations.map((observation) =>
        ObservationSchema.parse(structuredClone(observation)),
      ),
      ...(observationDatasetVersionIds ? { observationDatasetVersionIds } : {}),
      technologies: snapshot.technologies.map((technology) =>
        TechnologySchema.parse(structuredClone(technology)),
      ),
    });
  }

  async getMetricDefinition(metricId: string): Promise<Metric | null> {
    if (!this.activeRelease(metricId)) return null;
    return (
      this.snapshot.metrics.find((metric) => metric.id === metricId) ?? null
    );
  }

  async listMetricReleases(): Promise<readonly MetricRelease[]> {
    return deepFreeze(
      this.snapshot.metricReleases
        .filter((release) => this.isPublishedEnabledReleaseWithMetric(release))
        .toSorted((left, right) => left.metricId.localeCompare(right.metricId)),
    );
  }

  async listTechnologies(): Promise<readonly Technology[]> {
    const technologyIds = new Set(
      this.snapshot.metricReleases
        .filter((release) => this.isPublishedEnabledReleaseWithMetric(release))
        .flatMap((release) => release.technologyIds),
    );

    return deepFreeze(
      this.snapshot.technologies
        .filter((technology) => technologyIds.has(technology.id))
        .toSorted(compareNameAndId),
    );
  }

  async listGeographies(metricId: string): Promise<readonly Geography[]> {
    const release = this.activeRelease(metricId);
    if (!release) return deepFreeze([]);

    return deepFreeze(
      this.snapshot.geographies
        .filter((geography) => release.geographyIds.includes(geography.id))
        .toSorted(compareNameAndId),
    );
  }

  async getPublishedObservations(
    query: ObservationQuery,
  ): Promise<readonly Observation[]> {
    const release = this.activeRelease(query.metricId);
    if (!release) return deepFreeze([]);

    return deepFreeze(
      this.snapshot.observations
        .filter(
          (observation) =>
            (this.snapshot.observationDatasetVersionIds?.[observation.id] ??
              observation.datasetId) === release.activeDatasetVersionId &&
            observation.metricId === query.metricId &&
            observation.publicationStatus === "published" &&
            release.geographyIds.includes(observation.geographyId) &&
            release.technologyIds.includes(observation.technologyId) &&
            (query.geographyIds === undefined ||
              query.geographyIds.includes(observation.geographyId)) &&
            (query.technologyIds === undefined ||
              query.technologyIds.includes(observation.technologyId)),
        )
        .toSorted((left, right) => left.id.localeCompare(right.id)),
    );
  }

  private activeRelease(metricId: string): MetricRelease | undefined {
    return this.snapshot.metricReleases.find(
      (release) =>
        release.metricId === metricId &&
        this.isPublishedEnabledReleaseWithMetric(release),
    );
  }

  private isPublishedEnabledReleaseWithMetric(release: MetricRelease): boolean {
    return (
      isPublishedEnabledRelease(release) &&
      this.snapshot.metrics.some((metric) => metric.id === release.metricId)
    );
  }
}

function isPublishedEnabledRelease(release: MetricRelease): boolean {
  return (
    release.publicationStatus === "published" &&
    release.featureEnabled &&
    release.availabilityStatus === "supported"
  );
}

function compareNameAndId(
  left: Technology | Geography,
  right: Technology | Geography,
): number {
  return left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
}

function validateMetricRelease(value: MetricRelease): MetricRelease {
  if (
    !value.activeDatasetVersionId ||
    !value.metricId ||
    value.publicationStatus !== "published" ||
    !["supported", "unavailable", "restricted"].includes(
      value.availabilityStatus,
    ) ||
    !Array.isArray(value.technologyIds) ||
    !Array.isArray(value.geographyIds) ||
    value.technologyIds.some((id) => !id) ||
    value.geographyIds.some((id) => !id)
  ) {
    throw new Error("EvidenceSnapshot contains an invalid metric release.");
  }
  return value;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}
