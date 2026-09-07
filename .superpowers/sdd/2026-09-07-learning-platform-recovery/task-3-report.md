# R03 implementation report

Task ID / original stage: R03 / Stage 7 typed URL and preference contract

Branch / HEAD / dirty files at start: `codex/atom-recovery-r01-r05` at
`4071221`; the worktree contained the interrupted R03 edits in
`app/compare/page.tsx`, `components/settings/ComplexitySelector.test.tsx`,
`docs/decisions/0004-url-state.md`, `features/comparison/ComparisonLab.tsx`,
`features/comparison/comparison-api.ts`,
`features/comparison/comparison-types.ts`,
`features/comparison/comparison-url.ts`, and
`features/comparison/test-fixtures.ts`, plus the untracked URL test. The
delivery worktree was not edited.

Dependencies satisfied with evidence: R01 reconciliation and its independent
review fixes are recorded in the recovery baseline and ADR 0009. R02's exact
unit corrections and derivation record were accepted in `4071221` and
`task-2-report.md`. No hosted service, ingestion path, evidence observation,
or R04/R05 behavior was changed.

Files changed and behavior delivered:

- `features/comparison/comparison-types.ts` now owns the canonical
  `ComparisonState` shape with ordered `sources`, display mode, units, metric,
  region, and complexity level.
- `features/comparison/comparison-url.ts` now provides canonical
  `parseComparisonState`/`serializeComparisonState` APIs and preserves the
  legacy wrappers. Parsing validates each field independently, trims and
  deduplicates known sources in first-seen order, preserves explicit empty
  selections, restores defaults only for omitted/all-invalid nonempty source
  input, accepts the `lifecycle-emissions` alias as canonical
  `lifecycle-ghg`, accepts known unreleased metric IDs, warns and bounds source
  identifiers at 64 characters and 32 accepted IDs, and always serializes all
  six keys in deterministic order.
- The strict exported Zod state schema validates the six-field runtime shape;
  parser output is checked through it so raw query strings cannot leak into
  `ComparisonState`.
- `app/compare/page.tsx`, `ComparisonLab.tsx`, the comparison API type boundary,
  and test fixtures use `ComparisonState` and canonical serialization. ADR 0004
  records the alias, ordering, limits, empty selection, and six-key URL rules.
- `features/comparison/comparison-url.test.ts` covers invalid-field isolation,
  absent/bad enums, whitespace, duplicate/unknown/empty/one/nine/32/33 source
  selections, repeated keys for both input forms, Unicode/oversized input,
  alias/unreleased metrics, round trips, schema strictness, warnings, and
  preference precedence.
- `components/settings/ComplexitySelector.test.tsx` covers valid URL over
  local storage over default, invalid URL fallback, history changes, blocked
  storage, cross-tab updates, and explicit URL authority.

Regression observed before fix: the existing interrupted focused suite passed,
but a new strict-schema regression test failed because the previous
`ComparisonUrlSchema` silently stripped unknown keys. The schema was made
strict with the source/identifier bounds, parser output was validated through
it, and the focused suite passed.

Commands and actual exit/results:

- `npm test -- --run features/comparison/comparison-url.test.ts`: pass, 22
  tests.
- `npm test -- --run features/comparison/comparison-url.test.ts components/settings/ComplexitySelector.test.tsx`:
  pass, 2 files and 34 tests.
- `npm run typecheck`: pass.
- `npm test`: pass, 42 files; 218 tests passed and 1 skipped. Four pre-existing
  Node localStorage experimental warnings remain.
- `npm run lint`: exit 0 with the three pre-existing warnings in
  `features/simulator/GridSimulator.tsx`, `lib/ask/schemas.ts`, and
  `lib/debate/schemas.ts`.
- `npm run format:check`: pass.
- `npm run build`: pass on Next.js 16.3.3 webpack; the existing application
  routes built successfully.

Browser viewports/themes/states checked: no real browser run was performed.
The existing component harness covers URL history, storage failure, and
cross-tab preference states in jsdom; browser back/forward and responsive
Comparison Lab acceptance remain part of R06.

Evidence/content/dataset version and real review status: no scientific source
artifact, dataset, observation, publication, or review decision was acquired or
changed. Known metric IDs are accepted as state so later result loading can
report unavailable evidence honestly; no value is fabricated here.

Review findings and resolutions: independent R03 review is pending. The
implementation replacement reviewed all partial caller changes and retained
only the callers needed to consume the canonical `ComparisonState` API.

Unverified gates / reason / next concrete action:

- No hosted database or released evidence was touched; R04 owns transactional
  ingestion/publication and R05 owns repository-backed comparison results.
- No browser/E2E, responsive, accessibility-browser, or hosted deployment gate
  was run; those require the later R06 journey and an executable preview.
- A task reviewer should inspect the source catalog assumptions, warning
  semantics, and the exact URL/preference contract before R05 begins.

Commit (if made) and next unblocked task ID: implementation commit
`f98d8696d423620d1ae11b5ee5652e425b38c8a1`; the task report was committed in
`a1f1be7a3b0cdbb908bf8b5bf2198167f9163fca`. Next dependency-ordered task is
R04 (R05 remains blocked on R04 and its other prerequisites).
