# ATOM Product Design System

## 1. Purpose

This document defines the shared visual, interaction, accessibility, content, and data-visualization language of ATOM.

ATOM is an interactive energy-literacy platform using nuclear energy as the central lens through which visitors learn about electricity, climate, risk, radiation, engineering, economics, and grid systems.

The product should feel like:

> a modern interactive science museum with the evidentiary rigor of a research publication.

---

## 2. Product Experience Principles

### 2.1 Evidence before persuasion
The interface must make sources, assumptions, uncertainty, and alternative estimates accessible.

### 2.2 Complexity is user-controlled
Visitors choose how deep they want to go.

### 2.3 Same evidence, different presentation
Changing explanation level may change wording, notation, controls, and density, but not the underlying factual dataset.

### 2.4 Exploration over lecturing
Whenever useful, let users manipulate, compare, scrub, filter, or simulate rather than only read.

### 2.5 Progressive disclosure
Start simple. Reveal more detail when the user asks for it.

### 2.6 Mobile is a first-class environment
No flagship feature may be desktop-only in its intellectual value.

### 2.7 Transparency earns trust
Important numbers should expose provenance.

---

## 3. Audience Model

### L1 — Kid
Approximate audience: ages 5–10.

Characteristics:
- short sentences
- concrete analogy
- minimal units
- illustrations
- guided interaction
- no unnecessary jargon
- no equations

### L2 — Simple
Approximate audience: older children, teens, casual adults.

Characteristics:
- plain English
- familiar units
- short explanations
- simple charts
- limited terminology

### L3 — Curious
Default general-adult mode.

Characteristics:
- normal scientific terminology with definitions
- complete charts
- numerical values
- context and trade-offs
- methodology summaries

### L4 — Technical
Students, analysts, professionals.

Characteristics:
- distributions/ranges
- technical terminology
- assumptions
- derivations where useful
- system boundaries
- engineering/economic context

### L5 — Expert
Engineers, researchers, advanced users.

Characteristics:
- raw observations where available
- detailed methodology
- equations
- study-level comparisons
- data download
- uncertainty discussion
- source metadata

### Behavior
- Selector remains accessible globally.
- Changing level does not reload the page where avoidable.
- Page position and current selection should be preserved.
- Preference persists locally.
- Advanced controls may appear progressively.
- Technical data remains available on demand even in simpler modes.

---

## 4. Brand Personality

### ATOM should feel
- scientific
- curious
- calm
- polished
- premium
- exploratory
- human
- playful when appropriate
- serious when required

### ATOM should not feel
- propagandistic
- political-campaign-like
- corporate energy-company-like
- radioactive-neon
- dystopian
- cyberpunk
- childish
- cluttered
- dashboard-first

---

## 5. Visual Direction

Reference principles, not direct copying:

- Our World in Data — evidence clarity
- Stripe — spacing and interaction polish
- NASA — scientific storytelling
- Observable — exploratory data interaction
- The Pudding — interactive journalism
- Kurzgesagt — approachable science
- Linear — precision and interaction quality

Recommended visual direction:

> Digital science museum interaction with restrained editorial presentation.

The visual system should favor:
- clean surfaces
- large explanatory headings
- restrained use of gradients
- consistent scientific diagrams
- highly legible charts
- deliberate whitespace
- tactile controls
- layered but not glass-heavy UI
- dark mode designed intentionally, not inverted mechanically

---

## 6. Typography

Use actual font choices only after licensing, loading performance, and readability have been reviewed.

Suggested type roles:

### Display
Desktop: 48–80px
Mobile: 36–48px

Use for:
- homepage hero
- flagship section intros

### H1
~48/56 desktop

### H2
~36/44

### H3
~28/36

### Body Large
~20/30

### Body
~16/26

### Caption
~13/18

### Data Label
~14/18

### Scientific / code / measurements
Monospace where useful.

### Reading width
Narrative prose:
- target max width around 680–760px

Data/interactive workspace:
- target max width around 1360–1480px

Avoid dense full-width paragraphs.

---

## 7. Color System

Start with semantic tokens rather than one-off hex values.

### Surface
- `surface-primary`
- `surface-secondary`
- `surface-tertiary`
- `surface-elevated`

### Text
- `text-primary`
- `text-secondary`
- `text-muted`
- `text-inverse`

### Border
- `border-subtle`
- `border-default`
- `border-strong`

### Interaction
- `interactive-primary`
- `interactive-hover`
- `interactive-active`
- `interactive-focus`

### Feedback
- `positive`
- `warning`
- `negative`
- `information`

### Energy source tokens
- `energy-nuclear`
- `energy-solar`
- `energy-wind`
- `energy-coal`
- `energy-gas`
- `energy-hydro`
- `energy-storage`
- `energy-biomass`
- `energy-geothermal`

Energy colors must remain consistent across:
- charts
- maps
- cards
- filters
- simulations

Do not communicate category only by color. Pair with labels, icons, patterns, or shape.

---

## 8. Spacing

Preferred spacing scale:

```text
4
8
12
16
24
32
48
64
96
128
```

Use tokens.

Avoid ad-hoc spacing except inside specialized visualization geometry.

---

## 9. Layout Grid

### Desktop
- 12 columns
- max content width around 1440px
- outer gutter around 32–48px

### Tablet
- 8 columns

### Mobile
- 4 columns
- margins around 16–20px

Narrative pages and interactive workspaces may use different content widths while preserving shared gutters.

