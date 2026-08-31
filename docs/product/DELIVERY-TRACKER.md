# ATOM Delivery Tracker

Last updated: 2026-09-01

Last verified implementation commit: `f49c141`

Current branch: `main`

This is the operational tracker for the ATOM Master Delivery To-Do. Product
specifications remain authoritative when this summary and a source document
conflict.

## Status Rules

| Status | Meaning |
| --- | --- |
| Complete | The stage exit gate passed and verification evidence is recorded. |
| Locally verified | Local acceptance checks passed, but an external environment check remains. |
| In progress | The current implementation stage. Its exit gate has not passed. |
| Prototype only | Useful interface work exists, but the production domain/evidence contracts are incomplete. |
| Foundation only | Shared test or operational infrastructure exists, but the stage-specific gate is incomplete. |
| Not started | No stage deliverable is accepted. Research or incidental code does not change this status. |
| Blocked | Work cannot progress without a named decision, permission, source, or external system. |

Progress is gate-based. A prototype is never counted as a scientific release,
and an unsupported comparison is never marked complete by inserting an
unverified value.

## Portfolio Snapshot

| Stage | Delivery area | Status | Gate | Next acceptance target |
| ---: | --- | --- | --- | --- |
| 0 | Repository and governance | Complete | Passed | Keep ADRs and requirements matrix current. |
| 1 | Product and information architecture | Complete | Passed | Revise contracts only through reviewed product-document changes. |
| 2 | Application and quality foundation | Locally verified | External checks pending | Run GitHub CI and a Vercel preview on the pinned Node runtime. |
| 3 | Visual direction selection | Complete | Passed | Preserve the approved Digital Science Museum / Scientific Editorial blend. |
| 4 | Design system and application shell | Complete | Passed | Reuse the verified shell and primitive contracts in the flagship. |
| 5 | Evidence domain and governance | Complete | Passed | Preserve the contracts while Stage 6 adds database enforcement. |
| 6 | Supabase and ingestion platform | Not started | Not passed | Design migrations and prove one licensed observation through the pipeline. |
| 7 | Headless comparison engine | Not started | Not passed | Implement tested URL state and comparison-domain APIs. |
| 8 | Shared Comparison Lab experience | Prototype only | Not passed | Replace preview fixtures with reviewed repository-backed test evidence. |
| 9 | Release and observability foundation | Foundation only | Not passed | Add monitoring, analytics, category registry, performance budgets, and rollback drills. |
| 10 | Environment metrics | Not started | Not passed | Research and review lifecycle greenhouse-gas emissions first. |
| 11 | Reliability and grid metrics | Not started | Not passed | Define geography- and grid-sensitive operational metrics. |
| 12 | Economics metrics | Not started | Not passed | Define currency year, geography, financing, vintage, and market boundaries. |
| 13 | Human impact metrics | Not started | Not passed | Define neutral, method-aware impact categories and review protocol. |
| 14 | Energy security metrics | Not started | Not passed | Define geography, trade period, processing, and scenario boundaries. |
| 15 | Technical metrics | Not started | Not passed | Define technology-variant and operating-context boundaries. |
| 16 | Comparison Lab V1 | Not started | Not passed | Begin only after category releases 10–15 pass their gates. |
| 17 | Nuclear 101 | Not started | Not passed | Begin after Comparison Lab V1 per approved roadmap override. |
| 18 | Radiation Explorer | Not started | Not passed | Define tested radiation quantities and analogy safeguards. |
| 19 | Debate Engine | Not started | Not passed | Define claim/evidence/consensus/uncertainty model. |
| 20 | Reactor Explorer | Not started | Not passed | Define reactor-system model before rendering work. |
| 21 | Nuclear Globe | Not started | Not passed | Define versioned facility ingestion and accessible map fallback. |
| 22 | India Experience | Not started | Not passed | Complete national evidence and context research first. |
| 23 | Grid / Power-a-City Simulator | Not started | Not passed | Define and test the annual arithmetic model. |
| 24 | Ask ATOM | Not started | Not passed | Wait for mature evidence retrieval and citation coverage. |
| 25 | Continuous operations | Not started | Not passed | Activate alongside the first public evidence release. |

