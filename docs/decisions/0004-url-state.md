# ADR 0004: Comparison URL State

- Status: Accepted
- Date: 2026-08-30

## Decision

The canonical query keys are `sources`, `metric`, `region`, `mode`, `units`, and `level`. URL values override local preferences. Each invalid value falls back independently, preserving all other valid values.

Browser back/forward navigation must restore comparison state. Complexity changes preserve sources, metric, geography, display mode, units, and ordering. Local storage supplies the complexity preference only when the URL omits `level`.
