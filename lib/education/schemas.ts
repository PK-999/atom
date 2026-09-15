import { z } from "zod";
import { ComplexityLevelSchema } from "../evidence/schemas";

export const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const NonEmptyStringSchema = z.string().trim().min(1);

export const ContentStatusSchema = z.enum([
  "draft",
  "in-review",
  "published",
  "withdrawn",
]);

export const CheckpointOptionSchema = z
  .object({
    id: IdentifierSchema,
    text: NonEmptyStringSchema,
    isCorrect: z.boolean(),
    explanation: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const CheckpointSchema = z
  .object({
    id: IdentifierSchema,
    lessonId: IdentifierSchema,
    prompt: NonEmptyStringSchema,
    options: z.array(CheckpointOptionSchema).min(2),
  })
  .strict()
  .readonly();

export const SubtopicSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    status: ContentStatusSchema,
  })
  .strict()
  .readonly();

export const TopicSchema = z
  .object({
    id: IdentifierSchema,
    slug: IdentifierSchema,
    title: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    order: z.number().int().min(1),
    status: ContentStatusSchema,
    subtopics: z.array(SubtopicSchema).readonly(),
  })
  .strict()
  .readonly();

export const LessonRecordSchema = z
  .object({
    id: IdentifierSchema,
    slug: IdentifierSchema,
    title: NonEmptyStringSchema,
    topicId: IdentifierSchema,
    objective: NonEmptyStringSchema,
    order: z.number().int().min(1),
    prerequisiteIds: z.array(IdentifierSchema).readonly(),
    conceptIds: z.array(IdentifierSchema).readonly(),
    claimIds: z.array(IdentifierSchema).readonly(),
    contentByLevel: z
      .object({
        beginner: NonEmptyStringSchema,
        explorer: NonEmptyStringSchema,
        curious: NonEmptyStringSchema,
        "deep-dive": NonEmptyStringSchema,
        geeky: NonEmptyStringSchema,
      })
      .strict(),
    checkpointIds: z.array(IdentifierSchema).readonly(),
    nextLessonId: IdentifierSchema.nullable(),
    status: ContentStatusSchema,
    version: NonEmptyStringSchema,
    lastVerifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .strict()
  .readonly();

// Legacy schemas preserved for backward compatibility
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
        beginner: NonEmptyStringSchema,
        explorer: NonEmptyStringSchema,
        curious: NonEmptyStringSchema,
        "deep-dive": NonEmptyStringSchema,
        geeky: NonEmptyStringSchema,
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

export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type CheckpointOption = z.infer<typeof CheckpointOptionSchema>;
export type Checkpoint = z.infer<typeof CheckpointSchema>;
export type Subtopic = z.infer<typeof SubtopicSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type LessonRecord = z.infer<typeof LessonRecordSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Module = z.infer<typeof ModuleSchema>;
