# ATOM delivery tracker

Last updated: 2026-09-25. This is the current status and verification authority. The site-wide experience plan is being delivered as small, verified slices on `codex/atom-experience-foundation`.

## Current entry point

Read in order:

1. [2026-09-21 codebase and experience audit](2026-09-21-CODEBASE-AND-EXPERIENCE-AUDIT.md).
2. This tracker.
3. [Design specification](../superpowers/specs/2026-09-21-atom-learning-experience-design.md).
4. [Ordered E00–E18 implementation plan](../superpowers/plans/2026-09-21-atom-learning-experience.md).
5. Applicable product policies, ADRs and the historical R-package specification mapped by the task.

**Current implementation slice: site-wide experience integration and release verification.** Theme correction `3472875` and annual-grid correction `1af5cf4` are committed and pushed. The museum shell/homepage, atom/fuel/fission exhibits, deterministic decay, learning paths, source-honesty repairs, and reactor/globe lifecycle changes are implemented in the working tree and undergoing final acceptance. They are **not yet deployed**. Resume from the live progress table below; do not restart the old E00-only queue.

Scientific/editorial/licensing review remains a separate gate. Existing content was not newly approved; no new lesson URL or India profile was released.

## Reconciliation record

The supplied `AGENTS.md` entry says R01–R03 complete and R04 next. Parent commit `522550a`'s deleted tracker says R01–R19 complete. Current `78e0a08` deleted that tracker, the historical audit/recovery plan, India/health routes, evidence authoring infrastructure and operations records while adding other implementation. The only observed worktree is the root checkout.

These historical claims are not current acceptance evidence. The restored 2026-09-07 audit and R-plan are marked historical. E00/E01 must reconcile surviving implementation and review records rather than blindly rerun R04 or assume all packages complete. No migrations or external data were modified during planning.

`INTERACTIVE-EXPERIENCE-PLAN.md` and `INTERACTIVE-DELIVERY-TRACKER.md` were pre-existing untracked proposals and remain untouched. Their I00–I10 queue is not a second current status authority. Useful ideas are incorporated in the design; their lesson-before-comparison sequence is not adopted as a public release decision. The earlier quoted `f2af087` implementation claim does not match this checkout's HEAD; do not mark the uncommitted onboarding work delivered from that claim alone.

## Planning status

| Deliverable                                                       | Status                            | Evidence                                                                       |
| ----------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| Repository/route/domain/content/configuration review              | Complete for planning scope       | Audit capability map and A01–A23 findings                                      |
| Current typecheck/unit/lint/build baseline                        | Verified for accepted slices      | Typecheck pass; 523 tests pass; lint 12 warnings; production build pass        |
| Browser/accessibility sample                                      | Improved; broader gates open      | Chromium at 390px in light/dark: sampled routes fit, axe clean, no page errors |
| Visual, learning-path, simulator, sound and architecture proposal | Written; proposed design          | Design specification                                                           |
| Ordered task plan and verification criteria                       | Written; proposed plan            | E00–E18 plan                                                                   |
| Historical audit and R-plan recovery                              | Restored as historical references | Read from `522550a`, no current completion inferred                            |
| Product implementation and new evidence publication               | Software slices in progress       | `95966c2` and `5ac45c2` pushed; no new scientific evidence published           |

## Implementation queue

Rows describe the broader roadmap, not a claim that implemented software has editorial approval. Sub-slices have independent commits/reviews; the current experience status below supersedes stale “Planned” labels for that software. Exact steps and files are in the plan.

