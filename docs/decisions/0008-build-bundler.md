# ADR 0008: Reproducible Next.js Build Bundler

- Status: Provisional
- Date: 2026-08-30

## Context

Next.js 16.3 defaults to Turbopack. In the managed implementation environment, Turbopack's PostCSS worker attempts to bind a local port and fails with `Operation not permitted`. Re-running with elevated command permission produces the same failure. The supported webpack build path compiles, typechecks, generates all routes, and collects build traces successfully.

## Decision

Use `next build --webpack` as the reproducible production-build command for the platform foundation. Keep application code free of webpack-specific customization.

## Review Trigger

Re-test the default Turbopack build in unrestricted GitHub Actions and Vercel environments. Supersede this decision when Turbopack completes the same verification suite reliably.
