# ATOM Curriculum & Knowledge Coverage Register

**Last updated:** 2026-09-07  
**Status:** Canonical Curriculum V1 Released (R10)

## Curriculum Architecture

ATOM organizes educational content into three layers:
1. **Topics:** High-level themes mapping across the electricity landscape.
2. **Lessons:** Sequential, measurable learning units with formative checkpoints.
3. **Complexity Layers:** Every lesson provides 5 checked explanations (Kid, Simple, Curious, Technical, Expert) explaining identical scientific phenomena without altering data.

## Topic Coverage Matrix

| Topic ID | Topic Title | Status | Subtopics | Order |
| --- | --- | --- | --- | --- |
| `fundamentals` | Energy Fundamentals | `published` | `energy-conservation`, `atomic-structure`, `radiation-types` | 1 |
| `nuclear-technology` | Nuclear Technology | `published` | `fission-mechanics`, `reactor-cores`, `thermal-cycles` | 2 |
| `safety-and-environment` | Safety & Environment | `published` | `defense-in-depth`, `passive-safety`, `waste-management` | 3 |
| `grid-and-economics` | Electricity Systems & Economics | `in-review` | `firm-power`, `capital-financing` | 4 |

## Canonical Seven-Lesson Learning Path

| Sequence | Lesson ID | Slug | Topic | Objective | Prerequisites | Next Lesson | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `energy` | `energy` | `fundamentals` | Distinguish power from energy and compare specific energy density across primary fuels. | — | `atom` | `published` |
| 2 | `atom` | `atom` | `fundamentals` | Identify atomic structure, nucleons, electrons, and isotopic stability. | `energy` | `fission` | `published` |
| 3 | `fission` | `fission` | `nuclear-technology` | Explain neutron-induced fission, chain reactions, and thermal neutron moderation. | `atom` | `reactor` | `published` |
| 4 | `reactor` | `reactor` | `nuclear-technology` | Identify core reactor components including fuel assemblies, control rods, coolant, and pressure vessels. | `fission` | `electricity-generation` | `published` |
| 5 | `electricity-generation` | `electricity-generation` | `nuclear-technology` | Understand thermal steam cycles, turbine-generators, and grid dispatchability. | `reactor` | `safety` | `published` |
| 6 | `safety` | `safety` | `safety-and-environment` | Examine defense-in-depth barrier architecture, passive safety systems, and historical accident lessons. | `electricity-generation` | `waste` | `published` |
| 7 | `waste` | `waste` | `safety-and-environment` | Analyze radioactive decay, spent fuel cooling, dry cask containment, and deep geological repositories. | `safety` | — | `published` |

## Checkpoint & Formative Assessment Policy

Every published lesson contains at least one multiple-choice formative checkpoint requiring active student application of concepts before progression. Each option provides an explicit pedagogical rationale.
