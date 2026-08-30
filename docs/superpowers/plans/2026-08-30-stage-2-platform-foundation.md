# Stage 2 Platform Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold and verify ATOM's server-first application and quality foundation.

**Architecture:** Pin Next.js, React, Tailwind, TypeScript, Vitest, Playwright, and axe. Test the first public contracts before implementing the minimal foundation page, health handler, headers, and environment parser.

**Tech Stack:** Node 24 LTS, Next.js 16.3, React 19.2, Tailwind CSS 4.3, TypeScript 6.0, Vitest 4, Playwright 1.62.

**Spec:** `docs/superpowers/specs/2026-08-30-stage-2-platform-foundation-design.md`

## Global Constraints

- Server Components and Node.js runtime are the default.
- No final visual direction is implied by the temporary foundation page.
- No credentials or scientific values are added.
- New behavioral code follows red-green-refactor.

---

### Task 1: Toolchain

- [x] Pin runtime, application, styling, static-analysis, unit, component, E2E, and accessibility dependencies.
- [x] Configure TypeScript, ESLint, Prettier, Tailwind/PostCSS, Vitest, and Playwright.
- [x] Add GitHub Actions quality and browser jobs.

### Task 2: Contract Tests

- [x] Write tests for the foundation page, health response, security headers, and environment validation.
- [x] Run the tests and verify they fail because implementation modules do not exist.

### Task 3: Minimal Implementation

- [x] Implement only the code required to satisfy the failing tests.
- [x] Run the focused tests and full unit/component suite.

### Task 4: Production Verification

- [x] Run formatting check, typecheck, lint, production build, and browser test.
- [x] Inspect the page and console in a real browser.
- [x] Commit the Stage 2 checkpoint with exact verification results.
