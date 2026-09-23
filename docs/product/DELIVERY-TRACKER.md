# ATOM delivery tracker

Last updated: 2026-09-23. This is the current status and verification authority. The site-wide experience plan is being delivered as small, verified slices on `codex/atom-experience-foundation`.

## Current entry point

Read in order:

1. [2026-09-21 codebase and experience audit](2026-09-21-CODEBASE-AND-EXPERIENCE-AUDIT.md).
2. This tracker.
3. [Design specification](../superpowers/specs/2026-09-21-atom-learning-experience-design.md).
4. [Ordered E00–E18 implementation plan](../superpowers/plans/2026-09-21-atom-learning-experience.md).
5. Applicable product policies, ADRs and the historical R-package specification mapped by the task.

**Current implementation slice: E00/E06/E18 foundation repairs.** The health route, theme store, mobile shell, motion lifecycle, simulator accessibility, contrast tokens, and sampled responsive defects have been implemented and verified locally. The next bounded slice is the shared 3D theme/material lifecycle and flagship exhibit regression checks. Visual/draft content preparation is permitted while real evidence review is pending; new public lesson release still follows the Comparison Lab gate in ADR 0001.

## Reconciliation record

The supplied `AGENTS.md` entry says R01–R03 complete and R04 next. Parent commit `522550a`'s deleted tracker says R01–R19 complete. Current `78e0a08` deleted that tracker, the historical audit/recovery plan, India/health routes, evidence authoring infrastructure and operations records while adding other implementation. The only observed worktree is the root checkout.

These historical claims are not current acceptance evidence. The restored 2026-09-07 audit and R-plan are marked historical. E00/E01 must reconcile surviving implementation and review records rather than blindly rerun R04 or assume all packages complete. No migrations or external data were modified during planning.

`INTERACTIVE-EXPERIENCE-PLAN.md` and `INTERACTIVE-DELIVERY-TRACKER.md` were pre-existing untracked proposals and remain untouched. Their I00–I10 queue is not a second current status authority. Useful ideas are incorporated in the design; their lesson-before-comparison sequence is not adopted as a public release decision. The earlier quoted `f2af087` implementation claim does not match this checkout's HEAD; do not mark the uncommitted onboarding work delivered from that claim alone.

## Planning status

| Deliverable                                                       | Status                            | Evidence                                                                            |
| ----------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| Repository/route/domain/content/configuration review              | Complete for planning scope       | Audit capability map and A01–A23 findings                                           |
| Current typecheck/unit/lint/build baseline                        | Verified for accepted slices     | Typecheck pass; 523 tests pass; lint 12 warnings; production build pass             |
| Browser/accessibility sample                                      | Improved; broader gates open     | Chromium at 390px in light/dark: sampled routes fit, axe clean, no page errors       |
| Visual, learning-path, simulator, sound and architecture proposal | Written; proposed design          | Design specification                                                                |
| Ordered task plan and verification criteria                       | Written; proposed plan            | E00–E18 plan                                                                        |
| Historical audit and R-plan recovery                              | Restored as historical references | Read from `522550a`, no current completion inferred                                 |
| Product implementation and new evidence publication               | Software slices in progress       | `95966c2` and `5ac45c2` pushed; no new scientific evidence published                  |

## Implementation queue

All rows are planned, not accepted. Sub-slices have independent commits/reviews. Exact steps and files are in the plan.

