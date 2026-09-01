begin;

select plan(25);

select has_table('public', 'technologies', 'technologies exists');
select has_table('public', 'geographies', 'geographies exists');
select has_table('public', 'metrics', 'metrics exists');
select has_table('public', 'sources', 'sources exists');
select has_table('public', 'studies', 'studies exists');
select has_table('public', 'datasets', 'datasets exists');
select has_table('public', 'dataset_versions', 'dataset_versions exists');
select has_table('public', 'observations', 'observations exists');
select has_table('public', 'observation_transformations', 'observation_transformations exists');
select has_table('public', 'metric_releases', 'metric_releases exists');
select has_table('public', 'corrections', 'corrections exists');
select has_table('private', 'ingestion_runs', 'ingestion_runs exists');
select has_table('private', 'ingestion_events', 'ingestion_events exists');
select has_table('private', 'release_operations', 'release_operations exists');

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

select isnt_empty(
  $$ select indexname from pg_indexes where schemaname = 'public' and tablename = 'observations' and indexname = 'observations_dataset_identity_key' $$,
  'a dataset version cannot contain duplicate observation identities'
);

select ok(
  not has_table_privilege('anon', 'public.observations', 'INSERT'),
  'anon has no observation insert privilege'
);

select ok(
  not has_table_privilege('authenticated', 'public.observations', 'UPDATE'),
  'authenticated has no observation update privilege'
);

select ok(
  has_table_privilege('anon', 'public.observations', 'SELECT'),
  'anon receives intentional observation select access'
);

select ok(
  not has_schema_privilege('anon', 'private', 'USAGE'),
  'anon cannot use the private schema'
);

select is(
  (
    select count(*)
    from pg_class table_record
    join pg_namespace schema_record on schema_record.oid = table_record.relnamespace
    where schema_record.nspname = 'public'
      and table_record.relname = any(array[
        'technologies', 'geographies', 'metrics', 'sources', 'studies',
        'datasets', 'dataset_versions', 'observations',
        'observation_transformations', 'metric_releases', 'corrections'
      ])
      and table_record.relrowsecurity
  ),
  11::bigint,
  'every public evidence table has row-level security enabled'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'technologies', 'geographies', 'metrics', 'sources', 'studies',
      'datasets', 'dataset_versions', 'observations',
      'observation_transformations', 'metric_releases', 'corrections'
    ]) as expected_table(table_name)
    where not has_table_privilege('anon', format('public.%I', expected_table.table_name), 'SELECT')
      or not has_table_privilege('authenticated', format('public.%I', expected_table.table_name), 'SELECT')
  ),
  'every public evidence table grants explicit read access to anonymous and authenticated roles'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'technologies', 'geographies', 'metrics', 'sources', 'studies',
      'datasets', 'dataset_versions', 'observations',
      'observation_transformations', 'metric_releases', 'corrections'
    ]) as expected_table(table_name)
    where has_table_privilege('anon', format('public.%I', expected_table.table_name), 'INSERT')
      or has_table_privilege('anon', format('public.%I', expected_table.table_name), 'UPDATE')
      or has_table_privilege('anon', format('public.%I', expected_table.table_name), 'DELETE')
      or has_table_privilege('authenticated', format('public.%I', expected_table.table_name), 'INSERT')
      or has_table_privilege('authenticated', format('public.%I', expected_table.table_name), 'UPDATE')
      or has_table_privilege('authenticated', format('public.%I', expected_table.table_name), 'DELETE')
  ),
  'no public evidence table grants anonymous or authenticated writes'
);

select * from finish();
rollback;