| ID     | Deliverable                                                 | Depends on                   | Status                                                          |
| ------ | ----------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| E00    | Reconciled status, liveness and browser/CI baseline         | Planning                     | In progress; health route and flagship Chromium sample accepted |
| E01    | Auditable evidence publication and release serving          | E00                          | Planned                                                         |
| E02    | Reviewed comparison sources/category releases               | E01                          | Planned; real review required                                   |
| E03    | Lossless Comparison Lab and shared evidence/charts          | E00; release E02             | Planned                                                         |
| E04    | Evidence metadata routes, public filters and Lab acceptance | E01–E03                      | Planned; public lesson gate                                     |
| E05    | Selected home/lesson/comparison/India visual targets        | Audit                        | Planned                                                         |
| E06    | Compact shell, consistent themes and mobile navigation      | E05                          | In progress; theme/mobile/contrast foundation pushed            |
| E07    | Content/path graph, real claims and review contracts        | E01; release E04             | Planned                                                         |
| E08    | One replayable fission model                                | E00                          | Planned                                                         |
| E09    | Complete five-level fission lesson and shared frames        | E04/E06–E08                  | Planned                                                         |
| E10    | Opt-in sound in the completed lesson                        | E09                          | Planned                                                         |
| E11    | Signature homepage and discovery                            | E04/E06/E09                  | Planned                                                         |
| E12a–f | Remaining six fundamentals lessons; fission is E09          | E09                          | Planned per lesson                                              |
| E13    | Thematic paths, resume and versioned local progress         | E07/E12                      | Planned                                                         |
| E14a–c | Claim investigations, radiation, incidents                  | E04/E09; relevant E12 blocks | Planned per surface                                             |
| E15a   | Honest annual grid and impact inputs                        | E01/E02/E09                  | Planned                                                         |
| E15b   | Contextual cost sensitivity model and workbench             | E01/E02/E09                  | Planned                                                         |
| E15c   | Hourly grid model                                           | Separate model/data review   | Optional later scope                                            |
| E16a   | Reviewed India baseline and programme story                 | E13/E15a–b                   | Planned                                                         |
| E16b   | India portfolio scenarios                                   | E16a/E15a–b                  | Planned                                                         |
| E17a–b | Focused reactor and fleet experiences                       | E06/E09                      | Planned per exhibit                                             |
| E18a   | Operations, pilot and full release verification             | Released slices              | In progress; local checks recorded per slice                    |
| E18b   | Evaluated generated Ask answers                             | Mature reviewed retrieval    | Optional; not a learning-release dependency                     |

## Verification and publication rules

- One bounded task in progress. Record exact branch, files, commands, exit codes, tested browser states and content/data versions.
- A plan, schema, green unit suite or agent report is not a released product. Read the diff and perform applicable verification.
- Reviewed publication requires source/artifact/version, scientific/editorial/licensing records and actual release visibility. No invented reviewer identities.
- Public content may remain unavailable while code is implemented. Mark software and editorial/publication status separately.
- UI work requires real browser, keyboard, responsive, theme, motion and evidence-state checks. Any unrun gate remains unverified.
- Commit only owned paths. Push after each meaningful verified improvement as requested in the supplied prior task; a pushed branch is not a production deployment. The user has explicitly authorized deployment in this conversation.
- Use the plan's complete task report template in every implementation handoff. Record commit SHA after it exists; do not fabricate future hashes.

## Verification log — 2026-09-21 planning baseline

- Start: root `main`, `78e0a08`, one worktree, three modified onboarding files and two untracked interactive documents. Preserved.
- `npm run typecheck`: exit 0.
- `npm test -- --reporter=dot`: exit 0, 73 test files, 523 tests passed.
- `npm run lint`: exit 0, 12 warnings; no lint errors.
- `npm run build`: exit 0, production build completed.
- Production Chromium sample: six initial-page states; no captured `pageerror`; actual light/dark theme checked before recording results. Contrast findings remain on all sampled states; `/topics` and `/simulations` overflow at 390px; simulator page has nested/duplicate main landmarks.
- HTTP probes: `/health`, `/india`, `/evidence/sources/source-unece-2021` each return 404.
- Full configured E2E, Firefox/WebKit, complete keyboard/zoom/reduced-motion, sound, measured performance and scientific/licensing review: not run; not claimed.
- New planning documents and archived browser artifacts: see audit and plan links above. All local Markdown links in the four new planning documents resolve; E00–E18 headings are present in order; placeholder scan passes. Markdown was formatted with `--ignore-path /dev/null` because the repository normally ignores `*.md` in Prettier. Commit/push outcome is recorded in the final planning handoff.

## Verification log — 2026-09-23 implementation slices

