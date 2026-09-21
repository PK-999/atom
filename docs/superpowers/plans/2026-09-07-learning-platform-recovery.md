> Historical reference restored on 2026-09-21 from commit `522550a`. This describes the earlier implementation, not current acceptance. See `docs/product/DELIVERY-TRACKER.md` and the 2026-09-21 audit/plan for current findings and proposed next work. Restoration does not revalidate old completion or release claims.

# ATOM learning platform recovery and delivery implementation plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` when available and requested, or execute inline with review checkpoints. Steps use checkbox (`- [ ]`) syntax. This document plans future implementation; no unchecked step is complete.

**Goal:** Deliver an organized atomic-energy learning destination, beginning with trustworthy evidence and a coherent Comparison Lab, followed by reviewed lessons and purposeful exhibits.

**Architecture:** Preserve Next.js App Router, existing semantic tokens, shared primitives and framework-independent scientific contracts. Reconcile competing evidence implementations into one versioned repository; build a validated content catalog for lessons, topics, search and evidence navigation. Render readable content on the server and hydrate only interactions.

**Tech stack:** Existing pinned Next.js/React/TypeScript/Zod/Vitest/Playwright/axe stack, Supabase/PostgreSQL; exact versions come from the reconciled lockfile. No framework replacement. Do not upgrade packages as part of a content/UI task.

**Spec:** `docs/product/2026-09-07-ATOMIC-ENERGY-EXPERIENCE-AUDIT.md`, existing product documents, ADR 0001 and the approved Stage 6–9 specification.

## Global constraints and execution protocol

- Execute task IDs in dependency order. Finish one usable slice before moving to another flagship. A schema or mock component does not complete a stage.
- Work begins from the actual dirty root plus delivery worktree. Never reset, overwrite, stash or commit unrelated user files. Never combine incompatible migration histories blindly.
- Preserve default sources Nuclear/Solar/Wind/Gas/Coal; Global; Typical; Scientific; Curious. Resolve the existing `lifecycle-ghg` versus documented `lifecycle-emissions` identifier through R03's alias rule.
- URL fields override local preferences individually; one bad field must not invalidate other fields. Complexity changes presentation, never evidence IDs or underlying values.
- Scientific zero is a valid observation; missing evidence is a distinct state. Do not use zero/NaN/empty string as a missing-data sentinel.
- A chart selection above eight technologies uses the table. One selected technology is valid. An explicitly empty selection renders an empty state rather than silently restoring five sources.
- Public learning requires no login. Draft/unreviewed data and synthetic fixtures never enter public result repositories.
- Every numerical transformation gets a hand-derived expected-value test. Round trips alone are insufficient.
- Use the actual acquisition/review dates, never the date in an old example. Never invent reviewer identities, licensing decisions or scientific approval.
- Read applicable `AGENTS.md`, the linked spec, this task and its dependencies, and relevant installed Next documentation before editing Next code.
- For each task: record scope → write regression/domain tests first → observe meaningful failure → implement → run focused tests → review → run relevant integration/browser/build gates → update tracker with evidence → stage only exact task files and commit when authorized.
- Before a task depends on an external deployment, finish local implementation and disposable-database tests. Do not call ordinary incomplete code an external blocker.

## Dependency map and original stages

| Work package | Depends on                           | Original stage | Deliverable                                                    |
| ------------ | ------------------------------------ | -------------- | -------------------------------------------------------------- |
| R01          | none                                 | 0, 2, 6        | Reconciled repository/schema baseline                          |
| R02          | R01                                  | 5              | Correct new unit families                                      |
| R03          | R01                                  | 7              | Typed URL and preference contract                              |
| R04          | R01, R02                             | 6              | Real transactional ingestion, review, publication and rollback |
| R05          | R02–R04                              | 7              | Headless comparison results and honest failures                |
| R06          | R03, R05                             | 4, 8           | Working Lab journey and shared evidence UI                     |
| R07          | R04–R06                              | 9              | Deterministic CI, release registry, observability              |
| R08          | R07                                  | 10–15          | Category-by-category reviewed evidence releases                |
| R09          | R08                                  | 16             | Full catalog acceptance                                        |
| R10          | R01; public rollout after R09        | 1, 17          | Content/topic/claim graph; seven-lesson curriculum             |
| R11          | R10, R09                             | 17             | One complete lesson, then seven lessons                        |
| R12          | R11                                  | 1, 17          | Home, discovery, search, glossary, trust routes                |
| R13          | R11–R12                              | 18             | Radiation explorer                                             |
| R14          | R12                                  | 19             | Debate pages with contextual evidence                          |
| R15          | R12, approved exhibit target         | 20             | Reactor explorer                                               |
| R16          | R12                                  | 21, 22         | Facility directory/map, then India                             |
| R17          | R02, R08, R12                        | 23             | Honest annual grid model and controls                          |
| R18          | R12, mature retrieval                | 24             | Evaluated Ask ATOM                                             |
| R19          | Starts R07; maintained every release | 25             | Continuous operations                                          |

Content planning can proceed before R09, but the established public release order is retained. An explicit later product decision may change that order through an ADR.

## R01 — Reconcile the two implementations without losing work

**Files:** inspect root and `.worktrees/stage-6-9-delivery`; create `docs/decisions/0009-evidence-implementation-reconciliation.md` and `docs/engineering/verification/2026-09-07-recovery-baseline.md`; selectively reconcile `package.json`, lockfile, `lib/env/`, `lib/supabase/`, `supabase/`, `data/ingestion/` and their tests.

**Consumes:** root `ab0429c` plus dirty files; delivery `c8cb58a` plus partial edits. **Produces:** one chosen migration chain, exact dependencies, one repository contract and a documented recovery path.

