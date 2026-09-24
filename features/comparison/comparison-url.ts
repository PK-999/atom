import { z } from "zod";

import { METRICS } from "@/lib/evidence/metrics";

import type {
  ComparisonState,
  ComplexityLevel,
  DisplayMode,
  UnitMode,
} from "./comparison-types";

const DISPLAY_MODES = ["typical", "range", "raw"] as const;
const UNIT_MODES = ["scientific", "human"] as const;
const COMPLEXITY_LEVELS = [
  "beginner",
  "explorer",
  "curious",
  "deep-dive",
  "geeky",
] as const;

export const COMPARISON_TECHNOLOGY_IDS = [
  "nuclear",
  "solar",
  "wind",
  "gas",
  "coal",
  "hydro",
  "storage",
  "biomass",
  "geothermal",
] as const;

export const COMPARISON_REGION_IDS = ["global", "india"] as const;

const MAX_SOURCE_COUNT = 32;
const MAX_IDENTIFIER_LENGTH = 64;

export const ComparisonUrlSchema = z
  .object({
    sources: z
      .array(z.string().min(1).max(MAX_IDENTIFIER_LENGTH))
      .max(MAX_SOURCE_COUNT),
    metric: z.string().min(1).max(MAX_IDENTIFIER_LENGTH),
    region: z.string().min(1).max(MAX_IDENTIFIER_LENGTH),
    mode: z.enum(DISPLAY_MODES),
    units: z.enum(UNIT_MODES),
    level: z.enum(COMPLEXITY_LEVELS),
  })
  .strict();

export type ComparisonUrlState = ComparisonState;

export const DEFAULT_COMPARISON_STATE: ComparisonUrlState = {
  sources: ["nuclear", "solar", "wind", "gas", "coal"],
  metric: "lifecycle-ghg",
  region: "global",
  mode: "typical",
  units: "scientific",
  level: "curious",
};

export interface ComparisonPreferences {
  readonly level?: ComplexityLevel;
}

export interface ComparisonUrlCatalog {
  readonly technologyIds: readonly string[];
  readonly metricIds: readonly string[];
  readonly regionIds: readonly string[];
}

export type ComparisonUrlWarningCode =
  "identifier-too-long" | "too-many-sources" | "unavailable-identifier";

export interface ComparisonUrlWarning {
  readonly code: ComparisonUrlWarningCode;
  readonly parameter: "sources" | "metric" | "region";
  readonly message: string;
}

export interface ComparisonUrlParseOptions {
  readonly catalog?: ComparisonUrlCatalog;
  readonly onWarning?: (warning: ComparisonUrlWarning) => void;
}

type ComparisonSearchParams =
  | Readonly<Pick<URLSearchParams, "get">>
  | Record<string, string | string[] | undefined>;

const DEFAULT_CATALOG: ComparisonUrlCatalog = {
  technologyIds: COMPARISON_TECHNOLOGY_IDS,
  metricIds: METRICS.map((metric) => metric.id),
  regionIds: COMPARISON_REGION_IDS,
};

function emitDefaultWarning(warning: ComparisonUrlWarning) {
  console.warn(`[ATOM comparison URL] ${warning.message}`);
}

