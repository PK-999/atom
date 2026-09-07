import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { SupabaseServerConfig } from "./server-config";
import type { Database } from "./database.types";

export function createSupabaseServerClient(config: SupabaseServerConfig) {
  return createClient<Database>(config.url, config.secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
