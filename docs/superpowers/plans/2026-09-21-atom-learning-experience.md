# ATOM learning experience implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` for native task-by-task execution. Use `superpowers:subagent-driven-development` only when delegation is explicitly requested. Steps use checkbox syntax; no unchecked work is complete.

**Goal:** Turn the existing ATOM platform into a coherent, memorable, five-level learning experience with trustworthy evidence, excellent diagrams and purposeful experiments.

**Architecture:** Keep the existing Next.js app, server-rendered reading content, shared shell/tokens/evidence/chart components and pure TypeScript domain models. Serve one reviewed evidence authority through the existing repository boundary. Add small reusable interaction and audio utilities only when consumed by a real lesson.

**Tech stack:** Installed Next.js 16.3.3, React 19.2.8, TypeScript, Zod, CSS Modules/Tailwind, Radix, SVG/CSS, optional existing Three.js, Vitest, Playwright and axe. Use `package-lock.json`; this plan is not a dependency-upgrade request.

**Spec:** [Learning experience design](../specs/2026-09-21-atom-learning-experience-design.md).

**Baseline:** [2026-09-21 codebase audit](../../product/2026-09-21-CODEBASE-AND-EXPERIENCE-AUDIT.md), `main` at `78e0a08` plus the three pre-existing onboarding edits. This is a proposed build plan, not a completed redesign.

## Global constraints

- Preserve unrelated working-tree changes. Run `git status --short` and `git worktree list` before editing.
- Keep one Next.js App Router application with the current React/TypeScript/Zod stack.
- Keep `/learn/[lesson]` as the single canonical lesson URL hierarchy.
- Depth and path are separate. Changing level preserves scientific evidence, experiment configuration and answers.
- Missing observations must not become zero. Zero is a valid measurement with a distinct meaning.
- Reviewed content/evidence and explicit release status control public routes, search, navigation and downloads.
- Scientific/editorial/licensing review is separate from schema validation and code review.
- ADR 0001 remains in force: restore a trustworthy Comparison Lab release before new public lesson releases.
- Sound is off initially, user-initiated, independently adjustable and never the only feedback channel.
- All experiments have equivalent keyboard/touch and text/table or stepped access, including reduced motion.
- Start with typed JSON/TypeScript blocks; no new service, state framework, game engine, CMS or animation/audio framework.
- No external database writes, unsafe reference ingestion, bulk historical restore, package upgrade or product-code change is part of this planning delivery.

## Review focus

1. Public flags can outlive their actual evidence/review records: E01–E04 must test direct URL, search, export and parent-release visibility.
2. A level change can conceal active advanced assumptions: E07–E09/E13 must preserve state and reveal an assumptions summary.
3. Mobile, GPU failure and reduced motion can diverge from the desktop exhibit: E06/E09/E12/E17 must verify equivalent outcomes and actual timer/renderer cleanup.
4. Two simulators can show different scientific answers for the same inputs: E08/E12/E15 must use one pure model and compare graphical/table/event-log results.
5. Old progress/shared URLs can survive content changes: E03/E07/E13/E16 must migrate only known versions, reject malformed inputs and preserve valid independent fields.

## Work order

Finish one bounded task and its verification before starting another. E12, E14, E15, E16 and E17 explicitly contain separately releasable slices: each gets its own commit, review and tracker entry. Do not mark the parent complete from one slice.

| ID  | Deliverable                                                                | Dependencies                         | Recovery mapping |
| --- | -------------------------------------------------------------------------- | ------------------------------------ | ---------------- |
| E00 | Reconciled status and usable browser/CI baseline                           | Planning artifacts                   | R01/R07/R19      |
| E01 | One auditable evidence publication/release mechanism                       | E00                                  | R04              |
| E02 | Reviewed comparison data, starting with lifecycle emissions                | E01                                  | R08              |
| E03 | Lossless comparison results and shared chart/evidence UI                   | E00; release uses E02                | R02/R03/R05/R06  |
| E04 | Inspectable evidence routes, publication filters and comparison acceptance | E01–E03                              | R09/R12          |
| E05 | Selected visual storyboards and asset specification                        | Audit; may be designed before E04    | R12/R15          |
| E06 | Compact navigation, coherent themes and mobile shell                       | E05                                  | R06/R12          |
| E07 | Reviewed content/path contracts and source links                           | E01; public rollout after E04        | R10              |
| E08 | One tested, replayable fission model                                       | E00                                  | R17/model repair |
| E09 | First complete five-level fission lesson                                   | E04/E06–E08                          | R11              |
| E10 | Optional sound integrated into that lesson                                 | E09                                  | New enhancement  |
| E11 | Signature homepage and connected discovery                                 | E04/E06/E09                          | R12              |
| E12 | Seven coherent fundamentals lessons and reused experiments                 | E09                                  | R11/R13/R17      |
| E13 | Learning paths, resume and progress versioning                             | E07/E12                              | R10–R12          |
| E14 | Claim investigations, radiation and serious incident narratives            | E04/E09; E12 where blocks are reused | R13/R14          |
| E15 | Honest annual grid and contextual cost workbench                           | E01/E02/E09                          | R17/R08-C        |
| E16 | India's baseline, then scenario learning journey                           | E13/E15                              | R16-I            |
| E17 | Focused reactor and fleet exhibits                                         | E06/E09                              | R15/R16-G        |
| E18 | Release sweep, evidence operations and optional Ask evaluation             | All released slices                  | R07/R18/R19      |

