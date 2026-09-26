# ADR 0010 — Reviewed files and immutable evidence serving

- Status: Accepted implementation decision under the approved E01 plan
- Date: 2026-09-26
- Scope: local evidence authoring/release serving; replaces the operational database publisher assumption in ADR 0009 for this application revision

## Finding

At `d59c3e0`, `obs-ghg-nuclear` is created by `rangeObs` with source `source-unece-2021`, study `study-unece-ipcc`, dataset `dataset-energy-synthesis`, and serving version `dataset-v2026-1`. The helper supplies every observation with 2018–2024, CC BY 4.0, a central estimate, percentile uncertainty, a verification date and published status. No corresponding source/study/dataset artifact or scientific/editorial/licensing review graph exists in the serving snapshot. A licence URL and an institution name do not establish reuse permission or review.

The old observations remain recoverable from Git at `d59c3e0`; they are not suitable test fixtures or a reviewed release. No replacement values or reviewer identities will be invented.

## Decision

Use checked-in evidence records and immutable local snapshots through the existing `EvidenceRepository`. This is the smaller of the E01 alternatives and requires no database, migration or service. Historical database authoring remains archived, not a second active authority. Any later database adapter must satisfy the same serving contract.

Each dataset version carries its exact dataset metadata, source artifact references (URL, locator, SHA-256), and separate scientific, editorial and licensing decisions. Each decision binds to the version ID and SHA-256 of the complete scientific payload, including observations, transformations, source/study metadata, and referenced metric/technology/geography definitions. Publication flags alone never confer eligibility.

The repository resolves every relationship and rechecks eligibility on direct reads. Missing relationships, draft/withdrawn parents, absent or mismatched decisions, changed payloads and restricted/unknown reuse fail closed. Activation validates the selected version; switching the active pointer leaves earlier versions unchanged so rollback does not rewrite history. A version ID cannot be reused with different content.

`data/evidence/release-records.json` is the authoring/release ledger; `data/evidence/catalog.json` holds the definitions included in review digests. `npm run evidence:check` validates the current ledger before every production build. CI compares both files with its base commit; Vercel builds use `VERCEL_GIT_PREVIOUS_SHA` when available ([Vercel system-variable contract](https://vercel.com/docs/environment-variables/system-environment-variables)). An unavailable supplied base or missing historical catalog fails the check rather than silently skipping history. `vercel.json` explicitly continues every build (`ignoreCommand: "exit 1"`); this enables Vercel’s previous-successful-deployment SHA without changing which commits build. Initial builds without a base validate the current snapshot only; repository review and branch protection remain necessary, and a checksum cannot authenticate a reviewer. Historical comparisons load JSON data, never execute code from another revision.

Review records are internal serving metadata, not client props. Public result projection continues to expose scientific provenance without distributing private reviewer details. Human qualification, editorial approval, artifact authenticity and licensing judgement remain actual review gates; checksums and schema tests do not prove truth, authorization or legal permission. Changes to approved records require repository review; test-only synthetic decisions are never imported into production.

## Consequences and rollout

The legacy snapshot has no eligible numerical releases. Comparison controls, metric descriptions and evidence drawers remain usable, but values without review records are explicitly unavailable and no interpretation is inferred from them. This is an intentional correction, not zero-valued evidence. E02 must supply actual artifacts and independent review before activating numbers again.

E01 tests cover missing/mismatched relationships, exact review binding, restricted reuse, activation, immutable history, rollback, direct-read bypass and input/output mutation. E02 and E04 still own real source review and public metadata route expansion. No external database will be read or written by this change.
