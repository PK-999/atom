# Complexity Behavior

## Levels

| Level | Default presentation | Evidence access |
| --- | --- | --- |
| Kid | Descriptive labels, simple bars, short analogy, minimal notation | Scientific value and source remain available on demand |
| Simple | Plain language, representative values, short summary | Definition, scientific unit, and source remain available |
| Curious | Complete standard chart, direct values, context and uncertainty | Data Passport and methodology summary |
| Technical | Ranges, assumptions, study notes, additional filters | Study comparison and transformations |
| Expert | Raw observations, detailed boundaries, equations where useful | Full permitted metadata and data download |

## Precedence and Persistence

1. A valid `level` URL parameter controls the current page.
2. Otherwise, use the locally stored preference.
3. Otherwise, default to `curious`.

Changing level updates the URL and local preference without a page reload. It preserves selected technologies and ordering, metric, geography, display mode, and unit mode. If a lower level receives a Raw comparison URL, the raw observations remain visible with simpler orientation text; changing complexity never silently changes evidence or display state.

## Content Rules

- Explanations change density, vocabulary, notation, and control visibility, never the underlying observations.
- “Explain simpler” moves down one level; “Go deeper” moves up one level.
- Advanced controls may be hidden until requested, but active advanced state remains visible and operable.
- Expert content adds method and data depth rather than merely increasing word count.
- Definitions and scientific values remain reachable from all levels.
