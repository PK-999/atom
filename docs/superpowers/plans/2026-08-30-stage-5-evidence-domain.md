# Stage 5 Evidence Domain and Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a framework-independent, tested evidence domain that can
validate observations, select justified representative values, normalize
units, assess comparability, and enforce editorial publication rules.

**Architecture:** Zod schemas define immutable evidence records in
`lib/evidence`; pure functions implement range validation, representative
selection, conversion, comparability, freshness, availability, and publication
workflow. UI code may consume these exports later, but the domain imports no
React, Next.js, database, or browser modules.

**Tech Stack:** TypeScript 6, Zod 4, Vitest.

**Spec:** `docs/product/EVIDENCE-AND-EDITORIAL-POLICY.md`,
`docs/product/TECHNICAL-ARCHITECTURE.md`,
`docs/product/METRIC-COVERAGE.md`, and
`docs/product/CONTENT-AND-EVIDENCE-STATES.md`

## Global Constraints

- No scientific observation values are invented or shipped as fixtures.
- Every published quantitative observation requires provenance, geography,
  period, methodology, system boundary, transformation, licensing, and
  verification metadata.
- Numeric confidence scores are never fabricated.
- Raw observations are publishable only when redistribution licensing permits.
- Unit conversion rejects different physical dimensions.
- Methodologically incompatible records remain visible as an explicit result,
  not silently normalized into comparability.
- Domain modules import no React or UI code.

---

### Task 1: Entity and observation schemas

**Files:**
- Create: `lib/evidence/schemas.ts`
- Create: `lib/evidence/schemas.test.ts`
- Create: `lib/evidence/index.ts`

**Interfaces:**
- Produces Zod schemas and inferred types for technology, metric, numeric and
  categorical observation, source, study, dataset, citation, claim, explanation,
  geography, correction, and publication record.

- [ ] Write failing table-driven tests for a complete numeric observation, a
  categorical observation, and every required entity relationship.
- [ ] Add failing cases for absent provenance, reversed ranges, point/range
  semantic mismatch, invalid periods, empty methodology/boundary, and missing
  licensing/verification metadata.
- [ ] Run `npm test -- lib/evidence/schemas.test.ts` and confirm missing-module
  failure.
- [ ] Implement Zod schemas with discriminated unions and range refinements.
- [ ] Run the focused suite and confirm valid fixtures parse while every invalid
  fixture fails for the intended contract.

### Task 2: Unit registry and explicit human equivalents

**Files:**
- Create: `lib/evidence/units.ts`
- Create: `lib/evidence/units.test.ts`

**Interfaces:**
- Produces: `normalizeObservation(observation, targetUnit)`,
  `convertUnit(value, from, to)`, `canConvertUnit(from, to)`, and
  `calculateHumanEquivalent(input)` with caller-supplied assumptions.

- [ ] Write failing literal-expectation tests for emissions, power, energy,
  duration, percentage/ratio, and identity conversions.
- [ ] Add failing tests for incompatible dimensions, unknown units, non-finite
  inputs, and range-bound conversion.
- [ ] Write a failing human-equivalent test proving the result records the exact
  caller-supplied assumption and preserves the scientific value/unit.
- [ ] Implement a canonical unit registry with dimension and base-unit factor;
  keep analogy assumptions outside the registry.
- [ ] Run the focused suite and mutation-check every conversion branch.

### Task 3: Representative-value policies

**Files:**
- Create: `lib/evidence/representative.ts`
- Create: `lib/evidence/representative.test.ts`

**Interfaces:**
- Produces: `selectRepresentative(observations, rule)` for `mean`, `median`,
  `central-estimate`, `regulator-value`, and `model-default` rules.

- [ ] Write failing tests with hand-derived mean and odd/even median literals.
- [ ] Write failing tests for central/regulator/model selection by explicit
  observation metadata.
- [ ] Add failing cases for empty inputs, categorical records, mixed metrics,
  missing required representative kind, and non-comparable units.
- [ ] Implement the minimum pure selection logic and a typed error result.
- [ ] Run the focused suite and confirm source observations are never mutated.

### Task 4: Comparability assessment

**Files:**
- Create: `lib/evidence/comparability.ts`
- Create: `lib/evidence/comparability.test.ts`

**Interfaces:**
- Produces: `assessComparability(observations)` returning normalized issue codes,
  severity `warning | blocker`, affected observation IDs, and a final
  `comparable` boolean.

- [ ] Write failing tests for identical records, convertible units, incompatible
  units, metric mismatch, geography mismatch, non-overlapping periods,
  methodology mismatch, and system-boundary mismatch.
- [ ] Verify the tests fail because the assessment module is absent.
- [ ] Implement deterministic assessment rules: convertible-unit and period
  differences warn; physical-dimension, metric, methodology, and boundary
  differences block; geography differences block unless records are explicitly
  global.
- [ ] Run the focused suite and confirm issue order is stable for editorial use.

### Task 5: Availability, freshness, and publication governance

**Files:**
- Create: `lib/evidence/governance.ts`
- Create: `lib/evidence/governance.test.ts`
- Create: `docs/evidence/DOMAIN-GOVERNANCE.md`

**Interfaces:**
- Produces: availability union `supported | partial | incompatible | unavailable
  | restricted | disputed | stale`, `assessFreshness`, `canPublishObservation`,
  `canPublishRawObservation`, and `transitionPublication`.

- [ ] Write failing tests for review intervals, fresh/stale boundary dates,
  publication metadata completeness, raw redistribution licensing, anonymous
  draft protection, disputed evidence, and allowed/forbidden workflow
  transitions.
- [ ] Run the focused suite and confirm governance behavior is absent.
- [ ] Implement Tier A/B/C source classification, conflict disclosure,
  redistribution licence policy, draft/review/published/withdrawn workflow, and
  correction-history requirements.
- [ ] Document source tiers, representative rules, stale/disputed/missing
  representation, licensing, correction, review, and publication responsibilities.
- [ ] Run the focused suite and scan the governance document for unsupported
  claims or ambiguous state transitions.

### Task 6: Domain boundary and contract integration

**Files:**
- Modify: `lib/evidence/index.ts`
- Create: `lib/evidence/contracts.test.ts`
- Modify: `docs/product/DELIVERY-TRACKER.md`

**Interfaces:**
- Re-exports the Stage 5 public API and proves it can be imported in a plain Node
  TypeScript module without React, browser, or database setup.

- [ ] Write a contract test that parses records, normalizes an observation,
  selects a representative, assesses comparability, and evaluates publication
  eligibility through only `lib/evidence` exports.
- [ ] Run the test and confirm the incomplete barrel/API fails.
- [ ] Complete the domain barrel and resolve type inconsistencies without adding
  framework imports.
- [ ] Run all evidence tests and the repository suite.
- [ ] Update the tracker only when every Stage 5 exit criterion is evidenced.

### Task 7: Stage 5 verification and review

**Files:**
- Create: `docs/engineering/verification/2026-08-30-stage-5-evidence-domain.md`
- Modify: this plan

- [ ] Run `npm run verify`.
- [ ] Run `npm run test:e2e` to prove the domain addition does not regress UI.
- [ ] Run `npm audit --audit-level=high`.
- [ ] Run `git diff --check` and inspect dependency/import boundaries.
- [ ] Request independent scientific-domain and code review; resolve every
  Critical and Important issue with a regression test where applicable.
- [ ] Record remaining limitations, decisions, and release notes.
- [ ] Merge locally only after the Stage 4 and Stage 5 gates both pass.