- [ ] Run `git status --short`, `git worktree list`, `git log -8 --oneline` in both worktrees. Record branches/HEADs and changed filenames; do not print env values.
- [ ] Save a recovery record of tracked diffs and enumerate untracked source files, excluding secrets, node_modules and build artifacts. Use a named local backup location or approved checkpoint commit; confirm untracked work is preserved too.
- [ ] Compare migrations by table/column/constraint, not timestamp alone. In the ADR map root entities to versioned worktree entities: datasets→datasets+dataset_versions, publication flag→reviewed transitions, direct observations→active release reads, mutable upsert→immutable versions, public review records→private reviews.
- [ ] Inspect the configured target and applied migration history read-only. If a root migration is already applied to a hosted DB, design additive migration/backfill/reconciliation; do not reset it. If neither history is deployed, validate the chosen chain in a disposable local DB. Document which case was observed.
- [ ] Use the stronger delivery repository/schema as the reconciliation candidate, retaining review fixes; do not assume Task 5 or EIA ingestion is complete. Review partial `canPrepublishObservation` behavior, reviewer requirements and duplicate detection before reuse.
- [ ] Make `scripts/ingest-reference.ts` fail closed as an unverified development example, with a nonzero exit and a message pointing to the reviewed pipeline. Preserve its original content in history/backup. Do not run its current writes. Test this without network calls.
- [ ] Bring approved dependency versions over exactly (no `^`/`~`), reconcile environment parsers, and use publishable/secret keys with a separate server-only direct DB URL where transactions require it. Reuse env wrapper behavior expected by existing tests. Do not expose DB URLs in errors or browser bundles.
- [ ] Rerun root typecheck, unit suite, lint and production build. Run chosen migration chain/pgTAP only against verified disposable local infrastructure. Record actual counts and failures.
- [ ] Exit: a new agent can install the chosen tree and identify exactly which schema and repository it uses. Commit only reconciled files after review; leave unrelated scaffolds intact.

## R02 — Correct scientific unit factors

**Files:** modify `lib/evidence/unit-registry.ts`, `lib/evidence/units.test.ts`; add `docs/evidence/UNIT-DERIVATIONS.md`. **Consumes:** existing `convertUnit` and `normalizeObservation`. **Produces:** correct factors without changing scientific source observations.

- [ ] Add these regression oracles to the existing conversion suite:

```ts
it.each([
  [1, "ha/TWh", "m2/MWh", 0.01],
  [1, "m2/MWh", "ha/TWh", 100],
  [1, "t/TWh", "kg/MWh", 0.001],
  [1, "kg/MWh", "t/TWh", 1000],
])("converts %s %s to %s", (value, from, to, expected) => {
  expect(convertUnit(value, from, to)).toBeCloseTo(expected, 10);
});
```

- [ ] Run `npm test -- lib/evidence/units.test.ts`; observe current errors. Derive ha→m² = 10,000 and TWh→MWh = 1,000,000; therefore ratio = 0.01. Derive t→kg = 1,000; ratio = 0.001.
- [ ] Correct factors respecting the registry's chosen base unit. Add range endpoint conversion and nonmutation tests using the existing complete observation fixture. Check every newly added family, including time, density, area, volume, money denominators and percentages.
- [ ] Reject cross-dimension conversion and nonfinite input. Treat currency-year/market conversion as contextual transformations, not a generic USD scale conversion.
- [ ] Search callers and stored transformation versions; document whether affected derived records exist before regenerating anything. If published outputs were affected, produce a correction/version record, never silently overwrite them.
- [ ] Exit: known-value tests and existing evidence suite pass; documented derivations match factors. Review and commit the exact files.

## R03 — Fix URL parsing, compatibility and preference precedence

**Files:** modify `features/comparison/comparison-url.ts`, `comparison-types.ts`, `comparison-model.test.ts`; create `features/comparison/comparison-url.test.ts`; adapt `lib/preferences/complexity-preference.ts` only when its behavior must change.

**Contract:** `parseComparisonState(params): ComparisonState` and `serializeComparisonState(state): URLSearchParams` are canonical; retain `parseComparisonUrl`/`serializeComparisonUrl` wrappers while callers migrate. `ComparisonState` contains `sources: string[]`, `metric`, `region`, `mode`, `units`, `level`; ordered `sources` is the order contract, avoiding a competing ordering field.

- [ ] Add a minimal failing test before implementation:

```ts
it("repairs only the invalid field and preserves transformed fields", () => {
  const state = parseComparisonUrl(
    new URLSearchParams("sources=nuclear,wind&mode=invalid&level=expert"),
  );
  expect(state.sources).toEqual(["nuclear", "wind"]);
  expect(state.mode).toBe("typical");
  expect(state.level).toBe("expert");
});
```

- [ ] Parse each field with its own validator and fallback. Do not cast raw params into `ComparisonState`. Normalize record arrays and repeated query keys consistently: first occurrence wins for both input forms.
- [ ] Set canonical emissions ID to `lifecycle-ghg` to preserve current code URLs; accept `lifecycle-emissions` as an alias. Document this in ADR 0004 and registry tests. Do not rewrite source dataset IDs.
- [ ] Trim/deduplicate sources preserving first occurrence; reject unknown IDs using the technology registry. Missing sources restores default; explicitly `sources=` means empty; a nonempty list containing only invalid IDs falls back to default. Enforce max 32 selected IDs and max 64 characters per identifier; truncate accepted selection at 32 with a parser warning, not a crash.
- [ ] Validate metric/geography against known catalog IDs, but allow known unreleased metrics to resolve to an unavailable result. Distinguish unknown IDs from valid IDs without evidence.
- [ ] Always serialize all six contract keys, including `sources=` and `level=curious`; otherwise a shared Curious URL can be overridden by the recipient's stored Expert preference. Preserve ordering deterministically.
- [ ] Add tests: absent fields; each bad enum; whitespace; duplicate/unknown IDs; explicit empty; one source; 9/32/33 selections; repeated keys; both input forms; Unicode/oversized junk; alias; round trip. No invalid output is permitted to violate TypeScript's runtime shape.
- [ ] Test valid URL > local preference > default on initial hydration, back/forward, blocked storage and cross-tab storage changes. A URL-absent level may hydrate to stored preference; an explicit level must not be overridden.
- [ ] Exit: focused unit tests pass and URL changes preserve all other selections; browser history checks occur in R06.

