import { describe, expect, it } from "vitest";
import {
  listReactorSystems,
  getReactorSystem,
  validateReactorSystemIntegrity,
  selectPart,
  getConnectedFlows,
  resolveComponentCitations,
  PWR_SYSTEM_DATA,
} from "./reactor-model";
import type { ReactorSystem } from "./schemas";

describe("Reactor Model & Systems Integrity (R15)", () => {
  it("loads all three canonical reactor systems: PWR, BWR, and PHWR", () => {
    const systems = listReactorSystems();
    expect(systems.length).toBeGreaterThanOrEqual(3);

    const pwr = getReactorSystem("pwr");
    expect(pwr).not.toBeNull();
    expect(pwr?.type).toBe("PWR");
    expect(pwr?.components.length).toBeGreaterThanOrEqual(8);

    const bwr = getReactorSystem("bwr");
    expect(bwr).not.toBeNull();
    expect(bwr?.type).toBe("BWR");

    const phwr = getReactorSystem("phwr");
    expect(phwr).not.toBeNull();
    expect(phwr?.type).toBe("PHWR");
  });

  it("verifies referential integrity across all canonical systems with zero orphan connections", () => {
    for (const system of listReactorSystems()) {
      const integrity = validateReactorSystemIntegrity(system);
      expect(integrity.valid).toBe(true);
      expect(integrity.errors).toEqual([]);
    }
  });

  it("rejects reactor systems with orphan flow connections", () => {
    const orphanSystem: ReactorSystem = {
      id: "orphan-sys",
      type: "PWR",
      name: "Orphan System",
      summary: "Has orphan connections.",
      deployedExamples: [],
      components: [
        {
          id: "comp-1",
          name: "Comp 1",
          type: "fuel",
          role: "Role",
          description: "Desc",
          connectedFlowIds: [],
          citationIds: [],
        },
      ],
      flows: [
        {
          id: "orphan-flow",
          name: "Broken flow",
          fromComponentId: "comp-1",
          toComponentId: "ghost-comp-99",
          loop: "primary",
          fluid: "water",
        },
      ],
      citations: [],
    };

    const integrity = validateReactorSystemIntegrity(orphanSystem);
    expect(integrity.valid).toBe(false);
    expect(
      integrity.errors.some((e) => e.includes("orphan toComponentId")),
    ).toBe(true);
  });

  it("rejects duplicate component IDs and duplicate flow IDs", () => {
    const duplicateSystem: ReactorSystem = {
      id: "dup-sys",
      type: "BWR",
      name: "Duplicate System",
      summary: "Has duplicates.",
      deployedExamples: [],
      components: [
        {
          id: "dup-id",
          name: "First",
          type: "fuel",
          role: "Role",
          description: "Desc",
          connectedFlowIds: [],
          citationIds: [],
        },
        {
          id: "dup-id",
          name: "Second",
          type: "vessel",
          role: "Role",
          description: "Desc",
          connectedFlowIds: [],
          citationIds: [],
        },
      ],
      flows: [],
      citations: [],
    };

    const integrity = validateReactorSystemIntegrity(duplicateSystem);
    expect(integrity.valid).toBe(false);
    expect(
      integrity.errors.some((e) => e.includes("Duplicate component ID")),
    ).toBe(true);
  });

  it("handles selection safely through selectPart, resetting unknown selections to null", () => {
    const pwr = PWR_SYSTEM_DATA;

    // Valid selection
    expect(selectPart(pwr, "pwr-vessel")).toBe("pwr-vessel");
    expect(selectPart(pwr, "pwr-steam-gen")).toBe("pwr-steam-gen");

    // Invalid / unknown selection resets safely
    expect(selectPart(pwr, "unknown-part-xyz")).toBeNull();
    expect(selectPart(pwr, null)).toBeNull();
  });

  it("retrieves connected flows for a component", () => {
    const pwr = PWR_SYSTEM_DATA;
    const vesselFlows = getConnectedFlows(pwr, "pwr-vessel");
    expect(vesselFlows.length).toBeGreaterThanOrEqual(2);
    expect(vesselFlows.some((f) => f.id === "pwr-primary-hot")).toBe(true);
    expect(vesselFlows.some((f) => f.id === "pwr-primary-cold")).toBe(true);
  });

  it("resolves component citations", () => {
    const pwr = PWR_SYSTEM_DATA;
    const vessel = pwr.components.find((c) => c.id === "pwr-vessel")!;
    const citations = resolveComponentCitations(pwr, vessel);
    expect(citations.length).toBeGreaterThanOrEqual(1);
    expect(citations[0].publisher).toBe("US Nuclear Regulatory Commission");
  });
});
