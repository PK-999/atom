# Comparison Lab Visual Direction

Date: 2026-08-30
Status: approved

## Decision

ATOM will use the selected **Digital Science Museum** direction for the
Comparison Lab, tempered by the restraint and typographic clarity of the
Scientific Editorial exploration.

The approved visual truth is:

- `docs/design/references/comparison-lab-digital-science-museum.png`

This reference is a direction, not a source of scientific truth. Values shown
while the evidence platform is unfinished must be supplied by a domain fixture,
visibly marked as preview data, and must not be presented as published ATOM
evidence.

## Intended Outcome

The first screen should let a visitor understand a useful five-technology
lifecycle-emissions comparison immediately, then inspect the evidence behind a
value without losing the comparison context.

The interface should feel like a premium digital science exhibit: immersive,
calm, tactile, legible, and intellectually serious. It must not feel like an
advocacy campaign, an energy-company dashboard, or a neon science-fiction UI.

## Direction Principles

1. The chart is the exhibit centerpiece.
2. Evidence access is a primary action, not a footnote.
3. Large type and whitespace establish orientation before controls.
4. Warm reading surfaces sit within a deep mineral environment.
5. Color identifies energy sources only when paired with labels and shapes.
6. Mobile is recomposed as a guided vertical exhibit.
7. Complexity changes explanation and control depth, never evidence.
8. Motion is limited to state and orientation feedback.

## Rejected Alternatives

### Scientific Editorial

Strengths: strongest reading rhythm, evidence tone, and restraint.

Reason not selected: the interaction model feels closer to a publication than
an exploratory flagship product. Its restraint remains an explicit influence.

### Data Laboratory

Strengths: strongest auditability, density, and technical control hierarchy.

Reason not selected: its workbench framing is too technical and dashboard-like
for the default Curious experience. It may inform L4/L5 views later.

## Visual Tokens

### Dark exhibit palette

- `--surface-canvas`: deep mineral navy
- `--surface-panel`: slightly lighter navy
- `--surface-reading`: warm off-white
- `--text-primary`: warm white on dark surfaces
- `--text-reading`: near-black on reading surfaces
- `--text-muted`: cool gray-blue
- `--border-subtle`: low-opacity cool white
- `--interactive-primary`: periwinkle
- `--interactive-focus`: pale violet with a dark offset ring

### Light palette

The light theme keeps the same hierarchy using a warm ivory canvas, white
reading surfaces, near-black text, cool blue-gray borders, and periwinkle
interaction accents. It is a designed counterpart, not an inverted dark theme.
This slice implements and verifies the dark museum canvas only; the light
counterpart is explicitly deferred to the Stage 4 application-shell token work.

### Energy sources

- Nuclear: lavender plus circle marker
- Solar: amber plus square marker
- Wind: turquoise plus triangle marker
- Gas: blue plus diamond marker
- Coal: cool gray plus pentagon-like library icon where available

Every source remains identifiable by text when its color or marker is absent.

### Typography

- Primary UI and display: Geist Sans, self-hosted through `next/font`
- Scientific values: Geist Mono, self-hosted through `next/font`
- Display scale: responsive 48–72px desktop, 36–44px mobile
- Body: 16px with a 1.5–1.65 line height
- Data labels: 14–16px with tabular numerals

### Spacing and shape

- Base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Desktop content maximum: 1440px with 32–48px gutters
- Mobile margins: 16–20px
- Controls: tactile 12–16px radius
- Reading panel: 16–20px radius
- Shadows: subtle and rare; borders and tonal surfaces do most separation

### Focus and motion

- Keyboard focus is always visible with a 3px focus ring and offset.
- State changes may use 160–220ms opacity, color, and transform transitions.
- No continuous decorative animation.
- `prefers-reduced-motion` removes nonessential transitions and transforms.

## Responsive Composition

### Desktop

- Compact header with Compare/Learn and the global complexity selector.
- Large exhibit title and concise promise.
- Source chips, then one compact comparison context strip.
- Reading-surface chart beside a narrow interpretation panel.
- Evidence action leads; challenge and table actions follow.

### Mobile

- Compact product header and a short comparison title.
- Selected sources collapse to a summary control.
- Metric selection is full width.
- The chart becomes a direct-value vertical list.
- Interpretation follows the chart.
- Evidence opens as a full-height modal sheet with focus restoration.
- Core content never requires horizontal scrolling.

## Initial Implementation Boundary

This slice establishes the approved design system and a functional `/compare`
prototype using clearly labeled preview evidence. It includes source selection,
Typical/Range switching, the complexity selector, table fallback, and an
accessible evidence dialog. It does not publish scientific evidence, connect
Supabase, implement canonical URL state, or claim the full Comparison Lab is
released.