---

## 10. Core UI Components

Foundation:
- Button
- IconButton
- Link
- Input
- Select
- CommandMenu
- Tabs
- SegmentedControl
- Toggle
- Checkbox
- Radio
- Slider
- Tooltip
- Popover
- Drawer
- Modal
- BottomSheet
- Toast
- Badge
- Chip
- Accordion
- Skeleton
- EmptyState
- ErrorState

ATOM-specific:
- ComplexitySelector
- EnergySourceChip
- MetricCard
- EvidenceBadge
- DataPassport
- SourceDrawer
- ChallengeNumber
- ConfidenceNote
- StudyComparison
- DefinitionPopover
- UnitToggle
- HumanUnitToggle
- InsightCallout
- RelatedConcepts
- MethodologySummary

Visualization:
- ComparisonBar
- RangePlot
- DistributionPlot
- ScatterPlot
- Timeline
- LineChart
- Sankey
- MapLegend
- ChartTooltip
- ChartTableFallback
- ChartNarrativeSummary

Every component must define:
- default
- hover
- focus
- active/selected
- disabled
- loading
- missing data
- error
- dark mode
- mobile behavior

---

## 11. Motion System

### Micro-interaction
Typical duration:
- 100–180ms

Use for:
- hover
- focus
- toggles
- button state
- small selection feedback

### UI transition
Typical duration:
- 180–300ms

Use for:
- tabs
- drawers
- bottom sheets
- panel changes

### Educational animation
May be longer when animation itself teaches:
- fission
- decay
- grid flow
- reactor control
- timelines

### Reduced motion
Respect `prefers-reduced-motion`.

When reduced motion is enabled:
- remove decorative parallax
- avoid large transforms
- replace animated teaching sequences with stepped or static alternatives where needed

---

## 12. Data Visualization Grammar

### Bar charts
Use for discrete comparisons.

Rules:
- normally begin at zero
- direct label values when possible
- include unit
- avoid 3D effects

### Line charts
Use for changes over time.

Rules:
- label time range
- make missing periods explicit
- avoid smoothing that implies unavailable observations

### Scatterplots
Use for relationships.

Rules:
- label axes clearly
- expose point metadata
- provide a text/table alternative

### Range/distribution plots
Use when uncertainty or study variation matters.

Rules:
- distinguish min/max from confidence intervals
- distinguish representative estimate from observed distribution
- explain what each interval means

### Pie/donut charts
Avoid by default.
Use only where part-to-whole is the central question.

### Universal chart requirements
- units visible
- source reachable
- data table/text fallback
- no hover-only meaning
- mobile-readable
- uncertainty visible when relevant
- color not sole encoding
- descriptive title
- short interpretation available

---

## 13. Evidence Interaction Language

Every major metric should be able to expose:

- value
- unit
- metric definition
- technology
- geography
- year/period
- source
- publication/version
- methodology
- system boundary
- range
- uncertainty
- last verified
- transformation notes

Primary evidence actions:

### Why this number?
Opens a concise Data Passport.

### Challenge this number
Opens a deeper comparison of:
- source
- alternative studies
- methodology differences
- uncertainty
- known limitations

### View source
Takes user to the original or canonical source.

---

## 14. Content Design

ATOM should distinguish:

- observation
- estimate
- model output
- scenario
- opinion
- uncertainty

Use neutral language.

Avoid:
- “obviously”
- “unquestionably”
- “proves once and for all”
- “completely safe”
- “zero risk”
- “renewables are useless”
- “nuclear solves everything”

Prefer:
- “available evidence suggests”
- “estimates vary because”
- “under this methodology”
- “historically”
- “in this scenario”
- “the main uncertainty is”

---

## 15. Progressive Disclosure

Default to a clear, understandable view.

Offer paths such as:
- Explain simpler
- Go deeper
- Show data
- Show methodology
- Show sources
- Show maths

Do not dump all technical detail into the first screen.

---

## 16. Mobile Behavior

Do not compress desktop layouts mechanically.

Prefer:
- vertical comparison
- stacked charts
- bottom-sheet filters
- full-height evidence sheets
- concise sticky context bar
- large touch targets
- shorter labels with accessible full text

Core information must not require horizontal scrolling.

---

## 17. Accessibility

Minimum requirements:
- WCAG AA contrast
- keyboard navigation
- visible focus
- semantic HTML
- 200% zoom usability
- reduced-motion support
- chart table/text alternative
- screen-reader chart summary
- tooltip content reachable without hover
- 44px touch target where practical
- labels tied to controls
- error messages programmatically associated

---

## 18. Loading, Empty, and Error States

### Loading
Use content-shaped skeletons.

Charts should show chart-shaped skeletons instead of generic spinners where possible.

### Missing evidence
Use:
> We do not currently have reliable comparable data for this metric and technology.

### Methodological incompatibility
Use:
> These estimates use materially different methodologies and should not be interpreted as directly equivalent.

### Source unavailable
Use:
> Source currently unavailable. Showing the last verified value from YYYY-MM-DD.

---

## 19. Design QA Checklist

Before handoff:
- visual hierarchy clear
- primary task obvious
- no unnecessary controls
- mobile behavior intentional
- keyboard flow works
- focus states visible
- data labels legible
- source access available
- uncertainty represented
- empty/loading/error states designed
- dark mode checked
- reduced motion checked
- contrast checked
- no color-only meaning
- no unsupported scientific claim added during design
