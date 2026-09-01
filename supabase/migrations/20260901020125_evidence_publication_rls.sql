alter table public.technologies enable row level security;
alter table public.geographies enable row level security;
alter table public.metrics enable row level security;
alter table public.sources enable row level security;
alter table public.studies enable row level security;
alter table public.datasets enable row level security;
alter table public.dataset_versions enable row level security;
alter table public.observations enable row level security;
alter table public.observation_transformations enable row level security;
alter table public.metric_releases enable row level security;
alter table public.corrections enable row level security;

revoke all on table public.technologies from anon, authenticated;
revoke all on table public.geographies from anon, authenticated;
revoke all on table public.metrics from anon, authenticated;
revoke all on table public.sources from anon, authenticated;
revoke all on table public.studies from anon, authenticated;
revoke all on table public.datasets from anon, authenticated;
revoke all on table public.dataset_versions from anon, authenticated;
revoke all on table public.observations from anon, authenticated;
revoke all on table public.observation_transformations from anon, authenticated;
revoke all on table public.metric_releases from anon, authenticated;
revoke all on table public.corrections from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on table public.technologies to anon, authenticated;
grant select on table public.geographies to anon, authenticated;
grant select on table public.metrics to anon, authenticated;
grant select on table public.sources to anon, authenticated;
grant select on table public.studies to anon, authenticated;
grant select on table public.datasets to anon, authenticated;
grant select on table public.dataset_versions to anon, authenticated;
grant select on table public.observations to anon, authenticated;
grant select on table public.observation_transformations to anon, authenticated;
grant select on table public.metric_releases to anon, authenticated;
grant select on table public.corrections to anon, authenticated;

create policy technologies_select_published
on public.technologies
for select
to anon, authenticated
using (publication_status = 'published');

create policy geographies_select_published
on public.geographies
for select
to anon, authenticated
using (publication_status = 'published');

create policy metrics_select_published
on public.metrics
for select
to anon, authenticated
using (publication_status = 'published');

create policy sources_select_published
on public.sources
for select
to anon, authenticated
using (publication_status = 'published');

create policy studies_select_published
on public.studies
for select
to anon, authenticated
using (
  publication_status = 'published'
  and exists (
    select 1
    from public.sources source_record
    where source_record.id = studies.source_id
      and source_record.publication_status = 'published'
  )
);

create policy datasets_select_published
on public.datasets
for select
to anon, authenticated
using (
  publication_status = 'published'
  and exists (
    select 1
    from public.sources source_record
    where source_record.id = datasets.source_id
      and source_record.publication_status = 'published'
  )
);

create policy dataset_versions_select_active_published
on public.dataset_versions
for select
to anon, authenticated
using (
  publication_status = 'published'
  and exists (
    select 1
    from public.datasets dataset_record
    where dataset_record.id = dataset_versions.dataset_id
      and dataset_record.publication_status = 'published'
  )
  and exists (
    select 1
    from public.metric_releases release_record
    where release_record.active_dataset_version_id = dataset_versions.id
      and release_record.publication_status = 'published'
      and release_record.feature_enabled
  )
);

create policy metric_releases_select_published
on public.metric_releases
for select
to anon, authenticated
using (
  publication_status = 'published'
  and exists (
    select 1
    from public.metrics metric_record
    where metric_record.id = metric_releases.metric_id
      and metric_record.publication_status = 'published'
  )
);

