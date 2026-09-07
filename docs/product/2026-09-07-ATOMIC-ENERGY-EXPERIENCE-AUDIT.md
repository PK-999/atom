# ATOM: codebase audit and learning experience recommendations

Date: 2026-09-07. Scope: the current working directory on `main` at `ab0429c`, including its uncommitted changes, and the separate Stage 6 delivery worktree at `c8cb58a` with its partial edits. This is a repository audit and implementation specification, not a scientific review or approval to release content.

Implementation instructions: [ordered task plan](../superpowers/plans/2026-09-07-learning-platform-recovery.md). Progress: [delivery tracker](DELIVERY-TRACKER.md). Next task: [pending tasks](PENDING-TASKS.md).

## 1. Recommendation

Build a learning library with interactive exhibits. Make the visitor's question the organizing principle: “How does it work?”, “What are the risks?”, “What happens to the waste?”, “How does it compare?”, and “What is happening in my country?” The Comparison Lab should be an important exhibit within ATOM, not its entire identity.

Keep the approved Digital Science Museum visual direction, restrained typography, source inspection, five explanation levels, server rendering, and existing accessible primitives. Do not restart the app, install another design system, or assemble a large collection of superficial dashboards.

Interpret “literally everything” as a maintained coverage register with meaningful links, review dates, and explicit gaps. No website can truthfully promise complete or permanently current knowledge. A documented gap is preferable to a fabricated answer. Cover nuclear science, electricity, engineering, fuel, waste, health, history, economics, institutions, and other peaceful applications. Explain safeguards and proliferation at a public educational level; do not turn educational scope into operational weapons or hazardous-material instructions.

## 2. What exists, and what does not

| Area inspected                                                                         | Current state                                                                                        | Reuse / action                                                                        |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `app/`, root layout and metadata                                                       | Only `/`, `/compare`, `/methodology`, `/design-system`, `/health` are implemented application routes | Keep App Router. Add learning/evidence routes through bounded tasks                   |
| `app/page.tsx`                                                                         | Foundation landing page with two links and internal design-status copy                               | Replace with question-led orientation after its layout target is recorded             |
| `components/layout`, settings and preferences                                          | Shared shell, themes, five levels, local persistence, URL preference logic                           | Reuse; eliminate the Lab's second navigation implementation                           |
| `components/ui`                                                                        | Tested buttons, chips, segmented controls, overlays, tabs, tooltips, feedback, command menu          | Compose these rather than introducing duplicate controls                              |
| `components/charts`                                                                    | Tested bar/range/distribution primitives with text representations                                   | Wire real domain projections into these; Lab still draws separate bars                |
| `components/evidence`                                                                  | Reusable passport, challenge, source and limitation primitives                                       | Reuse; Lab's inline evidence dialog still contains preview copy                       |
| `features/comparison`                                                                  | Preview-derived UI plus newly added direct Supabase mapping                                          | Replace mapping with the reviewed repository boundary; preserve useful visual work    |
| `lib/evidence`                                                                         | Substantial schema, conversion, representative-selection and comparability tests                     | Strong foundation, but new conversion entries contain errors                          |
| Root `lib/ingestion`, `scripts`, `supabase`                                            | Simpler uncommitted ingestion and migration implementation                                           | Do not treat as equivalent to reviewed worktree code                                  |
| Delivery worktree `data/ingestion`, `lib/supabase`, migrations and pgTAP               | Stronger version/publication/RLS/repository implementation; Task 5 still incomplete                  | Integrate deliberately after reconciling schemas and finishing its real adapter tests |
| Education, radiation, debate, reactor, globe, national, simulator, Ask feature folders | Eight components and schema tests exist, but no application route imports them                       | Scaffolds, not usable or released products                                            |
| `tests`, configs and CI                                                                | Unit/component tests and three-browser harness exist                                                 | Add behavior and DB tests; successful schema parsing is not feature acceptance        |
| Assets, global CSS, CSS modules, design references and QA records                      | Established visual language and historical screenshots                                               | Preserve assets and tokens; old screenshots do not verify current rendered behavior   |
| Product docs, ADRs, plans, trackers and development log                                | Extensive requirements, but conflicting completion claims and implementation ordering                | This audit corrects status; original numbered stages remain traceable                 |