| ID     | Deliverable                                                 | Depends on                   | Status                                      |
| ------ | ----------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| E00    | Reconciled status, liveness and browser/CI baseline         | Planning                     | In progress; health route and flagship Chromium sample accepted |
| E01    | Auditable evidence publication and release serving          | E00                          | Planned                                     |
| E02    | Reviewed comparison sources/category releases               | E01                          | Planned; real review required               |
| E03    | Lossless Comparison Lab and shared evidence/charts          | E00; release E02             | Planned                                     |
| E04    | Evidence metadata routes, public filters and Lab acceptance | E01–E03                      | Planned; public lesson gate                 |
| E05    | Selected home/lesson/comparison/India visual targets        | Audit                        | Planned                                     |
| E06    | Compact shell, consistent themes and mobile navigation      | E05                          | In progress; theme/mobile/contrast foundation pushed |
| E07    | Content/path graph, real claims and review contracts        | E01; release E04             | Planned                                     |
| E08    | One replayable fission model                                | E00                          | Planned                                     |
| E09    | Complete five-level fission lesson and shared frames        | E04/E06–E08                  | Planned                                     |
| E10    | Opt-in sound in the completed lesson                        | E09                          | Planned                                     |
| E11    | Signature homepage and discovery                            | E04/E06/E09                  | Planned                                     |
| E12a–f | Remaining six fundamentals lessons; fission is E09          | E09                          | Planned per lesson                          |
| E13    | Thematic paths, resume and versioned local progress         | E07/E12                      | Planned                                     |
| E14a–c | Claim investigations, radiation, incidents                  | E04/E09; relevant E12 blocks | Planned per surface                         |
| E15a   | Honest annual grid and impact inputs                        | E01/E02/E09                  | Planned                                     |
| E15b   | Contextual cost sensitivity model and workbench             | E01/E02/E09                  | Planned                                     |
| E15c   | Hourly grid model                                           | Separate model/data review   | Optional later scope                        |
| E16a   | Reviewed India baseline and programme story                 | E13/E15a–b                   | Planned                                     |
| E16b   | India portfolio scenarios                                   | E16a/E15a–b                  | Planned                                     |
| E17a–b | Focused reactor and fleet experiences                       | E06/E09                      | Planned per exhibit                         |
| E18a   | Operations, pilot and full release verification             | Released slices              | In progress; local checks recorded per slice |
| E18b   | Evaluated generated Ask answers                             | Mature reviewed retrieval    | Optional; not a learning-release dependency |

## Verification and publication rules

- One bounded task in progress. Record exact branch, files, commands, exit codes, tested browser states and content/data versions.
- A plan, schema, green unit suite or agent report is not a released product. Read the diff and perform applicable verification.
- Reviewed publication requires source/artifact/version, scientific/editorial/licensing records and actual release visibility. No invented reviewer identities.
- Public content may remain unavailable while code is implemented. Mark software and editorial/publication status separately.
- UI work requires real browser, keyboard, responsive, theme, motion and evidence-state checks. Any unrun gate remains unverified.
- Commit only owned paths. Push after each meaningful verified improvement as requested in the supplied prior task; a pushed branch is not automatic public deployment approval.
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

- Branch: `codex/atom-experience-foundation`; one worktree; pushed commits `5ac45c2`, `3a02d05`, and `9cb01e6` after the `95966c2` foundation.
- `5ac45c2` includes: motion/visibility lifecycle hooks for simulators and Three.js scenes; idempotent fission stage counting; scene power updates without renderer rebuild; globe hydration and reduced-motion fixes; accessible simulator tabs; removal of nested main landmarks; compact mobile layouts; shared light/dark contrast repairs across sampled routes; topic pages migrated from fixed light colors.
- `npm run typecheck`: exit 0.
- `npm run lint`: exit 0 with 12 pre-existing warnings; no errors.
- `npx vitest run`: exit 0, 73 test files, 523 tests passed.
- `npm run build`: exit 0, 56 routes generated.
- Chromium browser verification at 390×844, light and dark: `/`, `/topics`, `/simulations`, `/globe`, `/compare`, and `/learn/fission` have no horizontal overflow, no page errors, and no axe color-contrast/landmark/heading violations in the sampled state.
- Chromium reactor exhibit check at 1280×900 with reduced motion: `/reactors/pwr` created a canvas without page errors; changing to `50% Reduced` preserved the same canvas element marker and displayed `Power: 50%`; the scene now observes `data-theme` changes without rebuilding on power changes.
- Remaining unverified gates: Firefox/WebKit, 320px/tablet/desktop visual comparison, 200% zoom, full keyboard journeys, hidden-tab/offscreen resource assertions, WebGL context loss, sound adapter, measured performance, scientific/editorial/licensing review, and production deployment.

No E00–E18 implementation task or whole R-stage is marked complete by this planning delivery.
