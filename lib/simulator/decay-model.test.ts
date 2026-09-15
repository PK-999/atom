import { describe, expect, it } from "vitest";
import {
  RADIOISOTOPES,
  calculateRemainingFraction,
  generateDecayCurve,
  simulateDiscreteDecay,
} from "./decay-model";

describe("decay-model", () => {
  it("contains verified radioisotopes with genuine physical half-lives", () => {
    expect(RADIOISOTOPES["I-131"].halfLifeDisplay).toBe("8.02 days");
    expect(RADIOISOTOPES["Co-60"].halfLifeDisplay).toBe("5.27 years");
    expect(RADIOISOTOPES["Cs-137"].halfLifeDisplay).toBe("30.08 years");
    expect(RADIOISOTOPES["Sr-90"].halfLifeDisplay).toBe("28.90 years");
    expect(RADIOISOTOPES["C-14"].halfLifeDisplay).toBe("5,730 years");
    expect(RADIOISOTOPES["U-235"].halfLifeDisplay).toBe("704 million years");
    expect(RADIOISOTOPES["Ra-226"].halfLifeDisplay).toBe("1,600 years");
    expect(RADIOISOTOPES["Rn-222"].halfLifeDisplay).toBe("3.82 days");
  });

  it("calculates exact mathematical half-life fractions", () => {
    expect(calculateRemainingFraction(0)).toBe(1.0);
    expect(calculateRemainingFraction(1)).toBe(0.5);
    expect(calculateRemainingFraction(2)).toBe(0.25);
    expect(calculateRemainingFraction(3)).toBe(0.125);
    expect(calculateRemainingFraction(4)).toBe(0.0625);
  });

  it("generates an exponential decay curve with accurate timestamps and nuclei counts", () => {
    const curve = generateDecayCurve("Cs-137", 1000, 5, 2);
    expect(curve.length).toBe(11); // 0, 0.5, 1.0, ..., 5.0

    const t0 = curve[0];
    expect(t0.halfLives).toBe(0);
    expect(t0.remainingNuclei).toBe(1000);
    expect(t0.decayedNuclei).toBe(0);

    const t1 = curve.find((p) => p.halfLives === 1);
    expect(t1).toBeDefined();
    expect(t1?.fractionRemaining).toBe(0.5);
    expect(t1?.remainingNuclei).toBe(500);
    expect(t1?.decayedNuclei).toBe(500);

    const t2 = curve.find((p) => p.halfLives === 2);
    expect(t2?.fractionRemaining).toBe(0.25);
    expect(t2?.remainingNuclei).toBe(250);
  });

  it("simulates discrete decay without negative counts", () => {
    const step = simulateDiscreteDecay(100, 1.0);
    expect(step.updatedRemaining).toBeGreaterThanOrEqual(0);
    expect(step.updatedRemaining).toBeLessThanOrEqual(100);
    expect(step.newlyDecayed + step.updatedRemaining).toBe(100);
  });
});
