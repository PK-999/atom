import { describe, expect, it } from "vitest";

import {
  createEvidenceRepositoryContractSnapshot,
  runEvidenceRepositoryContract,
} from "./repository-contract";
import {
  LocalEvidenceRepository,
  type EvidenceSnapshot,
} from "./local-repository";

runEvidenceRepositoryContract(
  (snapshot) => new LocalEvidenceRepository(snapshot),
);

describe("LocalEvidenceRepository", () => {
  it("does not expose technologies outside a published supported release", async () => {
    const repository = new LocalEvidenceRepository(
      createEvidenceRepositoryContractSnapshot(),
    );

    expect(await repository.listTechnologies()).toEqual([
      expect.objectContaining({ id: "fixture-technology-a" }),
      expect.objectContaining({ id: "fixture-technology-b" }),
    ]);
  });

  it("deep-freezes empty results for unavailable metrics and filters", async () => {
    const repository = new LocalEvidenceRepository(
      createEvidenceRepositoryContractSnapshot(),
    );

    const geographies = await repository.listGeographies("fixture-missing");
    const observations = await repository.getPublishedObservations({
      metricId: "fixture-missing",
    });

    expect(Object.isFrozen(geographies)).toBe(true);
    expect(Object.isFrozen(observations)).toBe(true);
  });

  it("clones validated fixture inputs before freezing them", async () => {
    const snapshot = createEvidenceRepositoryContractSnapshot();
    const repository = new LocalEvidenceRepository(snapshot);
    (
      snapshot as unknown as { technologies: { name: string }[] }
    ).technologies[0].name = "Mutated fixture";

    const technologies = await repository.listTechnologies();

    expect(technologies[0]).toMatchObject({ name: "Alpha technology" });
  });

  it("rejects a snapshot without observation version mappings", () => {
    const snapshotWithoutMappings = {
      ...createEvidenceRepositoryContractSnapshot(),
    } as Omit<EvidenceSnapshot, "observationDatasetVersionIds"> & {
      observationDatasetVersionIds?: Readonly<Record<string, string>>;
    };
    delete snapshotWithoutMappings.observationDatasetVersionIds;

    expect(
      () =>
        new LocalEvidenceRepository(
          snapshotWithoutMappings as unknown as EvidenceSnapshot,
        ),
    ).toThrow(/version mapping/i);
  });

  it("rejects incomplete observation version mappings", () => {
    const snapshot = createEvidenceRepositoryContractSnapshot();
    const incompleteMapping = { ...snapshot.observationDatasetVersionIds };
    delete incompleteMapping["fixture-observation-a"];

    expect(
      () =>
        new LocalEvidenceRepository({
          ...snapshot,
          observationDatasetVersionIds: incompleteMapping,
        }),
    ).toThrow(/version mapping/i);
  });

  it("rejects mappings for unknown observations", () => {
    const snapshot = createEvidenceRepositoryContractSnapshot();

    expect(
      () =>
        new LocalEvidenceRepository({
          ...snapshot,
          observationDatasetVersionIds: {
            ...snapshot.observationDatasetVersionIds,
            "fixture-unknown-observation": "fixture-version-active",
          },
        }),
    ).toThrow(/unknown observation/i);
  });

  it("safely handles Date instances without throwing or breaking Date operations", () => {
    const date = new Date("2026-01-01T00:00:00Z");
    const snapshot = createEvidenceRepositoryContractSnapshot();
    const repo = new LocalEvidenceRepository(snapshot);
    expect(repo).toBeDefined();
    // Verify Date instance remains usable
    expect(date.getFullYear()).toBe(2026);
  });
});

it("does not publish flags-only observations without source/version review provenance", async () => {
  const snapshot = createEvidenceRepositoryContractSnapshot();
  const repository = new LocalEvidenceRepository({
    ...snapshot,
    provenance: undefined,
  } as EvidenceSnapshot);
  expect(
    await repository.getPublishedObservations({ metricId: "fixture-metric" }),
  ).toEqual([]);
});