## Current Focus

### Stage 5 — Evidence Domain and Editorial Governance

Status: **Complete**

Exit gate: **Passed**

Current verification:

- 84 evidence-domain tests pass across six focused suites.
- `npm run verify` passes with 144 tests across 22 files and a production build.
- 31 browser checks pass across Chromium, Firefox, and WebKit; two non-WebKit
  copies of the WebKit-only touch regression are intentionally skipped.
- The high-severity dependency audit reports zero vulnerabilities.
- Independent reviews found no Critical issues. All fourteen Important issues
  have regression-tested fixes; the final re-review found no remaining
  Critical, Important, or Minor issues.
- Verification record:
  `docs/engineering/verification/2026-08-31-stage-5-evidence-domain.md`.

### Stage 4 — Design System and Application Shell

Status: **Complete**

Exit gate: **Passed**

Accepted or implemented:

- [x] Approved dark Museum visual tokens exist in the Comparison Lab.
- [x] Route-wide semantic surface, text, border, interaction, and focus token
  names exist.
- [x] The five-level complexity selector is a shared component rather than
  Comparison Lab-owned UI.
- [x] Complexity preference persistence has focused tests, including blocked
  browser storage.
- [x] The current Lab provides skip navigation, visible focus, direct values,
  table fallback, evidence dialogs, and reduced-motion behavior.
- [x] Build the shared application shell, navigation, footer, metadata, and
  theme handling outside the Comparison Lab feature.
- [x] Synchronize complexity with the URL contract while keeping URL precedence
  over local preference.
- [x] Build and test the shared control families: buttons, chips, segmented
  controls, drawers, dialogs, sheets, tabs, tooltips, skeletons, and state
  panels.
- [x] Promote Data Passport, Challenge This Number, Evidence Badge, confidence,
  and methodology UI into shared evidence primitives.
- [x] Promote comparison bars, ranges, distributions, narrative summaries, and
  table fallback into shared chart primitives.
- [x] Define loading, empty, partial, missing, stale, error, disabled, hover,
  focus, selected, mobile, and dark/light states for every promoted primitive.
- [x] Add a component playground or Storybook-equivalent route.
- [x] Verify keyboard operation, focus, contrast, touch targets, 200% zoom,
  responsive composition, light/dark themes, and reduced motion across the
  shared primitives.

Current slice verification:

- Focused review-regression suites: 28 tests passed.
- `npm run verify`: format, strict types, lint, 57 tests across 16 files, and the
  production build passed.
- `npm run test:e2e`: 30 checks passed across Chromium, Firefox, and WebKit,
  including axe, pre-hydration theme resolution, mobile reflow, keyboard focus,
  200% zoom equivalent, and reduced motion.
- Responsive design regression: 1440×900, 768×1024, and 390×844 light/dark
  playground captures and the Comparison Lab remain aligned with the approved
  Museum/Editorial direction.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Independent review: no Critical issues; five Important and three Minor issues
  were resolved with regression tests and smaller server/client boundaries.
- Verification record:
  `docs/engineering/verification/2026-08-30-stage-4-completion.md`.
- Implementation checkpoints: `0dde134`, `d80ea27`.

## Completed Stage Records

### Stage 0 — Repository and Governance Baseline

Status: **Complete**  
Gate: **Passed locally**

- [x] Comparison-Lab-first ordering decision recorded.
- [x] Git repository, default branch, ignore policy, and baseline history exist.
- [x] Requirements matrix assigns delivery stages, checks, and owners.
- [x] Evidence storage, rendering, URL state, accessibility, analytics,
  environments, and bundler decisions are recorded.
- [x] Repository boundaries and service setup checklists are documented.
- [x] Preview, staging, production, promotion, and rollback rules are documented.

Evidence:

- `docs/decisions/`
- `docs/product/REQUIREMENTS-MATRIX.md`
- `docs/engineering/REPOSITORY-BOUNDARIES.md`
- `docs/engineering/ENVIRONMENT-SETUP.md`
- `docs/engineering/RELEASE-PROMOTION.md`
- Commit `d85726c`

