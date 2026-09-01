# ATOM Stages 6–9 Evidence, Comparison, and Release Design

Date: 2026-09-01  
Status: Approved architecture, recorded after user approval on 2026-09-01

## Purpose

Stages 6–9 turn the existing evidence-domain contracts and Comparison Lab
prototype into a versioned, repository-backed product slice that can release
metric categories without embedding scientific values in React or changing the
application architecture for every release.

The stages form one ordered delivery chain:

```text
versioned evidence -> headless comparison result -> accessible Lab UI
                  -> independently releasable category + operations
```

Each stage must remain independently testable. Stage 6 establishes trustworthy
records and publication boundaries. Stage 7 consumes those records through a
framework-independent repository interface. Stage 8 renders the resulting
domain outcomes. Stage 9 makes category activation, monitoring, correction,
and rollback operational.

## Scope

This design covers:

- PostgreSQL migrations, row-level security, versioned evidence publication,
  and a reproducible ingestion workflow;
- a repository abstraction with local-fixture and Supabase implementations;
- the complete headless Comparison Lab state and result contracts;
- the approved responsive Comparison Lab experience backed by the headless
  engine;
- typed privacy-conscious analytics, category availability, monitoring,
  performance budgets, correction drills, and dataset rollback;
- one real, redistribution-permitted institutional dataset used to prove the
  Stage 6 lifecycle without making a Stage 10–15 category generally available.

This design does not release a scientific metric category. Category research,
full evidence review, and public releases remain Stages 10–15. The Stage 6
reference dataset is feature-disabled until the applicable category release
gate passes. No user account, editor UI, billing system, or broad content
management system is introduced.

## Product and Scientific Invariants

- React renders evidence; it never owns scientific truth, representative-value
  policy, comparability policy, or unit conversion.
- Missing, incompatible, disputed, stale, unavailable, and licence-restricted
  evidence remain explicit domain outcomes.
- No source observation is mutated by normalization or projection.
- Human-friendly equivalents always preserve the scientific value, scientific
  unit, assumption, and provenance.
- Raw observations are returned only when source, dataset, and observation
  redistribution permissions all allow it.
- Complexity changes explanation depth, not observations or scientific
  results.
- Every chart has a directly accessible table or textual alternative.
- URL parameters override local preference. Each invalid parameter falls back
  independently without discarding other valid parameters.
- Public clients never receive a Supabase service-role or secret key.
- Anonymous database access is read-only and limited to fully published
  evidence through row-level security.
- Draft or in-review evidence cannot become public through a join, view,
  repository adapter, or raw-mode request.
- No personal identifier, free-form search text, full comparison URL, IP
  address, or user-agent string is stored as an analytics property.

## Architectural Decisions

### Vertical evidence-first delivery

Implementation proceeds as a narrow end-to-end slice before broadening the UI.
The first slice moves one reviewed observation through schema validation,
versioning, publication, repository retrieval, comparison projection, and an
inspectable UI state. This proves the boundaries early and avoids coupling the
finished UI to preview constants.

### Dual repository adapters

The headless engine depends on an `EvidenceRepository` interface, not on
Supabase or React. Two implementations are required:

- `LocalEvidenceRepository` supplies deterministic reviewed fixtures to unit,
  component, integration, and offline development tests.
- `SupabaseEvidenceRepository` reads published records from PostgreSQL through
  server-only infrastructure.

The local adapter is a real contract implementation, not a second domain
model. A shared repository contract suite must pass against both adapters.
Production may fall back only to an explicit unavailable state when Supabase
configuration is absent; it must not silently replace unavailable production
evidence with fixtures.

### Server-first query boundary

`/compare` remains a server-rendered route. The server parses canonical URL
state, requests a `ComparisonResult`, and passes a serializable initial result
to the client interaction shell. Subsequent control changes update the URL and
request a fresh server result through a narrowly scoped route handler. The
browser never queries unpublished evidence tables directly.

### Version activation instead of destructive rollback

Published dataset versions are immutable. A category release points to one
active dataset version. Rollback changes that pointer to a previously reviewed
published version and records who initiated the change, why, and when. It does
not delete or overwrite evidence.

