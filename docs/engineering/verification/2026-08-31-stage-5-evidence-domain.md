# Stage 5 Evidence Domain and Governance Verification

Date: 2026-08-31

Branch: `feat/stage4-stage5-completion`

Implementation checkpoints: `e315054`, `e143824`, `b33b55b`, `8a015cc`,
`23e5b44`

## Scope

This record covers the Stage 5 exit gate: framework-independent evidence
schemas, immutable observations, ordered transformation lineage, canonical unit
conversion, explicit human-equivalent assumptions, representative selection,
comparability, availability/freshness states, full relationship publication
governance, licensing-aware Raw eligibility, corrections, and workflow rules.

No real scientific values are included. Every test observation is explicitly
synthetic contract data.

## Delivered contracts

- Numeric and categorical metrics use separate discriminated contracts;
  categorical metrics do not invent units.
- Published observations require provenance, geography, period, methodology,
  system boundary, uncertainty, ordered transformations, licensing, and a valid
  verification date.
- Parsed records and normalized outputs are deeply frozen. Unit normalization
  deep-clones nested data, preserves prior transformation kinds, and appends a
  conversion step only when a conversion occurs.
- Mean and median aggregation accepts convertible units but refuses differing
  period, geography, methodology, or system boundary. Explicit
  central/regulator/model rules require exactly one marked observation.
- Comparability returns stable warning/blocker codes and treats fewer than two
  observations as insufficient rather than comparable.
- Metric release records include `unreviewed` and declare technologies,
  geographies, period, Typical/Range/Raw availability, and redistribution
  licensing before a supported state is valid.
- Availability status and mode declarations cannot contradict one another:
  unavailable exposes no mode, restricted exposes no available mode, partial
  must identify actual coverage, and incompatible cannot expose Typical or
  Range as directly comparable.
- Every supported numeric unit is registered and dimensionally convertible to
  its canonical unit; categorical records cannot use mean or median metadata.
- Publication eligibility validates observation, source, study, dataset,
  dataset version, metric contract, geography, technology, publication record,
  study method/boundary/period, and observation/dataset licence consistency.
- Raw eligibility builds on the complete publication gate and requires allowed
  redistribution from observation, dataset, and authoritative source.
- Source access cannot predate publication; public publication cannot predate
  review. The full graph also orders source access, material correction,
  post-correction observation/dataset verification, review, and publication.
- Confidence, credible, and prediction intervals require a coverage level;
  source-defined intervals require a display label.
- The public barrel imports no React, Next.js, browser, Supabase, or database
  modules.

## Verification evidence

| Check | Result |
| --- | --- |
| Evidence-focused suite | 84 tests across 6 files passed |
| `npm run verify` | Format, strict types, lint, 144 tests across 22 files, and production build passed |
| `npm run test:e2e` | 31 passed across Chromium, Firefox, and WebKit; two non-WebKit touch-test copies skipped by design |
| Touch tooltip regression | Touch-enabled WebKit trigger-toggle and outside-pointer dismissal passed |
| Accessibility | axe, keyboard, focus restoration, zoom, reduced motion, mobile reflow, and direct evidence access passed |
| `npm audit --audit-level=high` | 0 vulnerabilities |
| Framework boundary scan | No React, Next.js, browser, Supabase, or database imports in production evidence modules |
| `git diff --check` | Passed |

## Independent review

The first Stage 5 review reported no Critical issues and seven Important
issues: touch tooltip dismissal, incomplete publication relationships and
licence authority, aggregation across incompatible evidence, categorical
metric units, mutability, lost transformation lineage, and missing chronology.
Each has a focused regression and implementation fix. A second review found no
Critical issues and four additional Important contract gaps: release coverage,
unit dimensions/categorical representative metadata, cross-entity chronology,
and interval labels. A focused follow-up found two additional Important gaps:
contradictory availability status/mode combinations and corrections that could
be reviewed without post-correction observation and dataset verification. All
findings are fixed with focused regressions. The next follow-up found one final
Important gap allowing a correction to predate source access; source access now
precedes correction, reverification, review, and publication in both the policy
and tested gate. The final re-review found no remaining Critical, Important, or
Minor issues and declared the branch merge-ready.

## Remaining limitations

- The unit registry establishes the Stage 5 families only. Each metric release
  must add literal conversion tests before using another unit.
- Review intervals, source selection, and disputed-evidence judgments remain
  editorial decisions; the domain enforces their recorded outcomes.
- Cross-entity validation currently receives an explicit in-memory publication
  context. Stage 6 must enforce the same graph with database constraints,
  transactions, and row-level security.
- Checksums, ingestion idempotency, duplicate detection, transformation logs,
  and dataset rollback are Stage 6 work.
- GitHub-hosted CI and a Vercel preview remain external Stage 2 checks.

## Gate result

Passed. All local technical, browser, accessibility, dependency, and review
checks pass. One Firefox navigation timed out in the first complete browser
run; the exact case then passed three consecutive isolated runs, and two later
complete 33-case matrices passed cleanly.
