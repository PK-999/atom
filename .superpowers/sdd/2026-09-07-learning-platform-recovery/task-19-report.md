# Task Report: Package R19 — Continuous Evidence & Local Deployment Operations

**Task ID:** R19
**Date:** 2026-09-08
**Status:** Completed & Verified
**Target Scope:** Continuous operations, source freshness monitoring, CI scheduling, local deployment & manual visual testing documentation.

---

## 1. Scope & Accomplishments

Package R19 brings the ATOM recovery roadmap to completion, establishing sustainable continuous operations, source monitoring, and comprehensive local deployment protocols:

1. **Automated Evidence Source Freshness & Monitoring:**
   - Enhanced `scripts/monitoring/check-sources.ts` with `CORE_MONITORED_SOURCES` tracking 11 canonical peer-reviewed publications and official government/regulatory portals:
     - IPCC AR5 WG3 Annex III (Lifecycle carbon)
     - UNECE LCA 2021 (Harmonized land & emissions)
     - UNSCEAR 2020/2021 Annex B (Radiation dose & health)
     - Our World in Data (Markandya & Wilkinson mortality comparisons)
     - IAEA PRIS (Global reactor operational database)
     - IAEA Radioactive Waste Management (Spent fuel & disposal trends)
     - US NRC PWR & BWR reactor design baselines
     - CEA India Monthly Executive Summary (FY 2023-24 capacity & generation)
     - DAE & NPCIL India (Bhabha 3-stage program & fleet statistics)
   - CLI execution support via `npm run monitoring:sources` with options for `--dry-run`, `--timeout`, `--concurrency`, and `--report-out`.
   - Structured JSON report generated to `docs/engineering/verification/latest-source-monitoring.json`.
   - Inconclusive HTTP semantics (403, 429, timeouts) explicitly distinguished from broken links (404, 410) so paywalls and rate limits do not invalidate scientific claims.

2. **Scheduled CI Freshness Workflow:**
   - Created `.github/workflows/source-monitor.yml` running on a weekly cron schedule (`0 3 * * 0` at 03:00 UTC) and on-demand `workflow_dispatch`.
   - Automatically executes source checks and archives reports as build artifacts for auditability.

3. **Local Deployment & Manual Visual Testing Guide:**
   - Authored `docs/engineering/LOCAL-DEPLOYMENT.md` as the authoritative runbook for engineers and QA testers.
   - Comprehensive instructions covering:
     - System prerequisites (Node `>=24.20.0`, npm `>=10.0.0`, Docker, Supabase CLI).
     - Environment setup (`.env.local` configuration, port allocations for dev:3000, E2E:3100, and Supabase:54321-54323).
     - Full database mode with migration reset, pgTAP tests, and evidence seeding.
     - Production build and server launch (`npm run build && npm start`).
     - Manual visual testing protocol across 5 responsive breakpoints (`320×568`, `390×844`, `768×1024`, `1440×900`, `1920×1080`).
     - Dark, light, and system theme switching; high-contrast checks; reduced-motion validation.
     - Keyboard navigation (skip-to-content, visible focus rings, dialog focus trapping, Escape handling).
     - Screen reader verification (semantic landmarks, aria-live politeness for dynamic calculations).
     - Route-by-route manual visual inspection checklists for all 11 core application routes (`/`, `/compare`, `/radiation`, `/reactors`, `/globe`, `/india`, `/grid`, `/ask`, `/debates`, `/learn`, `/methodology`).
     - Flagged external gates (scientific review, editorial review, licensing audit, hosted Supabase and Vercel deployments).

---

## 2. Verification Results

- **Unit Tests (`scripts/monitoring/check-sources.test.ts`):**
  - 9/9 tests passed (covering 200 OK healthy status, 403/429 inconclusive handling, timeouts, 404 broken links, stale detection, URL validation, bounded concurrency, canonical source array integrity, and CLI dry-run report output).
- **CLI Direct Execution:**
  - `npm run monitoring:sources -- --dry-run` exited code 0, generated valid JSON report with 11/11 healthy checks.
- **Repository Verification Pipeline:**
  - `npm run verify`: Format check OK, TypeScript 0 errors, ESLint 0 errors, Vitest 76 test files / 484 unit tests passed, Next.js build 49/49 static pages generated.
