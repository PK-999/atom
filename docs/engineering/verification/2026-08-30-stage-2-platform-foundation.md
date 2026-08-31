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
- GitHub Actions workflow `CI` completed successfully for `main` at commit
  `8d8b8b8e13a548366601e6cba173fe7fb9092435` (run `33403126890`).
- After the tracker synchronization, workflow `CI` completed successfully
  again for `main` at commit `301398290d20b28fb440d6ebdb7722706dc291d4`
  (run `33449274432`); both quality and browser jobs passed.
- After the final tracker update, workflow `CI` completed successfully for
  `main` at commit `00c03be7615dc8989434dd44701417c9e3c8ad01` (run
  `33449480327`); both quality and browser jobs passed.
- After the browser-harness hardening change, workflow `CI` completed
  successfully for `main` at commit `f49c141edab5a1aace75eff1e790376ef7b750fb`
  (run `33451557726`); both quality and browser jobs passed.

## Local Browser Harness Re-verification — 2026-09-01

- A local parallel run reproduced intermittent failures when Playwright reused
  an unrelated or stale process on port 3000 and when the first interaction
  raced hydration.
- The harness now accepts `PLAYWRIGHT_PORT`, starts its own server by default,
  and only reuses an existing server when `REUSE_E2E_SERVER=true` is explicit.
- The primary comparison journey now waits for network idle and asserts the
  removal and display-mode transitions before continuing.
- On isolated port 3107, the full three-browser run passed 31 checks with two
  intentional non-WebKit touch-test skips.

## Vercel Deployment Check — 2026-09-01

- Vercel production deployment `6191571046` for commit `f49c141` completed
  successfully at `https://atom-389hpmvt1-pks-projects-35b7ae41.vercel.app`.
- GitHub reports the Vercel deployment status as successful.
- Direct unauthenticated requests redirect to Vercel SSO protection, so route
  rendering and console inspection still require an authenticated browser
  session. This is an access-control limitation, not an application failure.
- A non-main preview deployment `6191641954` for ref `1f8119e` completed
  successfully at `https://atom-lvnhos7k9-pks-projects-35b7ae41.vercel.app`.
- The preview is SSO-protected; authenticated browser rendering and console
  inspection remain an explicit follow-up check.

## Browser Inspection

- Inspected 390×844 light, 768×1024 dark, and 1440×900 light captures.
- Content remained legible with no clipping or core horizontal scrolling.
- The page intentionally uses neutral system styling and states that the flagship visual direction is unselected.

## Known Limits

- The managed environment prevents Turbopack's production PostCSS worker from binding its local port. `next build --webpack` passes; ADR 0008 requires an unrestricted CI/Vercel Turbopack retest.
- Vercel production and preview deployments are now complete, but authenticated
  browser inspection remains open; Supabase remains intentionally unconnected
  until Stage 6.
- The original host verification used Node.js 26.5.0. The complete quality and
  three-browser gates now also pass locally in isolated Node.js 24.20.0
  containers, and GitHub-hosted CI now passes for `main`.
- Stage 3 visual direction selection is intentionally not started or implied by this foundation.
