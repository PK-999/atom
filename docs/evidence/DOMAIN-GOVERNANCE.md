# Evidence Domain Governance

Date: 2026-08-31

Status: Stage 5 baseline

This document governs ATOM's framework-independent evidence records. The public
API lives in `lib/evidence`. Database ingestion and publication automation are
Stage 6 responsibilities; these rules are the contract that work must enforce.

## Evidence record minimum

A quantitative or categorical observation is not publishable unless it carries
an observation, technology, metric, geography, source, study, and dataset
relationship plus:

- geography scope and applicable period;
- methodology and system boundary;
- uncertainty stated in words, never as an invented confidence score;
- source, licence, raw-access, and publication status;
- ordered transformation history and representative kind;
- a valid last-verified calendar date.

Numeric records are either a point or an ordered range. A range must satisfy
`lower <= representative <= upper`. Categorical evidence keeps a written
category definition and is never silently coerced to a number.

## Source tiers and conflicts

- Tier A: primary, institutional, regulator, scientific, peer-reviewed, or
  primary-dataset evidence.
- Tier B: transparent high-quality aggregators.
- Tier C: contextual or interested-party material, including industry,
  advocacy, think-tank, and news sources.

All tiers require a conflict disclosure. Tier C is permitted when its
perspective and limitations remain visible; source tier does not substitute for
method review. A source is not selected merely because it supports a preferred
conclusion.

## Representative values

`mean` and `median` operate only on numeric observations for one metric with
convertible units. `central-estimate`, `regulator-value`, and `model-default`
select only an observation explicitly marked with that representative kind. A
missing or ambiguous marked value is an error, not an invitation to guess.

Range observations contribute their source-declared representative value.
Selection never changes the stored source observation, and the result retains
the contributing observation identifiers and displayed unit. Mean and median
aggregation is refused when geography, period, methodology, or system boundary
differs; a period warning is not silently averaged away.

## Units and human equivalents

The unit registry groups units by physical dimension and converts through a
base-unit factor. Unknown units and cross-dimension conversions fail. Point and
range normalization returns a new observation with an explicit conversion note
appended to the ordered transformation history; prior derived/model steps
remain machine-readable and raw source values remain unchanged. Identity
normalization does not fabricate a conversion step. Parsed records and
normalized outputs are deeply frozen, and normalization does not share nested
mutable objects with its input.

Human-friendly equivalents are calculated only from a caller-supplied,
inspectable assumption. The result preserves the scientific value and unit,
the exact assumption quantity and unit, its label, and its source note.
Analogies never replace scientific values.

## Comparability

Comparability is assessed in a stable editorial order:

1. metric and numeric/categorical kind;
2. unit dimension;
3. geography;
4. period;
5. methodology;
6. system boundary.

Convertible units and differing periods are warnings. Different metrics,
value kinds, physical dimensions, methodologies, or system boundaries are
blockers. Different geography identifiers are blockers unless every record is
explicitly global. Blocked evidence remains inspectable with its issue; it is
not normalized into a false comparison.

## Availability and freshness

Released evidence uses an explicit availability state:

- `supported`: reviewed comparable evidence is publishable;
- `partial`: only some technologies, regions, periods, or modes are supported;
- `incompatible`: records exist but cannot be directly compared;
- `unavailable`: reliable evidence is not currently available;
- `restricted`: licensing prevents observation-level publication;
- `stale`: the review interval has elapsed and the age must be visible;
- `disputed`: credible alternatives and the reasons for disagreement must be
  shown alongside broad agreement and remaining uncertainty.

Freshness is evaluated in whole UTC calendar days. Evidence is fresh through
the exact due date and stale on the following day. The review interval is set
by the metric/source review policy, not inferred by the domain library.

## Review and publication workflow

The permitted workflow is:

```text
draft -> in-review -> published
             |            |
             v            v
           draft      in-review or withdrawn
                           |
                           v
                       in-review
```

Direct `draft -> published` transitions are forbidden. Publication requires an
explicit reviewer, review date, and publication date for that transition.
Anonymous readers can access only records whose publication status is
`published`; editors may inspect all valid workflow states. Publication
eligibility validates the complete observation relationship graph: source,
study, dataset and version, metric contract, geography, technology, publication
record, study method/boundary/period, and observation/dataset licence
consistency. Stage 6 must also enforce this boundary in PostgreSQL row-level
security so draft records cannot leak through a different repository path.

Raw observations are public only when the complete publication gate passes,
raw access is permitted, and the observation, dataset, and authoritative source
all explicitly allow redistribution. Restricted and unknown redistribution
terms do not permit raw publication.

## Corrections and disputed evidence

A material revision to already published evidence requires a correction record
that links the affected observation, previous dataset version, corrected
version, reason, date, and material impact. Major disputed claims must not be
silently rewritten. The public presentation should identify a material
correction when interpretation changed.

Disputed evidence retains the selected observation, credible alternatives,
methodological reasons for disagreement, broad agreement, and remaining
uncertainty. It never receives a fabricated numeric confidence score.

## Responsibilities

- Evidence editors classify sources, record conflicts, define review intervals,
  and decide whether disagreements are material.
- Scientific reviewers approve units, ranges, representative policy,
  methodology, boundary, geography, uncertainty, and transformation notes.
- Data maintainers preserve versions, checksums, raw references, licences,
  correction history, and reproducible transformations.
- Application code renders domain outcomes and provenance. React components do
  not contain source values or decide scientific comparability.
- Release owners publish only after schema, scientific, editorial,
  accessibility, browser, and rollback checks pass.

## Current limitations

- The registry intentionally covers only unit families needed to establish the
  Stage 5 contract. Metric releases add units with literal conversion tests.
- Review intervals and disagreement decisions require editorial policy input.
- Database constraints, row-level security, ingestion logs, checksums,
  idempotency, and version rollback are Stage 6 work.
- No real scientific observation ships with this stage; all tests use clearly
  synthetic contract fixtures.