## Stage 6 — Supabase and Evidence Ingestion Platform

### Database organization

Evidence tables live in the exposed `public` schema because anonymous reads are
required, but every table has row-level security enabled. Internal ingestion
and operational tables live in a non-exposed `private` schema. Public reads are
granted only where required and always paired with RLS policies.

The initial migration set creates:

- `technologies`: stable identifiers, labels, descriptions, and lifecycle
  status;
- `geographies`: stable identifiers, display names, scope kind, and optional
  parent geography;
- `metrics`: canonical unit, value kind, range semantics, representative rule,
  geography support, explanation content, and registry category;
- `sources`: source tier, title, publisher, URL/identifier, conflict disclosure,
  licence, redistribution status, access date, and verification date;
- `studies`: methodology, system boundary, period, publication/version, and
  source relationship;
- `datasets`: logical dataset identity, publisher, licence, raw-access policy,
  and source relationship;
- `dataset_versions`: immutable version identifier, checksum algorithm and
  digest, acquisition date, transformation version, review state, review and
  publication metadata, and supersession relationship;
- `observations`: metric, technology, geography, study, source, dataset version,
  value kind, point or range fields, unit, representative kind, uncertainty,
  verification date, and publication state;
- `observation_transformations`: ordered, immutable steps with operation name,
  input/output units, parameters, software version, and explanatory note;
- `metric_releases`: availability state, active dataset version, supported
  technologies, geographies, period, Typical/Range/Raw mode flags, and
  redistribution decision;
- `corrections`: affected observation, previous and corrected dataset versions,
  reason, material impact, decision date, and publication metadata;
- `private.ingestion_runs`: idempotency key, input checksum, pipeline version,
  status, timestamps, counts, and failure summary;
- `private.ingestion_events`: ordered run events for acquisition, validation,
  normalization, conversion, quality checks, derivation, review, publication,
  and rollback;
- `private.release_operations`: append-only category activation, correction,
  and rollback audit records.

Primary keys use stable application identifiers. Foreign keys are indexed when
they participate in repository filters or joins. Public query indexes cover
published observations by metric, technology, geography, and active dataset
version. Partial indexes target published records instead of indexing drafts
for public access paths.

Database constraints enforce point/range exclusivity, ordered ranges,
non-empty uncertainty and methodology fields, valid publication transitions,
and the presence of review metadata before publication. Cross-row scientific
eligibility remains in the validated domain service and is rechecked before a
publication transaction.

### Security model

- `anon` and `authenticated` receive `SELECT` only on intentionally public
  tables.
- Public RLS policies require `publication_status = 'published'` and, for
  observation access, a published dataset version and a released metric state
  whose mode permits the requested representation.
- No anonymous or authenticated write policy is created in V1.
- Server ingestion uses a server-only secret or direct database connection;
  neither is prefixed with `NEXT_PUBLIC_`.
- Views exposed through the Data API use invoker security. Privileged functions
  are avoided; any unavoidable privileged function lives outside `public`, has
  explicit execute grants, validates its caller, and receives a security
  review.
- Migrations include automated SQL assertions proving that anonymous users
  cannot read draft, in-review, withdrawn, restricted raw, or inactive-version
  observations.

### Ingestion lifecycle

The command-line ingestion entry point accepts a manifest plus a local source
artifact. Network acquisition is a separate explicit step so transformations
remain reproducible offline.

```text
acquire -> checksum -> register source/dataset -> validate manifest
        -> normalize records -> convert canonical units -> quality checks
        -> derive permitted values -> persist draft version
        -> independent review -> transactional publish -> feature-disabled record
```

Every run has an idempotency key derived from dataset identity, source version,
input checksum, and transformation version. Repeating the same run returns the
existing result. A changed input or transformation creates a new immutable
dataset version. Duplicate observation identities within one version fail the
run. A failed run cannot partially publish.

The manifest is version-controlled and records source metadata, access date,
licence, redistribution decision, expected checksum, parser identifier,
transformation version, canonical units, and reviewer requirements. Parsers
produce Stage 5 evidence-domain inputs; normalization and conversion reuse
`lib/evidence` rather than reimplementing scientific rules.

