# ADR 0007: Deployment Environments

- Status: Accepted
- Date: 2026-08-30

## Decision

Use GitHub for source control, Vercel for preview/staging/production application deployments, and Supabase for PostgreSQL-backed evidence. Pull requests receive isolated preview deployments. Staging uses production-shaped configuration and reviewed non-production data. Production accepts only versioned, published evidence.

Secrets are environment-scoped and never committed. Production promotion requires CI, browser, accessibility, evidence, and rollback checks.
