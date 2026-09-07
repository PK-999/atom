# R01 recovery baseline verification

- Date: 2026-09-07
- Branch: `codex/atom-recovery-r01-r05`
- Starting HEAD: `264d2f5`
- Pre-reconciliation recovery checkpoint: `d39e942`
- Delivery worktree HEAD inspected read-only: `c8cb58a`
- Scope: R01 repository, schema, environment, repository, and unsafe-script
  reconciliation

## Preserved state

At task start the recovery branch had two intentional uncommitted files:
`package.json` and `package-lock.json`. They pinned the approved Supabase
dependencies exactly and added the required `server-only` package. No user
work was reset, stashed, or overwritten.

The delivery worktree was not edited. Its existing uncommitted files were:

```text
AGENTS.md
data/ingestion/pipeline.test.ts
data/ingestion/publication.integration.test.ts
data/ingestion/publication.ts
data/ingestion/quality.ts
lib/evidence/governance.ts
scripts/evidence/ingest.test.ts
```

Root application/scaffold work is preserved by `d39e942`. Delivery commits
through the repository and partial publication hardening are present on this
branch as commits `4e7e6ed` through `264d2f5`. The two source migration
histories were not concatenated; ADR 0009 records the canonical decision and
recovery commands.

## Migration-history inspection

No hosted Supabase command was run. Before local startup,
`supabase/.temp/project-ref` was absent, so no linked target was discoverable
from the local project state. `supabase migration list --local` initially
failed because unresolved conflict markers made `config.toml` invalid. After
the port conflict was resolved, the command correctly reported that no local
database was listening.

Starting the disposable local project restored an old local backup. Its first
read-only migration list showed database-side versions `20260901000000` and
`20260901000001`, while the repository contained the three versioned delivery
migrations. This was local disposable history, not evidence of a hosted
deployment. A local reset then recreated the database from the canonical
versioned chain only. The final migration list showed all three versions on
both sides:

```text
20260901020124
20260901020125
20260901114737
```

## Verification results

| Command | Result |
| --- | --- |
| `npm install --ignore-scripts` | Exit 0; three packages added to the existing install; audit reported zero vulnerabilities. |
| `npm test -- scripts/ingest-reference.test.ts` before quarantine | Expected failure: unsafe script returned status 0 instead of the required nonzero status. It ran in an isolated temporary working directory with Supabase variables removed, so it loaded no repository `.env.local` and attempted no network request. |
| `npm test -- scripts/ingest-reference.test.ts` after quarantine | 1 test passed. |
| `npm test -- tests/server-environment.test.ts lib/supabase/client-config.test.ts` before wrapper reconciliation | Expected failure: legacy wrapper discarded the secret-key config and did not reject a partial pair. |
| `npm test -- tests/server-environment.test.ts lib/supabase/client-config.test.ts scripts/ingest-reference.test.ts` after reconciliation | 3 files, 8 tests passed. |
| `npm run db:start` | Exit 0; disposable local Supabase project started. Local credentials printed by the CLI were not copied into documentation or source. |
| `npm run db:reset` | Exit 0; applied only the three canonical versioned migrations and seed. |
| `npm run db:test` | 3 pgTAP files, 67 tests passed. |
| `npm run db:lint` | Exit 0; no schema errors found. |
| `npm run db:advisors` | Exit 0; no issues found. |
| `npx supabase migration list --local` after reset | Exit 0; the three canonical local and database migration versions matched. |
| `npx supabase stop` | Exit 0; stopped only project `atom` and retained its disposable local backup. |
| `npm run format:check` | Exit 0. Markdown remains intentionally excluded by the repository Prettier configuration; the task-owned Markdown files were checked separately. |
| `npm run typecheck` | Exit 0. |
| `npm test` | 37 files passed, 1 file skipped; 175 tests passed, 1 skipped. Four Node experimental `localStorage` warnings remain. |
| `npm run lint` | Exit 0 with 3 pre-existing warnings: unused `setScenario` and two unused `CitationSchema` imports. |
| `npm run build` | Exit 0 on Next.js 16.3.3 webpack; routes `/`, `/compare`, `/design-system`, `/health`, and `/methodology` built. |

The current Supabase changelog was checked before reconciliation. Relevant
items were the Node.js 20 client-support removal, TypeScript 5 minimum notice,
and explicit Data API exposure change. This repository uses Node.js 24.20.0+
and TypeScript 6.0.3; the canonical RLS migration includes explicit grants.

## Boundary checks

- `scripts/ingest-reference.ts` contains no imports and exits with status 1.
- Its regression test executes the real script from an isolated working
  directory and requires empty stdout plus the quarantine guidance on stderr.
- `lib/env/server.ts` delegates to `lib/supabase/client-config.ts`; legacy
  `SUPABASE_SERVICE_ROLE_KEY` pairing is no longer the parsed contract.
- Direct database URLs are validated independently as PostgreSQL URLs.
- `server-only` stays active in production; Vitest alone aliases it to an empty
  module so server modules can be unit-tested without weakening the Next.js
  boundary.
- The canonical repository interface is `lib/evidence/repository.ts`.

## Explicitly unverified or incomplete

- No hosted database migration history, Vercel deployment, browser flow, or
  production environment was inspected.
- No real artifact was acquired, ingested, reviewed, published, or released.
- R04 must supply and test the default transactional Postgres ingestion store,
  persistent failed-run audit, concurrent idempotency, review/publication, and
  rollback.
- R05 must remove the Comparison Lab's direct Supabase mapping and use the
  canonical repository/result contracts; its health/readiness split is also
  pending.
- The three lint warnings and Node test warnings were outside this bounded
  reconciliation task and remain recorded rather than silently changed.

R01 establishes a locally reproducible baseline but does not complete Stage 6.
After independent review, R02 is the next dependency-ready package; R03 can
follow while R04 prepares the durable database lifecycle.