create policy observations_select_published_permitted_active
on public.observations
for select
to anon, authenticated
using (
  publication_status = 'published'
  and raw_access = 'permitted'
  and redistribution = 'allowed'
  and exists (
    select 1
    from public.metrics metric_record
    where metric_record.id = observations.metric_id
      and metric_record.publication_status = 'published'
  )
  and exists (
    select 1
    from public.technologies technology_record
    where technology_record.id = observations.technology_id
      and technology_record.publication_status = 'published'
  )
  and exists (
    select 1
    from public.geographies geography_record
    where geography_record.id = observations.geography_id
      and geography_record.publication_status = 'published'
  )
  and exists (
    select 1
    from public.sources source_record
    where source_record.id = observations.source_id
      and source_record.publication_status = 'published'
      and source_record.redistribution = 'allowed'
  )
  and exists (
    select 1
    from public.studies study_record
    where study_record.id = observations.study_id
      and study_record.source_id = observations.source_id
      and study_record.publication_status = 'published'
  )
  and exists (
    select 1
    from public.dataset_versions version_record
    join public.datasets dataset_record on dataset_record.id = version_record.dataset_id
    where version_record.id = observations.dataset_version_id
      and version_record.publication_status = 'published'
      and dataset_record.source_id = observations.source_id
      and dataset_record.publication_status = 'published'
      and dataset_record.raw_access = 'permitted'
      and dataset_record.redistribution = 'allowed'
  )
  and exists (
    select 1
    from public.metric_releases release_record
    where release_record.metric_id = observations.metric_id
      and release_record.active_dataset_version_id = observations.dataset_version_id
      and release_record.publication_status = 'published'
      and release_record.feature_enabled
      and release_record.raw_mode = 'available'
      and release_record.redistribution_decision = 'allowed'
      and observations.technology_id = any(release_record.technology_ids)
      and observations.geography_id = any(release_record.geography_ids)
      and observations.period_start_year >= release_record.period_start_year
      and observations.period_end_year <= release_record.period_end_year
  )
);

create policy observation_transformations_select_visible_observation
on public.observation_transformations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.observations observation_record
    where observation_record.id = observation_transformations.observation_id
  )
);

create policy corrections_select_published_visible_observation
on public.corrections
for select
to anon, authenticated
using (
  publication_status = 'published'
  and exists (
    select 1
    from public.observations observation_record
    where observation_record.id = corrections.observation_id
  )
  and exists (
    select 1
    from public.dataset_versions corrected_version
    where corrected_version.id = corrections.corrected_dataset_version_id
      and corrected_version.publication_status = 'published'
  )
);

revoke all on schema private from public, anon, authenticated;
revoke all on table private.ingestion_runs from public, anon, authenticated;
revoke all on table private.ingestion_events from public, anon, authenticated;
revoke all on table private.release_operations from public, anon, authenticated;

grant usage on schema private to service_role;
grant select, insert, update on table private.ingestion_runs to service_role;
grant select, insert on table private.ingestion_events to service_role;
grant select on table private.release_operations to service_role;

grant select, insert, update on table public.technologies to service_role;
grant select, insert, update on table public.geographies to service_role;
grant select, insert, update on table public.metrics to service_role;
grant select, insert, update on table public.sources to service_role;
grant select, insert, update on table public.studies to service_role;
grant select, insert, update on table public.datasets to service_role;
grant select, insert, update on table public.dataset_versions to service_role;
grant select, insert, update on table public.observations to service_role;
grant select, insert on table public.observation_transformations to service_role;
grant select, insert, update on table public.metric_releases to service_role;
grant select, insert, update on table public.corrections to service_role;

