import { z } from "zod";
import { CitationSchema } from "../evidence/schemas";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NonEmptyStringSchema = z.string().trim().min(1);

export const AskQuerySchema = z
  .object({
    id: IdentifierSchema,
    prompt: NonEmptyStringSchema,
    timestamp: z.string().datetime(),
  })
  .strict()
  .readonly();

export const AskResponseSchema = z
  .object({
    queryId: IdentifierSchema,
    answerMarkdown: NonEmptyStringSchema,
    citationIds: z.array(IdentifierSchema).readonly(),
    confidence: z.enum(["high", "medium", "low"]),
    caveats: z.array(NonEmptyStringSchema).optional(),
  })
  .strict()
  .readonly();

export type AskQuery = z.infer<typeof AskQuerySchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;
