# Stage 6 Supabase and Evidence Ingestion Implementation Plan

> **2026-09-07 execution correction:** Read `2026-09-07-learning-platform-recovery.md`
> R01/R04 first. The root and delivery migration chains conflict; this plan is
> retained as design detail, not permission to concatenate them. Its sample
> repeated `stage-6-reviewer` approvals are synthetic test mechanics only and
> cannot satisfy independent scientific/editorial/licensing review. Require a
> shipped default DB adapter and actual transactional integration tests. A
> memory-store test or published-looking fixture does not satisfy the exit gate.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a versioned, RLS-protected Supabase evidence store and prove one licensed institutional observation through deterministic ingestion, review, publication, inspection, and rollback.

**Architecture:** Stage 5 Zod contracts remain the scientific authority. PostgreSQL enforces relational integrity and publication visibility; a typed repository hides Supabase from consumers. A deterministic manifest-driven ingestion pipeline creates immutable dataset versions and uses a server-only secret key for writes.

**Tech Stack:** Node.js 24.20.0, TypeScript 6.0.3, Zod 4.5.4, Supabase CLI 2.116.0, `@supabase/supabase-js` 2.112.4, `tsx` 4.23.13, PostgreSQL/pgTAP, Vitest 4.1.11.

**Spec:** `docs/superpowers/specs/2026-09-01-stage-6-9-evidence-comparison-release-design.md`

## Global Constraints

- Pin every dependency exactly and commit `package-lock.json`.
- Use publishable and secret Supabase API keys; do not introduce new legacy `anon` or `service_role` key usage.
- Never expose `SUPABASE_SECRET_KEY` through `NEXT_PUBLIC_`, props, logs, fixtures, or generated browser bundles.
- Enable RLS on every table in `public`; `anon` and `authenticated` receive no write policy.
- Explicitly grant Data API access because new Supabase projects no longer auto-expose new `public` tables.
- Raw observations are public only when source, dataset, and observation redistribution permissions are all `allowed`.
- Keep all scientific validation, normalization, and conversion outside React.
- The EIA reference record proves ingestion only; its metric release stays `unreviewed` and feature-disabled.
- Use `supabase migration new` to create migration files; never invent migration timestamps.
- Read `https://supabase.com/changelog.md` and the repository's current `node_modules/next/dist/docs/` guidance again immediately before implementation.

---

### Task 1: Pin the Supabase toolchain and server-only environment contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `lib/env/public.ts`
- Modify: `lib/env/server.ts`
- Modify: `tests/environment.test.ts`
- Modify: `tests/server-environment.test.ts`
- Create: `lib/supabase/client-config.ts`
- Test: `lib/supabase/client-config.test.ts`

**Interfaces:**
- Produces: `SupabasePublicConfig`, `SupabaseServerConfig`, `getSupabasePublicConfig(input)`, and `getSupabaseServerConfig(input)`.
- Consumes: the existing Zod environment parsing pattern.

- [ ] **Step 1: Write failing environment tests**

```ts
it("accepts a complete server-only Supabase configuration", () => {
  expect(
    getSupabaseServerConfig({
      SUPABASE_SECRET_KEY: "sb_secret_test",
      SUPABASE_URL: "https://project.supabase.co",
    }),
  ).toEqual({
    secretKey: "sb_secret_test",
    url: "https://project.supabase.co",
  });
});

it("rejects a partial server-only Supabase configuration", () => {
  expect(() =>
    getSupabaseServerConfig({ SUPABASE_URL: "https://project.supabase.co" }),
  ).toThrow(/configured together/i);
});
```

- [ ] **Step 2: Run the focused tests and confirm the missing exports fail**

Run: `npm test -- tests/environment.test.ts tests/server-environment.test.ts lib/supabase/client-config.test.ts`  
Expected: FAIL because `lib/supabase/client-config.ts` does not exist.

- [ ] **Step 3: Install the exact dependencies and scripts**

Run:

```bash
npm install --save-exact @supabase/supabase-js@2.112.4
npm install --save-dev --save-exact supabase@2.116.0 tsx@4.23.13
```

