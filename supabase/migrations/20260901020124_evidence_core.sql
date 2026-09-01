create schema private;

revoke all on schema private from public;

create domain public.app_identifier as text
  check (value ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

create type public.publication_status as enum (
  'draft',
  'in-review',
  'published',
  'withdrawn'
);

create type public.value_kind as enum ('numeric', 'categorical');

create type public.availability_status as enum (
  'unreviewed',
  'supported',
  'partial',
  'incompatible',
  'unavailable',
  'restricted',
  'stale',
  'disputed'
);

create type public.availability_mode as enum (
  'available',
  'unavailable',
  'restricted'
);

create type public.redistribution_status as enum (
  'allowed',
  'restricted',
  'unknown'
);

create type public.source_tier as enum ('A', 'B', 'C');

create type public.geography_scope as enum (
  'global',
  'country',
  'region',
  'grid',
  'facility'
);

create type public.range_kind as enum (
  'min-max',
  'confidence',
  'credible',
  'interquartile',
  'prediction',
  'source-defined'
);

create type public.ingestion_status as enum (
  'pending',
  'running',
  'succeeded',
  'failed'
);

create type public.raw_access_status as enum (
  'permitted',
  'restricted',
  'unavailable'
);

create table public.technologies (
  id public.app_identifier primary key,
  name text not null check (btrim(name) <> ''),
  description text not null check (btrim(description) <> ''),
  variant text check (variant is null or btrim(variant) <> ''),
  lifecycle_status text not null check (btrim(lifecycle_status) <> ''),
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint technologies_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create table public.geographies (
  id public.app_identifier primary key,
  name text not null check (btrim(name) <> ''),
  scope public.geography_scope not null,
  parent_geography_id public.app_identifier references public.geographies(id) on delete restrict,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint geographies_no_self_parent_check check (parent_geography_id is distinct from id),
  constraint geographies_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index geographies_parent_geography_id_idx
  on public.geographies(parent_geography_id)
  where parent_geography_id is not null;

create table public.metrics (
  id public.app_identifier primary key,
  canonical_unit text,
  supported_units text[],
  value_kind public.value_kind not null,
  range_semantics text not null check (range_semantics in ('point', 'range', 'point-or-range', 'categorical')),
  representative_rule text not null check (btrim(representative_rule) <> ''),
  geography_support public.geography_scope[] not null,
  definition text not null check (btrim(definition) <> ''),
  explanation_content text not null check (btrim(explanation_content) <> ''),
  registry_category public.app_identifier not null,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint metrics_geography_support_check check (cardinality(geography_support) > 0),
  constraint metrics_value_contract_check check (
    (
      value_kind = 'numeric'
      and canonical_unit is not null and btrim(canonical_unit) <> ''
      and supported_units is not null and cardinality(supported_units) > 0
      and canonical_unit = any(supported_units)
      and range_semantics in ('point', 'range', 'point-or-range')
    )
    or
    (
      value_kind = 'categorical'
      and canonical_unit is null
      and supported_units is null
      and range_semantics = 'categorical'
    )
  ),
  constraint metrics_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index metrics_registry_category_published_idx
  on public.metrics(registry_category, id)
  where publication_status = 'published';

create table public.sources (
  id public.app_identifier primary key,
  source_tier public.source_tier not null,
  title text not null check (btrim(title) <> ''),
  publisher text not null check (btrim(publisher) <> ''),
  url text not null check (url ~ '^https?://'),
  source_identifier text check (source_identifier is null or btrim(source_identifier) <> ''),
  conflict_disclosure text not null check (btrim(conflict_disclosure) <> ''),
  licence_name text not null check (btrim(licence_name) <> ''),
  licence_url text check (licence_url is null or licence_url ~ '^https?://'),
  redistribution public.redistribution_status not null,
  published_on date not null,
  accessed_on date not null,
  last_verified_on date not null,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint sources_evidence_dates_check check (
    published_on <= accessed_on and accessed_on <= last_verified_on
  ),
  constraint sources_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create table public.studies (
  id public.app_identifier primary key,
  source_id public.app_identifier not null references public.sources(id) on delete restrict,
  title text not null check (btrim(title) <> ''),
  methodology text not null check (btrim(methodology) <> ''),
  system_boundary text not null check (btrim(system_boundary) <> ''),
  period_start_year smallint not null check (period_start_year between 1800 and 3000),
  period_end_year smallint not null check (period_end_year between 1800 and 3000),
  publication_label text not null check (btrim(publication_label) <> ''),
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint studies_period_check check (period_start_year <= period_end_year),
  constraint studies_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index studies_source_id_idx on public.studies(source_id);

create table public.datasets (
  id public.app_identifier primary key,
  source_id public.app_identifier not null references public.sources(id) on delete restrict,
  title text not null check (btrim(title) <> ''),
  publisher text not null check (btrim(publisher) <> ''),
  licence_name text not null check (btrim(licence_name) <> ''),
  licence_url text check (licence_url is null or licence_url ~ '^https?://'),
  redistribution public.redistribution_status not null,
  raw_access public.raw_access_status not null,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint datasets_raw_redistribution_check check (
    raw_access <> 'permitted' or redistribution = 'allowed'
  ),
  constraint datasets_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index datasets_source_id_idx on public.datasets(source_id);

create table public.dataset_versions (
  id public.app_identifier primary key,
  dataset_id public.app_identifier not null references public.datasets(id) on delete restrict,
  checksum_algorithm text not null check (checksum_algorithm = 'sha256'),
  checksum_digest text not null check (checksum_digest ~ '^[a-f0-9]{64}$'),
  acquired_on date not null,
  transformation_version text not null check (transformation_version ~ '^\d+\.\d+\.\d+$'),
  supersedes_version_id public.app_identifier references public.dataset_versions(id) on delete restrict,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint dataset_versions_no_self_supersession_check check (supersedes_version_id is distinct from id),
  constraint dataset_versions_manifest_identity_key unique (
    dataset_id,
    checksum_digest,
    transformation_version
  ),
  constraint dataset_versions_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index dataset_versions_dataset_id_idx on public.dataset_versions(dataset_id);
create index dataset_versions_supersedes_version_id_idx
  on public.dataset_versions(supersedes_version_id)
  where supersedes_version_id is not null;
create index dataset_versions_published_dataset_idx
  on public.dataset_versions(dataset_id, published_at desc, id)
  where publication_status = 'published';

create table public.observations (
  id public.app_identifier primary key,
  metric_id public.app_identifier not null references public.metrics(id) on delete restrict,
  technology_id public.app_identifier not null references public.technologies(id) on delete restrict,
  geography_id public.app_identifier not null references public.geographies(id) on delete restrict,
  study_id public.app_identifier not null references public.studies(id) on delete restrict,
  source_id public.app_identifier not null references public.sources(id) on delete restrict,
  dataset_version_id public.app_identifier not null references public.dataset_versions(id) on delete restrict,
  value_kind public.value_kind not null,
  value_semantics text not null check (value_semantics in ('point', 'range', 'categorical')),
  value numeric,
  lower_value numeric,
  representative_value numeric,
  upper_value numeric,
  category_value text,
  category_definition text,
  unit text,
  representative_kind text not null check (
    representative_kind in (
      'mean',
      'median',
      'central-estimate',
      'regulator-value',
      'model-default',
      'source-observation'
    )
  ),
  range_kind public.range_kind,
  interval_level numeric,
  source_range_label text,
  methodology text not null check (btrim(methodology) <> ''),
  system_boundary text not null check (btrim(system_boundary) <> ''),
  period_start_year smallint not null check (period_start_year between 1800 and 3000),
  period_end_year smallint not null check (period_end_year between 1800 and 3000),
  uncertainty text not null check (btrim(uncertainty) <> ''),
  last_verified_on date not null,
  raw_access public.raw_access_status not null,
  redistribution public.redistribution_status not null,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint observations_value_shape_check check (
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
  ),
  constraint observations_category_contract_check check (
    value_kind <> 'categorical'
    or (
      btrim(category_value) <> ''
      and category_definition is not null
      and btrim(category_definition) <> ''
      and representative_kind in ('central-estimate', 'regulator-value', 'model-default', 'source-observation')
    )
  ),
  constraint observations_numeric_unit_check check (
    value_kind <> 'numeric' or (unit is not null and btrim(unit) <> '')
  ),
  constraint observations_finite_numeric_values_check check (
    (value is null or value not in ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric))
    and (lower_value is null or lower_value not in ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric))
    and (representative_value is null or representative_value not in ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric))
    and (upper_value is null or upper_value not in ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric))
  ),
  constraint observations_range_metadata_check check (
    (
      value_semantics = 'range'
      and range_kind is not null
      and (
        (range_kind in ('confidence', 'credible', 'prediction') and interval_level > 0 and interval_level <= 1)
        or (range_kind = 'source-defined' and source_range_label is not null and btrim(source_range_label) <> '')
        or range_kind in ('min-max', 'interquartile')
      )
    )
    or
    (
      value_semantics <> 'range'
      and range_kind is null
      and interval_level is null
      and source_range_label is null
    )
  ),
  constraint observations_period_check check (period_start_year <= period_end_year),
  constraint observations_raw_redistribution_check check (
    raw_access <> 'permitted' or redistribution = 'allowed'
  ),
  constraint observations_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  ),
  constraint observations_dataset_identity_key unique (
    dataset_version_id,
    metric_id,
    technology_id,
    geography_id,
    study_id,
    source_id,
    period_start_year,
    period_end_year
  )
);

create index observations_metric_id_idx on public.observations(metric_id);
create index observations_technology_id_idx on public.observations(technology_id);
create index observations_geography_id_idx on public.observations(geography_id);
create index observations_study_id_idx on public.observations(study_id);
create index observations_source_id_idx on public.observations(source_id);
create index observations_published_lookup_idx
  on public.observations(metric_id, technology_id, geography_id, dataset_version_id)
  include (period_start_year, period_end_year, value_kind, value_semantics)
  where publication_status = 'published';

create table public.observation_transformations (
  id public.app_identifier primary key,
  observation_id public.app_identifier not null references public.observations(id) on delete restrict,
  step_order smallint not null check (step_order > 0),
  operation_name public.app_identifier not null,
  input_unit text check (input_unit is null or btrim(input_unit) <> ''),
  output_unit text check (output_unit is null or btrim(output_unit) <> ''),
  parameters jsonb not null default '{}'::jsonb check (jsonb_typeof(parameters) = 'object'),
  software_version text not null check (btrim(software_version) <> ''),
  explanatory_note text not null check (btrim(explanatory_note) <> ''),
  created_at timestamptz not null default now(),
  constraint observation_transformations_order_key unique (observation_id, step_order)
);

create table public.metric_releases (
  metric_id public.app_identifier primary key references public.metrics(id) on delete restrict,
  availability_status public.availability_status not null,
  active_dataset_version_id public.app_identifier references public.dataset_versions(id) on delete restrict,
  technology_ids text[] not null default '{}',
  geography_ids text[] not null default '{}',
  period_start_year smallint check (period_start_year between 1800 and 3000),
  period_end_year smallint check (period_end_year between 1800 and 3000),
  typical_mode public.availability_mode not null default 'unavailable',
  range_mode public.availability_mode not null default 'unavailable',
  raw_mode public.availability_mode not null default 'unavailable',
  redistribution_decision public.redistribution_status not null,
  message text not null check (btrim(message) <> ''),
  feature_enabled boolean not null default false,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metric_releases_period_check check (
    (period_start_year is null and period_end_year is null)
    or (period_start_year is not null and period_end_year is not null and period_start_year <= period_end_year)
  ),
  constraint metric_releases_supported_coverage_check check (
    availability_status <> 'supported'
    or (
      active_dataset_version_id is not null
      and cardinality(technology_ids) > 0
      and cardinality(geography_ids) > 0
      and period_start_year is not null
      and period_end_year is not null
      and 'available' = any(array[typical_mode, range_mode, raw_mode])
    )
  ),
  constraint metric_releases_raw_redistribution_check check (
    raw_mode <> 'available' or redistribution_decision = 'allowed'
  ),
  constraint metric_releases_feature_gate_check check (
    not feature_enabled
    or (publication_status = 'published' and active_dataset_version_id is not null)
  ),
  constraint metric_releases_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index metric_releases_active_dataset_version_id_idx
  on public.metric_releases(active_dataset_version_id)
  where active_dataset_version_id is not null;
create index metric_releases_public_registry_idx
  on public.metric_releases(feature_enabled, availability_status, metric_id)
  where publication_status = 'published';

create table public.corrections (
  id public.app_identifier primary key,
  observation_id public.app_identifier not null references public.observations(id) on delete restrict,
  previous_dataset_version_id public.app_identifier not null references public.dataset_versions(id) on delete restrict,
  corrected_dataset_version_id public.app_identifier not null references public.dataset_versions(id) on delete restrict,
  reason text not null check (btrim(reason) <> ''),
  material_impact text not null check (material_impact in ('none', 'minor', 'material')),
  decided_on date not null,
  publication_status public.publication_status not null default 'draft',
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint corrections_distinct_versions_check check (
    previous_dataset_version_id <> corrected_dataset_version_id
  ),
  constraint corrections_publication_review_check check (
    publication_status <> 'published'
    or (
      reviewed_by is not null and btrim(reviewed_by) <> ''
      and reviewed_at is not null
      and published_at is not null
      and reviewed_at <= published_at
    )
  )
);

create index corrections_observation_id_idx on public.corrections(observation_id);
create index corrections_previous_dataset_version_id_idx on public.corrections(previous_dataset_version_id);
create index corrections_corrected_dataset_version_id_idx on public.corrections(corrected_dataset_version_id);

create table private.ingestion_runs (
  id public.app_identifier primary key,
  idempotency_key text not null unique check (btrim(idempotency_key) <> ''),
  dataset_version_id public.app_identifier references public.dataset_versions(id) on delete restrict,
  input_checksum text not null check (input_checksum ~ '^[a-f0-9]{64}$'),
  pipeline_version text not null check (btrim(pipeline_version) <> ''),
  status public.ingestion_status not null default 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  source_record_count bigint not null default 0 check (source_record_count >= 0),
  accepted_record_count bigint not null default 0 check (accepted_record_count >= 0),
  rejected_record_count bigint not null default 0 check (rejected_record_count >= 0),
  failure_summary text,
  created_at timestamptz not null default now(),
  constraint ingestion_runs_status_timestamps_check check (
    (status = 'pending' and started_at is null and completed_at is null)
    or (status = 'running' and started_at is not null and completed_at is null)
    or (status = 'succeeded' and started_at is not null and completed_at is not null and failure_summary is null)
    or (status = 'failed' and started_at is not null and completed_at is not null and failure_summary is not null and btrim(failure_summary) <> '')
  ),
  constraint ingestion_runs_counts_check check (
    accepted_record_count + rejected_record_count <= source_record_count
  )
);

create index ingestion_runs_dataset_version_id_idx
  on private.ingestion_runs(dataset_version_id)
  where dataset_version_id is not null;
create index ingestion_runs_active_status_idx
  on private.ingestion_runs(status, started_at)
  where status in ('pending', 'running');

create table private.ingestion_events (
  id public.app_identifier primary key,
  ingestion_run_id public.app_identifier not null references private.ingestion_runs(id) on delete restrict,
  sequence_number smallint not null check (sequence_number > 0),
  event_type text not null check (
    event_type in (
      'acquisition',
      'validation',
      'normalization',
      'conversion',
      'quality-checks',
      'derivation',
      'review',
      'publication',
      'rollback'
    )
  ),
  summary text not null check (btrim(summary) <> ''),
  occurred_at timestamptz not null default now(),
  constraint ingestion_events_order_key unique (ingestion_run_id, sequence_number)
);

create table private.release_operations (
  id public.app_identifier primary key,
  metric_id public.app_identifier not null references public.metrics(id) on delete restrict,
  previous_dataset_version_id public.app_identifier references public.dataset_versions(id) on delete restrict,
  target_dataset_version_id public.app_identifier not null references public.dataset_versions(id) on delete restrict,
  operation text not null check (operation in ('activation', 'rollback', 'correction')),
  reason text not null check (btrim(reason) <> ''),
  initiated_by text not null check (btrim(initiated_by) <> ''),
  occurred_at timestamptz not null default now()
);

create index release_operations_metric_occurred_idx
  on private.release_operations(metric_id, occurred_at desc);
create index release_operations_previous_dataset_version_id_idx
  on private.release_operations(previous_dataset_version_id)
  where previous_dataset_version_id is not null;
create index release_operations_target_dataset_version_id_idx
  on private.release_operations(target_dataset_version_id);

create function private.prevent_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception using
    errcode = '55000',
    message = format('%I.%I is append-only', tg_table_schema, tg_table_name);
end;
$$;

create trigger observation_transformations_are_immutable
before update or delete on public.observation_transformations
for each row execute function private.prevent_mutation();

create trigger ingestion_events_are_append_only
before update or delete on private.ingestion_events
for each row execute function private.prevent_mutation();

create trigger release_operations_are_append_only
before update or delete on private.release_operations
for each row execute function private.prevent_mutation();

create function private.protect_published_dataset_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.publication_status = 'published' and (
    new.id is distinct from old.id
    or new.dataset_id is distinct from old.dataset_id
    or new.checksum_algorithm is distinct from old.checksum_algorithm
    or new.checksum_digest is distinct from old.checksum_digest
    or new.acquired_on is distinct from old.acquired_on
    or new.transformation_version is distinct from old.transformation_version
    or new.supersedes_version_id is distinct from old.supersedes_version_id
    or new.reviewed_by is distinct from old.reviewed_by
    or new.reviewed_at is distinct from old.reviewed_at
    or new.published_at is distinct from old.published_at
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using errcode = '55000', message = 'published dataset versions are immutable';
  end if;
  return new;
end;
$$;

create trigger published_dataset_versions_are_immutable
before update on public.dataset_versions
for each row execute function private.protect_published_dataset_version();

create function private.enforce_publication_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.publication_status = 'draft' and new.publication_status = 'published' then
    raise exception using errcode = '55000', message = 'draft records must pass in-review before publication';
  end if;

  if old.publication_status = 'published' and new.publication_status in ('draft', 'in-review') then
    raise exception using errcode = '55000', message = 'published records cannot silently return to review';
  end if;

  if old.publication_status = 'withdrawn' and new.publication_status <> 'withdrawn' then
    raise exception using errcode = '55000', message = 'withdrawn records are terminal';
  end if;

  return new;
end;
$$;

create trigger technologies_publication_transitions
before update of publication_status on public.technologies
for each row execute function private.enforce_publication_transition();
create trigger geographies_publication_transitions
before update of publication_status on public.geographies
for each row execute function private.enforce_publication_transition();
create trigger metrics_publication_transitions
before update of publication_status on public.metrics
for each row execute function private.enforce_publication_transition();
create trigger sources_publication_transitions
before update of publication_status on public.sources
for each row execute function private.enforce_publication_transition();
create trigger studies_publication_transitions
before update of publication_status on public.studies
for each row execute function private.enforce_publication_transition();
create trigger datasets_publication_transitions
before update of publication_status on public.datasets
for each row execute function private.enforce_publication_transition();
create trigger dataset_versions_publication_transitions
before update of publication_status on public.dataset_versions
for each row execute function private.enforce_publication_transition();
create trigger observations_publication_transitions
before update of publication_status on public.observations
for each row execute function private.enforce_publication_transition();
create trigger metric_releases_publication_transitions
before update of publication_status on public.metric_releases
for each row execute function private.enforce_publication_transition();
create trigger corrections_publication_transitions
before update of publication_status on public.corrections
for each row execute function private.enforce_publication_transition();

create function private.prevent_active_dataset_version_withdrawal()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.publication_status = 'published'
    and new.publication_status = 'withdrawn'
    and exists (
      select 1
      from public.metric_releases release_record
      where release_record.active_dataset_version_id = old.id
        and release_record.publication_status = 'published'
        and release_record.feature_enabled
    ) then
    raise exception using errcode = '55000', message = 'an active dataset version cannot be withdrawn';
  end if;

  return new;
end;
$$;

create trigger active_dataset_versions_cannot_be_withdrawn
before update of publication_status on public.dataset_versions
for each row execute function private.prevent_active_dataset_version_withdrawal();

create function private.prevent_active_observation_withdrawal()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.publication_status = 'published'
    and new.publication_status = 'withdrawn'
    and exists (
      select 1
      from public.metric_releases release_record
      where release_record.metric_id = old.metric_id
        and release_record.active_dataset_version_id = old.dataset_version_id
        and release_record.publication_status = 'published'
        and release_record.feature_enabled
    ) then
    raise exception using errcode = '55000', message = 'active observations cannot be silently withdrawn';
  end if;

  return new;
end;
$$;

create trigger active_observations_cannot_be_withdrawn
before update of publication_status on public.observations
for each row execute function private.prevent_active_observation_withdrawal();

create function private.protect_published_observation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.dataset_versions version_record
    where (
      (tg_op = 'INSERT' and version_record.id = new.dataset_version_id)
      or (tg_op = 'DELETE' and version_record.id = old.dataset_version_id)
      or (
        tg_op = 'UPDATE'
        and version_record.id in (old.dataset_version_id, new.dataset_version_id)
      )
    )
      and version_record.publication_status = 'published'
  ) then
    raise exception using errcode = '55000', message = 'published dataset version observations are immutable';
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger published_dataset_version_observations_are_immutable
before insert or update or delete on public.observations
for each row execute function private.protect_published_observation();

create function private.protect_published_observation_transformation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.observations observation_record
    join public.dataset_versions version_record on version_record.id = observation_record.dataset_version_id
    where observation_record.id = new.observation_id
      and version_record.publication_status = 'published'
  ) then
    raise exception using errcode = '55000', message = 'published observation transformations are immutable';
  end if;

  return new;
end;
$$;

create trigger published_observation_transformations_are_immutable
before insert on public.observation_transformations
for each row execute function private.protect_published_observation_transformation();

create function private.validate_metric_release_coverage()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (select 1 from unnest(new.technology_ids) as identifier where identifier is null)
    or exists (select 1 from unnest(new.geography_ids) as identifier where identifier is null) then
    raise exception using errcode = '22023', message = 'metric release coverage identifiers cannot be null';
  end if;

  if exists (
    select 1 from unnest(new.technology_ids) as identifier
    group by identifier having count(*) > 1
  ) or exists (
    select 1 from unnest(new.geography_ids) as identifier
    group by identifier having count(*) > 1
  ) then
    raise exception using errcode = '22023', message = 'metric release coverage identifiers cannot be duplicated';
  end if;

  if exists (
    select 1
    from unnest(new.technology_ids) as identifier
    where not exists (select 1 from public.technologies technology_record where technology_record.id::text = identifier)
  ) or exists (
    select 1
    from unnest(new.geography_ids) as identifier
    where not exists (select 1 from public.geographies geography_record where geography_record.id::text = identifier)
  ) then
    raise exception using errcode = '22023', message = 'metric release coverage identifiers must exist';
  end if;

  return new;
end;
$$;

create trigger metric_release_coverage_is_valid
before insert or update of technology_ids, geography_ids on public.metric_releases
for each row execute function private.validate_metric_release_coverage();

create function private.protect_metric_release_pointer()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.active_dataset_version_id is distinct from new.active_dataset_version_id
    and current_user <> 'postgres' then
    raise exception using errcode = '55000', message = 'active dataset version changes require private activation';
  end if;

  return new;
end;
$$;

create trigger metric_release_pointer_requires_private_activation
before update of active_dataset_version_id on public.metric_releases
for each row execute function private.protect_metric_release_pointer();