The Stage 6 proof uses one real, redistribution-permitted institutional dataset
selected through the documented source-tier and licence review. The source
artifact itself is stored only when its licence permits repository storage;
otherwise the repository stores the checksum, acquisition instructions, and
source reference. Its release record remains feature-disabled, ensuring that
pipeline validation is not mistaken for a public category release.

### Stage 6 exit evidence

Stage 6 passes only when migrations apply from an empty database, the same
manifest is idempotent, a modified fixture creates a new version, publication
rejects incomplete evidence, anonymous reads expose only published permitted
records, a previous version can be reactivated without data loss, and the real
reference observation is inspectable with its full provenance.

## Stage 7 — Headless Comparison Engine

### Public contracts

The Stage 7 package exports the following stable framework-independent API:

```ts
type ComparisonSearchParams = Pick<
  URLSearchParams,
  "get" | "getAll" | "has"
>;

type EvidenceRepository = {
  getMetricDefinition(metricId: string): Promise<MetricDefinition | null>;
  listMetricReleases(): Promise<MetricRelease[]>;
  listTechnologies(): Promise<Technology[]>;
  listGeographies(metricId: string): Promise<Geography[]>;
  getPublishedObservations(query: ObservationQuery): Promise<MetricObservation[]>;
};

function parseComparisonState(
  searchParams: ComparisonSearchParams,
  preferences?: Partial<ComparisonPreferences>,
): ComparisonState;

function serializeComparisonState(state: ComparisonState): URLSearchParams;

function getComparisonResult(
  query: ComparisonQuery,
  repository: EvidenceRepository,
): Promise<ComparisonResult>;
```

The existing Stage 5 functions `selectRepresentative`,
`normalizeObservation`, and `assessComparability` remain the scientific core.
Stage 7 composes them; it does not duplicate their policies.

### URL and state behavior

Canonical parameters are `sources`, `metric`, `region`, `mode`, `units`, and
`level`. Default state is Nuclear, Solar, Wind, Gas, and Coal; lifecycle
emissions; Global; Typical; Scientific; Curious. Technology order is preserved
in `sources` and serialization is deterministic.

Each parameter is parsed independently. A malformed `mode` falls back to
Typical while a valid `region` and `level` remain active. URL values override
local complexity and unit preferences. Unknown parameters are omitted from the
canonical serialization. Browser back/forward restores the exact canonical
comparison state.

Selection supports add, remove, reorder, restore defaults, filter, and sort.
Charts support at most eight technologies. Larger selections remain valid and
automatically select the table view.

### Projection pipeline

`getComparisonResult` performs the following ordered steps:

1. validate the query and load the metric release;
2. resolve technology and geography availability;
3. retrieve only published observations for the active dataset version;
4. assess comparability before aggregating or converting;
5. project Typical, Range, or Raw without mutating source observations;
6. normalize compatible numeric observations to the selected scientific unit;
7. attach a human equivalent when requested and available;
8. produce representative values, missing-data outcomes, compatibility issues,
   narrative-summary inputs, applicable periods, and provenance references;
9. deeply freeze the result returned to consumers.

Typical mode applies the metric's declared representative rule. Range mode
retains source range semantics and does not manufacture bounds from point
values. Raw mode returns observation-level records only when licensing permits;
otherwise it returns a restricted outcome with source-level provenance.

The result model distinguishes complete, partial, empty, unavailable, stale,
restricted, disputed, and incompatible states. Zero and negative values are
valid numeric observations. Extreme ranges and outliers remain visible with
their source context and cannot be silently clipped.

### Typed analytics

The engine exposes an allowlisted event union for comparison opened, source
changed, metric changed, geography changed, mode changed, units changed,
complexity changed, table opened, source opened, Data Passport opened,
Challenge opened, comparison shared, unavailable state seen, and mismatch seen.
Event payloads contain only approved identifiers, counts, booleans, and display
modes. Runtime validation rejects extra properties.

### Stage 7 exit evidence

Stage 7 passes when its repository contract suite runs against local and
Supabase adapters, URL round-trips and individual fallbacks are exhaustive,
all projection and edge-state tests pass without React, and comparison results
retain complete source references and immutable observations.

## Stage 8 — Shared Comparison Lab Experience

