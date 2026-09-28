# ATOM redesign: ordered implementation plan

Date: 2026-09-27. Status: **plan delivered; implementation not started**.

**Goal:** A simple, memorable nuclear-energy website that teaches through beautiful, replayable experiments, investigates misconceptions and explains nuclear energy's opportunities and constraints for India, with no reading levels.

**Design and audit:** [Playable ATOM brief](../specs/2026-09-27-playable-atom-design.md). Read it before this plan. [DELIVERY-TRACKER](../../product/DELIVERY-TRACKER.md) remains the only status authority.

**Architecture:** One existing Next.js application and one file-based evidence repository. Server-render the reading experience; small client exhibits consume validated data and pure TypeScript models. Reuse the shell, tokens, overlays, charts, evidence UI, playback, optional Three.js and audio adapter.

**Stack:** Installed Next.js 16.3.3, React 19.2.8, TypeScript, Zod, CSS Modules/Tailwind, Radix, Phosphor, Three.js, Vitest, Playwright and axe. No dependency upgrade, new backend, AI service, CMS, animation framework or global state library is part of this plan.

For execution, use `superpowers:executing-plans` and work natively one bounded slice at a time. Delegate only if the user explicitly requests it. Start an isolated branch/worktree for implementation after checking current state. Do not reset existing work or combine historical migration trees. Read relevant guides in `node_modules/next/dist/docs/` before changing framework code.

## Global requirements

- Remove every audience/reading-level system, including the independent Ask/Reactor modes. Keep physical classifications, semantic heading levels and learning paths.
- Keep `/learn/[lesson]` canonical. Old links remain usable; generated links stop including `level`.
- Opening details cannot reset the experiment, change its factual basis or hide active assumptions.
- One interaction model supplies diagram, result, table, share state and accessible explanation.
- An unknown value stays unknown. Source dates, boundaries, range meanings and review status travel with every retained quantitative result.
- Preserve ADR 0010 evidence digests, histories, real reviews and direct-read restrictions. Never invent reviewers or repurpose synthetic fixtures as public evidence.
- Preserve ADR 0001's public release gate. N01/N03 compatibility and corrective changes to existing routes may ship independently; new lessons/exhibits wait for the applicable comparison/content gates. Local design and code preparation can continue while human review is pending.
- Sound starts off and requires a gesture; reduced motion has equivalent steps; no required GPU, audio, dragging or hover.
- Reuse existing components before introducing new ones. Delete a duplicate only after its useful behavior and tests are preserved elsewhere.
- A graphics asset requires author/source, usage rights, alt text, intended crop and a scientific-review status. Generated art is illustration.

## Work order and existing-roadmap mapping

The order below replaces the old **five-level experience work**. Accepted E01 release-serving software is reused. It does not restart R01–R19 or mark E02–E18 accepted.

| Task   | Deliverable                                        | Software dependencies            | Existing work                  |
| ------ | -------------------------------------------------- | -------------------------------- | ------------------------------ |
| N01    | Remove levels throughout the product               | Current passing baseline         | Amend E03/E06/E07/E09/E13/E18b |
| N02    | Select concrete visual targets and assets          | Brief                            | E05                            |
| N03    | Simplify navigation and overlapping routes         | N01, N02                         | E06/E11/E13                    |
| N04    | Close content/evidence gaps, prepare real releases | Existing E01                     | E02/E04/E07                    |
| N05    | Make comparison clear and inspectable              | N01, N02, N04 serving contracts  | E03/E04                        |
| N06    | Polish homepage and first complete fission journey | N02/N03; public release N04/N05  | E08/E09/E10/E11                |
| N07a–f | Complete remaining six learning experiments        | N06 pattern; relevant N04 review | E12/E13                        |
| N08    | Turn annual grid into a replayable town challenge  | N06 pattern, N04 inputs          | E15a                           |
| N09    | Build one contextual cost experiment               | N04 inputs, N06 pattern          | E15b                           |
| N10a–c | Claims, radiation and incident learning            | N04/N06; relevant lesson blocks  | E14                            |
| N11a–b | India baseline, then portfolio exploration         | N04/N08/N09; relevant content    | E16                            |
| N12a–b | Focus reactor and fleet experiences                | N02/N04/N06                      | E17                            |
| N13    | Delete superseded implementations and docs drift   | Owning replacements accepted     | E00/E18                        |
| N14    | Learning pilot and full release acceptance         | Each release candidate           | E18a                           |

N02 can be prepared while N01 is being scoped; N04's source acquisition can proceed independently of visual work. Implementation remains one bounded task at a time. A human-review delay does not justify publishing placeholders as science. Record “software verified; publication pending” and continue an independent local task.

Explicitly deferred: hourly dispatch/storage reliability, generated Ask answers, accounts, a general game engine, more reactor variants, and multilingual infrastructure. These add substantial work without improving the first coherent experience. Hindi content is a later editorial release after the English pilot.

## Review focus

