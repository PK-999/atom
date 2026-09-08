import { z } from "zod";

export function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) return false;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getHoursForYear(year: number): 8760 | 8784 {
  return isLeapYear(year) ? 8784 : 8760;
}

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const GenerationSourceSchema = z
  .object({
    id: IdentifierSchema,
    name: z.string().min(1),
    capacityMw: z.number().finite().nonnegative(),
    capacityFactor: z.number().finite().min(0).max(1),
    isDispatchable: z.boolean(),
    color: z.string().optional(),
    lifecycleCo2PerKwh: z.number().finite().nonnegative().optional(),
  })
  .strict()
  .readonly();

export const GridScenarioSchema = z
  .object({
    id: IdentifierSchema,
    name: z.string().min(1),
    description: z.string().optional(),
    year: z.number().int().min(1900).max(2200),
    hoursPerYear: z.union([z.literal(8760), z.literal(8784)]),
    annualDemandMwh: z.number().finite().nonnegative(),
    sources: z.array(GenerationSourceSchema).min(1).readonly(),
    legacyAssumptionNotice: z.string().optional(),
  })
  .strict()
  .readonly()
  .refine(
    (data) => {
      const expectedHours = getHoursForYear(data.year);
      return data.hoursPerYear === expectedHours;
    },
    {
      message:
        "hoursPerYear must match calendar year leap status (8784 for leap year, 8760 for non-leap year)",
      path: ["hoursPerYear"],
    },
  );

export type GenerationSource = z.infer<typeof GenerationSourceSchema>;
export type GridScenario = z.infer<typeof GridScenarioSchema>;
