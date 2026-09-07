import "server-only";
import { readFile } from "node:fs/promises";
import postgres from "postgres";
import { getSupabaseDatabaseUrl } from "@/lib/supabase/database-config";
import { createDefaultParserRegistry } from "@/data/ingestion/parser-registry";
import { runIngestion } from "@/data/ingestion/pipeline";
import { PostgresEvidenceStore } from "@/data/ingestion/postgres-store";
import {
  publishDatasetVersion,
  reviewDatasetVersion,
  rollbackMetricRelease,
  type RollbackMetricReleaseInput,
} from "@/data/ingestion/publication";

export async function createEvidenceCliDependencies(
  env: Record<string, string | undefined> = process.env,
) {
  const url = getSupabaseDatabaseUrl(env);
  if (!url)
    throw new Error("SUPABASE_DATABASE_URL is required for evidence commands.");
  const pool = postgres(url, {
    max: 4,
    connect_timeout: 10,
    idle_timeout: 20,
    onnotice: () => {},
  });
  const store = new PostgresEvidenceStore(pool);
  const ingestion = {
    files: {
      read: async (path: string) => new Uint8Array(await readFile(path)),
    },
    parsers: createDefaultParserRegistry(),
    pipelineVersion: "recovery-r04",
    store,
  };
  return {
    ingestion,
    files: { readFile: (path: string) => readFile(path, "utf8") },
    ingest: (input: Parameters<typeof runIngestion>[0]) =>
      runIngestion(input, ingestion),
    review: (input: Parameters<typeof reviewDatasetVersion>[0]) =>
      reviewDatasetVersion(input, { store }),
    publish: (input: Parameters<typeof publishDatasetVersion>[0]) =>
      publishDatasetVersion(input, { store }),
    activate: (input: RollbackMetricReleaseInput) =>
      rollbackMetricRelease(input, { store }),
    rollback: (input: RollbackMetricReleaseInput) =>
      rollbackMetricRelease(input, { store }),
    withdraw: (input: { datasetVersionId: string; reason: string }) =>
      store.withdrawVersion(input),
    close: () => pool.end({ timeout: 5 }),
  };
}
