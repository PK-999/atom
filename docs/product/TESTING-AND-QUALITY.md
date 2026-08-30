# ATOM Testing and Quality Standard

## 1. Philosophy

ATOM contains scientific claims, calculations, interactive visualizations, and educational UX.

Quality is therefore not only “does the page load?”

A feature must be:
- scientifically correct
- functionally correct
- visually coherent
- accessible
- performant
- resilient

---

## 2. Testing Pyramid

### Unit tests
Required for:
- calculations
- conversions
- parsing
- normalization
- representative-value selection
- URL-state encoding/decoding
- filtering
- sorting

### Component tests
Required for:
- ComplexitySelector
- MetricCard
- DataPassport
- ChallengeNumber
- selectors
- evidence drawers

### Integration tests
Required for:
- comparison filters
- URL state
- mode switching
- evidence interactions
- content/evidence rendering

### E2E tests
Required for flagship journeys.

### Visual verification
Required for:
- desktop
- tablet
- mobile
- dark mode
- key drawers/sheets
- loading/error states

### Accessibility
Required:
- automated axe
- keyboard-only flow
- focus order
- zoom
- reduced motion
- semantic labels

---

## 3. Scientific Calculation Tests

Example:

Input:
- capacity = 1000 MW
- capacity factor = 0.90
- year = 8760 hours

Expected:
- annual generation = 7,884,000 MWh
- = 7.884 TWh

Tests should use explicit units.

Avoid floating-point comparisons without tolerance.

---

## 4. Browser Verification Checklist

For every substantial UI change:

- page loads
- no console errors
- no hydration errors
- controls work
- keyboard navigation works
- focus visible
- mobile layout works
- tablet layout works
- desktop layout works
- dark mode works
- reduced motion works
- evidence drawers open/close
- URL state behaves
- back/forward navigation behaves

---

## 5. Performance Verification

Watch:
- JS bundle size
- LCP
- CLS
- hydration cost
- map/chart lazy loading
- image weight
- font loading

Heavy interactive features should not penalize unrelated educational pages.

---

## 6. Content QA

Before publishing a quantitative claim:
- source exists
- source is correctly attributed
- unit is correct
- geography/time is correct
- system boundary is correct
- representative value is justified
- uncertainty is shown if material
- source is reachable
- wording does not overstate certainty

---

## 7. Definition of Done Template

Use this checklist in PRs:

```text
[ ] Requirement implemented
[ ] Typecheck passes
[ ] Lint passes
[ ] Unit tests pass
[ ] Integration tests pass
[ ] E2E passes where applicable
[ ] Production build passes
[ ] Browser verified
[ ] Mobile verified
[ ] Tablet verified
[ ] Desktop verified
[ ] Console clean
[ ] Keyboard verified
[ ] Accessibility checked
[ ] Reduced motion checked
[ ] Loading state checked
[ ] Empty state checked
[ ] Error state checked
[ ] Evidence/source behavior checked
[ ] Documentation updated
```

---

## 8. Completion Rule

Do not say:
> Done

unless verification has actually been run.

If something was not verified, say:
> Implemented, but not yet verified for X.

Evidence before assertion applies to engineering too.