Draft writing and visual exploration do not authorize early public releases. If a qualified evidence review is pending, record that precise gate and continue independent design/software tasks. Do not fabricate approval to clear a dependency.

## E00 — Restore an honest execution baseline

**Files:** `docs/product/DELIVERY-TRACKER.md`, historical audit/recovery plan, `AGENTS.md` current-entry paragraph when reconciled, `playwright.config.ts`, `app/health/route.ts`, `tests/health-route.test.ts`, `tests/e2e/foundation.spec.ts`, `.github/workflows/ci.yml`, `.github/workflows/source-monitor.yml`, `package.json` only for real script reconciliation.

**Consumes:** actual working tree, `78e0a08` and historical `522550a`. **Produces:** an installable branch with a working browser readiness target and truthful status; no evidence release.

- [ ] Record branch/HEAD, dirty paths, worktrees and Node version. Preserve the onboarding changes and both existing untracked interactive documents. Read restored historical documents with their historical warning.
- [ ] Compare `git diff 522550a 78e0a08 -- docs scripts lib/evidence lib/ingestion data/ingestion supabase package.json playwright.config.ts`; classify deleted capabilities as retained, deliberately replaced, or requiring restoration. Do not copy the old migration trees wholesale.
- [ ] Write a route test for a DB-independent `/health`: HTTP 200, `{ service: "atom", status: "ok", version: 1 }`. Observe the missing-route failure, restore only the liveness route, and keep database readiness a separate concern if a DB is adopted.
- [ ] Repair the foundation browser test to assert the actual homepage's starting action and route, rather than a stale `ATOM` heading. Preserve meaningful contrast/console assertions. Do not delete tests merely to make them green.
- [ ] Record every E2E reference to missing `/india`, `/design-system` and stale lesson controls. Keep these gaps open for the owning tasks; separate released-route smoke coverage from unreleased feature acceptance with explicit tracker records.
- [ ] Correct the monitoring workflow's reference to nonexistent `monitoring:sources`: mark the scheduled workflow inactive until E18 restores a working command/report, or restore the tested historical monitor as a separately verified slice. Do not add a no-op success script.
- [ ] Run the focused route tests, typecheck, lint, build and foundation browser smoke. The existing contrast failures remain real failures until E06/E11; E00 may accept harness repair with those defects explicitly tracked, not certify the full site.
- [ ] Update the tracker and current entry-point instructions to reflect the actual reconciled queue. Commit only this task's files; push the isolated branch after the meaningful improvement.

**Exit oracle:** CI can reach the server and report actual UI failures, rather than waiting on a 404 liveness endpoint; historical completion claims are not promoted into current acceptance.

## E01 — Reconcile evidence publication and serving

**Files:** `lib/evidence/repository.ts`, `local-repository.ts`, `governance.ts`, `published-evidence.ts`, their tests; `docs/decisions/0009-evidence-implementation-reconciliation.md`; create `docs/decisions/0010-evidence-release-serving.md`. Historical `data/ingestion/`, `scripts/evidence/` and canonical migrations are candidates for selective restoration only after comparison.

**Consumes:** E00 deletion inventory and existing repository contract. **Produces:** one documented publisher/release mechanism and a fail-closed public snapshot contract.

- [ ] Trace a current displayed observation from `rangeObs` through its source, study, artifact locator, dataset version, licensing and review records. Record missing relationships; public-looking metadata is not a review.
- [ ] Resolve the architecture conflict explicitly in ADR 0010. Recommended: retain the historical governed authoring/review mechanism and publish immutable local serving snapshots through `EvidenceRepository`. If a file-based review/release mechanism is chosen to reduce operational needs, record that as a replacement decision and preserve the same provenance, real review, immutability and rollback guarantees.
- [ ] Add tests rejecting observations whose source/study/version cannot be resolved, whose parent version is inactive, whose review does not bind to the exact artifact/version, or whose reuse status is restricted. Synthetic reviewers and artifacts stay in test-only data.
- [ ] Implement only the chosen path. Reuse R04's actual transaction/role/rollback oracles if the database publisher is restored. Run local integration only against verified disposable infrastructure; do not execute historical example ingestion against an external target.
- [ ] Remove automatic assignment of a universal licence, data period, uncertainty label or representative rule. Require those facts per reviewed source/version.
- [ ] Test release activation and rollback preserve old versions and cannot expose drafts through snapshot generation or direct repository calls.

