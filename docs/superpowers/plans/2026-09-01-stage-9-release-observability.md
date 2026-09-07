# Stage 9 Release and Observability Foundation Implementation Plan

> **2026-09-07 execution correction:** Follow recovery plan R07 in
> `2026-09-07-learning-platform-recovery.md`. Current CI does not run real DB
> publication tests; analytics is a transport scaffold, and heading-only browser
> loops are not rollback or scientific acceptance. Preserve exact measured
> results and required database/browser gates before advancing release status.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make metric categories independently activatable and reversible, with privacy-conscious analytics, operational monitoring, measured performance budgets, and reproducible release drills.

**Architecture:** A typed registry controls route exposure and active evidence versions. Structured logging, Next.js instrumentation, allowlisted analytics, and scheduled evidence-health checks surface failure without collecting personal data. Activation and rollback reuse immutable dataset versions and append-only operation logs.

**Tech Stack:** Next.js 16.3.3 instrumentation and Web Vitals, TypeScript/Zod, Supabase/PostgreSQL, GitHub Actions, Lighthouse CI 0.15.1, Playwright/axe-core.

**Spec:** `docs/superpowers/specs/2026-09-01-stage-6-9-evidence-comparison-release-design.md`

## Global Constraints

- Pin `@lhci/cli` exactly at 0.15.1 and commit the lockfile.
- Analytics events use the Stage 7 strict union; reject unknown properties.
- Never persist IP addresses, user agents, names, email addresses, free text, full URLs, precise location, advertising identifiers, or inferred views.
- Logs may contain generated request/run IDs, stable error codes, metric/category IDs, durations, and counts only.
- Dataset rollback changes the active version pointer and appends an audit event; it never deletes or overwrites evidence.
- Production has no implicit fixture fallback and no feature-disabled record exposure.
- LCP target is below 2.5 seconds; Lighthouse Performance is above 90 and Accessibility, Best Practices, and SEO are above 95.
- Monitoring/provider absence must be visible in diagnostics but cannot break comparison use.
- Read current Next.js instrumentation/analytics docs and current Supabase changelog before implementation.

---

### Task 1: Implement the typed metric-category release registry

**Files:**
- Create: `features/comparison/release/registry.ts`
- Create: `features/comparison/release/registry-data.ts`
- Test: `features/comparison/release/registry.test.ts`
- Modify: `features/comparison/server/get-repository.ts`
- Modify: `features/comparison/server/load-comparison.ts`

**Interfaces:**
- Produces: `MetricCategory`, `MetricReleaseConfig`, `MetricReleaseRegistry`, `getMetricRelease(metricId)`, and `isMetricRouteEnabled(metricId, environment)`.
- Consumes: database `MetricRelease` records and the Stage 8 server-only `ATOM_ENABLE_TEST_EVIDENCE` switch.

- [ ] **Step 1: Write failing registry validation tests**

```ts
it("rejects an enabled metric without an active reviewed dataset", () => {
  expect(() => MetricReleaseConfigSchema.parse({
    ...validRelease,
    activeDatasetVersion: null,
    routeEnabled: true,
  })).toThrow(/active dataset/i);
});

it("keeps feature-disabled evidence unavailable in production", () => {
  expect(isMetricRouteEnabled("capacity-factor", "production")).toBe(false);
});
```

- [ ] **Step 2: Run registry tests and verify failure**

Run: `npm test -- features/comparison/release/registry.test.ts`  
Expected: FAIL because registry modules are missing.

- [ ] **Step 3: Implement the strict registry**

Each config includes category, metric ID, availability, active dataset version,
route exposure, allowed modes, release date or null, and rollback version or
null. Cross-check config against database release data at server startup and
return an operational error on mismatch.

- [ ] **Step 4: Gate server loading through the registry**

Unavailable/disabled metrics return the domain unavailable result. Preview may
read the Stage 6 test record only when `ATOM_ENABLE_TEST_EVIDENCE=true` exists
server-side. Revalidate that the variable remains server-only and false by
default.

- [ ] **Step 5: Run registry/server tests and commit**

Run: `npm test -- features/comparison/release features/comparison/server`  
Expected: PASS.

```bash
git add features/comparison/release features/comparison/server lib/env/server.ts .env.example
git commit -m "feat: add independent metric release controls"
```

---

### Task 2: Add structured server error instrumentation

**Files:**
- Create: `lib/observability/log-event.ts`
- Test: `lib/observability/log-event.test.ts`
- Create: `instrumentation.ts`
- Test: `tests/instrumentation.test.ts`
- Modify: `app/api/comparison/route.ts`

