import { describe, expect, it } from "vitest";
import { getIndiaProfile } from "./national-model";

describe("India National Profile Model (R16-I)", () => {
  it("loads the validated India national profile with official CEA power data", () => {
    const profile = getIndiaProfile();
    expect(profile.countryCode).toBe("IN");
    expect(profile.countryName).toBe("India");
    expect(profile.mix.source.publisher).toContain(
      "Central Electricity Authority",
    );
    expect(profile.mix.year).toBe(2024);
  });

  it("proves distinct generation vs installed capacity context", () => {
    const profile = getIndiaProfile();
    const nuclear = profile.mix.entries.find((e) => e.source === "Nuclear")!;
    const solar = profile.mix.entries.find((e) => e.source === "Solar PV")!;

    // Nuclear capacity share vs generation share
    expect(nuclear.capacitySharePercent).toBeCloseTo(1.85, 1);
    expect(nuclear.generationSharePercent).toBeCloseTo(2.75, 1);
    // Generation share is higher than capacity share due to high capacity factor (>70%)
    expect(nuclear.generationSharePercent).toBeGreaterThan(
      nuclear.capacitySharePercent,
    );

    // Solar capacity share vs generation share
    expect(solar.capacitySharePercent).toBeCloseTo(18.47, 1);
    expect(solar.generationSharePercent).toBeCloseTo(6.67, 1);
    // Solar generation share is lower than capacity share due to solar capacity factor (~18-20%)
    expect(solar.generationSharePercent).toBeLessThan(
      solar.capacitySharePercent,
    );
  });

  it("models the complete three-stage nuclear power programme sequentially", () => {
    const profile = getIndiaProfile();
    expect(profile.threeStageProgram).toHaveLength(3);

    const stage1 = profile.threeStageProgram[0];
    expect(stage1.stageNumber).toBe(1);
    expect(stage1.name).toContain("Stage 1");
    expect(stage1.inputFuel).toContain("Natural Uranium");
    expect(stage1.outputFuel).toContain("Plutonium-239");

    const stage2 = profile.threeStageProgram[1];
    expect(stage2.stageNumber).toBe(2);
    expect(stage2.name).toContain("Stage 2");
    expect(stage2.inputFuel).toContain("Plutonium-239");
    expect(stage2.outputFuel).toContain("Uranium-233");

    const stage3 = profile.threeStageProgram[2];
    expect(stage3.stageNumber).toBe(3);
    expect(stage3.name).toContain("Stage 3");
    expect(stage3.inputFuel).toContain("Thorium-232");
  });

  it("models current operating fleet and sanctioned fleet-mode expansion", () => {
    const profile = getIndiaProfile();
    expect(profile.fleetStatus.operatingReactors).toBe(24);
    expect(profile.fleetStatus.operatingCapacityMw).toBe(8180);
    expect(profile.fleetStatus.underConstructionReactors).toBe(8);
    expect(profile.fleetStatus.plannedSanctionedReactors).toBe(10);
    expect(profile.fleetStatus.standardPhwrDesignMw).toBe(700);
  });

  it("labels 2050/2032 scenarios with attributable assumptions and sources", () => {
    const profile = getIndiaProfile();
    expect(profile.scenarios2050.length).toBeGreaterThanOrEqual(2);

    for (const sc of profile.scenarios2050) {
      expect(sc.targetYear).toBeGreaterThan(2025);
      expect(sc.targetCapacityGw).toBeGreaterThan(0);
      expect(sc.basisAndAssumptions).toBeTruthy();
      expect(sc.source).toBeTruthy();
    }
  });
});
