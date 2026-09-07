import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const EnergySourceMixSchema = z
  .object({
    source: NonEmptyStringSchema,
    percentage: z.number().min(0).max(100),
  })
  .strict()
  .readonly();

export const NationalProfileSchema = z
  .object({
    id: IdentifierSchema,
    countryName: NonEmptyStringSchema,
    energyMix: z.array(EnergySourceMixSchema).readonly(),
    domesticPolicy: NonEmptyStringSchema,
    reactorFleetSummary: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export type EnergySourceMix = z.infer<typeof EnergySourceMixSchema>;
export type NationalProfile = z.infer<typeof NationalProfileSchema>;
