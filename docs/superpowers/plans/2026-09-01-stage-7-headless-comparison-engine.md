# Stage 7 Headless Comparison Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the complete framework-independent Comparison Lab state, projection, formatting, provenance, and analytics API against the Stage 6 evidence repository.

**Architecture:** Pure TypeScript modules parse canonical URL state, update ordered technology selections, and compose Stage 5 scientific policies over an `EvidenceRepository`. `getComparisonResult` returns immutable typed outcomes that React can render without deciding scientific meaning.

**Tech Stack:** TypeScript 6.0.3, Zod 4.5.4, Vitest 4.1.11, Stage 5 evidence domain, Stage 6 repository adapters.

**Spec:** `docs/superpowers/specs/2026-09-01-stage-6-9-evidence-comparison-release-design.md`

## Global Constraints

- Do not import React, Next.js, browser globals, or UI components into domain modules.
- Preserve source observations and transformation history; return deeply frozen results.
- Canonical URL keys are `sources`, `metric`, `region`, `mode`, `units`, and `level`.
- Default state is Nuclear, Solar, Wind, Gas, Coal; lifecycle emissions; Global; Typical; Scientific; Curious.
- Invalid parameters fall back independently; one invalid parameter cannot erase another valid value.
- Typical, Range, and Raw are projections, never mutations of stored evidence.
- Raw mode is available only when the release and every returned observation permit redistribution.
- More than eight technologies remains a valid selection and forces table presentation.
- Zero and negative values are valid; extreme values and outliers are not clipped.
- Every numeric result retains its scientific value and unit when a human equivalent is added.

---

### Task 1: Define canonical comparison state and exhaustive URL parsing

**Files:**
- Create: `features/comparison/domain/state.ts`
- Create: `features/comparison/domain/state.test.ts`
- Create: `features/comparison/domain/types.ts`
- Modify: `features/comparison/comparison-types.ts`

**Interfaces:**
- Produces: `ComplexityLevel`, `DisplayMode`, `UnitMode`, `ComparisonView`, `ComparisonState`, `ComparisonPreferences`, `ComparisonSearchParams`, `DEFAULT_COMPARISON_STATE`, `parseComparisonState(searchParams, preferences?)`, and `serializeComparisonState(state)`.
- Consumes: `ComplexityLevelSchema` from Stage 5 and the existing preference contract.

- [ ] **Step 1: Write the failing default and round-trip tests**

```ts
it("returns the complete useful default", () => {
  expect(parseComparisonState(new URLSearchParams())).toEqual({
    complexityLevel: "curious",
    displayMode: "typical",
    geographyId: "global",
    metricId: "lifecycle-emissions",
    ordering: ["nuclear", "solar", "wind", "gas", "coal"],
    selectedTechnologyIds: ["nuclear", "solar", "wind", "gas", "coal"],
    unitMode: "scientific",
    view: "chart",
  });
});

it("round-trips ordered canonical state", () => {
  const encoded = serializeComparisonState(customState);
  expect(parseComparisonState(encoded)).toEqual(customState);
  expect([...encoded.keys()]).toEqual([
    "sources", "metric", "region", "mode", "units", "level",
  ]);
});
```

- [ ] **Step 2: Write the independent-fallback table test**

```ts
it.each([
  ["mode=invalid&region=india&level=expert", "typical", "india", "expert"],
  ["units=invalid&mode=raw&level=simple", "scientific", "raw", "simple"],
])("falls back only the invalid field for %s", (query, expectedUnitOrMode, expectedRegionOrMode, level) => {
  const state = parseComparisonState(new URLSearchParams(query));
  expect(state.complexityLevel).toBe(level);
  expect(Object.values(state)).toContain(expectedUnitOrMode);
  expect(Object.values(state)).toContain(expectedRegionOrMode);
});
```

- [ ] **Step 3: Run the state tests and verify failure**

Run: `npm test -- features/comparison/domain/state.test.ts`  
Expected: FAIL because the state module does not exist.

- [ ] **Step 4: Implement strict schemas and parser precedence**

```ts
export const ComparisonStateSchema = z.object({
  complexityLevel: ComplexityLevelSchema,
  displayMode: z.enum(["typical", "range", "raw"]),
  geographyId: IdentifierSchema,
  metricId: IdentifierSchema,
  ordering: z.array(IdentifierSchema).max(32).readonly(),
  selectedTechnologyIds: z.array(IdentifierSchema).min(1).max(32).readonly(),
  unitMode: z.enum(["scientific", "human"]),
  view: z.enum(["chart", "table"]),
}).strict().readonly();
```