1. Old `level=` links and stored preferences must not erase source order, empty selections, filters, hashes, answers or progress (N01/N03).
2. A removed screen may still have inbound links, an API caller or unique educational content (N03/N13).
3. A green comparison release check does not validate numbers hard-coded in lessons, myths, radiation, fleet or grid (N04/N08/N10/N12).
4. Hidden simulator panels, route exits and GPU/audio failures must stop work while preserving the learner's state (N06/N07/N12).
5. Annual energy, capacity factor, plant cost and national prosperity are different concepts; attractive visuals must not imply unsupported causality (N08/N09/N11).

## N01 — Remove the reading-level system completely

**Files:** `lib/preferences/complexity-preference.ts` and test; `components/settings/ComplexitySelector*`; `components/layout/GlobalComplexityControl*`, `AppShell.tsx`, `MobileMenu.tsx`; `components/onboarding/OnboardingHero*`; `lib/education/schemas.ts`, `content-validation.ts`; `content/lessons/catalog.json`, `content/metrics/index.ts`, `content/myths/myths-data.ts`, `content/incidents/incidents-data.ts`; `features/exhibits/exhibit-explanations.ts`, `ExhibitFrame.tsx`; lesson/myth/incident/Explore/HowItWorks consumers; `features/comparison/comparison-types.ts`, `comparison-url.ts`, `comparison-api.ts`, `ComparisonLab.tsx`, `ComparisonInterpretation.tsx`; Ask schemas/UI/retrieval/providers; reactor schema/model/viewer and reactor-control UI; `lib/evidence/schemas.ts`; `lib/analytics/tracker.ts`; related unit/component/E2E tests.

**Contracts:** One `ExplanationContent { summary: string; body: readonly string[]; details?: readonly { id: string; title: string; body: string }[]; citationIds: readonly string[] }`. Introduce it in `lib/education/schemas.ts`; feature records compose it only where needed. `ComparisonState` has `sources`, `metric`, `region`, `mode`, `units`; `parseComparisonState(searchParams, options?)` and `serializeComparisonState(state)` use those five fields. No level preference or default-complexity field remains in presentation DTOs.

- [ ] Record the explicit user decision in `docs/decisions/0011-single-reading-experience.md`; amend current sections of AGENTS.md, README, design system, comparison spec, technical architecture, testing standard and roadmap. Keep earlier plans historical and link this plan. Preserve ADR 0001 and 0010; amend ADR 0004's obsolete sixth query key without changing unrelated parsing rules.
- [ ] Inventory every level consumer, including literal `standard/simpler/deeper`, `AskExplanationLevel`, `defaultComplexity`, `complexityMinimum` and analytics. Distinguish these from INES/radiation/heading semantics.
- [ ] Write failing URL regressions: every current and legacy `level` value yields the same five-field comparison; explicit empty sources remain empty; unknown IDs retain existing unavailable behavior; technology order, region, mode and units survive. New serialization has no `level`, and old links reload successfully.
- [ ] Consolidate prose manually. Retain useful technical detail in named details panels; eliminate repeated/jargon-only variants. Do not automatically select `curious`, merge conflicting claims or mark edited content reviewed. Preserve evidence IDs; substantive revisions get new content versions and their own review status.
- [ ] Replace consumers and schemas together in one coherent migration slice. Remove all depth selectors/labels, read-level URL synchronization, independent Reactor/Ask modes, AI level prompt instructions and level analytics fields/events. Until Ask is retired in N03, it uses the same single explanation contract.
- [ ] Stop reading/writing both `atom:preferences:v1:complexity` and `atom:preferences:v2:complexity`; inert stored values may remain. Never clear unrelated theme/progress keys. Preserve current lesson/checkpoint progress when the objective and assessment are unchanged; invalidate only materially changed content versions with an explanation.
- [ ] Remove obsolete level code/CSS only after all consumers migrate. Check evidence history compatibility before changing a serialized historical schema; do not rewrite reviewed payloads to make a UI refactor pass.
- [ ] Replace tier-existence tests with meaningful explanation/citation tests. Browser regression: an old shared URL opens, no reading-level controls appear, details open, prediction/filter/answer state stays intact, theme and history still work.

**Verify:** `npm test -- lib/preferences lib/education lib/evidence lib/analytics features/comparison features/education features/incidents features/ask features/reactor app/myths app/explore app/how-it-works`; `npm run typecheck`; `npm run lint`; `npm run build`; targeted `tests/e2e/experience.spec.ts`, `foundation.spec.ts`, `comparison-lab.spec.ts`, `learning-path.spec.ts` after updating assertions. Audit remaining level-related references manually; do not make a blanket string-deletion test.

**Exit:** there is one reading experience throughout the site. The implementation is not complete merely because the header dropdown disappeared.

## N02 — Produce the visual target and asset pack

**Files:** create `docs/design/2026-09-27-playable-atom/` with selected reference frames and `asset-manifest.json`; update the current visual guidance in `docs/product/ATOM-DESIGN-SYSTEM.md`. Place approved assets under existing `public/images/exhibits/` or `public/assets/` by purpose.

