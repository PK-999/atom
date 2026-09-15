import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const NonEmptyStringSchema = z.string().trim().min(1);

export const AnswerStateSchema = z.enum([
  "idle",
  "loading",
  "answered",
  "insufficient-evidence",
  "error",
]);

export const AskExplanationLevelSchema = z.enum([
  "explorer",
  "standard",
  "deep-dive",
]);

export const AskCitationSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    publisher: NonEmptyStringSchema,
    year: z.number().int().optional(),
    url: z.string().url().optional(),
    asOf: z.string().optional(),
    summary: NonEmptyStringSchema,
  })
  .strict()
  .readonly();

export const AskQuerySchema = z
  .object({
    id: IdentifierSchema,
    prompt: z.string().trim().min(1).max(500),
    timestamp: z.string().datetime(),
    level: AskExplanationLevelSchema.default("standard"),
  })
  .strict()
  .readonly();

export const AskResponseSchema = z
  .object({
    queryId: IdentifierSchema,
    state: AnswerStateSchema,
    prompt: NonEmptyStringSchema,
    answerText: z.string(),
    citations: z.array(AskCitationSchema).readonly(),
    evidenceIds: z.array(IdentifierSchema).readonly(),
    limitations: z.array(NonEmptyStringSchema).readonly().optional(),
    explanationLevel: AskExplanationLevelSchema,
    errorMessage: z.string().optional(),
  })
  .strict()
  .readonly();

export type AnswerState = z.infer<typeof AnswerStateSchema>;
export type AskExplanationLevel = z.infer<typeof AskExplanationLevelSchema>;
export type AskCitation = z.infer<typeof AskCitationSchema>;
export type AskQuery = z.infer<typeof AskQuerySchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;
