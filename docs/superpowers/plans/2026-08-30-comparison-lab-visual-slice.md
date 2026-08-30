# Comparison Lab Visual Slice Implementation Plan

Date: 2026-08-30
Branch: `feat/comparison-lab-visual-target`

## Goal

Translate the approved Digital Science Museum reference into the smallest
coherent, accessible, responsive Comparison Lab slice while preserving the
server/client and scientific-logic boundaries required by the product.

## Tasks

1. Preserve the selected reference and record the visual decision.
2. Add a framework-independent preview comparison model and data fixture.
3. Write failing tests for representative display, source toggling, mode
   switching, complexity preservation, table fallback, and evidence dialog
   behavior.
4. Build the `/compare` server route and a narrow client interaction boundary.
5. Implement semantic tokens, responsive exhibit layout, direct-label chart,
   narrative summary, table alternative, and preview-data disclosure.
6. Implement keyboard-operable source controls, complexity controls, view
   controls, and evidence dialog with focus restoration.
7. Add a focused E2E journey for desktop and mobile behavior, accessibility,
   URL reload stability, and console/network errors.
8. Capture desktop and mobile screenshots in the in-app browser.
9. Compare the rendered screen and selected reference together, record
   `design-qa.md`, fix P0–P2 differences, and repeat until the result passes.
10. Run format, typecheck, lint, unit/component tests, production build, and
    three-browser E2E verification.
11. Request code review, record verification evidence and limitations, and
    commit the completed slice.

## Test Contract

- Removing a source removes its chart row and preserves the others.
- Switching to Range changes the visible projection without changing the
  underlying preview observations.
- Changing complexity preserves selected sources, metric, region, and mode.
- Table view exposes the same names, values, and units as the chart.
- Evidence details are reachable without hover and close with focus restored.
- Mobile has no core horizontal overflow at 390px.
- The route has no serious axe violations, console errors, or failed requests.

## Exit Gate

The slice exits only when the selected design is documented, the responsive
prototype is browser-verified, `design-qa.md` says `final result: passed`, and
the complete automated suite passes. Preview observations remain visibly
unpublished and no Stage 5–8 evidence-platform capability is implied.

