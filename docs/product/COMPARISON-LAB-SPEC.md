# ATOM — Energy Comparison Lab Specification

## 1. Purpose

The Energy Comparison Lab allows visitors to compare electricity technologies across environmental, reliability, economic, human-impact, material, and energy-security metrics while inspecting the evidence and assumptions behind every result.

Its purpose is exploration, not ranking technologies into simplistic winners and losers.

---

## 2. Core User Promise

> Compare energy technologies. Understand the trade-offs. Inspect the evidence.

---

## 3. Success Criteria

The feature succeeds when:

- a first-time visitor can compare technologies without setup
- a casual visitor understands the main takeaway
- a student can inspect definitions and methods
- a technical visitor can view ranges or study-level data
- a skeptical visitor can inspect alternative studies
- all major claims expose provenance
- mobile users receive a complete experience
- comparisons can be shared by URL
- uncertainty and methodological limits are visible

---

## 4. Primary User Stories

### Casual visitor
As a casual visitor, I want to compare nuclear and solar so I can understand their major trade-offs.

### Student
As a student, I want to understand where lifecycle-emission numbers come from.

### Technical visitor
As a technical visitor, I want to inspect the range, assumptions, and source metadata.

### Skeptical visitor
As a skeptical visitor, I want to inspect alternative studies rather than accept one selected number.

### Mobile visitor
As a mobile visitor, I want the comparison to remain understandable without horizontal scrolling.

---

## 5. First-Visit Default

Do not show an empty configuration.

Default energy sources:
- Nuclear
- Solar
- Wind
- Gas
- Coal

Default metric:
- Lifecycle greenhouse-gas emissions

Default geography:
- Global

Default display mode:
- Typical

Default explanation level:
- Curious

---

## 6. Page Anatomy — Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ ENERGY COMPARISON LAB                                      │
│ Compare how electricity technologies perform.              │
│                                                            │
│ [Nuclear ✓] [Solar ✓] [Wind ✓] [Gas ✓] [Coal ✓] [+ Add]  │
├──────────────────────────────────────────────────────────────┤
│ Metric        Geography       Display         Units         │
│ [CO₂ ▼]       [Global ▼]      [Typical]       [Scientific]  │
│                               [Range]                        │
│                               [Raw]                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    INTERACTIVE CHART                         │
│                                                              │
│ Nuclear    ███                                                │
│ Solar      ███████                                            │
│ Wind       ███                                                │
│ Gas        ███████████████                                    │
│ Coal       █████████████████████████                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ WHAT THIS MEANS                                              │
│ Short evidence-grounded explanation.                         │
│ [Explain simpler] [Go deeper]                                │
├──────────────────────────────────────────────────────────────┤
│ WHY THESE NUMBERS?                                           │
│ Metric cards / evidence cards                                │
│ [Why this number?] [Challenge this number]                   │
├──────────────────────────────────────────────────────────────┤
│ RELATED METRICS                                              │
│ Land • Reliability • Construction time • Waste               │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Metric Categories

Avoid a single giant dropdown.

### Environment
- Lifecycle greenhouse-gas emissions
- Land use
- Water withdrawal
- Water consumption
- Material requirements
- Mining/material intensity
- Waste volume
- Waste persistence/toxicity where methodologically defensible

### Reliability and Grid
- Capacity factor
- Dispatchability
- Variability
- Firm capacity / capacity credit where defensible
- Storage dependence where scenario-based

### Economics
- Capital cost
- Operating cost
- Fuel cost
- LCOE
- Construction duration
- Plant lifetime
- Decommissioning cost where comparable
- Financing sensitivity where modeled

### Human Impact
- Mortality per unit electricity
- Air-pollution impacts
- Occupational impacts
- Accident risk
- Evacuation/displacement where methodologically appropriate

### Energy Security
- Fuel energy density
- Fuel stockpiling potential
- Import dependency
- Supply-chain concentration

### Technical
- Power density
- Thermal efficiency
- Refueling cycle
- Typical unit capacity

