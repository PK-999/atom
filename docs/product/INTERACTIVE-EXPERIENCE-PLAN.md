# ATOM Interactive Experience Plan

## Purpose

ATOM should feel like a modern, interactive science museum about atoms, nuclear
energy, and electricity systems. Visuals, motion, sound, and simulation should
help a learner form a mental model; they should not decorate an otherwise
unchanged page or make evidence harder to inspect.

The theme is **the atom as a system**: particles, forces, energy flows, control,
and scale. It is not radioactive neon, a weapons aesthetic, or a fictional
control room. The presentation remains calm, optimistic, and scientifically
serious.

## Experience rules

1. Every major page should offer one memorable visual or interactive idea.
2. Every interaction must teach, compare, orient, or reveal causality.
3. The same reviewed evidence powers every complexity level.
4. Animation must have a static state and respect reduced-motion preferences.
5. Sound is optional, muted by default, user-initiated, and never the only way
   to communicate a result.
6. Every chart, canvas, and simulation has a text or table alternative.
7. Serious subjects such as accidents, casualties, waste, and displacement use
   restrained presentation without playful sound or celebration.
8. Mobile receives the complete learning idea, not a reduced desktop demo.
9. A page should load its expensive visual code only when the learner opens it.
10. Prefer a few reusable systems over one-off visual effects.

## Visual language

### Core motif

Use orbit, field, lattice, containment, and energy-flow geometry as a shared
graphic vocabulary. A subtle nucleus/orbit mark can identify interactive entry
points, while line weight, labels, and scale establish scientific clarity.

The visual palette should use deep ink and warm paper surfaces with restrained
cyan, violet, and amber accents. Energy-source colors retain their existing
semantic meaning. Glows are reserved for active energy flow or focus—not card
borders and ambient decoration.

### Reusable graphic families

- **Particle diagrams:** atoms, isotopes, neutron capture, fission products,
  decay, and radiation interactions.
- **Flow diagrams:** reactor heat loops, turbine generation, grid delivery,
  fuel cycles, and waste pathways.
- **Scale journeys:** nucleus-to-reactor, microsievert-to-sievert, pellet-to-city,
  and seconds-to-geological time.
- **Evidence graphics:** annotated bars, ranges, distributions, timelines, and
  maps with reachable sources.
- **India graphics:** electricity-demand growth, state and fleet maps, industrial
  load shapes, land and material scale, and alternative system portfolios.

Prefer SVG and CSS for diagrams and transitions. Use Canvas or WebGL only for
dense particle systems, the globe, or a three-dimensional model that teaches
spatial structure better than a labeled two-dimensional schematic.

## Motion and transitions

Use three motion layers:

- **Interface motion (100–250 ms):** focus, hover, tab, drawer, selection, and
  state-change feedback.
- **Explanatory motion (300–900 ms):** energy transfer, control-rod movement,
  chart reordering, and cause-to-effect transitions.
- **Learner-controlled sequences:** fission, decay, reactor startup, accident
  timelines, and grid dispatch. These pause, replay, step, and scrub.

Route changes may use a short shared fade/translate transition, but content must
remain immediately usable and browser navigation must remain conventional.
Avoid scroll hijacking, perpetual particle backgrounds, parallax on reading
pages, and animation that competes with quantitative evidence.

With `prefers-reduced-motion`, replace spatial movement with instant state
changes, opacity changes, or a user-controlled step sequence. Never animate
flashes at unsafe frequencies.

## Sound design

Sound is an enhancement, not an ambient soundtrack.

- Start muted and expose one global sound toggle near other preferences.
- Create a small sound palette: soft selection tick, successful connection,
  subdued reactor-state hum, turbine ramp, and simulation warning.
- Play audio only after explicit user interaction and remember the preference.
- Provide independent volume and a clear stop control for sustained sound.
- Suspend audio when the tab is hidden and release audio resources when the
  experience closes.
- Pair every sound with visual and textual state feedback.
- Do not use sound effects on accident, casualty, radiation-harm, or waste-risk
  narratives.

Use the Web Audio API through one small adapter rather than introducing a large
audio framework. Generate simple tones procedurally where possible; any sampled
audio must record its license and attribution.

## Signature interactive journey

The first complete journey should connect existing capabilities rather than add
another disconnected destination:

1. **Homepage — Power a future:** choose a learning level and adjust a simple
   electricity-demand dial. A restrained animated atom becomes a turbine and
   then a city grid, introducing energy conversion and scale.
2. **Learn — Split an atom:** predict what happens, fire one neutron, slow the
   sequence down, label the products, and connect released energy to mass
   defect. The existing fission model remains the source of behavior.
3. **Control a reactor:** move control rods and observe multiplication, heat,
   and delayed response. Show explicit model boundaries; do not present a toy
   model as operator training.
4. **Compare the system:** use the Comparison Lab to inspect lifecycle carbon,
   reliability, construction time, land, and separate cost measures. Every
   result opens its evidence passport.
5. **Power India:** assemble alternative low-carbon portfolios for a transparent
   demand scenario. Compare nuclear-inclusive and non-nuclear cases without
   declaring a universal winner.
6. **Test a claim:** open a myth or debate as a structured investigation with
   supporting, challenging, and contextual evidence.
