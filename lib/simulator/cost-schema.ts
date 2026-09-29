import { z } from "zod";

const NonNegative = z.number().finite().nonnegative();

export const CostScenarioSchema = z
  .object({
    capacityMw: NonNegative,
    capacityFactor: z.number().finite().min(0).max(1),
    constructionCostByYear: z.array(NonNegative).min(1).readonly(),
    operatingYears: z.number().int().positive().max(100),
    fixedOpexPerMwYear: NonNegative,
    fuelCostPerMwh: NonNegative,
    decommissioningCost: NonNegative,
    discountRate: z.number().finite().gt(-1).lt(1),
    outputDelayYears: z.number().int().nonnegative().max(100),
    currency: z.string().trim().min(1),
    baseYear: z.number().int().min(1800).max(3000),
  })
  .strict()
  .readonly();

export type CostScenario = z.infer<typeof CostScenarioSchema>;