## R04 — Complete the actual evidence lifecycle

**Files after R01:** `data/ingestion/pipeline.ts`, `quality.ts`, `publication.ts`, `parser-registry.ts`, new `data/ingestion/postgres-store.ts`, `scripts/evidence/server-adapter.ts`, `scripts/evidence/ingest.ts`; `lib/evidence/governance.ts`; CLI-generated review/ingestion migration; `supabase/tests/database/`; generated DB types. Reference artifact under `data/sources/eia-capacity-factor/`.

**Consumes:** `IngestionManifest`, `IngestionStore`, `PublicationStore`, Stage 5 schemas/governance, reviewed migrations. **Produces:** a shipped default adapter and CLI that actually perform ingest/review/publish/rollback, plus real DB verification.

- [ ] Read existing Stage 6 Task 5 and its review report; implement the remaining findings rather than restarting the pipeline. Write tests for mismatched manifest dataset/source/licence, already-published parser inputs, duplicate IDs and duplicate composite identities, wrong canonical target and normalized-record incompatibility.
- [ ] Enforce manifest identity, draft-only inputs, all scientific/editorial/licensing roles, canonical unit equality with the metric, and post-normalization validation before writing observations. Preserve immutable raw artifact references and transformation history.
- [ ] Implement `createEvidenceCliDependencies()` using validated server-only `SUPABASE_DATABASE_URL`; parameterize SQL; close the pool in `finally`. The normal CLI must not require a user-supplied module path. Parser selection must use an explicit registry, never arbitrary executable source imports.
- [ ] Keep ingestion audit durable across failures: persist a run before processing, record successful stages, perform version/observation writes atomically, mark failures outside a rolled-back transaction with a sanitized category/code. Enforce concurrent idempotency in PostgreSQL; define retry behavior for failed/in-progress keys and test it.
- [ ] Persist reviews with version ID, role, reviewer identity, review timestamp and reviewed artifact/manifest identity. Reject duplicate role approvals and one identity covering multiple roles. Record real reviewers for real publication; synthetic reviewer IDs belong only in disposable DB tests.
- [ ] Factor prepublication structural/scientific validation from visibility requirements. Reject withdrawn/published inputs for draft publication; preserve correction and chronology checks. Validate all candidates before mutation, transition draft→in-review→published with metadata inside one transaction.
- [ ] Activate releases through the privileged private function only. Preserve historical versions and append-only operation log. A published reference version may remain feature-disabled; publication and public release are different decisions.
- [ ] Replace the memory-only `publication.integration.test.ts` with actual Postgres tests. Seed clearly synthetic complete reference entities in a disposable test DB; verify persisted rows using a second connection, not mocked methods.
- [ ] Test a forced failure after some writes: no partial version/observation publication survives, but a failed run is inspectable. Test duplicate/concurrent ingestion, missing review, duplicate reviewer, restriction, publication transition, activation and rollback. Verify anon/authenticated cannot read private reviews or write public evidence.
- [ ] Acquire an actual institutional capacity-factor artifact and reuse licence from its primary source. Record URL, version/date, SHA-256, extraction locator, unit, period, scope and limitations before writing a parser. Do not use values recalled by an agent. Write parser tests against the acquired bytes; malformed header, duplicate row, missing row and nonnumeric cell fail.
- [ ] Run a synthetic complete lifecycle first. For the real artifact, publish only after qualified scientific/editorial/licensing decisions exist; otherwise leave it in review and document the exact gate. Do not register three fake reviewers to satisfy the database.
- [ ] Run required integration commands with local config. Missing config must exit nonzero for explicitly requested integration checks. Generate database types after migrations. Record command outputs without credentials.
- [ ] Exit: real DB lifecycle and rollback tests pass; real evidence retains its actual review status; no unsupported scientific release is claimed.

## R05 — Build comparison results and resilient server loading

**Files:** create `features/comparison/comparison-engine.ts`, `.test.ts`, `comparison-result.ts`; replace internals of `comparison-api.ts`; modify `app/compare/page.tsx`; create `app/compare/loading.tsx`, `error.tsx`; update `app/health/route.ts`, add `app/ready/route.ts` and route tests.

**Consumes:** canonical state and `EvidenceRepository`. **Produces:** `getComparisonResult(query, repository): Promise<ComparisonResult>` and `fetchComparisonData` adapter; React receives validated view models only.

```ts
// Proposed UI boundary; retain the richer domain observation types behind it.
type ComparisonEntry =
  | {
      kind: "available";
      technologyId: string;
      observationIds: readonly string[];
      scientificLabel: string;
      displayLabel: string;
      evidenceId: string;
    }
  | {
      kind: "missing" | "restricted" | "incompatible";
      technologyId: string;
      message: string;
    };
type ComparisonResult = {
  state: ComparisonState;
  status: "ready" | "partial" | "empty" | "unavailable" | "error";
  entries: readonly ComparisonEntry[];
  effectiveGeographyId: string | null;
  datasetVersionIds: readonly string[];
  warnings: readonly string[];
};
```

- [ ] Start with repository fixtures deliberately shuffled by study, technology and geography. Use fake IDs and documented synthetic quantities; keep fixtures outside production imports.
- [ ] Query only active/published releases; retain requested selection even for missing technologies. Check licensing independently of publication. Select a representative only through an explicit rule after unit normalization and comparability assessment.
- [ ] Implement actual geography filtering. Default to no silent geographic substitution; where the metric policy permits Global fallback, return effective geography and a visible warning, never the requested country label on global data.
- [ ] Preserve points, ranges with range semantics and categorical values. Do not coerce `null`/strings into numeric values. Separate query failure, unknown metric, known-unreleased metric and empty observations.
- [ ] Add tests with expected outcomes: two regions never cross; shuffled order yields same representative; 1 kgCO2e/MWh normalizes to 1 gCO2e/kWh; range-only record retains endpoints; missing record has no numeric field; categorical value remains categorical; incompatible boundaries produce warning/blocked comparison; restricted raw observations do not appear in rendered props.
- [ ] Require output provenance IDs to resolve to the exact observations used. Unit-mode changes retain scientific labels and assumption references; complexity changes leave dataset/observation IDs and values unchanged.
- [ ] Route errors render a retry action and source-independent navigation. Loading preserves the selected context. Empty results must not dereference a nonexistent evidence observation.
- [ ] Make `/health` liveness independent of DB and non-sensitive. `/ready` returns 200 or 503 with a bounded DB check including client creation inside error handling; redact details. Point Playwright startup at liveness. Test absent config, client creation failure, query failure, timeout and success.
- [ ] Exit: domain tests require no React or real DB; repository integration proves filtering; no-secret/no-credential build works with honest unavailable results.

