# ATOM

ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and its role in the wider electricity system.

The visual direction is a playable science museum with a single reading experience: concise explanations, optional contextual detail and hands-on exhibits. Existing lesson, simulator, reactor, comparison and evidence routes are connected; scientific publication and broader redesign acceptance remain separate gates.

Start with the [playable ATOM brief](docs/superpowers/specs/2026-09-27-playable-atom-design.md), [N01–N14 plan](docs/superpowers/plans/2026-09-27-playable-atom.md) and [delivery tracker](docs/product/DELIVERY-TRACKER.md). [ADR 0011](docs/decisions/0011-single-reading-experience.md) retires reading levels; old links and progress remain compatible.

Evidence serving uses reviewed checked-in files and immutable releases under [ADR 0010](docs/decisions/0010-evidence-release-serving.md). Zero numerical releases are active at the N01 baseline. Historical database migration plans are not the current architecture. Do not run unverified ingestion against an external database.

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
