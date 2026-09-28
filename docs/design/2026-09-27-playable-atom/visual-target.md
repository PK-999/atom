# ATOM visual target — restrained dark exhibit room

Date: 2026-09-28  
Status: selected visual direction; N02 implementation slice verified locally  
Selected reference: [selected-option-2.png](selected-option-2.png)

## Intent

ATOM should feel like a quiet science museum after the doors close: one illuminated exhibit, a clear question, and an invitation to inspect how the evidence was assembled. The selected direction uses a deep ink-blue room, warm white type, cyan interaction states and one amber heat cue. The room is atmospheric, but the interaction remains the focus.

The target is a visual language, not a claim about a real plant. Generated and existing reactor artwork stays labeled as conceptual illustration. Engineering explanations continue to use the validated schematic, text and evidence primitives.

## Three directions considered

| Direction                    | Strength                                                                                           | Decision                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Warm museum                  | Ivory paper, teal actions, amber exhibit lighting; closest to the current homepage                 | Retained as the light-theme companion                                |
| Restrained dark exhibit room | Deep gallery canvas, one illuminated object, compact energy path and evidence affordance           | **Selected for the primary dark target**                             |
| Editorial atom-to-city story | A horizontal atom → heat → steam → motion → electricity narrative with an editorial reading rhythm | Deferred until the first learning journey has reviewed source labels |

## Layout targets

The selected target is specified at 1440×900 and 390×844. The same hierarchy applies to the first journey surfaces:

| Surface             | Desktop                               | Mobile                              | Required hierarchy                                                         |
| ------------------- | ------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| Home                | Split hero: copy / one exhibit        | Copy above exhibit                  | Headline, start action, compare action, one playable energy path           |
| Fission             | Narrow reading column inside the room | Single column                       | Prediction, replayable exhibit, explanation, source/checkpoint             |
| Comparison          | Workspace with evidence sheet         | Stacked controls and result         | Question, selection, result state, method/source drawer                    |
| Claim investigation | One open claim with supporting rows   | One open claim at a time            | Claim, verdict context, explanation, sources, next experiment              |
| India               | Editorial evidence story              | Stacked story and scenario controls | Reviewed baseline first; scenario controls only after evidence is released |

## Tokens and behavior

- Canvas: deep ink-blue/charcoal in the selected dark target; preserve the warm ivory light theme.
- Text: warm white for primary reading, cool gray for supporting copy, muted sand for exhibit labels.
- Interaction: cyan for focus, selected steps and links; amber marks heat or energy transfer only.
- Surfaces: one hero room and one exhibit surface; use borders and spacing before shadows.
- Motion: a short, purposeful step transition for the energy path; `prefers-reduced-motion` keeps the same controls and final states without autoplay.
- Sound: off by default, gesture-gated and optional; never required to understand the exhibit.
- Evidence: keep an `Explore the evidence` affordance adjacent to the interaction. Sources, assumptions and limitations remain reachable without changing the experiment.

## Captured implementation frames

These are fresh production-build captures from the current ATOM journey, not reference substitutes:

- [Home light 390](frames/home-light-390.png)
- [Home light 1440](frames/home-light-1440.png)
- [Home dark 390](frames/home-dark-390.png)
- [Home dark 1440 current](frames/home-dark-1440-current.png)
- [Fission dark 1440](frames/fission-dark-1440.png)
- [Comparison light 390](frames/comparison-light-390.png)
- [Claims light 1440](frames/claims-light-1440.png)
- [Selected reference normalized 1440](frames/selected-option-2-normalized-1440.png)
- [Selected implementation dark 1440](frames/home-dark-1440-viewport-v2.png)
- [Selected implementation dark 390](frames/home-dark-390-selected-v2.png)

The selected mock is a direction reference. It is not a measurement, plant drawing, India forecast or evidence record.
