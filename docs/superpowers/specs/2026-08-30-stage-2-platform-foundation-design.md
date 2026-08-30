# Stage 2 Platform Foundation Design

## Goal

Create a pinned, server-first Next.js foundation with strict static analysis, automated tests, browser coverage, environment validation, security headers, and a non-sensitive health route.

## Architecture

Next.js App Router and Node.js runtime are the defaults. Pages remain server components until browser interaction requires a focused client island. Vitest covers modules and components; Playwright and axe cover the rendered foundation. CI uses Node 24 LTS and the committed npm lockfile.

The managed workspace cannot permit Turbopack's PostCSS worker to bind its local port. The foundation therefore uses Next.js's supported webpack build path without custom webpack configuration. ADR 0008 requires an unrestricted CI/Vercel retest before that provisional choice is removed.

## Interfaces

- `GET /health` returns `{ service: "atom", status: "ok", version: 1 }` with `Cache-Control: no-store`.
- `parsePublicEnv(input)` validates `NEXT_PUBLIC_SITE_URL` and defaults local development to `http://localhost:3000`.
- Baseline security headers apply to all routes.

## Acceptance

- Dependencies are exact and reproducible through `npm ci`.
- Typecheck, lint, formatting, unit/component tests, production build, and browser test scripts exist.
- CI exercises both code quality and all three Playwright browser engines.
- The foundation page is explicitly temporary and does not preselect the flagship visual direction.
