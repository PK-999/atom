# R02 implementation report

Task ID / original stage: R02 / Stage 5 scientific unit factors

Branch / HEAD / dirty files at start: `codex/atom-recovery-r01-r05` at
`9af23af`; the worktree was clean at task start. R01's canonical versioned
schema decision and recovery baseline were present. The delivery worktree was
not edited.

Dependencies satisfied with evidence: R01 was reviewed and accepted by the
recovery baseline; the existing `convertUnit` and `normalizeObservation`
contracts and their complete observation fixture were available. No hosted
database, ingestion command, publication operation, or source observation was
modified.

Files changed and behavior delivered:

- `lib/evidence/units.test.ts` now has hand-derived regression oracles for
  both directions of `ha/TWh` ↔ `m2/MWh` and `t/TWh` ↔ `kg/MWh`, nonfinite
  values, cross-dimension conversion, range endpoints, and source
  nonmutation.
- `lib/evidence/unit-registry.ts` now uses `0.01` for `ha/TWh` relative to
  `m2/MWh` and `0.001` for `t/TWh` relative to `kg/MWh`.
- `docs/evidence/UNIT-DERIVATIONS.md` records the arithmetic, reviews every
  current registry family, explains why currency-year/market adjustments are
  contextual, and records the correction/version policy.

Regression observed before fix: the new tests initially failed five cases.
The old registry returned `10,000,000` instead of `0.01` for `1 ha/TWh`,
`0.0000001` instead of `100` in the reverse direction, `1` instead of
`0.001` for `1 t/TWh`, `1` instead of `1,000` in the reverse direction, and
incorrectly converted range endpoints using the same bad area factor.

Commands and actual exit/results:

- `npm test -- lib/evidence/units.test.ts`: pass, 1 file and 22 tests.
- `npm run typecheck`: pass.
- `npm run lint`: pass with three pre-existing warnings in
  `features/simulator/GridSimulator.tsx`, `lib/ask/schemas.ts`, and
  `lib/debate/schemas.ts`.
- `npm test`: pass, 41 files and 191 tests; 1 file/test skipped. Four
  pre-existing Node `localStorage` experimental warnings remain.
- `npm run build`: pass on Next.js 16.3.3 webpack; the existing five
  application routes built.
- Read-only search of current metric definitions, source/data directories,
  ingestion records, database fixtures, and conversion callers found no
  published derived records using the affected units in this checkout.

Browser viewports/themes/states checked: not applicable. This task changes
headless scientific conversion rules and tests only; no UI route or browser
state changed.

Evidence/content/dataset version and real review status: no scientific source
artifact, observation, dataset, or publication version was acquired or
changed. The correction note documents that any future derived output made
with the old factors must be superseded by an immutable, reviewed dataset or
observation version rather than overwritten.

Review findings and resolutions: independent review is pending. The
implementation deliberately kept the existing registry API and changed only
the two incorrect factors, while extending tests and derivation documentation.

Unverified gates / reason / next concrete action:

- No hosted database or released evidence was touched; R04 owns transactional
  ingestion and publication verification.
- No browser/E2E check was required for this headless unit task.
- A task reviewer should inspect the factor arithmetic, registry-family table,
  and full-suite results. After acceptance, R03 is the next unblocked task.

Commit (if made) and next unblocked task ID: implementation commit to be
recorded below after the task-owned files are committed; next task R03.
