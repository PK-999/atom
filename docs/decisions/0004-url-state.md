# ADR 0004: Comparison URL State

- Status: Accepted
- Date: 2026-08-30

## Decision

The canonical query keys are `sources`, `metric`, `region`, `mode`, and `units`. The obsolete `level` key is ignored under [ADR 0011](0011-single-reading-experience.md). Each invalid value falls back independently, preserving all other valid values.

Browser back/forward navigation must restore comparison state. Opening explanation details preserves sources, metric, geography, display mode, units, ordering and hash. No reading preference is read or written.

`lifecycle-ghg` is the canonical Comparison Lab metric identifier. The
documented `lifecycle-emissions` spelling remains an accepted inbound alias and
is normalized before use; this URL compatibility rule does not rewrite source
dataset identifiers.

The ordered `sources` list is the technology-order contract. URL parsing keeps
the first repeated query value, trims and deduplicates known technology IDs,
preserves an explicit empty `sources=`, and restores the useful default only
when the key is absent or a nonempty value contains no known IDs. Parsing is
bounded to 32 accepted technologies and 64 characters per identifier.

Serialization always writes all five keys in contract order, including
`sources=`. A recipient’s retired reading preference cannot change the shared comparison. Metric and geography
IDs are validated against the known product catalogs independently of evidence
availability, so a known but unreleased metric can produce an honest
unavailable result later in the comparison engine.
