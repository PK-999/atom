import { describe, expect, it } from "vitest";
import {
  calculateEffectiveMultiplication,
  stepNeutronKinetics,
  FISSION_PHYSICS_CONSTANTS,
} from "./fission-model";

describe("fission-model", () => {
  it("provides standard IAEA/ENDF physical constants for U-235", () => {
    expect(FISSION_PHYSICS_CONSTANTS.ENERGY_PER_FISSION_MEV).toBe(200.0);
    expect(FISSION_PHYSICS_CONSTANTS.AVERAGE_NEUTRONS_PER_FISSION).toBe(2.43);
    expect(FISSION_PHYSICS_CONSTANTS.DELAYED_NEUTRON_FRACTION_BETA).toBe(
      0.0065,
    );
    expect(FISSION_PHYSICS_CONSTANTS.THERMAL_FISSION_CROSS_SECTION_BARNS).toBe(
      585.0,
    );
  });

  it("calculates subcritical state when control rods are fully inserted", () => {
    const calc = calculateEffectiveMultiplication({
      enrichmentPercent: 4.5,
      moderatorDensity: 0.9,
      controlRodInsertionPercent: 100, // fully inserted
      boronConcentrationPpm: 1000,
    });

    expect(calc.keff).toBeLessThan(1.0);
    expect(calc.reactivityRho).toBeLessThan(0);
    expect(calc.criticalityState).toBe("subcritical");
    expect(calc.description).toContain("Subcritical");
  });

  it("calculates supercritical state with withdrawn rods and zero boron", () => {
    const calc = calculateEffectiveMultiplication({
      enrichmentPercent: 5.0,
      moderatorDensity: 1.0,
      controlRodInsertionPercent: 0, // withdrawn
      boronConcentrationPpm: 0,
    });

    expect(calc.keff).toBeGreaterThan(1.002);
    expect(calc.reactivityRho).toBeGreaterThan(0);
    expect(["supercritical", "prompt-critical"]).toContain(
      calc.criticalityState,
    );
  });

  it("demonstrates negative moderator void coefficient (loss of moderator drops k_eff)", () => {
    const withWater = calculateEffectiveMultiplication({
      enrichmentPercent: 4.5,
      moderatorDensity: 1.0,
      controlRodInsertionPercent: 30,
      boronConcentrationPpm: 400,
    });

    const voidedCore = calculateEffectiveMultiplication({
      enrichmentPercent: 4.5,
      moderatorDensity: 0.05, // voided / dry core
      controlRodInsertionPercent: 30,
      boronConcentrationPpm: 400,
    });

    // In a light-water reactor, voiding reduces moderation and thermal fission cross section
    expect(voidedCore.keff).toBeLessThan(withWater.keff);
    expect(voidedCore.criticalityState).toBe("subcritical");
  });

  it("steps point kinetics and computes fissions and energy release", () => {
    const result = stepNeutronKinetics(1000, 500, 1.0, 0.1);
    expect(result.nextNeutrons).toBeGreaterThanOrEqual(0);
    expect(result.fissionsInStep).toBeGreaterThan(0);
    expect(result.energyReleasedJoules).toBeGreaterThan(0);
  });
});
