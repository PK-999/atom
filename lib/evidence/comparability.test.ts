import { describe, expect, it } from "vitest";

import type { NumericObservation } from "./schemas";
import { assessComparability } from "./comparability";

const base = {
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
  methodology: "Shared synthetic method.",
  metricId: "fixture-power",
  period: { endYear: 2025, startYear: 2020 },
  publicationStatus: "published" as const,
  rawAccess: "permitted" as const,
  representativeKind: "source-observation" as const,
  sourceId: "fixture-source",
  studyId: "fixture-study",
  systemBoundary: "Shared synthetic boundary.",
  technologyId: "fixture-technology",
  transformation: [
    {
      description: "No transformation applied.",
      kind: "identity" as const,
    },
  ],
  uncertainty: "Synthetic uncertainty note.",
  unit: "MW",
  value: 1,
  valueSemantics: "point" as const,
};

function observation(
  id: string,
  overrides: Partial<NumericObservation> = {},
): NumericObservation {
  return { ...base, id, ...overrides } as NumericObservation;
}

describe("comparability assessment", () => {
  it("does not call empty or singleton evidence comparable", () => {
    expect(assessComparability([])).toMatchObject({
      comparable: false,
      issues: [{ code: "insufficient-observations", severity: "blocker" }],
    });
    expect(assessComparability([observation("fixture-only")])).toMatchObject({
      comparable: false,
      issues: [{ code: "insufficient-observations", severity: "blocker" }],
    });
  });

  it("accepts identical comparison contracts", () => {
    expect(
      assessComparability([
        observation("fixture-one"),
        observation("fixture-two"),
      ]),
    ).toEqual({ comparable: true, issues: [] });
  });

  it("warns when units need conversion", () => {
    expect(
      assessComparability([
        observation("fixture-mw"),
        observation("fixture-gw", { unit: "GW" }),
      ]),
    ).toMatchObject({
      comparable: true,
      issues: [{ code: "convertible-units", severity: "warning" }],
    });
  });

  it.each([
    [
      "incompatible physical dimensions",
      { unit: "MWh" },
      "incompatible-unit-dimensions",
    ],
    ["different metrics", { metricId: "fixture-energy" }, "metric-mismatch"],
    [
      "different geography",
      { geographyId: "fixture-country", geographyScope: "country" },
      "geography-mismatch",
    ],
    [
      "different methodology",
      { methodology: "Different synthetic method." },
      "methodology-mismatch",
    ],
    [
      "different system boundary",
      { systemBoundary: "Different synthetic boundary." },
      "system-boundary-mismatch",
    ],
  ] as const)("blocks %s", (_label, overrides, code) => {
    expect(
      assessComparability([
        observation("fixture-one"),
        observation("fixture-two", overrides),
      ]),
    ).toMatchObject({
      comparable: false,
      issues: [{ code, severity: "blocker" }],
    });
  });

  it("allows different geography identifiers only when every record is explicitly global", () => {
    expect(
      assessComparability([
        observation("fixture-world", { geographyId: "fixture-world" }),
        observation("fixture-global", { geographyId: "fixture-global" }),
      ]),
    ).toEqual({ comparable: true, issues: [] });
  });

  it("warns when periods differ, including non-overlapping periods", () => {
    expect(
      assessComparability([
        observation("fixture-old", {
          period: { endYear: 2010, startYear: 2000 },
        }),
        observation("fixture-new", {
          period: { endYear: 2025, startYear: 2020 },
        }),
      ]),
    ).toMatchObject({
      comparable: true,
      issues: [{ code: "period-mismatch", severity: "warning" }],
    });
  });

  it("returns issues in a stable editorial order", () => {
    const result = assessComparability([
      observation("fixture-one"),
      observation("fixture-two", {
        geographyId: "fixture-country",
        geographyScope: "country",
        methodology: "Different synthetic method.",
        metricId: "fixture-energy",
        period: { endYear: 2010, startYear: 2000 },
        systemBoundary: "Different synthetic boundary.",
        unit: "MWh",
      }),
    ]);

    expect(result.issues.map(({ code }) => code)).toEqual([
      "metric-mismatch",
      "incompatible-unit-dimensions",
      "geography-mismatch",
      "period-mismatch",
      "methodology-mismatch",
      "system-boundary-mismatch",
    ]);
  });
});