### Stage 1 — Product and Information Architecture

Status: **Complete**  
Gate: **Passed**

- [x] Route map and rendering ownership defined.
- [x] Casual, student, technical, skeptical, and mobile journeys defined.
- [x] Five-level complexity, persistence, and URL precedence defined.
- [x] Complete metric research register and coverage dimensions defined.
- [x] Neutral language, evidence limitation, correction, stale, and mismatch
  states defined.
- [x] Privacy-conscious analytics allowlist and prohibited data defined.
- [x] Technical, evidence, accessibility, performance, and product measures
  defined.

Evidence:

- `docs/product/INFORMATION-ARCHITECTURE.md`
- `docs/product/COMPARISON-JOURNEYS.md`
- `docs/product/COMPLEXITY-BEHAVIOR.md`
- `docs/product/METRIC-COVERAGE.md`
- `docs/product/CONTENT-AND-EVIDENCE-STATES.md`
- `docs/product/ANALYTICS-AND-SUCCESS.md`
- Commit `0dd6922`

### Stage 2 — Application and Quality Foundation

Status: **Production deployed; preview verification pending**
Gate: **Local and hosted CI gates passed; preview browser gate pending**

- [x] Next.js App Router, React, TypeScript, Tailwind, and server-first defaults
  scaffolded with pinned versions.
- [x] Supported runtime and package-manager workflow documented.
- [x] Formatting, strict typechecking, linting, environment validation, and
  security headers configured.
- [x] Vitest, Testing Library, Playwright, axe, and three-browser coverage
  configured.
- [x] CI quality and browser jobs defined.
- [x] Public and server-only environment contracts separated.
- [x] Minimal health route and server-rendered foundation routes built.
- [x] Local production build and cross-browser verification passed.
- [x] Clean-install quality, build, and three-browser gates passed in isolated
  containers on the exact pinned Node.js 24.20.0 runtime.
- [x] GitHub-hosted CI run confirmed for `main` at `00c03be` (workflow run
  `33449480327`, quality and browser jobs passed).
- [x] Vercel preview deployment completed for non-main ref `1f8119e` in
  Preview environment: `https://atom-lvnhos7k9-pks-projects-35b7ae41.vercel.app`.
- [ ] Authenticated browser inspection of the protected Vercel preview remains
  pending.

External prerequisite audit on 2026-09-01: GitHub is connected and the hosted
CI workflow passes for `f49c141` (run `33451557726`, quality and browser jobs
passed). Vercel production deployment `6191571046` for `f49c141` completed
successfully at
`https://atom-389hpmvt1-pks-projects-35b7ae41.vercel.app`. A non-main preview
deployment `6191641954` for `1f8119e` also completed successfully at
`https://atom-lvnhos7k9-pks-projects-35b7ae41.vercel.app`. Both deployments are
protected by Vercel SSO, so authenticated route/browser inspection remains
pending. Supabase remains intentionally unconnected until Stage 6.
Supabase remains intentionally unconnected until Stage 6.

Evidence:

- `docs/engineering/verification/2026-08-30-stage-2-platform-foundation.md`
- `docs/releases/2026-08-30-platform-foundation.md`
- Commit `5f020d4`

Test-harness hardening is included in the current verification pass: the
Playwright server port is configurable with `PLAYWRIGHT_PORT`, existing local
servers are never reused unless `REUSE_E2E_SERVER=true`, and the primary
comparison journey waits for hydration/network idle and each state transition.

### Stage 3 — Visual Direction Selection

Status: **Complete**  
Gate: **Passed**

- [x] Three visual directions were evaluated: Scientific Editorial, Digital
  Science Museum, and Data Laboratory.
- [x] Desktop and mobile Comparison Lab states were considered.
- [x] Hierarchy, evidence access, chart clarity, density, interaction,
  accessibility, and responsive behavior were evaluated.
- [x] The user selected the second option: Digital Science Museum.
- [x] Scientific Editorial restraint was retained as an explicit influence.
- [x] Selected and rejected directions are documented.
- [x] Palette, type, spacing, chart, focus, motion, and source-marker principles
  are documented.
