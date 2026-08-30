# Stage 4 Design System and Shell Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the reusable application shell, interaction primitives,
evidence primitives, chart primitives, theme behavior, and component playground
required by the Stage 4 exit gate.

**Architecture:** Server-rendered pages compose a server-first `AppShell`; only
theme, complexity, overlays, tabs, and searchable controls cross a client
boundary. Shared primitives consume presentation view models rather than
scientific domain records. The existing Comparison Lab remains an immersive
feature route and keeps its approved visual hierarchy while reusing shared
complexity behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules,
Tailwind base processing, Radix Dialog, Phosphor Icons, Vitest, Testing Library,
Playwright, axe-core.

**Spec:** `docs/product/ATOM-DESIGN-SYSTEM.md`,
`docs/product/COMPLEXITY-BEHAVIOR.md`, and
`docs/superpowers/specs/2026-08-30-comparison-lab-visual-direction.md`

## Global Constraints

- Complexity changes presentation, never evidence.
- A valid `level` URL parameter overrides local preference.
- Shared pages default to a designed light theme; dark theme uses explicit
  semantic tokens; the Comparison Lab retains its dark Museum canvas.
- Every interactive control has a semantic label, visible focus, keyboard path,
  and approximately 44px touch target where practical.
- Charts expose direct values, a narrative summary, and a table fallback.
- Playground data is explicitly synthetic UI geometry, never published evidence.
- No new route is represented as a public scientific release.

---

### Task 1: URL-aware complexity preference

**Files:**
- Modify: `lib/preferences/complexity-preference.ts`
- Modify: `components/settings/ComplexitySelector.test.tsx`
- Modify: `tests/e2e/comparison-lab.spec.ts`

**Interfaces:**
- Produces: `createComplexityPreferenceStore(fallback)` with URL > local >
  fallback precedence, same-document and cross-document synchronization, and
  `popstate` handling.

- [x] Write a failing component test that starts at `?level=expert`, verifies
  Expert overrides stored Simple, changes to Technical, and preserves unrelated
  URL parameters.
- [x] Run `npm test -- components/settings/ComplexitySelector.test.tsx` and
  confirm the URL-precedence assertion fails.
- [x] Implement URL parsing, `history.replaceState`, and `popstate` updates in
  the preference store without importing Next.js navigation APIs.
- [x] Add a failing invalid-URL test proving stored preference is retained for
  `?level=unknown`.
- [x] Run the focused suite and confirm both valid and invalid URL behaviors
  pass.

### Task 2: Theme and application shell

**Files:**
- Create: `components/layout/AppShell.tsx`
- Create: `components/layout/AppShell.module.css`
- Create: `components/settings/ThemeControl.tsx`
- Create: `components/settings/ThemeControl.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`
- Modify: `app/methodology/page.tsx`

**Interfaces:**
- Produces: `AppShell({ children, eyebrow?, title? })`, `ThemeControl`, and
  explicit `data-theme="light|dark"` document state.

- [x] Write failing tests for Light/Dark/System selection, persistence, and
  blocked-storage usability.
- [x] Run the focused tests and confirm the theme modules are missing.
- [x] Implement theme preference logic and a compact three-state control.
- [x] Implement a server-first shell with skip link, ATOM wordmark, released
  navigation, global complexity control, theme control, main landmark, and
  footer.
- [x] Apply semantic surface, text, border, feedback, energy, spacing, radius,
  motion, and focus tokens for explicit light and dark themes.
- [x] Wrap `/` and `/methodology` with `AppShell`; keep route metadata in Server
  Components.
- [x] Run theme and existing route tests until green.