- Branch: `codex/atom-experience-foundation`; one worktree; pushed commits `5ac45c2`, `3a02d05`, `9cb01e6`, `249dbcf`, and `b74f277` after the `95966c2` foundation.
- `5ac45c2` includes: motion/visibility lifecycle hooks for simulators and Three.js scenes; idempotent fission stage counting; scene power updates without renderer rebuild; globe hydration and reduced-motion fixes; accessible simulator tabs; removal of nested main landmarks; compact mobile layouts; shared light/dark contrast repairs across sampled routes; topic pages migrated from fixed light colors.
- `npm run typecheck`: exit 0.
- `npm run lint`: exit 0 with 12 pre-existing warnings; no errors.
- `npx vitest run`: exit 0, 73 test files, 523 tests passed.
- `npm run build`: exit 0, 56 routes generated.
- Chromium browser verification at 390×844, light and dark: `/`, `/topics`, `/simulations`, `/globe`, `/compare`, and `/learn/fission` have no horizontal overflow, no page errors, and no axe color-contrast/landmark/heading violations in the sampled state.
- Chromium reactor exhibit check at 1280×900 with reduced motion: `/reactors/pwr` created a canvas without page errors; changing to `50% Reduced` preserved the same canvas element marker and displayed `Power: 50%`; the scene now observes `data-theme` changes without rebuilding on power changes.
- Production deployment: Vercel deployment `dpl_CMv56NK1AhqXmkhTnGbr2qHW9WBa` (`atom-5l9menw19-pks-projects-35b7ae41.vercel.app`) for `58e3b60` reached Ready/Production and aliases to `https://atom-opal-omega.vercel.app`; earlier accepted code deployments `dpl_HTaDv7KyQVXyfjwjRrcUL7xvU59f` and `atom-7nssb9pcf-pks-projects-35b7ae41.vercel.app` were also Ready.
- Production Chromium smoke check at 390×844, light and dark: `/health` returned 200; `/`, `/topics`, `/simulations`, `/globe`, `/compare`, and `/learn/fission` returned 200 with one main landmark, one h1, no page errors, and no core horizontal overflow. The simulator heading regression was corrected before the follow-up deployment.
- GitHub Actions quality job for `b74f277` passed format check, typecheck, lint, unit tests, and build. The full browser job was still running when this record was written; its completion remains an open gate rather than being inferred from the production smoke check.
- Remaining unverified gates: Firefox/WebKit, 320px/tablet/desktop visual comparison, 200% zoom, full keyboard journeys, hidden-tab/offscreen resource assertions, WebGL context loss, sound adapter, measured performance, scientific/editorial/licensing review, and production deployment.

No E00–E18 implementation task or whole R-stage is marked complete by this planning delivery.

## Reopened gap audit — 2026-09-23

The user requested completion of the approved ten-part experience plan. Earlier foundation checks do **not** establish full delivery. In particular the previous “idempotent fission” claim only covered repeated adjacent clicks: leaving and revisiting split still adds an event. Scene theme observers do not repaint paused scenes, the mobile menu is not a focus-managed drawer, simulator tabs destroy state, and no atom/fuel exhibit, sound adapter or interactive homepage exists.

| Approved step / queue | Outstanding implementation and acceptance                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| 01 / E00,E18          | Stale E2E contracts/routes; full cross-browser route matrix and screenshots                    |
| 02 / E06              | Singleton theme subscription; cross-tab storage clear; paused scene invalidation               |
| 03 / E05,E06          | Museum palette, mobile drawer, utility search; all-route contrast and 320px checks             |
| 04 / E09,E10          | Offscreen/demand rendering, elapsed-time playback, shared controls and opt-in audio            |
| 05 / E08,E09,E17      | Shared simulation state and readable schematic conventions; extraction of oversized components |
| 06 / E17              | Reactor/globe disposal, context-loss fallback, demand updates and complete materials           |
| 07 / E08,E12          | Replayable fission and atom/fuel 2D/3D exhibits                                                |
| 08 / E09,E11,E13      | Controllable conversion homepage, lesson structure, durable learning progress                  |
| 09 / E03,E14,E15      | Annual-only grid, explicit missing factors, remaining route UX and evidence gaps               |
| 10 / E18              | Full accessibility, browser, performance and release acceptance                                |

Ruling: the user's approved ten-part experience plan is the current implementation scope. The broader E01–E18 editorial/research roadmap remains mapped here; real scientific review, India release and optional hourly/AI models cannot be fabricated as software completion. Continue on the existing clean feature branch, preserving the sole observed worktree. Existing deployment authorization remains valid.

