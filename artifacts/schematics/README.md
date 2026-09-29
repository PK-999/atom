# Schematic refinement verification — 2026-09-29

Visual target: the user requested more realistic versions of the supplied flat energy-path schematic, then approved the SVG cutaway approach. See `docs/superpowers/specs/2026-09-29-realistic-schematics-design.md` and the corresponding implementation plan.

Implemented surfaces: homepage energy conversion; atom, fuel and fission exhibits; PWR, BWR, PHWR, SMR and HTGR schematics; shared materials for the generic reactor component inventory; reactor-control vessel materials. Mechanical parts are reusable React SVG components. No raster payloads, dependencies or domain-model parameters were introduced.

## Visual review

The supplied reference showed a rod icon, a coil, a fan and a lightning symbol with one-way arrows. The revised energy plate shows steel vessels, fuel and tube bundles, axial turbine blades, copper generator windings, condenser tubes and differentiated return circuits. Its qualitative PWR topology was checked against [NRC PWR guidance](https://www.nrc.gov/reactors/power/pwrs) and [NRC electricity generation](https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/how-does-a-nuclear-power-plant-make-electricity). This is not a new scientific release or independent engineering approval.

The full overview remains small on a phone, so a keyboard-operable equipment inspector enlarges the selected machine. The inspector uses the same component as the overview with separate SVG resource IDs. Circuit explanations remain readable HTML below the drawing. Atom drawings use a diffuse probability cloud; fuel drawings show cladding, pellets and spacer grids; fission uses sampled nucleon clusters rather than flat discs. The sampled dots are not an isotope inventory.

Reactor renderers preserve their existing topology and component IDs while sharing turbine/generator/condenser cutaways and metal gradients. SMR/HTGR turbine casings no longer rotate as whole objects. Existing architecture-specific limitations are not resolved by an illustration upgrade. Generic views are explicitly component inventories, not newly invented plant layouts.

Typography: existing site font and compact labels; HTML descriptions and controls are the reading surface on small screens. Colors: ink-blue exhibit field, steel/copper materials and named circuit legends; selection and focus remain visible. Spacing: equipment labels checked in focused captures; the initial condenser-label overlap was corrected. Image quality: vector internals stay sharp in the new equipment inspector; no generated artwork is presented as diagram evidence.

## Captures

Files ending `-390.png` and `-1440.png` are generated from production-browser tests at 390×900 and 1440×900 CSS viewports, device scale factor 1, dark theme, reduced motion. These are element crops; file dimensions therefore follow the diagram's rendered box rather than the entire viewport. Sticky header descendants are hidden only during screenshot capture to prevent occlusion; behavior/accessibility checks run on the unmodified page.

- `energy-inspector-*`: energy overview and expanded reactor-vessel inspector.
- `atom-*`, `fuel-*`, `fission-*`: spatial exhibits; fuel exploded and fission split states.
- `pwr-*`, `bwr-*`, `phwr-*`, `smr-*`, `htgr-*`, `fbr-*`: keyboard-selected first component in each view.
- Unsuffixed or `energy-desktop/mobile` files record the first implementation pass, before final label/material/inspector corrections. Use the suffixed captures for acceptance.

## Iterations and limits

1. Added cutaway equipment and full circuits; mobile inspection showed that overview detail needed magnification.
2. Added native expandable equipment inspector. Visual inspection caught incomplete internals in the SVG `use` rendering; replaced cloning with direct shared-component rendering.
3. Fixed the browser capture selector to exclude Activity-hidden tabs; this was a test-harness timeout, not a route failure. The initial existing-suite Firefox navigation timeout passed in the subsequent complete 69-test run.
4. Removed SVG ID collisions across reactor instances with a failing-then-passing regression. Scoped reactor-control material IDs too. Completed missing reduced-motion selectors for delayed steam/plume animation.

Remaining: independent scientific/editorial review, manual assistive-technology and native 200% zoom testing, and deployed-device performance. Images are conceptual and not to scale. No public evidence status or deployment changed.

Final command counts and acceptance are recorded in `docs/product/DELIVERY-TRACKER.md`.
