# Stage 8 Shared Comparison Lab Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Comparison Lab preview wiring with the repository-backed engine and complete the approved responsive, accessible comparison workflow.

**Architecture:** `app/compare/page.tsx` parses request search parameters and renders the initial result on the server. A focused client shell owns transient UI state and canonical navigation, while a route handler returns subsequent validated results. Existing Stage 4 controls, charts, evidence primitives, tokens, and the approved Museum/Editorial visual direction remain authoritative.

**Tech Stack:** Next.js 16.3.3 App Router, React 19.2.8, TypeScript 6.0.3, Radix Dialog 1.1.23, Phosphor Icons 2.1.10, Testing Library, Vitest, Playwright, axe-core.

**Spec:** `docs/superpowers/specs/2026-09-01-stage-6-9-evidence-comparison-release-design.md`

## Global Constraints

- Read `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`, `05-server-and-client-components.md`, `10-error-handling.md`, `15-route-handlers.md`, and `02-guides/lazy-loading.md` before editing Next.js files.
- Keep `page.tsx` server-first; client components receive serializable values only.
- Reuse existing Stage 4 tokens and primitives; do not invent a new visual direction.
- Do not import scientific source values from `preview-data.ts` into production paths.
- Every value and unit is visible without hover and every chart has table/text parity.
- Complexity changes explanation only and preserve the complete comparison state.
- More than eight technologies automatically selects table view and explains the change.
- Mobile core reading has no horizontal scrolling; sheets restore focus to their triggers.
- Preserve light/dark, keyboard, 200% zoom, touch-target, and reduced-motion behavior.
- Do not expose server Supabase configuration in client bundles or route responses.

---

### Task 1: Build the server result loader and validated comparison route handler

**Files:**
- Create: `features/comparison/server/get-repository.ts`
- Create: `features/comparison/server/load-comparison.ts`
- Test: `features/comparison/server/load-comparison.test.ts`
- Create: `app/api/comparison/route.ts`
- Test: `tests/comparison-api-route.test.ts`
- Modify: `app/compare/page.tsx`
- Modify: `tests/comparison-page.test.tsx`
- Modify: `lib/env/server.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `loadComparison(searchParams, repository, preferences?)`, `GET(request)` at `/api/comparison`, and server-rendered `ComparisonLab` props.
- Consumes: `parseComparisonState`, `getComparisonResult`, and configured `EvidenceRepository`.

- [ ] **Step 1: Write a failing server-loader test**

```ts
it("loads canonical state and a repository-backed result", async () => {
  const loaded = await loadComparison(
    { mode: "range", sources: "nuclear,solar" },
    repository,
  );
  expect(loaded.state.displayMode).toBe("range");
  expect(loaded.result.query.selectedTechnologyIds).toEqual(["nuclear", "solar"]);
});
```

- [ ] **Step 2: Write failing route-handler tests**

```ts
it("returns a validated comparison result", async () => {
  const response = await GET(new Request("http://test/api/comparison?mode=typical"));
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ result: { query: { displayMode: "typical" } } });
});