create function private.activate_metric_release(
  metric_id text,
  dataset_version_id text,
  reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text;
  previous_version_id public.app_identifier;
  target_dataset_id public.app_identifier;
  target_supersedes_version_id public.app_identifier;
  operation_kind text;
  operation_id public.app_identifier;
begin
  caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif(current_setting('role', true), 'none')
  );

  if caller_role is distinct from 'service_role' then
    raise exception using
      errcode = '42501',
      message = 'activate_metric_release requires the service_role caller';
  end if;

  if metric_id is null or btrim(metric_id) = ''
    or dataset_version_id is null or btrim(dataset_version_id) = ''
    or reason is null or btrim(reason) = '' then
    raise exception using
      errcode = '22023',
      message = 'metric_id, dataset_version_id, and reason are required';
  end if;

  select release_record.active_dataset_version_id
  into previous_version_id
  from public.metric_releases release_record
  where release_record.metric_id = activate_metric_release.metric_id
    and release_record.publication_status = 'published'
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'published metric release not found';
  end if;

  if previous_version_id = dataset_version_id then
    raise exception using
      errcode = '55000',
      message = 'dataset version is already active';
  end if;

  select version_record.dataset_id, version_record.supersedes_version_id
  into target_dataset_id, target_supersedes_version_id
  from public.dataset_versions version_record
  join public.datasets dataset_record on dataset_record.id = version_record.dataset_id
  where version_record.id = activate_metric_release.dataset_version_id
    and version_record.publication_status = 'published'
    and version_record.reviewed_by is not null
    and version_record.reviewed_at is not null
    and version_record.published_at is not null
    and dataset_record.publication_status = 'published'
  for update of version_record;

  if not found then
    raise exception using
      errcode = '55000',
      message = 'target dataset version is not publication eligible';
  end if;

  if not exists (
    select 1
    from public.observations observation_record
    join public.metrics metric_record on metric_record.id = observation_record.metric_id
    join public.technologies technology_record on technology_record.id = observation_record.technology_id
    join public.geographies geography_record on geography_record.id = observation_record.geography_id
    join public.studies study_record on study_record.id = observation_record.study_id
    join public.sources source_record on source_record.id = observation_record.source_id
    join public.datasets dataset_record on dataset_record.id = target_dataset_id
    where observation_record.metric_id = activate_metric_release.metric_id
      and observation_record.dataset_version_id = activate_metric_release.dataset_version_id
      and observation_record.publication_status = 'published'
      and observation_record.raw_access = 'permitted'
      and observation_record.redistribution = 'allowed'
      and metric_record.publication_status = 'published'
      and technology_record.publication_status = 'published'
      and geography_record.publication_status = 'published'
      and study_record.source_id = source_record.id
      and study_record.publication_status = 'published'
      and source_record.publication_status = 'published'
      and source_record.redistribution = 'allowed'
      and dataset_record.source_id = source_record.id
      and dataset_record.publication_status = 'published'
      and dataset_record.raw_access = 'permitted'
      and dataset_record.redistribution = 'allowed'
  ) then
    raise exception using
      errcode = '55000',
      message = 'target dataset version has no fully eligible observation for the metric';
  end if;

  if exists (
    select 1
    from public.observations observation_record
    left join public.metrics metric_record
      on metric_record.id = observation_record.metric_id
      and metric_record.publication_status = 'published'
    left join public.technologies technology_record
      on technology_record.id = observation_record.technology_id
      and technology_record.publication_status = 'published'
    left join public.geographies geography_record
      on geography_record.id = observation_record.geography_id
      and geography_record.publication_status = 'published'
    left join public.studies study_record
      on study_record.id = observation_record.study_id
      and study_record.publication_status = 'published'
    left join public.sources source_record
      on source_record.id = observation_record.source_id
      and source_record.publication_status = 'published'
      and source_record.redistribution = 'allowed'
    left join public.datasets dataset_record
      on dataset_record.id = target_dataset_id
      and dataset_record.source_id = observation_record.source_id
      and dataset_record.publication_status = 'published'
      and dataset_record.raw_access = 'permitted'
      and dataset_record.redistribution = 'allowed'
    where observation_record.metric_id = activate_metric_release.metric_id
      and observation_record.dataset_version_id = activate_metric_release.dataset_version_id
      and (
        observation_record.publication_status <> 'published'
        or observation_record.raw_access <> 'permitted'
        or observation_record.redistribution <> 'allowed'
        or metric_record.id is null
        or technology_record.id is null
        or geography_record.id is null
        or study_record.id is null
        or study_record.source_id <> observation_record.source_id
        or source_record.id is null
        or dataset_record.id is null
      )
  ) then
    raise exception using
      errcode = '55000',
      message = 'target dataset version contains ineligible observations for the metric';
  end if;

  operation_kind := case
    when previous_version_id is null then 'activation'
    when target_supersedes_version_id = previous_version_id then 'activation'
    else 'rollback'
  end;

  update public.metric_releases release_record
  set active_dataset_version_id = activate_metric_release.dataset_version_id,
      updated_at = clock_timestamp()
  where release_record.metric_id = activate_metric_release.metric_id;

  operation_id := (
    'release-operation-'
    || txid_current()::text
    || '-'
    || floor(extract(epoch from clock_timestamp()) * 1000000)::bigint::text
  )::public.app_identifier;

  insert into private.release_operations (
    id,
    metric_id,
    previous_dataset_version_id,
    target_dataset_version_id,
    operation,
    reason,
    initiated_by
  ) values (
    operation_id,
    activate_metric_release.metric_id,
    previous_version_id,
    activate_metric_release.dataset_version_id,
    operation_kind,
    btrim(activate_metric_release.reason),
    caller_role
  );
end;
$$;

revoke execute on function private.activate_metric_release(text, text, text) from public;
revoke execute on function private.activate_metric_release(text, text, text) from anon, authenticated;
grant execute on function private.activate_metric_release(text, text, text) to service_role;