Not every metric will support every technology.

Missing comparable evidence must be shown honestly.

---

## 8. Comparison Modes

### Typical
Shows one representative value.

Use for:
- Kid
- Simple
- Curious

Representative values must be methodologically justified.

### Range
Shows:
- min
- representative value
- max

or:
- confidence/credible interval where that is what the source provides

The interface must label which kind of range is being shown.

### Raw
Shows individual study observations or source-level values where licensing and data quality permit.

Use for:
- Technical
- Expert

---

## 9. Energy Source Selection

Users can:
- add
- remove
- reorder
- restore defaults

Desktop:
- chips or compact multi-select
- searchable add menu

Mobile:
- compact summary row
- bottom sheet for selection

Do not exceed a visual limit that makes charts unreadable.
If the user selects too many sources:
- switch to table view
- or explain that fewer technologies improve readability

---

## 10. Metric Selection

Desktop:
- searchable command-style menu grouped by category

Mobile:
- bottom sheet with:
  - search
  - categories
  - recent metrics
  - related metrics

Each metric entry may show:
- name
- unit
- short definition

---

## 11. Geography and Time

Support a geography filter only where source data supports it.

Possible options:
- Global
- Country
- Region

Do not imply geography specificity if underlying data is global-only.

If a metric is only available globally:
> Country-level evidence is not available for this metric. Showing global evidence.

Time:
- display applicable year/period clearly
- allow historical view only for metrics with real time-series support

---

## 12. Units

Support:

### Scientific
Examples:
- gCO₂e/kWh
- deaths/TWh
- m²/GWh
- USD/kW

### Human-friendly
Examples may translate into:
- annual household electricity equivalents
- football-field-sized land analogies only where defensible
- material per 100,000 homes
- emissions per household-year

Human-friendly units must never replace access to scientific units.

---

## 13. Chart Behavior

The primary chart changes based on metric semantics.

Examples:
- discrete metric → horizontal comparison bars
- uncertainty → range plot
- relationship view → scatterplot
- time series → line chart

Universal requirements:
- visible units
- direct labels where possible
- source access
- text summary
- table fallback
- keyboard access
- no hover-only meaning
- screen-reader summary
- responsive layout
- no hidden truncated labels

---

## 14. “What This Means” Panel

Every chart includes a concise interpretation.

At L3 Curious:
- 2–4 short sentences
- explain largest differences
- mention uncertainty when important
- avoid prescribing a policy conclusion

Actions:
- Explain simpler
- Go deeper
- Show methodology

---

## 15. Complexity-Level Behavior

### L1 — Kid
- descriptive labels first
- illustrations or simple comparison bars
- minimal notation
- “show number” affordance
- short analogy
- no expert controls by default

### L2 — Simple
- plain-English metric name
- representative values
- short summary

### L3 — Curious
- full standard chart
- values and units
- source summary
- evidence card access

### L4 — Technical
- ranges
- methodology
- assumptions
- study notes
- additional filters

### L5 — Expert
- raw observations
- source metadata
- system boundaries
- transformation details
- data download where allowed

Changing level must preserve current comparison configuration.

---

## 16. Data Passport

Clicking “Why this number?” opens a concise evidence drawer.

Fields:
- Metric
- Value
- Unit
- Technology
- Geography
- Year/period
- Source
- Publication/version
- Method
- System boundary
- Range
- Uncertainty note
- Last verified
- Transformation summary

Actions:
- View source
- Challenge this number
- Show methodology

---

## 17. Challenge This Number

This is a signature interaction.

The panel should show:

### Representative value
The value displayed in the chart.

### Study/source range
A visual distribution or range where available.

### Primary source
Why it was selected.

### Alternative evidence
Relevant studies or datasets.

### Why values differ
Examples:
- system boundary
- financing assumptions
- geography
- plant lifetime
- enrichment assumptions
- fuel grade
- discount rate
- technology age
- inclusion/exclusion rules