**Verification:** `npm test -- lib/evidence`, typecheck, relevant publisher integration/rollback checks, and build. Record exact content/review state even when software tests pass.

**Exit oracle:** a value is public because an inspectable reviewed version is active, not because a helper stamped `published` onto it.

## E02 — Review real comparison evidence in small releases

**Files:** `data/sources/<source-id>/`, `data/transforms/` when required, `lib/evidence/published-evidence.ts` or its approved generated replacement, `content/metrics/index.ts`, create `docs/product/METRIC-COVERAGE.md` and versioned `docs/evidence/reviews/` records.

**Consumes:** E01 publisher/visibility policy. **Produces:** a real reviewed lifecycle-emissions release followed by separately reviewed category versions or explicit unavailable combinations.

- [ ] Start with lifecycle greenhouse-gas emissions. Acquire a primary artifact, record exact URL/version and extraction page/table, verify redistribution terms, and checksum permitted bytes. Do not reuse remembered numbers as source extraction.
- [ ] Define technology variants, geography, observation period, lifecycle boundaries and range semantics before choosing representative values. A min/max range must never carry a percentile label by default.
- [ ] Write parser/normalization tests against actual located cells, including missing cells and incompatible units. Use independent expected arithmetic, including `1 ha/TWh = 0.01 m²/MWh` and `1 t/TWh = 0.001 kg/MWh` where those families are used.
- [ ] Author five explanations against the same evidence IDs. Record qualified scientific, editorial and licensing decisions separately. Without those decisions keep the dataset in review and the public result unavailable.
- [ ] Populate a coverage table for every required metric/category in the original R08 plan. Repeat this task separately for land/water, reliability, economics, human impact, security and technical metrics; valid unavailable combinations remain unavailable.
- [ ] Prove India-specific results require India-specific evidence. A global fallback is labeled Global and explicitly explained. Storage is modeled as storage, with charging supply and losses when relevant, not given a universal generation-source value.

**Exit oracle:** each released number is reproducible from its source, displays its real period/boundary/version, and has a review record. Catalog coverage does not mean every cell contains a number.

## E03 — Preserve result states through the Comparison Lab

**Files:** `features/comparison/comparison-result.ts`, `comparison-api.ts`, `comparison-types.ts`, `comparison-model.ts`, `comparison-url.ts`, `ComparisonLab.tsx`, `ComparisonResults.tsx`, `ComparisonEvidence.tsx`, associated tests; shared `components/charts/` and `components/evidence/` only when their contracts need an extension.

**Consumes:** `ComparisonResult` from `getComparisonResult`, existing URL state and repository. **Produces:** a UI consuming the discriminated result directly or a lossless display projection.

- [ ] Write a regression test where the headless result contains one available zero, one missing entry, one restricted entry and one incompatible entry. Assert the four states remain distinguishable after the adapter; unavailable cases have no scientific numeric value.
- [ ] Replace the `PreviewObservation` zero sentinel and unconditional `evidenceStatus: "reviewed"` mapping. Preserve result status, source identity, dataset version, comparison warnings and actual review metadata.
- [ ] Use shared bar/range/distribution and table primitives according to available semantics. Use shared Data Passport, source and challenge surfaces. A “Raw” choice cannot manufacture raw observations from a range.
- [ ] Test field-by-field URL recovery, explicit zero/one/nine selections, old aliases, clipboard failure, rapid edits, reload and back/forward. Preserve internal level values and valid stored preference precedence.
- [ ] Test chart/table/evidence agreement: identical observations, values, units, geography and version. Test an unavailable metric does not inherit another metric's explanation or an `unknown` unit presented as a result.
- [ ] Browser journey: remove Coal → add Hydro → choose a supported metric → Range → passport → challenge → share → reload → history. Record actual version and assertions, not heading-only success.

**Verification:** `npm test -- features/comparison components/charts components/evidence`, typecheck, build and `tests/e2e/comparison-lab.spec.ts` after E00 harness repair.

**Exit oracle:** the end-to-end comparison preserves evidence meaning and source access without parallel preview state or duplicate chart/dialog systems.

## E04 — Make evidence inspectable and enforce public visibility

