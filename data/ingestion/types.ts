import type { IngestionManifest } from "@/data/schemas/ingestion-manifest";

export interface IdempotencyKeyInput {
  readonly datasetId: IngestionManifest["datasetId"];
  readonly inputChecksum: IngestionManifest["checksum"];
  readonly sourceVersion: IngestionManifest["sourceVersion"];
  readonly transformationVersion: IngestionManifest["transformationVersion"];
}