## R06 — Complete one coherent Comparison Lab journey

**Files:** refactor `ComparisonLab.tsx` into `ComparisonControls.tsx`, `ComparisonResults.tsx`, `ComparisonInterpretation.tsx`, `ComparisonEvidence.tsx` within the existing feature folder; reuse `components/ui`, `components/charts`, `components/evidence`, `AppShell`. Add focused component tests and revise `tests/e2e/comparison-lab.spec.ts`.

**Consumes:** R05 results and R03 state. **Produces:** working canonical `/compare` journey using the approved visual target.

- [ ] Record the desktop/mobile target using the existing approved reference and tokens. Design loading, empty, missing, error and range views before implementing them. Do not regenerate three directions for an already approved Lab.
- [ ] Write component tests for adding/removing/reordering/restoring sources, including one/zero selections and automatic table at nine. Reuse `CommandMenu`, `OverlayPanel`, `Chip` and segmented controls; mobile uses a sheet with focus restoration.
- [ ] Implement grouped metric search with definitions, recent metric IDs stored locally, and related metrics from the registry. Recent lists must recover from corrupt/blocked storage.
- [ ] Wire geography, mode, units, view, reset and share controls. Clipboard failure exposes a selectable canonical URL. Browser history records deliberate state changes; rapid changes cannot clobber each other through stale props.
- [ ] Choose bar/range/distribution by supported semantics; do not draw a bar merely because a number exists. Line/scatter are available only with real time-series/paired observations and tested axes. Show table/text alternatives and direct units.
- [ ] Replace fixed emissions interpretations with reviewed per-metric five-level explanations. For unknown/unavailable content show an honest state, never another metric's explanation. Test all five levels preserve evidence IDs and current source selection.
- [ ] Replace inline preview dialogs with shared DataPassport and ChallengeNumber. Resolve source/study links, version, boundary, uncertainty, transformations and alternatives; never show “Not yet published” on reviewed released data. Empty results expose no broken evidence triggers.
- [ ] Test full journey: open → remove Coal → add Hydro → change metric → Range → passport → challenge → share → reload → back/forward → identical state. Assert selected IDs and actual evidence version, not only headings.
- [ ] Run manual/browser matrix below for all result states; verify no console/page/hydration errors. Exit: a complete interaction against reviewed test evidence; public release still depends on R08 evidence gates.

## R07 — Release, CI and monitoring foundation

**Files:** `.github/workflows/ci.yml`, `package.json`, `playwright.config.ts`, `lib/analytics/tracker.ts`, new tracker tests, `components/observability/WebVitals.tsx`, `docs/engineering/RELEASE-PROMOTION.md`, `docs/engineering/ENVIRONMENT-SETUP.md`.

**Consumes:** R04 lifecycle, R06 journey. **Produces:** repeatable local/CI acceptance and category release/rollback controls.

- [ ] Add a disposable-Supabase CI job: install pinned dependencies, start local DB, reset only that DB, run pgTAP, lint/advisors, generated-type drift check and both required repository/ingestion integration suites, then stop in an always step.
- [ ] Add deterministic E2E seed/configuration. No live hosted database dependency, production credentials or arbitrary fixture-publication flag in production builds. Test unavailable mode without DB and a seeded integration mode separately.
- [ ] Define per-event payload validators; reject email, free text, full query URLs and unknown fields. Inject a no-op transport when analytics is disabled; test transport failures cannot break learning. Record INP along with LCP/CLS when supported by installed Next guidance.
- [ ] Define release registry availability by metric, version, geography and allowed modes. Test feature-disabled published evidence cannot become public by URL manipulation.
- [ ] Add stale-source and broken-link reports with timeout, bounded concurrency and retry; 403/429/timeouts mean “check inconclusive”, not “scientific claim false.” Monitoring begins as a working script/report; vendor dashboards are not prerequisites to implement it.
- [ ] Drill correction and previous-version activation in disposable DB. Assert observations preserved, active pointer changed, audit appended and cached public results invalidated by version.
- [ ] Record measured bundle size and hydration cost per route; maps/LLM clients must not appear in basic lesson/home chunks. Test mobile LCP <2.5s, CLS ≤0.1 and project Lighthouse targets using a documented environment. Do not fabricate scores from a successful build.
- [ ] Exit: CI calls actual DB tests, full browser journey passes, privacy payload tests pass, rollback works and release procedure names concrete commands.

## R08 — Release the complete metric catalog one category at a time

**Files:** `lib/evidence/metrics.ts`, `data/sources/<dataset-id>/`, `data/transforms/`, `content/metrics/`, `docs/product/METRIC-COVERAGE.md`, `docs/evidence/reviews/<date>-<dataset-id>.md`, `docs/releases/<date>-<category>.md`.

**Consumes:** R04–R07. **Produces:** reviewed category versions or explicit unsupported combinations. Definitions alone remain unreviewed.

For each category below, execute each numbered step before selecting the next category:

