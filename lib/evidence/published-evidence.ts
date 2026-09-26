import { z } from "zod";
import catalog from "@/data/evidence/catalog.json";
import records from "@/data/evidence/release-records.json";
import {
  ObservationSchema,
  IdentifierSchema,
  TechnologySchema,
  GeographySchema,
  MetricSchema,
} from "./schemas";
import { EvidenceProvenanceSchema } from "./release-provenance";
import { MetricReleaseSchema } from "./repository";
/** Public numerical releases require the review contract in ADR 0010. */
import type { EvidenceSnapshot } from "./local-repository";
import type { Geography, Metric, Technology } from "./schemas";
import type { MetricRelease } from "./repository";

export const EvidenceCatalogSchema = z
  .object({
    technologies: z.array(TechnologySchema),
    geographies: z.array(GeographySchema),
    metrics: z.array(MetricSchema),
  })
  .strict();
const definitions = EvidenceCatalogSchema.parse(catalog);
export const PUBLISHED_TECHNOLOGIES: readonly Technology[] =
  definitions.technologies;
export const PUBLISHED_GEOGRAPHIES: readonly Geography[] =
  definitions.geographies;
export const PUBLISHED_METRICS: readonly Metric[] = definitions.metrics;

// No numerical release currently has a complete source/artifact/review graph.
// Historical values are preserved at d59c3e0 for investigation, not publication.
export const ReleaseRecordsSchema = z
  .object({
    metricReleases: z.array(MetricReleaseSchema),
    observations: z.array(ObservationSchema),
    observationDatasetVersionIds: z.record(IdentifierSchema, IdentifierSchema),
    provenance: EvidenceProvenanceSchema,
  })
  .strict();
const reviewedRecords = ReleaseRecordsSchema.parse(records);
export const PUBLISHED_METRIC_RELEASES: readonly MetricRelease[] =
  reviewedRecords.metricReleases;
export const PUBLISHED_EVIDENCE_SNAPSHOT: EvidenceSnapshot = {
  geographies: PUBLISHED_GEOGRAPHIES,
  technologies: PUBLISHED_TECHNOLOGIES,
  metrics: PUBLISHED_METRICS,
  ...reviewedRecords,
};
