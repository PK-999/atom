# Capacity-factor source review packet

Status: preparation / awaiting acquisition and qualified review. No institutional
artifact has been downloaded, checksummed, extracted, ingested, or published for
R04. There is no real dataset version or reviewer approval to report.

Proposed source family: EIA capacity-factor tables. Before acquiring bytes, a
source owner must locate the exact table/version and its applicable reuse terms
and record qualified scientific, editorial, and licensing reviewers. These are
unverified leads, not a licence decision: the institutional index is
<https://www.eia.gov/electricity/monthly/> and the reuse-policy starting point is
<https://www.eia.gov/about/copyrights_reuse.php>.

The packet must supply the exact artifact URL and publication version/date,
actual access date, SHA-256 of the acquired bytes, media type, storage/reuse
permission, source tier/conflict disclosure, table/sheet/row/column locator,
original numeric precision, technology variant, geography, period, unit,
methodology, system boundary and limitations. A missing field remains unknown;
it must not be filled from an agent's recollection.

`observation-envelope-v1` is an offline extraction interchange parser. It is
not an EIA CSV parser and has not been validated against an EIA artifact. The
input is UTF-8 JSON with exactly `header`, `expectedIds`, and `rows`:

- `header` is `atom-evidence-observations-v1`.
- `expectedIds` enumerates every expected row ID once.
- `rows` contains complete Stage 5 draft `Observation` records, with numeric
  cells represented as finite JSON numbers. Missing, duplicate and unexpected
  rows fail closed, as do malformed headers and nonnumeric cells.

An extraction manifest's checksum identifies the exact envelope bytes. Its
`referenceArtifact` records the original acquired artifact's URL, checksum,
publicationVersion, extractionLocator and mediaType, so extracted bytes cannot
be confused with institutional source bytes. The parser does not fetch URLs.
Retain the original artifact only if storage is permitted; otherwise retain
its immutable reference and documented acquisition instructions.

Before any real ingestion, implement and independently validate a source-specific
parser against the acquired bytes and register its fixed ID in code. The
existing synthetic parser tests verify software rejection behavior only. Real
scientific release stays in review until all required source, licence and
reviewer records are provided and the extraction has been independently checked.