### Task 3: Shared controls and overlays

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Chip.tsx`
- Create: `components/ui/SegmentedControl.tsx`
- Create: `components/ui/Tabs.tsx`
- Create: `components/ui/OverlayPanel.tsx`
- Create: `components/ui/CommandMenu.tsx`
- Create: `components/ui/Tooltip.tsx`
- Create: `components/ui/Feedback.tsx`
- Create: `components/ui/ui.module.css`
- Create: `components/ui/primitives.test.tsx`

**Interfaces:**
- Produces: semantic button/chip/segmented/tabs APIs; Radix-backed
  `OverlayPanel` variants `dialog | drawer | sheet`; searchable `CommandMenu`;
  keyboard/touch `Tooltip`; `Skeleton` and `StatePanel`.

- [x] Write failing tests for disabled/loading buttons, pressed chips,
  segmented selection, arrow-key tabs, filtered command results, Escape/focus
  restoration, and programmatic state-panel copy.
- [x] Run the focused suite and confirm it fails on missing primitives.
- [x] Implement the smallest semantic primitives that satisfy the tests.
- [x] Add CSS states for default, hover, focus, selected, disabled, loading,
  missing, error, mobile, dark, and reduced motion.
- [x] Run the focused suite; axe-enabled browser checks are tracked in Task 6.

### Task 4: Evidence primitives

**Files:**
- Create: `components/evidence/evidence-view-model.ts`
- Create: `components/evidence/EvidenceBadge.tsx`
- Create: `components/evidence/DataPassport.tsx`
- Create: `components/evidence/ChallengeNumber.tsx`
- Create: `components/evidence/SourceDrawer.tsx`
- Create: `components/evidence/EvidenceNotes.tsx`
- Create: `components/evidence/evidence.module.css`
- Create: `components/evidence/evidence-primitives.test.tsx`

**Interfaces:**
- Produces: presentation-only `EvidenceViewModel`; Evidence Badge; Data
  Passport; Source Drawer; Challenge Number; Confidence Note; Methodology
  Summary.

- [x] Write failing tests for provenance fields, honest missing fields,
  alternative evidence, limitations, source action availability, dialog labels,
  Escape, and focus restoration.
- [x] Run the focused suite and confirm the modules are missing.
- [x] Implement evidence view models and components using `OverlayPanel`.
- [x] Ensure restricted/unreviewed data never renders a fabricated source or
  confidence score.
- [x] Run the focused suite and confirm every evidence interaction passes.

### Task 5: Chart primitives

**Files:**
- Create: `components/charts/chart-types.ts`
- Create: `components/charts/ComparisonBar.tsx`
- Create: `components/charts/RangePlot.tsx`
- Create: `components/charts/DistributionPlot.tsx`
- Create: `components/charts/ChartDetails.tsx`
- Create: `components/charts/charts.module.css`
- Create: `components/charts/chart-primitives.test.tsx`

**Interfaces:**
- Produces: framework presentation types and labeled bar, range, distribution,
  tooltip/detail, narrative-summary, and table-fallback components.

- [x] Write failing tests for visible units/direct labels, non-color markers,
  range-kind labels, distribution observations, narrative summary, and an
  equivalent table.
- [x] Run the focused suite and confirm the modules are missing.
- [x] Implement chart primitives without scientific constants or source data.
- [x] Add missing/loading/error states and responsive vertical composition.
- [x] Run the focused suite and confirm chart accessibility contracts pass.

### Task 6: Component playground and browser gate

**Files:**
- Create: `app/design-system/page.tsx`
- Create: `app/design-system/DesignSystemPlayground.tsx`
- Create: `app/design-system/DesignSystemPlayground.module.css`
- Create: `tests/e2e/design-system.spec.ts`
- Modify: `docs/product/DELIVERY-TRACKER.md`

**Interfaces:**
- Produces: server route `/design-system` with interactive client islands and
  synthetic fixtures explicitly labeled as non-evidence.

- [ ] Write a failing page/component test for shell landmarks, all primitive
  families, and the synthetic-data notice.
- [ ] Run the test and confirm `/design-system` is missing.
- [ ] Build the responsive playground showing light/dark, control states,
  overlays, evidence primitives, charts, loading, missing, mismatch, stale, and
  error states.
- [ ] Add Playwright coverage for keyboard flow, tabs, overlays, theme,
  complexity URL state, axe, mobile, 200% zoom, and reduced motion.
- [ ] Run focused E2E in Chromium, then the complete three-browser suite.
- [ ] Compare desktop/mobile captures with the approved Museum reference and
  existing application visual language; record QA evidence.
- [ ] Update the tracker only after the Stage 4 exit gate is fully evidenced.

### Task 7: Stage 4 review checkpoint

**Files:**
- Create: `docs/engineering/verification/2026-08-30-stage-4-completion.md`
- Modify: this plan

- [ ] Run `npm run verify`.
- [ ] Run `npm run test:e2e`.
- [ ] Run `npm audit --audit-level=high`.
- [ ] Run `git diff --check` and inspect the production browser console.
- [ ] Request independent code and design review; resolve every Critical and
  Important finding with a failing regression test where applicable.
- [ ] Commit the verified Stage 4 checkpoint before starting Stage 5.