- [x] The approved direction has a verified responsive Comparison Lab prototype.

Evidence:

- `docs/superpowers/specs/2026-08-30-comparison-lab-visual-direction.md`
- `docs/design/references/comparison-lab-digital-science-museum.png`
- `docs/design/qa/`
- Commits `4ef92ff` through `674da5f`

## Flagship Delivery Detail

### Stage 5 — Evidence Domain and Editorial Governance

Status: **Complete**

Acceptance sequence:

- [x] Define technology, metric, observation, source, study, dataset, citation,
  claim, explanation, and geography schemas.
- [x] Encode provenance, methodology, boundary, range, licensing,
  transformation, and verification rules.
- [x] Test representative-value and comparability policies.
- [x] Test canonical conversions, analogy formulas, and range semantics outside
  React.
- [x] Define source-tier, conflict, correction, review, and publication flows.
- [x] Prove the domain can evaluate evidence without React imports.
- [x] Obtain final independent re-review with no Critical or Important findings.

### Stage 6 — Supabase and Evidence Ingestion

Status: **Not started**

Acceptance sequence:

- [ ] Design reviewed PostgreSQL migrations and publication/version fields.
- [ ] Enforce public reads for published evidence and deny anonymous writes.
- [ ] Implement checksum, validation, normalization, conversion, QA, derivation,
  review, and publication steps.
- [ ] Preserve source metadata, access date, version, licence, checksum, and
  transformations.
- [ ] Test idempotency, duplicates, rollback, stale metadata, broken links, and
  unsupported units.
- [ ] Publish one real licensed reference observation through the complete
  inspectable pipeline.

### Stage 7 — Headless Comparison Engine

Status: **Not started**

Acceptance sequence:

- [ ] Test and implement URL parsing, serialization, defaults, and independent
  invalid-parameter fallback.
- [ ] Test technology selection, reordering, restore, filtering, and sorting.
- [ ] Test Typical, Range, and Raw projections without source mutation.
- [ ] Test units, geography, periods, missing data, mismatch, outliers, zero,
  negative values, and extreme ranges.
- [ ] Implement repository-backed comparison results and provenance references.
- [ ] Implement typed, non-identifying analytics events.

### Stage 8 — Shared Comparison Lab Experience

Status: **Prototype only**

Already demonstrated in the preview:

- [x] Approved responsive layout and useful five-technology default.
- [x] Source removal and compact mobile source expansion.
- [x] Typical/Range/Raw control with honest unavailable preview states.
- [x] Direct values, visible units, accessible summary, and table fallback.
- [x] Five explanation levels without changing the displayed evidence.
- [x] Preview Data Passport and Challenge This Number dialogs.
- [x] Mobile vertical composition, evidence sheet behavior, and focus
  restoration.

Still required for the production gate:

- [ ] Reviewed test evidence from the repository interface.
- [ ] Complete technology search/sheets and grouped metric search.
- [ ] Working geography, units, restore, share, and canonical URL controls.
- [ ] Semantic chart selection for all supported metric types.
- [ ] Production loading, empty, partial, missing, stale, error, and mismatch
  states.
- [ ] Complete evidence content, licensing-aware Raw mode, canonical sharing,
  history behavior, and SEO comparison pages.

### Stage 9 — Release and Observability Foundation

Status: **Foundation only**

Available foundation:

- [x] Three-browser production-artifact E2E runner.
- [x] axe integration, console failure checks, keyboard/focus checks,
  reduced-motion checks, and responsive viewport coverage for the prototype.

Still required:

- [ ] Complete URL-reload flagship journey.
- [ ] Error, performance, ingestion, stale-dataset, and broken-source monitoring.
- [ ] Privacy-respecting production analytics.
- [ ] Category availability registry and independent release controls.
- [ ] Dataset rollback and source correction drills.
- [ ] Bundle, hydration, LCP, CLS, and lazy-loading budgets.
- [ ] Browser, content, evidence, accessibility, performance, and rollback
  release checklists.

