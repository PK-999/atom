import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_COMPARISON_STATE,
  ComparisonUrlSchema,
  parseComparisonState,
  parseComparisonUrl,
  serializeComparisonState,
  serializeComparisonUrl,
  type ComparisonUrlCatalog,
} from "./comparison-url";

describe("parseComparisonUrl", () => {
  it("repairs only the invalid field and preserves transformed fields", () => {
    const state = parseComparisonUrl(
      new URLSearchParams("sources=nuclear,wind&mode=invalid&level=expert"),
    );

    expect(state.sources).toEqual(["nuclear", "wind"]);
    expect(state.mode).toBe("typical");
    expect(state.level).toBe("geeky");
  });

  it("returns the complete useful default when every field is absent", () => {
    expect(parseComparisonState(new URLSearchParams())).toEqual(
      DEFAULT_COMPARISON_STATE,
    );
  });

  it.each([
    ["metric=unknown&region=india&mode=raw", "metric", "unknown"],
    ["region=unknown&mode=raw&level=expert", "region", "unknown"],
    ["mode=unknown&units=human&level=expert", "mode", "typical"],
    ["units=unknown&mode=range&level=expert", "units", "scientific"],
    ["level=unknown&mode=raw&units=human", "level", "curious"],
  ] as const)(
    "repairs an invalid %s independently for %s",
    (query, field, fallback) => {
      const state = parseComparisonState(new URLSearchParams(query));

      expect(state[field]).toBe(fallback);
      expect(state.mode).toBe(
        query.includes("mode=raw")
          ? "raw"
          : query.includes("mode=range")
            ? "range"
            : "typical",
      );
      expect(state.units).toBe(
        query.includes("units=human") ? "human" : "scientific",
      );
      expect(state.level).toBe(
        query.includes("level=expert") ? "geeky" : "curious",
      );
    },
  );

  it("trims, validates, and deduplicates sources while preserving first-seen order", () => {
    const state = parseComparisonState(
      new URLSearchParams(
        "sources=%20wind%20,nuclear,unknown,wind,%20solar%20",
      ),
    );

    expect(state.sources).toEqual(["wind", "nuclear", "unknown", "solar"]);
  });

  it("distinguishes omitted, explicitly empty, and all-invalid sources", () => {
    expect(parseComparisonState(new URLSearchParams()).sources).toEqual(
      DEFAULT_COMPARISON_STATE.sources,
    );
    expect(
      parseComparisonState(new URLSearchParams("sources=")).sources,
    ).toEqual([]);
    expect(
      parseComparisonState(new URLSearchParams("sources=unknown,also-unknown"))
        .sources,
    ).toEqual(["unknown", "also-unknown"]);
  });

  it("accepts one source and the full nine-technology catalog", () => {
    expect(
      parseComparisonState(new URLSearchParams("sources=hydro")).sources,
    ).toEqual(["hydro"]);
    expect(
      parseComparisonState(
        new URLSearchParams(
          "sources=nuclear,solar,wind,gas,coal,hydro,storage,biomass,geothermal",
        ),
      ).sources,
    ).toHaveLength(9);
  });

  it("accepts 32 known selections and truncates a 33rd with a warning", () => {
    const technologyIds = Array.from(
      { length: 33 },
      (_, index) => `fixture-${index + 1}`,
    );
    const catalog: ComparisonUrlCatalog = {
      technologyIds,
      metricIds: ["lifecycle-ghg"],
      regionIds: ["global"],
    };
    const warn = vi.fn();

    const thirtyTwo = parseComparisonState(
      new URLSearchParams(`sources=${technologyIds.slice(0, 32).join(",")}`),
      undefined,
      { catalog, onWarning: warn },
    );
    const thirtyThree = parseComparisonState(
      new URLSearchParams(`sources=${technologyIds.join(",")}`),
      undefined,
      { catalog, onWarning: warn },
    );

    expect(thirtyTwo.sources).toEqual(technologyIds.slice(0, 32));
    expect(thirtyThree.sources).toEqual(technologyIds.slice(0, 32));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "too-many-sources",
        parameter: "sources",
      }),
    );
  });

  it("accepts a 64-character identifier and warns on a 65-character one", () => {
    const accepted = "a".repeat(64);
    const rejected = "b".repeat(65);
    const warn = vi.fn();
    const catalog: ComparisonUrlCatalog = {
      technologyIds: [accepted, rejected],
      metricIds: ["lifecycle-ghg"],
      regionIds: ["global"],
    };

    expect(
      parseComparisonState(
        new URLSearchParams(`sources=${accepted},${rejected}`),
        undefined,
        { catalog, onWarning: warn },
      ).sources,
    ).toEqual([accepted]);
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "identifier-too-long",
        parameter: "sources",
      }),
    );
  });

  it("uses the first repeated value for URLSearchParams and record arrays", () => {
    const urlParams = new URLSearchParams();
    urlParams.append("sources", "wind,nuclear");
    urlParams.append("sources", "coal");
    urlParams.append("mode", "range");
    urlParams.append("mode", "raw");

    expect(parseComparisonState(urlParams)).toMatchObject({
      sources: ["wind", "nuclear"],
      mode: "range",
    });
    expect(
      parseComparisonState({
        sources: ["solar,hydro", "coal"],
        mode: ["raw", "typical"],
      }),
    ).toMatchObject({ sources: ["solar", "hydro"], mode: "raw" });
  });

  it("uses the first repeated scalar value for every URL field", () => {
    const params = new URLSearchParams();
    params.append("metric", "capacity-factor");
    params.append("metric", "land-use");
    params.append("region", "india");
    params.append("region", "unknown");
    params.append("units", "human");
    params.append("units", "scientific");
    params.append("level", "geeky");
    params.append("level", "beginner");

    expect(parseComparisonState(params)).toMatchObject({
      metric: "capacity-factor",
      region: "india",
      units: "human",
      level: "geeky",
    });
  });

  it("treats an empty first repeated source as explicitly empty", () => {
    expect(parseComparisonState({ sources: ["", "nuclear"] }).sources).toEqual(
      [],
    );
  });

  it("preserves unknown Unicode identifiers and bounds oversized input", () => {
    const warn = vi.fn();
    const oversized = "x".repeat(65);

    const state = parseComparisonState(
      new URLSearchParams(
        `sources=nuclear,%F0%9F%92%A5,${oversized}&metric=%E2%98%A2&region=${oversized}`,
      ),
      undefined,
      { onWarning: warn },
    );

    expect(state).toMatchObject({
      sources: ["nuclear", "💥"],
      metric: "☢",
      region: "global",
    });
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "identifier-too-long",
        parameter: "sources",
      }),
    );
  });

  it("canonicalizes the documented emissions alias and keeps known unreleased metrics", () => {
    expect(
      parseComparisonState(new URLSearchParams("metric=lifecycle-emissions"))
        .metric,
    ).toBe("lifecycle-ghg");
    expect(
      parseComparisonState(new URLSearchParams("metric=capacity-factor"))
        .metric,
    ).toBe("capacity-factor");
  });

  it("trims valid scalar fields", () => {
    const state = parseComparisonState({
      metric: " lifecycle-ghg ",
      region: " india ",
      mode: " range ",
      units: " human ",
      level: " technical ",
    });

    expect(state).toMatchObject({
      metric: "lifecycle-ghg",
      region: "india",
      mode: "range",
      units: "human",
      level: "deep-dive",
    });
  });

  it("applies URL level over a local preference, then preference over default", () => {
    expect(
      parseComparisonState(new URLSearchParams("level=expert"), {
        level: "explorer",
      }).level,
    ).toBe("geeky");
    expect(
      parseComparisonState(new URLSearchParams(), { level: "explorer" }).level,
    ).toBe("explorer");
    expect(parseComparisonState(new URLSearchParams()).level).toBe("curious");
  });

  it("does not let an invalid explicit URL level consume the preference fallback", () => {
    expect(
      parseComparisonState(new URLSearchParams("level=unknown"), {
        level: "explorer",
      }).level,
    ).toBe("explorer");
  });
});

