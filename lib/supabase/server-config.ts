import "server-only";

import { z } from "zod";

type EnvironmentInput = Record<string, string | undefined>;

const SupabaseServerEnvironmentSchema = z
  .object({
    SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_").optional(),
    SUPABASE_URL: z.url().optional(),
  })
  .superRefine((value, context) => {
    if (Boolean(value.SUPABASE_URL) !== Boolean(value.SUPABASE_SECRET_KEY)) {
      context.addIssue({
        code: "custom",
        message:
          "SUPABASE_URL and SUPABASE_SECRET_KEY must be configured together.",
      });
    }
  });

export type SupabaseServerConfig = {
  secretKey: string;
  url: string;
};

export function getSupabaseServerConfig(
  input: EnvironmentInput,
): SupabaseServerConfig | undefined {
  const environment = SupabaseServerEnvironmentSchema.parse(input);

  if (!environment.SUPABASE_URL || !environment.SUPABASE_SECRET_KEY) {
    return undefined;
  }

  return {
    secretKey: environment.SUPABASE_SECRET_KEY,
    url: environment.SUPABASE_URL,
  };
}
