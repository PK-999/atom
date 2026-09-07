CREATE TABLE licenses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  redistribution TEXT NOT NULL CHECK (redistribution IN ('allowed', 'restricted', 'unknown')),
  url TEXT
);

CREATE TABLE technologies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  variant TEXT
);

CREATE TABLE geographies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('global', 'country', 'region', 'grid', 'facility'))
);

CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  url TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  conflict_disclosure TEXT NOT NULL,
  source_tier TEXT NOT NULL CHECK (source_tier IN ('A', 'B', 'C')),
  license_id TEXT NOT NULL REFERENCES licenses(id),
  CONSTRAINT access_after_publish CHECK (published_at <= accessed_at)
);

CREATE TABLE studies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  system_boundary TEXT NOT NULL,
  methodology TEXT NOT NULL,
  period_start_year INTEGER NOT NULL,
  period_end_year INTEGER NOT NULL CHECK (period_end_year >= period_start_year)
);

CREATE TABLE study_sources (
  study_id TEXT REFERENCES studies(id),
  source_id TEXT REFERENCES sources(id),
  PRIMARY KEY (study_id, source_id)
);

CREATE TABLE datasets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  checksum TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL,
  license_id TEXT NOT NULL REFERENCES licenses(id)
);

CREATE TABLE dataset_sources (
  dataset_id TEXT REFERENCES datasets(id),
  source_id TEXT REFERENCES sources(id),
  PRIMARY KEY (dataset_id, source_id)
);

CREATE TABLE dataset_studies (
  dataset_id TEXT REFERENCES datasets(id),
  study_id TEXT REFERENCES studies(id),
  PRIMARY KEY (dataset_id, study_id)
);

CREATE TABLE metrics (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  definition TEXT NOT NULL,
  value_kind TEXT NOT NULL CHECK (value_kind IN ('numeric', 'categorical')),
  canonical_unit TEXT,
  range_semantics TEXT NOT NULL CHECK (range_semantics IN ('point', 'range', 'point-or-range', 'categorical')),
  geography_support TEXT[] NOT NULL,
  supported_units TEXT[]
);

CREATE TABLE claims (
  id TEXT PRIMARY KEY,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('quantitative', 'qualitative', 'methodological')),
  text TEXT NOT NULL,
  metric_id TEXT REFERENCES metrics(id)
);

CREATE TABLE citations (
  id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  source_id TEXT NOT NULL REFERENCES sources(id),
  locator TEXT NOT NULL
);

CREATE TABLE explanations (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('metric', 'technology', 'claim', 'concept')),
  level_kid TEXT NOT NULL,
  level_simple TEXT NOT NULL,
  level_curious TEXT NOT NULL,
  level_technical TEXT NOT NULL,
  level_expert TEXT NOT NULL
);

CREATE TABLE corrections (
  id TEXT PRIMARY KEY,
  affected_entity_id TEXT NOT NULL,
  affected_entity_type TEXT NOT NULL CHECK (affected_entity_type IN ('observation', 'source', 'study', 'dataset', 'claim')),
  corrected_at TIMESTAMPTZ NOT NULL,
  corrected_version TEXT NOT NULL,
  prior_version TEXT NOT NULL,
  reason TEXT NOT NULL,
  material_impact TEXT NOT NULL CHECK (material_impact IN ('none', 'minor', 'material'))
);

CREATE TABLE publication_records (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('observation', 'source', 'study', 'dataset', 'claim')),
  dataset_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'in-review', 'published', 'withdrawn')),
  published_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  CONSTRAINT review_before_publish CHECK (
    status != 'published' OR 
    (published_at IS NOT NULL AND reviewed_at IS NOT NULL AND reviewed_by IS NOT NULL AND reviewed_at <= published_at)
  )
);

CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('numeric', 'categorical')),
  value_semantics TEXT NOT NULL CHECK (value_semantics IN ('point', 'range', 'categorical')),
  dataset_id TEXT NOT NULL REFERENCES datasets(id),
  metric_id TEXT NOT NULL REFERENCES metrics(id),
  geography_id TEXT NOT NULL REFERENCES geographies(id),
  geography_scope TEXT NOT NULL,
  technology_id TEXT NOT NULL REFERENCES technologies(id),
  source_id TEXT NOT NULL REFERENCES sources(id),
  study_id TEXT NOT NULL REFERENCES studies(id),
  license_id TEXT NOT NULL REFERENCES licenses(id),
  last_verified_at TIMESTAMPTZ NOT NULL,
  publication_status TEXT NOT NULL,
  raw_access TEXT NOT NULL CHECK (raw_access IN ('permitted', 'restricted', 'unavailable')),
  system_boundary TEXT NOT NULL,
  methodology TEXT NOT NULL,
  uncertainty TEXT NOT NULL,
  period_start_year INTEGER NOT NULL,
  period_end_year INTEGER NOT NULL CHECK (period_end_year >= period_start_year),
  transformation JSONB NOT NULL,
  representative_kind TEXT NOT NULL,
  unit TEXT,
  value NUMERIC,
  range JSONB,
  category_definition TEXT,
  categorical_value TEXT
);
