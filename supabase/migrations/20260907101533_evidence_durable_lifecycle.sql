-- Additive to the canonical versioned schema. Historical rows retain unknown
-- licence IDs; no licence identity or review is inferred during migration.
alter table public.sources add column licence_id public.app_identifier;
alter table public.datasets add column licence_id public.app_identifier;
alter table public.dataset_versions add column source_version text;
alter table public.dataset_versions drop constraint dataset_versions_manifest_identity_key;
create unique index dataset_versions_complete_identity_key on public.dataset_versions
  (dataset_id, checksum_digest, transformation_version, coalesce(source_version, ''));

alter table private.ingestion_runs drop constraint ingestion_runs_idempotency_key_key;
alter table private.ingestion_runs add column manifest_digest text check (manifest_digest ~ '^[a-f0-9]{64}$');
alter table private.ingestion_runs add column attempt integer not null default 1 check (attempt > 0);
create unique index ingestion_runs_attempt_key on private.ingestion_runs(idempotency_key, attempt);
create unique index ingestion_runs_one_active_key on private.ingestion_runs(idempotency_key)
  where status in ('pending', 'running', 'succeeded');

create table private.version_artifacts (
  dataset_version_id public.app_identifier primary key references public.dataset_versions(id),
  manifest jsonb not null check (jsonb_typeof(manifest) = 'object'),
  manifest_digest text not null check (manifest_digest ~ '^[a-f0-9]{64}$'),
  artifact_checksum text not null check (artifact_checksum ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create table private.ingestion_observations (
  observation_id public.app_identifier primary key references public.observations(id),
  payload jsonb not null check (jsonb_typeof(payload) = 'object')
);
create table private.evidence_reviewers (
  id public.app_identifier primary key,
  identity_reference text not null unique check (btrim(identity_reference) <> ''),
  display_name text not null check (btrim(display_name) <> ''),
  approved_roles text[] not null check (cardinality(approved_roles) > 0 and approved_roles <@ array['scientific', 'editorial', 'licensing']::text[]),
  active boolean not null default true
);
alter table private.dataset_version_reviews add column artifact_checksum text check (artifact_checksum ~ '^[a-f0-9]{64}$');
alter table private.dataset_version_reviews add column manifest_digest text check (manifest_digest ~ '^[a-f0-9]{64}$');

alter table private.version_artifacts enable row level security;
alter table private.ingestion_observations enable row level security;
alter table private.evidence_reviewers enable row level security;
alter table private.dataset_version_reviews enable row level security;
alter table private.ingestion_runs enable row level security;
alter table private.ingestion_events enable row level security;
alter table private.release_operations enable row level security;
revoke all on private.version_artifacts, private.ingestion_observations, private.evidence_reviewers from public, anon, authenticated;
grant select, insert on private.version_artifacts, private.ingestion_observations to service_role;
grant select on private.evidence_reviewers to service_role;

create trigger version_artifacts_immutable before update or delete on private.version_artifacts for each row execute function private.prevent_mutation();
create trigger ingestion_observations_immutable before update or delete on private.ingestion_observations for each row execute function private.prevent_mutation();
create trigger dataset_reviews_append_only before update or delete on private.dataset_version_reviews for each row execute function private.prevent_mutation();

create function private.validate_bound_review() returns trigger language plpgsql set search_path = '' as $$
declare version_status public.publication_status;
begin
  select publication_status into version_status from public.dataset_versions where id = new.dataset_version_id for update;
  if version_status not in ('draft', 'in-review') then raise exception 'Review requires a draft or in-review version'; end if;
  if not exists (select 1 from private.version_artifacts a where a.dataset_version_id = new.dataset_version_id and a.artifact_checksum = new.artifact_checksum and a.manifest_digest = new.manifest_digest) then
    raise exception 'Review artifact/manifest identity does not match';
  end if;
  if not exists (select 1 from private.evidence_reviewers r where r.id::text = new.reviewer_id and r.active and new.review_role = any(r.approved_roles)) then
    raise exception 'Reviewer is not registered for this role';
  end if;
  if new.reviewed_at < (select created_at from private.version_artifacts where dataset_version_id = new.dataset_version_id) or new.reviewed_at > clock_timestamp() then
    raise exception 'Review chronology is invalid';
  end if;
  return new;
end; $$;
create trigger reviews_require_bound_identity before insert on private.dataset_version_reviews for each row execute function private.validate_bound_review();

create function private.enforce_ingested_version_reviews() returns trigger language plpgsql set search_path = '' as $$
begin
  if exists (select 1 from private.version_artifacts where dataset_version_id = old.id) then
    if (to_jsonb(new) - array['publication_status', 'reviewed_by', 'reviewed_at', 'published_at']) is distinct from
       (to_jsonb(old) - array['publication_status', 'reviewed_by', 'reviewed_at', 'published_at']) then raise exception 'Ingested dataset versions are immutable'; end if;
    if new.publication_status = 'published' and old.publication_status <> 'published' then
      if (select count(*) from private.dataset_version_reviews r join private.version_artifacts a on a.dataset_version_id = r.dataset_version_id
          where r.dataset_version_id = new.id and r.artifact_checksum = a.artifact_checksum and r.manifest_digest = a.manifest_digest) <> 3 then
        raise exception 'Publication requires three artifact-bound reviews';
      end if;
      if new.reviewed_at < (select max(reviewed_at) from private.dataset_version_reviews where dataset_version_id = new.id) then raise exception 'Publication predates its reviews'; end if;
    end if;
  end if;
  return new;
end; $$;
create trigger ingested_versions_require_reviews before update on public.dataset_versions for each row execute function private.enforce_ingested_version_reviews();

create function private.protect_ingested_observation() returns trigger language plpgsql set search_path = '' as $$
begin
  if exists (select 1 from private.ingestion_observations where observation_id = old.id) and
    (to_jsonb(new) - array['publication_status', 'reviewed_by', 'reviewed_at', 'published_at']) is distinct from
    (to_jsonb(old) - array['publication_status', 'reviewed_by', 'reviewed_at', 'published_at']) then raise exception 'Ingested observations are immutable'; end if;
  return new;
end; $$;
create trigger ingested_observations_immutable before update on public.observations for each row execute function private.protect_ingested_observation();

-- Only privileged roles can call operational helpers, including trigger helpers.
revoke execute on function private.validate_bound_review(), private.enforce_ingested_version_reviews(), private.protect_ingested_observation() from public, anon, authenticated;

create table private.version_withdrawals (
  id public.app_identifier primary key,
  dataset_version_id public.app_identifier not null unique references public.dataset_versions(id),
  reason text not null check (btrim(reason) <> ''),
  initiated_by text not null check (btrim(initiated_by) <> ''),
  occurred_at timestamptz not null default clock_timestamp()
);
alter table private.version_withdrawals enable row level security;
revoke all on private.version_withdrawals from public, anon, authenticated;
grant select, insert on private.version_withdrawals to service_role;
create trigger version_withdrawals_append_only before update or delete on private.version_withdrawals for each row execute function private.prevent_mutation();

create function private.validate_correction_provenance() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and old.publication_status in ('published', 'withdrawn') then raise exception 'Published corrections are immutable'; end if;
  if not exists (
    select 1 from public.observations o
    join public.dataset_versions target on target.id = o.dataset_version_id
    join public.dataset_versions prior on prior.id = new.previous_dataset_version_id
    join public.sources s on s.id = o.source_id
    where o.id = new.observation_id and target.id = new.corrected_dataset_version_id
      and prior.dataset_id = target.dataset_id and target.acquired_on >= prior.acquired_on
      and new.decided_on >= s.accessed_on and new.decided_on <= o.last_verified_on
  ) then raise exception 'Correction identity or chronology is invalid'; end if;
  return new;
end; $$;
create trigger corrections_require_provenance before insert or update on public.corrections for each row execute function private.validate_correction_provenance();
revoke execute on function private.validate_correction_provenance() from public, anon, authenticated;
