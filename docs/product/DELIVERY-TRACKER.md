# ATOM Delivery Tracker

> **Single source of truth** for project status, task delegation, and verification.
> Last updated: 2026-09-07. Branch: `codex/atom-recovery-r01-r05` at `a4a3a4d`.

Reference documents (read before any implementation work):

- [AGENTS.md](../../AGENTS.md) — repository-wide agent rules and safeguards
- [Audit](2026-09-07-ATOMIC-ENERGY-EXPERIENCE-AUDIT.md) — current code findings and learning-library product target
- [Recovery plan](../superpowers/plans/2026-09-07-learning-platform-recovery.md) — full R01–R19 implementation spec with step-by-step test oracles
- Product docs in section 3 of AGENTS.md

---

## Quick Status

| Package | Status | Depends on | Commits |
|---------|--------|-----------|---------|
| R01 | ✅ Complete | — | `f398203` + `9af23af` |
| R02 | ✅ Complete | R01 | `4071221` |
| R03 | ✅ Complete | R01 | `f98d869` `a1f1be7` `443911e` `aba1c04` `a4a3a4d` |
| R04 | 🔲 **NEXT** | R01, R02 | — |
| R05 | 🔲 Pending | R02, R03, R04 | — |
| R06 | 🔲 Pending | R03, R05 | — |
| R07 | 🔲 Pending | R04, R05, R06 | — |
| R08-E | 🔲 Pending | R07 | — |
| R08-R | 🔲 Pending | R07 | — |
| R08-C | 🔲 Pending | R07 | — |
| R08-H | 🔲 Pending | R07 | — |
| R08-S | 🔲 Pending | R07 | — |
| R08-T | 🔲 Pending | R07 | — |
| R09 | 🔲 Pending | R08 | — |
| R10 | 🔲 Preparable | R01 (public rollout after R09) | — |
| R11 | 🔲 Pending | R09, R10 | — |
| R12 | 🔲 Pending | R11 | — |
| R13 | 🔲 Pending | R11, R12 | — |
| R14 | 🔲 Pending | R12 | — |
| R15 | 🔲 Pending | R12 | — |
| R16-G | 🔲 Pending | R12 | — |
| R16-I | 🔲 Pending | R12 | — |
| R17 | 🔲 Pending | R02, R08, R12 | — |
| R18 | 🔲 Pending | R12 | — |
| R19 | 🔲 Pending | R07 | — |

**Stage mapping:** R01 → Stages 0/2/6 · R02 → 5 · R03 → 7 · R04 → 6 · R05 → 7 · R06 → 4/8 · R07 → 9 · R08 → 10–15 · R09 → 16 · R10 → 1/17 · R11 → 17 · R12 → 1/17 · R13 → 18 · R14 → 19 · R15 → 20 · R16 → 21/22 · R17 → 23 · R18 → 24 · R19 → 25

---

## Global Build & Test Commands

Every agent must know these commands. Run from the repository root.

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm run typecheck` | TypeScript strict check | Must pass before commit |
| `npm run lint` | ESLint | Three pre-existing warnings are known |
| `npm test` | Vitest unit/integration suite | Currently 175+ tests across 31+ files |
| `npm run build` | Next.js production build | Must pass; confirms route list |
| `npm run test:e2e` | Playwright 3-browser E2E | Requires dev server or prod build |
| `npm run format:check` | Prettier format check | Run before commit |
| `npm run verify` | Format + typecheck + lint + test + build | Does NOT include E2E or DB |
| `npm run db:start` | Start local Supabase | Required for R04+ DB tasks |
| `npm run db:reset` | Reset disposable local DB | Apply canonical migration chain |
| `npm run db:test` | Run pgTAP database tests | 67 tests as of R01 baseline |
| `npm run db:lint` | Database lint/advisors | Run after migration changes |
| `npm run db:types` | Generate `database.types.ts` | Run after migration changes |

**Pre-edit checklist** (every agent, every task):

```bash
git status --short
git worktree list
git log -5 --oneline
```

Verify you are on `codex/atom-recovery-r01-r05`. Do not modify `main` or the delivery worktree.

---

## Execution Rules

1. Execute tasks in dependency order. Finish one usable slice before starting another.
2. A schema or mock component does not complete a stage. A successful build is not acceptance.
3. Missing evidence is never represented as zero, NaN, empty string, or an invented estimate.
4. Synthetic test fixtures must never enter production imports or public routes.
5. Do not invent reviewer identities, licensing decisions, or scientific approval.
6. Every numerical transformation gets a hand-derived expected-value test.
7. Commit only task-owned files after review. Leave unrelated scaffolds intact.
8. Read `AGENTS.md`, the audit, and the relevant recovery plan section before editing.

---

## Handoff Template

Every task completion must include this report:

```
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

Update this tracker after each task: change status, add commits, record any decision.

---

## Shared Test Matrix

Each task records which rows apply and evidence for each. "Not applicable" needs a reason.

