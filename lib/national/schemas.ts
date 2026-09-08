import { z } from "zod";

export const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const NonEmptyStringSchema = z.string().trim().min(1);

export const EnergyMixEntrySchema = z
  .object({
    source: NonEmptyStringSchema,
    capacityGw: z.number().nonnegative(),
    capacitySharePercent: z.number().min(0).max(100),
    generationTwh: z.number().nonnegative(),
    generationSharePercent: z.number().min(0).max(100),
    color: z.string().optional(),
  })
  .strict()
  .readonly();

export const EnergyMixSourceAttributionSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    publisher: NonEmptyStringSchema,
    asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    url: z.string().url().optional(),
  })
  .strict()
  .readonly();

export const EnergyMixSchema = z
  .object({
    year: z.number().int().min(2000).max(2100),
    reportingPeriod: NonEmptyStringSchema,
    totalCapacityGw: z.number().positive(),
    totalGenerationTwh: z.number().positive(),
    isComplete: z.boolean().default(true),
    entries: z.array(EnergyMixEntrySchema).min(1).readonly(),
    source: EnergyMixSourceAttributionSchema,
  })
  .strict()
  .superRefine((mix, context) => {
    if (mix.isComplete) {
      const capSum = mix.entries.reduce(
        (acc, e) => acc + e.capacitySharePercent,
        0,
      );
      const genSum = mix.entries.reduce(
        (acc, e) => acc + e.generationSharePercent,
        0,
      );
      // declared tolerance of ±1.5% for statistical rounding
      if (Math.abs(capSum - 100) > 1.5) {
        context.addIssue({
          code: "custom",
          message: `Complete capacity shares must sum to ~100% (got ${capSum.toFixed(2)}%)`,
          path: ["entries"],
        });
      }
      if (Math.abs(genSum - 100) > 1.5) {
        context.addIssue({
          code: "custom",
          message: `Complete generation shares must sum to ~100% (got ${genSum.toFixed(2)}%)`,
          path: ["entries"],
        });
      }
    }
  })
  .readonly();

export const ThreeStageProgramStageSchema = z
  .object({
    stageNumber: z.number().int().min(1).max(3),
    name: NonEmptyStringSchema,
    reactorTech: NonEmptyStringSchema,
    inputFuel: NonEmptyStringSchema,
    outputFuel: NonEmptyStringSchema,
    status: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    keyMilestone: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const NationalScenarioSchema = z
  .object({
    targetYear: z.number().int().min(2025).max(2100),
    targetCapacityGw: z.number().positive(),
    projectedGenerationSharePercent: z.number().min(0).max(100).optional(),
    basisAndAssumptions: NonEmptyStringSchema,
    source: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const FleetStatusSummarySchema = z
  .object({
    operatingReactors: z.number().int().nonnegative(),
    operatingCapacityMw: z.number().positive(),
    underConstructionReactors: z.number().int().nonnegative(),
    underConstructionCapacityMw: z.number().positive(),
    plannedSanctionedReactors: z.number().int().nonnegative(),
    standardPhwrDesignMw: z.number().positive(),
  })
  .strict()
  .readonly();

export const NationalProfileSchema = z
  .object({
    id: IdentifierSchema,
    countryCode: z.string().length(2).toUpperCase(),
    countryName: NonEmptyStringSchema,
    overview: NonEmptyStringSchema,
    domesticPolicy: NonEmptyStringSchema,
    reactorFleetSummary: NonEmptyStringSchema,
    mix: EnergyMixSchema,
    threeStageProgram: z
      .array(ThreeStageProgramStageSchema)
      .length(3)
      .readonly(),
    fleetStatus: FleetStatusSummarySchema,
    scenarios2050: z.array(NationalScenarioSchema).min(1).readonly(),
    citations: z.array(EnergyMixSourceAttributionSchema).default([]).readonly(),
  })
  .strict()
  .readonly();

export type EnergyMixEntry = z.infer<typeof EnergyMixEntrySchema>;
export type EnergyMix = z.infer<typeof EnergyMixSchema>;
export type ThreeStageProgramStage = z.infer<
  typeof ThreeStageProgramStageSchema
>;
export type NationalScenario = z.infer<typeof NationalScenarioSchema>;
export type FleetStatusSummary = z.infer<typeof FleetStatusSummarySchema>;
export type NationalProfile = z.infer<typeof NationalProfileSchema>;
