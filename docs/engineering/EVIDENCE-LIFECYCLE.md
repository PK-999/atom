# Evidence lifecycle commands

The canonical write path is `scripts/evidence/ingest.ts` using the shipped
`server-adapter.ts` and pooled, parameterized Postgres store. Set the validated
server-only `SUPABASE_DATABASE_URL` in the invoking process. Commands do not
load `.env.local`, download sources, load arbitrary parser modules or create
reviewer identities. Never target an external database without its deployment
and evidence approvals. The old `lib/ingestion/pipeline.ts` is a fail-closed
tombstone; `scripts/seed-metrics.ts` must not be used as a publication shortcut.

The npm command enables Node's `react-server` condition so the `server-only`
package works in the privileged CLI while retaining Next.js client-import
protection. The pool closes in `finally`; no adapter environment hook is needed.

```bash
npm run evidence:ingest -- ingest --manifest /path/manifest.json --artifact /path/artifact.json
npm run evidence:ingest -- review --dataset-version VERSION --role scientific --reviewer REGISTERED_ID --artifact-checksum SHA256 --manifest-digest SHA256
npm run evidence:ingest -- publish --dataset-version VERSION
npm run evidence:ingest -- activate --metric METRIC --dataset-version VERSION --reason "Recorded release decision"
npm run evidence:ingest -- rollback --metric METRIC --dataset-version PRIOR_VERSION --reason "Recorded rollback decision"
npm run evidence:ingest -- withdraw --dataset-version INACTIVE_VERSION --reason "Recorded withdrawal decision"
```

Repeat the review command for three independent scientific, editorial and
licensing identities. An authorized operator separately registers supplied real
identities in `private.evidence_reviewers` with unique identity references and
approved roles. No registration command or automatic reviewer is provided.
Read manifest and artifact identities from `private.version_artifacts` only
after examining the corresponding artifact and review packet. Review timestamps
come from Postgres and retain microsecond precision during publication.

Source, dataset, study, metric, technology and geography records are separately
reviewed prerequisites. Ingestion binds source ID, URL, tier, access date,
conflict disclosure, licence ID/name/URL/redistribution, and dataset/source
relationship. Historical rows whose licence ID is unknown are not backfilled
with guessed IDs. Parser rows must be draft, correctly bound, unique by ID and
composite observation identity, and valid both before and after normalization.
The manifest target must exactly equal the metric's canonical unit.

Each attempt is created before reading or parsing the artifact. The key includes
dataset, source version, artifact checksum and transformation version; a
canonical SHA-256 additionally binds every manifest field. An exact successful
repeat returns its recorded result. A simultaneous in-progress attempt rejects
without starting a second writer. A failed attempt retains its events and
sanitized failure category and a retry creates a new attempt. Changing manifest
metadata under the same key rejects: declare a new source/transformation version
instead. PostgreSQL advisory locking and unique indexes enforce these decisions.

A crashed process can leave a running attempt. It is deliberately not stolen
after an arbitrary timeout. An operator must inspect that run and confirm the
original writer has stopped before marking it failed through the store's
`failRun` operation and retrying. Schema-invalid manifests cannot establish a
trusted dataset/run identity and fail before creating a run. Acquisition,
validation and persistence failures after a claim leave a durable audit row.
No SQL detail, artifact content, local path, credentials or provider message is
copied into the failure summary.

Versions, observation rows and transformations are written in one transaction.
Original row IDs are scoped by the new immutable version ID. The private
normalized payload is immutable and supplies the publication-domain contract;
public relational values and structured transformation rows are written in the
same transaction. Publication rechecks the current parent graph, restrictions,
review identities, timestamps and corrections before any state changes.
All observation/version/correction transitions commit atomically. Publication
does not create or enable a feature release. Activation requires a separately
reviewed release registry entry and calls `private.activate_metric_release`.

For corrections, a manifest declares `supersedesVersionId` plus `revision`
(decision date, reason, impact, affected source row IDs). Correction provenance
must connect the same logical dataset, and its date must fall between source
acquisition and observation verification. Material corrections are rechecked by
the scientific governance service. Previous versions and release operation
history remain available to privileged inspection. Withdrawal is terminal,
records an append-only reason and timestamp, and rejects a feature-active version.

## Disposable local verification

Only use the local `atom` database configured in `supabase/config.toml`. Reset
before each integration run: durable fixtures cannot be removed by ordinary
deletes because audit/version history is append-only. Tests use synthetic
values, licences, institutional labels and reviewer identities, never real
publication approvals. They must not be run against a hosted database.

Run database checks before the integration suites, which commit their synthetic
fixtures for second-connection verification:

```bash
npm run db:start
npm run db:reset
npm run db:test
npm run db:lint
npm run db:advisors
npm run db:types
npm run test:integration:supabase
npm run test:integration:ingestion
```

The repository integration suite requires the local `SUPABASE_URL` and
`SUPABASE_SECRET_KEY`; ingestion requires the local `ATOM_TEST_DATABASE_URL`.
Obtain them from local Supabase status without logging credentials. Explicit
integration scripts fail when configuration is absent. The ordinary unit suite
skips database suites unless their configuration is supplied.

No scientific or feature-release acceptance follows from these software tests.
The capacity-factor source packet remains awaiting actual acquisition and review.
