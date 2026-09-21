# ATOM codebase and learning-experience audit

Date: 2026-09-21. Baseline: `main` at `78e0a088e90433e20fd831bcf55bd13947e7edae`, with the three existing onboarding edits. Purpose: inform the requested step-by-step website plan. This is a repository/product review and limited browser audit, not scientific approval or full release verification.

## Recommendation

Keep the existing application and turn its exhibits into a coherent learning journey. ATOM already has substantial diagrams, simulators, comparison logic, content schemas and shared components. Its weaknesses are inconsistent evidence publication, fragmented learning, duplicated presentation/model logic, mobile accessibility and drift between documentation/tests and the current app.

Build toward a digital science museum: a striking nucleus-to-electricity homepage, one excellent five-level lesson, connected paths, evidence-backed claim investigations and an India pathway. Use SVG/CSS for most graphics, existing Three.js only for optional spatial exploration, and one small opt-in Web Audio adapter. Do not start another app or install a second design system.

Full direction: [design specification](../superpowers/specs/2026-09-21-atom-learning-experience-design.md). Ordered work: [implementation plan](../superpowers/plans/2026-09-21-atom-learning-experience.md). Current status: [delivery tracker](DELIVERY-TRACKER.md).

## Scope and baseline reconciliation

Inventory covered all 302 tracked paths at the starting commit, route/component imports, feature and domain boundaries, content/data catalogs, assets, tests/configuration/CI and product/decision documents. The app/components/features/lib/content/data/tests inventory contains 266 files and approximately 64,701 lines across TS/TSX/CSS/JSON, including the large geographic dataset. Core data flows and representative implementations/tests were inspected in depth; this is not a claim of exhaustive line-by-line security or scientific review.

Excluded: dependency internals, secrets/environment values, external databases, hosted deployment state and source-by-source scientific/licensing validation of every numerical claim. Historical deleted documents were read from git. Browser sampling covered six route/viewport/theme combinations in Chromium, not every interaction or every supported browser.

At the start:

- Only one worktree was present: `/Users/apple/codes/atom`, branch `main`. The separate delivery worktree described by the supplied instructions was not present.
- Three onboarding files were modified; `INTERACTIVE-EXPERIENCE-PLAN.md` and `INTERACTIVE-DELIVERY-TRACKER.md` were untracked. They were preserved.
- The audit, main delivery tracker and recovery plan referenced by `AGENTS.md` were missing from HEAD. They exist in parent commit `522550a`; HEAD `78e0a08` removed them together with extensive evidence/operations code and records.
- Historical tracker `522550a` calls R01–R19 complete, whereas supplied instructions say R01–R03 complete. Neither statement establishes current acceptance after the later deletion/rewrite.
- The historical audit and recovery plan are restored as labeled historical references in this documentation delivery. The current tracker records the discrepancy and proposed E00–E18 queue. No historical migration or product code is restored by this audit.
- Dependencies and a lockfile are present now. Node is `v26.5.0`; package engine requires `>=24.20.0`, while CI pins `24.20.0`. Today's successful local checks do not establish success on CI's distinct runtime.

## Capability map

