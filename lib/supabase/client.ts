import { createBrowserClient } from "@supabase/ssr";

import { requireSupabasePublicConfig } from "./client-config";

export function createClient() {
  const config = requireSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  return createBrowserClient(config.url, config.publishableKey);
}
