import { describe, expect, it } from "vitest";

import type { NumericObservation, Observation } from "./schemas";
import { selectRepresentative } from "./representative";

const common = {
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
  methodology: "Synthetic representative-selection method.",
  metricId: "fixture-power",
  period: { endYear: 2025, startYear: 2020 },
  publicationStatus: "published" as const,
  rawAccess: "permitted" as const,
  sourceId: "fixture-source",
  studyId: "fixture-study",
  systemBoundary: "Synthetic representative-selection boundary.",
  technologyId: "fixture-technology",
  transformation: {
    description: "No transformation applied.",
    kind: "identity" as const,
  },
  uncertainty: "Synthetic uncertainty note.",
  valueSemantics: "point" as const,
};

function numeric(
  id: string,
  value: number,
  options: Partial<NumericObservation> = {},
): NumericObservation {
  return {
    ...common,
    id,
    representativeKind: "source-observation",
    unit: "MW",
    value,
    ...options,
  } as NumericObservation;
}

describe("representative selection", () => {
  it("computes hand-derived means and odd/even medians", () => {
    const odd = [
      numeric("fixture-one", 1),
      numeric("fixture-two", 9),
      numeric("fixture-three", 5),
    ];
    const even = [...odd, numeric("fixture-four", 13)];

    expect(selectRepresentative(odd, "mean")).toMatchObject({
      ok: true,
      rule: "mean",
      unit: "MW",
      value: 5,
    });
    expect(selectRepresentative(odd, "median")).toMatchObject({
      ok: true,
      value: 5,
    });
    expect(selectRepresentative(even, "median")).toMatchObject({
      ok: true,
      value: 7,
    });
  });

  it("normalizes convertible units before aggregation", () => {
    const result = selectRepresentative(
      [numeric("fixture-gw", 1, { unit: "GW" }), numeric("fixture-mw", 500)],
      "mean",
    );

    expect(result).toMatchObject({ ok: true, unit: "GW", value: 0.75 });
  });

  it.each([
    ["central-estimate", "central-estimate"],
    ["regulator-value", "regulator-value"],
    ["model-default", "model-default"],
  ] as const)("selects %s only from explicit metadata", (rule, kind) => {
    const selected = numeric("fixture-selected", 8, {
      representativeKind: kind,
    });
    const result = selectRepresentative(
      [numeric("fixture-other", 2), selected],
      rule,
    );

    expect(result).toEqual({
      observationIds: ["fixture-selected"],
      ok: true,
      rule,
      unit: "MW",
      value: 8,
    });
  });

  it("uses a range's explicit representative without mutating observations", () => {
    const range = {
      ...common,
      id: "fixture-range",
      range: {
        kind: "min-max" as const,
        lower: 4,
        representative: 6,
        upper: 10,
      },
      representativeKind: "median" as const,
      unit: "MW",
      valueSemantics: "range" as const,
    } satisfies NumericObservation;
    const before = structuredClone(range);

    expect(selectRepresentative([range], "median")).toMatchObject({
      ok: true,
      value: 6,
    });
    expect(range).toEqual(before);
  });

  it.each([
    [[], "empty-input"],
    [
      [
        numeric("fixture-a", 1),
        numeric("fixture-b", 2, { metricId: "other-metric" }),
      ],
      "mixed-metrics",
    ],
    [
      [numeric("fixture-a", 1), numeric("fixture-b", 2, { unit: "MWh" })],
      "incompatible-units",
    ],
  ] as const)("returns %s as a typed error", (observations, code) => {
    expect(selectRepresentative(observations, "mean")).toMatchObject({
      code,
      ok: false,
    });
  });

  it("rejects categorical records and absent explicit representative kinds", () => {
    const categorical = {
      ...common,
      categoryDefinition: "Synthetic category.",
      id: "fixture-category",
      kind: "categorical" as const,
      representativeKind: "source-observation" as const,
      value: "dispatchable",
      valueSemantics: "categorical" as const,
    } as Observation;

    expect(selectRepresentative([categorical], "mean")).toMatchObject({
      code: "non-numeric",
      ok: false,
    });
    expect(
      selectRepresentative([numeric("fixture-only", 1)], "regulator-value"),
    ).toMatchObject({ code: "missing-representative", ok: false });
  });
});
