import {
  IngestionManifestSchema,
  type IngestionManifest,
} from "@/data/schemas/ingestion-manifest";
import type { Observation } from "@/lib/evidence/schemas";
import { sha256 } from "./checksum";
import type { ParserRegistry } from "./parser-registry";
import { validateAndNormalize, type QualityDependencies } from "./quality";
import { createIdempotencyKey } from "./version";

export interface IngestionResult {
  readonly acceptedRecordCount: number;
  readonly checksum: string;
  readonly datasetVersionId: string;
  readonly rejectedRecordCount: number;
  readonly runId: string;
  readonly sourceRecordCount: number;
  readonly status: "succeeded";
}
export interface IngestionInput {
  readonly artifactPath: string;
  readonly manifest: IngestionManifest;
}
export interface IngestionStore extends QualityDependencies {
  claimRun(input: {
    idempotencyKey: string;
    manifestDigest: string;
    manifest: IngestionManifest;
    pipelineVersion: string;
  }): Promise<{ runId: string; existing?: IngestionResult }>;
  validateManifest(manifest: IngestionManifest): Promise<void>;
  recordEvent(runId: string, type: string, summary: string): Promise<void>;
  failRun(runId: string, category: string): Promise<void>;
  persistDraft(input: {
    runId: string;
    manifest: IngestionManifest;
    manifestDigest: string;
    observations: readonly Observation[];
    sourceObservations: readonly Observation[];
  }): Promise<IngestionResult>;
}
export interface IngestionDependencies {
  readonly files: { read(path: string): Promise<Uint8Array> };
  readonly parsers: ParserRegistry;
  readonly pipelineVersion: string;
  readonly store: IngestionStore;
}

/** Canonical hashing binds all reviewed manifest fields independently of key order. */
export function manifestDigest(manifest: IngestionManifest): string {
  function canonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, child]) => [key, canonical(child)]),
      );
    return value;
  }
  return sha256(new TextEncoder().encode(JSON.stringify(canonical(manifest))));
}

export async function runIngestion(
  input: IngestionInput,
  dependencies: IngestionDependencies,
): Promise<IngestionResult> {
  // Unparseable manifests have no trusted dataset/idempotency identity to persist.
  const manifest = IngestionManifestSchema.parse(input.manifest);
  const digest = manifestDigest(manifest);
  const claim = await dependencies.store.claimRun({
    idempotencyKey: createIdempotencyKey({
      datasetId: manifest.datasetId,
      inputChecksum: manifest.checksum,
      sourceVersion: manifest.sourceVersion,
      transformationVersion: manifest.transformationVersion,
    }),
    manifestDigest: digest,
    manifest,
    pipelineVersion: dependencies.pipelineVersion,
  });
  if (claim.existing) return claim.existing;
  let stage = "acquisition";
  try {
    const bytes = await dependencies.files.read(input.artifactPath);
    if (sha256(bytes) !== manifest.checksum)
      throw new Error("Artifact checksum mismatch.");
    await dependencies.store.recordEvent(
      claim.runId,
      stage,
      "Local artifact checksum verified; no network acquisition.",
    );
    stage = "validation";
    await dependencies.store.validateManifest(manifest);
    const parsed = await dependencies.parsers.parse(manifest.parserId, bytes);
    const validated = await validateAndNormalize(
      parsed,
      manifest,
      dependencies.store,
    );
    for (const type of [
      "validation",
      "normalization",
      "conversion",
      "quality-checks",
      "derivation",
    ]) {
      await dependencies.store.recordEvent(
        claim.runId,
        type,
        type === "derivation"
          ? "No derived values added."
          : `${validated.sourceRecordCount} records passed ${type}.`,
      );
    }
    stage = "persistence";
    return await dependencies.store.persistDraft({
      runId: claim.runId,
      manifest,
      manifestDigest: digest,
      observations: validated.normalized,
      sourceObservations: validated.source,
    });
  } catch {
    await dependencies.store.failRun(claim.runId, stage);
    // Never propagate parser bytes, SQL detail, paths, credentials, or raw provider errors.
    throw new Error(
      `Evidence ${stage} failed; inspect private run ${claim.runId}.`,
    );
  }
}
