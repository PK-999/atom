import { describe, expect, it } from "vitest";

import { createEvidenceRepositoryContractSnapshot } from "./repository-contract";
import { getPublicEvidenceRecord } from "./public-records";
import { withSyntheticReview } from "./release-fixtures.test-support";

type Mutable<T> = T extends object
  ? { -readonly [K in keyof T]: Mutable<T[K]> }
  : T;

describe("public evidence records", () => {
  it("returns only safe projections for a published synthetic graph", () => {
    const snapshot = withSyntheticReview(
      createEvidenceRepositoryContractSnapshot(),
    );
    const source = getPublicEvidenceRecord(
      "source",
      snapshot.provenance!.sources[0].id,
      snapshot,
    );
    const study = getPublicEvidenceRecord(
      "study",
      snapshot.provenance!.studies[0].id,
      snapshot,
    );
    const dataset = getPublicEvidenceRecord(
      "dataset",
      snapshot.provenance!.versions[0].dataset.id,
      snapshot,
    );

    expect(source).toMatchObject({ kind: "source", publisher: "Test fixture" });
    expect(source).not.toHaveProperty("reviewerId");
    expect(study).toMatchObject({
      kind: "study",
      methodology: "Synthetic repository-contract methodology.",
    });
    expect(dataset).toMatchObject({ kind: "dataset", status: "published" });
    expect(dataset).not.toHaveProperty("reviews");
  });

  it("withholds unknown, draft, and restricted records", () => {
    const snapshot = withSyntheticReview(
      createEvidenceRepositoryContractSnapshot(),
    );
    const sourceId = snapshot.provenance!.sources[0].id;
    const datasetId = snapshot.provenance!.versions[0].dataset.id;
    expect(getPublicEvidenceRecord("source", "missing", snapshot)).toBeNull();

    const mutable = snapshot as Mutable<typeof snapshot>;
    mutable.provenance!.versions[0].status = "draft";
    expect(getPublicEvidenceRecord("dataset", datasetId, snapshot)).toBeNull();

    mutable.provenance!.versions[0].status = "published";
    mutable.provenance!.sources[0].license.redistribution = "restricted";
    expect(getPublicEvidenceRecord("source", sourceId, snapshot)).toBeNull();
    expect(getPublicEvidenceRecord("dataset", datasetId, snapshot)).toBeNull();
  });
});
