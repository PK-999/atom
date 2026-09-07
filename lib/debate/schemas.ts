import { z } from "zod";
import { CitationSchema } from "../evidence/schemas";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const ArgumentSchema = z
  .object({
    id: IdentifierSchema,
    side: z.enum(["for", "against", "context"]),
    title: NonEmptyStringSchema,
    body: NonEmptyStringSchema,
    citationIds: z.array(IdentifierSchema).readonly(),
  })
  .strict()
  .readonly();

export const DebateTopicSchema = z
  .object({
    id: IdentifierSchema,
    question: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    arguments: z.array(ArgumentSchema).min(1).readonly(),
    consensus: NonEmptyStringSchema.optional(),
    uncertainty: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export type Argument = z.infer<typeof ArgumentSchema>;
export type DebateTopic = z.infer<typeof DebateTopicSchema>;