Review covered first-party routes, features, libraries, shared components, tests, scripts, migrations, configuration and relevant documentation, with independent evidence and learning-surface reviews. Dependency internals, generated build files, secrets, remote database contents, hosted deployment state and historical binary assets were not exhaustively audited. UI findings are source-level findings; no new visual/browser acceptance is claimed.

## 3. Findings in implementation order

| ID  | Priority | Evidence and consequence                                                                                                                                                              | Required correction                                                                                                                                                                                        |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | P0       | `scripts/ingest-reference.ts` labels a real-looking IPCC observation published, uses `abc123xyz` as checksum, assumes a licence and provides no located table extraction/review proof | Quarantine this as an unverified example; prevent production execution. Acquire and checksum an actual licensed artifact. Never copy the example into a reviewed dataset                                   |
| A02 | P0       | `lib/evidence/unit-registry.ts`: `ha/TWh` factor is 10,000,000 relative to `m2/MWh`; `t/TWh` and `kg/MWh` share a factor                                                              | Correct dimensional arithmetic with known-value tests: 1 ha/TWh = 0.01 m²/MWh; 1 t/TWh = 0.001 kg/MWh. Reassess downstream outputs if ever persisted                                                       |
| A03 | P0       | `comparison-api.ts` queries no geography, chooses the first matching observation, uses `Number(obs.value)`, drops provenance, and assumes publication implies review                  | Query the requested geography/release, validate rows, normalize units, select representatives by explicit rule, preserve range/categorical/missing semantics. SQL NULL must never become a scientific zero |
| A04 | P0       | Root RLS gates observations on their own publication flag; root ingestion upserts directly and lacks immutable dataset versions/transactional review                                  | Reconcile toward the worktree's versioned schema and complete audited publication. Gate every public result by active release, parent publication and licensing                                            |
| A05 | P0       | `comparison-url.ts` reads Zod `error.errors`, returns raw fields after failure; reproduced invalid mode plus `sources` string                                                         | Parse each field independently, retain successful transformations, validate registry IDs and serialize deterministically                                                                                   |
| A06 | P1       | Empty observations leave `evidenceObservation` undefined; evidence dialogs dereference it. Fetch errors look like unknown metrics                                                     | Use discriminated result states and route error/loading boundaries. Empty results must render usable recovery actions without an evidence trigger                                                          |
| A07 | P1       | Lab labels DB results as preview, uses fixed emissions interpretation for other metrics, lacks working add/search/geography/units/share/restore, restricts removal to two             | Complete the single Lab journey with metric-specific explanations and shared evidence/chart primitives                                                                                                     |
| A08 | P1       | Root and delivery branch contain incompatible migration histories, env names and adapters; trackers mark unfinished gates verified                                                    | Reconcile before any database command; record which schema is authoritative and retain recovery snapshots                                                                                                  |
| A09 | P1       | `/health` creates the Supabase client outside its try/catch, and Playwright waits on that DB-dependent endpoint                                                                       | Separate application liveness from database readiness; provide deterministic no-credential preview/testing behavior                                                                                        |
| A10 | P1       | `lib/simulator/grid-model.ts` infers demand using an unsourced 0.6 load factor and names an annual energy ratio “reliability”                                                         | Require explicit factors and hours; label energy balance honestly. Annual arithmetic cannot establish hourly reliability                                                                                   |
| A11 | P1       | Radiation schema accepts arbitrary unit/quantity pairs; lesson/debate/facility/scenario models do not fully require claim provenance                                                  | Add reviewed content contracts before routing these scaffolds into public pages                                                                                                                            |
| A12 | P1       | Homepage lacks learning routes, search, glossary, source pages and topic structure                                                                                                    | Build coherent orientation and discovery after core correctness; release only reviewed destinations                                                                                                        |
| A13 | P2       | Analytics payload accepts arbitrary keys; WebVitals omits INP and assumes an injected global receiver                                                                                 | Use per-event allowlists, tested transport and explicit disabled state; collect no free text or full URLs                                                                                                  |
| A14 | P2       | Tests of later features mostly parse one valid object; regression drills check headings/control state, not evidence correctness or rollback                                           | Add negative validation, contract, route, interaction, DB and evidence tests with real acceptance oracles                                                                                                  |
| A15 | P2       | README says visual approval is pending although direction was approved; development log calls schemas sufficient to prevent hallucination                                             | Correct current-state documentation; schemas alone cannot prove truth, neutral tone, provenance or safe retrieval                                                                                          |