Deduplicate `sources` while retaining first-seen order. Set `view` to `table`
when more than eight sources are selected. Preferences apply only when the URL
omits the corresponding key. Serialization omits `view` because it is derived
from source count or local presentation and emits no unknown keys.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- features/comparison/domain/state.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit URL state**

```bash
git add features/comparison/domain features/comparison/comparison-types.ts
git commit -m "feat: add canonical comparison state"
```

---

### Task 2: Implement ordered technology selection, filtering, and sorting

**Files:**
- Create: `features/comparison/domain/selection.ts`
- Test: `features/comparison/domain/selection.test.ts`

**Interfaces:**
- Produces: `addTechnology`, `removeTechnology`, `reorderTechnology`, `restoreDefaultTechnologies`, `filterTechnologies`, and `sortTechnologies`.
- Consumes: `ComparisonState` and repository `Technology` records.

- [ ] **Step 1: Write failing selection tests**

```ts
it("reorders without changing membership", () => {
  expect(reorderTechnology(["nuclear", "solar", "wind"], "wind", 0)).toEqual([
    "wind", "nuclear", "solar",
  ]);
});

it("does not add a duplicate technology", () => {
  expect(addTechnology(["nuclear", "solar"], "solar")).toEqual([
    "nuclear", "solar",
  ]);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- features/comparison/domain/selection.test.ts`  
Expected: FAIL with missing selection exports.

- [ ] **Step 3: Implement immutable selection helpers**

All helpers return new frozen arrays, preserve stable ordering for equal sort
keys, normalize search text with `toLocaleLowerCase("en")`, and reject an empty
selection. Sorting supports `selected-order`, `alphabetical`, and
`representative-value`; the last accepts a caller-provided value map and places
missing values last without inventing zero.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- features/comparison/domain/selection.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit selection behavior**

```bash
git add features/comparison/domain/selection.ts features/comparison/domain/selection.test.ts
git commit -m "feat: add comparison selection behavior"
```

---

### Task 3: Define comparison result, provenance, and limitation outcomes

**Files:**
- Create: `features/comparison/domain/result-types.ts`
- Create: `features/comparison/domain/result-schemas.ts`
- Test: `features/comparison/domain/result-schemas.test.ts`

**Interfaces:**
- Produces: `ComparisonQuery`, `ComparisonResult`, `ComparisonEntry`, `MissingDataResult`, `ProvenanceReference`, `ComparisonStatus`, and runtime Zod schemas.
- Consumes: Stage 5 observations, comparability issues, availability, metric, geography, and technology types.

- [ ] **Step 1: Write failing discriminated-union tests**

```ts
it("requires a reason for every missing technology", () => {
  expect(() => MissingDataResultSchema.parse({ technologyId: "solar" }))
    .toThrow();
});

it("rejects a complete result with missing entries", () => {
  expect(() => ComparisonResultSchema.parse({
    ...completeResult,
    missing: [{ technologyId: "coal", reason: "no-reviewed-observation" }],
  })).toThrow(/complete/i);
});
```

- [ ] **Step 2: Run schema tests and verify failure**

Run: `npm test -- features/comparison/domain/result-schemas.test.ts`  
Expected: FAIL because result schemas are missing.

- [ ] **Step 3: Implement explicit result states**

Use status values `complete`, `partial`, `empty`, `unavailable`, `stale`,
`restricted`, `disputed`, and `incompatible`. Each result includes canonical
query, metric, geography, selected technologies, entries, missing outcomes,
compatibility issues, narrative inputs, release version, and provenance.

`ComparisonEntry` is a union of:

```ts
type ComparisonEntryBase = {
  formattedValue: string;
  technologyId: string;
  technologyName: string;
};

type RepresentativeKind = Observation["representativeKind"];

type ComparisonEntry =
  | (ComparisonEntryBase & { kind: "point"; observationIds: readonly string[]; scientificValue: number; scientificUnit: string; representativeKind: RepresentativeKind })
  | (ComparisonEntryBase & { kind: "range"; observationIds: readonly string[]; lower: number; representative: number; upper: number; scientificUnit: string; rangeLabel: string })
  | (ComparisonEntryBase & { kind: "raw"; observations: readonly Observation[] })
  | (ComparisonEntryBase & { kind: "categorical"; observationIds: readonly string[]; value: string; definition: string });
```

- [ ] **Step 4: Run focused schema tests**

