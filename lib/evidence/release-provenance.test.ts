import { describe, expect, it } from "vitest";
import {
  LocalEvidenceRepository,
  type EvidenceSnapshot,
} from "./local-repository";
import { createEvidenceRepositoryContractSnapshot } from "./repository-contract";
import {
  activateEvidenceVersion,
  appendEvidenceSnapshot,
  digestVersion,
} from "./release-provenance";
import { withSyntheticReview } from "./release-fixtures.test-support";

type Mutable<T> = T extends object
  ? { -readonly [K in keyof T]: Mutable<T[K]> }
  : T;
const fixture = () =>
  createEvidenceRepositoryContractSnapshot() as Mutable<EvidenceSnapshot>;
const published = (snapshot: EvidenceSnapshot) =>
  new LocalEvidenceRepository(snapshot).getPublishedObservations({
    metricId: "fixture-metric",
  });
function resign(snapshot: EvidenceSnapshot) {
  for (const version of snapshot.provenance!.versions)
    for (const review of version.reviews)
      review.payloadSha256 = digestVersion(snapshot, version);
}

describe("reviewed evidence release boundary", () => {
  it("requires all three exact-payload review decisions", async () => {
    const base = fixture();
    expect(await published(base)).toHaveLength(2);
    for (const kind of ["scientific", "editorial", "licensing"]) {
      const snapshot = fixture();
      snapshot.provenance!.versions[0].reviews =
        snapshot.provenance!.versions[0].reviews.filter((r) => r.kind !== kind);
      expect(await published(snapshot)).toEqual([]);
    }
  });

  for (const [label, mutate] of [
    [
      "unresolved source",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.sources = [];
      },
    ],
    [
      "unresolved study",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.studies = [];
      },
    ],
    [
      "unresolved version",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions = [];
      },
    ],
    [
      "draft version",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].status = "draft";
      },
    ],
    [
      "withdrawn version",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].status = "withdrawn";
      },
    ],
    [
      "missing source artifact",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].artifacts[0].sourceId = "wrong-source";
      },
    ],
    [
      "missing publication",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.publications = [];
      },
    ],
    [
      "draft parent",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.publications.filter(
          (p) => p.entityType === "dataset",
        ).forEach((p) => {
          p.status = "draft";
        });
      },
    ],
    [
      "restricted source",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.sources[0].license.redistribution = "restricted";
      },
    ],
    [
      "unknown dataset reuse",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].dataset.license.redistribution = "unknown";
      },
    ],
    [
      "wrong study relationship",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.studies.forEach((study) => {
          study.sourceIds = ["wrong-source"];
        });
      },
    ],
    [
      "wrong dataset identity",
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].dataset.id = "wrong-dataset";
      },
    ],
  ] as const) {
    it(`rejects ${label} even with newly signed test decisions`, async () => {
      const snapshot = fixture();
      mutate(snapshot);
      resign(snapshot);
      expect(await published(snapshot)).toEqual([]);
    });
  }

  it("cannot reuse reviews after observation, source, metric, locator or artifact changes", async () => {
    const mutations = [
      (s: Mutable<EvidenceSnapshot>) => {
        s.observations[0].methodology += " changed";
      },
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.sources[0].url = "https://example.com/changed";
      },
      (s: Mutable<EvidenceSnapshot>) => {
        s.metrics[0].definition += " changed";
      },
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].artifacts[0].locator = "different table";
      },
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].artifacts[0].sha256 = "2".repeat(64);
      },
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].reviews[0].datasetVersionId =
          "another-version";
      },
      (s: Mutable<EvidenceSnapshot>) => {
        s.provenance!.versions[0].reviews[0].decision = "rejected";
      },
    ];
    for (const mutate of mutations) {
      const snapshot = fixture();
      mutate(snapshot);
      expect(await published(snapshot)).toEqual([]);
    }
  });

  it("rejects duplicate identities and ambiguous decisions", async () => {
    const duplicate = fixture();
    duplicate.provenance!.versions.push(duplicate.provenance!.versions[0]);
    expect(() => new LocalEvidenceRepository(duplicate)).toThrow(/duplicate/i);
    const conflicting = fixture();
    conflicting.provenance!.versions[0].reviews.push({
      ...conflicting.provenance!.versions[0].reviews[0],
      decision: "rejected",
    });
    expect(await published(conflicting)).toEqual([]);
  });

  it("requires decisions to follow verification and precede publication", async () => {
    for (const date of ["2026-08-01", "2026-10-01"]) {
      const snapshot = fixture();
      snapshot.provenance!.versions[0].reviews[0].reviewedAt = date;
      expect(await published(snapshot)).toEqual([]);
    }
  });

  it("activation and rollback preserve history and exclude inactive versions", async () => {
    const base = fixture();
    base.observations = base.observations.filter((o) =>
      ["fixture-observation-a", "fixture-observation-b"].includes(o.id),
    );
    base.observationDatasetVersionIds = Object.fromEntries(
      base.observations.map((o) => [o.id, "fixture-version-active"]),
    );
    const old = base.observations.find(
      (o) => o.id === "fixture-observation-a",
    )!;
    if (old.kind !== "numeric" || old.valueSemantics !== "point")
      throw new Error("Expected synthetic point");
    const nextObservation = {
      ...old,
      id: "fixture-observation-next",
      kind: "numeric" as const,
      valueSemantics: "point" as const,
      value: 0,
    };
    const snapshot = withSyntheticReview({
      ...base,
      observations: [...base.observations, nextObservation],
      observationDatasetVersionIds: {
        ...base.observationDatasetVersionIds,
        [nextObservation.id]: "fixture-version-next",
      },
    });
    const initialJson = JSON.stringify(snapshot);
    const activated = activateEvidenceVersion(
      snapshot,
      "fixture-metric",
      "fixture-version-next",
    );
    expect(await published(activated)).toMatchObject([
      { id: nextObservation.id, value: 0 },
    ]);
    const rolledBack = activateEvidenceVersion(
      activated,
      "fixture-metric",
      "fixture-version-active",
    );
    expect(await published(rolledBack)).toHaveLength(2);
    expect(JSON.stringify(snapshot)).toBe(initialJson);
    expect(rolledBack.provenance).toEqual(snapshot.provenance);
    expect(() => appendEvidenceSnapshot(snapshot, activated)).not.toThrow();
  });

  it("refuses draft activation and mutation/removal of a historical version", () => {
    const snapshot = fixture();
    const changed = fixture();
    changed.provenance!.versions[0].status = "draft";
    expect(() =>
      activateEvidenceVersion(
        changed,
        "fixture-metric",
        "fixture-version-active",
      ),
    ).toThrow(/unreviewed/);
    changed.observations[0].methodology += " changed";
    resign(changed);
    expect(() => appendEvidenceSnapshot(snapshot, changed)).toThrow(
      /immutable/i,
    );
    const removed = fixture();
    removed.provenance!.versions = [];
    expect(() => appendEvidenceSnapshot(snapshot, removed)).toThrow(
      /immutable/i,
    );
  });
});

it("preserves historical review/publication decisions and prevents reactivating withdrawn versions", () => {
  const snapshot = fixture();
  const missingReview = fixture();
  missingReview.provenance!.versions[0].reviews = [];
  expect(() => appendEvidenceSnapshot(snapshot, missingReview)).toThrow(
    /historical/i,
  );
  const missingPublication = fixture();
  missingPublication.provenance!.publications = [];
  expect(() => appendEvidenceSnapshot(snapshot, missingPublication)).toThrow(
    /historical/i,
  );
  const withdrawn = fixture();
  withdrawn.provenance!.versions[0].status = "withdrawn";
  expect(() => appendEvidenceSnapshot(snapshot, withdrawn)).not.toThrow();
  expect(() => appendEvidenceSnapshot(withdrawn, snapshot)).toThrow(
    /withdrawn/i,
  );
});
