# ADR 0011: One reading experience

- Status: Accepted product decision; implementation tracked separately
- Date: 2026-09-27
- Authority: the user's explicit instruction to remove reading levels, followed by “continue building”

## Decision

Every visitor receives one clear explanation. Optional, named details expose equations, assumptions and context without changing the experiment or its factual basis. There is no audience selector, local reading preference, level URL synchronization or level analytics event. This includes the independent Ask and Reactor selectors.

Use `ExplanationContent` (`summary`, `body`, optional named `details`, `citationIds`) where a feature needs structured prose. Simple descriptions do not need an additional abstraction. The reactor inspector retains its existing description and named component details. Keep the existing tokens and native keyboard-accessible disclosure controls.

Old `level=` links remain usable and inert. Comparison state consists of `sources`, `metric`, `region`, `mode`, and `units`; serialization writes those five keys. Preserve source order, explicit empty selections, unrelated page context and hashes. Do not read or write either legacy complexity storage key. Do not clear theme, answers or learning progress.

Lesson `version` remains the completion/assessment compatibility version. This wording-only migration retains `1.0.0` objectives and checkpoints; `explanationVersion` records the separate prose revision. Revised explanations are pending review, not newly approved scientific content. A future material assessment change must explicitly update progress compatibility.

Scientific classifications (including INES), interval confidence levels, geometry depth, heading levels and learning paths remain meaningful and are retained.

## Superseded requirements and boundaries

This decision supersedes the five-level requirements in AGENTS.md, the design system, comparison specification, roadmap and historical R/E plans. ADR 0004 is amended only for the retired query key and preference. ADR 0001's Comparison-Lab-first public release gate and ADR 0010's immutable file-based evidence serving remain in force. No reviewed evidence payload, source dataset, release record or reviewer identity is changed by this migration.

See the [current plan](../superpowers/plans/2026-09-27-playable-atom.md), [migration record](../product/2026-09-27-single-reading-migration.md) and [delivery tracker](../product/DELIVERY-TRACKER.md).