P0 means fix before publishing affected data or relying on the result. P1 means required for a coherent usable learning release. P2 means required for sustained release quality. Severity does not mean the defect was observed in a hosted production environment.

## 4. Verification performed for this audit

Commands ran in the root working directory, without changing application code or running ingestion/migrations:

| Check                                                                      | Actual result                                                                                                          |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                                                        | Passed                                                                                                                 |
| `npm test`                                                                 | 153 tests passed across 31 files; Node localStorage experimental warnings                                              |
| `npm run lint`                                                             | Exit 0, three warnings: unused simulator setter and unused citation imports in Ask/debate schemas                      |
| `npm run build`                                                            | Passed; confirms the five application routes listed above; build used existing local env without inspecting its values |
| Direct URL parser probe                                                    | Invalid mode remains `invalid`; sources becomes `"nuclear,wind"` rather than an array                                  |
| Direct conversion probes                                                   | Current output: 1 ha/TWh → 10,000,000 m²/MWh; 1 t/TWh → 1 kg/MWh; both incorrect                                       |
| Database, E2E, hosted browser, performance, scientific source verification | Not run for this documentation task; no acceptance claim                                                               |

Passing the current suite does not validate new scientific units or untested paths. Preserve these passing tests and add the missing failure cases.

## 5. Information architecture: breadth without clutter

Keep existing canonical routes from `INFORMATION-ARCHITECTURE.md`. Extend them, do not rename public URLs casually.

| Visitor destination | Route                                                      | First screen                                                                                | Secondary detail                                                                                       |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Orientation         | `/`                                                        | One sentence promise, Start learning primary action, one Explore alternative, search access | Three question-led pathways and one featured working exhibit                                           |
| Guided learning     | `/learn`                                                   | Ordered beginner path and topic browser                                                     | Saved local progress, prerequisites, level guidance                                                    |
| Lesson              | `/learn/[lesson]`                                          | One learning objective, concise explanation, one purposeful interaction                     | Definitions, sources, maths, related lesson                                                            |
| Topic library       | `/topics`, `/topics/[topic]`                               | Answer the core question and show prerequisites                                             | Related lessons, exhibits, debates and references                                                      |
| Exhibits            | `/explore`                                                 | Only working, released interactives                                                         | Radiation, reactor, map and grid pages as each passes gates                                            |
| Comparison          | `/compare`                                                 | A useful supported comparison or explicit evidence-not-yet-available state                  | Search, range/raw, geography, passport, alternatives                                                   |
| Evidence            | `/evidence`                                                | How to verify a claim and source search                                                     | `/evidence/sources/[sourceId]`, `/evidence/studies/[studyId]`, `/evidence/datasets/[datasetVersionId]` |
| Definitions         | `/glossary`, `/glossary/[term]`                            | Plain definition, scientific definition, related concepts                                   | Contextual backlinks                                                                                   |
| Search              | `/search?q=`                                               | Grouped published results with meaningful excerpts                                          | Type/topic filters and honest no-results suggestions                                                   |
| Trust               | `/about`, `/methodology`, `/accessibility`, `/corrections` | Mission, editorial methods, accessibility help, material revisions                          | Ownership/contact information only when actually supplied                                              |

Primary navigation: Learn, Compare, Explore, Evidence, About. Search is a utility, not a sixth content silo. Omit unavailable routes from public navigation. On mobile use a labeled menu and full-height search/filter sheets. Keep theme and complexity reachable without consuming the whole header.

Homepage composition: hero → three starting questions → one featured exhibit → compact topic library → evidence promise. No auto-playing atom animation, metric ticker, fake credibility counters, carousel, or wall of 25 roadmap cards. Aim for one clear primary action per section. Use existing semantic tokens and a 680–760px prose measure. Design density is evaluated with real content at 390px and 200% zoom.

Each lesson follows: question → learning objective → explanation → predict/manipulate/observe → check understanding → inspect sources → next step. The interaction must change an explanation or observable result. A button that only decorates the page does not qualify.

## 6. Knowledge coverage register to implement

Each row below becomes a topic record, with subtopics, prerequisites, linked lesson/exhibit IDs, reviewed claims, review date, status and explicit remaining gaps. A topic is not complete because its title exists.

