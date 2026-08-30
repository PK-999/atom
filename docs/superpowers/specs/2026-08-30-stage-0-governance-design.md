# Stage 0 Governance Design

## Goal

Turn the documentation-only ATOM directory into an auditable repository with explicit architectural decisions, ownership boundaries, environment expectations, and release gates.

## Design

Product documents remain the authoritative requirements. Architecture Decision Records capture choices that affect implementation. The requirements matrix assigns verification responsibility without duplicating detailed specifications. Engineering guides define repository boundaries and promotion behavior.

## Acceptance

- Git repository exists on `main`.
- Worktree contents are excluded from version control.
- The Comparison-Lab-first ordering is recorded.
- Evidence, rendering, URL, accessibility, analytics, and environment decisions are recorded.
- Requirements have delivery stages, verification methods, and responsible roles.
- Local, GitHub, Vercel, Supabase, promotion, and rollback procedures are documented.