it("does not expose repository error internals", async () => {
  repository.getMetricDefinition.mockRejectedValue(new Error("secret connection text"));
  const response = await GET(new Request("http://test/api/comparison"));
  expect(await response.text()).not.toContain("secret connection text");
});
```

- [ ] **Step 3: Run focused tests and confirm failure**

Run: `npm test -- features/comparison/server/load-comparison.test.ts tests/comparison-api-route.test.ts tests/comparison-page.test.tsx`  
Expected: FAIL because server modules and route handler are missing.

- [ ] **Step 4: Implement server-first loading**

Use the Next.js 16 async `searchParams` contract:

```ts
export default async function ComparisonPage({ searchParams }: PageProps<"/compare">) {
  const raw = await searchParams;
  const loaded = await loadComparison(raw, getEvidenceRepository());
  return <ComparisonLab initialState={loaded.state} initialResult={loaded.result} />;
}
```

The repository factory returns the explicit unavailable repository when server
configuration is absent. Add the server-only boolean
`ATOM_ENABLE_TEST_EVIDENCE`; when true it selects a reviewed
`LocalEvidenceRepository` snapshot for browser tests and preview verification.
It is false by default and never prefixed with `NEXT_PUBLIC_`. The production
path never imports preview fixtures.

- [ ] **Step 5: Implement uncached GET behavior and safe errors**

Parse `request.nextUrl.searchParams`, return `ComparisonResultSchema` output,
use status 503 for repository failures, and emit only a generated request ID and
stable error code. Route handlers are uncached by default in Next.js 16; do not
add accidental static caching. Export `createComparisonGetHandler(repository)`
for dependency-injected route tests; `GET` calls it with the production
repository factory.

- [ ] **Step 6: Run focused tests and commit**

Run: `npm test -- features/comparison/server tests/comparison-api-route.test.ts tests/comparison-page.test.tsx`  
Expected: PASS.

```bash
git add app/api/comparison app/compare/page.tsx features/comparison/server lib/env/server.ts .env.example tests/comparison-api-route.test.ts tests/comparison-page.test.tsx
git commit -m "feat: load comparison results on the server"
```

---

### Task 2: Implement canonical navigation and async result state

**Files:**
- Create: `features/comparison/ui/use-comparison-controller.ts`
- Test: `features/comparison/ui/use-comparison-controller.test.tsx`
- Modify: `features/comparison/ComparisonLab.tsx`
- Modify: `features/comparison/ComparisonLab.test.tsx`

**Interfaces:**
- Produces: `useComparisonController({ initialState, initialResult })` with `state`, `result`, `status`, `error`, `commitState`, `restoreDefaults`, and `retry`.
- Consumes: canonical state serialization and `/api/comparison`.

- [ ] **Step 1: Write failing navigation tests**

```ts
it("commits canonical URL state and preserves unrelated fields", async () => {
  const { result } = renderHook(() => useComparisonController(props));
  await act(() => result.current.commitState({ displayMode: "range" }));
  expect(router.push).toHaveBeenCalledWith(
    "/compare?sources=nuclear%2Csolar%2Cwind%2Cgas%2Ccoal&metric=lifecycle-emissions&region=global&mode=range&units=scientific&level=curious",
  );
});
```

Add tests for loading, retry, failed fetch preserving state, back/forward input,
complexity preservation, and automatic table view above eight technologies.

- [ ] **Step 2: Run controller tests and verify failure**

Run: `npm test -- features/comparison/ui/use-comparison-controller.test.tsx`  
Expected: FAIL with missing hook.

- [ ] **Step 3: Implement the controller**

Use `useTransition`, `useRouter`, and an abortable fetch. Only the newest
request may replace the result. Commit canonical URL state before fetching so
the address bar remains the source of truth. Handle `popstate` by reparsing the
current URL and loading that state.

- [ ] **Step 4: Adapt `ComparisonLab` to the new props**

Replace `PreviewComparison` with:

```ts
interface ComparisonLabProps {
  initialResult: ComparisonResult;
  initialState: ComparisonState;
}
```

Retain the existing shell, skip link, wordmark, primary navigation, background
asset, and complexity selector. Remove preview-only explanatory copy from
published paths.

- [ ] **Step 5: Run component/controller tests and commit**

Run: `npm test -- features/comparison/ui/use-comparison-controller.test.tsx features/comparison/ComparisonLab.test.tsx`  
Expected: PASS.

```bash
git add features/comparison/ComparisonLab.tsx features/comparison/ComparisonLab.test.tsx features/comparison/ui
git commit -m "feat: connect lab state to canonical navigation"
```

---

### Task 3: Complete technology and metric selectors

**Files:**
- Create: `features/comparison/ui/TechnologySelector.tsx`
- Create: `features/comparison/ui/MetricSelector.tsx`
- Create: `features/comparison/ui/selector-view-model.ts`
- Test: `features/comparison/ui/TechnologySelector.test.tsx`
- Test: `features/comparison/ui/MetricSelector.test.tsx`
- Modify: `features/comparison/ComparisonLab.module.css`

**Interfaces:**
- Produces: accessible ordered source selection and grouped metric search.
- Consumes: repository technology list, released metric registry, shared `CommandMenu`, `Chip`, and `OverlayPanel`.

- [ ] **Step 1: Write failing selector tests**

```tsx
it("adds, removes, and restores ordered technologies", async () => {
  render(<TechnologySelector {...props} />);
  await user.click(screen.getByRole("button", { name: "Add technology" }));
  await user.click(screen.getByRole("option", { name: "Hydro" }));
  expect(props.onChange).toHaveBeenCalledWith([
    "nuclear", "solar", "wind", "gas", "coal", "hydro",
  ]);
});
```

Metric tests cover grouped category labels, definition text, recent metrics,
related metrics, unavailable metrics, keyboard selection, Escape, and focus
restoration.

- [ ] **Step 2: Run selector tests and verify failure**

Run: `npm test -- features/comparison/ui/TechnologySelector.test.tsx features/comparison/ui/MetricSelector.test.tsx`  
Expected: FAIL because selectors are missing.

- [ ] **Step 3: Implement desktop and mobile source behavior**

Desktop uses ordered removable chips plus command search. Mobile uses the
existing sheet primitive with full selection, order controls, Apply, Restore
defaults, and Cancel. The sheet keeps transient edits local until Apply.

- [ ] **Step 4: Implement grouped metric search**

Group by registry category, show the definition before selection, retain only
released or explicitly unavailable metrics, and derive recent metrics from the
current browser session without analytics storage.

- [ ] **Step 5: Run tests, check touch targets, and commit**

Run: `npm test -- features/comparison/ui/TechnologySelector.test.tsx features/comparison/ui/MetricSelector.test.tsx`  
Expected: PASS with controls at least 44 CSS pixels where practical.

```bash
git add features/comparison/ui features/comparison/ComparisonLab.module.css
git commit -m "feat: add comparison technology and metric selectors"
```

---

### Task 4: Implement geography, mode, units, view, restore, and share controls

**Files:**
- Create: `features/comparison/ui/ComparisonToolbar.tsx`
- Create: `features/comparison/ui/share-comparison.ts`
- Test: `features/comparison/ui/ComparisonToolbar.test.tsx`
- Test: `features/comparison/ui/share-comparison.test.ts`
- Modify: `features/comparison/ComparisonLab.tsx`

**Interfaces:**
- Produces: `ComparisonToolbar`, `createCanonicalShareUrl(state, origin)`, and clipboard/share feedback.
- Consumes: comparison controller and shared buttons/segmented controls/tooltips.

- [ ] **Step 1: Write failing toolbar tests**

```tsx
it("changes units without changing scientific observations", async () => {
  render(<ComparisonToolbar {...props} />);
  await user.click(screen.getByRole("button", { name: "Human-friendly units" }));
  expect(props.onStateChange).toHaveBeenCalledWith({ unitMode: "human" });
  expect(props.result.entries[0].scientificValue).toBe(12);
});
```

Add tests for geography availability, Typical/Range/Raw, table/chart, restore,
share copy success/failure, and the over-eight table explanation.

- [ ] **Step 2: Run toolbar tests and verify failure**

Run: `npm test -- features/comparison/ui/ComparisonToolbar.test.tsx features/comparison/ui/share-comparison.test.ts`  
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement toolbar controls and canonical sharing**

Share serializes only committed state. Prefer `navigator.share` when supported;
otherwise use `navigator.clipboard.writeText`. Show an ARIA live confirmation
or error and never include transient selector text.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- features/comparison/ui/ComparisonToolbar.test.tsx features/comparison/ui/share-comparison.test.ts`  
Expected: PASS.