**Files:** `app/evidence/page.tsx`; create `app/evidence/sources/[sourceId]/page.tsx`, `app/evidence/studies/[studyId]/page.tsx`, `app/evidence/datasets/[datasetVersionId]/page.tsx`; extend repository metadata methods and contract tests; `app/sources/page.tsx`, `lib/search/index.ts`, navigation catalogs; `tests/e2e/discovery.spec.ts`, `tests/e2e/regression-drills.spec.ts`.

- [ ] Add metadata retrieval to the single repository contract, with null/unavailable results for missing or unpublished records. Do not expose operational reviewer identities, restricted bytes or private records through serialized page props.
- [ ] Write route tests for known published IDs, unknown IDs, draft/withdrawn parent versions and restricted downloads. Render specific source title, locator, licence, version, method and corrections.
- [ ] Filter search and public entry points by actual released metrics/exhibits/content. The current `METRICS.map(...)` search entry creation must not advertise every catalog definition as a working comparison.
- [ ] Give `/sources` a bibliography role and `/evidence` a claim-verification role; remove implementation jargon and unsupported promises such as all 34 metrics being inspectable.
- [ ] Verify every required Comparison Lab category has a reviewed release or explicit coverage/availability record; run original R09 acceptance against current code and versions. Do not count the historical tracker as that evidence.
- [ ] Record the Comparison Lab gate in the tracker before releasing E09/E12. If records are still awaiting qualified review, keep their public release pending while local design work continues.

**Exit oracle:** a skeptical reader can move from a displayed number to its specific source and method within two intentional actions; direct URLs do not bypass release restrictions.

## E05 — Establish the visual target

**Files:** `docs/design/2026-09-21-learning-experience/` storyboards/asset manifest and the design-system amendments in `docs/product/ATOM-DESIGN-SYSTEM.md`.

- [ ] Produce home, fission lesson, comparison and India frames at 1440 × 900 and 390 × 844 with actual copy lengths; include light/dark, evidence sheet and reduced-motion states.
- [ ] Follow the spec's “Small atoms. Big questions.” nucleus-to-grid composition. Keep the first action above the fold and the explanation readable without animation.
- [ ] Specify shared particle, flow, containment and scale diagrams. Asset records include source/author, licence, descriptive alternative and scientific-review status; generated artwork is labeled illustration and cannot serve as measured evidence.
- [ ] Select and record the target before coding its UI. Review with the product owner at this concrete visual stage; retain already authorized scope rather than restarting discovery.

**Exit oracle:** an implementer can match a recorded layout, hierarchy, palette and interaction sequence on mobile and desktop. The current baseline screenshots are not design approval.

## E06 — Repair the shared shell and mobile themes

**Files:** `app/globals.css`, `components/layout/AppShell.tsx` and CSS/tests, `GlobalComplexityControl`, theme/complexity controls, `components/ui/OverlayPanel.tsx` only if necessary; `tests/e2e/design-system.spec.ts` adapted to an actual test surface.

- [ ] Add shell tests for Learn/Explore/Compare/Evidence, accessible search, a labeled mobile menu, Escape dismissal and focus return. Include a route with no published lessons so navigation follows release state.
- [ ] Implement the selected shell by composing existing primitives. Replace the horizontal ten-link mobile strip. Preserve skip link, one main landmark, conventional links and accessible preference controls.
- [ ] Repair semantic light/dark contrast and replace hard-coded conflicting surfaces in touched components. Compare the known baseline failures, including pale hero type and dark text on dark simulator surfaces.
- [ ] Keep global level changes consistent across routes. Add an explicit mapping between established public labels and stored internal values rather than renaming keys without migration.
- [ ] Verify 320px reflow, 390/768/1440 layouts, both themes, keyboard and 200% zoom. Axe must have no serious/critical violations in the changed shell; record page-owned remaining issues separately.

**Exit oracle:** the learner can find a starting path and preferences without horizontal scrolling or unreadable text.

## E07 — Strengthen the learning content and path contracts

**Files:** `lib/education/schemas.ts`, `content-validation.ts`, `catalog.ts` and tests; `content/lessons/catalog.json`, `content/lessons/checkpoints.json`; create `content/paths/catalog.json`; extend reviewed claim/citation records using the chosen E01 system.

- [ ] Define structured lesson blocks for explanation, figure, experiment, checkpoint and evidence links. Use a finite block union and an explicit component registry, not arbitrary executable content.
- [ ] Define path records with stable ID, title, audience/start guidance, ordered lesson IDs, version and publication metadata. Depth is not a separate duplicate curriculum dataset.
- [ ] Add graph tests for unknown concept/claim, metric ID incorrectly supplied as a claim, duplicate slugs, draft parents/prerequisites/next lessons, checkpoint ownership, cycles, missing levels and unresolved evidence. Fix the current validation that merely checks `claimIds` against metric definitions.
- [ ] Require review/version records for public content. Stop deriving “Verified” solely from status/date strings. Add public getters used consistently by route generation, search and catalogs.
- [ ] Specify the first lesson's five complete explanations and checkpoint against the same evidence IDs. Real review remains an explicit content gate.