- [ ] Capture the current Home → Fission → Evidence → Play journey when a browser is available. Save and inspect the actual screenshots; previous artifacts are not new QA.
- [ ] Develop three visual alternatives within the brief: warm museum (recommended), restrained dark exhibit room, and editorial atom-to-city story. Use Product Design ideation when producing image options; record the selected target before coding new visual compositions.
- [ ] Specify home, fission, comparison, claim and India layouts at 390×844 and 1440×900, with actual copy lengths, evidence sheet, dark theme and reduced-motion example.
- [ ] Reuse the current conversion poster where it fits. Review the three reactor JPEG captions and provenance; remove “high-precision” claims that the asset cannot support. Commission/generate only missing conceptual artwork; obtain source-reviewed diagram geometry separately.
- [ ] Record crop, responsive sizes, semantic color roles, alternate text, origin/rights and scientific status. Produce optimized WebP/AVIF where appropriate and keep source masters outside public bundles.

**Verify/exit:** selected frames and asset manifest are inspectable; captions distinguish illustration from measurement. No new UI dependencies or generic template are introduced. Unreviewed art is not used to explain engineering facts.

## N03 — Give the site one clear map

**Files:** `components/layout/AppShell.tsx`, `MobileMenu.tsx` and CSS/tests; `app/explore/ExploreHub.tsx`; `app/simulations/SimulationsHubClient.tsx`; `app/learn/page.tsx`; route pages for How It Works, Debates, Sources and Ask; `lib/search/index.ts`; create `lib/navigation/catalog.ts`; `tests/e2e/discovery.spec.ts`, `ask.spec.ts`, `debate.spec.ts` and route tests.

**Contracts:** One small navigation catalog with stable IDs, labels, destinations and visibility derived from actual content availability. `experiment=` accepts exactly the released IDs among `fission`, `atom`, `fuel`, `decay`, `reactor`, `grid`; default to `fission` once released, otherwise the first released exhibit. Unknown selections get a helpful fallback notice. No second dynamic lesson hierarchy.

- [ ] Make the top navigation Learn, Play, Myths, and India only when India is released. Put Search in utilities; keep Evidence in the footer and next to claims. Reuse the current focus-managed mobile drawer.
- [ ] Make `/explore` the only experiment catalog; `/simulations` is its workbench, not a competing directory. Each card says what the visitor can do and learn. Remove unsupported reliability/review/AI promises immediately.
- [ ] Add URL-selected simulator tabs with reload/history support and preserved per-tab state. Reuse the shared accessible Tabs behavior where it fits; hidden tabs pause effects/audio.
- [ ] Inventory distinct content, query parameters and anchors on routes being merged. Transfer useful How It Works content to the electricity-generation lesson; transfer bibliography search to Evidence; link debate detail pages from corresponding myths. Do not redirect until the replacement exists.
- [ ] Add explicit redirects for `/debates` and `/sources` after transfer. `/how-it-works` requires anchor mapping to matching lesson sections; retain a small compatibility route if a static redirect cannot preserve old step semantics. Do not invent new lesson slugs.
- [ ] Retire `/ask` in favor of search, carrying its existing query if present. Move only reviewed reusable answers into the content catalog; remove fabricated confidence and unsupported guarantee copy. Return a minimal documented JSON 410 from the unused `/api/debate` during a compatibility window if external usage is unknown; remove provider imports so it cannot call Ollama.
- [ ] Test every navigation destination, redirected query/anchor and mobile focus return. Search distinguishes available content from unavailable metric definitions and excludes unreleased results using N04's publication projection when ready.

**Verify:** relevant component/route/search tests, typecheck, build; production-build browser journey across desktop and 390px, keyboard-only navigation, back/forward and direct old URLs. Inspect one H1/main per page and no core overflow.

**Exit:** a newcomer chooses among a few meaningful activities and can reach any retained deep resource without duplicate catalogs or broken links.

## N04 — Make the promise of evidence true across the product

**Files:** retain `lib/evidence/release-provenance.ts`, `local-repository.ts`, `repository.ts`, `published-evidence.ts`, release ledger/catalog and tests; extend `lib/education/content-validation.ts`; create `lib/evidence/content-release.ts` and test, `content/release-manifest.json`; source-specific `data/sources/` records; evidence source/study/dataset route pages; `app/evidence/page.tsx`, `app/methodology/page.tsx`, `content/sources/sources-data.ts`, public catalog/search consumers.

**Contracts:** Reuse `EvidenceRepository` for numerical observations. Add public metadata getters returning allowed source/study/dataset projections or null. A small content-release manifest binds content ID/version/digest to resolved claim/citation IDs and actual review decisions; `getPublicContentStatus(id, version)` returns `released | pending | withdrawn`. This shares the evidence review model and creates no new service or reviewer identity system.

