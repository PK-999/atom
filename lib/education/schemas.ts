import { z } from "zod";
import { ComplexityLevelSchema } from "../evidence/schemas";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const ConceptSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    complexityMinimum: ComplexityLevelSchema,
  })
  .strict()
  .readonly();

export const LessonSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    moduleId: IdentifierSchema,
    order: z.number().int().min(1),
    explanations: z
      .object({
        kid: NonEmptyStringSchema,
        simple: NonEmptyStringSchema,
        curious: NonEmptyStringSchema,
        technical: NonEmptyStringSchema,
        expert: NonEmptyStringSchema,
      })
      .strict(),
    conceptIds: z.array(IdentifierSchema).readonly(),
  })
  .strict()
  .readonly();

export const ModuleSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    order: z.number().int().min(1),
  })
  .strict()
  .readonly();

export type Concept = z.infer<typeof ConceptSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Module = z.infer<typeof ModuleSchema>;
