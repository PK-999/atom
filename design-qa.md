# Stage 4 Design QA

Date: 2026-08-31

Status: passed

## Visual source

- Approved direction: `docs/design/references/comparison-lab-digital-science-museum.png`
- Product direction: Digital Science Museum interaction with Scientific
  Editorial restraint.
- Existing accepted comparison baseline:
  `docs/design/qa/comparison-desktop-pass4-1440x1024.png` and
  `docs/design/qa/comparison-mobile-pass4-390x844.png`.

## Captures reviewed

| Surface | Viewport | Theme | Evidence |
| --- | ---: | --- | --- |
| Comparison Lab | 1440×900 | Museum dark canvas | `docs/design/qa/comparison-stage4-desktop-light-1440x900.png` |
| Comparison Lab | 390×844 | Museum dark canvas under dark OS preference | `docs/design/qa/comparison-stage4-mobile-dark-390x844.png` |
| Component playground | 1440×900 | Light | `docs/design/qa/design-system-desktop-light-1440x900.png` |
| Component playground | 1440×900 | Dark | `docs/design/qa/design-system-desktop-dark-1440x900.png` |
| Component playground | 768×1024 | Light | `docs/design/qa/design-system-tablet-light-768x1024.png` |
| Component playground | 390×844 | Light | `docs/design/qa/design-system-mobile-light-390x844.png` |

The approved reference and current Comparison Lab captures were inspected in
the same comparison input at matching desktop and mobile states. Playground
captures were inspected together across desktop, tablet, mobile, light, and
dark variants.

## Full-page review

- Information hierarchy remains consistent with the approved reference:
  navigation, exhibit framing, source selection, context controls, chart,
  interpretation, and evidence actions remain visually ordered by task.
- The shell and playground use the same restrained type, spacing, radius,
  focus, and semantic-color system without imitating the immersive Lab canvas.
- Desktop content uses the available width without dashboard-like density.
- Tablet and mobile components stack by task and do not require core horizontal
  scrolling.
- Chart reading surfaces remain intentionally light in dark mode so scientific
  labels and geometry retain the approved editorial contrast.
- Synthetic playground values are visibly disclosed as non-evidence.

## Focused component review

- Buttons, chips, segmented controls, tabs, command search, dialogs, drawers,
  bottom sheets, tooltips, skeletons, and state panels expose default,
  selected, disabled, loading, and failure states.
- Evidence badges use separate symbols, labels, borders, and colors; meaning is
  never color-only.
- Evidence overlays preserve focus on close and keep provenance limitations
  visible.
- Comparison bars, ranges, distributions, narrative summaries, and tables show
  units and non-color markers.
- Light and dark feedback tokens pass axe color-contrast checks after dark
  positive, warning, negative, and information tokens were corrected.
- Touch targets, focus rings, keyboard order, 200% zoom equivalent, and reduced
  motion were verified in the production browser suite.

## Findings and resolution history

1. Dark-theme evidence badge text initially failed WCAG AA against the dark
   panel. Root cause: feedback tokens retained light-theme values. Resolved by
   defining intentional dark feedback tokens and rerunning axe.
2. The legacy foundation browser test assumed the product always declared a
   light scheme. The approved Stage 4 theme contract now defaults to System.
   Replaced the stale assertion with a cross-browser explicit-theme persistence
   journey; system resolution remains covered by deterministic unit tests.
3. A command-line dark screenshot captured a transient blank compositor frame.
   A dedicated Chromium/Firefox/WebKit readability regression verified the
   heading, primary evidence action, expected text color, and axe result. The
   retained QA image was captured from the passing browser test after the page
   became visible.
4. One Firefox full-suite run timed out while navigating to the playground.
   The same journey passed three concurrent repetitions, and the complete
   27-test cross-browser suite then passed. No reproducible route defect was
   found.

## Result

Automated accessibility, responsive, theme, keyboard, focus, zoom, and motion
checks pass. Visual implementation QA and the Stage 4 design gate pass.