1. Enumerate every metric and technology/geography/period/mode combination. Match the product specification exactly; distinguish mining intensity from materials and waste volume from persistence/toxicity.
2. Define quantity, unit, valid sign/range, technology variant, boundary and comparison rule. Choose a source policy before selecting a favorable value.
3. Acquire primary/institutional/peer-reviewed artifacts, confirm reuse rights, checksum and preserve bytes where permitted; otherwise store metadata and restricted access reason.
4. Write parser/transformation tests with exact located values, missing cells, range definitions, unit changes and duplicate identities. Run failing tests before parsing code.
5. Ingest into a draft version. Check source/study relationships, normalized values and boundary compatibility. Do not average studies whose methods are incompatible.
6. Author all five explanation levels against the same evidence IDs, with definition, interpretation, assumptions, limitations and alternatives. Expert adds meaningful method detail; Kid retains access to the scientific number.
7. Record real scientific/editorial/licensing decisions. Test representative policy, publication gate, raw permission, missing combinations, passport and challenge.
8. Run category-specific checks plus R06 browser matrix; activate reviewed release, verify exact version, record rollback target and release notes. If review is unavailable, remain in review while other authorized local work proceeds.

| Stage | Category / every required metric                                                                                                     | Additional acceptance oracle                                                                                                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 10    | Lifecycle GHG; land; water withdrawal; water consumption; materials; mining intensity; waste volume; defensible persistence/toxicity | Withdrawal never relabeled consumption; lifecycle never relabeled operational; stock/flow and land occupation/time units preserved            |
| 11    | Capacity factor; dispatchability; variability; firm capacity/capacity credit; scenario-based storage dependence                      | Capacity factor is not capacity credit; geography/grid scenario appears with conditional metrics                                              |
| 12    | Capital; operating; fuel; LCOE; construction duration; plant lifetime; decommissioning; financing sensitivity                        | Currency year, currency, discount rate, lifetime, market and vintage required where applicable; annual/overnight/levelized cost not conflated |
| 13    | Mortality/electricity; air pollution; occupational impacts; accident risk; evacuation/displacement                                   | Direct, modelled, occupational and evacuation categories distinct; no fabricated common risk scale                                            |
| 14    | Fuel energy density; stockpiling potential; import dependence; supply-chain concentration                                            | Fuel form/processing stage, country, trade year, denominator and scenario explicit                                                            |
| 15    | Power density; thermal efficiency; refueling cycle; typical unit capacity                                                            | Reactor/technology variants explicit; no thermal efficiency assigned to a nonthermal system without valid definition                          |

Test code must use observed fixture values from the reviewed artifact, not made-up scientific expected values. Use synthetic fixtures only for software mechanics and label them clearly. No task may “fill all rows” by guessing missing observations.

## R09 — Full Comparison Lab V1 acceptance

**Files:** `tests/e2e/regression-drills.spec.ts`, evidence/repository tests, `docs/engineering/verification/<date>-comparison-v1.md`, `docs/releases/<date>-comparison-v1.md`.

- [ ] Compare specification metric IDs to registry coverage records; fail on omission, duplicate ID or unsupported mode marked available.
- [ ] Test a representative journey for each released category, asserting values, units, versions, geography and source links. Existing heading-only loops do not satisfy this step.
- [ ] Test old aliases/shared URLs, invalid URLs, one/zero/nine technologies, all levels, raw restrictions, alternative studies, stale links, partial data and backend failure.
- [ ] Complete source-correction/cache-invalidation/version-rollback drills, then the full responsive/browser/performance matrix.
- [ ] Record full catalog coverage including unavailable combinations. Exit only when every required combination is represented honestly and all applicable gates passed; unavailable evidence is not a reason to invent data.

## R10 — Content catalog and curriculum contracts

**Files:** extend `lib/education/schemas.ts`; create `lib/education/catalog.ts`, `catalog.test.ts`, `lib/education/content-validation.ts`, `content-validation.test.ts`, `content/topics/catalog.json`, `content/lessons/`, `content/glossary/`, `docs/product/KNOWLEDGE-COVERAGE.md`.

**Consumes:** existing evidence Claim/Citation/Explanation schemas and five-level type. **Produces:** a published-content graph used by lessons, topics, search and navigation.

```ts
// Catalog references, not unsanitized remote executable content.
type ContentStatus = "draft" | "in-review" | "published" | "withdrawn";
type LessonRecord = {
  id: string;
  slug: string;
  title: string;
  topicId: string;
  objective: string;
  prerequisiteIds: readonly string[];
  conceptIds: readonly string[];
  claimIds: readonly string[];
  contentByLevel: Record<ComplexityLevel, string>; // local checked content paths
  checkpointIds: readonly string[];
  nextLessonId: string | null;
  status: ContentStatus;
  version: string;
  lastVerifiedAt: string;
};
```

- [ ] Implement strict runtime schemas for this catalog and resolved references, reusing existing identifiers/levels. Add publication review metadata and citation completeness through the existing evidence contracts; do not invent a second review vocabulary.
- [ ] Test missing level, duplicate slug, unknown topic/concept/claim, dangling next lesson, cyclic prerequisites and draft content in a published list. Published quantitative claims must resolve to evidence and method context.
- [ ] Create topic records for every row in the audit coverage register. Track metadata-ready, authored, reviewed and published separately. Add future subtopics as explicit gaps instead of fake pages.
- [ ] Define seven initial lesson IDs in order: `energy`, `atom`, `fission`, `reactor`, `electricity-generation`, `safety`, `waste`. Each has one measurable objective, prerequisites, one formative checkpoint and five reviewed explanations.
- [ ] Content paths may resolve only within checked repository content. If MDX is introduced, select an exact-pinned compatible parser, allowlist teaching components, disallow arbitrary remote MDX execution/HTML, and add build validation. Plain text/structured blocks can ship the first slice without installing MDX.
- [ ] Build `getPublishedLesson(slug)` and `listPublishedLessons()`; drafts/withdrawn return no public record. Do not export test fixture content into the catalog.
- [ ] Exit: content graph validates without React; published lists cannot expose draft content; authors have a concrete template with required evidence fields.

## R11 — One complete lesson, then the seven-lesson path