### Stages 10–15 — Metric Category Releases

Status: **Not started**

Every category must repeat the same gate: define → source → license → ingest →
review → explain L1–L5 → verify evidence interactions → run scientific,
editorial, accessibility, responsive, E2E, and performance QA → publish a
versioned dataset.

| Stage | Category | Required metrics | Category-specific gate |
| ---: | --- | --- | --- |
| 10 | Environment | Lifecycle GHG, land, water withdrawal/consumption, materials/mining, defensible waste metrics | First public Lab category; every value is reviewed and inspectable. |
| 11 | Reliability and grid | Capacity factor, dispatchability, variability, defensible capacity credit, labeled storage scenarios | Geography and grid conditions stay visible. |
| 12 | Economics | Capital, operating, fuel, LCOE, duration, lifetime, defensible decommissioning, financing scenarios | Currency year, geography, vintage, financing, and market context stay visible. |
| 13 | Human impact | Mortality, air pollution, occupational impacts, accidents, defensible displacement | Direct, modelled, occupational, evacuation, and long-term impacts remain distinct. |
| 14 | Energy security | Energy density, stockpiling, import dependency, supply concentration | Geography, trade period, processing, and scenario assumptions stay visible. |
| 15 | Technical | Power density, thermal efficiency, refuelling cycle, unit capacity | Technology variants and operating context remain explicit. |

### Stage 16 — Comparison Lab V1 Completion

Status: **Not started**

- [ ] Audit the complete specification catalog and disclose every unsupported,
  partial, incompatible, unavailable, or license-restricted combination.
- [ ] Run cross-category, URL, alternative-study, Raw-mode, link, stale-data,
  correction, and rollback regression drills.
- [ ] Verify mobile, tablet, desktop, 200% zoom, light/dark, and reduced motion
  with no console or hydration errors.
- [ ] Meet LCP and Lighthouse targets and complete scientific/editorial review.
- [ ] Publish full-catalog release notes.

## Later Roadmap Detail

| Stage | Product | First implementation gate | Final release gate |
| ---: | --- | --- | --- |
| 17 | Nuclear 101 | Five-level lesson schema and seven evidence-backed lesson outlines | Scientific, classroom, mobile, accessibility, and browser review pass. |
| 18 | Radiation Explorer | Tested activity, dose, dose-rate, contamination, and irradiation models | Log explorer plus table/text/keyboard/reduced-motion alternatives pass review. |
| 19 | Debate Engine | Claim/support/dispute/context/consensus/uncertainty schema | Incremental topics pass source, tone, method, legal/safety, and editorial review. |
| 20 | Reactor Explorer | Framework-independent reactor-system and variant model | Guided/expert, static/text, mobile, accessibility, and reduced-motion views pass. |
| 21 | Nuclear Globe | Versioned facility ingestion and geographic validation | Map, time, filters, list fallback, weak-device/mobile access, and monitoring pass. |
| 22 | India Experience | Fleet/history evidence model and neutral context review | Map, narrative, scenarios, and multilingual/readability considerations pass. |
| 23 | Grid Simulator | Tested annual demand/generation/capacity/emissions/land arithmetic | Assumptions, uncertainty, accessible tables, reference validation, and browser performance pass. |
| 24 | Ask ATOM | Evidence retrieval and citation coverage meet readiness threshold | Grounding, citation, injection, rate-limit, privacy, and failure evaluations pass. |
| 25 | Continuous operations | Scheduled freshness, link, ingestion, accessibility, dependency, and performance checks | Versions, corrections, scientific re-review, analytics, and browser regressions remain current. |

## Update Protocol

Update this tracker at every stage checkpoint:

1. Record the date, branch, and last verified commit.
2. Change a status only when its definition above is satisfied.
3. Link the implementation plan, test evidence, browser/design QA, review, and
   release note.
4. Record exact verification commands and outcomes.
5. Name external checks separately from local checks.
6. List blockers with an owner and the decision or system needed to clear them.
7. Never count preview evidence as published evidence.
8. Never mark a stage complete while its exit gate has an undisclosed failure.