Current regression slice: cross-tab cleared storage and grid annual accounting. Failing tests observed: storage-clear stayed Light; unknown technology invented a 50 gCO₂e/kWh factor; standalone grid lacked an h1. Fixed with a shared store, null impact results, correct embedded heading and removal of unsupported hourly dispatch/blackout output. No new evidence was published.

## Accepted annual-grid slice — 2026-09-24

- Scope: approved step 09 / E15a software only. Removed unsupported hourly dispatch curves, blackout-duration and reliability implications. The experiment now reports annual MWh balance and makes its illustrative emissions assumptions explicit.
- Model: existing annual capacity × capacity factor × hours calculation; missing emissions factors are nullable and make the aggregate unavailable. Missing generation does not become an intensity of zero. No new source observations or scientific approvals.
- Verification: `npx vitest run lib/simulator/grid-model.test.ts features/simulator/GridSimulator.test.tsx --maxWorkers=2` → 16/16 pass. Production-build Chromium `tests/e2e/grid.spec.ts` → 5/5 pass. The 390px light/dark route audit shows no overflow, page errors or axe violations for /grid and the default simulator panel. `git diff --check` → pass.
- State: commit/push recorded in git; production deployment still pending. The broader reopened experience work remains in progress.
- Prior accepted theme correction: `3472875` pushed; cross-tab storage clear and initial control synchronization fixed.

## Live experience progress — 2026-09-25

This table is the current status authority for the user’s ten-step experience plan. “Implemented” means code exists, not that every acceptance gate passed.

| Step / E task    | Implemented now                                                                                                                                                                                                                                        | Remaining before acceptance                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 / E00,E18     | Health endpoint; repaired stale E2E contracts; tests for unreleased India/internal fixture routes; production-build browser runner and 54-state route audit                                                                                            | Final suite/deployment recorded below; full scientific release remains separate                                                                       |
| 02 / E06         | Singleton theme store, storage clear/invalid states, native appearance, scene invalidation; hidden exhibits catch up with reading depth                                                                                                                | Final scene/theme matrix. Firefox test driver drops initial emulated media on navigation even on /health; actual system-change test passes            |
| 03 / E05,E06     | Warm light/dark tokens, responsive split hero, Learn/Explore/Compare/Evidence shell, search utility, focus-managed mobile drawer                                                                                                                       | 320px/390px route audits and desktop screenshots passed; actual browser 200% zoom and manual assistive-technology review remain                       |
| 04 / E09,E10     | Shared elapsed playback, step/reset/speed, hidden/offscreen/reduced-motion pause; opt-in lazy audio with immediate mute and cancellation                                                                                                               | Audio passes Chromium/Firefox/WebKit; idle and resumed WebGL drawing pass Chromium. Repeated-mount memory profiling and real hidden-tab checks remain |
| 05 / E08,E17     | Domain fission/decay models; shared 2D/3D component IDs; separate reactor schematic modules; controls/explanations separated from SVG; automatic schematic camera jumps removed                                                                        | Review remaining legacy component size and model boundaries. Legacy reactor-control equations remain approximate                                      |
| 06 / E17         | Reactor power changes update existing scene; default-paused flow/rotation, demand rendering, resource disposal, typed palettes; globe hydration/list synchronization; explicit WebGL/chunk/context-loss fallback                                       | Canvas preservation/context-loss and orbit/drag/reduced-motion checks pass. Full repeated-mount GPU-memory profiling remains                          |
| 07 / E08,E12     | Atom and fuel inspection in 2D/3D, controlled explode/reassemble; single-event fission storyboard with idempotent counting; seeded decay population                                                                                                    | Fission remains a one-event storyboard; scientific diagram review is separate. Cross-browser acceptance recorded below                                |
| 08 / E09,E11,E13 | Generated 127KB museum WebP poster; controllable coded energy pathway; question/prediction/experiment/explanation/checkpoint/direct-background-source flow; three learning paths, versioned progress/resume/reset; five depth notes in shared exhibits | State-preservation checks pass; existing lesson prose still needs claim-level editorial/scientific review and deeper expert content                   |
| 09 / E03,E14,E15 | Annual-only grid, nullable missing impact factors; comparison URL requests preserved, missing values nullable, fabricated provenance removed; invalid radiation values unavailable; broad contrast/wrapping/heading repairs                            | Remaining source metadata/publication infrastructure E01–E04 and scientific review; India E16 stays unreleased; final route audit                     |
| 10 / E18         | Focused tests and production builds; Chromium/Firefox/WebKit journeys; selected reference and screenshots; independent review findings addressed                                                                                                       | Release results below. Actual zoom, assistive-technology testing, field performance and learning pilot remain                                         |