- [ ] Continue E02: acquire the first lifecycle-emissions artifact, record edition, exact page/table/cells, checksum and reuse terms; write reproducible extraction and normalization tests against those actual cells. Keep all records in review until real qualified decisions exist.
- [ ] Create a claim inventory for the initial retained journey: home, fission, comparison and first myths. Expand it with each later exhibit. Correct lesson `claimIds` resolution; verify checkpoint ownership, released prerequisites/next links, draft-parent exclusion and source locators.
- [ ] Trace hard-coded values in Ask, myths/debates, radiation, incidents, reactor/fleet, decay and annual grid. Migrate reviewed values to explicit records; remove/defer unsupported numerical claims. Do not label a number reviewed because a test fixture or schema says so.
- [ ] Make direct routes, static params, catalogs, search and downloads use the same public decision. Existing URLs with withdrawn content show an honest unavailable/correction state; draft text must not leak through props.
- [ ] Implement `/evidence/sources/[sourceId]`, `/evidence/studies/[studyId]` and `/evidence/datasets/[datasetVersionId]`. Show title, locator, period, method, boundary, version and allowed source link. Keep private reviewer metadata and restricted artifacts server-side.
- [ ] Replace broad guarantees and “ingestion architecture” copy with concise reader-facing explanations. A displayed quantitative claim should reach its source and method in at most two intentional actions.
- [ ] Test mismatched digests, missing review/source, inactive/withdrawn parents, restricted raw downloads, malformed content, changed claim wording and unknown direct IDs. Old immutable versions and review history remain unchanged.

**Verify:** `npm test -- lib/evidence lib/education/content-validation.test.ts lib/search`; new metadata route tests; `EVIDENCE_BASE_REF=2a3ae67 npm run evidence:check` for this baseline or the actual task base thereafter; typecheck/build; browser source→return journey.

**Exit:** software contracts and extraction preparation may be accepted separately. **Publication requires actual scientific, editorial and licensing decisions.** Zero released values remains an acceptable truthful state while those decisions are pending.

## N05 — Make Comparison the first trusted flagship

**Files:** `features/comparison/comparison-result.ts`, `comparison-api.ts`, `comparison-types.ts`, `ComparisonResults.tsx`, `ComparisonEvidence.tsx`, `ComparisonControls.tsx`, `ComparisonInterpretation.tsx`, CSS/tests; existing `components/charts/` and `components/evidence/`.

- [ ] Add an adapter regression with a real zero, missing, restricted, incompatible and categorical result. Preserve each kind and its reason. Replace the lossy `PreviewObservation` contract with a display projection of the existing discriminated result; do not just rename it.
- [ ] Use shared bar/range/table and Data Passport/Challenge components where their semantics fit. Keep one result source and one evidence drawer implementation. Raw mode requires actual permitted observations; range labels match their source semantics.
- [ ] Present one useful question first: lifecycle emissions. Show source selection, chart/table and a short explanation; place specialist controls in a labeled details/filter surface available to everyone. Display reviewed metric availability instead of advertising 34 populated metrics.
- [ ] Preserve independently validated URL fields, source order, explicit empty selection and rapid edits. Unknown/missing results must not inherit old values during transitions. “Human” units appear only with a supported conversion basis.
- [ ] Connect each result row to its own source record; partial evidence does not create a ranking of unobserved technologies. Test graphical/table/passport value, unit, geography and version agreement.

**Verify:** `npm test -- features/comparison components/charts components/evidence`; typecheck/build; three-browser comparison and regression-drill journeys, 320/390/768/1440px and both themes, keyboard, reduced motion, error/empty/partial states.

**Exit:** record Comparison Lab acceptance against the original category coverage requirements; unreleased categories are explicit and not promoted as working results. N04 review gates remain. This closes the prerequisite for new public lesson releases without silently weakening ADR 0001.

## N06 — Deliver the memorable first minute

**Files:** `app/page.tsx`, `app/HomePage.module.css`, `components/onboarding/OnboardingHero*`; `features/exhibits/EnergyJourney.tsx`, `EnergyConversionDiagram.tsx`, `ExhibitFrame.tsx`, `FissionExhibit.tsx`, `SpatialExhibit.tsx`; `features/education/LessonViewer.tsx`, `LessonCheckpoint.tsx`; `lib/exhibits/fission-sequence.ts`, `use-playback.ts`, `lib/audio/sound-controller.ts` and tests; `tests/e2e/experience.spec.ts`.

**Contracts:** Keep the existing single-event fission functions. Add a small shared `ExhibitControls` only for controls used by two real exhibits. Evolve `playCue` to `playCue(kind: "select" | "transfer" | "complete")`; one sound adapter owns mute, volume, context and scheduled voices. Prediction has one owner per embedded lesson/exhibit.

