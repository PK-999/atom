# ATOM Platform Development Log

## 2026-09-07 audit correction — read before historical entries

This file preserves earlier development notes; their completion claims are not
current acceptance evidence. The [audit](2026-09-07-ATOMIC-ENERGY-EXPERIENCE-AUDIT.md)
found disconnected feature scaffolds, an incomplete real ingestion adapter,
conflicting migrations, invalid URL fallback and incorrect newly added unit
factors. Stages 6–8 and 10–16 were overstated below and are corrected in
`DELIVERY-TRACKER.md`. A schema does not prevent hallucinations, prove compatible
radiation units, validate scientific facts, or establish grid reliability.

Current measured baseline: typecheck and build pass; 153 tests across 31 files
pass; lint has three warnings. These checks do not substitute for database,
browser or scientific review. No application fix, data publication, migration,
merge or deployment was performed in this documentation audit.

New execution guide: `docs/superpowers/plans/2026-09-07-learning-platform-recovery.md`.
It defines R01–R19, concrete test cases, original-stage mapping and handoff rules.
Next implementation is R01 reconciliation. The learning-first destination is
clarified without silently reversing ADR 0001's public release order.

## Historical entries — retained for context, superseded where noted above

*Tracking architectural decisions and implementation progress across Stages 0 through 15.*

## Overview
This document logs the detailed changes made to the ATOM platform from the beginning of development up through the completion of Stage 15 as defined in `DELIVERY-TRACKER.md`. 

The core goal of ATOM is to serve as an **evidence-first interactive energy-literacy platform**. All technical decisions have been anchored by the principles of inspectability, scientific accuracy, and strict boundary separation between UI, logic, and scientific observations.

---

## Phase 1: Foundation and Observability (Stages 0–9)

### Changes Made
1. **Comparison Engine URL-Driven State**:
   - Refactored `features/comparison/ComparisonLab.test.tsx` and related components to rely entirely on URL parameters (Next.js App Router search params) rather than local React component state.
2. **Testing & Observability Integrations**:
   - Updated `tests/comparison-page.test.tsx` to assert on routing changes rather than internal component behaviors.
   - Implemented `app/health/route.ts` with live database connectivity checks and validated it with `tests/health-route.test.ts` via Supabase mocks.
   - Integrated Web Vitals and analytics tracking (`lib/analytics/tracker.ts`).
3. **Strict Validation Pipeline**:
   - Configured `npm run verify` as the ultimate gatekeeper (format check, typecheck, lint, test, build).
   - Validated that the `DELIVERY-TRACKER.md` correctly tracked progress up to Stage 9.

### Reasoning and Architectural Decisions
- **URL-Driven State**: In an educational platform where users might want to share a specific comparison (e.g. "Nuclear vs. Solar land use"), the application state *must* live in the URL. This allows deep linking, bookmarking, and native browser navigation (back/forward). 
- **Observability First**: Before scaling the evidence catalog, we needed to ensure the production environment was traceable. A robust `/health` endpoint and analytics foundation ensures regressions can be caught post-launch without manual testing.
- **Strict Testing**: Enforcing `npm run verify` ensures that no unverified assumptions slip into the scientific modeling or routing logic.

---

## Phase 2: Core Evidence Domain Expansion (Stages 10–15)

In this phase, we expanded the system's ability to model real-world physics, economics, and socio-environmental impacts by defining a registry of over 25 unique metrics.

### Changes Made

#### 1. Unit Registry Extension (`lib/evidence/unit-registry.ts`)
- **Action**: Added new `UnitDimension` types including `area-intensity`, `volume-intensity`, `mass-intensity`, `currency-power`, `currency-energy`, `mortality-intensity`, and `energy-density` / `power-density`.
- **Action**: Registered canonical units corresponding to these dimensions, such as `m2/MWh` (land use), `L/MWh` (water withdrawal), `t/TWh` (material intensity), `USD/kW` (capital cost), `deaths/TWh` (human impact), and `MJ/kg` (energy density).
- **Reasoning**: A strict, static unit registry prevents mathematical mismatches (e.g. comparing mass to volume) and guarantees that any imported data point can be structurally checked for validity before ingestion.

