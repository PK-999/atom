# ATOM

ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and its role in the wider electricity system.

The approved visual direction is Digital Science Museum with Scientific
Editorial restraint. The current Lab is a prototype with incomplete evidence
integration; later learning tools are unconnected scaffolds, not released
features. The goal is a calm learning library with purposeful interactive
exhibits and inspectable sources.

Start with the [2026-09-07 audit](docs/product/2026-09-07-ATOMIC-ENERGY-EXPERIENCE-AUDIT.md),
[implementation and test plan](docs/superpowers/plans/2026-09-07-learning-platform-recovery.md),
[delivery tracker](docs/product/DELIVERY-TRACKER.md) and
[next tasks](docs/product/PENDING-TASKS.md). Root and the Stage 6 worktree have
divergent database implementations; reconcile them before running migrations or
ingestion. Do not run the unverified `scripts/ingest-reference.ts` against an
external database.

## Local Setup

1. Use Node.js 24.20.0 or a compatible newer runtime.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` when environment configuration is needed.
4. Run `npm run dev` for local development.

## Verification

- `npm run format:check`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:e2e`

Product requirements live in `docs/product`, accepted decisions in `docs/decisions`, and environment/release instructions in `docs/engineering`.