Run: `npm test -- features/comparison/domain/result-schemas.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit result contracts**

```bash
git add features/comparison/domain/result-types.ts features/comparison/domain/result-schemas.ts features/comparison/domain/result-schemas.test.ts
git commit -m "feat: define comparison result contracts"
```

---

### Task 4: Implement Typical, Range, and Raw projections

**Files:**
- Create: `features/comparison/domain/projection.ts`
- Test: `features/comparison/domain/projection.test.ts`
- Modify: `features/comparison/comparison-model.ts`
- Modify: `features/comparison/comparison-model.test.ts`

**Interfaces:**
- Produces: `projectTypical`, `projectRange`, `projectRaw`, and `projectObservations`.
- Consumes: `selectRepresentative`, `normalizeObservation`, availability modes, and immutable observations.

- [ ] **Step 1: Write failing mode and immutability tests**

```ts
it("does not manufacture a range from point observations", () => {
  expect(projectRange([pointObservation], metric)).toEqual({
    kind: "missing",
    reason: "range-not-reported",
  });
});

it("refuses Raw when redistribution is restricted", () => {
  expect(projectRaw([restrictedObservation], restrictedRelease)).toEqual({
    kind: "restricted",
    reason: "raw-redistribution-restricted",
  });
});

it("does not mutate source observations", () => {
  const before = structuredClone(rangeObservation);
  projectObservations([rangeObservation], query, metric, release);
  expect(rangeObservation).toEqual(before);
});
```

- [ ] **Step 2: Run projection tests and verify failure**

Run: `npm test -- features/comparison/domain/projection.test.ts features/comparison/comparison-model.test.ts`  
Expected: FAIL with missing projection functions.

- [ ] **Step 3: Implement ordered projection behavior**

Assess comparability before representative selection. Typical groups records by
technology and applies the metric rule. Range returns source-declared ranges
only. Raw returns cloned, frozen source records in stable source/period order.
Blocked comparability returns an incompatible result without ranking.

- [ ] **Step 4: Add explicit edge-case tests**

Cover zero, negative values, `Number.MAX_SAFE_INTEGER`, very small decimals,
outliers, min/max and interval ranges, categorical values, incompatible units,
period warnings, methodology blockers, and system-boundary blockers.

- [ ] **Step 5: Run focused projection tests**

Run: `npm test -- features/comparison/domain/projection.test.ts features/comparison/comparison-model.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit projections**

```bash
git add features/comparison/domain/projection.ts features/comparison/domain/projection.test.ts features/comparison/comparison-model.ts features/comparison/comparison-model.test.ts
git commit -m "feat: add comparison evidence projections"
```

---

### Task 5: Implement unit formatting and human-equivalent presentation data

**Files:**
- Create: `features/comparison/domain/format.ts`
- Create: `features/comparison/domain/human-equivalents.ts`
- Test: `features/comparison/domain/format.test.ts`
- Test: `features/comparison/domain/human-equivalents.test.ts`

**Interfaces:**
- Produces: `formatScientificValue`, `formatRange`, `HumanEquivalentRegistry`, and `attachHumanEquivalent(entry, assumption)`.
- Consumes: Stage 5 `createHumanEquivalent` and unit registry.

- [ ] **Step 1: Write failing formatting tests**

```ts
it.each([
  [0, "0"],
  [-0.25, "−0.25"],
  [12.3456, "12.35"],
  [0.0000123, "1.23 × 10⁻⁵"],
])("formats %d without losing sign or scale", (value, label) => {
  expect(formatScientificValue(value, { maximumSignificantDigits: 4 })).toBe(label);
});
```

- [ ] **Step 2: Run formatting tests and verify failure**

Run: `npm test -- features/comparison/domain/format.test.ts features/comparison/domain/human-equivalents.test.ts`  
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement locale-stable scientific formatting**

Use `Intl.NumberFormat("en", ...)` for normal magnitudes and a tested formatter
for scientific notation. Preserve the numeric scientific value separately from
its label. Never coerce negative zero into a misleading sign.

- [ ] **Step 4: Implement assumption-backed human equivalents**

Register equivalents by metric ID. Every assumption contains quantity, unit,
label, source note, and verification date. An absent registry entry returns no
analogy rather than a guessed one.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- features/comparison/domain/format.test.ts features/comparison/domain/human-equivalents.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit formatting and equivalents**