Add scripts:

```json
{
  "db:start": "supabase start",
  "db:reset": "supabase db reset --local",
  "db:test": "supabase test db",
  "db:lint": "supabase db lint --local --level warning",
  "db:advisors": "supabase db advisors --local",
  "db:types": "supabase gen types typescript --local",
  "evidence:ingest": "tsx scripts/evidence/ingest.ts"
}
```

- [ ] **Step 4: Implement strict environment parsing**

```ts
const SupabaseServerEnvironmentSchema = z
  .object({
    SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_").optional(),
    SUPABASE_URL: z.url().optional(),
  })
  .superRefine((value, context) => {
    if (Boolean(value.SUPABASE_URL) !== Boolean(value.SUPABASE_SECRET_KEY)) {
      context.addIssue({
        code: "custom",
        message: "SUPABASE_URL and SUPABASE_SECRET_KEY must be configured together.",
      });
    }
  });
```

Document `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY` in `.env.example` with empty values only.

- [ ] **Step 5: Run focused and environment verification**

Run: `npm test -- tests/environment.test.ts tests/server-environment.test.ts lib/supabase/client-config.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit the toolchain contract**

```bash
git add package.json package-lock.json .env.example lib/env lib/supabase/client-config.ts lib/supabase/client-config.test.ts tests/environment.test.ts tests/server-environment.test.ts
git commit -m "build: add pinned supabase toolchain"
```

---

### Task 2: Define ingestion manifests and immutable version identifiers

**Files:**
- Create: `data/schemas/ingestion-manifest.ts`
- Modify: `lib/evidence/schemas.ts`
- Create: `data/ingestion/checksum.ts`
- Create: `data/ingestion/version.ts`
- Create: `data/ingestion/types.ts`
- Test: `data/ingestion/checksum.test.ts`
- Test: `data/ingestion/version.test.ts`
- Test: `data/schemas/ingestion-manifest.test.ts`

**Interfaces:**
- Produces: `IngestionManifestSchema`, `IngestionManifest`, `sha256(bytes)`, and `createIdempotencyKey(input)`.
- Consumes: Stage 5 identifier, licence, source-tier, and unit conventions.

- [ ] **Step 1: Write failing manifest and checksum tests**

```ts
it("creates a stable idempotency key from identity, checksum, and transform", () => {
  expect(
    createIdempotencyKey({
      datasetId: "eia-capacity-factor",
      sourceVersion: "2026-08",
      inputChecksum: "abc123",
      transformationVersion: "1.0.0",
    }),
  ).toBe(
    "eia-capacity-factor:2026-08:abc123:1.0.0",
  );
});

it("rejects manifests whose declared checksum is not sha256", () => {
  expect(() => IngestionManifestSchema.parse({ ...validManifest, checksum: "abc" }))
    .toThrow(/sha256/i);
});
```

- [ ] **Step 2: Run the tests and confirm they fail before implementation**

Run: `npm test -- data/ingestion data/schemas/ingestion-manifest.test.ts`  
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement the manifest schema**

Export the existing `IdentifierSchema`, `LicenseSchema`, and `SourceTierSchema`
from `lib/evidence/schemas.ts` so ingestion and publication share one validator
instead of copying scientific governance rules.

The strict schema must include:

```ts
export const IngestionManifestSchema = z
  .object({
    datasetId: IdentifierSchema,
    sourceId: IdentifierSchema,
    sourceVersion: z.string().trim().min(1),
    sourceUrl: z.url(),
    accessDate: z.iso.date(),
    licence: LicenseSchema,
    sourceTier: SourceTierSchema,
    conflictDisclosure: z.string().trim().min(1),
    checksumAlgorithm: z.literal("sha256"),
    checksum: z.string().regex(/^[a-f0-9]{64}$/),
    parserId: IdentifierSchema,
    transformationVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    canonicalUnits: z.record(IdentifierSchema, z.string().trim().min(1)),
    reviewerRoles: z.array(z.enum(["scientific", "editorial", "licensing"])).min(2),
    redistribution: z.enum(["allowed", "restricted", "unknown"]),
  })
  .strict()
  .readonly();
