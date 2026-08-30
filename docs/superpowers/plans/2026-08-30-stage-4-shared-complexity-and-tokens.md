# Stage 4 Shared Complexity and Token Slice

**Goal:** Establish the first reusable Stage 4 design-system contracts without
changing the approved Comparison Lab behavior or visual hierarchy.

**Boundary:** This slice extracts the five-level complexity control, centralizes
its preference behavior, establishes route-wide semantic color/focus tokens,
and records the master delivery tracker. It does not claim the complete Stage 4
application shell or primitive catalog.

## Task 1 — Shared Complexity Contract

- [x] Write failing component tests for five visible levels, selection,
  persistence across remounts, and storage-unavailable behavior.
- [x] Move the shared `ComplexityLevel` type out of the Comparison Lab feature.
- [x] Implement a reusable controlled selector and preference hook.
- [x] Replace Comparison Lab-owned selector markup without changing its
  explanation behavior.
- [x] Run focused selector and Comparison Lab regression tests.

## Task 2 — Semantic Tokens

- [x] Define route-wide semantic surface, text, border, interaction, control,
  and focus tokens.
- [x] Map the approved Museum route palette to those semantic contracts.
- [x] Move selector-specific responsive and reduced-motion styles into its
  component stylesheet.
- [x] Confirm the rendered route at mobile and desktop sizes after production
  build.

## Task 3 — Delivery Control

- [x] Add a stage-by-stage delivery tracker for Stages 0–25.
- [x] Distinguish complete, local-only, prototype, foundation, in-progress, and
  not-started work.
- [x] Record final local verification and first-pass review corrections.
- [ ] Record final review outcome and merged commit.

## Final Verification

- [x] Format check.
- [x] Strict typecheck.
- [x] Lint.
- [x] Full unit and component suite.
- [x] Production build.
- [x] Cross-browser E2E and accessibility suite.
- [x] Responsive browser/design regression.
- [x] Independent code review.
- [ ] Local merge to `main` after all required checks pass.