| Area               | Existing code/capability                                                                      | Decision                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Home and discovery | `app/page.tsx`, onboarding hero, Explore, How It Works, topic pages, search, glossary         | Recompose the learner journey; keep routes and useful content                                  |
| Shell/preferences  | `AppShell`, ten navigation links, shared theme and global complexity preference               | Reuse; compact navigation and repair contrast/reflow                                           |
| UI components      | Buttons, tabs, segmented controls, overlays, tooltip, command menu and state surfaces         | Compose existing primitives; avoid bespoke replacements                                        |
| Evidence/chart UI  | Passport, challenge, source drawer, bars/ranges/distributions and table fallback              | Reuse consistently; Comparison Lab currently duplicates these                                  |
| Comparison         | URL parser, headless engine, local repository, controls and table                             | Preserve contracts; repair lossy adapter and provenance/release semantics                      |
| Lessons            | Seven published-flagged lessons, seven checkpoints, local progress, five strings per lesson   | Expand substance; replace metric-as-claim linkage; add review and path contracts               |
| Content breadth    | Four topic records, ten glossary entries, three debate files, myths/incidents/source catalogs | Maintain a coverage register and publish reviewed slices; catalog presence is not completeness |
| Fission            | Large particle/atomic-split UI plus multiplication/kinetics model                             | Extract one model/event source; reuse in lessons                                               |
| Decay              | Existing isotope data, curve logic and particle UI                                            | Reuse with source review, sampled/expected distinction and reduced motion                      |
| Reactor control    | Parameter-to-state model and illustrated simulator                                            | Review model assumptions; avoid implying engineering prediction accuracy                       |
| Grid               | Tested annual-energy model plus a separate hand-shaped hourly display in React                | Keep annual model; remove arbitrary impact fallback; separately validate hourly demonstration  |
| Radiation          | Quantity schemas, conversion logic, scenario data and dose explorer                           | Retain physical distinctions; fix invalid-value formatting and publication metadata            |
| Reactor explorer   | Eight system concepts, component selection, 2D/3D/cutaway/gallery code                        | Preserve useful graphics; split responsibilities and lazy-load optional 3D                     |
| Globe/fleet        | Three.js/SVG views, 173 fleet records, facility schemas, separate legacy facility catalog     | Reconcile dataset authority, status/date/coverage and equivalent list access                   |
| India              | `lib/national/` data/schema/tests and E2E test remain; `/india` and national UI are absent    | Revalidate data and restore a focused baseline before scenarios                                |
| Ask/debate API     | Curated retrieval, Ollama wrapper and `/api/debate`                                           | Keep secondary to learning; remove unsupported certainty and evaluate generated claims         |
| Operations         | CI, scheduled source workflow, strict analytics payloads and Web Vitals                       | Preserve useful pieces; repair missing scripts/routes and test drift                           |
| Assets             | Three reactor JPEGs, comparison background and world geometry                                 | Record provenance/licence/accuracy; existing files are not verified source diagrams            |

## Findings and task mapping

Severity here prioritizes product work; it does not describe an observed hosted production incident.