- [ ] Recompose the homepage to the selected storyboard with “Follow the energy” as the primary action and Compare secondary. Build from the existing conversion journey, not a new hero animation engine.
- [ ] Make the interactive stage readable at rest. Each step has a clear action and payoff; reset/replay work. Load optional 3D on explicit inspection, not initial home load.
- [ ] Complete `/learn/fission`: one question, optional prediction, exhibit, concise explanation, a useful checkpoint with explanatory retry, sources and next lesson. Remove the duplicated lesson textarea + exhibit prediction prompt. Server-render prose/evidence; hydrate the interactive parts.
- [ ] Preserve one counted event while visiting split → approach → split. Reset creates a fresh replay. Single-event visuals do not promise a chain-reaction simulation.
- [ ] Extend sound within the shared frame: off by default, user gesture, clear Sound control, mute/volume, three quiet cues. No sound on incidents. Pause/hidden tab/offscreen/route exit cancel inappropriate cues; enabling after a late resume cannot defeat mute.
- [ ] Define a visible learning payoff, such as correctly identifying heat as the next energy-transfer stage. Use restrained completion feedback and a next experiment, not confetti or a score for agreement.

**Verify:** fission-sequence/playback/audio/component tests; browser home→play→lesson→checkpoint→source→next in Chromium, Firefox and WebKit. Check silent first load, muted/reduced-motion equivalence, audio-denied behavior, route disposal, no-JS reading and GPU failure. Capture and compare selected layouts at 390/1440px.

**Exit:** a visitor starts without choosing a mode, understands one transformation and wants to try another. N04/N05 remain the public content/release prerequisite.

## N07 — Complete six more lessons, one at a time

**Files:** `features/education/LessonInteraction.tsx`, `LessonViewer.tsx`, `LearningPaths.tsx`, `lib/education/learning-models.ts`, `lesson-guides.ts`, `paths.ts`, `progress.ts`; lesson/checkpoint catalogs; relevant existing exhibit/simulator models/components and tests.

Each row is a bounded slice with its own content version, review, tests and browser acceptance. Reuse N06's frame; do not mark N07 complete after one lesson.

| Slice             | Experiment and concrete learning test                                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N07a Energy       | Power/time controls and accumulated energy; `2 kW × 3 h = 6 kWh`, doubling time doubles energy, zero is valid, negative/nonfinite rejected; visible numeric alternative to sliders                                                           |
| N07b Atom         | Connect existing atom visual to selected proton/neutron counts; proton change alters identity, neutron change preserves element; 92 + 143 gives mass number 235 without a stability claim                                                    |
| N07c Reactor/fuel | Explode/reassemble fuel; inspect each part and follow coolant. Replace misleading instantaneous `capacityFactorPercent` with a reviewed relative-power label or qualitative teaching state; no plant-safety prediction                       |
| N07d Electricity  | Reuse the homepage conversion model with reactor-specific loop context and losses; sequence and labels agree with text; preserve How It Works anchors during consolidation                                                                   |
| N07e Safety       | Select barriers to understand role and limits; include people, procedures and oversight. No fixed invented percentage of protection or disaster-proof completion state                                                                       |
| N07f Waste/decay  | Distinguish storage, disposal and changing hazards; guess and replay half-life with seeded population and expected curve. At one/two half-lives expected fraction is 0.5/0.25; it is not an individual health or waste-clearance calculation |

- [ ] For each slice, author one coherent explanation, cited detail and one checkpoint that tests understanding, not recall of interface labels. Remove stale or misleading facts during review; avoid copying old tier text wholesale.
- [ ] Move scientific inputs/constants out of React. Reuse reviewed records from N04 or label a genuinely synthetic arithmetic example at the input, not just in a distant footer.
- [ ] Extend local progress to persist valid path context with lesson ID/version. Unknown path, a lesson outside the requested path, corrupt storage, unavailable storage and materially updated content all recover predictably. Do not erase unrelated settings.
- [ ] Offer optional local discovery stamps for completed learning tasks and a useful next suggestion. No levels, ranks, login or streak obligation.

**Verify per slice:** its domain/component tests; `npm test -- lib/education features/education`; affected simulator tests; production-build `tests/e2e/learning-path.spec.ts` plus the exhibit journey. Verify keyboard numeric inputs, reset, details preserving state, reduced motion, sound, source links and mobile. Completion requires relevant real content review as well as software checks.

## N08 — Make annual grid balance a playful town challenge

**Files:** `lib/simulator/grid-model.ts`, `schemas.ts` and tests; `features/simulator/GridSimulator.tsx` and CSS/tests; `/grid` and its embedded simulator; add `lib/simulator/scenario-url.ts` and test.

**Contract:** `simulateAnnualGrid(scenario, factors)` receives explicit factor records resolved from reviewed evidence, with null for unavailable factors. Remove the competing optional `lifecycleCo2PerKwh` field or replace it consistently with that record reference. `parseGridScenario`/`serializeGridScenario` use a bounded versioned scenario schema; all shared assumptions are visible on reload.

