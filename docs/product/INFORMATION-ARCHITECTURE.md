# ATOM Information Architecture

## Learning-library extension — 2026-09-07

The current route map is a specification, not proof those routes are implemented.
Only `/`, `/compare`, `/methodology`, `/design-system` and `/health` currently
exist. Follow the [audit route and coverage model](2026-09-07-ATOMIC-ENERGY-EXPERIENCE-AUDIT.md)
and recovery plan R10–R12 for `/learn`, `/topics`, `/topics/[topic]`, `/explore`,
`/search`, `/glossary/[term]`, `/evidence`, dataset-version evidence routes,
`/about` and `/corrections`. Keep `/learn/[lesson]` as the lesson contract.
Navigation and search include only published, reachable destinations. The
homepage offers guided starting questions and one featured working exhibit,
not every feature/control at once.

## Route Map

| Route | Purpose | Rendering default | Release |
| --- | --- | --- | --- |
| `/` | Product orientation and primary learning paths | Static/server | Platform shell |
| `/compare` | Canonical Energy Comparison Lab | Server shell plus focused client islands | Comparison Lab |
| `/compare/[comparison]` | Canonical common comparison landing pages | Static/server | Comparison Lab V1 |
| `/evidence/sources/[sourceId]` | Source metadata and linked observations | Server | Evidence system |
| `/evidence/studies/[studyId]` | Study methods, boundaries, and observations | Server | Evidence system |
| `/methodology` | Evidence selection, transformations, and corrections | Static/server | Evidence system |
| `/learn/[lesson]` | Five-level educational lessons | Static/server plus optional interactives | Nuclear 101 onward |
| `/glossary` | Searchable scientific terms | Static/server | Nuclear 101 |
| `/accessibility` | Accessibility statement and chart alternatives | Static/server | Platform shell |
| `/health` | Non-sensitive application health response | Server route | Platform foundation |

Later flagship routes use `/radiation`, `/debates/[topic]`, `/reactors`, `/globe`, `/india`, `/grid`, and `/ask`.

## Navigation

Primary navigation exposes Learn, Compare, Explore, Evidence, and About. Items without released destinations are omitted rather than disabled. The global complexity selector remains reachable from every educational or evidence surface.

## Page Boundaries

- Route modules own metadata, server data loading, and route-level loading/error states.
- Feature modules own interaction and domain orchestration.
- Evidence routes resolve stable public identifiers and never expose draft records.
- Every chart route includes a server-readable summary or table.
- Common comparison pages canonicalize to a stable path; arbitrary user state remains query-driven on `/compare`.
