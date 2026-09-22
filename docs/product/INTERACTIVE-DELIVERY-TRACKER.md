# ATOM Interactive Delivery Tracker

> Working tracker for the interactive experience described in
> [INTERACTIVE-EXPERIENCE-PLAN.md](INTERACTIVE-EXPERIENCE-PLAN.md). Update this
> file in every meaningful delivery commit. A checked task means its listed
> verification was actually completed, not merely scaffolded.

Last updated: 2026-09-21

## Current task

**I01 — Homepage atom identity** is implemented and awaiting dependency-backed
verification.

## Delivery queue

| ID | Deliverable | Dependencies | Status | Verification |
| --- | --- | --- | --- | --- |
| I00 | Restore the authoritative recovery audit and tracker | — | Blocked: source documents absent from current tree | Confirm files and reconcile branch history |
| I01 | Add a lightweight, reduced-motion-safe atom visual to the homepage hero | — | In progress | Component test, typecheck, lint, build, browser screenshots |
| I02 | Add shared `InteractiveFigure` frame | I01 | Queued | Keyboard, pause/reset, fallback and reduced-motion tests |
| I03 | Add opt-in global sound preference and Web Audio adapter | I02 | Queued | Default-muted, persistence, cleanup and visual-feedback tests |
| I04 | Rebuild the fission lesson as the first complete interactive lesson | I02 | Queued | Domain, component, E2E, evidence and browser review |
| I05 | Replace the homepage directory-first layout with “Power a future” | I02, I04 | Queued | Mobile/desktop, keyboard, axe, performance and evidence review |
| I06 | Connect existing simulators to lessons | I04 | Queued | Per-simulator model and accessible-alternative tests |
| I07 | Complete Comparison Lab release states | I00 | Queued | URL, unit, missing-data, evidence, table and E2E tests |
| I08 | Add role-based learning paths and resume progress | I04 | Queued | Catalog, persistence, corruption and navigation tests |
| I09 | Build reviewed India energy-pathways experience | I07, I08 | Queued | Scientific/editorial/licensing review and scenario tests |
| I10 | Apply shared visual grammar site-wide | I02–I09 | Queued | Full responsive, theme, motion, accessibility and performance matrix |

## I01 acceptance checklist

- [x] Uses SVG/CSS rather than adding a graphics dependency.
- [x] Is decorative and hidden from assistive technology.
- [x] Uses existing semantic theme tokens.
- [x] Stops animation when reduced motion is requested.
- [x] Adds a component assertion for the visual stage.
- [ ] Component test passes (blocked: local `vitest` executable is absent).
- [ ] Typecheck passes (not reached after the missing test executable).
- [ ] Lint passes (not reached after the missing test executable).
- [ ] Production build passes (not reached after the missing test executable).
- [ ] Browser verified at mobile and desktop sizes.
- [ ] Dark and light themes inspected.
- [ ] Console inspected.

## Update protocol

For each task, record the changed behavior, exact command results, browser sizes
and themes, evidence/content version, known limitations, and commit SHA. Only one
task may be marked in progress at a time. Do not begin a dependent task until
its prerequisites and acceptance checks are complete.

## Delivery log

### 2026-09-21 — I01 started

- Added a CSS-animated atomic diagram to the existing onboarding hero.
- Used no new runtime dependency and no scientific numeric claim.
- Added explicit reduced-motion behavior and kept the graphic decorative.
- `npx prettier --write` completed for all four task-owned files.
- `npm test -- --run components/onboarding/OnboardingHero.test.tsx` could not
  start because this checkout has no local `vitest` executable. The chained
  typecheck, lint, and build commands therefore did not run.
- Commit details: pending.
