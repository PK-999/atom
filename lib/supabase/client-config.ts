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

const SupabaseDatabaseEnvironmentSchema = z.object({
  SUPABASE_DATABASE_URL: z
    .string()
    .url()
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "postgres:" || protocol === "postgresql:";
    }, "SUPABASE_DATABASE_URL must use postgres:// or postgresql://.")
    .optional(),
});

export type SupabasePublicConfig = {
  publishableKey: string;
  url: string;
};

export type SupabaseServerConfig = {
  secretKey: string;
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

export function getSupabaseDatabaseUrl(
  input: EnvironmentInput,
): string | undefined {
  return SupabaseDatabaseEnvironmentSchema.parse(input).SUPABASE_DATABASE_URL;
}
