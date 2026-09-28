# ATOM design QA — N02 selected visual target

**Findings**

- No actionable P0, P1 or P2 findings remain after the gallery-atmosphere fix.
- [P3] The source concept includes small wall text and a larger, more art-directed exhibit object on the right side of the room. The implementation keeps the existing conceptual conversion artwork and adds the room as a restrained background layer. This is an intentional simplification so the homepage keeps the validated exhibit component and its accessible text/evidence path. A future art-direction pass can refine the exhibit crop and add reviewed labels without changing the interaction model.

**Open Questions**

- Generated room and reactor artwork remain conceptual and require provenance/licensing and scientific/editorial review before any public evidence claim or engineering interpretation is attached.
- Manual screen-reader review, 200% zoom review and production deployment remain outside this local N02 slice.

**Comparison target**

- Source visual truth: [selected-option-2-normalized-1440.png](docs/design/2026-09-27-playable-atom/frames/selected-option-2-normalized-1440.png), normalized from [selected-option-2.png](docs/design/2026-09-27-playable-atom/selected-option-2.png).
- Implementation screenshots: [home-dark-1440-viewport-v2.png](docs/design/2026-09-27-playable-atom/frames/home-dark-1440-viewport-v2.png) and [home-dark-390-selected-v2.png](docs/design/2026-09-27-playable-atom/frames/home-dark-390-selected-v2.png).
- Implementation URL: `http://127.0.0.1:3105/` from the production build, route `/`.
- Desktop viewport: 1440×900 CSS px. Source and implementation captures are both 1440×900 PNGs at `deviceScaleFactor: 1`; no density correction is required after normalization.
- Mobile viewport: 390×844 CSS px. The implementation capture is a full-page 390 px wide PNG (390×3002) from that viewport; the first viewport and responsive stack were inspected at 1× density.
- State: homepage, dark theme for the selected target, journey at its initial state, sound off, no auth state, no hover state. Light 390 was also checked as the companion theme.

**Full-view comparison evidence**

The source and desktop implementation were opened together in one comparison input at the same 1440×900 size. Both establish a dark gallery, a left reading column, a right exhibit surface, a compact energy path and a nearby evidence affordance. The implementation now uses the dedicated `public/assets/home/dark-exhibit-room.png` background so the hero reads as a room rather than a generic dark texture. The mobile capture preserves the same order by stacking copy, path and exhibit without horizontal overflow.

**Focused region comparison evidence**

The hero was the focused region: the source's left headline/CTA area, center energy path, right exhibit and room lighting were compared against the implementation. No additional focused region was required because the remaining differences are the intentionally simplified exhibit art direction described in the P3 finding; the controls, labels and evidence link are readable in the full-view captures.

**Required fidelity surfaces**

- Fonts and typography: existing ATOM display/body/mono tokens are retained; the new `Exhibit 01` and `Heat to electricity` markers use the existing compact mono treatment, with no truncation at 390 px.
- Spacing and layout rhythm: desktop keeps the split hero hierarchy; mobile stacks it vertically with touch-sized controls and no horizontal overflow. The hero room uses the existing surface radius and inset spacing rather than adding a second layout system.
- Colors and visual tokens: dark ink-blue canvas, warm reading text, muted sand labels, cyan interaction states and amber energy cue match the selected target and existing ATOM token vocabulary. Light theme remains the warm museum companion.
- Image quality and asset fidelity: the selected reference and dedicated room asset are raster images with recorded dimensions and conceptual status in `asset-manifest.json`; no target illustration was replaced with CSS art or an inline SVG approximation.
- Copy and content: the new marker and `Explore the evidence` affordance are short, specific and adjacent to the interaction; the copy does not make a scientific claim on behalf of the generated artwork.

**Comparison history**

1. First pass: P2 missing gallery atmosphere. The initial implementation used the existing blue museum texture while the selected source showed a dark exhibit room with a lit plinth. This changed the above-the-fold mood and weakened the selected visual target.
2. Fix: generated and added `public/assets/home/dark-exhibit-room.png`, updated `components/onboarding/OnboardingHero.module.css` to use it as the dark hero background with an accessible overlay, and recaptured the desktop and mobile frames.
3. Post-fix comparison: `home-dark-1440-viewport-v2.png` and `home-dark-390-selected-v2.png` preserve the room atmosphere, hierarchy and responsive stack. No actionable P0/P1/P2 issue remains; the remaining exhibit-art differences are recorded as P3 polish.

**Implementation Checklist**

- [x] Selected direction recorded and normalized against a 1440×900 source.
- [x] Dedicated dark room asset added with dimensions, crop, alt text and review status.
- [x] Hero marker, energy-path evidence affordance and conceptual reactor captions implemented.
- [x] Desktop and mobile dark captures compared against the source.
- [x] Light companion, reduced-motion state, keyboard journey and evidence navigation checked in a real browser.
- [x] Axe, console-error and page-error checks completed for dark/light mobile and desktop.

**Follow-up Polish**

- Refine the right-side exhibit crop and optional wall labels after asset provenance and scientific/editorial review are recorded.
- Add manual screen-reader and 200% zoom review to the N03 navigation handoff.

final result: passed
