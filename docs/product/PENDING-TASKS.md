# ATOM pending tasks — executable queue

Updated: 2026-09-07. This replaces the earlier list that described unfinished
local implementation as external dependencies. The audit found no accepted
completion gate for Stages 6–8 or 10–16.

Read [the audit](2026-09-07-ATOMIC-ENERGY-EXPERIENCE-AUDIT.md) and
[the detailed task/test plan](../superpowers/plans/2026-09-07-learning-platform-recovery.md).
Use the package IDs below; implementation steps and exact test cases live in
that plan. Overall stages live in [DELIVERY-TRACKER.md](DELIVERY-TRACKER.md).

## Start here

**R01 is the next task.** Reconcile root main and the Stage 6 worktree while
preserving all user changes. Do not run the current reference ingestion script.
Do not concatenate the incompatible migrations. Do not jump to new globe,
reactor or Ask UI because those scaffolds already exist.

The audit changed documentation only. None of the following fixes has been
implemented by the audit.

## Ordered task tracker

| ID    | Original stage | State                                | Concrete output                                                                             | Verification gate                                                                |
| ----- | -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| R01   | 0/2/6          | Ready                                | Recovery snapshot, schema ADR, chosen migration/repository/env contract                     | Reconciled type/unit/build checks plus disposable DB constraints                 |
| R02   | 5              | Pending R01                          | Correct land/material unit factors, derivation record                                       | Known-value conversion and range/nonmutation tests                               |
| R03   | 7              | Pending R01                          | Per-field URL fallback, aliases, source ordering and preferences                            | Invalid enums, repeated/empty/unknown IDs, round trips                           |
| R04   | 6              | Partial prior work; not accepted     | Real default transactional adapter, durable audit, independent reviews and actual DB tests  | Atomic failure, concurrent idempotency, publish/activate/rollback, licensing/RLS |
| R05   | 7              | Pending R02–R04                      | Validated domain result, geography/unit/representative policies, resilient health/readiness | Repository fixtures and integration; no null→zero                                |
| R06   | 4/8            | Pending R03/R05                      | Complete Lab selectors, source sheets, sharing, interpretation and evidence                 | Full browser journey and all result states                                       |
| R07   | 9              | Pending R04–R06                      | CI database/E2E, typed private analytics, release/freshness/rollback checks                 | Executed local pipeline and documented measurements                              |
| R08-E | 10             | Definitions only                     | Environment evidence including separate water/waste/material semantics                      | Source/licence/review/ingestion/UI gate per metric                               |
| R08-R | 11             | Definitions only                     | Reliability/grid metrics with context                                                       | Capacity factor/credit distinction, scenario boundaries                          |
| R08-C | 12             | Definitions only                     | Economics evidence                                                                          | Currency year, finance, vintage, geography, market checks                        |
| R08-H | 13             | Definitions only                     | Human impact evidence                                                                       | Distinct direct/modelled/occupational/evacuation outcomes                        |
| R08-S | 14             | Definitions only                     | Security evidence including stockpiling                                                     | Country, trade period, fuel form/processing checks                               |
| R08-T | 15             | Definitions only                     | Technical evidence                                                                          | Technology variants and valid quantity definitions                               |
| R09   | 16             | Not accepted                         | Full catalog coverage and release record                                                    | Actual cross-category evidence/URL/rollback/browser/performance tests            |
| R10   | 1/17           | Prepare after R01                    | Published content graph, topics, seven-lesson curriculum                                    | Missing/orphan/duplicate/cycle/draft-exposure tests                              |
| R11   | 17             | Scaffold only; pending R09/R10       | One complete energy lesson, then all seven                                                  | Lesson/checkpoint/source/next flow, no-JS, levels, local progress                |
| R12   | 1/17           | Not implemented                      | Home, topic hubs, search, glossary, trust/evidence routes                                   | Route integrity, draft exclusion, keyboard/mobile discovery                      |
| R13   | 18             | Unrouted scaffold                    | Quantity-safe radiation explorer                                                            | Unit/context/zero-log tests, sourced chart/table equivalence                     |
| R14   | 19             | Unrouted scaffold                    | Debate with context, citations and uncertainty                                              | All argument relationships and reviewed consensus basis                          |
| R15   | 20             | Unrouted scaffold                    | Reviewed reactor parts/flows explorer                                                       | Diagram/text/keyboard equivalence and source links                               |
| R16-G | 21             | Unrouted scaffold                    | Facility directory, then lazy map                                                           | Dated statuses/capacity/provenance, map/list parity and failure fallback         |
| R16-I | 22             | Unrouted scaffold                    | India narrative and explicit generation/capacity context                                    | Denominators/periods/partial totals and reviewed scenarios                       |
| R17   | 23             | Unrouted scaffold with model defects | Explicit annual grid arithmetic and controls                                                | No hidden 0.6 factor or claimed hourly reliability                               |
| R18   | 24             | Unrouted scaffold                    | Evaluated retrieval, then Ask UI/service                                                    | Citation support/abstention/draft exclusion/injection/failure tests              |
| R19   | 25             | Not operational                      | Scheduled checks and versioned corrections                                                  | Real successful check and handled failure, rollback evidence                     |

## Local work versus actual external dependencies

Local work that does not require a production service: schema reconciliation,
conversion/URL fixes, disposable DB adapter tests, a source/license review
packet, content schemas, route/UI implementation against explicit test fixtures,
search indexing, accessibility tests, monitoring scripts and rollback drills.

Actual external gates:

- Qualified scientific, editorial and licensing reviewers must approve real
  evidence. Agents may prepare packets; test reviewer IDs are not approval.
- A required artifact may be unavailable or restricted. Record the metric and
  licence/access reason; leave its comparison unavailable.
- Hosted database migration and deployment acceptance require inspecting the
  actual environment and applied history. Never infer it from local config.
- Browser/performance acceptance requires an executable preview and recorded
  checks. A build or screenshot from a previous commit is insufficient.
- Authenticated ownership/contact details and any chosen model/analytics vendor
  are configured only when needed. Do not invent these or make every local task
  wait for them.

A task is Blocked only when its next required step cannot proceed. Name the
missing input and continue independent authorized work; do not label whole
stages blocked merely because scientific publication review is pending.

## Existing code worth keeping

- Stage 4 shell, preference controls, semantic tokens, accessible overlays,
  evidence primitives and chart/table foundations.
- Stage 5 schemas, representative selection, comparability and conversion
  framework; new conversion entries still require correction.
- Delivery worktree versioned DB/RLS, repository contracts and ingestion
  orchestration, after reconciliation and completion of missing adapter tests.
- Later feature schemas/components as starting references only; their tables
  and text lists are useful but lack full provenance, routes and interactions.

## Update procedure after each task

1. Record exact changed files, branch/commit, test commands/results and relevant
   browser states in a verification record.
2. Record dataset/content versions and real review state separately.
3. Update this task row and the corresponding stage in DELIVERY-TRACKER.
4. Link the evidence record; do not remove failed/skipped gates.
5. Name the next dependency-ready task. Do not begin another flagship while the
   current accepted slice is unfinished.