**Exit oracle:** a structured lesson or path cannot be published with broken source, prerequisite or checkpoint relationships; Expert content has meaningful depth.

## E08 — Unify the fission model and replay behaviour

**Files:** `lib/simulator/fission-model.ts`, `fission-model.test.ts`; extract a pure educational step module if needed; `features/simulator/FissionSimulator.tsx` and tests; replace fission-specific logic in `features/education/LessonInteraction.tsx` when E09 wires it in.

- [ ] List which current formulas/constants are sourced physical relationships and which are toy coefficients. Record the domain limits; do not present the existing enrichment-to-k formula as a validated reactor prediction.
- [ ] Move random collision, absorption and counted energy rules from React into a pure state transition with a supplied deterministic random stream. Visual geometry consumes events; it does not create a second scientific tally.
- [ ] Write tests for repeatable seeded replay, reset, pause, bounded particles, finite outputs, absorption bookkeeping and one event counted once when a step is reselected. Test displayed count/energy/table against the same returned state.
- [ ] Choose either a reviewed qualitative model or an independently verified numerical model for the learning objective. Test numerical integration stability/timestep sensitivity before presenting time-dependent kinetics; clamping a timestep is not evidence of accuracy.
- [ ] Simplify beginner controls to one action. Retain advanced controls only if their model/interpretation is justified and visibly bounded.

**Exit oracle:** the lesson and standalone simulator yield the same stated outcome for the same state/inputs, and a paused or replayed illustration cannot invent additional fissions.

## E09 — Deliver one excellent fission lesson

**Files:** `features/education/LessonViewer.tsx`, `LessonInteraction.tsx`, `LessonCheckpoint.tsx`, `Education.module.css`; create `components/education/InteractiveFigure.tsx`, `SimulationFrame.tsx` and focused tests; `app/learn/[lesson]/page.tsx`; lesson content and `tests/e2e/learning-path.spec.ts`.

**Consumes:** E07 content, E08 model and E06 shell. **Produces:** the reusable lesson composition through an actual finished lesson.

- [ ] Start from the chosen E05 frames. Write the journey test: open fission → predict → send neutron → step/pause/replay → explain result → checkpoint/retry → specific source → return → next released lesson.
- [ ] Introduce `InteractiveFigure` for title/instructions/playback/status/alternative and `SimulationFrame` for prediction/controls/result/explanation/limitations/sources. Do not add an abstract registry of every imaginable control.
- [ ] Keep lesson reading and source links in server-rendered HTML. Hydrate the experiment and preference-driven explanation only as needed. No nested main or second page H1 when an experiment is embedded.
- [ ] Provide full five-level content, keeping state and evidence IDs stable on level changes. Test the L4 → L1 transition retains advanced assumptions and explains them.
- [ ] Add a text step log/table and reduced-motion manual steps. Stop JavaScript work when hidden/offscreen/unmounted; never announce each animation frame to a screen reader.
- [ ] Pass component, model, route and real browser checks, including no-JS reading, keyboard, touch, themes, 200% zoom and error/empty source states. Record qualified content reviews before public release.

**Exit oracle:** a novice can explain the core idea and a technical learner can inspect the assumptions within one coherent lesson. This is the template to reuse, not a new collection of disconnected widgets.

## E10 — Add optional sound to the finished lesson

**Files:** create `lib/audio/sound-controller.ts`, focused lifecycle tests, `lib/preferences/sound-preference.ts`, `components/settings/SoundControl.tsx`; extend the shared shell/frame only at the preference and event boundary.

- [ ] Test first-visit mute, blocked/corrupt localStorage, explicit enable gesture, persisted preference, browser audio denial, immediate mute and cleanup after route exit/tab hide.
- [ ] Implement one lazy Web Audio adapter: short procedural selection/connection/completion sounds, adjustable volume and cancellation. Restrict sustained audio to a running opted-in exhibit with a visible stop action.
- [ ] Bind audio to meaningful events from E08/E09, never to render count or random animation frames. Pair every cue with visible/text feedback.
- [ ] Verify sound manually in a real browser after a gesture; automated mocks verify lifecycle but cannot establish volume or audio quality. Check a return visit does not bypass browser autoplay rules.

**Exit oracle:** the experience is complete while silent, and a person can enable or stop all sound predictably. No sounds on harm narratives.

## E11 — Build the signature homepage and discovery flow

**Files:** `app/page.tsx`, `app/HomePage.module.css`, `components/onboarding/OnboardingHero.tsx` and CSS/tests, `app/explore/ExploreHub.tsx`, search/discovery tests.

