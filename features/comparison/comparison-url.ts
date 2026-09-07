import { z } from "zod";

// We define the core schema for URL state
export const ComparisonUrlSchema = z.object({
  sources: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string())),
  metric: z.string(),
  region: z.string().default("global"),
  mode: z.enum(["typical", "range", "raw"]).default("typical"),
  units: z.enum(["scientific", "human"]).default("scientific"),
  level: z
    .enum(["kid", "simple", "curious", "technical", "expert"])
    .default("curious"),
});

export type ComparisonUrlState = z.infer<typeof ComparisonUrlSchema>;

export const DEFAULT_COMPARISON_STATE: ComparisonUrlState = {
  sources: ["nuclear", "solar", "wind", "gas", "coal"],
  metric: "lifecycle-ghg",
  region: "global",
  mode: "typical",
  units: "scientific",
  level: "curious",
};

export function parseComparisonUrl(
  searchParams:
    Readonly<URLSearchParams> | Record<string, string | string[] | undefined>,
): ComparisonUrlState {
  const params: Record<string, unknown> = {};

  if (searchParams instanceof URLSearchParams) {
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  } else {
    // Flatten arrays if multiple values are somehow passed for the same key
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        params[key] = value[0];
      } else {
        params[key] = value;
      }
    }
  }

  // Inject defaults where absent
  const rawParams = {
    sources: params.sources ?? DEFAULT_COMPARISON_STATE.sources.join(","),
    metric: params.metric ?? DEFAULT_COMPARISON_STATE.metric,
    region: params.region ?? DEFAULT_COMPARISON_STATE.region,
    mode: params.mode ?? DEFAULT_COMPARISON_STATE.mode,
    units: params.units ?? DEFAULT_COMPARISON_STATE.units,
    level: params.level ?? DEFAULT_COMPARISON_STATE.level,
  };

  const parsed = ComparisonUrlSchema.safeParse(rawParams);

  if (parsed.success) {
    return parsed.data;
  }

  // If validation fails (e.g. invalid enums), gracefully fallback to defaults
  // for the failed fields, while keeping the successful ones.
  const errorPaths = !parsed.success
    ? (
        (parsed as unknown as { error: { errors: { path: string[] }[] } }).error
          .errors || []
      )
        .map((e: { path: string[] }) => e.path)
        .flat()
    : [];

  const partial = Object.fromEntries(
    Object.entries(rawParams).filter(([key]) => {
      // Very basic fallback logic for individual field failure
      return !errorPaths.includes(key);
    }),
  );

  return {
    ...DEFAULT_COMPARISON_STATE,
    ...partial,
  };
}

export function serializeComparisonUrl(
  state: ComparisonUrlState,
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.sources.length > 0) {
    params.set("sources", state.sources.join(","));
  }
  if (state.metric) params.set("metric", state.metric);
  if (state.region !== "global") params.set("region", state.region);
  if (state.mode !== "typical") params.set("mode", state.mode);
  if (state.units !== "scientific") params.set("units", state.units);
  if (state.level !== "curious") params.set("level", state.level);

  return params;
}