### Verification record and review resolutions

- Latest complete unit run before the final schematic/depth/playback changes: `npx vitest run --maxWorkers=4` → **524/524 pass in 79 files** (13.84s). Earlier interrupted worker runs are not counted as passing.
- Final extraction focused checks: `npx vitest run features/reactor/ReactorExplorer.test.tsx features/education/LessonViewer.test.tsx features/simulator/FissionSimulator.test.tsx lib/graphics/dispose-scene.test.ts --maxWorkers=2` → **17/17 pass**.
- Playback regression: a single timeout stopped autoplay after one step. A multi-step timer test failed, then passed after using a cancellable interval. Final browser autoplay check has been added.
- `npm run typecheck` → pass after extraction. `npm run lint` → pass with 10 existing warnings, no errors. Latest `npm run build` → pass.
- Production-build three-browser run: **185/189 pass** before final integration. Retests passed the reactor SVG selection and WebKit globe search checks. The remaining Firefox theme-media and subpixel screenshot comparisons were isolated, repaired in the browser tests, and **2/2 retests passed**. This is not yet a single green final full run.
- Production-build 390px light/dark audit: **54 states**, no document overflow or page errors; one incidents contrast failure was fixed afterward. Final audit still due.
- Independent reviewer identified camera-reset double-scaling, reactor orbit losing the chosen state after suspension, globe orbit not restarting after drag, reading-depth stores missing changes while Activity-hidden, and audio resume undoing a mute. Fixes are implemented. Camera-reset, depth resubscription, and audio race have regression tests. Legacy orbit now has Chromium draw-call regression coverage, including resumption after reduced motion and globe drag. The reviewer did not complete a second full review; this is not an independent approval of the entire patch.
- Unknown lesson streaming returned HTTP 200 with a not-found body. Removing the outer loading boundary restored the intended 404 in the subsequent browser run; lazy exhibit loading remains within valid lesson pages.
- Generated artwork: `public/images/exhibits/conversion-museum-v1.webp`, conceptual illustration v1. Selected warm museum reference: `/Users/apple/.codex/generated_images/01a0c51c-e1c5-78e3-9f3a-90ff128b6fed/exec-3461fa5f-02e3-4cf2-8726-a8d5246ea459.png`. Geometry/claims in artwork are not scientific evidence.
- Model/content versions: fission storyboard v1, generic spatial exhibits v1, seeded decay population v1, existing annual grid model with explicit missing-factor handling. Existing evidence catalog remains `dataset-energy-synthesis`; no new observations or real review records were created.

### Integration acceptance record — 2026-09-25