| Topic ID                | Required coverage                                                                                                                    | Natural interaction / reading fallback                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `fundamentals`          | Energy, power, electricity, atoms, isotopes, binding energy, fission, fusion, decay, chain reactions                                 | Guided energy-to-electricity steps; static ordered explanation                |
| `reactors`              | Fuel, coolant, moderator, control, containment, turbine; PWR/BWR/PHWR/CANDU/RBMK/fast and molten-salt concepts; maturity differences | Labeled system explorer with keyboard step list                               |
| `fuel-cycle`            | Mining, milling, conversion, enrichment context, fabrication, use, storage, recycling, disposal and safeguards                       | Public-level lifecycle diagram; readable sequence                             |
| `radiation-health`      | Activity, absorbed/equivalent/effective dose, dose rate, exposure routes, contamination/irradiation, background, uncertainty         | Quantity-safe explorer and equivalent table; no personal diagnosis            |
| `safety-accidents`      | Defense in depth, regulation, Chernobyl, Fukushima, Three Mile Island, direct/modelled/displacement impacts, lessons learned         | Sourced timeline and distinct impact categories                               |
| `waste-decommissioning` | Waste categories, spent fuel, storage versus disposal, repositories, hazard evolution, decommissioning                               | Timescale explorer with labeled assumptions and text                          |
| `environment`           | Lifecycle emissions, land, water, mining/materials, ecosystem context                                                                | Comparison Lab with source boundaries                                         |
| `economics-grid`        | Capital/finance/operations/fuel, LCOE limits, construction, grid role, capacity factor versus capacity credit                        | Contextual cost explanations and bounded annual scenario                      |
| `security-governance`   | Fuel security, trade, regulation, safeguards, treaties, public participation, proliferation context                                  | Institutional glossary and contextual evidence; no operational misuse content |
| `world-india`           | Fleet history/status, country context, India's PHWRs, three-stage programme, breeders, thorium and scenarios                         | Map plus fully equivalent list; dated country narrative                       |
| `future-technologies`   | SMRs, advanced concepts, fusion, development stage, demonstrations versus commercial claims                                          | Maturity comparison with dates and uncertainty                                |
| `other-applications`    | Nuclear medicine, research, industry, agriculture, space and district/process heat                                                   | Evidence-linked explainers; clinical topics reviewed appropriately            |
| `history-society`       | Discovery, energy history, institutions, workers, communities, ethics and public debate                                              | Balanced sourced timeline and contextual readings                             |

## 7. Sequencing decision

The user's learning-first vision broadens the product destination; it does not explicitly revoke the approved Comparison-Lab-first delivery order in ADR 0001. Preserve the existing numbered stages. Add this recovery and learning plan as work packages mapped to those stages.

Proceed now with correctness, branch reconciliation, evidence plumbing, topic/content contracts and navigation preparation. Release Environment first after review. Complete the Comparison Lab catalog gates with explicit unavailable combinations, then release Nuclear 101 and later exhibits. Preparing content schemas does not authorize declaring those lessons released early. If product leadership explicitly changes the release sequence, record that specific change in an ADR and update all mapped dependencies before executing it.

## 8. What success looks like

A first-time visitor can identify a starting path, learn one concept, try one meaningful interaction, inspect its sources, and find the next concept without knowing scientific terminology. A skeptical visitor can find methodology and limitations within two intentional actions from a displayed claim. A mobile or keyboard visitor receives the same content and result, with no forced horizontal scroll for core reading.

Track learning-path completion, question/checkpoint outcomes and evidence engagement in aggregate, not time-on-site or pageviews alone. Initial usability acceptance is a small moderated pilot: at least four of five first-time participants can choose a starting lesson without help and reach its source and next step. Record confusion and revise; do not present this small pilot as statistically conclusive research.

## 9. Guardrails for execution

- Keep content authoring and publication separate. Agent-authored text and agent source checks are drafts until the required qualified reviews are recorded.
- Distinguish a software review from scientific/editorial/licensing approval; multiple role strings or multiple agents do not manufacture independent professional approval.
- Reuse the tested Stage 5 contracts and Stage 4 primitives. Add only dependencies demanded by an approved, testable slice.
- No public learning account requirement. Progress stays optional and local; blocked storage must not break lessons.
- Do not run root example ingestion against an external database. Read applied migration state before choosing any reconciliation strategy.
- Do not count schema files, metric names, disabled buttons, mock responses or screenshots as completed features.
- Every task handoff records exact files, commands, results, skipped gates, dataset/content version and next task.
