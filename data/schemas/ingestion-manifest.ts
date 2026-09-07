import { z } from "zod";

import {
  IdentifierSchema,
  LicenseSchema,
  SourceTierSchema,
} from "@/lib/evidence/schemas";

export const IngestionManifestSchema = z
  .object({
    datasetId: IdentifierSchema,
    sourceId: IdentifierSchema,
    sourceVersion: z.string().trim().min(1),
    sourceUrl: z.url(),
    accessDate: z.iso.date(),
    licence: LicenseSchema,
    sourceTier: SourceTierSchema,
    conflictDisclosure: z.string().trim().min(1),
    checksumAlgorithm: z.literal("sha256"),
    checksum: z
      .string()
      .regex(/^[a-f0-9]{64}$/, "Checksum must be a lowercase sha256 digest."),
    parserId: IdentifierSchema,
    transformationVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    supersedesVersionId: IdentifierSchema.optional(),
    revision: z
      .object({
        decidedOn: z.iso.date(),
        reason: z.string().trim().min(1),
        materialImpact: z.enum(["none", "minor", "material"]),
        affectedObservationIds: z.array(IdentifierSchema).min(1),
      })
      .strict()
      .optional(),
    referenceArtifact: z
      .object({
        url: z.url(),
        checksum: z.string().regex(/^[a-f0-9]{64}$/),
        publicationVersion: z.string().trim().min(1),
        extractionLocator: z.string().trim().min(1),
        mediaType: z.string().trim().min(1),
      })
      .strict()
      .optional(),
    canonicalUnits: z.record(IdentifierSchema, z.string().trim().min(1)),
    reviewerRoles: z
      .array(z.enum(["scientific", "editorial", "licensing"]))
      .length(3)
      .superRefine((roles, context) => {
        for (const role of ["scientific", "editorial", "licensing"] as const) {
          if (!roles.includes(role)) {
            context.addIssue({
              code: "custom",
              message: `Required review role missing: ${role}.`,
            });
          }
        }
      }),
    redistribution: z.enum(["allowed", "restricted", "unknown"]),
  })
  .strict()
  .readonly();

export type IngestionManifest = z.infer<typeof IngestionManifestSchema>;
