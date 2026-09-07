import { z } from "zod";

type EnvironmentInput = Record<string, string | undefined>;

const SupabasePublicEnvironmentSchema = z
  .object({
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
      .string()
      .startsWith("sb_publishable_")
      .optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  })
  .superRefine((value, context) => {
    if (
      Boolean(value.NEXT_PUBLIC_SUPABASE_URL) !==
      Boolean(value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured together.",
      });
    }
  });

export type SupabasePublicConfig = {
  publishableKey: string;
  url: string;
};

export function getSupabasePublicConfig(
  input: EnvironmentInput,
): SupabasePublicConfig | undefined {
  const environment = SupabasePublicEnvironmentSchema.parse(input);

  if (
    !environment.NEXT_PUBLIC_SUPABASE_URL ||
    !environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return undefined;
  }

  return {
    publishableKey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    url: environment.NEXT_PUBLIC_SUPABASE_URL,
  };
}

export function requireSupabasePublicConfig(
  input: EnvironmentInput,
): SupabasePublicConfig {
  const config = getSupabasePublicConfig(input);

  if (!config) {
    throw new Error("Public Supabase configuration is required.");
  }

  return config;
}