### Rendering and component boundaries

`app/compare/page.tsx` owns server parsing and initial result retrieval.
`features/comparison` contains the client interaction shell and feature-owned
controls. Shared controls, charts, and evidence primitives remain in their
existing Stage 4 component families.

The feature is decomposed into focused units:

- state controller: canonical URL transitions and browser history;
- source selector: ordered chips/search on desktop and a mobile sheet;
- metric selector: grouped search, definitions, recent metrics, and related
  metrics;
- comparison toolbar: geography, mode, unit, view, restore, and share controls;
- result renderer: semantic chart selection and table/text alternatives;
- explanation panel: L1–L5 “What This Means” content;
- evidence interactions: Data Passport, Challenge This Number, confidence, and
  methodology detail;
- result-state panels: loading, empty, partial, missing, stale, restricted,
  error, disputed, and methodology mismatch.

The approved Digital Science Museum interaction language with Scientific
Editorial restraint remains the visual target. This stage extends existing
tokens and primitives and does not introduce a fourth visual direction.

### Interaction behavior

- The initial visit shows the specified useful default.
- Every committed control change creates canonical URL state and a shareable
  URL; transient search text and open-sheet state remain local.
- Complexity changes preserve technologies, metric, geography, display mode,
  unit mode, and order.
- The chart type follows metric semantics: bar for discrete representatives,
  range/distribution for uncertainty, scatter for relationships, and line for
  time series. Unsupported combinations use the table rather than a misleading
  chart.
- Values and units remain directly visible without hover. Keyboard and touch
  users can open the same evidence details.
- Selecting more than eight technologies switches to the table and explains
  why.
- Share uses the canonical URL and provides copy confirmation without exposing
  uncommitted UI state.
- SEO comparison routes resolve to canonical comparison state and server
  metadata without duplicating scientific values.

On narrow screens, comparisons are vertical, filter and evidence details use
full-height or bottom sheets, closing a sheet restores focus to its trigger,
and core reading never requires horizontal scrolling. Dark, light, 200% zoom,
and reduced-motion behavior reuse the Stage 4 contracts.

### Failure and limitation behavior

Repository/network failure shows an error panel with retry and preserves the
current URL. An empty supported query states that no reviewed observations are
available. Partial results keep available technologies visible and list the
missing ones. Method mismatch keeps observations inspectable but blocks a
single representative ranking. Stale evidence shows the last verification date.
Restricted raw mode explains the licence boundary and links to permissible
sources. No state silently substitutes preview data.

### Stage 8 exit evidence

Stage 8 passes when the complete primary journey works against reviewed test
evidence; canonical state survives reload and back/forward; every evidence
interaction is keyboard/touch accessible; chart, table, and textual summaries
agree; all limitation states render; and mobile, tablet, and desktop browser
checks pass. The Lab remains unreleased until Stage 10 evidence review enables
the first category.

## Stage 9 — Release and Observability Foundation

### Category registry and rollout

The category registry is typed, version-controlled configuration keyed by
category and metric. Each entry declares availability, active dataset version,
route exposure, allowed modes, release date, and rollback target. Application
code reads the registry through one interface. Enabling a reviewed category or
switching its active version requires data and configuration changes, not an
application architecture change.

Preview may expose feature-disabled test records only behind a server-only
environment switch. Production routes return explicit unavailable states until
a category is approved.

### Monitoring and analytics

Operational signals cover:

- server comparison failures and latency;
- failed and stalled ingestion runs;
- stale active datasets;
- broken or unreachable source URLs;
- release activation and rollback failures;
- client rendering errors and hydration warnings;
- Core Web Vitals and bundle-size regressions;
- allowlisted evidence-engagement and comparison-completion events.

Analytics pass through a typed `AnalyticsSink`. The default development sink
is inspectable and deterministic. The production sink sends only allowlisted
event names and properties to the configured privacy-respecting provider.
Provider absence disables event transport visibly in operational diagnostics;
it never breaks the Comparison Lab.

Structured application logs include a generated request or ingestion-run
identifier, error class, metric/category identifier when applicable, and no
raw query string or personal identifier. Alerts and provider configuration are
documented as deployment steps because credentials and account settings do not
belong in Git.