**Files:** `app/learn/page.tsx`, `app/learn/[lesson]/page.tsx`, lesson not-found/loading boundaries; `features/education/LessonViewer.tsx`, new `LessonInteraction.tsx`, `LessonCheckpoint.tsx`, tests; `lib/education/progress.ts`, tests; `tests/e2e/learning-path.spec.ts`.

**Consumes:** R10 catalog, shared complexity preference and evidence UI. **Produces:** server-readable lessons, a purposeful client interaction, answer feedback and optional local progress.

- [ ] Establish one desktop/mobile lesson target using approved design language: breadcrumb, objective, short prose, interaction, checkpoint, sources, next lesson. Single reading column; sources/math expand on request.
- [ ] Implement `/learn/energy` first against reviewed content. Use an energy-versus-power interaction with explicit synthetic teaching inputs and units, or a step-based electricity sequence. If calculating 1000 MW ×0.90×8760 h, test 7,884,000 MWh; label assumptions as a teaching example.
- [ ] Write route tests for direct slug load, unknown slug 404, draft slug unavailable, title/metadata and one main landmark. Resolve concept IDs to readable titles and inline definitions, never raw IDs. Link to existing published lesson/source destinations only; glossary links are added in R12 after their routes exist.
- [ ] Server-render the selected explanation and sources. Hydrate controls only; with JavaScript disabled the lesson objective, explanation, source links and next step remain readable.
- [ ] Checkpoint: show a labeled answer control, submit, explanatory correct/incorrect feedback, and retry. Never use score alone as feedback or mark a lesson complete just because it opened.
- [ ] Local progress key `atom:learning-progress:v1`; store lesson ID/version and completion state only. Provide reset; handle corrupt JSON, unknown versions, unavailable storage and updated lesson versions. No account or tracking identity.
- [ ] Test level changes preserve lesson URL anchor/context, answers and evidence IDs. Test stored level versus explicit URL. Test previous/next boundaries and return navigation.
- [ ] Run browser matrix on the first lesson; then add atom, fission, reactor, electricity generation, safety and waste with the same contract and topic-appropriate interactions. Reduced-motion versions use explicit Next/Previous steps.
- [ ] Exit: every lesson has reviewed content and functioning source/next links; all seven pass catalog and route tests; one full `/learn`→lesson→checkpoint→external canonical source→next journey passes in each supported browser. Homepage entry and internal glossary/evidence navigation are accepted in R12, avoiding a circular dependency.

## R12 — Homepage, topic discovery, glossary, search and evidence pages

**Files:** `app/page.tsx`, `components/layout/AppShell.tsx` and styles/tests; create `app/topics/page.tsx`, `app/topics/[topic]/page.tsx`, `app/explore/page.tsx`, `app/search/page.tsx`, `app/glossary/page.tsx`, `app/glossary/[term]/page.tsx`, `app/evidence/page.tsx`, source/study/dataset routes from the audit, `/about`, `/accessibility`, `/corrections`; `lib/search/index.ts`, tests; `tests/e2e/discovery.spec.ts`.

**Consumes:** published content and evidence registries. **Produces:** a small navigation structure with complete reachable destinations.

- [ ] Record homepage and search mobile/desktop targets before UI. Use the audit's hero→three questions→featured exhibit→topics→evidence structure. Remove internal development-status copy from the learning path; retain truthful availability notices where needed.
- [ ] Add Learn and published topic routes using existing shell. Omit unreleased exhibits from navigation rather than exposing dead links or many disabled cards. About states mission, neutrality, review policy and real ownership only.
- [ ] Test the complete home→lesson→checkpoint→internal evidence/glossary→return→next journey after linking the homepage to Learn. Define `SearchDocument { id, type, title, summary, href, topicIds, keywords }`; `buildSearchIndex(publishedCatalog)` produces only published local entries; `searchCatalog(query, index)` returns deterministic ranked results. Match normalized title first, then approved aliases/keywords, then summary; tie-break title then ID.
- [ ] Use a server-rendered GET search form with `q` capped at 200 characters; trim whitespace, return empty-query guidance, type groups and honest no-results suggestions. Do not log search free text. Start with substring/token matching; no vector DB or LLM required.
- [ ] Add tests for case/whitespace, approved synonyms, duplicate IDs, draft exclusion, accent normalization, HTML-looking query text, unknown terms and deterministic order. Render query as text, never HTML.
- [ ] Glossary has plain/scientific definitions, related lesson links and citations. Topic pages expose a short overview, prerequisites and related released lessons/exhibits, not giant multi-level menus.
- [ ] Source/study/version routes resolve only published allowed metadata through repository methods. Use stable IDs, 404 unknown/draft records, readable citations, dates, methods, licensing and corrections. Restricted raw data must not leak through page props or downloads.
- [ ] Add sitemap/canonical metadata only for published stable pages; prevent arbitrary search/query permutations from flooding indexable URLs. Accessibility page states actual capabilities and known limitations, not untested compliance certification.
- [ ] Add route/link integrity test: every catalog navigation href resolves, no draft entry appears, one H1/main per page. Test keyboard menu/search and mobile sheet closure/restoration.
- [ ] Exit: a new visitor completes the learning pilot described in the audit; no dead navigation links; core discovery works without JavaScript.

## R13 — Radiation explorer

**Files:** `lib/radiation/schemas.ts`, new `radiation-model.ts` and tests; `features/radiation/DoseExplorer.tsx` and tests; `app/radiation/page.tsx`; `tests/e2e/radiation.spec.ts`.

- [ ] Replace arbitrary quantity/unit strings with discriminated quantities: activity/Bq, absorbed dose/Gy, equivalent dose/Sv, effective dose/Sv, dose-rate with explicit time denominator. Require context, period/duration as applicable, source and review metadata. Prevent automatic Gy→Sv conversion without the required physical model.
- [ ] Write known-factor tests: 1 Sv =1000 mSv; 1 mSv =1000 µSv. Reject incompatible quantity/unit, negative/nonfinite input and missing exposure context. Test that equivalent and effective dose remain distinct despite sharing Sv; unit equality alone must not permit comparison or conversion between quantities. Zero has a dedicated display and never enters `log(0)`.
- [ ] Design one quantity-specific logarithmic explorer; filters must not mix different physical quantities on one axis. Show scientific quantity/unit and source next to analogies. No individual health-risk calculation or diagnostic advice.
- [ ] Implement keyboard-selectable scenarios, textual explanation and table from the same model. Test range ordering, source/date, chart/table agreement and zero/missing states.
- [ ] Obtain qualified health-physics/content review, browser matrix and reduced-motion equivalent before enabling route. Exit: reviewed scenarios teach distinctions accurately.

