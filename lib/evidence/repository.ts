import { z } from "zod";
import { IdentifierSchema } from "./schemas";
import type { Geography, Metric, Observation, Technology } from "./schemas";

export interface MetricRelease {
  readonly activeDatasetVersionId: string;
  readonly availabilityStatus: "supported" | "unavailable" | "restricted";
  readonly featureEnabled: boolean;
  readonly geographyIds: readonly string[];
  readonly metricId: string;
  readonly publicationStatus: "published";
  readonly technologyIds: readonly string[];
}

export interface ObservationQuery {
  readonly geographyIds?: readonly string[];
  readonly metricId: string;
  readonly technologyIds?: readonly string[];
}

export interface EvidenceRepository {
  getMetricDefinition(metricId: string): Promise<Metric | null>;
  listMetricReleases(): Promise<readonly MetricRelease[]>;
  listTechnologies(): Promise<readonly Technology[]>;
  listGeographies(metricId: string): Promise<readonly Geography[]>;
  getPublishedObservations(
    query: ObservationQuery,
  ): Promise<readonly Observation[]>;
}

export const MetricReleaseSchema = z
  .object({
    activeDatasetVersionId: IdentifierSchema,
    availabilityStatus: z.enum(["supported", "unavailable", "restricted"]),
    featureEnabled: z.boolean(),
    geographyIds: z.array(IdentifierSchema),
    metricId: IdentifierSchema,
    publicationStatus: z.literal("published"),
    technologyIds: z.array(IdentifierSchema),
  })
  .strict();