### Performance budgets

The Comparison Lab targets LCP below 2.5 seconds and production Lighthouse
Performance above 90, with Accessibility, Best Practices, and SEO above 95.
CI additionally records route JavaScript size, hydration cost, and layout shift.
Evidence dialogs, complex chart modules, and non-default selectors are lazy
loaded where this materially reduces initial client work. Table and server
summary content remain available without waiting for those modules.

### Drills and release evidence

Automated and documented drills cover dataset-version rollback, material source
correction, a broken source link, a stale dataset, a failed ingestion, and a
disabled category. Each drill records expected user-visible behavior,
operational signal, recovery action, and verification query.

Stage 9 passes when the primary E2E journey runs from opening `/compare`
through control changes, evidence inspection, share URL creation, and reload;
accessibility automation and manual scripts are current; performance budgets
are measured; monitoring contracts emit test events; and a category can be
activated or rolled back without code-path changes.

## End-to-End Data Flow

```text
licensed source artifact + manifest
  -> checksum and deterministic parser
  -> Stage 5 schema validation and unit normalization
  -> immutable draft dataset version
  -> independent scientific/editorial review
  -> transactional publication under RLS
  -> EvidenceRepository
  -> getComparisonResult
  -> server-rendered initial Comparison Lab result
  -> canonical URL-driven interactions
  -> accessible chart/table/evidence detail
  -> allowlisted analytics and operational monitoring
```

Every boundary returns typed outcomes. Parser and database failures are
operational errors; missing or incompatible evidence is a scientific/product
state. The UI must not turn one into the other.

## Testing Strategy

### Unit

- SQL-compatible schema constraints mirrored in Zod validation;
- manifests, checksums, idempotency keys, parser outputs, transformations, and
  duplicate detection;
- URL parsing, serialization, independent fallbacks, ordering, filtering, and
  sorting;
- Typical/Range/Raw projection, conversions, human equivalents, outliers,
  zero, negatives, extreme ranges, and immutability;
- analytics allowlist and category-registry validation.

### Database integration

- migrations apply from empty state and remain ordered;
- RLS prevents anonymous draft, withdrawn, inactive-version, and restricted raw
  reads;
- public queries return complete published relationship graphs;
- repeated ingestion is idempotent and partial publication rolls back;
- correction and dataset rollback preserve audit history;
- repository contract tests pass against the database adapter.

### Component and route integration

- all selectors, chart families, evidence interactions, state panels, and
  complexity presentations;
- server initial state matches client hydration and canonical URL;
- result refresh preserves unaffected state and focus;
- chart values, table values, narratives, and provenance agree.

### End-to-end and manual verification

- primary Comparison Lab journey through URL reload and browser history;
- Chromium, Firefox, and WebKit at 390×844, 768×1024, and 1440×900;
- light/dark, 200% zoom, keyboard-only, touch, screen-reader summaries, focus
  restoration, and reduced motion;
- loading, empty, partial, missing, stale, restricted, error, disputed,
  incompatible, invalid URL, and rollback states;
- console and hydration inspection plus measured performance budgets.

## Delivery Decomposition

The approved architecture will be implemented through four ordered plans so
each stage has a meaningful review and exit gate:

1. Stage 6: migrations, security, adapters, ingestion, publication, and
   rollback proof;
2. Stage 7: URL/state contracts, repository-backed projections, provenance,
   and analytics types;
3. Stage 8: server/client Comparison Lab integration and full responsive,
   accessible interaction states;
4. Stage 9: category activation, monitoring, performance budgets, E2E journey,
   drills, and release evidence.

Each plan uses test-driven development for parsing, scientific logic,
transformations, and database behavior; ends with an independent review and
commit; and updates `docs/product/DELIVERY-TRACKER.md` only when authoritative
verification evidence supports the new status.

## Acceptance Summary

Stages 6–9 are complete only when all four stage gates pass. A working visual
prototype, a green unit suite without database security tests, or an applied
migration without browser verification is insufficient. The resulting system
must demonstrate that published evidence can be ingested, compared, explained,
inspected, monitored, corrected, and rolled back without invented values or
silent loss of provenance.
