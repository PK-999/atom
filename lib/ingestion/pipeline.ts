import type { SupabaseClient } from "@supabase/supabase-js";

const retired =
  "The mutable ingestion helper is retired. Use scripts/evidence/ingest.ts and the transactional Postgres store.";

/** @deprecated Fail-closed compatibility tombstone; creates no client. */
export function getAdminClient(): SupabaseClient {
  throw new Error(retired);
}

/** @deprecated Never upsert scientific evidence through the Data API. */
export async function ingestObservation(
  rawObservationData: unknown,
): Promise<never> {
  void rawObservationData;
  throw new Error(retired);
}
