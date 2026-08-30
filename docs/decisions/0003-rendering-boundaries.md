# ADR 0003: Rendering and Client Boundaries

- Status: Accepted
- Date: 2026-08-30

## Decision

Use Next.js App Router with server components by default. Use client components only for controls, charts, drawers, browser history, and other interactions that require browser state. Keep domain, evidence, conversion, and comparison logic in framework-independent TypeScript modules.

Heavy chart, map, and simulation modules are lazy-loaded. Educational text and table fallbacks remain server-rendered and readable without chart JavaScript.
