# N01 — Single reading migration record

Date: 2026-09-27. Branch: `codex/single-reading-experience`. Base: `2a3ae6761ef971385dde34ed6acdb0c66caf12fa`. Acceptance and actual command results are in [DELIVERY-TRACKER](DELIVERY-TRACKER.md). This record describes the change, not a scientific publication approval.

## Learner-visible changes

- Removed global, onboarding, lesson, comparison, Explore, myth, incident, Ask and Reactor audience levels. Removed their preference store, obsolete CSS, prompt fields and analytics event.
- One explanation now provides a summary, prose and optional named details. Native details keep experiment state and keyboard focus; shared disclosure styling provides touch-sized summaries.
- Comparison URLs retain five fields, order, empty selections and unavailable IDs. Historical `level` values are ignored. Filter changes and generated share URLs preserve the hash.
- Both legacy complexity storage keys are untouched and unread. Theme, checkpoint records, paths and lesson completion remain compatible.
- Existing exhibit graphics, scientific classifications (including INES and confidence intervals), source attribution, simulation calculations, evidence releases and routes remain available. No dependency, service or provider was added.

## Content versions and review

The single-reading prose revision is **2026-09-27**, **pending scientific/editorial review**. It covers:

| Content owner                               | Revision treatment                                                                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/lessons/catalog.json`              | Seven manually consolidated explanations; `explanationVersion: 2026-09-27`, `explanationReviewStatus: pending`; assessment `version: 1.0.0` unchanged     |
| `features/exhibits/exhibit-explanations.ts` | Four conceptual experiment explanations; equations, event semantics and model limitations retained as named details                                       |
| `content/metrics/index.ts`                  | 34 metric definitions; discarded tier-dependent rankings; existing boundaries/limitations retained                                                        |
| `content/myths/myths-data.ts`               | Eight consolidated explanations and short summaries; conditional wording replaces unsupported absolutes; original source lists retained                   |
| `content/incidents/incidents-data.ts`       | Four incident explanations and five FAQs; accident mechanism separated from consequence; other historical records unchanged                               |
| `lib/ask/retrieval-engine.ts`               | Six single explanations with existing citation/evidence IDs; no new release or claim of retrieval validation                                              |
| `lib/reactor/reactor-model.ts`              | Existing component descriptions retained; redundant analogies removed; engineering context made optional; contradictory absolute safety language withheld |
| How It Works / reactor-control prose        | Retired tiers; explanatory concepts and explicit model limits retained; existing numerical diagrams/model outputs still require N04/N12 review            |

The migration is deliberately not an automatic choice of one old level. Old variants contained repetition, inconsistent qualifiers and unsupported quantitative or absolute statements. Useful concepts and equations were retained in context; numbers from the removed variants are not promoted to released evidence. Their original text remains in Git.

Lesson objectives, prerequisites, claim references, checkpoints, completion versions and existing content dates were compared with the base and preserved. A separate prose version prevents this wording update from erasing a completed assessment. New substantive assessment changes still require an explicit version migration.

Background checks consulted the NRC's [nuclear energy introduction](https://www.nrc.gov/education-regulatory-research/the-student-corner/what-is-nuclear-energy), [electricity explanation](https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/how-does-a-nuclear-power-plant-make-electricity), [Three Mile Island backgrounder](https://www.nrc.gov/regulations-legislation/fact-sheets-brochures/backgrounder-on-the-three-mile-island-accident), and [UNSCEAR's Fukushima assessment FAQ](https://www.unscear.org/unscear/en/areas-of-work/fukushima-report-faq.html). These checks do not substitute for claim-by-claim review or establish rights to redistribute a source artifact.

## Review boundaries and decisions

- Native implementation/self-review followed the N-plan's instruction to delegate only on explicit user request. No independent human or agent review is claimed.
- The existing checkout received a dedicated feature branch, preserving the three pre-existing planning-document changes. No historical migration tree was copied or reset.
- `ExplanationSchema` is an authoring schema, not part of a stored release payload in this checkout. The evidence history check against the base confirms unchanged immutable records and zero active numerical releases.
- The Reactor inspector keeps its simple description plus named details; it does not need an extra full explanation record or duplicate citation IDs.
- Numerical claims already present in incident tables, reactor descriptions, Ask citation summaries and other legacy diagrams still require N04 evidence work. This task does not approve those records, retire Ask (N03), activate releases (N04), redesign navigation (N03) or select new visual assets (N02).
- Existing Next.js production-server `NoFallbackError` log entries appeared while expected invalid lesson/reactor URLs returned their tested 404s. No page/console failures occurred in the checked valid journeys. This routing diagnostic remains an operations follow-up; it was not silently reported as a clean server log.

## Remaining product work

N02 supplies concrete visual targets and assets. N03 simplifies discovery and overlapping routes, including Ask retirement. N04 records real content/source reviews and closes the remaining factual/publication gaps. Full assistive-technology review, a learning pilot and production deployment remain separate gates.
