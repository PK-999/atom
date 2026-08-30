# ATOM

ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and its role in the wider electricity system.

The repository is currently at the platform-foundation checkpoint. The production Comparison Lab UI will not be built until one of three visual directions is explicitly approved.

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
