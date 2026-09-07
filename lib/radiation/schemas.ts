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
  "dose-rate",
]);

export const ActivityUnitSchema = z.enum(["Bq", "kBq", "MBq", "GBq", "TBq"]);
export const AbsorbedDoseUnitSchema = z.enum(["Gy", "mGy", "µGy"]);
export const DoseUnitSchema = z.enum(["Sv", "mSv", "µSv", "uSv"]);
export const DoseRateUnitSchema = z.enum([
  "µSv/h",
  "uSv/h",
  "mSv/h",
  "mSv/year",
  "Sv/h",
]);

export const ScenarioCategorySchema = z.enum([
  "everyday",
  "medical",
  "occupational",
  "safety-limit",
  "acute-severe",
]);

export const RadiationSourceSchema = z
  .object({
    name: NonEmptyStringSchema,
    publicationYear: z.number().int().min(1900).max(2050),
    url: z.string().url().optional(),
    reportTitle: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export const RadiationScenarioSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    category: ScenarioCategorySchema,
    quantity: RadiationQuantitySchema,
    value: z.number().finite().nonnegative(),
    unit: z.string().trim().min(1),
    doseMicroSv: z.number().finite().nonnegative(),
    context: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    source: RadiationSourceSchema,
    reviewStatus: z.enum(["reviewed", "in-review"]),
  })
  .strict()
  .readonly();

export type RadiationQuantity = z.infer<typeof RadiationQuantitySchema>;
export type ScenarioCategory = z.infer<typeof ScenarioCategorySchema>;
export type RadiationSource = z.infer<typeof RadiationSourceSchema>;
export type RadiationScenario = z.infer<typeof RadiationScenarioSchema>;
