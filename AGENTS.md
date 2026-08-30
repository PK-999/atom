# ATOM — Repository Agent Instructions

ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and its role in the wider electricity system.

All coding agents working in this repository must follow this file before making changes.

---

## 1. Product Mission

ATOM should help people understand energy, risk, radiation, electricity systems, and nuclear power well enough to form their own opinion.

ATOM is not a nuclear advocacy site.

The product may present evidence that strongly favors nuclear power on some dimensions and evidence that strongly disfavors it on others. Do not hide either.

Primary product principle:

> ATOM should never ask users to trust ATOM. ATOM should give users enough information to verify ATOM.

---

## 2. Core Product Principles

1. Evidence before persuasion.
2. Make complexity optional, not mandatory.
3. Never hide uncertainty.
4. Every important quantitative claim must be inspectable.
5. Teach visually before explaining verbally where that improves understanding.
6. Interactions must teach, orient, compare, or clarify.
7. Avoid decorative complexity.
8. Mobile users must receive the full intellectual experience.
9. Accessibility is part of the product, not post-launch polish.
10. Serious topics such as accidents, radiation exposure, casualties, displacement, and weapons must be treated seriously.
11. The interface should encourage curiosity, not agreement.
12. Complexity changes presentation, never evidence.
13. Do not hard-code scientific metrics inside UI components.
14. Do not invent scientific values.
15. Every chart must have a textual or tabular accessible alternative.
16. Scientific calculations require tests.
17. No feature is complete without browser verification.
18. Prefer small, domain-focused components.
19. Respect `prefers-reduced-motion`.
20. Missing or uncertain evidence must be shown honestly.

---

## 3. Required Reading Before Work

Before implementing any substantial feature, read:

- `docs/product/ATOM-DESIGN-SYSTEM.md`
- `docs/product/COMPARISON-LAB-SPEC.md` when working on comparison functionality
- `docs/product/EVIDENCE-AND-EDITORIAL-POLICY.md`
- `docs/product/TECHNICAL-ARCHITECTURE.md`
- `docs/product/TESTING-AND-QUALITY.md`
- `docs/product/ROADMAP.md`

Treat these as the product source of truth.

If implementation and documentation conflict, stop and resolve the conflict explicitly rather than silently choosing one.

---

## 4. Development Workflow

For substantial product work:

1. Use a structured brainstorming/design pass before implementation.
2. For UI work, establish a clear visual target before coding.
3. Write or update a small implementation plan.
4. Work in an isolated branch/worktree for larger features.
5. Use test-driven development for calculations, transformations, parsing, and scientific logic.
6. Implement the smallest coherent slice.
7. Verify in a real browser.
8. Run design QA.
9. Run code review.
10. Run final verification before declaring the work complete.

Do not jump from vague prompt directly to production UI.

---

## 5. Preferred Stack

Unless the repository has already standardized otherwise:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui and Radix primitives
- Motion for purposeful UI motion
- D3 for scales/geometry/specialized visual calculations
- Observable Plot where appropriate
- MapLibre GL JS for maps
- Zustand for local interactive state where useful
- TanStack Query only for client-side server state that truly needs it
- Zod for validation
- React Hook Form for forms
- MDX for narrative educational content
- Supabase/PostgreSQL for structured evidence, metrics, sources, facilities, claims, and accounts
- Vitest for unit tests
- Playwright for E2E
- axe-core for accessibility automation

Do not add infrastructure without need.

Avoid premature:
- microservices
- Kubernetes
- Kafka
- GraphQL federation
- Redis clusters
- separate data warehouses

---

## 6. Repository Boundaries

Prefer feature-oriented structure:

```text
app/
components/
  ui/
  education/
  evidence/
  charts/
  simulations/
  maps/
features/
  comparison/
  radiation/
  grid-builder/
  reactor-explorer/
  nuclear-globe/
content/
  concepts/
  lessons/
  debates/
data/
  schemas/
  sources/
  transforms/
lib/
  evidence/
  analytics/
  accessibility/
  search/
tests/
```

Do not create giant miscellaneous component folders.

A feature folder should contain its own UI, domain model, schema, utilities, and tests where practical.

Example:

```text
features/grid-builder/
  GridBuilder.tsx
  GridControls.tsx
  GridResults.tsx
  grid-model.ts
  grid-schema.ts
  grid-utils.ts
  grid-model.test.ts
```