function firstValue(
  searchParams: ComparisonSearchParams,
  key: keyof ComparisonState,
): string | null {
  if ("get" in searchParams && typeof searchParams.get === "function") {
    return searchParams.get(key);
  }

  const value = (searchParams as Record<string, string | string[] | undefined>)[
    key
  ];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function parseEnum<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (raw === null) return fallback;
  const value = raw.trim();
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function parseCatalogIdentifier(
  raw: string | null,
  parameter: "metric" | "region",
  allowed: ReadonlySet<string>,
  fallback: string,
  onWarning: (warning: ComparisonUrlWarning) => void,
): string {
  if (raw === null) return fallback;
  const value = raw.trim();
  if (value.length > MAX_IDENTIFIER_LENGTH) {
    onWarning({
      code: "identifier-too-long",
      parameter,
      message: `${parameter} exceeds ${MAX_IDENTIFIER_LENGTH} characters and was ignored.`,
    });
    return fallback;
  }

  const canonicalValue =
    parameter === "metric" && value === "lifecycle-emissions"
      ? "lifecycle-ghg"
      : value;
  if (!canonicalValue) return fallback;
  if (!allowed.has(canonicalValue))
    onWarning({
      code: "unavailable-identifier",
      parameter,
      message: `The requested ${parameter} “${canonicalValue}” is not in the current catalog. No alternative has been substituted.`,
    });
  return canonicalValue;
}

function parseSources(
  raw: string | null,
  technologyIds: ReadonlySet<string>,
  onWarning: (warning: ComparisonUrlWarning) => void,
): string[] {
  if (raw === null) return [...DEFAULT_COMPARISON_STATE.sources];
  if (raw.trim() === "") return [];

  const sources: string[] = [];
  const seen = new Set<string>();
  let countWarningEmitted = false;

  for (const token of raw.split(",")) {
    const sourceId = token.trim();
    if (!sourceId || seen.has(sourceId)) continue;
    seen.add(sourceId);

    if (sourceId.length > MAX_IDENTIFIER_LENGTH) {
      onWarning({
        code: "identifier-too-long",
        parameter: "sources",
        message: `A source identifier exceeds ${MAX_IDENTIFIER_LENGTH} characters and was ignored.`,
      });
      continue;
    }
    if (!technologyIds.has(sourceId))
      onWarning({
        code: "unavailable-identifier",
        parameter: "sources",
        message: `The requested technology “${sourceId}” is not in the current catalog.`,
      });

    if (sources.length === MAX_SOURCE_COUNT) {
      if (!countWarningEmitted) {
        onWarning({
          code: "too-many-sources",
          parameter: "sources",
          message: `Only the first ${MAX_SOURCE_COUNT} valid source identifiers were kept.`,
        });
        countWarningEmitted = true;
      }
      continue;
    }
    sources.push(sourceId);
  }

  return sources;
}

const LEGACY_COMPLEXITY_MAP: Record<string, ComplexityLevel> = {
  kid: "beginner",
  simple: "explorer",
  technical: "deep-dive",
  expert: "geeky",
};

function parseComplexityLevelParam(
  raw: string | null,
  fallback: ComplexityLevel,
): ComplexityLevel {
  if (raw === null) return fallback;
  const value = raw.trim();
  if (COMPLEXITY_LEVELS.includes(value as ComplexityLevel)) {
    return value as ComplexityLevel;
  }
  if (value in LEGACY_COMPLEXITY_MAP) {
    return LEGACY_COMPLEXITY_MAP[value]!;
  }
  return fallback;
}

export function parseComparisonState(
  searchParams: ComparisonSearchParams,
  preferences?: ComparisonPreferences,
  options: ComparisonUrlParseOptions = {},
): ComparisonState {
  const catalog = options.catalog ?? DEFAULT_CATALOG;
  const onWarning = options.onWarning ?? emitDefaultWarning;
  const preferredLevel = parseComplexityLevelParam(
    preferences?.level ?? null,
    DEFAULT_COMPARISON_STATE.level,
  );

  return ComparisonUrlSchema.parse({
    sources: parseSources(
      firstValue(searchParams, "sources"),
      new Set(catalog.technologyIds),
      onWarning,
    ),
    metric: parseCatalogIdentifier(
      firstValue(searchParams, "metric"),
      "metric",
      new Set(catalog.metricIds),
      DEFAULT_COMPARISON_STATE.metric,
      onWarning,
    ),
    region: parseCatalogIdentifier(
      firstValue(searchParams, "region"),
      "region",
      new Set(catalog.regionIds),
      DEFAULT_COMPARISON_STATE.region,
      onWarning,
    ),
    mode: parseEnum(
      firstValue(searchParams, "mode"),
      DISPLAY_MODES,
      DEFAULT_COMPARISON_STATE.mode,
    ) as DisplayMode,
    units: parseEnum(
      firstValue(searchParams, "units"),
      UNIT_MODES,
      DEFAULT_COMPARISON_STATE.units,
    ) as UnitMode,
    level: parseComplexityLevelParam(
      firstValue(searchParams, "level"),
      preferredLevel,
    ),
  });
}

/**
 * @deprecated Use `parseComparisonState` instead.
 */
export function parseComparisonUrl(
  searchParams: ComparisonSearchParams,
  preferences?: ComparisonPreferences,
  options?: ComparisonUrlParseOptions,
): ComparisonUrlState {
  return parseComparisonState(searchParams, preferences, options);
}

export function serializeComparisonState(
  state: ComparisonState,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("sources", state.sources.join(","));
  params.set(
    "metric",
    state.metric === "lifecycle-emissions" ? "lifecycle-ghg" : state.metric,
  );
  params.set("region", state.region);
  params.set("mode", state.mode);
  params.set("units", state.units);
  params.set("level", state.level);
  return params;
}

/**
 * @deprecated Use `serializeComparisonState` instead.
 */
export function serializeComparisonUrl(
  state: ComparisonUrlState,
): URLSearchParams {
  return serializeComparisonState(state);
}
