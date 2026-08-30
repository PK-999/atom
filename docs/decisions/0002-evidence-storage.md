# ADR 0002: Evidence Storage and Publication

- Status: Accepted
- Date: 2026-08-30

## Decision

Use PostgreSQL through Supabase for normalized evidence and publication state. Keep schemas, migrations, source manifests, checksums, and reproducible transformations in version control. Store raw files outside Git when their size or license requires it, while preserving stable identifiers and checksums.

Only reviewed, explicitly published dataset versions are readable by the public application. Draft evidence is never returned by public queries.

## Consequences

- React components never contain scientific source values.
- Every displayed observation can resolve to source, study, method, system boundary, transformation, and verification metadata.
- Dataset rollback is performed by publication version rather than destructive record replacement.