- [ ] Preserve and review the user's existing atomic SVG changes; adapt them to the selected design without silently overwriting or claiming authorship of the earlier work.
- [ ] Replace the nine-card opening with the spec's promise → learner-controlled conversion exhibit → three starting questions → featured comparison → path/resume invitation → evidence promise.
- [ ] Remove unsourced scientific claims from level-preview copy. Use the reviewed content blocks, with common evidence IDs across levels.
- [ ] Keep the first useful action visible at 390 × 844 and 1440 × 900. Load no Three.js, globe data or audio engine on the initial homepage. Preserve conventional scroll and navigation.
- [ ] Verify home → lesson/compare → evidence → back → next journey; themes, keyboard, reduced motion, no-JS reading and actual bundle requests. Resolve homepage baseline contrast violations.

**Exit oracle:** the homepage shows what to do and why it is interesting before it presents the whole library.

## E12 — Complete fundamentals one lesson at a time

**Files:** existing lesson catalog/blocks, `features/education/`, `features/simulator/`, `lib/simulator/`, relevant model/component/E2E tests. New atom identity logic belongs in `lib/education/atom-model.ts`; new energy-flow definitions remain in reviewed content or `lib/reactor/`.

Repeat the E09 review/verification cycle for each slice; each is a separate deliverable.

| Slice            | Task                                                                                                                   | Acceptance oracle                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| E12a Energy      | Replace unsourced pellet/household equivalences with a sourced example or explicitly synthetic power × time experiment | 2 kW × 3 h = 6 kWh; the label distinguishes power, energy and assumptions                                          |
| E12b Atom        | Proton/neutron identity builder, isotope explanation and model caveats                                                 | Proton count determines element; mass number is p+n; unknown stability remains unknown                             |
| E12c Reactor     | Shared component/heat-loop block and constrained control illustration                                                  | Click and keyboard select the same part; loops match selected reactor type; real model limits visible              |
| E12d Electricity | Trace heat → mechanical energy → electricity using reviewed mappings                                                   | Every step has text; conversion claims carry units and a source; no implied universal plant efficiency             |
| E12e Safety      | Reviewed barriers and their limits                                                                                     | No universal “99% retained” or fixed wall thickness without scoped source; mitigation is not zero risk             |
| E12f Waste/decay | Reuse half-life block and separately explain spent-fuel management                                                     | Expected population halves after one half-life; single-isotope decay never becomes a universal disposal/risk curve |

- [ ] Port existing `DecaySimulator` and `ReactorControlSimulator` to the same frame one at a time. Extract domain-specific diagrams only where reused.
- [ ] Remove or redirect the corresponding duplicate `LessonInteraction` calculation only after its replacement passes. All standalone and lesson entry points use the same block/model.
- [ ] Add lesson-specific evidence links and genuine L4/L5 material; remove generic institutional-homepage lists as substitutes for claim provenance.
- [ ] Run each lesson's domain/component journey and full responsive/accessibility/content checks before releasing it. Fission is already delivered by E09; all seven are required before the fundamentals path is called complete.

## E13 — Connect paths, resume and durable local progress

**Files:** `content/paths/catalog.json`, `lib/education/catalog.ts`, `progress.ts` and tests, `app/learn/page.tsx`, `features/education/LessonCheckpoint.tsx`, `LessonViewer.tsx`, discovery/home progress entry, `tests/e2e/learning-path.spec.ts`.

- [ ] Render Start with atoms first, then expose each thematic path only when it has a useful reviewed sequence. Show prerequisites and what the learner will be able to explain.
- [ ] Validate persisted data field by field, including non-string completed IDs, malformed entries, unknown lesson/version, removed lesson, blocked storage and quota failure. Compare stored completion version to current content before labeling it current.
- [ ] Persist last-opened lesson separately from successful completion so resume works for unfinished lessons. Keep answers and inputs stable on depth/path changes.
- [ ] Test ordered next/previous within a path, shared lesson reuse, missing path query, reset confirmation and corruption recovery. Retain `/learn/[lesson]`; canonical URLs do not include duplicate path hierarchies.
- [ ] Run a complete first-time and return-visit journey at L1, L3 and L5. Progress is optional and private to the device; every lesson remains accessible without it.

**Exit oracle:** visitors know where to begin, can stop midway and return, and receive meaningful next steps without an account.

## E14 — Turn myths and safety pages into investigations

**Files:** `content/myths/myths-data.ts`, `app/myths/MythViewer.tsx`, `lib/debate/`, `content/debates/`, `features/debate/`; `lib/radiation/` and `features/radiation/`; incident content/viewer and their tests.