## R14 — Debate engine

**Files:** `lib/debate/schemas.ts`, `features/debate/DebateViewer.tsx`, citation resolver, `app/debates/[topic]/page.tsx`, `content/debates/`, component/schema tests and `tests/e2e/debate.spec.ts`.

- [ ] Model supporting, disputing and contextualizing claims with resolved evidence IDs; consensus/uncertainty statements also require attributable basis and date.
- [ ] First topic: waste, using reviewed content only. Render context and uncertainty currently discarded by the scaffold. Use narrative order and evidence strength, not equal-size columns implying equal support.
- [ ] Tests: all three argument relationships visible; unresolved published citation rejected; missing evidence shown; source links work at every level; consensus never displayed as an unsupported fact.
- [ ] Expand incrementally to the original roadmap topics: costs, safety, Chernobyl, Fukushima, proliferation, duration, renewables/nuclear roles, fossil replacement, uranium supply/mining, thorium and SMRs.
- [ ] Exit: one complete sourced topic per release, neutral editorial review, correct mobile reading order and full browser matrix.

## R15 — Reactor explorer

**Files:** extend `lib/reactor/schemas.ts`; `features/reactor/ReactorExplorer.tsx`, new selection model/tests, `app/reactors/page.tsx`, licensed/approved diagram assets and `tests/e2e/reactor.spec.ts`.

- [ ] Model parts and flow connections with stable IDs, labels, descriptions, citations and diagram coordinates. Distinguish concepts from deployed designs and operating context.
- [ ] Establish a PWR visual target and reviewed diagram asset first; use a public educational schematic, not invented engineering detail. Add matching text list before animation.
- [ ] Implement `selectPart(partId)` through one state path for diagram click and keyboard button; detail shows role, connected flows, simpler/deeper explanation and source.
- [ ] Tests: every selectable part has a labeled text control; no orphan connections; unknown selection resets safely; keyboard and click produce identical detail; no focus trap; reduced motion uses static steps.
- [ ] Extend BWR, PHWR/CANDU, RBMK, fast and molten-salt concepts only with reviewed mappings and variant distinctions. Exit per type: diagram/text equivalence and browser matrix, including no-hover mobile use.

## R16 — Facility directory, globe, then India

**Files:** `lib/globe/schemas.ts`, new `facility-model.ts`/tests, `features/globe/GlobeViewer.tsx`, `app/globe/page.tsx`; `lib/national/schemas.ts`, `features/national/NationalProfile.tsx`, `app/india/page.tsx`, data manifests and E2E tests for both.

- [ ] Add source/as-of/version, per-unit facility IDs, status history (operating/construction/shutdown/decommissioned), capacity basis (net/gross), and explicit unknown capacity. Mixed-status sites must not inherit a single incorrect unit status.
- [ ] Validate latitude/longitude ranges, dates/status transitions, duplicate IDs, capacity unknown versus zero, and source licensing. A historical slider requires historical records, not inference from today's status.
- [ ] Implement a server-readable directory first: country/status/year filters, source/date, detail link. Then lazy-load MapLibre from the same filtered result. Test identical map/list counts and IDs.
- [ ] Simulate WebGL failure, missing map asset and network failure: directory remains usable. Use `/globe?facility=<id>&country=<id>&status=<status>&year=<year>` for selection and filters. Validate each field independently; an unknown facility shows a not-found notice while preserving valid filters/list. Test keyboard filters, permalink/reload, a selected facility excluded by filters, and selection restoration.
- [ ] India: require distinct generation mix, installed capacity and primary-energy denominators, explicit year/unit/source and complete/partial coverage. Reject duplicates and sums outside a declared rounding tolerance for complete mixes; show missing share for partial mixes.
- [ ] Build reviewed PHWR, fleet history, three-stage, breeder and thorium narratives. Label 2050 outputs scenarios with assumptions; never merge different reference years silently.
- [ ] Exit: directory/map and India routes each pass schema/source review and browser matrix; multilingual expansion waits for translation/readability review.

## R17 — Annual grid learning simulator

**Files:** `lib/simulator/grid-model.ts`, `schemas.ts`, tests; `features/simulator/GridSimulator.tsx` and component tests; `app/grid/page.tsx`; `tests/e2e/grid.spec.ts`.

- [ ] Remove the hidden demand load factor 0.6 and peak-to-average demand inference; require explicit annual demand in MWh/year. Retain the existing per-technology generation capacity factors as separate explicit assumptions. Remove unused population/peak-demand fields from this version, or migrate old scenarios to an explicit annual-demand value only with a visible legacy-assumption notice. Require `hoursPerYear` to be exactly 8760 or 8784 for the selected non-leap/leap calendar year; reject zero, negative, NaN, Infinity and year/hour mismatch. Validate finite nonnegative capacity/demand and generation capacity factors in [0,1].
- [ ] Compute generation = Σ(capacityMW × capacityFactor × hoursPerYear), shortfall = max(demand−generation,0), surplus = max(generation−demand,0). For zero demand display coverage as not applicable. Otherwise annual energy coverage = min(generation/demand,1)×100; never call it reliability.
- [ ] Test 1000 MW ×0.9×8760 =7,884,000 MWh, all zeros, factor 0/1, fractional inputs, surplus/shortfall, invalid NaN/Infinity/negative, 8784-hour leap scenario. Annual balance cannot establish hourly adequacy; test/display that limitation explicitly.
- [ ] Add a client boundary only around controls. Numeric inputs and sliders share units, min/max and labels; keyboard step/reset works. URL/scenario serialization is versioned and validated.
- [ ] Emissions/land require reviewed factors with compatible boundaries; missing a factor returns partial output with excluded contribution, never zero impact. Show scientific values, equations, assumptions and source table.
- [ ] Exit: annual arithmetic and UI tests pass, all inputs affect declared outputs, browser matrix passes. Hourly storage/dispatch/reserves require separate validated model tasks.