| Layer | Required procedure |
|-------|-------------------|
| Unit/domain | Exact-value tests from independent arithmetic; invalid units/dates/ranges/values/identity/publication states fail correctly |
| Component | User-visible interaction and recovery, actual callback/state, accessible labels, focus return |
| Repository integration | Actual local DB rows with separate public/privileged clients; draft/restricted/inactive evidence cannot escape |
| Ingestion integration | Actual transaction, concurrency/idempotency, persisted review, failed-run audit and rollback |
| E2E | Production build; deterministic fixture DB; route→interaction→evidence→return→reload/history |
| Responsive | 390×844, 768×1024, 1440×900; additionally 320px reflow; all in light/dark |
| Keyboard/assistive | Tab/Shift-Tab, Enter/Space, Escape, arrow keys; focus trap only in dialogs; headings/main/labels |
| Zoom/motion | Actual browser 200% zoom + narrow CSS viewport reflow; reduced-motion retains equivalent steps |
| Accessibility | axe on normal and open-overlay/error states; contrast, touch targets ~44px, no color-only meaning |
| No-JS/failure | Lessons/evidence/lists readable; slow/offline/map failure gives honest state |
| Evidence/editorial | Source, licence, unit, period, geography, variant, boundary, transformation, representative rule |
| Performance | LCP <2.5s, Lighthouse Performance >90, Accessibility/BP/SEO >95; no invented benchmarks |
| Release | Exact content/data versions, correction history, active release, rollback, no secret leaks |

---

## Completed Tasks

### R01 — Reconcile the two implementations ✅

**Original stage:** 0, 2, 6 · **Completed:** 2026-09-07 · **Reviewed by:** independent agent review

**What was done:**
- Recovery snapshot of root (`ab0429c`) and delivery worktree (`c8cb58a`) 
- Chose delivery versioned migration chain as canonical (3 migrations)
- Created ADR 0009 documenting schema reconciliation decisions
- Made `scripts/ingest-reference.ts` fail closed (quarantined)
- Reconciled environment parsers, publishable/secret key split, server-only DB URL
- 175 tests passed, 67 pgTAP tests passed, lint/typecheck/build clean

**Evidence:** [ADR 0009](../decisions/0009-evidence-implementation-reconciliation.md), [verification record](../engineering/verification/2026-09-07-recovery-baseline.md)
**Commits:** `f398203` + `9af23af`

**Decisions recorded:**
- Delivery versioned schema is the canonical candidate; root migrations are historical reference
- Public Supabase parsing stays browser-safe; privileged API in server-only modules
- SSR clients use the canonical publishable-key pair

---

### R02 — Correct scientific unit factors ✅

**Original stage:** 5 · **Completed:** 2026-09-07 · **Reviewed by:** independent agent review

**What was done:**
- Corrected `ha/TWh` ↔ `m²/MWh` (factor: 0.01) and `t/TWh` ↔ `kg/MWh` (factor: 0.001)
- Added hand-derived regression tests with exact expected values
- Published unit derivation record
- Source observations remain immutable; affected derived outputs require versioned correction

**Evidence:** [task-2-report](../../.superpowers/sdd/2026-09-07-learning-platform-recovery/task-2-report.md)
**Commits:** `4071221`

---

### R03 — Fix URL parsing, compatibility and preference precedence ✅

**Original stage:** 7 · **Completed:** 2026-09-07 · **Reviewed by:** independent agent review (incl. fix re-review)

