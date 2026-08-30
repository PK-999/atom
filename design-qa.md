# Comparison Lab Design QA

## Comparison Target

- Source visual truth:
  `docs/design/references/comparison-lab-digital-science-museum.png`
- Final desktop implementation:
  `docs/design/qa/comparison-desktop-pass3-1440x1024.png`
- Final mobile implementation:
  `docs/design/qa/comparison-mobile-pass3-390x844.png`
- Route: `/compare`
- State: default sources, lifecycle emissions, Global, Typical, Scientific,
  Curious, chart view, evidence dialog closed

The source is a 1487 × 1058 concept board containing one desktop and one
mobile frame. The implementation was captured in Chromium at a 1440 × 1024
CSS viewport and a 390 × 844 CSS viewport with `deviceScaleFactor: 1`. The
desktop capture is 1440 × 1024 pixels. The mobile capture is a full-page 390 ×
1415 pixel image, so it preserves the 390px comparison width while showing the
complete vertical experience rather than cropping it to 844px.

## Full-View Comparison Evidence

The selected source and both final captures were opened together in one visual
comparison pass. The final build preserves the source's key composition:

- deep mineral exhibit canvas with a restrained periwinkle light field;
- compact ATOM header and five-level complexity control;
- large one-line desktop exhibit title and two-line mobile title;
- tactile, shape-and-color-coded source controls;
- compact comparison context controls;
- warm reading-surface chart beside a dark interpretation label;
- direct values positioned with their bars;
- a leading evidence action and a secondary challenge action;
- mobile recomposition with a compact source summary, vertical chart, and
  stacked evidence actions.

## Required Fidelity Surfaces

### Fonts and typography

The implementation uses self-hosted Geist Sans and Geist Mono. Display weight,
tight tracking, tabular scientific numerals, and small uppercase exhibit labels
match the source hierarchy. The final desktop headline remains on one line at
1440px; the mobile headline wraps intentionally to two lines.

### Spacing and layout rhythm

Desktop gutters, header height, source band, context strip, 3:1 exhibit split,
rounded reading surface, and evidence actions follow the source. Mobile uses
16px margins and a vertical flow without horizontal overflow. The mobile page
is taller than the concept because it retains the full Typical/Range/Raw
control and the explicit unpublished-data disclosure.

### Colors and visual tokens

The final canvas uses the generated museum-light raster at reduced opacity over
the mineral navy surface. Warm off-white reading panels, periwinkle actions,
and consistent lavender/amber/turquoise/blue/gray energy tokens match the
source. The preview disclaimer was darkened after an automated contrast
failure and now clears the WCAG AA gate.

### Image quality and asset fidelity

The atmospheric background is a dedicated 1586 × 992 raster asset generated
for this composition and stored at
`public/assets/comparison/museum-light-background.png`. It is not recreated
with a CSS gradient. Visible icons and source markers come from the pinned
Phosphor icon library; there are no placeholder images, emoji, handcrafted SVG
assets, or stretched source screenshots.

### Copy and content

Core copy matches the selected concept. One intentional product-policy change
replaces the concept's implied “5 sources · last reviewed” claim with “Evidence
review pending.” The interface also adds an explicit preview-data disclosure.
Those differences are required because no evidence dataset has completed the
ingestion and editorial review stages.

## Focused Region Evidence

No separate crop was needed for the chart or control strip because their type,
icons, spacing, labels, and values are clearly readable in the 1440 × 1024
full-view comparison. The source does not specify an open evidence-dialog
visual, so there is no valid visual target for that state. Its keyboard opening,
Escape close behavior, focus restoration, fields, and serious axe checks were
instead verified through the component and production-browser journeys.

## Comparison History

### Pass 1

Evidence:

- `docs/design/qa/comparison-desktop-1440x1024.png`
- `docs/design/qa/comparison-mobile-390x844.png`

Findings and fixes:

- [P1] Desktop headline wrapped to two lines. Reduced the desktop display scale
  and widened its measure so the source's one-line hierarchy is restored.
- [P1] Mobile exposed all source chips by default. Added one compact,
  keyboard-operable summary control that expands the single source-control set.
- [P2] Values were pinned to the far edge of the chart. Moved values beside
  their corresponding bar endpoints.
- [P2] The atmospheric asset overwhelmed the interface. Changed it to a
  reduced-opacity background layer over the mineral canvas.
- [P2] The preview disclaimer measured 4.21:1 contrast. Darkened its foreground
  token and reran axe.

### Pass 2

Evidence:

- `docs/design/qa/comparison-desktop-pass2-1440x1024.png`
- `docs/design/qa/comparison-mobile-pass2-390x844.png`

Findings and fixes:

- [P2] The desktop exhibit was tall enough to push the primary evidence action
  below the reference fold. Reduced chart row height, gaps, padding, and
  disclosure spacing while keeping labels readable.
- [P2] The multiplied background was too close to black. Replaced blending with
  a controlled-opacity raster layer to restore the source's mineral-blue depth.

### Pass 3

Evidence:

- `docs/design/qa/comparison-desktop-pass3-1440x1024.png`
- `docs/design/qa/comparison-mobile-pass3-390x844.png`

Post-fix result: no actionable P0, P1, or P2 visual differences remain. The
desktop composition, mobile source summary, direct-label chart, evidence
hierarchy, typography, and palette are faithful to the selected direction.

## Interaction and Browser Evidence

- Production build rendered `/compare` without an error overlay.
- Source removal, display mode, complexity, chart/table, evidence dialog,
  Escape close, and focus restoration were exercised.
- Mobile width was checked at 390 × 844 with no root horizontal overflow.
- Chromium axe checks passed after the contrast fix.
- Console-error and failed-response collections remained empty.
- The in-app browser surface was unavailable in this session; browser-rendered
  captures and interactions therefore used the Playwright path already required
  by the delivery plan. No in-app preview claim is made.

## Follow-up Polish

- [P3] A future iteration may place the mobile mode selector in a focused sheet
  to shorten the initial page while retaining Range and Raw access.
- [P3] A later application-shell stage may add the selected concept's mobile
  menu affordance once the route-wide navigation model is implemented.

## Implementation Checklist

- [x] Selected visual reference preserved.
- [x] Desktop and mobile implementation captures compared with the source.
- [x] P0–P2 visual findings fixed and recaptured.
- [x] Typography, spacing, color, imagery, and copy reviewed explicitly.
- [x] Product-policy deviations documented.
- [x] Browser interaction and accessibility checks recorded.

final result: passed