---

## 7. Scientific Logic Separation

Scientific values and calculations must not live in presentational components.

Bad:

```ts
const nuclearDeaths = 0.03
```

inside a React card.

Preferred:

```text
source data
→ schema validation
→ normalization
→ unit conversion
→ metric engine
→ UI
```

Simulation models must be framework-independent where practical.

React renders results. It should not be the source of scientific truth.

---

## 8. Evidence Requirements

Every major quantitative observation should support:

- metric
- value
- unit
- technology
- geography
- period/year
- source
- publication/version
- methodology
- system boundary
- min/median/max or range when relevant
- uncertainty/confidence note when relevant
- last verified date
- source URL or source identifier
- transformation notes

If these are unavailable, represent that limitation.

Never display invented confidence scores.

---

## 9. Complexity Levels

ATOM uses five explanation levels:

- L1 — Kid
- L2 — Simple
- L3 — Curious
- L4 — Technical
- L5 — Expert

Rules:

- Changing level should not change underlying factual data.
- Current page context should be preserved.
- Explanations may expand or contract.
- Advanced controls may appear at higher levels.
- Selection should persist locally.
- Users can change level at any time.
- Expert mode must be genuinely deeper, not merely longer prose.

---

## 10. Accessibility Rules

Every feature must support:

- keyboard access
- visible focus
- semantic controls
- touch targets around 44px where practical
- WCAG AA contrast minimum
- no color-only meaning
- reduced-motion mode
- 200% zoom usability
- screen-reader-friendly summaries
- chart table/text fallback
- non-hover-only access to tooltips/details

Do not ship a chart that is only understandable visually.

---

## 11. Mobile Rules

Do not shrink desktop experiences onto mobile.

For narrow screens:

- prefer vertical comparisons
- use bottom sheets for filters/details
- stack controls by task
- avoid forced horizontal scroll for core reading
- use sticky compact controls only when they improve orientation
- preserve all important evidence and source access

---

## 12. Motion Rules

Motion must do one of four things:

- teach
- orient
- show causality
- communicate state

Do not add animation solely because the page feels static.

Examples where motion is useful:
- neutron interaction
- radioactive decay
- grid flow
- reactor control
- timeline progression

Examples where motion is usually unnecessary:
- reading methodology
- citations
- long-form evidence text

---

## 13. Data Visualization Rules

- Bar charts: discrete comparisons.
- Line charts: change over time.
- Scatterplots: relationships.
- Range/distribution plots: uncertainty or variation.
- Avoid pie charts unless part-to-whole is the actual question.
- Prefer direct labels over legends when possible.
- Bar charts generally start at zero.
- Units must always be visible.
- Sources must be reachable from every chart.
- Uncertainty must be visible when relevant.
- Hover must not be required to understand the chart.
- Mobile must have an equivalent table or text view.
- Color must never be the only channel of meaning.

---

## 14. Content Tone

ATOM should feel:

- scientific
- curious
- calm
- premium
- playful where appropriate
- intellectually serious
- optimistic without being promotional

ATOM should not feel:

- corporate
- government-portal-like
- activist
- cyberpunk
- radioactive-neon
- childish
- dashboard-heavy

Avoid loaded phrasing.

Prefer:
> Historical estimates generally place nuclear among the lowest-mortality electricity sources per unit generated, though estimates depend on methodology and how accident impacts are counted.

Avoid:
> Nuclear is unquestionably the safest energy source.

---

## 15. Error and Missing-Data Behavior

Do not show silent blanks.

Examples:

Missing comparable evidence:
> We do not currently have reliable comparable data for this metric and technology.

Methodological mismatch:
> These estimates use materially different methodologies and should not be interpreted as directly equivalent.

Source temporarily unavailable:
> Source currently unavailable. Showing the last verified value from YYYY-MM-DD.

---

## 16. Definition of Done

A substantial UI feature is not complete until all relevant checks pass:

- typecheck
- lint
- unit tests
- integration tests
- E2E tests
- production build
- browser verification
- responsive verification
- console inspection
- accessibility checks
- keyboard checks
- reduced-motion checks
- loading/error/empty states
- source/evidence states
- dark/light mode where supported

Do not declare completion based only on successful compilation.
