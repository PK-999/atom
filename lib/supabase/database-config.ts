import "server-only";

import { z } from "zod";

type EnvironmentInput = Record<string, string | undefined>;

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

export function getSupabaseDatabaseUrl(
  input: EnvironmentInput,
): string | undefined {
  return SupabaseDatabaseEnvironmentSchema.parse(input).SUPABASE_DATABASE_URL;
}
