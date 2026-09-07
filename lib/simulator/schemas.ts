import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const GenerationSourceSchema = z
  .object({
    id: IdentifierSchema,
    name: z.string().min(1),
    capacityMw: z.number().nonnegative(),
    capacityFactor: z.number().min(0).max(1),
    isDispatchable: z.boolean(),
  })
  .strict()
  .readonly();

export const GridScenarioSchema = z
  .object({
    id: IdentifierSchema,
    cityPopulation: z.number().positive(),
    peakDemandMw: z.number().positive(),
    sources: z.array(GenerationSourceSchema).readonly(),
  })
  .strict()
  .readonly();

export type GenerationSource = z.infer<typeof GenerationSourceSchema>;
export type GridScenario = z.infer<typeof GridScenarioSchema>;
