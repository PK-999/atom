import { z } from "zod";

export const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const NonEmptyStringSchema = z.string().trim().min(1);

export const ArgumentRelationshipSchema = z.enum([
  "supporting",
  "disputing",
  "contextualizing",
]);

export const ArgumentSideSchema = z.enum([
  "for",
  "against",
  "context",
  "supporting",
  "disputing",
  "contextualizing",
]);

export const EvidenceStrengthSchema = z.enum([
  "established",
  "preponderance",
  "contested",
  "emerging",
]);

export const AttributableStatementSchema = z
  .object({
    statement: NonEmptyStringSchema,
    basis: NonEmptyStringSchema,
    asOf: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD date format"),
    citationIds: z.array(IdentifierSchema).default([]).readonly().optional(),
  })
  .strict()
  .readonly();

export const DebateCitationSchema = z
  .object({
    id: IdentifierSchema,
    title: NonEmptyStringSchema,
    publisher: NonEmptyStringSchema,
    year: z.number().int().min(1900).max(2100),
    url: z.string().url().optional(),
    sourceTier: z.enum(["A", "B", "C"]).default("A"),
    locator: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export const ArgumentSchema = z
  .object({
    id: IdentifierSchema,
    relationship: ArgumentRelationshipSchema.optional(),
    side: ArgumentSideSchema.optional(),
    title: NonEmptyStringSchema,
    body: NonEmptyStringSchema,
    citationIds: z.array(IdentifierSchema).default([]).readonly(),
    evidenceIds: z.array(IdentifierSchema).default([]).readonly(),
    strength: EvidenceStrengthSchema.default("established"),
    order: z.number().int().default(1),
    missingEvidenceNote: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export const DebateTopicSchema = z
  .object({
    id: IdentifierSchema,
    slug: IdentifierSchema.optional(),
    question: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    status: z.enum(["draft", "reviewed", "published"]).default("published"),
    arguments: z.array(ArgumentSchema).min(1).readonly(),
    citations: z.array(DebateCitationSchema).default([]).readonly(),
    consensus: z
      .union([AttributableStatementSchema, NonEmptyStringSchema])
      .optional(),
    uncertainty: z
      .union([AttributableStatementSchema, NonEmptyStringSchema])
      .optional(),
    missingEvidenceNote: NonEmptyStringSchema.optional(),
  })
  .strict()
  .readonly();

export type ArgumentRelationship = z.infer<typeof ArgumentRelationshipSchema>;
export type EvidenceStrength = z.infer<typeof EvidenceStrengthSchema>;
export type AttributableStatement = z.infer<typeof AttributableStatementSchema>;
export type DebateCitation = z.infer<typeof DebateCitationSchema>;
export type Argument = z.infer<typeof ArgumentSchema>;
export type DebateTopic = z.infer<typeof DebateTopicSchema>;

/**
 * Normalizes an argument's relationship into supporting, disputing, or contextualizing.
 */
export function getArgumentRelationship(arg: Argument): ArgumentRelationship {
  if (arg.relationship) return arg.relationship;
  if (arg.side === "for" || arg.side === "supporting") return "supporting";
  if (arg.side === "against" || arg.side === "disputing") return "disputing";
  return "contextualizing";
}

/**
 * Normalizes an attributable statement or plain string into a typed AttributableStatement.
 */
export function normalizeAttributableStatement(
  statement: AttributableStatement | string | undefined,
  defaultBasis = "Independent expert review",
  defaultDate = "2026-09-07",
): AttributableStatement | null {
  if (!statement) return null;
  if (typeof statement === "string") {
    return {
      statement,
      basis: defaultBasis,
      asOf: defaultDate,
      citationIds: [],
    };
  }
  return statement;
}