- **Task ID / original stage:** approved experience steps 01–10, software integration across E00/E03/E06/E08–E15a/E17/E18. No parent E-stage is declared scientifically complete.
- **Branch / starting HEAD:** `codex/atom-experience-foundation`, `1af5cf4`; one worktree. Continued the owned, documented integration changes; no external DB writes or migrations.
- **Dependencies:** theme `3472875`, annual grid `1af5cf4`; existing published route catalog retained. New reviewed content release still depends on E01–E04.
- **Files / behavior:** shared shell/tokens and mobile drawer; museum home and generated poster; `features/exhibits`, `lib/exhibits`, `lib/audio`; lesson/path/progress modules; extracted `features/reactor/schematics`; legacy reactor/globe lifecycle; comparison missing-data/provenance and route-state repairs; reading-page contrast/wrapping; browser regression suites and QA scripts.
- **Regressions reproduced:** autoplay stopped after one event; repeated split counted extra events; camera reset double-scaled; paused WebGL rendered unnecessarily; resumed orbit lost intent; audio resume could undo mute; 320px tables/control groups overflowed; theme color interpolation briefly failed contrast. Fixed and checked with model/unit/browser oracles appropriate to each change.
- **Unit verification:** `npm test -- --maxWorkers=4` → **81 files, 526 tests passed**, exit 0 (13.4s).
- **Static/build verification:** `npm run typecheck` → exit 0; `npm run lint` → exit 0, **10 existing warnings**, no errors; `npm run build` → exit 0. `npm run format:check` → exit 0; `git diff --check` → exit 0. `PLAYWRIGHT_PORT=3104 REUSE_E2E_SERVER=true npx playwright test --workers=2` → **204 passed, 6 explicitly skipped**, exit 0 (1.8m); Chromium, Firefox and WebKit. Earlier failed runs were investigated, not counted as passing. Commit/deployment follow below.
- **Narrow-screen audit:** `ATOM_QA_URL=http://127.0.0.1:3104 ATOM_QA_WIDTH=320 node scripts/qa-experience.mjs` and repeat at 390 → **54 states each**, all 200, no document overflow, captured page errors or axe violations. These are sampled rendered states, not a WCAG certification. [320px results](../../artifacts/experience/audit-320.json), [390px results](../../artifacts/experience/audit-390.json).
- **Screenshots:** home, comparison, lesson and reactor at 1440px, both themes; homepage at 320px/390px. [Light desktop home](../../artifacts/experience/home-light-1440.png), [dark lesson](../../artifacts/experience/lesson-dark-1440.png), [light comparison](../../artifacts/experience/comparison-light-1440.png). Browser suite also exercises 768px and keyboard focus restoration.
- **Lifecycle/audio:** new Chromium draw-call tests prove default idle drawing stops and selected rotation resumes after reduced motion; globe resumes after drag. Actual Web Audio gesture/mute checks pass all three browsers. Context-loss/unavailable-WebGL fallbacks retain readable selected content. Chromium-only instrumentation is explicitly skipped in Firefox/WebKit rather than counted as covered there.
- **Performance:** three cold-cache mobile lab runs (390×844, 150ms latency, 1.6Mbps download, 4× CPU slowdown) measured **LCP 912–928ms, CLS 0.000158**, ~417KB transferred. [Measured results](../../artifacts/experience/performance.json). Local production server only; these are not production field percentiles or INP measurements.
- **Content/data/review:** existing `dataset-energy-synthesis`; conceptual poster v1; spatial exhibits v1; fission storyboard v1; seeded decay population v1. No new observation, reviewer identity, scientific approval or India release.
- **Unverified acceptance gates:** actual browser 200% zoom (native automation surface unavailable), manual screen reader review, prolonged/repeated-mount GPU-memory profiling, full physical hidden-tab matrix, production field performance and a formative learning pilot. Responsive viewport checks are not represented as actual zoom.

### Remaining work, in execution order

1. Finish the final full browser run, commit/push this integration and deploy the existing Vercel project. Record actual commit, deployment ID and production checks below. A push alone is not a deployment.
2. **E18 software verification:** actual 200% browser zoom and assistive-technology journeys; repeated-mount GPU resource profiling and real background-tab behavior; production field LCP/CLS/INP monitoring. Close gaps with evidence rather than broad “site complete” assertions.
3. **E01–E04 evidence infrastructure:** reconcile source-level provenance, public metadata routes, release-serving rules and review records. Preserve unavailable states and release filtering. Real scientific/editorial/licensing review remains an external gate; this does not prevent implementing the missing software contracts next.
4. **E07/E09/E12/E13 lesson completion:** map substantive claims to exact sources, expand genuine five-level explanations, remove duplicated prediction prompts in embedded exhibits, review geometry/scale assumptions and checkpoint validity, persist path context consistently, then run a learning pilot. Existing released lesson URLs stay canonical.
5. **E17 remaining exhibit polish:** review approximate reactor-control equations and component labels; finish consistent overview/component/cutaway camera presets across reactor types; remove unverified “high-precision” gallery descriptions; continue splitting the legacy 3D renderer by reactor type. Current 2D/3D inspection and fallbacks work, but these refinements are not marked done.
6. **E14/E15b/E16:** source-reviewed radiation/incident/claim investigations, contextual cost workbench, then reviewed India baseline and scenarios. India remains unreleased. New national, cost or hourly reliability outputs require reviewed inputs/models.
7. **Optional E15c/E18b:** reviewed hourly grid and evaluated generated Ask answers. Before enabling generated answers, remove hard-coded confidence and no-hallucination guarantees in legacy AI providers; require supported citations and evaluated abstentions. Curated search remains the default.

Ruling: retain one Next.js application and one Vercel deployment. Reuse shared controls/models and lazy scene boundaries; no microfrontends, general scene engine, new backend or animation library.
