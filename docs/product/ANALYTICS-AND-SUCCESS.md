# Analytics and Release Success

## Event Contract

Events use a versioned name, anonymous session identifier where consent and policy permit it, route, release version, and a restricted property allowlist.

| Event | Allowed properties |
| --- | --- |
| `comparison_opened` | default/shared/custom state kind |
| `energy_source_added` / `energy_source_removed` | technology identifier, selected count |
| `metric_changed` | previous and next metric identifiers |
| `geography_changed` | geography level, never precise user location |
| `display_mode_changed` | previous and next mode |
| `units_changed` | previous and next unit mode |
| `source_opened` | source identifier, metric identifier |
| `data_passport_opened` | metric and technology identifiers |
| `number_challenged` | metric and technology identifiers |
| `complexity_changed` | previous and next level |
| `comparison_shared` | selected count, metric, mode |
| `table_view_opened` | metric, selected count |

No event contains names, email addresses, free text, exact IP-derived location, cross-site advertising identifiers, or inferred political views.

## Release Gates

- All major displayed quantitative observations resolve to a published Data Passport.
- All charts have a narrative summary and table/text fallback.
- Automated accessibility scans report no critical or serious violations on flagship journeys.
- Keyboard, focus restoration, 200% zoom, reduced motion, mobile, tablet, desktop, light, and dark checks pass.
- The core E2E journey passes in Chromium, Firefox, and WebKit.
- Production build, typecheck, lint, unit, component, and integration suites pass.
- LCP is below 2.5 seconds on the agreed representative mobile profile; Lighthouse Performance exceeds 90 and Accessibility, Best Practices, and SEO exceed 95.
- Published evidence passes metadata, source reachability, unit, boundary, representative-rule, and licensing review.

## Product Signals

Measure comparison completion, source opens, Data Passport use, Challenge This Number use, table use, complexity changes, and successful shared-link restoration. Establish behavioral targets only after a documented baseline period; do not optimize the product primarily for pageviews.