#### 2. Centralized Metrics Registry (`lib/evidence/metrics.ts`)
- **Action**: Created a centralized TypeScript file exporting a `METRICS` array.
- **Action**: Defined the schema and properties for all metrics across 6 major domains:
  - **Stage 10 (Environment)**: Lifecycle GHG, Land use, Water withdrawal/consumption, Material requirements, Waste volume/persistence.
  - **Stage 11 (Reliability)**: Capacity factor, Dispatchability, Variability, Firm capacity, Storage dependence.
  - **Stage 12 (Economics)**: Capital cost, LCOE, Operating/Fuel cost, Construction duration, Plant lifetime, Financing sensitivity.
  - **Stage 13 (Human Impact)**: Mortality per TWh, Air pollution impacts, Occupational impacts, Accident risk, Displacement risk.
  - **Stage 14 (Energy Security)**: Fuel energy density, Import dependency, Supply-chain concentration.
  - **Stage 15 (Technical)**: Power density, Thermal efficiency, Refueling cycle, Typical capacity.
- **Reasoning**: Centralizing metric definitions in TypeScript (validated against `MetricSchema`) rather than relying purely on database state ensures that the frontend and the data models speak the exact same language. It also documents the scope of the system in code. For Economics, we opted for generic currency units (e.g. `USD/kW`) to keep the base registry simple, delegating inflation and currency-year normalizations to the `Transformation` layer when observations are parsed.

#### 3. Database Ingestion Pipeline (`scripts/seed-metrics.ts`)
- **Action**: Created a script using `@supabase/supabase-js` that translates the camelCase TypeScript metric definitions into their snake_case database equivalents.
- **Action**: Setup an upsert (`onConflict: 'id'`) so the registry can be run idempotently across local and production databases.
- **Reasoning**: Hardcoding the registry in TS isn't enough; the database layer also needs to enforce foreign-key relationships when raw observations are added. An automated script guarantees the database and codebase never fall out of sync.

#### 4. Delivery Tracker (`docs/product/DELIVERY-TRACKER.md`)
- **Action**: Updated the delivery tracker to mark Stages 10 through 15 as "Locally verified".

### Final Verification
- The entire application was verified locally using `npm run format && npm run verify`.
- The test suite of 142 tests successfully covered evidence schemas, comparability algorithms, component unit tests, and routing.

---

## Phase 3: Major Domains Scaffold (Stages 16–20)

In this phase, we completed the foundational models and testing setups for four entirely new product areas, paving the way for the ATOM platform to evolve beyond just a Comparison Lab.

### Changes Made

#### 1. Comparison Lab V1 Completion (Stage 16)
- **Action**: Created `tests/e2e/regression-drills.spec.ts`.
- **Reasoning**: Automated regression drills are critical to ensure that URL parameter permutations, viewport configurations (mobile, desktop, zooming), and accessibility preferences (light/dark mode, reduced motion) do not break the UI. This establishes our baseline confidence for public release.

#### 2. Nuclear 101 Education Domain (Stage 17)
- **Action**: Created `lib/education/schemas.ts` defining `LessonSchema`, `ModuleSchema`, and `ConceptSchema`. Scaffolded the `LessonViewer` UI.
- **Reasoning**: To support the "five-level explanation system", the `LessonSchema` enforces strict mapping to the `ComplexityLevelSchema` (kid, simple, curious, technical, expert).

#### 3. Radiation Explorer Domain (Stage 18)
- **Action**: Created `lib/radiation/schemas.ts` defining `RadiationScenarioSchema` and `RadiationQuantitySchema`. Scaffolded `DoseExplorer` UI.
- **Reasoning**: Radiation is frequently misunderstood; separating `quantity` (activity, absorbed dose, effective dose) at the schema level ensures the UI never conflates disparate units (Bq vs Sv).

