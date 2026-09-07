# ADR 0009: Evidence Implementation Reconciliation

- Status: Accepted
- Date: 2026-09-07
- Supersedes: the executable use of the root Stage 6 migrations recorded at
  checkpoint `d39e942`; it does not supersede ADR 0002

## Context

ATOM had two incompatible Stage 6 implementations:

- the root recovery checkpoint `d39e942` contained a mutable, single-version
  schema in migrations `20260901000000` and `20260901000001`, a direct
  service-role ingestion helper, and an unverified published-looking reference
  script;
- the delivery worktree at `c8cb58a` contained a versioned evidence schema,
  publication-aware RLS, typed repository adapters, private operational tables,
  and partial ingestion/publication services.

Both histories had been copied into `supabase/migrations` on the recovery
branch. Applying them in timestamp order would attempt to create the same core
tables twice with materially different shapes. Successful TypeScript or UI
tests cannot make that migration sequence safe.

The pre-reconciliation root is preserved by commit `d39e942`. The delivery
worktree and its uncommitted files remain untouched. The historical root SQL
and unsafe reference script can be inspected with:

```bash
git show d39e942:supabase/migrations/20260901000000_initial_schema.sql
git show d39e942:supabase/migrations/20260901000001_rls_policies.sql
git show d39e942:scripts/ingest-reference.ts
```

## Decision

### One executable migration history

The versioned delivery history is the only canonical executable history:

1. `20260901020124_evidence_core.sql`
2. `20260901020125_evidence_publication_rls.sql`
3. `20260901114737_evidence_ingestion_reviews.sql`

The root migrations `20260901000000` and `20260901000001` are removed from the
current `supabase/migrations` directory. They remain recoverable from
`d39e942` as historical reference and must never be copied back into the
canonical chain.

No linked hosted project was discovered or queried during R01. Before the
first local reset, the disposable local database restored from a prior backup
reported the two root versions as applied and the three versioned migrations
as local-only. `supabase db reset --local` then recreated only the disposable
local database and applied the three canonical migrations successfully.

If a staging or production target is later found to contain either root
migration, do not reset it and do not mark the canonical files as applied.
Inventory its tables, data, policies, grants, and migration table read-only;
then create a newly timestamped additive migration that maps and backfills the
old rows into immutable dataset versions. Verify row counts and public
visibility before switching any release pointer. The destructive cost of a
wrong choice includes evidence loss and accidental draft exposure, so hosted
reconciliation requires a reviewed backup and rollback plan.

### Schema mapping

| Root implementation | Canonical versioned implementation | Rationale |
| --- | --- | --- |
| `datasets.version` and checksum on a mutable dataset row | stable `datasets` plus immutable `dataset_versions` | A changed artifact or transformation creates a new version rather than overwriting evidence. |
| observation references `dataset_id` | observation references `dataset_version_id` | Every observation resolves to the exact reviewed artifact/transformation version. |
| observation `publication_status` alone controls public access | published observation + published active dataset version + published feature-enabled metric release + permitted redistribution | A child flag cannot bypass parent publication, release, or licence decisions. |
| public `publication_records` with one reviewer field | per-entity publication metadata plus private `dataset_version_reviews` | Review identities and operational review records are not public evidence tables. |
| JSON observation transformation array | ordered immutable `observation_transformations` rows | Transform steps are inspectable, constrained, and protected after publication. |
| direct mutable upsert | idempotent ingestion run, immutable version, review, publish, and active release pointer | Repeatability and rollback do not destroy prior evidence. |
| public operational tables and broad `USING (true)` policies | `private` ingestion/release audit tables and publication-aware RLS | Anonymous users can read only deliberately released evidence and cannot write. |

The canonical schema intentionally does not retain the root `licenses`,
join-table, claim, citation, or explanation shapes as parallel evidence
authorities. Licence facts required for release are stored on sources,
datasets, and observations; claim/content entities will be reconciled through
their own later contracts.

### Repository and environment boundaries

`lib/evidence/repository.ts` is the sole canonical retrieval contract.
`LocalEvidenceRepository` and `SupabaseEvidenceRepository` implement that same
contract. The latter maps explicit database columns into Stage 5 schemas and is
server-only. Production must not fall back to test fixtures.

The direct query in `features/comparison/comparison-api.ts` and the mutable
helper in `lib/ingestion/pipeline.ts` are retained temporarily as identified
legacy code, not approved architecture. R05 replaces the comparison path with
`EvidenceRepository`; R04 replaces the ingestion path with the transactional
Postgres store. Nothing new may depend on either legacy module.

`lib/supabase/client-config.ts` is the environment authority:

- browser/public Data API: `NEXT_PUBLIC_SUPABASE_URL` plus
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`;
- server Data API: `SUPABASE_URL` plus `SUPABASE_SECRET_KEY`;
- transaction-capable ingestion: independent server-only
  `SUPABASE_DATABASE_URL`, restricted to `postgres://` or `postgresql://`.

`lib/env/server.ts` is a compatibility wrapper over the canonical server Data
API parser. The direct database URL is deliberately not coupled to an API key.
Values remain empty in `.env.example`, are never returned in errors, and must
not cross into client props or `NEXT_PUBLIC_` variables.

Runtime packages required by these boundaries are exactly pinned in
`package.json` and the lockfile. The supported runtime remains Node.js
`>=24.20.0`, satisfying Supabase's current Node 22+ client requirement.

### Reference ingestion quarantine

`scripts/ingest-reference.ts` is a permanent fail-closed tombstone. It imports
no environment loader, client, or ingestion module, prints no configuration,
and exits nonzero with directions to the reviewed pipeline. Its old
published-looking IPCC values, checksum, licence claim, extraction note, dates,
and review state have not been scientifically or legally verified and must not
be reused as fixtures or evidence.

## Incomplete work carried into R04

The versioned schema and repository are a foundation, not a complete evidence
lifecycle. In particular:

- the normal `evidence:ingest` command does not yet ship a default Postgres
  adapter in this branch;
- there is no accepted durable transaction that creates a run, writes a
  version and observations, preserves a sanitized failure audit, and enforces
  concurrent idempotency in PostgreSQL;
- partial delivery-worktree changes to manifest cross-identity validation,
  duplicate detection, `canPrepublishObservation`, review timestamps, and CLI
  loading remain unaccepted until R04 tests them against the real store;
- software reviewer-role strings and database constraints do not constitute
  qualified scientific, editorial, or licensing approval;
- no real source artifact or public metric release was ingested or published.

Stage 6 therefore remains in progress.

## Consequences

- A clean local reset has one deterministic schema instead of two conflicting
  histories.
- The preserved checkpoint and untouched delivery worktree provide recovery
  paths without keeping unsafe SQL executable.
- Public reads have a stronger parent/version/release/licence boundary.
- R02 and R03 may proceed after R01 review; R04 remains responsible for the
  durable write lifecycle and R05 for repository-backed comparison results.
- Any hosted database that used the root chain requires an explicit additive
  reconciliation decision before deployment.
