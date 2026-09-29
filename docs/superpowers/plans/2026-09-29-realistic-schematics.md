# Realistic schematics implementation plan

Goal: carry the approved cutaway SVG direction through the energy journey, spatial exhibits and existing reactor renderers.

Spec: [approved design](../specs/2026-09-29-realistic-schematics-design.md). The user's September 29 continuation authorizes implementation natively in this session. This requested visual correction precedes N03; the navigation queue remains unchanged.

1. Add a small shared set of SVG materials and mechanical parts under `components/education/schematic/`. Scope gradient IDs per mounted diagram, keep scientific values out of primitives and retain existing public props.
2. Replace `EnergyConversionDiagram` with a PWR cutaway process illustration, including separated primary tubes, secondary steam/feedwater, condenser and cooling circuit. Stage selection highlights the teaching focus; playback controls actual motion. Put readable circuit explanations outside the SVG on mobile. Check qualitative topology against NRC PWR and electricity-generation explanations.
3. Improve `SpatialDiagram`: an electron probability cloud rather than an orbital track, shaded illustrative nucleon clusters, fuel rods with cutaway pellets and metal spacer grids, and state-dependent fission fragments/neutrons. Preserve selection and stage behavior.
4. Apply shared machined-metal surfaces and turbine/generator internals to PWR/BWR/PHWR/SMR/HTGR; preserve component IDs, architecture-specific piping and fallback behavior. Refine generic component inventory without inventing a missing reactor topology. Audit the reactor-control vessel for the same material treatment.
5. Verify unit/component behavior, typecheck, lint, production build, existing experience/reactor journeys and a fresh browser matrix for responsive themes, keyboard operation, reduced motion, pause, accessible text and console/axe errors. Inspect captured diagrams, correct visible defects and record remaining review limits in the delivery tracker.

Review focus: stage changes must preserve controls; multiple SVGs must not share material IDs; paused/reduced-motion views must stop animation; component selection must remain visible; detailed SVG labels need readable HTML alternatives on narrow screens.

Reference: [NRC PWR](https://www.nrc.gov/reactors/power/pwrs) and [NRC electricity generation](https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/how-does-a-nuclear-power-plant-make-electricity), consulted 2026-09-29. Qualitative topology checks are not a recorded independent scientific review. No source metrics or numerical releases change.