```bash
git add features/comparison/ui/ComparisonToolbar.tsx features/comparison/ui/ComparisonToolbar.test.tsx features/comparison/ui/share-comparison.ts features/comparison/ui/share-comparison.test.ts features/comparison/ComparisonLab.tsx
git commit -m "feat: complete comparison toolbar"
```

---

### Task 5: Render semantic charts with exact table and narrative parity

**Files:**
- Create: `features/comparison/ui/select-chart-kind.ts`
- Create: `features/comparison/ui/ComparisonResultView.tsx`
- Create: `features/comparison/ui/ComparisonTable.tsx`
- Create: `features/comparison/ui/ComparisonNarrative.tsx`
- Test: `features/comparison/ui/select-chart-kind.test.ts`
- Test: `features/comparison/ui/ComparisonResultView.test.tsx`
- Modify: `components/charts/chart-types.ts`
- Modify: `components/charts/chart-primitives.test.tsx`

**Interfaces:**
- Produces: `selectChartKind(metric, result)`, result chart/table rendering, and accessible narrative.
- Consumes: Stage 4 bar/range/distribution primitives and Stage 7 formatted entries.

- [ ] **Step 1: Write failing semantic chart tests**

```ts
it.each([
  ["discrete", "bar"],
  ["range", "range"],
  ["distribution", "distribution"],
  ["relationship", "scatter"],
  ["time-series", "line"],
])("maps %s semantics to %s", (semantics, expected) => {
  expect(selectChartKind(metricWith({ chartSemantics: semantics }), result)).toBe(expected);
});
```

