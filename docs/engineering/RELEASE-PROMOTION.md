# Release Promotion & Rollback Runbook

> **Single source of truth** for promoting application code, releasing dataset versions, running verification checks, and executing rollbacks.

---

## 1. Environments Overview

| Environment | Purpose | Target Database | Verification Gated |
|-------------|---------|-----------------|-------------------|
| **Local** | Feature development and local unit/integration tests | Local disposable Supabase (`127.0.0.1:54322`) | Yes (`npm run verify`, integration suites) |
| **Preview / PR** | Ephemeral pull request environments | Preview DB (or synthetic fixtures) | GitHub Actions CI (`quality`, `database`, `browser`) |
| **Staging** | Pre-production validation and rehearsal | Staging Supabase project | End-to-end rehearsal, mobile matrix, rollback drill |
| **Production** | Public evidence platform | Production Supabase project | Zero unverified gates, release record published |

---

## 2. Pre-Promotion Verification Pipeline

Before any pull request or deployment is promoted, execute the complete verification sequence:

```bash
# 1. Code standards, types, linter, tests, and production build
npm run verify

# 2. Database checks (against local or staging Supabase)
npm run db:test        # Run 67+ pgTAP database tests
npm run db:lint        # Check database schema against Supabase best practices
npm run db:advisors    # Run security and performance advisors
npm run db:types       # Verify database types are fresh and un-drifted

# 3. Integration test suites
npm run test:integration:supabase   # Verify RLS and published query filters
npm run test:integration:ingestion  # Verify durable ingestion, reviews, and atomicity
npm run test:rollback               # Verify version activation and rollback drill

# 4. End-to-End Browser verification (desktop & mobile)
npm run test:e2e

# 5. External source health check
npm run monitoring:sources
```

---

## 3. Evidence Dataset Promotion Workflow

Dataset publication is strictly decoupled from application deployment. Application updates cannot publish unreviewed evidence, and evidence releases cannot modify historical records.

### Step 1: Local Ingestion & Validation
Ingest the reviewed data artifact using its signed manifest:
```bash
npm run evidence:ingest -- ingest \
  --manifest data/sources/<dataset-id>/manifest.json \
  --artifact data/sources/<dataset-id>/artifact.json
```
Output:
```json
{
  "datasetVersionId": "version-xxxxxxxx",
  "acceptedRecordCount": 14,
  "status": "succeeded"
}
```

### Step 2: Three-Gate Independent Review
Record reviews for the three mandatory independent roles:
```bash
# 1. Scientific Review
npm run evidence:ingest -- review \
  --dataset-version version-xxxxxxxx \
  --role scientific \
  --reviewer-id "rev-scientific-01"

# 2. Editorial Review
npm run evidence:ingest -- review \
  --dataset-version version-xxxxxxxx \
  --role editorial \
  --reviewer-id "rev-editorial-01"

# 3. Licensing Review
npm run evidence:ingest -- review \
  --dataset-version version-xxxxxxxx \
  --role licensing \
  --reviewer-id "rev-licensing-01"
```

### Step 3: Publish Dataset Version
Publish the dataset version to allow public viewing:
```bash
npm run evidence:ingest -- publish \
  --dataset-version version-xxxxxxxx \
  --metric <metric-id> \
  --enable-feature \
  --reason "Reviewed Q3 release of <metric-id>"
```

### Step 4: Activate Dataset Release
Point the active release pointer to the newly published dataset version:
```bash
npm run evidence:ingest -- activate \
  --metric <metric-id> \
  --dataset-version version-xxxxxxxx \
  --reason "Active production promotion"
```

---

## 4. Rollback Runbook

### Evidence Version Rollback (Zero Downtime)
If a methodology anomaly, data error, or retracted source is identified in production:

1. Identify the previous verified version ID:
   ```sql
   SELECT target_dataset_version_id, occurred_at, reason
   FROM private.release_operations
   WHERE metric_id = '<metric-id>'
   ORDER BY occurred_at DESC;
   ```

2. Execute the rollback command:
   ```bash
   npm run evidence:ingest -- rollback \
     --metric <metric-id> \
     --dataset-version <prior-version-id> \
     --reason "Correction drill: rollback due to source revision in version-xxxxxxxx"
   ```

3. What happens under the hood:
   - `public.metric_releases.active_dataset_version_id` atomically points back to `<prior-version-id>`.
   - An immutable audit row is appended to `private.release_operations` with `operation = 'rollback'`.
   - **No observations or dataset versions are deleted**. Historical provenance remains intact.
   - Client queries automatically resolve the rolled-back version without cache poisoning.

### Application Code Rollback
If a frontend regression or runtime defect is deployed:
1. Revert to the last verified commit or deployment:
   ```bash
   git checkout <last-verified-tag-or-hash>
   npm run verify
   ```
2. In Vercel / hosting provider, execute **Instant Rollback** to the prior build deployment.

---

## 5. Monitoring & Operational Health

Run periodic source freshness and reachability checks:
```bash
npm run monitoring:sources
```
- **Healthy**: HTTP 200/301 responses within timeout (default 5000ms).
- **Inconclusive**: HTTP 403 (paywall/bot protection), HTTP 429 (rate limit), or timeout. *Never invalidates a scientific claim.*
- **Broken**: HTTP 404 or 410. Flagged for editorial review and replacement source locator.
- **Stale**: Sources unverified for >180 days. Flagged for scheduled re-audit.
