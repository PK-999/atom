# Stage 4 Shared Complexity and Token Verification

- Date: 2026-08-30
- Branch: `feat/design-system-shell`
- Baseline: `main` at `674da5f`
- Merged: local `main` at `86116ed`
- Scope: first bounded Stage 4 design-system slice

## Red-Green Evidence

- The shared selector suite first failed because `ComplexitySelector` did not
  exist. The minimal shared component and preference hook made the selector and
  Comparison Lab regression suites pass.
- Review identified that two preference-hook consumers could diverge in one
  document. The new two-consumer test failed with the second selector still at
  Curious. A same-document preference event made both consumers update while
  retaining cross-document `storage` event behavior.
- The dark-OS foundation test first received `color-scheme: light dark` while
  global tokens were fixed to a light palette. Advertising the global light
  scheme explicitly and opting the Museum route into dark made the contract and
  axe check pass.

## Automated Verification

- Focused selector and Comparison Lab suites: 15 tests passed.
- `npm run verify`: Prettier, TypeScript, ESLint, 25 Vitest tests across 9 files,
  and the webpack production build passed.
- `npm run test:e2e`: 15 Playwright checks passed across Chromium, Firefox, and
  WebKit.
- E2E coverage includes the primary comparison journey, evidence dialog/focus
  restoration, mobile reflow and overflow, reduced motion, a 200%-zoom
  equivalent viewport, foundation health, console/response checks, axe, and the
  foundation palette under a dark OS preference.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `git diff --check`: passed.

## Browser and Design Inspection

- Inspected the production `/compare` route at 1440×1024 and 390×844.
- Compared both states with the approved pass-four QA captures in the same
  review input.
- The shared-component extraction preserved hierarchy, spacing, selector
  geometry, source controls, context controls, chart layout, and the mobile
  composition.
- No new image or decorative asset was introduced.

## Review

- First-pass independent review: no Critical issues and three Important issues.
- Corrections: same-document preference synchronization plus regression test;
  truthful global light/Museum dark color-scheme declarations plus
  dark-preference axe coverage; verification evidence recorded in this tracker
  and plan.
- Final independent review: no remaining Critical or Important issues; ready to
  merge.

## Known Limits

- Stage 4 remains in progress. This slice does not complete the shared shell,
  URL precedence, light/dark theme control, full primitive catalog, or component
  playground.
- GitHub CI and Vercel preview checks remain external Stage 2 gates.