| ID  | Priority | Source evidence and consequence                                                                                                                                                                                                                                | Planned correction                                                                                                           |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| A01 | P0       | `78e0a08` removes authoritative audit/tracker/plans and governed evidence infrastructure; surviving ADRs describe a different architecture                                                                                                                     | E00/E01: reconcile explicitly, restore references, choose one release mechanism; never bulk-restore both migration histories |
| A02 | P0       | `lib/evidence/published-evidence.ts:rangeObs` stamps every observation with publication, licence, period, verification date and uncertainty metadata. The local snapshot contains no inspectable review/artifact graph proving these declarations              | E01/E02: source-specific records, immutable versions and real review gates; do not infer approval from flags                 |
| A03 | P0       | The same helper uses `range.kind: "min-max"` and a generic “5th–95th percentile” uncertainty description; when typical is omitted it computes a midpoint and calls it a central estimate                                                                       | E02: preserve the source's actual range/representative semantics and extraction basis                                        |
| A04 | P0       | `features/comparison/comparison-api.ts` collapses non-available entries to `typicalValue: 0` and maps every available entry to `reviewed`. Current presentation checks hide many such sentinels, but the richer missing/restricted/incompatible status is lost | E03: lossless discriminated results all the way to charts/table/evidence                                                     |
| A05 | P0       | `lib/simulator/grid-model.ts` uses `LIFECYCLE_CARBON_INTENSITY_FACTORS[id] ?? 50`; missing scientific factors become invented estimates                                                                                                                        | E15a: supply reviewed factors and return partial/unavailable impacts                                                         |
| A06 | P1       | `GridSimulator.tsx` computes 24 hand-shaped demand/wind/solar/hydro values and deficit hours in React, separately from the annual model                                                                                                                        | E15: pure explicit model and honest synthetic/annual/hourly labels; no adequacy inference                                    |
| A07 | P1       | `LessonInteraction.tsx` duplicates fission/reactor/decay behaviour and hard-codes pellet/fossil/household equivalences, reactor parameters, barrier percentages and waste timelines                                                                            | E08/E12: use reviewed pure models and one block across lesson and simulator                                                  |
| A08 | P1       | All seven lessons have only 23–40 words per level in `content/lessons/catalog.json`; L5 often adds terminology without derivation, source detail or uncertainty                                                                                                | E07/E09/E12: complete five-level explanations with shared evidence and meaningful expert depth                               |
| A09 | P1       | `content-validation.ts` treats known metric IDs as valid `claimIds`; e.g. atom/fission use `power-density`, waste uses `lifecycle-ghg`/`land-use`. `LessonViewer` provides generic institutional-homepage citations                                            | E07/E04: real claim/concept/source relationships and specific evidence destinations                                          |
| A10 | P1       | `/learn` badges every lesson “Verified”; metadata/status fields lack corresponding recorded qualified reviews. Search builds links for every metric definition irrespective of actual release                                                                  | E01/E04/E07: consistent public visibility and honest review labels                                                           |
| A11 | P1       | `progress.ts` only partially validates stored objects; checkpoint completion reads do not check version; `lastAccessedLesson` is recorded on completion writes rather than ordinary opening                                                                    | E13: validated version-aware progress and unfinished-lesson resume                                                           |
| A12 | P1       | `AppShell` has ten links in an overflow strip; home introduces nine feature cards. The first viewport places considerable emphasis on the brand and depth picker before an experiment                                                                          | E05/E06/E11: clear first action, four primary destinations and guided questions                                              |
| A13 | P1       | Browser sample finds contrast violations in all six tested combinations; `/topics` is 420px wide and `/simulations` 502px wide at a 390px viewport                                                                                                             | E06 and page-owning tasks: measured reflow, themes and semantic contrast                                                     |
| A14 | P1       | `/simulations` nests a main inside AppShell's main and embeds a simulator H1 below the hub H1; custom tab implementation omits the behaviour already supplied by shared `Tabs`                                                                                 | E06/E09/E12: composable heading/landmark contracts and shared accessible tabs                                                |
| A15 | P1       | `FissionSimulator` creates stochastic scientific events in React. Re-selecting the scission stage increments counted fissions; a separate headless kinetics model does not govern those events                                                                 | E08: pure replayable transitions; one event counted once; physical versus illustrative limits                                |
| A16 | P1       | `ReactorExplorer.tsx` is 3,635 lines; its 3D component is 1,751. Reactor/globe 3D modules and all four simulator tabs are statically imported. CSS reduced-motion rules do not cancel JS timers/WebGL loops                                                    | E09/E12/E17: focused components, intent-based loading, explicit motion/visibility lifecycle                                  |
| A17 | P1       | `/india`, `/health`, detailed evidence routes and `/design-system` are absent; Playwright still waits on `/health`. Foundation/learning/India tests assert old routes/headings/level controls                                                                  | E00/E04/E16: restore/reconcile actual behaviour and runnable meaningful checks                                               |
| A18 | P1       | Source-monitor workflow invokes `npm run monitoring:sources`, which is missing from `package.json`                                                                                                                                                             | E00/E18: honest workflow state, working monitor, actual report and handled-failure evidence                                  |
| A19 | P1       | `lib/ai/chat-provider.ts` claims guaranteed verifiable output and sets confidence to 1.0/0.5; `ollama-provider.ts` assigns 0.95 while attaching fallback citations to generated text without checking each claim                                               | E18b: remove arbitrary confidence, evaluate support and abstention before public generation                                  |
| A20 | P1       | `lib/radiation/radiation-model.ts:formatDose` formats negative/nonfinite inputs as `0 µSv` even though conversion functions reject them                                                                                                                        | E14b: preserve true zero and explicit invalid/unavailable state                                                              |
| A21 | P2       | Multiple facility and scientific-value catalogs coexist; for example annual grid wind/solar defaults differ from comparison values without a shared contextual record                                                                                          | E01/E15/E17: unify source ownership or record justified differing boundaries explicitly                                      |
| A22 | P2       | `ReactorExplorer` maintains an independent standard/simpler/deeper explanation setting; Ask uses another level mapping                                                                                                                                         | E07/E17/E18: one five-level concept, explicit adapters and shared evidence                                                   |
| A23 | P2       | No sound adapter/preferences were found; existing animation and duplicated controls already create lifecycle complexity                                                                                                                                        | E10: add one small opt-in sound system only after the complete lesson; no ambient soundtrack                                 |

## Actual verification

The following checks ran against the current source, including the user's onboarding edits, before documentation changes. They do not verify the future plan's implementation.

| Check                                                                                                   | Result                                                                                 |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `git status --short`, `git worktree list`, recent history                                               | Baseline recorded above; no other worktree present                                     |
| `npm run typecheck`                                                                                     | Exit 0                                                                                 |
| `npm test -- --reporter=dot`                                                                            | Exit 0; 73 files and 523 tests passed                                                  |
| `npm run lint`                                                                                          | Exit 0; 12 warnings, including unsupported `aria-selected` on a button in How It Works |
| `npm run build`                                                                                         | Exit 0; Next 16.3.3 webpack production build; 55 static generation entries reported    |
| Chromium production-page sample                                                                         | Six combinations loaded; no `pageerror` events recorded                                |
| axe sample                                                                                              | Failed accessibility checks as detailed below; no full-site compliance claim           |
| `/health`, `/india`, `/evidence/sources/source-unece-2021`                                              | Actual HTTP 404                                                                        |
| Full configured E2E suite                                                                               | Not run; the missing `/health` readiness target is a confirmed harness defect          |
| Firefox/WebKit, full keyboard journey, actual 200% zoom, reduced-motion equivalence, audio, performance | Not run in this planning audit; required during implementation                         |
| External DB, deployment, scientific/editorial/licensing approval                                        | Not performed                                                                          |

