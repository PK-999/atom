begin;

select plan(12);

insert into public.technologies (
  id, name, description, lifecycle_status, publication_status,
  reviewed_by, reviewed_at, published_at
) values
  ('rls-tech-published', 'Published technology', 'Published test technology.', 'operating', 'published', 'reviewer', now(), now()),
  ('rls-tech-draft', 'Draft technology', 'Draft test technology.', 'operating', 'draft', null, null, null);

insert into public.geographies (
  id, name, scope, publication_status, reviewed_by, reviewed_at, published_at
) values
  ('rls-geo-published', 'Published geography', 'country', 'published', 'reviewer', now(), now()),
  ('rls-geo-draft', 'Draft geography', 'country', 'draft', null, null, null);

insert into public.metrics (
  id, canonical_unit, supported_units, value_kind, range_semantics, representative_rule,
  geography_support, definition, explanation_content, registry_category,
  publication_status, reviewed_by, reviewed_at, published_at
) values
  ('rls-metric', 'percent', array['percent'], 'numeric', 'point-or-range', 'source-observation',
    array['country']::public.geography_scope[], 'A test metric.', 'A test explanation.', 'reliability',
    'published', 'reviewer', now(), now());

insert into public.sources (
  id, source_tier, title, publisher, url, conflict_disclosure, licence_name,
  redistribution, published_on, accessed_on, last_verified_on,
  publication_status, reviewed_by, reviewed_at, published_at
) values
  ('rls-source-allowed', 'A', 'Allowed source', 'Institution', 'https://example.com/allowed',
    'No conflict.', 'Public domain', 'allowed', date '2026-01-01', date '2026-01-02', date '2026-01-02',
    'published', 'reviewer', now(), now()),
  ('rls-source-restricted', 'A', 'Restricted source', 'Institution', 'https://example.com/restricted',
    'No conflict.', 'Restricted', 'restricted', date '2026-01-01', date '2026-01-02', date '2026-01-02',
    'published', 'reviewer', now(), now());

insert into public.studies (
  id, source_id, title, methodology, system_boundary, period_start_year,
  period_end_year, publication_label, publication_status, reviewed_by,
  reviewed_at, published_at
) values
  ('rls-study', 'rls-source-allowed', 'Published study', 'A complete test methodology.',
    'A complete test boundary.', 2025, 2025, 'v1', 'published', 'reviewer', now(), now());

insert into public.datasets (
  id, source_id, title, publisher, licence_name, redistribution, raw_access,
  publication_status, reviewed_by, reviewed_at, published_at
) values
  ('rls-dataset', 'rls-source-allowed', 'Published dataset', 'Institution', 'Public domain',
    'allowed', 'permitted', 'published', 'reviewer', now(), now()),
  ('rls-dataset-restricted', 'rls-source-restricted', 'Restricted dataset', 'Institution', 'Restricted',
    'restricted', 'restricted', 'published', 'reviewer', now(), now());

insert into public.dataset_versions (
  id, dataset_id, checksum_algorithm, checksum_digest, acquired_on,
  transformation_version, publication_status, reviewed_by, reviewed_at, published_at
) values
  ('rls-version-active', 'rls-dataset', 'sha256', repeat('a', 64), date '2026-01-02', '1.0.0',
    'in-review', 'reviewer', now(), null),
  ('rls-version-inactive', 'rls-dataset', 'sha256', repeat('b', 64), date '2026-01-02', '1.0.1',
    'in-review', 'reviewer', now(), null),
  ('rls-version-draft', 'rls-dataset', 'sha256', repeat('c', 64), date '2026-01-02', '1.0.2',
    'in-review', 'reviewer', now(), null),
  ('rls-version-restricted', 'rls-dataset-restricted', 'sha256', repeat('d', 64), date '2026-01-02', '1.0.0',
    'in-review', 'reviewer', now(), null);

