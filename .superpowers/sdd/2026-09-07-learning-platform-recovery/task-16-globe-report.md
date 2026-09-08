# Task Report: R16-G — Facility directory and globe

**Task:** R16-G — Facility directory and globe
**Status:** Completed
**Date:** 2026-09-08

## Implementation Summary
- Schemas & Validation (`lib/globe/schemas.ts`):
  - Added strict modeling for `FacilitySchema`, `FacilityUnitSchema`, and `CoordinatesSchema`.
  - Added unit-level lifecycle history: unit number, reactor type, commercial start year, shutdown year, and status (`operating`, `under-construction`, `shutdown`, `decommissioned`).
  - Added capacity basis (`net`, `gross`) and support for explicit unknown capacity (`capacityMWe: null`).
  - Bounded coordinates strictly to `[-90..90, -180..180]`.
  - Added `FacilitySourceSchema` anchoring records to authoritative databases (IAEA PRIS).
- Facility Domain Model (`lib/globe/facility-model.ts`):
  - Catalog of 8 canonical global facilities across India, Finland, United Arab Emirates, United States, Japan, Ukraine, and France.
  - Mixed-status site modeling: sites with both operating and under-construction units (e.g. Kudankulam) are modeled accurately without collapsing unit distinctions.
  - Multi-parameter filtering (`filterFacilities`): country code, operational status, historical operating year, and text search.
  - Integrity validation (`validateFacilityIntegrity`): enforces latitude/longitude ranges, unique unit numbers, and chronological sanity between commercial and shutdown dates.
  - Unit tested with 10 tests passing (`lib/globe/schemas.test.ts`, `lib/globe/facility-model.test.ts`).
- Interactive Globe Viewer Component (`features/globe/GlobeViewer.tsx`, `GlobeViewer.module.css`):
  - Server-readable directory first: complete sortable HTML table fallback rendering all facility and unit rows.
  - Geospatial SVG world projection with synchronized clickable facility pins.
  - Count equivalence: exact 1:1 match between map pins and table rows.
  - Selected facility inspector with mixed-status transparency callout, unit-by-unit technical table, coordinates, and IAEA PRIS link.
  - Full resilience: if WebGL is unavailable, the directory and table remain 100% accessible and filterable.
  - Tested with 5 component tests (`features/globe/GlobeViewer.test.tsx`).
- App Router Route (`app/globe/page.tsx`):
  - Integrated into Next.js App Router with AppShell, metadata, and query param support (`?facility=...`).
- Playwright End-to-End Suite (`tests/e2e/globe.spec.ts`):
  - 15 passing tests across Chromium, Firefox, WebKit on port 3100.
  - Verifies synchronized counts, country filtering, unit breakdown inspection, search, resilience to unknown facility param, and mobile viewport (390x844).

## Verification Evidence
- `npx vitest run lib/globe/ features/globe/`: Passed (15/15 tests).
- `npm run verify`: Prettier, TypeScript typecheck, ESLint, all 71 vitest test files (382 unit tests), and Next.js static build (46 static pages) passed.
- `PLAYWRIGHT_PORT=3100 npx playwright test tests/e2e/globe.spec.ts`: Passed (15/15 tests across Chromium, Firefox, WebKit).
