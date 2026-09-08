import { z } from "zod";

export const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const NonEmptyStringSchema = z.string().trim().min(1);

export const ComponentTypeSchema = z.enum([
  "fuel",
  "coolant",
  "moderator",
  "control-rod",
  "vessel",
  "containment",
  "steam-generator",
  "pressurizer",
  "steam-cycle",
  "pump",
  "turbine",
  "condenser",
  "cooling-tower",
  "calandria",
]);

export const FlowLoopSchema = z.enum([
  "primary",
  "secondary",
  "tertiary-cooling",
  "moderator",
]);

export const DiagramCoordsSchema = z
  .object({
    x: z.number().min(0).max(1000),
    y: z.number().min(0).max(1000),
    width: z.number().min(5).max(1000),
    height: z.number().min(5).max(1000),
  })
  .strict()
  .readonly();

export const ReactorCitationSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    publisher: NonEmptyStringSchema,
    year: z.number().int().min(1900).max(2100),
    url: z.string().url().optional(),
    locator: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export const ReactorComponentSchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    type: ComponentTypeSchema,
    role: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    simplerExplanation: NonEmptyStringSchema.optional(),
    deeperExplanation: NonEmptyStringSchema.optional(),
    connectedFlowIds: z.array(IdentifierSchema).default([]).readonly(),
    diagramCoords: DiagramCoordsSchema.optional(),
    citationIds: z.array(IdentifierSchema).default([]).readonly(),
  })
  .strict()
  .readonly();

export const ReactorFlowSchema = z
  .object({
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    fromComponentId: IdentifierSchema,
    toComponentId: IdentifierSchema,
    loop: FlowLoopSchema,
    fluid: NonEmptyStringSchema,
    operatingTemp: NonEmptyStringSchema.optional(),
    operatingPressure: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export const ReactorSystemTypeSchema = z.enum([
  "PWR",
  "BWR",
  "PHWR",
  "CANDU",
  "RBMK",
  "Fast",
  "Molten-Salt",
  "SMR",
]);

export const ReactorSystemSchema = z
  .object({
    id: IdentifierSchema,
    slug: IdentifierSchema.optional(),
    type: ReactorSystemTypeSchema,
    name: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    conceptDescription: NonEmptyStringSchema.optional(),
    deployedExamples: z
      .array(NonEmptyStringSchema)
      .default([])
      .readonly()
      .optional(),
    operatingContext: NonEmptyStringSchema.optional(),
    components: z.array(ReactorComponentSchema).min(1).readonly(),
    flows: z.array(ReactorFlowSchema).default([]).readonly(),
    citations: z.array(ReactorCitationSchema).default([]).readonly(),
  })
  .strict()
  .readonly();

export type ComponentType = z.infer<typeof ComponentTypeSchema>;
export type FlowLoop = z.infer<typeof FlowLoopSchema>;
export type DiagramCoords = z.infer<typeof DiagramCoordsSchema>;
export type ReactorCitation = z.infer<typeof ReactorCitationSchema>;
export type ReactorComponent = z.infer<typeof ReactorComponentSchema>;
export type ReactorFlow = z.infer<typeof ReactorFlowSchema>;
export type ReactorSystemType = z.infer<typeof ReactorSystemTypeSchema>;
export type ReactorSystem = z.infer<typeof ReactorSystemSchema>;