**What was done:**
- Per-field URL validation with independent fallback (one bad field doesn't invalidate others)
- Canonical emissions ID `lifecycle-ghg` with `lifecycle-emissions` alias
- Source deduplication, unknown-ID rejection, max 32 selection enforcement
- URL always serializes all 6 contract keys (sources, metric, region, mode, units, level)
- `ComparisonState` is canonical; URL > local preference > default precedence
- Comprehensive regression suite: absent fields, bad enums, whitespace, duplicates, round trips

**Evidence:** [task-3-report](../../.superpowers/sdd/2026-09-07-learning-platform-recovery/task-3-report.md)
**Commits:** `f98d869` + `a1f1be7` + `443911e` + `aba1c04` + `a4a3a4d`

**Decisions recorded:**
- URL state is canonicalized through `ComparisonState`
- Local complexity resolved only when `level` is absent; explicit shared URLs remain authoritative

---

## Pending Tasks — Full Delegation Instructions

---

### R04 — Complete the actual evidence lifecycle 🔲 **NEXT**

**Original stage:** 6 · **Depends on:** R01 ✅, R02 ✅ · **Task brief:** [task-4-brief.md](../../.superpowers/sdd/2026-09-07-learning-platform-recovery/task-4-brief.md)

**Goal:** Ship a working default transactional ingestion adapter with real Postgres tests, durable audit, review/publication/rollback lifecycle, and RLS verification. This completes Stage 6.

#### Prerequisites

- R01 reconciliation complete: delivery migration chain is canonical
- R02 unit corrections in place
- Local Supabase must be running (`npm run db:start`)
- Read: Stage 6 spec, R01 ADR/verification, existing `data/ingestion/` and `lib/evidence/governance.ts`
- Inspect `.worktrees/stage-6-9-delivery` read-only for partial orchestration code

#### Files to create/modify

| Action | File | Purpose |
|--------|------|---------|
| Modify | `data/ingestion/pipeline.ts` | Complete ingestion orchestration |
| Modify | `data/ingestion/quality.ts` | Post-normalization validation |
| Modify | `data/ingestion/publication.ts` | Review/publication transitions |
| Modify | `data/ingestion/parser-registry.ts` | Explicit parser selection |
| Create | `data/ingestion/postgres-store.ts` | Real default Postgres adapter |
| Create | `scripts/evidence/server-adapter.ts` | `createEvidenceCliDependencies()` |
| Modify | `scripts/evidence/ingest.ts` | CLI without user-supplied module path |
| Modify | `lib/evidence/governance.ts` | Prepublication validation |
| Create | CLI-generated migration | Review/ingestion schema changes |
| Create/modify | `supabase/tests/database/` | pgTAP tests for new schema |
| Regenerate | `lib/supabase/database.types.ts` | After migration |
| Create | `data/sources/eia-capacity-factor/` | Reference artifact contract |

#### What it consumes

- `IngestionManifest`, `IngestionStore`, `PublicationStore` interfaces
- Stage 5 schemas (`lib/evidence/`) and governance contracts
- Canonical migration chain from R01

#### What it produces

- `createEvidenceCliDependencies()` — default adapter using `SUPABASE_DATABASE_URL`
- Working CLI: `ingest`, `review`, `publish`, `activate`, `rollback` commands
- Durable ingestion audit (runs persist across failures)
- Transactional version/observation writes
- Immutable version history with append-only operation log

#### Implementation steps

1. **Read existing Stage 6 Task 5 review findings.** Implement remaining fixes rather than restarting. Write tests for: mismatched manifest dataset/source/licence, already-published parser inputs, duplicate IDs, duplicate composite identities, wrong canonical target, normalized-record incompatibility.

2. **Enforce manifest identity and validation.** Draft-only inputs, all three review roles (scientific/editorial/licensing), canonical unit equality with the metric, post-normalization validation before writing observations. Preserve immutable raw artifact references and transformation history.

3. **Implement the default adapter.** `createEvidenceCliDependencies()` uses validated server-only `SUPABASE_DATABASE_URL`. Parameterize SQL. Close the pool in `finally`. The CLI must NOT require `ATOM_EVIDENCE_INGESTION_ADAPTER` env var or user-supplied module path. Parser selection uses explicit registry, never arbitrary executable imports.

4. **Make ingestion audit durable.** Persist a run record before processing. Record successful stages. Write version/observations atomically. Mark failures outside rolled-back transaction with sanitized category/code. Enforce concurrent idempotency in PostgreSQL. Define retry behavior for failed/in-progress keys.

5. **Persist reviews.** Version ID, role, reviewer identity, timestamp, reviewed artifact/manifest identity. Reject duplicate role approvals. Reject one identity covering multiple roles. Synthetic reviewer IDs are test-only.

6. **Publication transitions.** Factor prepublication structural/scientific validation from visibility requirements. Reject withdrawn/published inputs for draft publication. Transition draft→in-review→published with metadata in one transaction. Preserve correction and chronology checks.

7. **Activate releases.** Privileged private function only. Preserve historical versions and append-only operation log. Publication ≠ feature release (a published version can remain feature-disabled).

8. **Replace memory-only tests with real Postgres tests.** Seed synthetic entities in disposable test DB. Verify persisted rows using a second connection, not mocks. Test:
   - Forced failure after partial writes (no partial publication survives)
   - Duplicate/concurrent ingestion
   - Missing review, duplicate reviewer
   - Restriction, publication transition, activation, rollback
   - Anon cannot read private reviews
   - Anon cannot write public evidence

9. **Parser contract.** Prepare a reference artifact contract. Parser tests use synthetic bytes and fail on: malformed header, duplicate row, missing row, nonnumeric cell. If real source artifact or qualified reviewers are unavailable, keep in review — do not invent.

#### Test commands

```bash
# Focused tests
npm test -- data/ingestion/
npm test -- lib/evidence/governance

# Database tests (requires local Supabase)
npm run db:start
npm run db:reset
npm run db:test
npm run db:lint

# Integration tests
npm test -- --grep "integration"

# Regenerate types after migration
npm run db:types

# Full verification
npm run typecheck
npm run lint
npm test
npm run build
```

#### Acceptance criteria

- [ ] Default CLI works WITHOUT `ATOM_EVIDENCE_INGESTION_ADAPTER` env var
- [ ] Transactional writes: forced failure leaves no partial publication
- [ ] Concurrent idempotency tested in real Postgres
- [ ] Review persistence with role/identity enforcement
- [ ] Publication state machine: draft → in-review → published in one transaction
- [ ] Activation/rollback preserves version history
- [ ] RLS: anon cannot read private reviews or write public evidence
- [ ] Durable audit: failed run is inspectable
- [ ] Parser tests fail on malformed input
- [ ] All existing tests still pass
- [ ] Typecheck, lint, build pass
- [ ] Commit report filed at `.superpowers/sdd/.../task-4-report.md`

---

### R05 — Build comparison results and resilient server loading 🔲

**Original stage:** 7 · **Depends on:** R02 ✅, R03 ✅, R04

**Goal:** Create a headless comparison engine that produces validated domain results with honest failure states. Separate application liveness from database readiness.

#### Prerequisites

- R04 complete (real evidence repository exists)
- R02 unit corrections in place
- R03 canonical `ComparisonState` available

#### Files to create/modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `features/comparison/comparison-engine.ts` | Core domain logic |
| Create | `features/comparison/comparison-engine.test.ts` | Domain tests |
| Create | `features/comparison/comparison-result.ts` | Result type definitions |
| Modify | `features/comparison/comparison-api.ts` | Replace internals with engine |
| Modify | `app/compare/page.tsx` | Wire engine results |
| Create | `app/compare/loading.tsx` | Loading state boundary |
| Create | `app/compare/error.tsx` | Error state boundary |
| Modify | `app/health/route.ts` | DB-independent liveness |
| Create | `app/ready/route.ts` | DB readiness probe |

#### Key types to implement

```ts
type ComparisonEntry =
  | { kind: "available"; technologyId: string; observationIds: readonly string[];
      scientificLabel: string; displayLabel: string; evidenceId: string; }
  | { kind: "missing" | "restricted" | "incompatible"; technologyId: string; message: string; };

type ComparisonResult = {
  state: ComparisonState;
  status: "ready" | "partial" | "empty" | "unavailable" | "error";
  entries: readonly ComparisonEntry[];
  effectiveGeographyId: string | null;
  datasetVersionIds: readonly string[];
  warnings: readonly string[];
};
```

#### Implementation steps

1. **Repository fixtures.** Deliberately shuffled by study, technology, geography. Use fake IDs and documented synthetic quantities. Keep fixtures outside production imports.

2. **Query logic.** Only active/published releases. Retain requested selection even for missing technologies. Check licensing independently of publication. Select representative only through explicit rule after unit normalization and comparability assessment.

3. **Geography filtering.** No silent geographic substitution. Where metric policy permits Global fallback, return effective geography and visible warning. Never label global data with the requested country.

4. **Value semantics.** Preserve points, ranges with range semantics, categorical values. Do NOT coerce `null`/strings to numbers. Separate: query failure, unknown metric, known-unreleased metric, empty observations.

5. **Liveness/readiness split.** `/health` is DB-independent and non-sensitive. `/ready` returns 200/503 with bounded DB check; client creation inside error handling; redact details. Point Playwright startup at liveness.

#### Required test cases

```
- Two regions never cross-contaminate
- Shuffled order yields same representative
- 1 kgCO2e/MWh normalizes to 1 gCO2e/kWh
- Range-only record retains endpoints
- Missing record has no numeric field
- Categorical value remains categorical
- Incompatible boundaries produce warning/blocked comparison
- Restricted raw observations not in rendered props
- Absent config → honest unavailable
- Client creation failure → 503
- Query failure → error result
- Timeout → bounded response
```

#### Test commands

```bash
npm test -- features/comparison/comparison-engine
npm test -- app/health app/ready
npm run typecheck && npm run lint && npm test && npm run build
```

#### Acceptance criteria

- [ ] Domain tests require no React or real DB
- [ ] Repository integration proves filtering
- [ ] No-secret/no-credential build works with honest unavailable results
- [ ] `/health` returns 200 without DB; `/ready` returns 503 without DB
- [ ] Empty results do not dereference nonexistent observations
- [ ] Output provenance IDs resolve to exact observations used

---

### R06 — Complete one coherent Comparison Lab journey 🔲

**Original stage:** 4, 8 · **Depends on:** R03 ✅, R05

**Goal:** Deliver the full working `/compare` interactive experience using the approved visual target and real evidence from R05.

#### Prerequisites

- R05 comparison engine complete
- R03 URL state contract in place
- Read existing `ComparisonLab.tsx`, `components/ui/`, `components/charts/`, `components/evidence/`

#### Files to create/modify

| Action | File | Purpose |
|--------|------|---------|
| Refactor | `features/comparison/ComparisonLab.tsx` | Split into sub-components below |
| Create | `features/comparison/ComparisonControls.tsx` | Source/metric/geography/mode controls |
| Create | `features/comparison/ComparisonResults.tsx` | Chart/table results display |
| Create | `features/comparison/ComparisonInterpretation.tsx` | Per-metric 5-level explanations |
| Create | `features/comparison/ComparisonEvidence.tsx` | DataPassport, ChallengeNumber |
| Modify | `tests/e2e/comparison-lab.spec.ts` | Full journey E2E |

#### Implementation steps

1. **Design first.** Record desktop/mobile target using approved reference and tokens. Design loading, empty, missing, error, range views before coding.
2. **Source management.** Add/remove/reorder/restore sources. One/zero selections valid. Auto-switch to table at 9 sources. Reuse `CommandMenu`, `OverlayPanel`, `Chip`.
3. **Metric search.** Grouped with definitions. Recent metric IDs stored locally. Recover from corrupt/blocked storage.
4. **Controls.** Geography, mode, units, view, reset, share. Clipboard failure → selectable canonical URL. Browser history records deliberate changes; rapid changes cannot clobber via stale props.
5. **Chart semantics.** Bar/range/distribution by supported semantics. Line/scatter only with real time-series data. Table/text alternatives always available.
6. **Interpretations.** Per-metric five-level explanations. Unknown/unavailable → honest state. All five levels preserve evidence IDs.
7. **Evidence UI.** Shared DataPassport and ChallengeNumber. Source/study links, version, boundary, uncertainty, alternatives.
8. **Full journey test:** open → remove Coal → add Hydro → change metric → Range → passport → challenge → share → reload → back/forward → identical state.

#### Test commands

```bash
npm test -- features/comparison/
npm run test:e2e -- comparison-lab
npm run verify
```

#### Acceptance criteria

- [ ] Complete interaction against reviewed test evidence
- [ ] All result states verified (loading, empty, partial, missing, error, range)
- [ ] Browser history preserves all selections across reload/back/forward
- [ ] No console/page/hydration errors in browser matrix
- [ ] Mobile vertical composition works at 390px
- [ ] Share URL produces identical state for recipient

---

### R07 — Release, CI and monitoring foundation 🔲

**Original stage:** 9 · **Depends on:** R04, R05, R06

**Goal:** Repeatable local/CI acceptance pipeline, privacy-respecting analytics, category release registry, and rollback drill.

#### Prerequisites

- R04 evidence lifecycle (DB tests)
- R06 Lab journey (E2E target)

#### Files to create/modify

| Action | File |
|--------|------|
| Create/modify | `.github/workflows/ci.yml` |
| Modify | `package.json` (scripts) |
| Modify | `playwright.config.ts` |
| Modify | `lib/analytics/tracker.ts` |
| Create | Analytics tracker tests |
| Modify | `components/observability/WebVitals.tsx` |
| Modify | `docs/engineering/RELEASE-PROMOTION.md` |
| Modify | `docs/engineering/ENVIRONMENT-SETUP.md` |

#### Implementation steps

1. **CI job.** Disposable Supabase: pinned deps → start DB → reset → pgTAP → lint/advisors → type drift check → repository/ingestion integration → stop (always step).
2. **E2E seed.** Deterministic configuration. No live hosted DB dependency or production credentials.
3. **Analytics.** Per-event payload validators. Reject email, free text, full query URLs. No-op transport when disabled. Record INP/LCP/CLS.
4. **Release registry.** Availability by metric, version, geography, modes. Feature-disabled evidence cannot become public by URL.
5. **Monitoring scripts.** Stale-source and broken-link reports with timeout and bounded concurrency. "Check inconclusive" ≠ "claim false."
6. **Rollback drill.** Correction and previous-version activation in disposable DB.
7. **Performance budgets.** Measured bundle size and hydration cost per route. Mobile LCP <2.5s, CLS ≤0.1.

#### Acceptance criteria

- [ ] CI runs actual DB tests
- [ ] Full browser journey passes in CI
- [ ] Privacy payload tests pass
- [ ] Rollback works in disposable DB
- [ ] Release procedure names concrete commands
- [ ] Bundle sizes measured and recorded

---

### R08 — Release the complete metric catalog (6 sub-tasks) 🔲

**Original stage:** 10–15 · **Depends on:** R07

**Goal:** Release reviewed evidence one category at a time. Definitions alone are not reviewed evidence.

**For EACH category (R08-E through R08-T), execute ALL steps in order:**

1. Enumerate every metric and technology/geography/period/mode combination
2. Define quantity, unit, valid sign/range, technology variant, boundary, comparison rule
3. Acquire primary/institutional artifacts, confirm reuse rights, checksum and preserve
4. Write parser/transformation tests with exact values, missing cells, range definitions, duplicates
5. Ingest into draft version. Check source/study relationships, normalized values, boundary compatibility
6. Author all five explanation levels against the same evidence IDs
7. Record real scientific/editorial/licensing decisions
8. Run category checks + R06 browser matrix; activate reviewed release

#### Sub-tasks

| ID | Stage | Category | Key metrics | Critical oracle |
|----|-------|----------|-------------|-----------------|
| R08-E | 10 | Environment | Lifecycle GHG, land, water withdrawal/consumption, materials, mining intensity, waste volume, persistence/toxicity | Withdrawal ≠ consumption; lifecycle ≠ operational; stock/flow units preserved |
| R08-R | 11 | Reliability | Capacity factor, dispatchability, variability, firm capacity/credit, storage dependence | Capacity factor ≠ capacity credit; geography/grid scenario visible |
| R08-C | 12 | Economics | Capital, operating, fuel, LCOE, construction duration, lifetime, decommissioning, financing | Currency year/currency/discount rate/market/vintage required |
| R08-H | 13 | Human impact | Mortality/TWh, air pollution, occupational, accident risk, displacement | Direct/modelled/occupational/evacuation distinct |
| R08-S | 14 | Security | Energy density, stockpiling, import dependence, supply concentration | Fuel form/processing/country/trade year/scenario explicit |
| R08-T | 15 | Technical | Power density, thermal efficiency, refueling cycle, unit capacity | Technology variants explicit; no thermal efficiency on nonthermal systems |

#### Files per category

- `lib/evidence/metrics.ts` (metric definitions)
- `data/sources/<dataset-id>/` (source artifacts)
- `data/transforms/` (transformations)
- `content/metrics/` (five-level explanations)
- `docs/evidence/reviews/<date>-<dataset-id>.md` (review records)
- `docs/releases/<date>-<category>.md` (release notes)

**Important:** Test code must use observed fixture values from reviewed artifacts, NOT made-up scientific values. Synthetic fixtures are for software mechanics only.

---

### R09 — Full Comparison Lab V1 acceptance 🔲

**Original stage:** 16 · **Depends on:** R08

**Goal:** Validate every released metric/technology/geography combination works end-to-end. Produce the Lab V1 release record.

#### Files

- `tests/e2e/regression-drills.spec.ts`
- Evidence/repository tests
- `docs/engineering/verification/<date>-comparison-v1.md`
- `docs/releases/<date>-comparison-v1.md`

#### Steps

1. Compare spec metric IDs to registry coverage. Fail on omission, duplicate ID, or unsupported mode marked available.
2. Test a representative journey per released category asserting values, units, versions, geography, source links.
3. Test old aliases/shared URLs, invalid URLs, one/zero/nine technologies, all levels, raw restrictions, alternative studies, stale links, partial data, backend failure.
4. Complete source-correction/cache-invalidation/version-rollback drills.
5. Run full responsive/browser/performance matrix.
6. Record full catalog coverage including unavailable combinations.

---

### R10 — Content catalog and curriculum contracts 🔲

**Original stage:** 1, 17 · **Depends on:** R01 ✅ (public rollout after R09)

> **Can begin preparation now**, since it only depends on R01. Public release waits for R09.

**Goal:** Validated content graph for lessons, topics, search, and navigation. Seven-lesson curriculum definition.

#### Files

| Action | File |
|--------|------|
| Extend | `lib/education/schemas.ts` |
| Create | `lib/education/catalog.ts`, `catalog.test.ts` |
| Create | `lib/education/content-validation.ts`, `content-validation.test.ts` |
| Create | `content/topics/catalog.json` |
| Create | `content/lessons/` (seven lesson records) |
| Create | `content/glossary/` |
| Create | `docs/product/KNOWLEDGE-COVERAGE.md` |

#### Key type

```ts
type LessonRecord = {
  id: string; slug: string; title: string; topicId: string;
  objective: string; prerequisiteIds: readonly string[];
  conceptIds: readonly string[]; claimIds: readonly string[];
  contentByLevel: Record<ComplexityLevel, string>;
  checkpointIds: readonly string[];
  nextLessonId: string | null;
  status: "draft" | "in-review" | "published" | "withdrawn";
  version: string; lastVerifiedAt: string;
};
```

#### Steps

1. Implement strict runtime schemas reusing existing identifiers/levels
2. Test: missing level, duplicate slug, unknown topic/concept/claim, dangling next lesson, cyclic prerequisites, draft in published list
3. Create topic records for every audit coverage register row
4. Define seven lesson IDs: `energy`, `atom`, `fission`, `reactor`, `electricity-generation`, `safety`, `waste`
5. Build `getPublishedLesson(slug)` and `listPublishedLessons()` — drafts/withdrawn return no public record
6. Content paths resolve only within checked repository content

#### Acceptance criteria

- [ ] Content graph validates without React
- [ ] Published lists cannot expose draft content
- [ ] Authors have a concrete template with required evidence fields

---

### R11 — One complete lesson, then seven-lesson path 🔲

**Original stage:** 17 · **Depends on:** R09, R10

**Goal:** Server-readable lessons with purposeful interactions, checkpoints, and optional local progress.

#### Files

- `app/learn/page.tsx`, `app/learn/[lesson]/page.tsx`, loading/not-found boundaries
- `features/education/LessonViewer.tsx`, `LessonInteraction.tsx`, `LessonCheckpoint.tsx`
- `lib/education/progress.ts` and tests
- `tests/e2e/learning-path.spec.ts`

#### Steps

1. Establish desktop/mobile lesson target: breadcrumb, objective, prose, interaction, checkpoint, sources, next
2. Implement `/learn/energy` first. Test: 1000 MW × 0.90 × 8760 h = 7,884,000 MWh
3. Route tests: direct slug load, unknown slug 404, draft unavailable, title/metadata, one main landmark
4. Server-render explanation and sources; hydrate only controls. No-JS: lesson remains readable
5. Checkpoint: labeled answer control, submit, explanatory feedback, retry
6. Local progress: `atom:learning-progress:v1` key, lesson ID/version/completion only. Handle corrupt JSON, unavailable storage
7. Test level changes preserve lesson URL/context/answers
8. Browser matrix on first lesson, then add remaining six

---

### R12 — Homepage, discovery, glossary, search and evidence pages 🔲

**Original stage:** 1, 17 · **Depends on:** R11

**Goal:** A small navigation structure with complete reachable destinations.

#### Files

- `app/page.tsx`, `app/topics/`, `app/explore/`, `app/search/`, `app/glossary/`, `app/evidence/`
- Source/study/dataset routes, `/about`, `/accessibility`, `/corrections`
- `lib/search/index.ts` and tests
- `tests/e2e/discovery.spec.ts`

#### Steps

1. Homepage: hero → three questions → featured exhibit → topics → evidence promise
2. Learn and topic routes. Omit unreleased exhibits from navigation
3. Search: `SearchDocument { id, type, title, summary, href, topicIds, keywords }`. Substring/token matching. Server-rendered GET form, `q` capped at 200 chars. Do not log search text
4. Glossary: plain/scientific definitions, lesson links, citations
5. Source/study/version routes: only published allowed metadata. 404 unknown/draft
6. Sitemap/canonical only for published stable pages
7. Route/link integrity test: every catalog href resolves, no draft, one H1/main per page

---

### R13 — Radiation explorer 🔲

**Original stage:** 18 · **Depends on:** R11, R12

**Goal:** Quantity-safe radiation dose explorer with reviewed scenarios.

#### Files

- `lib/radiation/schemas.ts`, `radiation-model.ts` and tests
- `features/radiation/DoseExplorer.tsx` and tests
- `app/radiation/page.tsx`
- `tests/e2e/radiation.spec.ts`

#### Key rules

- Discriminated quantities: activity/Bq, absorbed dose/Gy, equivalent dose/Sv, effective dose/Sv
- Prevent automatic Gy→Sv without physical model
- Known-factor tests: 1 Sv = 1000 mSv = 1,000,000 µSv
- Zero display dedicated, never `log(0)`
- No individual health-risk calculation or diagnostic advice

---

### R14 — Debate engine 🔲

**Original stage:** 19 · **Depends on:** R12

**Goal:** Balanced debate pages with context, citations, and uncertainty.

#### Files

- `lib/debate/schemas.ts`, `features/debate/DebateViewer.tsx`, citation resolver
- `app/debates/[topic]/page.tsx`, `content/debates/`
- `tests/e2e/debate.spec.ts`

#### Key rules

- Supporting, disputing, and contextualizing claims with resolved evidence IDs
- First topic: waste (reviewed content only)
- Narrative order + evidence strength, NOT equal-size columns
- Expand incrementally: costs, safety, Chernobyl, Fukushima, proliferation, etc.

---

### R15 — Reactor explorer 🔲

**Original stage:** 20 · **Depends on:** R12 + approved exhibit target

**Goal:** Reviewed reactor parts/flows explorer with diagram/text/keyboard equivalence.

#### Files

- `lib/reactor/schemas.ts`, `features/reactor/ReactorExplorer.tsx`
- `app/reactors/page.tsx`
- `tests/e2e/reactor.spec.ts`

#### Key rules

- Parts and flow connections with stable IDs, labels, descriptions, citations
- PWR first with public educational schematic
- `selectPart(partId)` through one state path for diagram click AND keyboard
- Every selectable part has a labeled text control; reduced motion uses static steps

---

### R16-G — Facility directory and globe 🔲

**Original stage:** 21 · **Depends on:** R12

**Goal:** Dated facility directory (server-readable list) then lazy MapLibre map.

#### Files

- `lib/globe/schemas.ts`, `facility-model.ts` and tests
- `features/globe/GlobeViewer.tsx`, `app/globe/page.tsx`

#### Key rules

- Per-unit facility IDs, status history, capacity basis (net/gross), explicit unknown capacity
- Server-readable directory first; map is lazy-loaded
- Test identical map/list counts and IDs
- WebGL failure → directory still usable

### R16-I — India experience 🔲

**Original stage:** 22 · **Depends on:** R12

**Goal:** Sourced India national profile with explicit generation/capacity context.

#### Files

- `lib/national/schemas.ts`, `features/national/NationalProfile.tsx`
- `app/india/page.tsx`

#### Key rules

- Distinct generation mix, installed capacity, and primary-energy denominators
- Explicit year/unit/source and complete/partial coverage
- PHWR, fleet history, three-stage programme, breeder, thorium narratives
- 2050 outputs labeled as scenarios with assumptions

---

### R17 — Annual grid learning simulator 🔲

**Original stage:** 23 · **Depends on:** R02 ✅, R08, R12

**Goal:** Explicit annual grid arithmetic with honest controls. Remove hidden 0.6 load factor. Annual balance ≠ hourly reliability.

#### Files

- `lib/simulator/grid-model.ts`, `schemas.ts`, tests
- `features/simulator/GridSimulator.tsx`
- `app/grid/page.tsx`
- `tests/e2e/grid.spec.ts`

#### Key formulas

```
generation = Σ(capacityMW × capacityFactor × hoursPerYear)
shortfall = max(demand − generation, 0)
surplus = max(generation − demand, 0)
coverage = min(generation / demand, 1) × 100  (NOT "reliability")
```

#### Required test cases

```
- 1000 MW × 0.9 × 8760 = 7,884,000 MWh
- All zeros
- Factor 0 and factor 1
- Fractional inputs
- Surplus and shortfall
- Invalid NaN/Infinity/negative
- 8784-hour leap scenario
```

---

### R18 — Ask ATOM 🔲

**Original stage:** 24 · **Depends on:** R12 + mature retrieval

**Goal:** Evaluated retrieval against published catalog, then Ask UI with citation support and abstention.

#### Files

- `lib/ask/schemas.ts`, retrieval/evaluation modules
- `features/ask/AskAtom.tsx`, `app/ask/page.tsx`
- `tests/e2e/ask.spec.ts`

#### Key rules

- Start with search/curated answers against published catalog (no LLM required initially)
- 50+ versioned evaluation cases: basic concepts, multi-source, contested, stale, unanswerable, injection
- 100% resolved citations, 100% abstention on unsupported set, zero draft/restricted leakage
- Only AFTER retrieval gate: choose provider, server-only credentials, rate limits, redacted logs
- No API key in client props. Sanitize/allowlist rendered content

---

### R19 — Continuous evidence and product operations 🔲

**Original stage:** 25 · **Depends on:** R07 (starts there; maintained every release)

**Goal:** Scheduled freshness/link/schema checks, release records, correction procedures, rollback rehearsals.

#### Steps

1. Start with manual reproducible checks in R07; schedule only after tested
2. Every release records: content/data versions, method changes, reviewed claims, browser/performance evidence, rollback target
3. Review dependencies regularly in dedicated change; run affected tests after upgrades
4. Aggregate learning/evidence engagement. No freeform questions, children's identities, or cross-site tracking
5. Rehearse rollback and correction at each category release

---

## Critical Path to First Public Release

```
R04 (evidence lifecycle) → R05 (comparison engine) → R06 (Lab journey)
→ R07 (CI/release) → R08-E (first evidence category: Environment) → R09 (Lab V1 acceptance)
```

This produces a working Comparison Lab with one reviewed evidence category.

**Parallel track:** R10 (content catalog) can begin preparation now alongside R04–R07.

---

## External Gates (not local implementation)

These are ACTUAL blockers that require human decisions or external systems:

| Gate | What's needed | Which tasks blocked |
|------|--------------|---------------------|
| Scientific review | Qualified scientist reviews real evidence | R08 publication, R13 scenarios |
| Editorial review | Qualified editor reviews content/tone | R08 explanations, R11 lessons, R14 debates |
| Licensing review | Source reuse rights confirmed | R08 artifact acquisition |
| Hosted deployment | Vercel preview browser inspection | Stage 2 final gate |
| Supabase production | Migration on hosted DB | R07 CI, production release |

A task is "Blocked" only when its next step CANNOT proceed. Label the missing input; continue independent work.

---

## Historical Stage Records

### Stages 0–5: Foundation (Complete)

| Stage | Area | Status | Evidence |
|-------|------|--------|----------|
| 0 | Repository & governance | ✅ Complete | `docs/decisions/`, commit `d85726c` |
| 1 | Product & info architecture | ✅ Complete | `docs/product/INFORMATION-ARCHITECTURE.md`, commit `0dd6922` |
| 2 | Application & quality foundation | ⚠️ Locally verified | Verification: `docs/engineering/verification/2026-08-30-stage-2-platform-foundation.md`, commit `5f020d4`. Preview browser check pending. |
| 3 | Visual direction | ✅ Complete | Commits `4ef92ff`–`674da5f` |
| 4 | Design system & shell | ✅ Complete | Verification: `docs/engineering/verification/2026-08-30-stage-4-completion.md`, commits `0dde134`, `d80ea27` |
| 5 | Evidence domain & governance | ✅ Complete | Verification: `docs/engineering/verification/2026-08-31-stage-5-evidence-domain.md` |

### Stages 6–25: Recovery Plan (R01–R19)

See [Quick Status](#quick-status) and [Pending Tasks](#pending-tasks--full-delegation-instructions) above.

### Existing Code Worth Keeping

- **Stage 4:** Shell, preference controls, semantic tokens, accessible overlays, evidence primitives, chart/table foundations
- **Stage 5:** Schemas, representative selection, comparability and conversion framework (corrected in R02)
- **Delivery worktree:** Versioned DB/RLS, repository contracts, ingestion orchestration (after R01 reconciliation and R04 completion)
- **Later scaffolds:** Schemas/components as starting references only; lack full provenance, routes, and interactions

---

## Decision Log

| Date | Decision |
|------|----------|
| 2026-09-07 | Delivery versioned schema is the canonical implementation candidate; root migrations are historical reference |
| 2026-09-07 | Keep root recovery work checkpointed; do not infer completion from a successful build or scaffolds |
| 2026-09-07 | Public Supabase parsing browser-safe; privileged API in server-only modules; SSR clients use publishable-key pair |
| 2026-09-07 | Corrected two intensity conversion families with hand-derived expected values; affected derived outputs require versioned correction |
| 2026-09-07 | URL state canonicalized through `ComparisonState`; local complexity resolved only when `level` is absent |
| 2026-09-07 | Consolidated tracking into single DELIVERY-TRACKER.md; archived PENDING-TASKS.md, DEVELOPMENT-LOG.md, and SDD progress.md |
