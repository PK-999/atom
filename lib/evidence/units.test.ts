import { describe, expect, it } from "vitest";

import type { NumericObservation } from "./schemas";
import {
  calculateHumanEquivalent,
  canConvertUnit,
  convertUnit,
  normalizeObservation,
} from "./units";

const commonObservation = {
  datasetId: "fixture-dataset",
  geographyId: "fixture-global",
  geographyScope: "global" as const,
  kind: "numeric" as const,
  lastVerifiedAt: "2026-08-30",
  license: {
    id: "fixture-license",
    name: "Synthetic fixture license",
    redistribution: "allowed" as const,
  },
  methodology: "Synthetic method for conversion tests.",
  metricId: "fixture-power",
  period: { endYear: 2025, startYear: 2020 },
  publicationStatus: "published" as const,
  rawAccess: "permitted" as const,
  representativeKind: "source-observation" as const,
  sourceId: "fixture-source",
  studyId: "fixture-study",
  systemBoundary: "Synthetic conversion test boundary.",
  technologyId: "fixture-technology",
  transformation: [
    {
      description: "No transformation applied.",
      kind: "identity" as const,
    },
  ],
  uncertainty: "Synthetic uncertainty note.",
};

describe("unit conversion", () => {
  it.each([
    [1, "gCO2e/kWh", "kgCO2e/MWh", 1],
    [1, "GW", "MW", 1_000],
    [1, "GWh", "MWh", 1_000],
    [1, "years", "days", 365.25],
    [25, "%", "ratio", 0.25],
    [17, "MW", "MW", 17],
  ])("converts %s %s to %s", (value, from, to, expected) => {
    expect(convertUnit(value, from, to)).toBeCloseTo(expected);
  });

  it("reports compatibility without performing a conversion", () => {
    expect(canConvertUnit("MW", "GW")).toBe(true);
    expect(canConvertUnit("MW", "MWh")).toBe(false);
    expect(canConvertUnit("not-a-unit", "MW")).toBe(false);
  });

  it.each([
    [1, "MW", "MWh"],
    [1, "not-a-unit", "MW"],
    [Number.POSITIVE_INFINITY, "MW", "GW"],
  ])("rejects invalid conversion input", (value, from, to) => {
    expect(() => convertUnit(value, from, to)).toThrow();
  });

  it("normalizes point and range observations without mutating the source", () => {
    const point = {
      ...commonObservation,
      id: "fixture-point",
      unit: "GW",
      value: 1.5,
      valueSemantics: "point" as const,
    } satisfies NumericObservation;
    const range = {
      ...commonObservation,
      id: "fixture-range",
      range: {
        kind: "min-max" as const,
        lower: 1,
        representative: 2,
        upper: 3,
      },
      representativeKind: "median" as const,
      unit: "GW",
      valueSemantics: "range" as const,
    } satisfies NumericObservation;

    expect(normalizeObservation(point, "MW")).toMatchObject({
      transformation: [{ kind: "identity" }, { kind: "unit-conversion" }],
      unit: "MW",
      value: 1_500,
    });
    expect(normalizeObservation(range, "MW")).toMatchObject({
      range: { lower: 1_000, representative: 2_000, upper: 3_000 },
      unit: "MW",
    });
    expect(point.unit).toBe("GW");
    expect(range.range.upper).toBe(3);
    expect(normalizeObservation(point, "GW").transformation).toEqual(
      point.transformation,
    );
  });

  it("preserves transformation lineage and deep-clones normalized evidence", () => {
    const derived = {
      ...commonObservation,
      id: "fixture-derived",
      transformation: [
        {
          description: "Synthetic derived calculation.",
          kind: "derived" as const,
        },
      ],
      unit: "GW",
      value: 2,
      valueSemantics: "point" as const,
    } satisfies NumericObservation;

    const normalized = normalizeObservation(derived, "MW");
    expect(normalized.transformation.map(({ kind }) => kind)).toEqual([
      "derived",
      "unit-conversion",
    ]);
    expect(normalized.period).not.toBe(derived.period);
    expect(normalized.license).not.toBe(derived.license);
    expect(Object.isFrozen(normalized)).toBe(true);
    expect(Object.isFrozen(normalized.period)).toBe(true);
  });
});

describe("human equivalents", () => {
  it("retains the scientific value and the exact caller-supplied assumption", () => {
    const assumption = {
      label: "average-length month",
      quantityPerEquivalent: 30.4375,
      sourceNote: "Caller supplied calendar averaging assumption.",
      unit: "days",
    };

    expect(
      calculateHumanEquivalent({
        assumption,
        scientific: { unit: "years", value: 1 },
      }),
    ).toEqual({
      assumption,
      equivalents: 12,
      scientific: { unit: "years", value: 1 },
    });
  });

  it("rejects incompatible or non-positive assumptions", () => {
    expect(() =>
      calculateHumanEquivalent({
        assumption: {
          label: "energy example",
          quantityPerEquivalent: 1,
          sourceNote: "Synthetic test assumption.",
          unit: "MWh",
        },
        scientific: { unit: "MW", value: 1 },
      }),
    ).toThrow();
    expect(() =>
      calculateHumanEquivalent({
        assumption: {
          label: "invalid example",
          quantityPerEquivalent: 0,
          sourceNote: "Synthetic test assumption.",
          unit: "days",
        },
        scientific: { unit: "days", value: 1 },
      }),
    ).toThrow();
  });
});
