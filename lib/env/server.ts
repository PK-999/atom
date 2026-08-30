import { z } from "zod";

const serverEnvSchema = z
  .object({
    SUPABASE_DATABASE_URL: z.url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  })
  .superRefine((environment, context) => {
    const hasDatabaseUrl = environment.SUPABASE_DATABASE_URL !== undefined;
    const hasServiceRole = environment.SUPABASE_SERVICE_ROLE_KEY !== undefined;

    if (hasDatabaseUrl !== hasServiceRole) {
      context.addIssue({
        code: "custom",
        message:
          "SUPABASE_DATABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured together.",
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(
  input: Record<string, string | undefined>,
): ServerEnv {
  return serverEnvSchema.parse(input);
}