describe("serializeComparisonState", () => {
  it("keeps the exported runtime state schema strict", () => {
    const result = ComparisonUrlSchema.safeParse({
      ...DEFAULT_COMPARISON_STATE,
      extra: "must not become comparison state",
    });

    expect(result.success).toBe(false);
  });

  it("always emits all six keys in deterministic contract order", () => {
    const params = serializeComparisonState({
      ...DEFAULT_COMPARISON_STATE,
      sources: [],
    });

    expect([...params.keys()]).toEqual([
      "sources",
      "metric",
      "region",
      "mode",
      "units",
      "level",
    ]);
    expect(params.toString()).toBe(
      "sources=&metric=lifecycle-ghg&region=global&mode=typical&units=scientific&level=curious",
    );
  });

  it("round-trips ordered canonical state", () => {
    const state = {
      sources: ["geothermal", "wind", "nuclear"],
      metric: "capacity-factor",
      region: "india",
      mode: "raw" as const,
      units: "human" as const,
      level: "geeky" as const,
    };

    expect(parseComparisonState(serializeComparisonState(state))).toEqual(
      state,
    );
  });

  it("retains legacy wrapper behavior through the canonical functions", () => {
    const parsed = parseComparisonUrl(
      new URLSearchParams("sources=wind&metric=lifecycle-emissions"),
    );

    expect(parsed).toEqual(
      parseComparisonState(serializeComparisonUrl(parsed)),
    );
    expect(parsed.metric).toBe("lifecycle-ghg");
  });
});