**Interfaces:**
- Produces: `OperationalLogSchema`, `logOperationalEvent(event)`, and Next.js `onRequestError`.
- Consumes: stable error codes and generated `crypto.randomUUID()` request IDs.

- [ ] **Step 1: Write failing redaction tests**

```ts
it("rejects raw URLs and user-agent values", () => {
  expect(OperationalLogSchema.safeParse({
    event: "comparison_failed",
    requestId: "request-1",
    url: "/compare?private=value",
    userAgent: "browser",
  }).success).toBe(false);
});
```

- [ ] **Step 2: Run observability tests and verify failure**

Run: `npm test -- lib/observability/log-event.test.ts tests/instrumentation.test.ts`  
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement strict JSON logging**

Allowed fields are event, timestamp, request/run ID, error code, metric ID,
category ID, duration milliseconds, count, environment, route type, and
severity. Serialize one JSON object per line through an injected sink in tests
and `console` in runtime.

- [ ] **Step 4: Implement Next.js server error instrumentation**

```ts
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  logOperationalEvent({
    errorCode: classifyServerError(error),
    event: "next_request_error",
    requestId: crypto.randomUUID(),
    routeType: context.routeType,
    severity: "error",
    timestamp: new Date().toISOString(),
  });
};
```

Do not log `request.path`, headers, cookies, query strings, stack traces, or
error messages. The comparison route logs duration and stable outcome code.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- lib/observability tests/instrumentation.test.ts tests/comparison-api-route.test.ts`  
Expected: PASS.

```bash
git add lib/observability instrumentation.ts tests/instrumentation.test.ts app/api/comparison/route.ts tests/comparison-api-route.test.ts
git commit -m "feat: add privacy-safe operational logging"
```

---

### Task 3: Persist allowlisted comparison analytics and Web Vitals

**Files:**
- Create through CLI: migration ending `_telemetry_events.sql`
- Create: `supabase/tests/database/04_telemetry_security.test.sql`
- Create: `lib/analytics/transport.ts`
- Test: `lib/analytics/transport.test.ts`
- Create: `app/api/telemetry/route.ts`
- Test: `tests/telemetry-api-route.test.ts`
- Create: `app/_components/WebVitals.tsx`
- Test: `app/_components/WebVitals.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `features/comparison/ComparisonLab.tsx`

**Interfaces:**
- Produces: POST `/api/telemetry`, `BrowserAnalyticsSink`, and isolated `WebVitals` client boundary.
- Consumes: Stage 7 event schemas and Next.js `useReportWebVitals`.

- [ ] **Step 1: Create the migration through the CLI**

Run: `npx supabase migration new telemetry_events`  
Edit the printed path and keep its generated timestamp unchanged.

- [ ] **Step 2: Write database security tests before migration SQL**

Assert `public.telemetry_events` has RLS, `anon` and `authenticated` have no
SELECT/INSERT/UPDATE/DELETE privileges, and the table contains no columns for
IP, user agent, URL, free text, session ID, name, email, or location.

- [ ] **Step 3: Implement the locked-down telemetry table**

Columns are `id uuid`, `event_name text`, `occurred_at timestamptz`,
`metric_id text null`, `technology_id text null`, `selected_count int null`,
`mode text null`, `level text null`, `value numeric null`, and `rating text
null`. Enable RLS, revoke public privileges, and create no public policies. The
server secret client inserts only parsed allowlisted payloads.

- [ ] **Step 4: Write failing API and browser transport tests**

```ts
it("returns 400 for an event with free text", async () => {
  const response = await POST(jsonRequest({
    name: "comparison_shared",
    metricId: "lifecycle-emissions",
    note: "private text",
  }));
  expect(response.status).toBe(400);
});
```

Test `sendBeacon` first, `fetch(..., { keepalive: true })` fallback, provider
absence, and no throw on transport failure.

- [ ] **Step 5: Implement analytics and Web Vitals transport**

Web Vitals accepts only `TTFB`, `FCP`, `LCP`, `CLS`, and `INP`, numeric value,
and rating. Do not persist the per-page metric ID. Mount `<WebVitals />` as the
small isolated client component in `app/layout.tsx`.

- [ ] **Step 6: Wire Comparison Lab events**

Track comparison opened, source add/remove, metric/geography/mode/units/
complexity changes, source/Data Passport/Challenge opens, share, table view,
unavailable state, and mismatch state. Event tests assert the displayed action
emits exactly one parsed event.

- [ ] **Step 7: Run database and application tests**

Run:

```bash
npm run db:reset
npm run db:test
npm test -- lib/analytics tests/telemetry-api-route.test.ts app/_components/WebVitals.test.tsx features/comparison/ComparisonLab.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit analytics transport**

```bash
git add supabase lib/analytics app/api/telemetry app/_components/WebVitals.tsx app/_components/WebVitals.test.tsx app/layout.tsx features/comparison
git commit -m "feat: add privacy-conscious product telemetry"
```

---

### Task 4: Add ingestion, stale-dataset, and broken-source health checks

**Files:**
- Create: `scripts/ops/check-evidence-health.ts`
- Create: `lib/observability/evidence-health.ts`
- Test: `lib/observability/evidence-health.test.ts`
- Create: `.github/workflows/evidence-health.yml`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `checkEvidenceHealth(repository, now, fetcher)`, JSON health report, and scheduled CI job.
- Consumes: active releases, source URLs, ingestion runs, and Stage 5 freshness rules.

- [ ] **Step 1: Write failing health-check tests**

```ts
it("reports stale active evidence and a broken source independently", async () => {
  const report = await checkEvidenceHealth(repository, now, failingFetcher);
  expect(report.issues.map((issue) => issue.code)).toEqual([
    "stale-active-dataset",
    "source-unreachable",
  ]);
});
```

Cover stalled/failed ingestion, redirected source, timeout, 429 retry-after,
and a healthy release.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- lib/observability/evidence-health.test.ts`  
Expected: FAIL with missing module.

- [ ] **Step 3: Implement deterministic checks**

Use injected `now` and `fetcher`, HEAD with GET fallback, a bounded timeout,
one retry for 429/5xx, and stable issue codes. Do not log source response bodies
or credentials. Exit code 1 means actionable issue; 2 means checker failure.

- [ ] **Step 4: Add the scheduled workflow**

Run daily and on manual dispatch. Use repository secrets for Supabase server
configuration, run the health script, upload the JSON report artifact, and
avoid printing environment values.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- lib/observability/evidence-health.test.ts`  
Expected: PASS.

```bash
git add scripts/ops lib/observability/evidence-health.ts lib/observability/evidence-health.test.ts .github/workflows/evidence-health.yml package.json package-lock.json
git commit -m "feat: monitor evidence pipeline health"
```

---

### Task 5: Enforce bundle and Lighthouse performance budgets

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `lighthouserc.cjs`
- Create: `scripts/performance/check-route-bundle.mjs`
- Test: `tests/performance-budget.test.ts`
- Modify: `.github/workflows/ci.yml`
- Modify: `features/comparison/ComparisonLab.tsx`

**Interfaces:**
- Produces: `npm run test:performance`, Lighthouse assertions, and route bundle budget output.
- Consumes: production build artifacts and `/compare`.

- [ ] **Step 1: Install Lighthouse CI exactly**

Run: `npm install --save-dev --save-exact @lhci/cli@0.15.1`

Add scripts:

```json
{
  "test:performance": "npm run build && lhci autorun && node scripts/performance/check-route-bundle.mjs"
}
```

- [ ] **Step 2: Write failing performance configuration tests**

Assert the configuration includes `/compare`, mobile emulation, three runs,
LCP below 2500ms, CLS at most 0.1, performance at least 0.9, and accessibility,
best-practices, and SEO at least 0.95.

- [ ] **Step 3: Run the test and confirm configuration is missing**

Run: `npm test -- tests/performance-budget.test.ts`  
Expected: FAIL because `lighthouserc.cjs` does not exist.

- [ ] **Step 4: Implement Lighthouse and bundle checks**

Use a production server started by Lighthouse CI. The bundle script reads the
Next.js build manifest, reports `/compare` initial JS bytes, and fails above the
recorded Stage 8 baseline plus a reviewed 10% allowance. Store the exact byte
budget in the script after measuring the baseline; never use an unbounded or
zero placeholder.

- [ ] **Step 5: Lazy-load non-default interaction modules**

Use `next/dynamic` for non-default metric search, evidence detail, and complex
chart modules while keeping the initial table/text summary server-rendered.
Add component tests showing loading labels and keyboard access still work.

- [ ] **Step 6: Run performance gates and commit**

Run:

```bash
npm test -- tests/performance-budget.test.ts
npm run test:performance
```

Expected: every configured threshold passes.

```bash
git add package.json package-lock.json lighthouserc.cjs scripts/performance tests/performance-budget.test.ts .github/workflows/ci.yml features/comparison
git commit -m "perf: enforce comparison release budgets"
```

---

### Task 6: Automate correction, activation, and rollback drills

**Files:**
- Create: `scripts/ops/release-metric.ts`
- Create: `features/comparison/release/operations.ts`
- Test: `features/comparison/release/operations.integration.test.ts`
- Create: `docs/engineering/runbooks/EVIDENCE-CORRECTION.md`
- Create: `docs/engineering/runbooks/DATASET-ROLLBACK.md`
- Create: `docs/engineering/runbooks/METRIC-RELEASE.md`

**Interfaces:**
- Produces: `activateMetricVersion`, `rollbackMetricVersion`, `recordCorrection`, and dry-run/execute CLI commands.
- Consumes: Stage 6 publication RPC, release registry, and append-only operation log.

- [ ] **Step 1: Write failing integration tests**

```ts
it("rolls back by changing the active pointer without deleting versions", async () => {
  await rollbackMetricVersion({
    metricId: "capacity-factor",
    targetVersion: "version-1",
    reason: "verified drill",
  }, store);
  expect(await store.getActiveVersion("capacity-factor")).toBe("version-1");
  expect(await store.listDatasetVersions("eia-capacity-factor")).toHaveLength(2);
  expect(await store.listReleaseOperations()).toContainEqual(
    expect.objectContaining({ operation: "rollback", reason: "verified drill" }),
  );
});
```

- [ ] **Step 2: Run integration tests and verify failure**

Run: `npm test -- features/comparison/release/operations.integration.test.ts`  
Expected: FAIL with missing operations.

- [ ] **Step 3: Implement dry-run-first operations**

The CLI requires `--execute` for mutation, validates target publication and
registry compatibility, prints the before/after version IDs, requires a
non-empty reason, and never accepts deletion flags.

- [ ] **Step 4: Execute all documented drills locally**

Run disabled-category, failed-ingestion, stale-dataset, broken-link, material
correction, activation, and rollback scenarios. For each, verify user-visible
state, structured signal, recovery action, and database query in the runbook.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- features/comparison/release`  
Expected: PASS.