```

- [ ] **Step 4: Implement hashing and stable idempotency**

Use `node:crypto` SHA-256, accept `Uint8Array`, return lowercase hex, and build the key from normalized manifest fields without dates or local file paths.

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- data/ingestion data/schemas/ingestion-manifest.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit the ingestion contracts**

```bash
git add data/schemas data/ingestion
git commit -m "feat: define evidence ingestion manifests"
```

---

### Task 3: Create the versioned PostgreSQL evidence schema and RLS policies

**Files:**
- Create through CLI: `supabase/config.toml`
- Create through CLI: migration ending `_evidence_core.sql`
- Create through CLI: migration ending `_evidence_publication_rls.sql`
- Create: `supabase/tests/database/01_evidence_constraints.test.sql`
- Create: `supabase/tests/database/02_evidence_rls.test.sql`
- Create: `supabase/tests/database/03_publication_transitions.test.sql`
- Create: `supabase/seed.sql`
- Create/generated: `lib/supabase/database.types.ts`

**Interfaces:**
- Produces: the tables and policies defined by the approved spec plus `public.activate_metric_release(metric_id text, dataset_version_id text, reason text)` callable only by the secret-key database role.
- Consumes: Stage 5 publication states and availability modes.

- [ ] **Step 1: Initialize Supabase and create empty migrations with verified CLI commands**

Run:

```bash
npx supabase init
npx supabase migration new evidence_core
npx supabase migration new evidence_publication_rls
```

Edit the two paths printed by the CLI; keep their generated timestamps unchanged.

- [ ] **Step 2: Write pgTAP tests before filling the migrations**

```sql
begin;
select plan(6);
select has_table('public', 'observations');
select has_table('public', 'dataset_versions');
select has_table('private', 'ingestion_runs');
select is(
  (select relrowsecurity from pg_class where oid = 'public.observations'::regclass),
  true,
  'observations has row-level security enabled'
);
select throws_ok(
  $$ insert into public.observations (id) values ('invalid') $$,
  null,
  null,
  'incomplete observations are rejected'
);
select isnt_empty(
  $$ select indexname from pg_indexes where tablename = 'observations' and indexname = 'observations_published_lookup_idx' $$,
  'published lookup has a supporting index'
);
select * from finish();
rollback;
```

- [ ] **Step 3: Start local Supabase and verify the tests fail**

Run: `npm run db:start`  
Run: `npm run db:reset`  
Run: `npm run db:test`  
Expected: FAIL because the evidence tables do not exist.

- [ ] **Step 4: Implement the core schema migration**

Create enum/check domains for publication status, value kind, availability,
redistribution, source tier, geography scope, range kind, and ingestion status.
Create every table listed in the spec with UUID-independent text identifiers,
foreign keys, `timestamptz` operational timestamps, `date` evidence dates, and
`jsonb` only for ordered transformation parameters and allowlisted arrays.

The observation value constraint must be equivalent to:

```sql
check (
  (value_kind = 'numeric' and value_semantics = 'point' and value is not null
    and lower_value is null and upper_value is null and category_value is null)
  or
  (value_kind = 'numeric' and value_semantics = 'range' and value is null
    and lower_value is not null and representative_value is not null
    and upper_value is not null and lower_value <= representative_value
    and representative_value <= upper_value and category_value is null)
  or
  (value_kind = 'categorical' and value_semantics = 'categorical'
    and category_value is not null and unit is null and value is null
    and lower_value is null and upper_value is null)
)
```

Add composite uniqueness for dataset version plus observation identity and
partial indexes for published metric/technology/geography queries.

- [ ] **Step 5: Implement publication and RLS migration**

Enable RLS on every `public` table. Grant `USAGE` on `public` and `SELECT` on
public evidence tables to `anon` and `authenticated`; revoke all write
privileges. Policies must require published entity records, published active
dataset versions, and redistribution permission for observation-level reads.
Use `TO anon, authenticated`; do not use deprecated `auth.role()`.

The activation function must live in `private`, use a fixed `search_path`,
recheck publication eligibility, update one active version transactionally,
and append a `private.release_operations` record. Revoke its default public
execute privilege and grant it only to the privileged backend role.

- [ ] **Step 6: Apply migrations, run pgTAP, lint, and advisors**

Run:

```bash
npm run db:reset
npm run db:test
npm run db:lint
npm run db:advisors
```

Expected: all tests pass; lint and advisors report no security or performance errors.

- [ ] **Step 7: Generate and format database types**

Run: `npm run db:types -- > lib/supabase/database.types.ts`  
Run: `npx prettier --write lib/supabase/database.types.ts`  
Expected: generated `Database` contains all public evidence tables and RPC types.

- [ ] **Step 8: Commit the database boundary**

```bash
git add supabase lib/supabase/database.types.ts
git commit -m "feat: add versioned evidence database"
```

---

### Task 4: Implement local and Supabase evidence repositories

**Files:**
- Create: `lib/evidence/repository.ts`
- Create: `lib/evidence/repository-contract.ts`
- Create: `lib/evidence/local-repository.ts`
- Create: `lib/evidence/local-repository.test.ts`
- Create: `lib/supabase/server-client.ts`
- Create: `lib/supabase/published-evidence-repository.ts`
- Create: `lib/supabase/published-evidence-repository.integration.test.ts`
- Modify: `lib/evidence/index.ts`

**Interfaces:**
- Produces: `EvidenceRepository`, `ObservationQuery`, `MetricRelease`, `LocalEvidenceRepository`, `SupabaseEvidenceRepository`, and `runEvidenceRepositoryContract(createRepository)`.
- Consumes: generated `Database`, Stage 5 `Metric`, `Observation`, `Technology`, and `Geography`.

- [ ] **Step 1: Write the shared repository contract first**

```ts
export interface EvidenceRepository {
  getMetricDefinition(metricId: string): Promise<Metric | null>;
  listMetricReleases(): Promise<readonly MetricRelease[]>;
  listTechnologies(): Promise<readonly Technology[]>;
  listGeographies(metricId: string): Promise<readonly Geography[]>;
  getPublishedObservations(
    query: ObservationQuery,
  ): Promise<readonly Observation[]>;
}
```

The contract suite must assert stable ordering, missing metric behavior,
technology/geography filtering, active-version filtering, no draft leakage,
and deep-frozen returned records.

- [ ] **Step 2: Run the local contract and confirm it fails**

Run: `npm test -- lib/evidence/local-repository.test.ts`  
Expected: FAIL because the repository implementation is missing.

- [ ] **Step 3: Implement `LocalEvidenceRepository`**

Accept a validated `EvidenceSnapshot` in the constructor. Clone and deeply
freeze inputs, return only published records from the active release version,
and never fall back to `preview-data.ts`.

- [ ] **Step 4: Run the local repository contract**

Run: `npm test -- lib/evidence/local-repository.test.ts`  
Expected: PASS.

- [ ] **Step 5: Write the Supabase integration contract and server client**

```ts
export function createSupabaseServerClient(config: SupabaseServerConfig) {
  return createClient<Database>(config.url, config.secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
```

The adapter must select explicit columns, validate every mapped row through
Stage 5 schemas, and convert database snake_case only in the adapter.

- [ ] **Step 6: Run local database integration tests**

Run: `npm run db:reset`  
Run: `npm test -- lib/supabase/published-evidence-repository.integration.test.ts`  
Expected: PASS against seeded synthetic records.

- [ ] **Step 7: Commit repository adapters**

```bash
git add lib/evidence lib/supabase
git commit -m "feat: add evidence repository adapters"
```

---

### Task 5: Build deterministic ingestion, review, and publication services

**Files:**
- Create: `data/ingestion/parser-registry.ts`
- Create: `data/ingestion/quality.ts`
- Create: `data/ingestion/pipeline.ts`
- Create: `data/ingestion/publication.ts`
- Create: `data/ingestion/pipeline.test.ts`
- Create: `data/ingestion/publication.integration.test.ts`
- Create: `scripts/evidence/ingest.ts`

**Interfaces:**
- Produces: `EvidenceParser`, `ParserRegistry`, `runIngestion(input, dependencies)`, `reviewDatasetVersion(input)`, and `publishDatasetVersion(input)`.
- Consumes: `IngestionManifest`, Stage 5 validation/conversion, and privileged Supabase server client.

- [ ] **Step 1: Write failing pipeline tests for idempotency and atomicity**

```ts
it("returns the existing run for an identical idempotency key", async () => {
  const first = await runIngestion(input, dependencies);
  const second = await runIngestion(input, dependencies);
  expect(second).toEqual(first);
  expect(dependencies.store.createDatasetVersion).toHaveBeenCalledTimes(1);
});

it("does not publish when one observation fails unit validation", async () => {
  await expect(runIngestion(invalidUnitInput, dependencies)).rejects.toThrow(
    /unsupported unit/i,
  );
  expect(dependencies.store.publishVersion).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- data/ingestion/pipeline.test.ts`  
Expected: FAIL with missing pipeline exports.

- [ ] **Step 3: Implement the ordered pipeline**

```ts
export async function runIngestion(
  input: IngestionInput,
  dependencies: IngestionDependencies,
): Promise<IngestionResult> {
  const bytes = await dependencies.files.read(input.artifactPath);
  const checksum = sha256(bytes);
  assertChecksum(input.manifest, checksum);
  const idempotencyKey = createIdempotencyKey({
    datasetId: input.manifest.datasetId,
    sourceVersion: input.manifest.sourceVersion,
    inputChecksum: checksum,
    transformationVersion: input.manifest.transformationVersion,
  });
  return dependencies.store.inTransaction(async (store) => {
    const existing = await store.findCompletedRun(idempotencyKey);
    if (existing) return existing;
    const parsed = await dependencies.parsers.parse(input.manifest.parserId, bytes);
    const validated = validateAndNormalize(parsed, input.manifest);
    return store.persistDraft({ idempotencyKey, manifest: input.manifest, validated });
  });
}
```

Record one ordered ingestion event per lifecycle step. Duplicate observation
identities fail before persistence. Publication requires separate scientific,
editorial, and licensing review records and reuses `canPublishObservation`.

- [ ] **Step 4: Implement the CLI without network acquisition**

Support:

```bash
npm run evidence:ingest -- ingest --manifest data/sources/eia-capacity-factor/manifest.json --artifact data/sources/eia-capacity-factor/source.csv
npm run evidence:ingest -- review --dataset-version eia-capacity-factor-2026-08 --role scientific --reviewer reviewer-id
npm run evidence:ingest -- publish --dataset-version eia-capacity-factor-2026-08
npm run evidence:ingest -- rollback --metric capacity-factor --dataset-version eia-capacity-factor-previous --reason "verified rollback drill"
```

Reject unknown flags, never print secrets, and emit a JSON summary containing
only run identifiers, counts, status, and checksum.

- [ ] **Step 5: Run unit and local database integration tests**

Run: `npm test -- data/ingestion`  
Run: `npm test -- data/ingestion/publication.integration.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit ingestion services**

```bash
git add data/ingestion scripts/evidence
git commit -m "feat: add deterministic evidence ingestion"
```

---

### Task 6: Prove the pipeline with a licensed EIA reference observation

**Files:**
- Create: `data/sources/eia-capacity-factor/README.md`
- Create: `data/sources/eia-capacity-factor/manifest.json`
- Create: `data/sources/eia-capacity-factor/source.csv`
- Create: `data/sources/eia-capacity-factor/parser.ts`
- Test: `data/sources/eia-capacity-factor/parser.test.ts`
- Create: `docs/evidence/reviews/2026-09-01-eia-capacity-factor.md`

**Interfaces:**
- Produces: parser ID `eia-capacity-factor-csv` and one feature-disabled, published reference dataset version.
- Consumes: EIA public-domain reuse policy, EIA capacity-factor source artifact, and the Stage 6 pipeline.

- [ ] **Step 1: Record source and licence provenance before parsing**

The review must link:

- `https://www.eia.gov/about/copyrights_reuse.php`;
- the exact EIA table or API artifact URL used;
- access date `2026-09-01` or the actual later acquisition date;
- the downloaded artifact's SHA-256 checksum;
- source tier A, conflict disclosure, methodology, geography, period, unit, and
  the reason the record is feature-disabled.

- [ ] **Step 2: Write a parser test against the acquired artifact**

```ts
it("maps the reviewed EIA row without changing the source value", async () => {
  const records = await parseEiaCapacityFactorCsv(fixtureBytes);
  expect(records[0]).toMatchObject({
    geographyId: "united-states",
    metricId: "capacity-factor",
    rawAccess: "permitted",
    unit: "%",
  });
  expect(records[0].transformation).toEqual([
    { kind: "identity", description: "Parsed from the reviewed EIA row." },
  ]);
});
```

Do not hard-code the source numeric value in React or in the parser. The parser
reads it from the checked artifact; the test may assert the reviewed literal.

- [ ] **Step 3: Run the parser test and confirm failure before implementation**

Run: `npm test -- data/sources/eia-capacity-factor/parser.test.ts`  
Expected: FAIL because the parser is missing.

- [ ] **Step 4: Implement and register the parser**

Parse only the reviewed columns, reject duplicate or missing rows, preserve the
source precision, attach an identity transformation, and return Stage 5
`ObservationSchema` inputs.

- [ ] **Step 5: Run the complete local lifecycle**

Run:

```bash
npm run db:reset
npm run evidence:ingest -- ingest --manifest data/sources/eia-capacity-factor/manifest.json --artifact data/sources/eia-capacity-factor/source.csv
npm run evidence:ingest -- review --dataset-version eia-capacity-factor-2026-08 --role scientific --reviewer stage-6-reviewer
npm run evidence:ingest -- review --dataset-version eia-capacity-factor-2026-08 --role editorial --reviewer stage-6-reviewer
npm run evidence:ingest -- review --dataset-version eia-capacity-factor-2026-08 --role licensing --reviewer stage-6-reviewer
npm run evidence:ingest -- publish --dataset-version eia-capacity-factor-2026-08
```

Expected: one immutable published version, full provenance, and a metric release
whose availability remains `unreviewed` with no available modes.

- [ ] **Step 6: Run idempotency and rollback drills**

Repeat the ingest command and verify no second version is created. Ingest a
checksum-changed reviewed fixture as a second version, publish it, reactivate
the first version with the rollback command, and verify both versions and the
append-only operation log remain present.

- [ ] **Step 7: Commit the reviewed reference proof**

```bash
git add data/sources/eia-capacity-factor docs/evidence/reviews/2026-09-01-eia-capacity-factor.md
git commit -m "data: prove versioned evidence ingestion"
```

---

### Task 7: Add CI database verification and Stage 6 evidence

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `docs/engineering/ENVIRONMENT-SETUP.md`
- Modify: `docs/product/DELIVERY-TRACKER.md`
- Create: `docs/engineering/verification/2026-09-01-stage-6-supabase-ingestion.md`

**Interfaces:**
- Produces: reproducible local/CI commands and authoritative Stage 6 gate evidence.
- Consumes: all Stage 6 verification outputs.

- [ ] **Step 1: Add a database CI job**

The job checks out code, installs Node 24.20.0 dependencies, starts Supabase,
resets migrations, runs pgTAP, database lint/advisors, repository integration
tests, and stops Supabase in an `if: always()` step.

- [ ] **Step 2: Run the complete Stage 6 suite locally**

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
npm audit --audit-level=high
```

Expected: every command exits 0 and the audit reports no high-severity vulnerabilities.

- [ ] **Step 3: Record verification and update the tracker conservatively**

Mark Stage 6 complete only if migrations, RLS, the real reference lifecycle,
idempotency, and rollback all passed. Otherwise mark it in progress and list
the exact missing gate.

- [ ] **Step 4: Commit Stage 6 verification**

```bash
git add .github/workflows/ci.yml README.md docs/engineering docs/product/DELIVERY-TRACKER.md
git commit -m "docs: record stage 6 verification"
```
