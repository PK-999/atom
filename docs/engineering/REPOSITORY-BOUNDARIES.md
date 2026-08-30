# Repository Boundaries

## Ownership

- `app/`: routing, metadata, server composition, and route-level loading/error boundaries.
- `components/ui/`: reusable accessible primitives without scientific knowledge.
- `components/evidence/`: reusable provenance and source interactions.
- `components/charts/`: generic rendering primitives and accessible fallbacks.
- `features/<feature>/`: feature UI, state adapters, domain orchestration, and colocated tests.
- `data/schemas/`: source and normalized-data validation.
- `data/sources/`: versioned manifests, source metadata, and checksums; licensed raw files only when redistribution is permitted.
- `data/transforms/`: reproducible ingestion and normalization steps.
- `lib/evidence/`: framework-independent evidence selection, compatibility, and publication logic.
- `lib/accessibility/`: shared accessible summaries and interaction helpers.
- `content/`: reviewed MDX educational and editorial content.
- `supabase/migrations/`: append-only database migrations and policies.
- `tests/`: cross-feature integration, E2E, accessibility, and verification suites.

## Dependency Direction

Routes and components may depend on feature and library contracts. Domain and data modules must not import React, route modules, or presentational components. Scientific source values enter through validated evidence repositories only.

## Change Review

Changes to schemas, canonical units, representative rules, publication state, or URL contracts require an architecture and evidence review. Changes to tokens or shared primitives require responsive and accessibility review.