```bash
git add features/comparison/domain/format.ts features/comparison/domain/format.test.ts features/comparison/domain/human-equivalents.ts features/comparison/domain/human-equivalents.test.ts
git commit -m "feat: add comparison value presentation data"
```

---

### Task 6: Compose repository-backed `getComparisonResult`

**Files:**
- Create: `features/comparison/domain/get-comparison-result.ts`
- Test: `features/comparison/domain/get-comparison-result.test.ts`
- Test: `features/comparison/domain/get-comparison-result.integration.test.ts`
- Create: `features/comparison/domain/index.ts`

**Interfaces:**
- Produces: `getComparisonResult(query, repository): Promise<ComparisonResult>`.
- Consumes: Stage 6 `EvidenceRepository`, projection, formatting, state, and result schemas.

- [ ] **Step 1: Write a failing complete-result integration test**

```ts
it("returns ordered entries and complete provenance", async () => {
  const result = await getComparisonResult(defaultQuery, repository);
  expect(result.entries.map((entry) => entry.technologyId)).toEqual([
    "nuclear", "solar", "wind", "gas", "coal",
  ]);
  expect(result.provenance.every((reference) => reference.sourceId && reference.datasetVersion)).toBe(true);
  expect(Object.isFrozen(result)).toBe(true);
});
```

- [ ] **Step 2: Write failing state-outcome tests**

Test unavailable metric, partial technology coverage, stale release,
incompatible methods, disputed alternatives, restricted Raw, and repository
failure. Repository failure must throw `EvidenceRepositoryError`; it must not
masquerade as missing evidence.

- [ ] **Step 3: Run result tests and verify failure**

Run: `npm test -- features/comparison/domain/get-comparison-result.test.ts features/comparison/domain/get-comparison-result.integration.test.ts`  
Expected: FAIL with missing orchestration.

- [ ] **Step 4: Implement the nine-step result pipeline**

Load release and definitions, resolve coverage, fetch active published records,
assess comparability, project, normalize, attach optional equivalents, collect
missing/provenance/narrative inputs, validate with `ComparisonResultSchema`, and
deeply freeze the result.

- [ ] **Step 5: Run all headless engine tests**

Run: `npm test -- features/comparison/domain features/comparison/comparison-model.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit the headless engine**

```bash
git add features/comparison/domain
git commit -m "feat: add repository-backed comparison engine"
```

---

### Task 7: Add typed privacy-conscious analytics events

**Files:**
- Create: `lib/analytics/comparison-events.ts`
- Create: `lib/analytics/sink.ts`
- Test: `lib/analytics/comparison-events.test.ts`
- Modify: `docs/product/ANALYTICS-AND-SUCCESS.md`

**Interfaces:**
- Produces: `ComparisonAnalyticsEventSchema`, `ComparisonAnalyticsEvent`, `AnalyticsSink`, and `trackComparisonEvent(sink, event)`.
- Consumes: identifiers and enum values only; no URL or free-form text.

- [ ] **Step 1: Write failing allowlist tests**

```ts
it("rejects free text and unknown properties", () => {
  expect(
    ComparisonAnalyticsEventSchema.safeParse({
      name: "comparison_shared",
      metricId: "lifecycle-emissions",
      mode: "typical",
      selectedCount: 5,
      fullUrl: "https://example.test/compare?private=value",
    }).success,
  ).toBe(false);
});
```

- [ ] **Step 2: Run analytics tests and verify failure**

Run: `npm test -- lib/analytics/comparison-events.test.ts`  
Expected: FAIL with missing event schema.

- [ ] **Step 3: Implement the discriminated event union**

Include exactly the events in `docs/product/ANALYTICS-AND-SUCCESS.md` plus
`unavailable_state_seen` and `mismatch_seen`. Use strict Zod objects so unknown
keys fail. `AnalyticsSink.track` accepts only parsed events.

- [ ] **Step 4: Run analytics and complete Stage 7 verification**

Run:

```bash
npm test -- lib/analytics features/comparison/domain
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run build
```

Expected: every command exits 0.

- [ ] **Step 5: Record Stage 7 evidence and commit**

Create `docs/engineering/verification/2026-09-01-stage-7-headless-comparison.md`,
update `docs/product/DELIVERY-TRACKER.md` only if the exit gate passes, then run:

```bash
git add lib/analytics docs/product/ANALYTICS-AND-SUCCESS.md docs/product/DELIVERY-TRACKER.md docs/engineering/verification/2026-09-01-stage-7-headless-comparison.md
git commit -m "docs: record stage 7 verification"
```