## R18 — Ask ATOM after retrieval is ready

**Files:** `lib/ask/schemas.ts`, new retrieval/evaluation modules/tests, `features/ask/AskAtom.tsx`, `app/ask/page.tsx`, eventual server endpoint and `tests/e2e/ask.spec.ts`.

- [ ] Start with search and curated answers against the published catalog. Define an evaluation corpus with exact supported evidence IDs and expected abstentions before adding a model provider.
- [ ] Replace arbitrary confidence strings with answer states: idle/loading/answered/insufficient-evidence/error. Bind response to query ID; include resolved citations and limitations. No evidence means the policy's exact insufficient-evidence response.
- [ ] Evaluate at least 50 versioned cases spanning basic concepts, multi-source answers, contested claims, stale evidence, unanswerable questions and prompt injection. Require 100% resolved citations, 100% abstention on the designated unsupported set and zero draft/restricted leakage; independently assess whether each substantive claim is supported. Do not treat these tests as a guarantee against all hallucinations.
- [ ] Only after this retrieval gate, choose a provider and implement server-only credentials, request limits, cancellation/timeouts, redacted logs and grounded generation. No API key in client props.
- [ ] Test unresolved/mismatched citations, wrong query ID, malicious retrieved text, untrusted HTML, stale/contradictory evidence, retrieval error, timeout, cancel/retry and prompt length. Raw Markdown is not a safe renderer; sanitize/allowlist rendered content.
- [ ] UI supports question entry, explain simpler/go deeper/show maths/show sources, citation navigation and finite loading states. Exit: recorded evaluation and browser matrix pass before public enablement.

## R19 — Continuous evidence and product operations

**Files:** `scripts/evidence/` checks, CI schedule, `docs/engineering/RELEASE-PROMOTION.md`, correction/release records, tracker.

- [ ] Start with manual reproducible freshness/link/schema checks in R07; schedule them only after tested. Store last successful run, version and actionable failures.
- [ ] Every release records content/dataset versions, method changes, reviewed claims, browser/performance evidence and rollback target. Material corrections are visible and preserve previous versions.
- [ ] Review dependencies regularly in a dedicated change; run affected model and browser tests after upgrades. Do not quietly change unit factors or source methodologies in a styling task.
- [ ] Use aggregate learning/evidence engagement to identify confusion. Avoid collecting freeform questions, children's identities or cross-site tracking data as analytics.
- [ ] Rehearse rollback and correction after schema changes and at each category release. A scheduler file alone does not complete operations; record an actual successful run and a handled failure.

## Shared test and review matrix

Each implementing agent records which rows apply and evidence for each. “Not applicable” needs a reason; “not run” is incomplete, not a pass.

| Layer                  | Required procedure / oracle                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit/domain            | Exact-value tests from independent arithmetic or reviewed extraction; invalid units, dates, ranges, values, identity and publication states fail correctly                                |
| Component              | User-visible interaction and recovery, actual callback/state result, accessible labels, focus return; avoid testing internal hook implementation                                          |
| Repository integration | Actual local DB rows with separate public/privileged clients; draft/restricted/inactive evidence cannot escape; query error distinguishable from missing                                  |
| Ingestion integration  | Actual transaction, concurrency/idempotency, persisted review, failed-run audit and rollback; a memory store cannot substitute                                                            |
| E2E                    | Production build; deterministic fixture DB; route→interaction→evidence→return→reload/history; assert values/units/version and catch `pageerror` plus console errors                       |
| Responsive             | 390×844, 768×1024, 1440×900; additionally 320px reflow; all in light/dark; no core horizontal overflow or clipped actionable labels                                                       |
| Keyboard/assistive     | Tab/Shift-Tab, Enter/Space, Escape, arrow keys where the control pattern requires; focus trap only in dialogs, return focus to trigger, headings/main/labels; manual screen-reader sample |
| Zoom/motion            | Actual browser 200% zoom plus narrow CSS viewport reflow; these are separate checks. Reduced-motion retains equivalent learning steps                                                     |
| Accessibility          | axe on normal and open-overlay/error states; manually verify contrast, touch targets around 44px, no color-only meaning, no hover dependency                                              |
| No-JS/failure          | Lessons, evidence and list/table remain readable; slow/offline/map failure gives honest state, no indefinite spinner or fabricated fallback                                               |
| Evidence/editorial     | Source locator, licence, unit, period, geography, variant, boundary, transformation, representative rule, uncertainty and review date; same evidence across levels                        |
| Performance            | Record environment and multiple runs; project targets LCP <2.5s, Lighthouse Performance >90 and Accessibility/Best Practices/SEO >95; no invented benchmark result                        |
| Release                | Exact content/data versions, correction history, active release, previous-version rollback, no secret/log leaks, explicit unverified gates                                                |

## Verification commands and handoff format

Existing root commands: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run format:check`. `npm run verify` does not include E2E or database testing. R01/R07 must establish the DB scripts before an agent claims they ran successfully. Run formatting only on owned paths while unrelated changes remain dirty.

Task handoff must contain:

```text
Task ID / original stage:
Branch / HEAD / dirty files at start:
Dependencies satisfied with evidence:
Files changed and behavior delivered:
Regression observed before fix:
Commands and actual exit/results:
Browser viewports/themes/states checked:
Evidence/content/dataset version and real review status:
Review findings and resolutions:
Unverified gates / reason / next concrete action:
Commit (if made) and next unblocked task ID:
```

A successor begins with the first uncompleted dependency, not whichever feature is easiest to scaffold. A failed review reopens that task; update status in the delivery tracker and pending list in the same documentation change.