- [ ] **E14a Claims:** add explicit claim verdict/context/evidence relationships and five-level explanations; first release one fully reviewed claim. Support insufficient evidence and context-dependent outcomes. Then expand the catalog claim by claim.
- [ ] **E14b Radiation:** preserve quantity-safe schemas; change invalid formatting to an explicit unavailable/error result instead of `0 µSv`. Test genuine zero, invalid input, dose versus dose rate and effective versus equivalent dose. Give the log-scale chart the same ordered table.
- [ ] **E14c Incidents:** structure causes, impacts, displacement, uncertainties and lessons learned; distinguish confirmed effects from modeled risk. Use restrained timeline steps without playful sounds, rankings or celebration.
- [ ] Replace repeated inline evidence UI with E04/E09 primitives. Expandable evidence preserves focus and returns to the original claim/experiment.
- [ ] Verify each slice independently with content review, claim-source resolution, theme/keyboard/mobile checks and the relevant `myths`, radiation or incident tests.

**Exit oracle:** the visitor learns how a conclusion is reached and where its limits lie; the site does not merely reveal a predetermined “myth busted” label.

## E15 — Make grid and cost experiments trustworthy

**Files:** `lib/simulator/grid-model.ts`, `schemas.ts`, tests, `features/simulator/GridSimulator.tsx`, `/grid`, `/simulations`; create `lib/simulator/cost-model.ts` and `features/simulator/CostSimulator.tsx` only for E15b; reviewed cost content and test fixtures.

- [ ] **E15a Annual grid:** remove the arbitrary missing-factor fallback `?? 50`. Require reviewed emissions factors as model inputs and return explicit partial/unavailable impact state. Keep annual energy results available when impact data is missing.
- [ ] Remove the hand-shaped “hourly dispatch” calculation from React. Either hide it until E15c or ship a clearly labeled synthetic demonstration with its own tested pure model, no real reliability claim and limits shown next to output.
- [ ] Pin exact annual arithmetic and missing-factor behaviour. Retain the 7,884,000 MWh oracle for 1000 MW × 0.9 × 8760 h; validate leap years, zero demand, negative/nonfinite input and all selected technologies.
- [ ] **E15b Costs:** author a reviewed cost definition with currency/base year, overnight capital, financing, construction duration, operating/fuel cost, lifetime and annual energy assumptions. Implement a pure discounted-cash-flow model before rendering sensitivity controls.
- [ ] Test an explicitly synthetic zero-discount case: annualized capital 100 currency-units/year plus operating cost 20, divided by 10 MWh/year, equals 12 currency-units/MWh. Test zero generation unavailable, invalid rates, year/currency incompatibility and delayed-construction cashflow. Do not label LCOE a household tariff or full system cost.
- [ ] **E15c Optional hourly model:** separate future scope requiring actual time series or clearly synthetic profiles, storage state of charge/efficiency, curtailment, unmet demand and conservation tests. Do not infer national adequacy from a repeated 24-hour curve.

**Exit oracle:** every displayed output follows the declared model and assumptions; cost and reliability claims do not exceed what the model calculates. E16a/b can use annual-only E15a/b; E15c is not required for the first India release.

## E16 — Build Power India's future in two releases

**Files:** `lib/national/national-model.ts`, `schemas.ts`, tests; restore/create `app/india/page.tsx` and a focused `features/national/` view from reviewed historical code; India content/artifacts; `tests/e2e/india.spec.ts`; reuse E15 scenario blocks.

- [ ] **E16a Baseline:** acquire dated CEA electricity data and NPCIL/DAE/regulator/IAEA records for the precise questions being taught. Separate generation, capacity and primary energy; label calendar/fiscal years and incomplete shares.
- [ ] Review PHWR, fuel security, construction/finance, three-stage programme, breeder and thorium narratives with maturity labels. Revalidate inherited 2024 data rather than presenting it as current.
- [ ] Provide a server-readable India story, capacity-versus-generation comparison and linked fleet directory. A map is optional. Reject duplicate units and unexplained mixed reporting periods.
- [ ] **E16b Scenarios:** layer E15's validated annual-energy and cost assumptions over the reviewed baseline. Offer balanced portfolios with and without new nuclear under the same demand/cost-year assumptions; expose build pace, financing and missing inputs. Use graphics to connect electricity to homes, industry and services without invented equivalence factors.
- [ ] Test same-input reproducibility, all-nuclear/zero-nuclear cases, invalid/old shared URLs, missing factors, historical/scenario labeling and diagram/table agreement. No claim of optimized dispatch, guaranteed development or GDP growth.
- [ ] Shareable URLs contain a scenario version and validated inputs. State explicitly which outputs are annual balance and which require future hourly analysis.
- [ ] Independently verify and release E16a, then E16b. Link India prominently from home/path navigation only after each applicable release gate passes.

**Exit oracle:** a visitor can explain what nuclear could contribute to a chosen Indian electricity pathway, what assumptions drive the result, and what remains outside the model.

