# ATOM Requirements Matrix

This matrix assigns the product source-of-truth requirements to delivery stages and verification owners. Detailed feature requirements remain authoritative in the linked product documents.

## 2026-09-07 learning-library and recovery mapping

Exact steps/tests: `docs/superpowers/plans/2026-09-07-learning-platform-recovery.md`.

| Requirement | Work packages | Acceptance evidence | Owner role |
| --- | --- | --- | --- |
| Preserve divergent user work and one migration history | R01 | Reconciliation ADR and disposable DB checks | Platform engineering |
| Correct numerical conversions and missing-data semantics | R02/R05 | Hand-derived values; no null-to-zero | Domain engineering |
| Valid shareable state and level precedence | R03/R06 | Invalid-field, round-trip and history tests | Product engineering |
| Real publication, licensing, provenance and rollback | R04/R07–R09 | Actual DB transactions and real review records | Evidence engineering/editor |
| Comprehensive but uncluttered atomic-energy topic coverage | R10/R12 | Topic graph, explicit gaps, usability pilot | Content design/editor |
| Guided learning and meaningful interactives | R11/R13–R17 | Objective→interaction→feedback→source→next journey | Education/product engineering |
| Search/glossary/evidence discovery without draft leakage | R12 | Index/route/link and published-only tests | Product engineering |
| Same learning experience on mobile, keyboard and no-JS fallback | R06/R11–R18 | Shared browser matrix and source access | Accessibility reviewer |
| Honest model limits and radiation quantities | R13/R17 | Quantity/unit and annual arithmetic tests | Domain reviewer |
| Grounded answers with validated citations and abstention | R18 | Versioned retrieval evaluation and browser flow | Evidence/AI engineering |
| Maintained evidence and correction history | R19 | Recorded scheduled success/failure and rollback | Evidence operations |

| Requirement group | Delivery stage | Verification | Responsible role |
| --- | --- | --- | --- |
| Evidence before persuasion and neutral tone | 1, 5, 10–25 | Editorial and source review | Evidence editor |
| Five complexity levels; evidence remains unchanged | 1, 4, 7, 8, 17–24 | Unit, integration, and E2E tests | Product engineering |
| Provenance for quantitative claims | 5, 6, 10–16 | Schema completeness and content QA | Evidence engineering |
| No scientific constants in presentation | 5–8, 23 | Architecture review and import-boundary tests | Domain engineering |
| Missing, stale, disputed, and incompatible data | 5–8 | Domain, component, and E2E tests | Product engineering |
| Mobile retains the full intellectual experience | 3, 4, 8, 16–24 | 390px browser and content review | Product design |
| Keyboard, focus, contrast, zoom, and reduced motion | 4, 8, 9, 16–24 | axe plus manual accessibility QA | Accessibility review |
| Chart narrative and table fallback | 4, 8, 10–24 | Component, screen-reader, and no-JS checks | Data visualization |
| Shareable and resilient Comparison Lab state | 7, 8, 16 | Unit, integration, and E2E tests | Product engineering |
| Test-first scientific/domain logic | 5–7, 10–25 | Red-green record and CI | Domain engineering |
| Server-first rendering and limited client JavaScript | 2, 4, 8, 18–24 | Bundle and rendering review | Platform engineering |
| Performance targets and progressive enhancement | 2, 8, 9, 16–24 | Lighthouse, Web Vitals, no-JS fallback | Platform engineering |
| Real-browser verification before completion | Every UI stage | Browser checklist and screenshots | Release reviewer |
| Correction history and dataset rollback | 5, 6, 9, 16, 25 | Rollback drill and audit log review | Evidence operations |
| Public learning without authentication | 1–24 | Route and access-control tests | Platform engineering |