Test that incompatible results and selections above eight return `table`.

- [ ] **Step 2: Write failing parity tests**

Render each supported result and assert the chart's directly displayed value,
table value/unit, and screen-reader summary all derive from the same entry.

- [ ] **Step 3: Run focused tests and verify failure**

Run: `npm test -- features/comparison/ui/select-chart-kind.test.ts features/comparison/ui/ComparisonResultView.test.tsx components/charts/chart-primitives.test.tsx`  
Expected: FAIL with missing result view.

- [ ] **Step 4: Implement chart selection and fallbacks**

Do not approximate scatter or line charts with decorative SVG. Until a tested
shared primitive exists, those semantics use the complete table/text fallback
and an honest “visual view not yet available” note. Bar charts start at zero;
ranges expose labels without hover; color is paired with marker and text.

- [ ] **Step 5: Run result-view tests and commit**

Run: `npm test -- features/comparison/ui components/charts`  
Expected: PASS.

```bash
git add features/comparison/ui components/charts
git commit -m "feat: render accessible comparison results"
```

---

### Task 6: Complete explanations, Data Passport, and Challenge interactions

**Files:**
- Create: `features/comparison/ui/ComparisonExplanation.tsx`
- Create: `features/comparison/ui/create-evidence-view-model.ts`
- Test: `features/comparison/ui/ComparisonExplanation.test.tsx`
- Test: `features/comparison/ui/create-evidence-view-model.test.ts`
- Modify: `features/comparison/ComparisonLab.tsx`
- Modify: `components/evidence/evidence-view-model.ts`
- Modify: `components/evidence/evidence-primitives.test.tsx`

**Interfaces:**
- Produces: L1–L5 explanation rendering and complete evidence view models per displayed entry.
- Consumes: metric explanation content, provenance, missing/mismatch states, and Stage 4 evidence primitives.

- [ ] **Step 1: Write failing explanation-invariance tests**

```tsx
it("changes prose depth without changing evidence entries", async () => {
  const { rerender } = render(<ComparisonExplanation level="kid" result={result} />);
  expect(screen.getByText(result.entries[0].formattedValue)).toBeVisible();
  rerender(<ComparisonExplanation level="expert" result={result} />);
  expect(screen.getByText(result.entries[0].formattedValue)).toBeVisible();
});
```

- [ ] **Step 2: Write failing Data Passport mapping tests**

Assert metric, technology, geography, period, source, study, system boundary,
method, representative kind, uncertainty, transformations, last verification,
dataset version, alternatives, and limitations are all mapped without UI
defaults that imply evidence exists.

- [ ] **Step 3: Run focused tests and verify failure**

Run: `npm test -- features/comparison/ui/ComparisonExplanation.test.tsx features/comparison/ui/create-evidence-view-model.test.ts components/evidence/evidence-primitives.test.tsx`  
Expected: FAIL before implementation.

- [ ] **Step 4: Implement explanations and evidence details**

