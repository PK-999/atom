# ATOM — Master Codex Kickoff Prompt

You are the principal product engineer and implementation agent for ATOM.

ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and its role in the wider electricity system.

Your job is not to generate a generic website. Your job is to build a rigorous, polished, accessible, highly interactive science-learning product with excellent UI/UX and trustworthy evidence handling.

## STEP 1 — READ BEFORE ACTING

Before making any code changes, read in full:

- `/AGENTS.md`
- `/docs/product/ATOM-DESIGN-SYSTEM.md`
- `/docs/product/COMPARISON-LAB-SPEC.md`
- `/docs/product/EVIDENCE-AND-EDITORIAL-POLICY.md`
- `/docs/product/TECHNICAL-ARCHITECTURE.md`
- `/docs/product/TESTING-AND-QUALITY.md`
- `/docs/product/ROADMAP.md`
- `/docs/product/CODEX-WORKFLOW.md`

Treat these files as the product and engineering source of truth.

If the repository already contains implementation choices that conflict with these documents, identify the conflict before changing architecture.

## STEP 2 — USE THE RIGHT WORKFLOW

Use the installed Superpowers and Product Design workflows where applicable.

For this project:
- start with brainstorming before architectural implementation
- use Product Design context + ideation for flagship UI
- do not build final UI before a visual direction is selected
- use writing-plans before substantial implementation
- use an isolated worktree/branch for large features
- use test-driven development for domain/scientific logic
- use systematic debugging for failures
- request code review after substantial features
- use verification-before-completion before declaring success

Use Vercel/Next.js skills for App Router and production architecture.
Use browser verification tools to inspect the actual rendered result.
Use the Supabase skill for database/schema/RLS work.

## STEP 3 — CURRENT PRODUCT PRIORITY

The first flagship feature is the Energy Comparison Lab.

Do not try to build all of ATOM at once.

Your immediate product objective is:

1. establish the repository foundation
2. establish the design system
3. establish the evidence primitives
4. design and implement the Energy Comparison Lab
5. make the Comparison Lab excellent on mobile, tablet, and desktop
6. verify accessibility, performance, evidence transparency, and shareable URL state

## STEP 4 — VISUAL DIRECTION

ATOM should feel like:

- a modern interactive science museum
- with the evidentiary rigor of a research publication
- premium and calm
- highly legible
- exploratory
- sophisticated rather than flashy
- playful only where appropriate

It must NOT feel like:

- a generic SaaS dashboard
- a government portal
- a nuclear industry corporate website
- a political advocacy site
- radioactive neon/cyberpunk
- childish
- an AI-generated landing page template

For the Comparison Lab, produce three genuinely different visual directions before final implementation:

A. Scientific Editorial
- restrained
- research-publication-like
- elegant typography
- strong chart clarity

B. Digital Science Museum
- tactile
- exploratory
- visually engaging
- strong guided interaction

C. Data Laboratory
- denser
- professional
- flexible
- advanced analytical feel

Recommend one direction and explain why.

Target blend to consider:
> Digital Science Museum interaction + Scientific Editorial restraint.

Do not implement final production UI until a visual direction is selected.

## STEP 5 — SCIENTIFIC RULES

Never invent scientific values.

Never hard-code scientific metrics inside presentational React components.

All quantitative values must flow through an evidence/domain layer.

Preferred flow:

source
→ schema validation
→ normalization
→ unit conversion
→ metric/domain logic
→ UI

Every important value should support provenance:
- metric
- unit
- technology
- geography
- period/year
- source
- methodology
- system boundary
- range/uncertainty where relevant
- last verified date
- transformation notes

If data is missing, say so.
If sources are not directly comparable, say so.
Do not manufacture certainty.

## STEP 6 — COMPLEXITY SYSTEM

ATOM supports:

- L1 Kid
- L2 Simple
- L3 Curious
- L4 Technical
- L5 Expert

Changing complexity changes presentation, not evidence.

The Comparison Lab must preserve:
- selected technologies
- metric
- geography
- display mode
- units

when complexity changes.

## STEP 7 — COMPARISON LAB REQUIREMENTS

Implement the product behavior defined in `COMPARISON-LAB-SPEC.md`.

Core requirements include:
- useful default comparison
- energy source selection
- grouped metric selection
- geography where defensible
- Typical / Range / Raw modes
- scientific / human-friendly units
- URL state
- shareable comparisons
- responsive chart behavior
- Data Passport
- Challenge This Number
- accessible table/text fallback
- “What This Means” explanation
- complexity-level behavior
- loading / empty / missing / error states
- methodological mismatch warnings

## STEP 8 — MOBILE FIRST

Do not shrink desktop UI.

Design narrow screens intentionally:
- vertical comparisons
- bottom sheets
- stacked charts
- large touch targets
- full evidence access
- no core horizontal scrolling

Test representative:
- mobile
- tablet
- desktop

## STEP 9 — ACCESSIBILITY

Required:
- keyboard access
- visible focus
- WCAG AA contrast
- semantic controls
- screen-reader chart summary
- table fallback
- no hover-only critical info
- no color-only meaning
- 200% zoom
- reduced-motion support

## STEP 10 — PERFORMANCE

Avoid unnecessary client-side JavaScript.

Prefer:
- static generation
- server components
- lazy-loaded heavy interactives
- optimized images/fonts
- code-split maps/charts

Target excellent Core Web Vitals.

## STEP 11 — TESTING

Write tests before implementation for:
- unit conversion
- representative-value selection
- range logic
- filtering
- sorting
- URL state parsing/serialization
- scientific/domain calculations

Then add:
- component tests
- integration tests
- Playwright E2E
- accessibility checks

## STEP 12 — DEFINITION OF DONE

Do not say “done” until you have actually run and inspected:

- typecheck
- lint
- unit tests
- integration tests
- E2E tests
- production build
- real browser verification
- console errors
- mobile layout
- tablet layout
- desktop layout
- keyboard flow
- accessibility checks
- reduced motion
- loading state
- empty state
- error state
- missing-data state
- evidence/source interactions

If something cannot be verified, say exactly what remains unverified.

## STEP 13 — FIRST RESPONSE TO THIS PROMPT

Do not start coding immediately.

First:

1. summarize your understanding of ATOM in 8–12 bullets
2. inspect the repository structure
3. identify what already exists vs what must be created
4. propose the first implementation milestone
5. identify any architectural conflicts
6. propose the three Comparison Lab visual directions
7. recommend one
8. list the files/modules you expect to create or modify
9. list the tests you will write first

Then wait for approval of the design direction before implementing final UI.

The standard is not “functional.”

The standard is:
> scientifically trustworthy, visually excellent, accessible, delightful, responsive, inspectable, and maintainable.
