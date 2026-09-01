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
    canonicalUnits: z.record(IdentifierSchema, z.string().trim().min(1)),
    reviewerRoles: z
      .array(z.enum(["scientific", "editorial", "licensing"]))
      .min(2),
    redistribution: z.enum(["allowed", "restricted", "unknown"]),
  })
  .strict()
  .readonly();

export type IngestionManifest = z.infer<typeof IngestionManifestSchema>;
