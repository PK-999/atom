import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const ReactorComponentSchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    type: z.enum([
      "fuel",
      "coolant",
      "moderator",
      "control-rod",
      "vessel",
      "containment",
      "steam-cycle",
    ]),
    description: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const ReactorSystemSchema = z
  .object({
    id: IdentifierSchema,
    type: z.enum([
      "PWR",
      "BWR",
      "PHWR",
      "CANDU",
      "RBMK",
      "Fast",
      "Molten-Salt",
    ]),
    name: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    components: z.array(ReactorComponentSchema).min(1).readonly(),
  })
  .strict()
  .readonly();

export type ReactorComponent = z.infer<typeof ReactorComponentSchema>;
export type ReactorSystem = z.infer<typeof ReactorSystemSchema>;