- [ ] Start with “Meet this town's annual electricity demand.” Let visitors add/remove capacity using buttons/numeric fields and optional draggable blocks. Demand sectors are illustrative unless sourced; no precise “homes powered” conversion without a reviewed denominator.
- [ ] Show annual generation, demand, shortfall/surplus and reviewed emissions, with clear before/after portfolios. A town animation illustrates the selected portfolio, not hourly outages or proof of dependable supply.
- [ ] Remove hard-coded production emission factors from the pure model. Missing factors remain unavailable/partial; editing an explicit factor in a synthetic test actually changes the output. Require factor geography/year/boundary compatibility.
- [ ] Keep annual arithmetic tests: `1000 MW × 0.9 × 8760 = 7,884,000 MWh`; leap-year equivalent `7,905,600 MWh`; zero demand → coverage not applicable. Test unknown factor, invalid values, duplicated technology IDs and incomplete factor coverage.
- [ ] Add two bounded goals: meet more annual demand, then compare two mixes under the same assumptions. Avoid a universal “best mix” score or carbon/cost badge computed from missing evidence. Rename loaded preset language neutrally.
- [ ] Save/share a bounded validated scenario URL and compare two local cases. Test unknown versions, huge parameters, zero sources, removed technologies and browser history.

**Verify:** grid/scenario model and component tests, typecheck/build and `tests/e2e/grid.spec.ts` in all three browsers. Chart/table/results must agree. N04 gates apply to every empirical input; illustrative defaults are not an India forecast.

## N09 — Explain affordability through one cost workbench

**Files:** create `lib/simulator/cost-model.ts`, `cost-model.test.ts`, `cost-schema.ts`; `features/simulator/CostWorkbench.tsx`, CSS/test; reviewed assumptions under `data/evidence/`; integrate through `/compare` as a cost-detail experiment rather than create a second comparison app.

**Contract:** `calculateGenerationCost(input: CostScenario): CostResult` returns a finite modeled generation cost plus annual cash-flow/energy rows or an explicit invalid/unavailable state. Inputs include capacity, capacity factor, construction-year cost schedule, operating years, discount rate, currency/base year, O&M/fuel/decommissioning assumptions and evidence IDs.

- [ ] Begin with one plant/project sensitivity, not a global cheapest-source ranking. Allow financing, construction duration and capacity factor changes; show which assumptions changed and an accessible cost-composition table.
- [ ] Define LCOE as discounted included costs divided by discounted electricity, with a common time origin at construction start. State excluded grid/system costs, tax/subsidy treatment and real/nominal convention. Model construction delay by the explicit schedule; do not add a guessed penalty multiplier.
- [ ] Write independent arithmetic oracles: at zero discount, one year, 1 MW, 100% utilization and total included cost 876,000 currency units, generation is 8,760 MWh and cost is 100 currency/MWh. Zero generation is unavailable, not zero cost. Consistently shifting all cash flows/output dates changes no result; delaying only output at positive discount has the declared effect.
- [ ] Require compatible currency/base year and project boundary before comparing cases. Show existing-plant extension and new-build assumptions separately only when supported. No retail tariff, future market price or GDP claims.
- [ ] Make the payoff the discovery of which assumption matters: a visitor predicts, moves one control and sees the sensitivity. Keep exact methodology available without a reading mode.

**Verify:** independently checked model examples, schema/component tests, production-build `tests/e2e/cost.spec.ts` (new), keyboard/mobile and source inspection. Publish quantitative presets only after economic/editorial/source review.

## N10 — Make myth investigations useful and trustworthy

**Files:** `content/myths/myths-data.ts`, `content/debates/*.json`, `app/myths/MythViewer.tsx`; `features/debate/DebateViewer.tsx`, `lib/debate/`; `lib/radiation/`, `features/radiation/`; `content/incidents/`, `features/incidents/`; associated tests.

**N10a Claims:** one record per precise claim, with finding, explanation, limits, citations and linked experiment. Start with reactor-versus-bomb at a public conceptual level, lifecycle emissions, and “always cheap/always expensive”; then waste and other topics. Fold duplicate debate/Ask assertions into that record. Review categorical proliferation/safeguards promises, unsupported land/renewables thresholds and waste-equivalence claims before retaining them.

**N10b Radiation:** one quantity-specific explorer with visible duration/context and a matching table. Keep dose, dose rate, activity and absorbed/effective/equivalent quantities distinct; do not put medical/acute thresholds on a universal “safe versus dangerous” scale. Review every retained scenario and source locator. True zero, invalid, missing and tiny positive values are distinct, including in log placement and formatting.

**N10c Incidents:** readable event timeline, technical/institutional causes, consequences, uncertainties and lessons. Distinguish immediate effects, modeled long-term outcomes and evacuation/displacement. No game scores, celebratory transitions or alarming sounds.

- [ ] A claim interaction lets the learner predict, reveal, inspect the strongest evidence and discover a next experiment. Never force every claim to “false”. Keyboard users can reveal all content without a card flip or drag gesture.
- [ ] Citations resolve to actual records. Verdicts do not change with presentation or a user's prediction. Draft/unsupported claims do not appear in published decks or search.
- [ ] Test misleading/context-dependent/insufficient-evidence outcomes, source failures, quantity mismatch, missing observations and accessible reveal focus. Preserve existing supported URLs.