Production server: `npm start -- --hostname 127.0.0.1 --port 3217`. Browser sample used installed Playwright Chromium and `@axe-core/playwright`, a fresh context for each theme with the preference set before navigation, and 900px viewport height. It was a read-only sample of rendered pages, not the configured E2E suite. The in-app browser tool was unavailable (`CUA_REPL_ENABLED_SURFACES is required`) and `agent-browser` was not installed; installed Playwright provided the fallback without a plugin installation.

An initial temporary audit harness failed because axe required an explicit browser context; it was corrected and the six-case sample rerun. An earlier sample changed themes after page load; it was discarded in favour of fresh contexts and confirmed actual themes. Only the final sample is reported below.

| Route            | Viewport/theme   | Horizontal width | Final axe findings                                                                      |
| ---------------- | ---------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `/`              | 1440 × 900 light | 1440px           | 21 color-contrast nodes                                                                 |
| `/`              | 390 × 900 dark   | 390px            | 5 color-contrast nodes                                                                  |
| `/learn/fission` | 390 × 900 light  | 390px            | 18 contrast nodes; heading-order finding                                                |
| `/compare`       | 1440 × 900 light | 1440px           | 17 contrast nodes                                                                       |
| `/topics`        | 390 × 900 dark   | 420px            | 5 contrast nodes; measurable overflow                                                   |
| `/simulations`   | 390 × 900 dark   | 502px            | 3 contrast nodes; heading order and nested/duplicate main findings; measurable overflow |

Counts are axe-reported nodes in the sampled state, not unique site-wide defects or an accessibility score. Screenshots are first-viewport captures. The machine-readable report and six captures are stored in [the verification directory](../engineering/verification/2026-09-21-experience-audit/).

## What to preserve, simplify and defer

Preserve the repo, canonical routes, tested unit/URL/evidence logic, source-inspection components, existing CSS tokens, schema discipline, useful SVGs, optional Three.js models and local-progress approach. Preserve all unrelated user work.

Simplify navigation, shared state semantics, duplicated lesson/simulator logic, source/metric/fleet catalogs, custom chart/dialog implementations and large mixed-responsibility components. Simpler serving infrastructure must still provide explicit evidence review and version history.

Defer new 3D effects, a universal simulation engine, accounts, gamified streaks, a CMS, generated answers, multilingual rollout and hourly national optimization. None is needed to make the first lesson excellent. Hindi/local-language content can be introduced later with the same evidence IDs and actual language review.

The first coherent releases are: repaired baseline and evidence → trustworthy Comparison Lab → selected visual system and compact shell → complete fission lesson → connected fundamentals/home → paths and claims → cost/grid and India → focused remaining exhibits. Sound is an optional small enhancement to the completed lesson.

## Planning handoff

```text
Task ID / original stage: PLAN-2026-09-21 / product planning, mapping E00–E18 to R01–R19
Branch / HEAD / dirty files at start: main / 78e0a08 / three onboarding edits and two untracked interactive documents
Dependencies satisfied with evidence: current source inventory, historical audit/tracker/plan read, product documents and ADRs reviewed
Files changed and behavior delivered: audit, design, ordered plan, current tracker, restored historical references and baseline browser artifacts; no product behaviour changed
Regression observed before fix: planning task records defects; fixes are queued, not claimed
Commands and actual exit/results: typecheck 0; unit suite 0, 523/523; lint 0 with 12 warnings; build 0; browser findings above
Browser viewports/themes/states checked: six Chromium initial-page states at 390/1440 × 900, light/dark as listed; three missing route probes
Evidence/content/dataset version and real review status: current local snapshot dataset-v2026-1 inspected structurally; qualified source/content/licensing review not established
Review findings and resolutions: old recovery status conflicts with HEAD; historical documents labeled; current acceptance reset to explicit verification; no release-order change
Unverified gates / reason / next concrete action: full E2E/a11y/performance and evidence releases remain open; execute E00 first on a building request
Commit (if made) and next unblocked task ID: record actual commit in delivery handoff; next E00
```
