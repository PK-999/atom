# Release Promotion

## Preview

1. Open a focused pull request.
2. Run typecheck, lint, unit, component, integration, E2E, accessibility, and build checks.
3. Inspect the preview in representative mobile, tablet, and desktop viewports.
4. Review evidence completeness and source reachability for changed quantitative claims.

## Staging

1. Merge reviewed work to the staging promotion branch or environment.
2. Apply forward-only database migrations.
3. Publish only the reviewed staging dataset version.
4. Run browser, console, keyboard, zoom, reduced-motion, dark-mode, performance, and rollback checks.

## Production

1. Record the application commit and dataset version.
2. Confirm all required checks are current and passing.
3. Promote the tested artifact; do not rebuild a different artifact for production.
4. Run smoke tests and source-link checks.
5. Monitor errors, Web Vitals, ingestion health, and evidence interactions.

## Rollback

Application rollback restores the last verified deployment. Evidence rollback changes the published dataset pointer to the last reviewed version. Neither rollback deletes source or transformation history.