**Verify per slice:** myth/debate/radiation/incident unit and component tests, corresponding E2E journeys, 390px/desktop, reduced motion, source inspection. Qualified content/health-physics review is required for radiation claims; software tests are not that review.

## N11 — Make India the distinctive final chapter

**Files:** `lib/national/schemas.ts`, `national-model.ts` and tests; create source-versioned national data, `features/national/IndiaStory.tsx`, CSS/test and `app/india/page.tsx`; extend `tests/e2e/india.spec.ts`. Reuse N08/N09 models and the reviewed fleet projection from N12 when available.

**N11a Baseline/story:** obtain a coherent dated electricity baseline, then a PHWR/programme story. Starting authorities: [CEA power-sector reports](https://cea.nic.in/executive-summary-report/?lang=en), [NPCIL plant records](https://www.npcil.nic.in/content/302_1_AllPlants.aspx), DAE programme publications and AERB oversight material. Locate specific documents/rows; the index pages themselves are not extracted observations.

- [ ] Separate installed GW, generated TWh, per-person energy and primary energy. Distinguish financial/calendar years and net/gross capacity. Require duplicate-ID checks, missing-share handling and reconciliation of values, denominators and percentages—not only a permissive share-total tolerance.
- [ ] Use chapters: why more useful electricity matters; India's present mix; how PHWRs work; what can scale; constraints around delivery, finance, water, waste and institutions. Explain renewable, grid, efficiency and nuclear contributions together.
- [ ] Show reactor/programme stages as operating, construction, demonstration, research or ambition according to dated sources. Replace old undated commissioning/thorium narratives; targets are not completed capacity.

**N11b Scenarios:** combine the reviewed baseline with the same annual grid/cost models. Compare a few explicitly assumed portfolios and demand cases. A workshop/train/hospital visual connects electricity to everyday life but does not calculate national income, guaranteed jobs or industrial output.

- [ ] Label every output scenario/assumption; expose constraints, missing factors and sensitivity. A partial dataset yields partial results. No automatic global-factor fallback relabeled India.
- [ ] Test denominator swaps, mismatched years, complete/partial mixes, zero/missing capacity, unavailable cost assumptions and versioned share/reload. Unknown or unreviewed India content stays out of navigation/search.

**Verify:** national/model/component tests, reviewed source extraction examples and India browser journey in all three browsers. Add India to primary navigation only after the complete released stopping point exists. No new India route is released by this plan document.

## N12 — Polish focused reactor and fleet exhibits

**N12a files:** `features/reactor/ReactorExplorer.tsx`, `Reactor3DCanvas.tsx`, `schematics/`, `lib/reactor/reactor-model.ts`; extract concrete renderer responsibilities into `features/reactor/scene/` as needed, such as PWR geometry, camera controls and resource lifecycle. Keep one selection state and reuse `lib/graphics/dispose-scene.ts` and palette helpers.

- [ ] Finish PWR and India's PHWR first. Review labels/loops, then offer overview, inspect component and cutaway with matching 2D/text controls. Remove separate explanation modes under N01 and retain technical details locally.
- [ ] Test identical selected part/source in 2D/3D, theme changes on paused scenes, no renderer rebuild for a power-display change, context loss recovery, repeated mount/disposal and reduced-motion camera behavior. Avoid suggesting display power presets are a validated reactor model.

**N12b files:** `lib/reactor/fleet-model.ts`, `lib/globe/facility-model.ts`, `lib/globe/schemas.ts`, `data/reactors/global-fleet.json`, `features/globe/GlobeViewer.tsx`, `Globe3DCanvas.tsx`, `app/globe/page.tsx` and tests.

- [ ] Select one reviewed per-unit fleet dataset. Preserve real status dates, capacity basis and unknowns; remove the second hard-coded facility catalog after migrating needed fixtures. Replace synthesized as-of dates and generic facility URLs with actual provenance.
- [ ] Server-render the directory and source/date summary; lazy-load the globe. Split filter controls, directory and selected-facility detail from map orchestration. Do not build a new map platform.
- [ ] Test map/list IDs and counts, mixed-status sites, capacity sums restricted to the declared unit set, unknown selection, filters that exclude selection, historical gaps and query reload. Disable unsupported historical reconstruction instead of inferring past status from today's record.

**Verify per slice:** reactor/fleet/globe tests, relevant browser journeys and graphics tests. Record actual repeated-mount resource measurements and WebGL failure recovery; a screenshot does not prove cleanup.

## N13 — Remove the code that the new experience no longer needs

**Files:** the import-unreachable and superseded candidates identified in the brief; `package.json`/lockfile only if a dependency is demonstrably unused; `.github/workflows/source-monitor.yml`; README, AGENTS.md and current product/engineering entry points.

- [ ] Re-run a route-rooted import graph including dynamic imports, tests, build scripts, asset URLs and tooling entry points. Review every candidate before deletion.
- [ ] Remove retired AI providers/tests after N03's public-route transition; no hidden network call remains. Remove the old `FissionSimulator` re-export after moving its behavioral test to `FissionExhibit`; remove the unused kinetics model only if no retained learning objective needs it.
- [ ] Delete unused `MapFacilityPopup`, orphan complexity styles, obsolete local diagram/control copies and duplicate fleet records after their replacements pass. Integrate useful shared chart/evidence/UI primitives before deleting any duplicate implementation.
- [ ] Retain `repository-contract.ts`, synthetic test support, source manifests, release history and tests protecting real behavior. Move/narrow test-only names if helpful; never import them into public routes.
- [ ] Consolidate stale documentation pointers. Label September 7/21 and interactive proposal plans historical/superseded in their current index rather than maintaining competing queues. Keep DELIVERY-TRACKER as the only execution status source.
- [ ] Repair source monitoring with a small working command/report and a deliberate failure case, or disable the schedule with an explicit reason until it exists. Do not leave a workflow that invokes a missing script. Do not add a service for this check.

**Verify:** full typecheck/lint/unit/build, release history check against actual task base, links/assets/redirects and relevant full browser routes. Review deletions as a diff and confirm useful coverage was preserved. Do not delete tests merely to make the count smaller.

**Exit:** no active audience levels, redundant catalog authority, unused AI runtime or superseded rendering path; no broken documentation command. Simplicity is fewer responsibilities and clearer ownership, not an arbitrary file-count target.

## N14 — Verify delight, learning and release quality

**Files:** existing E2E suites and `scripts/qa-experience.mjs`, `qa-production.mjs`, `qa-performance.mjs`; appropriate release artifacts; `docs/product/DELIVERY-TRACKER.md`; add accurate public accessibility/corrections pages.

- [ ] Run complete quality commands: `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run evidence:check`, `npm run build`, `npm run test:e2e`. Record runtime, commit, failures/retries/skips; a rerun does not erase a flaky first result.
- [ ] Verify Chromium, Firefox and WebKit at 390×844, 768×1024 and 1440×900; include 320px reflow. Cover both themes, all entry routes and open overlays, actual 200% browser zoom, keyboard, a manual screen-reader journey and reduced motion.
- [ ] Exercise no JS, failed/delayed image or evidence request, GPU loss, hidden/offscreen exhibits, audio denied/muted, corrupt storage and malformed/shared URLs. Read explanations/table/directory without the optional technology.
- [ ] Inspect console/page/server errors, including the previously recorded unknown-route `NoFallbackError`. Keep source/review failure distinct from technical loading failure.
- [ ] Measure LCP target <2.5s, CLS ≤0.1 and INP ≤200ms in a documented representative mobile environment. Keep the repository's Lighthouse targets (>90 Performance, >95 other categories) as targets, not assertions. Verify optional Three.js is absent from initial ordinary reading/home execution; compare transfer and CPU work to the measured baseline. No fabricated performance percentages.
- [ ] Run a formative pilot with five novice/mobile users. Target four of five finding the first action, explaining the energy chain, reaching a source and continuing without help. Observe whether they want to replay and whether incorrect predictions receive useful explanations. These small-sample results are qualitative feedback, not proof of educational efficacy.
- [ ] Use optional aggregate events for experiment start/completion, evidence open and next-step choice. No free-text predictions, personal questions or identity tracking. Remove the obsolete complexity event; do not add analytics infrastructure until a real transport is needed.
- [ ] Record exact content/dataset/model/asset versions, qualified review status, browser evidence and rollback reference. Production promotion follows the current user's deployment authorization, not a blanket assertion inherited from an old tracker entry.

**Exit:** the candidate is coherent, enjoyable, source-inspectable and usable on a phone with sound/GPU/motion unavailable. Unrun gates remain explicitly open; no whole-site completion claim from a subset of passing checks.

## Delivery checkpoints

1. **Simpler foundation:** N01–N03, corrective copy and navigation; no reading levels, no broken existing links.
2. **First trustworthy learning loop:** N04/N05 release gate plus N06; home → fission → source → next, with restrained optional sound.
3. **Replayable collection:** each N07 slice, annual grid, costs and claims accepted individually.
4. **India and deeper exploration:** N11 and selected N12 exhibits, with reviewed inputs and clear limitations.
5. **Release:** cleanup, full verification and pilot; publish only accepted slices.

Do not expand the collection just to increase simulator count. One compelling experiment with a correct model, a useful explanation and a next step is the unit of delivery.

## Required task handoff

```text
Task ID / mapped E task:
Branch / HEAD / dirty files at start:
Dependencies and publication gates:
Files changed and learner-visible behavior:
Regression or unmet acceptance observed before change:
Commands and actual exit/results:
Browser viewports/themes/states and screenshot comparison:
Evidence/content/model/asset versions and real review status:
Review findings and resolutions:
Unverified gates / reason / next concrete action:
Commit (if made), deployment (if authorized), next bounded task:
```

This plan is delivered against the fresh baseline documented in the brief. No product code, source dataset, review identity, dependency or deployment was changed during planning.