Use source-authored L1–L5 content. Data Passport and Challenge triggers remain
available without hover. Challenge opens the evidence disagreement/correction
context; it does not submit a network correction form in V1.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm test -- features/comparison/ui components/evidence`  
Expected: PASS.

```bash
git add features/comparison/ui features/comparison/ComparisonLab.tsx components/evidence
git commit -m "feat: complete comparison evidence explanations"
```

---

### Task 7: Implement every loading, limitation, and responsive state

**Files:**
- Create: `features/comparison/ui/ComparisonStatePanel.tsx`
- Test: `features/comparison/ui/ComparisonStatePanel.test.tsx`
- Modify: `features/comparison/ComparisonLab.tsx`
- Modify: `features/comparison/ComparisonLab.module.css`
- Modify: `features/comparison/ComparisonLab.test.tsx`
- Delete: `features/comparison/preview-data.ts`

**Interfaces:**
- Produces: loading, empty, partial, missing, stale, restricted, error, disputed, and incompatible presentations.
- Consumes: comparison controller status and `ComparisonResult.status`.

- [ ] **Step 1: Write a failing state matrix test**

```tsx
it.each([
  ["empty", /no reviewed observations/i],
  ["stale", /last verified/i],
  ["restricted", /licence/i],
  ["incompatible", /different methodologies/i],
])("renders honest %s copy", (status, copy) => {
  render(<ComparisonStatePanel result={resultWithStatus(status)} />);
  expect(screen.getByText(copy)).toBeVisible();
});
```

- [ ] **Step 2: Run state tests and verify failure**

Run: `npm test -- features/comparison/ui/ComparisonStatePanel.test.tsx features/comparison/ComparisonLab.test.tsx`  
Expected: FAIL with missing state panel.

- [ ] **Step 3: Implement state-specific actions**

Error offers retry; partial lists missing technologies; stale includes date;
restricted links only permitted sources; incompatible leaves individual
observations inspectable but removes ranking language. Loading skeletons retain
layout and use `aria-busy` without motion under reduced-motion preference.

- [ ] **Step 4: Complete responsive CSS and component tests**

At 390px, stack controls by task, use full-height evidence sheets, preserve
44px targets, and prevent core overflow. At tablet and desktop, preserve the
approved exhibit hierarchy. Validate data attributes rather than screenshot
appearance alone in component tests.

- [ ] **Step 5: Run all Stage 8 unit/component tests and commit**

Delete `preview-data.ts` after its remaining tests use repository-backed
reviewed fixtures. Confirm `rg "preview-data" app features tests` returns no
production or test imports.

Run: `npm test -- features/comparison components/charts components/evidence`  
Expected: PASS.

```bash
git add features/comparison
git commit -m "feat: add complete comparison result states"
```

---

### Task 8: Add canonical SEO routes and complete browser verification

**Files:**
- Create: `app/compare/[metric]/page.tsx`
- Test: `tests/comparison-seo-page.test.tsx`
- Modify: `tests/e2e/comparison-lab.spec.ts`
- Modify: `docs/product/DELIVERY-TRACKER.md`
- Create: `docs/engineering/verification/2026-09-01-stage-8-comparison-lab.md`

**Interfaces:**
- Produces: canonical metric route metadata and the complete Stage 8 browser gate.
- Consumes: released metric registry, server loader, and canonical URL serializer.

- [ ] **Step 1: Write failing SEO route tests**

Test known metric canonicalization, unavailable metric copy, generated metadata,
and no scientific values duplicated in route code.

- [ ] **Step 2: Implement the dynamic metric page**

Use `PageProps<"/compare/[metric]">`, await `params`, load through the same
server function, and set canonical metadata to the serialized `/compare` URL.

- [ ] **Step 3: Expand the primary E2E journey**

Cover source add/remove/reorder, metric selection, geography, mode, units,
complexity, evidence passport, Challenge, table, share URL, reload,
back/forward, and focus restoration. Assert no failed responses, console
errors, hydration errors, critical/serious axe violations, or horizontal
overflow.

- [ ] **Step 4: Run three-browser and responsive verification**

Run:

```bash
npm run verify
PLAYWRIGHT_PORT=3118 npm run test:e2e
```

Expected: unit/build checks pass and Chromium, Firefox, and WebKit pass at the
existing desktop journey plus 390×844, 768×1024, 1440×900, dark/light,
reduced-motion, and 200% zoom-equivalent checks.

- [ ] **Step 5: Perform real-browser design QA**

Use the user's chosen browser. Compare the approved visual reference and the
running Lab at identical viewports; inspect layout, spacing, typography,
borders, focus, sheets, dialogs, and all result states. Record corrections and
rerun affected checks.

- [ ] **Step 6: Record the Stage 8 gate and commit**

Mark Stage 8 complete only if all production interaction and browser gates
pass; the metric category itself remains unreleased.

```bash
git add app/compare tests docs/product/DELIVERY-TRACKER.md docs/engineering/verification/2026-09-01-stage-8-comparison-lab.md
git commit -m "docs: record stage 8 verification"
```
