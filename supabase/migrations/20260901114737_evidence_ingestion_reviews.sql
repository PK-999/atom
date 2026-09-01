create table private.dataset_version_reviews (
  id public.app_identifier primary key,
  dataset_version_id public.app_identifier not null references public.dataset_versions(id) on delete restrict,
  review_role text not null check (review_role in ('scientific', 'editorial', 'licensing')),
  reviewer_id text not null check (btrim(reviewer_id) <> ''),
  reviewed_at timestamptz not null default now(),
  constraint dataset_version_reviews_one_role unique (dataset_version_id, review_role),
  constraint dataset_version_reviews_independent_reviewer unique (dataset_version_id, reviewer_id)
);

revoke all on table private.dataset_version_reviews from public, anon, authenticated;
grant select, insert on table private.dataset_version_reviews to service_role;