insert into public.observations (
  id, metric_id, technology_id, geography_id, study_id, source_id,
  dataset_version_id, value_kind, value_semantics, value, unit,
  representative_kind, methodology, system_boundary, period_start_year,
  period_end_year, uncertainty, last_verified_on, raw_access, redistribution,
  publication_status, reviewed_by, reviewed_at, published_at
) values
  ('rls-observation-visible', 'rls-metric', 'rls-tech-published', 'rls-geo-published', 'rls-study',
    'rls-source-allowed', 'rls-version-active', 'numeric', 'point', 91, 'percent',
    'source-observation', 'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-01-02', 'permitted', 'allowed',
    'published', 'reviewer', now(), now()),
  ('rls-observation-draft', 'rls-metric', 'rls-tech-published', 'rls-geo-published', 'rls-study',
    'rls-source-allowed', 'rls-version-active', 'numeric', 'point', 90, 'percent',
    'source-observation', 'A complete test methodology.', 'A complete test boundary.', 2024, 2024,
    'A complete test uncertainty note.', date '2026-01-02', 'permitted', 'allowed',
    'draft', null, null, null),
  ('rls-observation-inactive', 'rls-metric', 'rls-tech-published', 'rls-geo-published', 'rls-study',
    'rls-source-allowed', 'rls-version-inactive', 'numeric', 'point', 89, 'percent',
    'source-observation', 'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-01-02', 'permitted', 'allowed',
    'published', 'reviewer', now(), now()),
  ('rls-observation-unreviewed-version', 'rls-metric', 'rls-tech-published', 'rls-geo-published', 'rls-study',
    'rls-source-allowed', 'rls-version-draft', 'numeric', 'point', 88, 'percent',
    'source-observation', 'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-01-02', 'permitted', 'allowed',
    'published', 'reviewer', now(), now()),
  ('rls-observation-restricted', 'rls-metric', 'rls-tech-published', 'rls-geo-published', 'rls-study',
    'rls-source-restricted', 'rls-version-restricted', 'numeric', 'point', 87, 'percent',
    'source-observation', 'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-01-02', 'restricted', 'restricted',
    'published', 'reviewer', now(), now());

update public.dataset_versions
set publication_status = 'published',
    published_at = now()
where id in ('rls-version-active', 'rls-version-inactive', 'rls-version-restricted');

insert into public.metric_releases (
  metric_id, availability_status, active_dataset_version_id, technology_ids,
  geography_ids, period_start_year, period_end_year, typical_mode, range_mode,
  raw_mode, redistribution_decision, message, feature_enabled,
  publication_status, reviewed_by, reviewed_at, published_at
) values (
  'rls-metric', 'supported', 'rls-version-active', array['rls-tech-published'],
  array['rls-geo-published'], 2025, 2025, 'available', 'available', 'available',
  'allowed', 'Test release is enabled.', true, 'published', 'reviewer', now(), now()
);

set local role anon;

select results_eq(
  $$ select id::text from public.technologies order by id $$,
  $$ values ('rls-tech-published'::text) $$,
  'anon sees only published technologies'
);

select results_eq(
  $$ select id::text from public.geographies order by id $$,
  $$ values ('rls-geo-published'::text) $$,
  'anon sees only published geographies'
);

select results_eq(
  $$ select id::text from public.observations order by id $$,
  $$ values ('rls-observation-visible'::text) $$,
  'anon sees only the published permitted observation on the active release graph'
);

select is((select count(*) from public.dataset_versions), 1::bigint, 'anon sees only the active published dataset version');
select is((select count(*) from public.metric_releases), 1::bigint, 'anon sees the published release registry record');

select throws_ok(
  $$ insert into public.technologies (id, name, description, lifecycle_status) values ('anon-write', 'No', 'No write.', 'operating') $$,
  '42501',
  null,
  'anon cannot insert public evidence'
);

reset role;
update public.metric_releases set feature_enabled = false where metric_id = 'rls-metric';
set local role anon;

select is((select count(*) from public.observations), 0::bigint, 'feature-disabled releases expose no observations');

reset role;
update public.metric_releases set feature_enabled = true, raw_mode = 'restricted' where metric_id = 'rls-metric';
set local role anon;

select is((select count(*) from public.observations), 0::bigint, 'a release without Raw permission exposes no observations');

reset role;
update public.metric_releases
set feature_enabled = false,
    raw_mode = 'available',
    publication_status = 'withdrawn'
where metric_id = 'rls-metric';
set local role anon;

select is((select count(*) from public.observations), 0::bigint, 'withdrawn releases expose no observations');

reset role;
select ok(not has_table_privilege('anon', 'private.ingestion_runs', 'SELECT'), 'anon cannot read ingestion runs');
select ok(not has_table_privilege('authenticated', 'private.release_operations', 'SELECT'), 'authenticated cannot read release operations');
select ok(not has_function_privilege('anon', 'private.activate_metric_release(text,text,text)', 'EXECUTE'), 'anon cannot execute release activation');

select * from finish();
rollback;
