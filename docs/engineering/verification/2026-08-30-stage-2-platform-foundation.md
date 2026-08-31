# Stage 2 Platform Foundation Verification

- Date: 2026-08-30
- Branch: `feat/platform-foundation`
- Target runtime: Node.js 24.20.0 LTS
- Verification runtime: Node.js 26.5.0

## Red-Green Evidence

- Foundation page, health route, security headers, and public environment suites first failed because their implementation modules did not exist; after minimal implementation, 5 assertions passed.
- Server environment suite first failed because `lib/env/server` did not exist; after implementation, 2 assertions passed.
- Strict browser console checking exposed a prefetched `/methodology` 404. Failed-response instrumentation identified the URL; adding the promised server-rendered route removed the 404.

## Automated Verification

- `npm ls --depth=0`: dependency tree resolved after pinning TypeScript 6.0.3 and ESLint 9.39.5 to their declared peer ranges.
- `npm run verify`: formatting, TypeScript, ESLint, 7 Vitest assertions across 5 files, and the webpack production build passed.
- Production routes generated: `/`, `/methodology`, and `/health`, plus Next.js `_not-found`.
- `npm run test:e2e`: Chromium, Firefox, and WebKit passed the foundation journey, health contract, console, Next error-overlay, and axe assertions.
- E2E starts the built production artifact. A post-commit run against a cold development server exposed a WebKit axe/navigation race during concurrent route compilation; WebKit passed alone, and production-server E2E removes that HMR race from the release gate.

## Pinned Runtime Re-verification — 2026-08-31

- An isolated `node:24.20.0` container copied the repository from a read-only
  mount, ran `npm ci`, and then ran the complete `npm run verify` gate.
- The exact pinned runtime passed formatting, strict typechecking, lint, all
  144 tests across 22 files, and the production build.
- A second clean `node:24.20.0` container installed the Playwright system and
  browser dependencies, rebuilt the application, and ran the complete browser
  matrix: 31 checks passed across Chromium, Firefox, and WebKit; the two
  non-WebKit copies of the WebKit-only touch test were skipped by design.
- Both clean installs reported zero dependency vulnerabilities.

## Browser Inspection

- Inspected 390×844 light, 768×1024 dark, and 1440×900 light captures.
- Content remained legible with no clipping or core horizontal scrolling.
- The page intentionally uses neutral system styling and states that the flagship visual direction is unselected.

## Known Limits

- The managed environment prevents Turbopack's production PostCSS worker from binding its local port. `next build --webpack` passes; ADR 0008 requires an unrestricted CI/Vercel Turbopack retest.
- GitHub, Vercel, and Supabase projects are not connected, so preview deployment and cloud environment checks remain external gates.
- The original host verification used Node.js 26.5.0. The complete quality and
  three-browser gates now also pass locally in isolated Node.js 24.20.0
  containers, but GitHub-hosted execution has not run remotely.
- Stage 3 visual direction selection is intentionally not started or implied by this foundation.
