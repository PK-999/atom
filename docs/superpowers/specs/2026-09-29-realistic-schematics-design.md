# ATOM realistic schematic system

Date: 2026-09-29  
Status: implementation authorized by the user's September 29 continuation  
Scope: energy journey, spatial exhibits and reactor architecture schematics

## Problem

ATOM's diagrams communicate the right broad relationships, but several surfaces still read as icon diagrams: equipment has limited depth, loops are easy to confuse, and internal engineering features are represented by single strokes or generic shapes. The result is visually playful but less credible than the surrounding evidence-first product.

The requested change is to make the schematic family feel closer to a carefully illustrated technical exhibit while keeping the product's calm museum tone, accessible SVG rendering and explicit conceptual framing.

## Goal

Make every schematic feel like a coherent cutaway/process plate that a curious visitor can inspect, animate and understand at a glance:

- The energy journey should show a recognizable pressurized-water reactor process with separated primary, secondary and cooling circuits.
- Spatial exhibits should use more believable atomic, fuel-assembly and fission structures.
- PWR, BWR, PHWR, SMR and HTGR views should share a visual grammar while preserving each architecture's actual topology and reviewed descriptions.
- Existing selection, playback, keyboard, reduced-motion and fallback behavior must remain intact.

## Non-goals

- Do not present generated artwork as measured engineering geometry, a plant drawing, a site plan or a performance model.
- Do not add new numerical values, temperatures, pressures or efficiency claims unless they already come from reviewed repository data.
- Do not replace accessible SVG with raster or 3D-only artwork.
- Do not add a new animation, chart or rendering dependency.
- Do not change evidence release status, lesson URLs, route structure or the one-reading experience.

## Visual direction

The schematic family uses a shared technical-exhibit language:

- Deep ink-blue panels with warm neutral equipment bodies and restrained cyan, amber, red and green circuit accents.
- Material cues through SVG gradients, double-line pipe walls, inner fluid strokes, flange rings, bolts, tube banks, rotor stages and cutaway hatching.
- A clear z-order: civil envelope, pipes/flows, equipment, internal cutaway detail, labels and selection halo.
- Direct labels with short names and a small legend for circuit meaning. Labels never rely on color alone.
- Flow animation shows causality, not decoration: fluid dashes follow the existing model direction, rotors turn only when the current power state allows it, and reduced motion freezes the final state.
- Every surface keeps a nearby “conceptual / not to scale” statement where the diagram could otherwise be mistaken for a plant plan.

## Scientific and content boundaries

The PWR energy plate will show these relationships without claiming scale:

```text
reactor pressure vessel
  → primary hot leg / steam-generator tubes
  → secondary steam
  → high-pressure and low-pressure turbine stages
  → synchronous generator
  → condenser and feedwater return
  → secondary loop

condenser ↔ tertiary cooling-water loop ↔ cooling tower / heat sink
```

The primary and secondary circuits must remain visibly separate. BWR, PHWR, SMR and HTGR schematics must keep their existing architecture-specific distinctions, including direct-cycle steam where applicable, heavy-water/pressure-tube topology, integral SMR equipment and helium/steam-generator relationships. Visual refinement cannot silently turn one reactor type into another.

## Component architecture

Use small, framework-independent SVG helpers where practical and keep domain truth in the existing reactor model:

- A shared schematic primitive layer owns equipment shells, pipe walls, fluid strokes, arrows, labels, cutaway hatching, selection rings and material gradients.
- `EnergyConversionDiagram` composes those primitives into the PWR process plate and receives only the existing `stage` value.
- `SpatialDiagram` composes primitives for atom, fuel and fission exhibits and keeps the existing `kind`, `stage` and `selected` contract.
- Reactor-specific renderers continue to own topology and component IDs; they reuse the primitive layer and `SchematicParts` callbacks instead of duplicating visual treatments.
- The generic fallback remains legible and explicitly conceptual when a reactor architecture has no specialized renderer.

No scientific value is hard-coded in a presentational primitive. Existing labels and descriptions remain the source of truth; visual components only render them.

## Interaction and accessibility

- Existing component buttons remain keyboard reachable with visible focus and `aria-pressed` state.
- Selecting a component changes a high-contrast outline/halo and preserves the current explanatory panel.
- Hover-only detail is not introduced. Important labels and circuit meaning remain visible or available to keyboard users.
- The SVG receives a meaningful accessible name and keeps a text-equivalent caption below it.
- The diagram remains usable at 320px, 390px, tablet and desktop widths without horizontal document overflow.
- `prefers-reduced-motion` disables fluid dash, rotor, glow, bubble, spark and plume animation while preserving the same state and selected component.

## Verification contract

The implementation is accepted only when:

- Component tests assert the energy journey's circuit labels, stage labels and conceptual disclaimer, plus spatial diagram accessible names and state changes.
- Existing reactor tests still cover architecture-specific components and selection behavior.
- Typecheck, lint, unit tests and production build pass.
- Browser verification covers Home, spatial exhibits and at least PWR, BWR and PHWR at 320px, 390px and 1440px in light/dark themes, with reduced motion on one mobile state.
- Browser checks confirm no page errors, no horizontal overflow, keyboard activation of a component, readable focus, and no Axe violations.
- Fresh screenshots compare the revised energy journey and reactor schematic against the current visual target; remaining differences are classified as intentional P3 polish rather than hidden.

## Review risks

1. More realism can accidentally imply measured geometry. Keep conceptual framing, avoid invented dimensions and retain source-backed text.
2. More detail can make mobile labels unreadable. Prefer direct short labels, responsive omission of secondary annotations and the existing caption/details below the SVG.
3. Shared primitives can erase architecture-specific differences. Keep topology and component IDs in each renderer and review each reactor type separately.
4. SVG gradients and filters can become heavy. Keep definitions shared, avoid per-frame allocations, and confirm the existing reduced-motion and fallback paths remain fast.

## Acceptance outcome

The diagrams should look materially more like technical museum plates: believable equipment and loops, visible circuit separation, better internal detail and purposeful flow animation. They should remain honest illustrations and retain the existing interactive contracts.
