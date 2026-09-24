import { describe, expect, it } from "vitest";
import {
  toMicroSieverts,
  fromMicroSieverts,
  formatDose,
  canConvertQuantities,
  calculateLogPosition,
  getRadiationScenarios,
  getScenarioById,
  SV_TO_MICROSV,
  SV_TO_MILLISV,
  MILLISV_TO_MICROSV,
} from "./radiation-model";

describe("Radiation Domain Model (R13)", () => {
  it("converts units with exact known scientific factors", () => {
    // 1 Sv = 1,000 mSv = 1,000,000 µSv
    expect(toMicroSieverts(1, "Sv")).toBe(1_000_000);
    expect(toMicroSieverts(1, "mSv")).toBe(1_000);
    expect(toMicroSieverts(1, "µSv")).toBe(1);
    expect(toMicroSieverts(1, "uSv")).toBe(1);

    expect(fromMicroSieverts(1_000_000, "Sv")).toBe(1);
    expect(fromMicroSieverts(1_000, "mSv")).toBe(1);
    expect(fromMicroSieverts(50, "µSv")).toBe(50);

    expect(SV_TO_MILLISV).toBe(1_000);
    expect(MILLISV_TO_MICROSV).toBe(1_000);
    expect(SV_TO_MICROSV).toBe(1_000_000);
  });

  it("rejects negative, non-finite, and incompatible inputs", () => {
    expect(() => toMicroSieverts(-1, "mSv")).toThrow();
    expect(() => toMicroSieverts(NaN, "mSv")).toThrow();
    expect(() => toMicroSieverts(Infinity, "mSv")).toThrow();

    // @ts-expect-error - testing runtime type rejection for invalid unit
    expect(() => toMicroSieverts(10, "Gy")).toThrow();
  });

  it("enforces distinct physical quantities without unauthorized automatic conversions", () => {
    // Absorbed dose (Gy) cannot convert to Effective dose (Sv) without radiation and tissue weighting
    expect(canConvertQuantities("absorbed-dose", "effective-dose")).toBe(false);
    expect(canConvertQuantities("activity", "effective-dose")).toBe(false);
    expect(canConvertQuantities("equivalent-dose", "effective-dose")).toBe(
      false,
    );
    expect(canConvertQuantities("effective-dose", "effective-dose")).toBe(true);
  });

  it("prevents log(0) and returns dedicated zero display", () => {
    // Zero dose must return dedicated position 0, never -Infinity or NaN
    const zeroPos = calculateLogPosition(0);
    expect(zeroPos).toBe(0);
    expect(Number.isFinite(zeroPos)).toBe(true);

    const negPos = calculateLogPosition(-10);
    expect(negPos).toBe(0);

    // Formatted zero
    const formattedZero = formatDose(0);
    expect(formattedZero.bestFormatted).toBe("0 µSv");
  });

  it("calculates accurate logarithmic scale positions", () => {
    const p1 = calculateLogPosition(0.1, 0.1, 10_000_000);
    expect(p1).toBeCloseTo(0, 1);

    const pMax = calculateLogPosition(10_000_000, 0.1, 10_000_000);
    expect(pMax).toBeCloseTo(100, 1);

    // Midpoint: 1,000 µSv is 4 orders of magnitude above 0.1 out of 8 total orders of magnitude (10^7 / 10^-1 = 10^8) -> 50%
    const pMid = calculateLogPosition(1_000, 0.1, 10_000_000);
    expect(pMid).toBeCloseTo(50, 1);
  });

  it("formats doses with sensible readability", () => {
    expect(formatDose(0.1).bestFormatted).toBe("0.1 µSv");
    expect(formatDose(100).bestFormatted).toBe("100 µSv");
    expect(formatDose(2_400).bestFormatted).toBe("2.4 mSv");
    expect(formatDose(1_000_000).bestFormatted).toBe("1 Sv");
    expect(formatDose(4_000_000).bestFormatted).toBe("4 Sv");
  });

  it("loads and filters reviewed canonical scenarios", () => {
    const all = getRadiationScenarios();
    expect(all.length).toBe(10);

    const medical = getRadiationScenarios("medical");
    expect(medical.length).toBeGreaterThan(0);
    for (const m of medical) {
      expect(m.category).toBe("medical");
    }

    const chestXray = getScenarioById("chest-xray");
    expect(chestXray).not.toBeNull();
    expect(chestXray?.title).toBe("Standard Chest X-Ray");
    expect(chestXray?.doseMicroSv).toBe(100);
  });
});

it("does not present invalid dose as genuine zero", () => {
  expect(formatDose(Number.NaN).bestFormatted).toBe("Unavailable");
  expect(formatDose(-1).bestFormatted).toBe("Unavailable");
  expect(formatDose(0).bestFormatted).toBe("0 µSv");
});