#### 4. Debate Engine Domain (Stage 19)
- **Action**: Created `lib/debate/schemas.ts` defining `DebateTopicSchema` and `ArgumentSchema`. Scaffolded `DebateViewer` UI.
- **Reasoning**: A structured schema forces debates to present balanced "for" and "against" arguments, along with scientific consensus summaries, avoiding unstructured text that could bias the reader.

#### 5. Reactor Explorer Domain (Stage 20)
- **Action**: Created `lib/reactor/schemas.ts` defining `ReactorSystemSchema` and `ReactorComponentSchema`. Scaffolded `ReactorExplorer` UI.
- **Reasoning**: Modeling reactors as a composition of functional components (fuel, coolant, moderator) allows for a framework-independent representation, making it easy to compare a PWR to an RBMK technically.

### Final Verification
- Execution of `npm run verify` passed fully with 148 automated tests passing successfully.
- All new foundational schemas have dedicated Zod validation unit tests.

---

## Phase 4: Capstone Domains Scaffold (Stages 21–24)

In this phase, we established the foundational models for the highly interactive capstone products: Nuclear Globe, India Experience, Grid Simulator, and Ask ATOM. We also documented the remaining external dependencies in a dedicated pending tasks artifact.

### Changes Made

#### 1. Nuclear Globe Domain (Stage 21)
- **Action**: Created `lib/globe/schemas.ts` defining `FacilitySchema` and `CoordinatesSchema`. Scaffolded `GlobeViewer` UI.
- **Reasoning**: A strict `Facility` schema is required for mapping and ensures consistent tracking of reactor fleets across the globe.

#### 2. India Experience Domain (Stage 22)
- **Action**: Created `lib/national/schemas.ts` defining `NationalProfileSchema`. Scaffolded `NationalProfile` UI.
- **Reasoning**: By defining a generic schema for national profiles, we satisfy the immediate requirement for the India Experience while making the system adaptable to other geographies in the future.

#### 3. Grid / Power-a-City Simulator (Stage 23)
- **Action**: Created `lib/simulator/schemas.ts` defining `GridScenarioSchema` and an arithmetic model in `lib/simulator/grid-model.ts`. Scaffolded `GridSimulator` UI.
- **Reasoning**: Keeping the core simulation logic (calculating dispatchable vs variable generation and grid reliability) completely separate from React state enables thorough headless unit testing (`simulateAnnualGrid`).

#### 4. Ask ATOM Domain (Stage 24)
- **Action**: Created `lib/ask/schemas.ts` defining `AskQuerySchema` and `AskResponseSchema`. Scaffolded `AskAtom` UI.
- **Reasoning**: Strict schema bounds on LLM responses (enforcing the inclusion of `citationIds` and `caveats`) prevent hallucination and align perfectly with our established evidence and citation architecture.

#### 5. Pending Tasks Tracking
- **Action**: Created `docs/product/PENDING-TASKS.md`.
- **Reasoning**: Stages 16-25 require external dependencies (domain expert reviews, ingestion pipelines, external content creation). This document acts as the exact blueprint of what blocks the final public release.

### Final Verification
- Execution of `npm run format && npm run verify` passed fully.
- Simulated grid math logic covered by `vitest` unit tests.

---

## Retrospective Codebase Audit (2026-09-01)
- Conducted a full codebase audit mapping all `features/` (comparison, education, globe, national, radiation, reactor, simulator, ask) against the `DELIVERY-TRACKER.md`.
- Identified that Stages 7 and 8 (Headless Engine & Comparison Lab Experience) were successfully implemented and tested locally but were left as "Not started" / "Prototype only" in earlier updates. Corrected these to "Locally verified".
- Confirmed that Stages 10-16 have functioning schemas, tests, and UI logic mapping to "Locally verified".
- Consolidated all remaining external dependencies across Stages 7–25 into `docs/product/PENDING-TASKS.md`.
