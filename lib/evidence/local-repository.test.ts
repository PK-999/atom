import { describe, expect, it } from "vitest";

import {
  createEvidenceRepositoryContractSnapshot,
  runEvidenceRepositoryContract,
} from "./repository-contract";
import { LocalEvidenceRepository } from "./local-repository";

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
});
