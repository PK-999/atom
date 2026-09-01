begin;

select plan(13);

select has_function(
  'private',
  'activate_metric_release',
  array['text', 'text', 'text'],
  'the privileged activation function is private'
);

select ok(
  has_function_privilege('service_role', 'private.activate_metric_release(text,text,text)', 'EXECUTE'),
  'service_role can execute release activation'
);

select ok(
  not has_function_privilege('anon', 'private.activate_metric_release(text,text,text)', 'EXECUTE'),
  'public execute is revoked for the anonymous role'
);

select ok(
  not has_function_privilege('authenticated', 'private.activate_metric_release(text,text,text)', 'EXECUTE'),
  'authenticated cannot execute release activation'
);

insert into public.technologies (
  id, name, description, lifecycle_status, publication_status, reviewed_by, reviewed_at, published_at
) values ('transition-tech', 'Transition technology', 'Published test technology.', 'operating', 'published', 'reviewer', now(), now());

insert into public.geographies (
  id, name, scope, publication_status, reviewed_by, reviewed_at, published_at
) values ('transition-geo', 'Transition geography', 'country', 'published', 'reviewer', now(), now());

insert into public.metrics (
  id, canonical_unit, supported_units, value_kind, range_semantics, representative_rule, geography_support,
  definition, explanation_content, registry_category, publication_status,
  reviewed_by, reviewed_at, published_at
) values (
  'transition-metric', 'percent', array['percent'], 'numeric', 'point-or-range', 'source-observation',
  array['country']::public.geography_scope[], 'A test metric.', 'A test explanation.',
  'reliability', 'published', 'reviewer', now(), now()
);

insert into public.sources (
  id, source_tier, title, publisher, url, conflict_disclosure, licence_name,
  redistribution, published_on, accessed_on, last_verified_on,
  publication_status, reviewed_by, reviewed_at, published_at
) values (
  'transition-source', 'A', 'Transition source', 'Institution', 'https://example.com/transition',
  'No conflict.', 'Public domain', 'allowed', date '2026-01-01', date '2026-01-02', date '2026-01-02',
  'published', 'reviewer', now(), now()
);

insert into public.studies (
  id, source_id, title, methodology, system_boundary, period_start_year, period_end_year,
  publication_label, publication_status, reviewed_by, reviewed_at, published_at
) values (
  'transition-study', 'transition-source', 'Transition study', 'A complete test methodology.',
  'A complete test boundary.', 2025, 2025, 'v1', 'published', 'reviewer', now(), now()
);

insert into public.datasets (
  id, source_id, title, publisher, licence_name, redistribution, raw_access,
  publication_status, reviewed_by, reviewed_at, published_at
) values (
  'transition-dataset', 'transition-source', 'Transition dataset', 'Institution', 'Public domain',
  'allowed', 'permitted', 'published', 'reviewer', now(), now()
);

insert into public.dataset_versions (
  id, dataset_id, checksum_algorithm, checksum_digest, acquired_on,
  transformation_version, supersedes_version_id, publication_status,
  reviewed_by, reviewed_at, published_at
) values
  ('transition-version-1', 'transition-dataset', 'sha256', repeat('1', 64), date '2026-01-02', '1.0.0', null,
    'published', 'reviewer', now(), now()),
  ('transition-version-2', 'transition-dataset', 'sha256', repeat('2', 64), date '2026-02-02', '1.1.0', 'transition-version-1',
    'published', 'reviewer', now(), now()),
  ('transition-version-draft', 'transition-dataset', 'sha256', repeat('3', 64), date '2026-03-02', '1.2.0', 'transition-version-2',
    'in-review', 'reviewer', now(), null);

insert into public.observations (
  id, metric_id, technology_id, geography_id, study_id, source_id, dataset_version_id,
  value_kind, value_semantics, value, unit, representative_kind, methodology,
  system_boundary, period_start_year, period_end_year, uncertainty,
  last_verified_on, raw_access, redistribution, publication_status,
  reviewed_by, reviewed_at, published_at
) values
  ('transition-observation-1', 'transition-metric', 'transition-tech', 'transition-geo', 'transition-study',
    'transition-source', 'transition-version-1', 'numeric', 'point', 90, 'percent', 'source-observation',
    'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-01-02', 'permitted', 'allowed',
    'published', 'reviewer', now(), now()),
  ('transition-observation-2', 'transition-metric', 'transition-tech', 'transition-geo', 'transition-study',
    'transition-source', 'transition-version-2', 'numeric', 'point', 91, 'percent', 'source-observation',
    'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-02-02', 'permitted', 'allowed',
    'published', 'reviewer', now(), now()),
  ('transition-observation-draft', 'transition-metric', 'transition-tech', 'transition-geo', 'transition-study',
    'transition-source', 'transition-version-draft', 'numeric', 'point', 92, 'percent', 'source-observation',
    'A complete test methodology.', 'A complete test boundary.', 2025, 2025,
    'A complete test uncertainty note.', date '2026-03-02', 'permitted', 'allowed',
    'draft', null, null, null);

insert into public.metric_releases (
  metric_id, availability_status, active_dataset_version_id, technology_ids,
  geography_ids, period_start_year, period_end_year, typical_mode, range_mode,
  raw_mode, redistribution_decision, message, feature_enabled,
  publication_status, reviewed_by, reviewed_at, published_at
) values (
  'transition-metric', 'supported', 'transition-version-1', array['transition-tech'],
  array['transition-geo'], 2025, 2025, 'available', 'available', 'available',
  'allowed', 'Test release.', true, 'published', 'reviewer', now(), now()
);

set local role service_role;

select lives_ok(
  $$ select private.activate_metric_release('transition-metric', 'transition-version-2', 'publish reviewed successor') $$,
  'a reviewed published successor can be activated'
);

reset role;

select is(
  (select active_dataset_version_id::text from public.metric_releases where metric_id = 'transition-metric'),
  'transition-version-2',
  'activation changes the active dataset version pointer'
);

select is(
  (select operation from private.release_operations where metric_id = 'transition-metric' order by occurred_at desc, id desc limit 1),
  'activation',
  'successor activation appends an activation audit record'
);

set local role service_role;

select throws_ok(
  $$ select private.activate_metric_release('transition-metric', 'transition-version-draft', 'must fail') $$,
  '55000',
  null,
  'an unpublished target version is rejected'
);

reset role;

select is(
  (select active_dataset_version_id::text from public.metric_releases where metric_id = 'transition-metric'),
  'transition-version-2',
  'a failed activation leaves the pointer unchanged'
);

select is((select count(*) from private.release_operations where metric_id = 'transition-metric'), 1::bigint, 'a failed activation appends no audit record');

set local role service_role;

select lives_ok(
  $$ select private.activate_metric_release('transition-metric', 'transition-version-1', 'verified rollback') $$,
  'a previously published version can be reactivated'
);

reset role;

select is(
  (select operation from private.release_operations where metric_id = 'transition-metric' order by occurred_at desc, id desc limit 1),
  'rollback',
  'reactivating a prior version appends a rollback audit record'
);

select is((select count(*) from public.dataset_versions where dataset_id = 'transition-dataset'), 3::bigint, 'rollback preserves every dataset version');

select * from finish();
rollback;
