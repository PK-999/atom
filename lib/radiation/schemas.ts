import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const RadiationQuantitySchema = z.enum([
  "activity",
  "absorbed-dose",
  "equivalent-dose",
  "effective-dose",
]);

export const RadiationScenarioSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    quantity: RadiationQuantitySchema,
    value: z.number().nonnegative(),
    unit: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    sourceId: IdentifierSchema.optional(),
  })
  .strict()
  .readonly();

export type RadiationQuantity = z.infer<typeof RadiationQuantitySchema>;
export type RadiationScenario = z.infer<typeof RadiationScenarioSchema>;