### Known limitations
Explicitly stated.

The interaction should not imply that disagreement means “nobody knows.”

---

## 18. URL State

Comparison state should be shareable.

Conceptual shape:

```text
/compare?
sources=nuclear,solar,wind
&metric=lifecycle-emissions
&region=global
&mode=range
&units=scientific
&level=curious
```

Requirements:
- page refresh preserves state
- browser back/forward works
- invalid params fail gracefully
- shared links recreate the comparison
- canonical SEO pages can map to common comparisons

---

## 19. Mobile Design

Do not horizontally compress the desktop chart.

Preferred structure:

```text
Energy Comparison

[Nuclear] [Solar] [+3]

Lifecycle emissions ▼

Nuclear
12
████

Wind
11
███

Solar
40
████████

Gas
...

[What does this mean?]

[Explore evidence]
```

Filters:
- bottom sheet

Evidence:
- full-height sheet

Chart:
- vertical or stacked

Table:
- accessible alternate view

---

## 20. Loading States

Use content-shaped skeletons.

Chart skeleton should suggest:
- labels
- bars/ranges
- legend/controls

Avoid generic full-screen spinner.

---

## 21. Missing Data

Use explicit language.

Example:
> We do not currently have reliable comparable data for this technology and metric.

Offer:
- remove technology
- choose another metric
- inspect source limitations

---

## 22. Methodological Mismatch

When values are not directly comparable:

> These estimates use materially different methodologies and should not be interpreted as directly equivalent.

Optionally show:
- why
- which boundaries differ
- what would be required for fair comparison

---

## 23. Accessibility Acceptance Criteria

- all controls keyboard accessible
- visible focus
- semantic control labeling
- chart table alternative
- chart screen-reader summary
- no hover-only critical information
- WCAG AA contrast
- no color-only meaning
- usable at 200% zoom
- reduced motion respected
- target sizes around 44px where practical
- bottom sheets trap/restore focus correctly
- drawers/modals labeled correctly

---

## 24. Analytics Events

Recommended privacy-conscious events:

- `comparison_opened`
- `energy_source_added`
- `energy_source_removed`
- `metric_changed`
- `geography_changed`
- `display_mode_changed`
- `units_changed`
- `source_opened`
- `data_passport_opened`
- `number_challenged`
- `complexity_changed`
- `comparison_shared`
- `table_view_opened`

Avoid collecting unnecessary personal data.

---

## 25. Edge Cases

Handle:
- no metric data
- partial metric data
- one selected technology
- too many technologies
- incompatible units
- incompatible system boundaries
- source unavailable
- stale cached data
- invalid URL params
- zero values
- negative values where legitimate
- extremely large ranges
- study outliers
- mobile viewport
- reduced-motion mode
- high zoom

---

## 26. Testing

### Unit
- URL state parser
- unit conversions
- metric formatting
- range calculations
- sorting
- filtering
- representative-value logic

### Component
- metric selector
- source selector
- Data Passport
- challenge panel
- complexity selector

### Integration
- URL state persistence
- comparison switching
- mode switching
- evidence drawer
- mobile filters

### E2E
Core journey:
1. open Comparison Lab
2. remove Coal
3. add Hydro
4. change metric
5. switch to Range
6. open a Data Passport
7. open Challenge This Number
8. copy/share URL
9. reload
10. verify state

### Accessibility
- axe
- keyboard-only
- focus order
- screen-reader labels
- zoom
- reduced motion

---

## 27. Definition of Done

Comparison Lab is not complete until:

- desktop complete
- tablet complete
- mobile complete
- light mode complete
- dark mode complete
- URL state works
- shareable links work
- evidence drawers work
- Challenge This Number works
- loading state exists
- empty state exists
- missing-data state exists
- method-mismatch state exists
- keyboard access works
- reduced motion works
- table fallback exists
- unit tests pass
- integration tests pass
- E2E tests pass
- no console errors
- production build passes
- accessibility target met
- browser verification completed
