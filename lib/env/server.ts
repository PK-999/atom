import "server-only";

import {
  getSupabaseServerConfig,
  type SupabaseServerConfig,
} from "@/lib/supabase/client-config";

export type ServerEnv = SupabaseServerConfig | Record<string, never>;

export function parseServerEnv(
  input: Record<string, string | undefined>,
): ServerEnv {
  return getSupabaseServerConfig(input) ?? {};
}