7. **Choose the next path:** continue through fundamentals, climate, safety and
   radiation, engineering, economics, or India's energy future.

## Simulator set

Build and release simulators as reusable lesson blocks, not isolated games:

| Simulator | Learner action | Concept taught | Accessible alternative |
| --- | --- | --- | --- |
| Atom builder | Change protons and neutrons | Element, isotope, and stability | State table and narrated result |
| Fission chain | Add/absorb/slow neutrons | Multiplication and criticality | Step log and count table |
| Half-life lab | Advance or scrub time | Probabilistic decay | Remaining-quantity table |
| Reactor control | Move rods and change demand | Feedback, lag, and shutdown | Time-series table and summary |
| Radiation scale | Compare dose and dose rate | Scale and exposure context | Ordered list with units |
| Heat-to-grid | Trace energy through components | Conversion and efficiency | Labeled process steps |
| Grid builder | Change supply and demand | Firmness, variability, and storage | Hourly balance table |
| India pathways | Change transparent assumptions | Portfolio trade-offs | Scenario assumptions/results table |

Each simulator needs a prediction prompt, one primary control, an observable
result, an explanation, a reset, a shareable preset where useful, sources, and
model limitations. Advanced controls appear progressively instead of crowding
the first view.

## Simple architecture

Keep the existing Next.js application and current domain boundaries. Do not add
a new service, game engine, global state framework, or animation framework just
to deliver this direction.

```text
reviewed content/evidence
        ↓
framework-independent domain model
        ↓
small React interactive block
        ↓
SVG/CSS first; Canvas/WebGL only when justified
        ↓
text/table alternative
```

Use four reusable foundations:

1. `InteractiveFigure`: title, instructions, reset, pause/play, status, reduced
   motion, and accessible alternative.
2. `SimulationFrame`: prediction, controls, result, explanation, limitations,
   and sources.
3. `AtomDiagram`: shared SVG primitives for particles, bonds, vessels, flows,
   labels, and annotations.
4. `SoundController`: global opt-in preference and lazy Web Audio lifecycle.

Keep state local to an interaction unless it must be shared in a URL. Persist
only user preferences and learning progress. Scientific values and calculations
remain outside React components. Lazy-load Three.js and other heavy code only on
routes that need it.

## Delivery sequence

### 1. Foundations

- Reconcile the missing audit, delivery tracker, and recovery plan before
  implementation.
- Inventory existing diagrams and simulators; retain domain logic that is tested
  and identify duplicate presentation code.
- Create a visual storyboard for the signature journey at mobile and desktop
  sizes.
- Define motion, reduced-motion, and sound tokens in the design system.

### 2. Reusable interaction shell

- Implement `InteractiveFigure`, `SimulationFrame`, `AtomDiagram`, and the
  muted-by-default `SoundController`.
- Add component tests for keyboard operation, pause/reset, sound preference,
  reduced motion, and the accessible alternative.
- Add one gallery page available only in development for visual QA.

### 3. One polished lesson

- Rebuild the fission lesson around the existing fission simulator and shared
  primitives.
- Provide genuinely different guidance at all five levels without changing the
  scientific model.
- Complete scientific, editorial, accessibility, responsive, performance, and
  browser review before copying the pattern.

### 4. Memorable homepage

- Replace the feature-card-first presentation with the “Power a future” visual
  story and three clear next actions: learn, compare, and investigate.
- Keep the first render lightweight; load interactive code after intent or when
  it enters the viewport.
- Use sound only after the learner opts in.

### 5. Connected curriculum

- Embed the remaining existing simulators in their appropriate lessons.
- Add Atom Builder and Heat-to-Grid only after the shared lesson pattern is
  proven.
- Introduce learning paths, progress, and resume behavior without duplicating
  canonical lesson routes.

### 6. Evidence flagship and India pathway

- Finish the Comparison Lab's governed evidence states and accessible table.
- Build India Pathways from reviewed national inputs and the existing simulator
  architecture.
- Publish claims only after separate scientific, editorial, and licensing
  review.

### 7. Site-wide polish

- Apply the shared visual grammar to reactors, radiation, incidents, myths,
  debates, sources, and the globe.
- Remove decorative effects or bespoke implementations that do not support the
  shared system.
- Run full mobile, keyboard, zoom, theme, reduced-motion, sound, performance,
  and browser verification.

## Performance budget

- Static educational pages should not load Three.js, globe data, audio samples,
  or simulator code.
- Prefer SVG illustrations below the fold and lazy-load complex interactives.
- Target smooth interaction on a representative mid-range mobile device.
- Pause animation outside the viewport and when the document is hidden.
- Avoid a permanent animated background and cap simultaneous animated elements.
- Measure layout shift and interaction responsiveness for every signature page.

## Release gate

An interactive feature is releasable only when:

- its learning objective and model limitation are visible;
- its scientific model has unit tests;
- quantitative outputs have governed evidence;
- it works with keyboard and touch;
- its visual meaning is available as text or a table;
- it works with reduced motion;
- sound is optional, muted initially, and redundant with visible feedback;
- mobile retains the complete learning outcome;
- loading, empty, unavailable, incompatible, and error states are explicit;
- browser verification finds no console, hydration, accessibility, or severe
  performance failures.

