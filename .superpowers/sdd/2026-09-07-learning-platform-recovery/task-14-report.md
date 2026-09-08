# Task Report: R14 — Debate engine

**Task:** R14 — Debate engine
**Status:** Completed
**Date:** 2026-09-08

## Implementation Summary
- Schemas & Validation (`lib/debate/schemas.ts`):
  - Added strict modeling for `ArgumentRelationshipSchema` (`supporting`, `disputing`, `contextualizing`) with backward-compatible normalization for legacy `side` aliases (`for`, `against`, `context`).
  - Added `AttributableStatementSchema` requiring `statement`, `basis`, `asOf` (strict ISO date check), and optional `citationIds`.
  - Added `DebateCitationSchema` with `id`, `title`, `publisher`, `year`, `url`, `sourceTier`, and `locator`.
  - Added `EvidenceStrengthSchema` (`established`, `preponderance`, `contested`, `emerging`).
- Debate Domain Model (`lib/debate/debate-model.ts`):
  - Referential integrity validation (`validateTopicIntegrity`): rejects topics referencing unresolved citation IDs; enforces attributable basis and date for consensus and uncertainty statements (consensus is never displayed as an unsupported fact).
  - Implemented `getNarrativelyOrderedArguments` ordering arguments by narrative flow and evidence strength rather than equal-column presentation.
  - Implemented citation resolvers (`resolveCitation`, `resolveArgumentCitations`).
  - Integrated 3 canonical reviewed debate topics: `waste.json`, `costs.json`, and `safety.json` in `content/debates/`.
- Interactive Debate Component (`features/debate/DebateViewer.tsx`, `DebateViewer.module.css`):
  - Clean presentation of question, summary, attributable consensus, and attributable uncertainties.
  - Relationship filter bar (`All`, `Supporting`, `Disputing`, `Contextual`) with dynamic counts.
  - Distinct styling for each relationship: emerald for supporting, amber for disputing, indigo for contextualizing.
  - Expandable citations drawer per argument showing publisher, year, citation link, and locator.
  - Explicit missing evidence and boundary limitations callout box.
  - Tested with 5 component tests (`features/debate/DebateViewer.test.tsx`).
- App Router Routes (`app/debates/page.tsx`, `app/debates/[topic]/page.tsx`):
  - Index page listing topics with argument distribution pills and navigation.
  - Dynamic SSG page with `generateStaticParams()` and `dynamicParams = false` to guarantee hard 404s for invalid slugs.
- Playwright End-to-End Suite (`tests/e2e/debate.spec.ts`):
  - 15 passing tests across Chromium, Firefox, WebKit on port 3100.
  - Verifies topic index, waste detail, attributable consensus and date, filter interaction, citations drawer toggle, costs and safety pages, 404 for invalid slug, and mobile viewport (390x844).

## Verification Evidence
- `npx vitest run lib/debate/ features/debate/`: Passed (15/15 tests).
- `npm run verify`: Prettier, TypeScript typecheck, ESLint, all 67 vitest test files (353 unit tests), and Next.js static build (41 static pages) passed.
- `PLAYWRIGHT_PORT=3100 npx playwright test tests/e2e/debate.spec.ts`: Passed (15/15 tests across Chromium, Firefox, WebKit).