```bash
git add scripts/ops/release-metric.ts features/comparison/release docs/engineering/runbooks
git commit -m "feat: add evidence release and rollback drills"
```

---

### Task 7: Complete the release journey, checklists, and Stage 9 gate

**Files:**
- Modify: `tests/e2e/comparison-lab.spec.ts`
- Create: `docs/engineering/checklists/COMPARISON-RELEASE.md`
- Create: `docs/engineering/checklists/ACCESSIBILITY-REVIEW.md`
- Create: `docs/engineering/checklists/EVIDENCE-REVIEW.md`
- Create: `docs/engineering/checklists/PERFORMANCE-REVIEW.md`
- Modify: `docs/engineering/RELEASE-PROMOTION.md`
- Modify: `docs/product/DELIVERY-TRACKER.md`
- Create: `docs/engineering/verification/2026-09-01-stage-9-release-observability.md`

**Interfaces:**
- Produces: the authoritative release/rollback gate and complete Stage 9 verification record.
- Consumes: all Stage 6–9 behavior and operational scripts.

- [ ] **Step 1: Add the full URL-reload E2E journey**

Open `/compare`, add/reorder technologies, select metric/geography, change
mode/units/complexity, open Data Passport and Challenge, switch table/chart,
share, reload the canonical URL, navigate back/forward, and verify identical
state. Assert analytics endpoint requests contain only allowlisted keys.

- [ ] **Step 2: Add resilience E2E fixtures**

Use deterministic server test configuration to render loading, partial,
missing, stale, restricted, incompatible, repository error, disabled category,
and rollback states. Assert accessibility, focus, no horizontal overflow, no
console/hydration errors, and correct recovery actions.

- [ ] **Step 3: Run the complete verification suite**

Run:

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run db:reset
npm run db:test
npm run db:lint
npm run db:advisors
npm run build
PLAYWRIGHT_PORT=3119 npm run test:e2e
npm run test:performance
npm audit --audit-level=high
```

Expected: every command exits 0, three browsers pass, performance thresholds
pass, and no high-severity dependency vulnerabilities remain.

- [ ] **Step 4: Perform manual production-artifact review**

Verify mobile/tablet/desktop, light/dark, keyboard, focus restoration, 200%
zoom, reduced motion, source reachability, correction, rollback, and operational
diagnostics in the user's chosen browser.

- [ ] **Step 5: Record results and update the tracker**

Mark Stages 6–9 complete only where each stage's independent exit evidence is
present. Record external provider or hosted-environment checks as pending rather
than treating local mocks as proof.

- [ ] **Step 6: Commit release evidence**

```bash
git add tests/e2e docs/engineering docs/product/DELIVERY-TRACKER.md
git commit -m "docs: record stage 9 release gate"
```
