# ATOM Product Roadmap

## Current execution order

The phases below are the original thematic roadmap, not the current execution
order. ADR `0001-comparison-lab-priority.md` and `DELIVERY-TRACKER.md` place the
complete Comparison Lab before Nuclear 101. The 2026-09-07 learning experience
audit expands organization and coverage without silently reversing that decision.
Execute `docs/superpowers/plans/2026-09-07-learning-platform-recovery.md` using
its R01–R19 dependency table. It maps every package to the original stages and
adds explicit tests. New content preparation can precede public lesson release.

## Guiding Principle

Build one exceptional coherent experience at a time.

Do not parallel-build five half-polished flagship features.

---

## Phase 0 — Product Foundation

Deliver:
- product principles
- audience model
- design system
- evidence policy
- technical architecture
- testing standard
- information architecture
- visual direction

Exit criteria:
- documents approved
- initial visual target selected

---

## Phase 1 — Design System and Shell

Deliver:
- app shell
- navigation
- footer
- typography
- spacing
- colors
- dark mode
- complexity selector
- core UI primitives
- evidence primitives
- chart primitives
- component playground / Storybook

Exit criteria:
- mobile + desktop foundations validated
- visual language stable enough for flagship feature

---

## Phase 2 — Nuclear 101

Deliver:
- What is energy?
- What is an atom?
- What is fission?
- How a reactor works
- How electricity is generated
- Safety introduction
- Waste introduction

Core capability:
- five-level explanation system

Exit criteria:
- complexity selector works across multiple lessons
- content patterns validated

---

## Phase 3 — Evidence System

Deliver:
- metric model
- source model
- citation model
- Data Passport
- Challenge This Number
- methodology drawer
- alternative-study view
- last-verified metadata

Exit criteria:
- quantitative claims do not come directly from UI constants

---

## Phase 4 — Energy Comparison Lab

Deliver:
- energy source selector
- metric selector
- geography where supported
- Typical / Range / Raw modes
- URL state
- mobile experience
- Data Passport
- Challenge This Number
- table fallback
- analytics events

This is the first share-worthy flagship feature.

---

## Phase 5 — Radiation Explorer

Deliver:
- logarithmic dose explorer
- dose vs dose-rate education
- contamination vs irradiation
- beginner + expert modes
- accessible text/table version

---

## Phase 6 — Debate Engine

Initial topics:
- Is nuclear too expensive?
- Is nuclear safe?
- What happened at Chernobyl?
- What happened at Fukushima?
- What happens to nuclear waste?
- Does nuclear lead to nuclear weapons?
- Does nuclear take too long?
- Can renewables replace nuclear?
- Can nuclear replace fossil fuels?
- Is uranium supply sufficient?
- What about uranium mining?
- What about thorium?
- Are SMRs economical?

Each debate page:
- strongest argument for
- strongest argument against
- evidence
- methodology
- consensus
- uncertainty
- sources

---

## Phase 7 — Reactor Explorer

Deliver:
- PWR
- BWR
- PHWR
- CANDU
- RBMK
- fast reactor
- molten-salt concept

Interactive systems:
- fuel
- coolant
- moderator
- control rods
- vessel
- containment
- steam cycle

---

## Phase 8 — Nuclear Globe

Deliver:
- operating
- construction
- shutdown
- decommissioned
- time slider
- facility detail
- country filters
- list fallback

Use MapLibre GL JS.

---

## Phase 9 — India

Deliver:
- Nuclear India map
- PHWR story
- three-stage programme
- fast breeder programme
- thorium
- fleet history
- India 2050 scenarios

---

## Phase 10 — Grid / Power-a-City Simulator

Begin simple:
- annual demand
- technology mix
- annual generation
- lifecycle emissions
- land
- capacity
- simple reliability context

Then progressively add:
- hourly demand
- renewable profiles
- storage
- curtailment
- reserve margin
- interconnection
- capacity credit

Do not pretend a simple arithmetic model is a full grid model.

---

## Phase 11 — Ask ATOM

Only after evidence retrieval is mature.

Deliver:
- grounded answers
- inline source links
- explain simpler
- go deeper
- show maths
- show sources
- graceful “insufficient evidence” response

---

## Product Metrics

Prefer:
- concept completion
- comparison completion
- source opens
- Challenge This Number use
- complexity-level changes
- simulation completion
- return visits
- learning-path completion

Avoid optimizing primarily for pageviews.

Potential signature metric:
- Evidence Engagement Rate