## E17 — Focus the existing reactor and globe experiences

**Files:** `features/reactor/ReactorExplorer.tsx`, `Reactor3DCanvas.tsx`, `lib/reactor/`; `features/globe/GlobeViewer.tsx`, `Globe3DCanvas.tsx`, `lib/globe/`, `lib/reactor/fleet-model.ts`, `data/reactors/global-fleet.json`, reactor/globe tests.

- [ ] **E17a Reactor:** extract component selector, source detail, 2D schematic and optional 3D view into domain-focused files as they are changed. Reuse one part-selection state. Use the global five-level preference rather than an independent standard/simpler/deeper model.
- [ ] Default to a fast labeled cutaway; lazy-load existing Three.js on explicit 3D intent. Record asset accuracy/licensing and constrain claims about generated illustrations. Test every diagram control has an equivalent text control.
- [ ] **E17b Fleet:** reconcile `CANONICAL_FACILITIES` and the 173-record fleet catalog. One dated per-unit registry must drive statistics, map, directory, India and search; coverage of this file is not automatically global completeness.
- [ ] Test mixed site statuses, unknown capacity, net/gross basis, filters, URL selection and actual historical records. A historical view cannot reconstruct past status from today's snapshot alone.
- [ ] Verify WebGL failure/context loss, reduced motion, hidden tab and route exit leave the list usable and cancel rendering/audio/timers. Do not add another map framework for visual polish.

**Exit oracle:** 3D enriches spatial learning without being required for understanding; every view describes the same dated units and selected components.

## E18 — Release operations and optional Ask, with measured polish

**Files:** `.github/workflows/`, source-monitoring script/report, `lib/analytics/`, `components/observability/`, current release/correction records; `lib/ask/`, `lib/ai/`, `app/api/debate/route.ts`, `features/ask/` only for E18b.

- [ ] **E18a Operations:** restore a real source link/freshness monitor with timeouts and inconclusive states for 403/429/network failure. Record one success and one handled failure; scheduler presence is not operational acceptance.
- [ ] Run the full released-route browser matrix, route-link audit, no-JS/GPU-failure checks, all relevant tests and production build. Record baseline/delta bundle requests and multiple measured performance runs. Fix regressions in the owning task rather than hiding assertions.
- [ ] Run the formative learning pilot and record confusion/next revisions. Track only approved aggregate events; no children's identities, freeform queries or full scenario URLs in analytics.
- [ ] **E18b Ask:** keep curated answers/search sufficient for learning. Before generated answers are public, remove invented 0.95/1.0 confidence scores and “guarantees no hallucinations” claims; resolve citations to E04 records; validate roles/lengths and response support, with cancellation/timeout/rate limits.
- [ ] Evaluate at least 50 versioned cases with supported evidence IDs, designated abstentions, draft/restricted leakage, contradictory/stale evidence and injection cases. Require all citations to resolve and unsupported cases to abstain; qualified review assesses actual claim support. A citation list attached after generation is insufficient.
- [ ] Record the exact content/data/software versions, review status, screenshots, tested devices, remaining gates and rollback target for each release. Commit/push after each meaningful verified slice; use preview review before public promotion.

**Exit oracle:** the site can be maintained, corrected and rolled back, and any public answer/claim remains inspectable. Optional AI never blocks the core learning release.

## Verification commands and task report

Use focused tests first; examples below use existing commands. Do not run a nonexistent DB/monitoring script because an old document lists it.

```bash
git status --short
git worktree list
npm test -- lib/evidence/units.test.ts
npm test -- features/comparison
npm run typecheck
npm run lint
npm run build
npm run test:e2e:chromium
```

After E00, a focused Playwright run can use `npx playwright test tests/e2e/learning-path.spec.ts --project=chromium` against its configured fresh production server. Run all configured browsers before the corresponding release. `npm run verify` excludes E2E and any database checks. Format only owned paths while unrelated work is dirty.

For each task: establish a regression oracle → observe failure → implement the smallest slice → run focused tests → review diff → run applicable browser/build/release checks → update tracker → stage exact files → commit and push the task branch. Never mark an entire stage complete because its schema or one slice passed.

```text
Task ID / original stage:
Branch / HEAD / dirty files at start:
Dependencies satisfied with evidence:
Files changed and behavior delivered:
Regression observed before fix:
Commands and actual exit/results:
Browser viewports/themes/states checked:
Evidence/content/dataset version and real review status:
Review findings and resolutions:
Unverified gates / reason / next concrete action:
Commit (if made) and next unblocked task ID:
```

The next implementation slice is E00. The next public flagship gate is E04, followed by the complete lesson E09. This plan deliberately separates a working prototype, reviewed content and a released product.
