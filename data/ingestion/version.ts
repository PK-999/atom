import type { IdempotencyKeyInput } from "./types";

export function createIdempotencyKey({
  datasetId,
  inputChecksum,
  sourceVersion,
  transformationVersion,
}: IdempotencyKeyInput): string {
  return `${datasetId}:${sourceVersion}:${inputChecksum}:${transformationVersion}`;
}
