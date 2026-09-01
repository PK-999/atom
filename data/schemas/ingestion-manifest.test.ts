import { describe, expect, it } from "vitest";

import { IngestionManifestSchema } from "./ingestion-manifest";

const validManifest = {
  accessDate: "2026-09-01",
  canonicalUnits: { capacity: "MW" },
  checksum: "09e8b2f871fb1ca21d9a7f06904e0d7d74773c81e21d13fd15b902d9fb3ecae2",
  checksumAlgorithm: "sha256" as const,
  conflictDisclosure: "No known conflicts of interest.",
  datasetId: "eia-capacity-factor",
  licence: {
    id: "public-domain",
    name: "Public Domain",
    redistribution: "allowed" as const,
    url: "https://example.com/license",
  },
  parserId: "eia-capacity-factor-parser",
  redistribution: "allowed" as const,
  reviewerRoles: ["scientific", "editorial", "licensing"] as const,
  sourceId: "eia",
  sourceTier: "A" as const,
  sourceUrl: "https://example.com/eia-capacity-factor",
  sourceVersion: "2026-08",
  transformationVersion: "1.0.0",
};

describe("IngestionManifestSchema", () => {
  it("parses a complete immutable ingestion manifest", () => {
    expect(IngestionManifestSchema.parse(validManifest)).toEqual(validManifest);
  });

  it("rejects manifests whose declared checksum is not sha256", () => {
    expect(() =>
      IngestionManifestSchema.parse({ ...validManifest, checksum: "abc" }),
    ).toThrow(/sha256/i);
  });

  it("rejects unrecognized manifest fields", () => {
    expect(
      IngestionManifestSchema.safeParse({
        ...validManifest,
        localFilePath: "/tmp/eia-capacity-factor.csv",
      }).success,
    ).toBe(false);
  });
});
