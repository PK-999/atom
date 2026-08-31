# Stage 4 Design System and Application Shell Verification

Date: 2026-08-31

Branch: `feat/stage4-stage5-completion`

Implementation checkpoints: `0dde134`, `d80ea27`

## Scope

This record covers the Stage 4 exit gate: semantic tokens, application shell,
complexity and theme preferences, shared controls, evidence presentation
primitives, chart presentation primitives, the component playground, and
responsive/accessibility verification.

The Comparison Lab remains an immersive feature route. The shared evidence and
chart components accept presentation models only; Stage 5 owns scientific
evidence schemas and policies.

## Delivered contracts

- Valid `level` URL state overrides local complexity preference; invalid URL
  values fall back independently without discarding valid state.
- Light, Dark, and System themes persist locally and expose an explicit
  document theme after hydration.
- The server-first `AppShell` provides skip navigation, released routes,
  complexity and theme controls, main landmark, and evidence-first footer.
- Shared controls cover buttons, chips, segmented controls, tabs, command
  search, dialog, drawer, sheet, tooltip, skeleton, and state panels.
- Shared evidence presentation covers badges, Data Passport, Challenge This
  Number, source drawer, uncertainty note, and methodology summary.
- Shared chart presentation covers labeled bars, ranges, distributions,
  narrative summaries, accessible details, and table fallback.
- `/design-system` renders all primitive families and failure states using
  fixtures explicitly labeled as synthetic and non-citable.

## Verification evidence

| Check | Result |
| --- | --- |
| `npm run format:check` | Passed |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run test` | 57 tests across 16 files passed |
| `npm run build` | Passed; `/design-system` statically generated |
| `npm run test:e2e` | 30 tests passed across Chromium, Firefox, and WebKit |
| axe | No violations in tested shell, Lab, playground, and open-overlay states |
| Keyboard/focus | Tabs, command menu, dialogs, sheets, Escape, and focus restoration passed |
| Responsive | 390×844, 768×1024, 1440×900, and 200% zoom-equivalent checks passed |
| Theme | Explicit dark persistence and system dark comparison readability passed |
| Reduced motion | Transition contract passed |
| `npm audit --audit-level=high` | 0 vulnerabilities |
| `git diff --check` | Passed |

Two Firefox runs exposed that the playground tests waited for the broad window
`load` event even though readiness was defined by rendered and interactive
elements. The affected journeys passed repeated isolation runs. Navigation now
waits for `domcontentloaded`, followed by explicit hydration, interaction, axe,
and layout assertions; the complete 30-test suite passes.

## Visual and design QA

The approved reference and current captures were inspected together. Desktop,
tablet, mobile, light, and dark evidence is stored in `docs/design/qa/` and the
review history is recorded in `/design-qa.md`.

Dark evidence status colors were corrected after axe detected insufficient
contrast. The final browser suite validates those colors in the playground and
open evidence overlay.

## Remaining limitations

- Scientific observations, representative policies, comparability, units, and
  editorial governance are Stage 5 responsibilities and are intentionally not
  embedded in these presentation primitives.
- The Comparison Lab continues to use preview geometry that is clearly marked
  non-citable; it is not a public evidence release.
- GitHub-hosted CI and a Vercel preview remain external Stage 2 checks.

## Independent review

The initial review found no Critical issues and five Important issues: missing
range/distribution states, distorted non-zero domains, duplicate tab IDs,
post-hydration theme resolution, and incomplete gate records. All were resolved
with focused regressions. Minor findings for limitation copy, tooltip lifecycle,
and an oversized client boundary were also resolved.

## Gate result

Passed. The shared shell and primitives are validated on mobile and desktop and
are stable enough for the flagship.
