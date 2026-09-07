# Stage 6: Supabase and Ingestion - Implementation Notes

## 2026-09-07 correction

The historical notes below describe the uncommitted root implementation, not an
accepted Stage 6 gate. Its schema differs from the delivery worktree, public
read policies do not enforce the full evidence publication contract, and the
reference script's checksum/extraction/licence/review are unverified. Do not
execute that script against an external database or cite its example value.
Follow the audit and R01/R04 in
`docs/superpowers/plans/2026-09-07-learning-platform-recovery.md` to reconcile
migrations and prove a real transactional lifecycle. Historical statements
about complete inspection, idempotency or publication safety are superseded.

This document keeps a record of all the implementation steps and the logic behind decisions made during Stage 6.

## 1. Local Supabase Setup
- **Logic:** The user requested "everything local for now". This avoids premature deployment to a hosted database and allows for rapid schema iteration and testing.
- **Action:** Initialized the project with the Supabase CLI (`npx supabase init`) and started it locally using Docker (`npx supabase start`). We updated the `supabase/config.toml` to shift all default ports from the 543xx range to the 553xx range (e.g. 55321, 55322) to prevent conflicts with other potential Supabase instances running on the developer's machine. We also installed `@supabase/supabase-js` and `@supabase/ssr` to connect our Next.js frontend with the local database.

## 2. PostgreSQL Migrations
- **Logic:** The repository has well-defined Zod schemas in `lib/evidence/schemas.ts`. A single source of truth requires that our database strongly enforces these domain contracts.
- **Action:** Created `supabase/migrations/20260901000000_initial_schema.sql` mapping precisely to the Zod definitions. We used `JSONB` for the `transformation` and `range` fields on the `observations` table, allowing flexibility while preserving the rigid structure of the core data model. Also included constraints (e.g., `published_at <= accessed_at` for sources).

## 3. Row Level Security (RLS)
- **Logic:** The product principle is "Public reads for published evidence and deny anonymous writes". 
- **Action:** Created `supabase/migrations/20260901000001_rls_policies.sql`. Enabled RLS on all tables. Added `SELECT USING (true)` policies for public tables, and crucially, `SELECT USING (publication_status = 'published')` for the `observations` table, ensuring unpublished evidence is never leaked to the client. Write operations have no public policies, enforcing a deny-by-default rule for anonymous and unprivileged users.

## 4. Ingestion Pipeline
- **Logic:** We must enforce strict Zod validation before any observation enters the database, as well as ensure the observation aligns with the `MetricSchema` definitions (e.g. `canonical_unit` checks, value kind).
- **Action:** Implemented `lib/ingestion/pipeline.ts` with `ingestObservation`. It uses the Service Role key to bypass RLS for ingestion, strictly validates the payload against `ObservationSchema`, fetches the associated Metric, checks unit convertibility using the existing `unit-registry.ts`, and finally `upsert`s the record to handle idempotency.

## 5. Reference Observation Ingestion
- **Logic:** The exit gate requires publishing "one real licensed reference observation through the complete inspectable pipeline."
- **Action:** Created `scripts/ingest-reference.ts`. It upserts all required reference data (License, Technology, Geography, Source, Study, Dataset, Metric) using the `CC-BY-4` license and an IPCC report as the source, then pushes an observation for "Lifecycle GHG" of nuclear power (`12 gCO2e/kWh`). The script ensures that any required dependent entities are present before the observation is ingested.
