# ATOM — Knowledge Archive

Consolidated reference from the original documentation. This file preserves key architectural decisions, design system principles, and editorial policies from the pre-rebuild documentation set.

---

## 1. Architecture Decisions Record (ADR) Summary

### ADR 0001: Comparison Lab Delivery Priority (2026-08-30)
- **Decision**: Build the Comparison Lab before Nuclear 101 curriculum
- **Status**: Superseded — both are now built simultaneously in the rebuild

### ADR 0002: Evidence Storage (2026-08-30)
- **Decision**: Was PostgreSQL/Supabase for evidence
- **Status**: Superseded — moving to static JSON for all data. Core principle preserved: React components never contain scientific source values. Every observation resolves to source metadata.

### ADR 0003: Rendering Boundaries
- Server components for data-heavy pages, client components only where interaction demands

### ADR 0004: URL State
- Shareable comparison configurations via URL search params
- Complexity level persisted in URL + localStorage

### ADR 0005: Accessibility Gate
- WCAG AA minimum, keyboard navigation, visible focus, chart table fallbacks

### ADR 0006: Analytics Privacy
- Privacy-respecting analytics only. No invasive tracking.

### ADR 0007: Deployment Environments
- Preview → Staging → Production via Vercel

### ADR 0008: Build Bundler
- Next.js with webpack for production builds

### ADR 0009: Evidence Implementation Reconciliation (2026-09-07)
- Historical note: Two incompatible evidence implementations existed. Resolved by adopting the versioned delivery history. Now superseded by move to static JSON.

---

## 2. Design System Principles

### Brand Personality
ATOM should feel: scientific, curious, calm, polished, premium, exploratory, human, playful when appropriate, serious when required.

ATOM should NOT feel: propagandistic, political-campaign-like, corporate, radioactive-neon, dystopian, cyberpunk, childish, cluttered, dashboard-first.

### Visual References (principles, not copying)
- Our World in Data — evidence clarity
- Stripe — spacing and interaction polish
- NASA — scientific storytelling
- Observable — exploratory data interaction
- The Pudding — interactive journalism
- Kurzgesagt — approachable science
- Linear — precision and interaction quality

### Complexity Levels (now renamed)
| Old Name | New Name | Audience |
|----------|----------|----------|
| Kid (L1) | Beginner | Ages 5-10, short sentences, concrete analogies |
| Simple (L2) | Explorer | Teens, casual adults, plain English |
| Curious (L3) | Curious | Default adult mode, scientific terminology with definitions |
| Technical (L4) | Deep-Dive | Students, analysts, professionals |
| Expert (L5) | Geeky | Engineers, researchers, advanced users |

### Typography
- Display: 48-80px desktop, 36-48px mobile
- Body: 16/26, Body Large: 20/30
- Reading width: 680-760px for prose, 1360-1480px for interactive workspaces
- Monospace for scientific/code/measurements

### Spacing Scale
4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

### Layout Grid
- Desktop: 12 columns, max 1440px, 32-48px outer gutter
- Tablet: 8 columns
- Mobile: 4 columns, 16-20px margins

### Motion Rules
- Micro-interaction: 100-180ms (hover, focus, toggles)
- UI transition: 180-300ms (tabs, drawers, panels)
- Educational animation: longer when animation teaches
- Respect `prefers-reduced-motion`

### Color Tokens (semantic)
Surface, text, border, interaction, feedback, and energy source tokens.
Energy colors must be consistent across charts, maps, cards, filters, simulations.
Never use color as sole encoding.

---

## 3. Evidence & Editorial Policy

### Source Tiers
- **Tier A**: IAEA, UNSCEAR, IPCC, IEA, OECD NEA, WHO, World Bank, national regulators, peer-reviewed research
- **Tier B**: Our World in Data, transparent evidence aggregators
- **Tier C**: Industry associations, NGOs, advocacy, think tanks, media (allowed with perspective disclosure)

### Quantitative Claim Requirements
Every important number must capture: source, publication year, data year, geography, technology, unit, system boundary, method, transformation, uncertainty/range, last verified.

### Key Editorial Rules
- Never strip numbers from context
- State whether a value is median, mean, central estimate, etc.
- Do not fabricate numeric confidence scores
- When sources disagree: present claim, supporting evidence, challenging evidence, methodological reasons, agreement areas, and remaining uncertainty
- Accidents must not be minimized or sensationalized
- AI may explain evidence but must not invent evidence

### Tone
Prefer: "evidence suggests", "under this methodology", "historically", "estimates vary"
Avoid: "obviously", "everyone knows", "completely safe", "zero risk"

---

## 4. Technical Architecture (Updated)

### Stack
- Next.js App Router + TypeScript + React + Tailwind CSS 4
- MapLibre GL JS for maps
- Static JSON for all data (no database)
- Vercel deployment
- AI chat with provider abstraction (Ollama local, hosted API for production)

### Rendering Strategy
- **Static/SSG**: Core explainers, glossary, educational pages, debates
- **Client components**: Simulations, charts, sliders, filters, maps, chat
- Minimize client JS; avoid making entire pages client-rendered

### Scientific Logic
- Keep calculations in framework-independent modules
- UI calls domain functions; domain functions have unit tests
- React renders results — it is not the source of scientific truth

### Performance Targets
- LCP < 2.5s on mobile
- Lighthouse Performance > 90, Accessibility > 95, Best Practices > 95, SEO > 95

### Progressive Enhancement
- If JS fails: educational content remains readable
- If chart JS fails: table fallback remains
- If map cannot load: facility list/table remains

---

## 5. Comparison Lab Spec Summary

### Core User Promise
"Compare energy technologies. Understand the trade-offs. Inspect the evidence."

### Success Criteria
- First-time visitor compares without setup
- All claims expose provenance
- Mobile users get complete experience
- Comparisons shareable by URL
- Uncertainty and methodology limits visible

### Supported Metrics (34 across 6 categories)
Environmental, Reliability, Economic, Human Impact, Material, Energy Security

### Supported Technologies (9)
Nuclear, Solar PV, Onshore Wind, Offshore Wind, Hydropower, Natural Gas, Coal, Biomass, Geothermal

---

## 6. Content Structure

### Lessons (7 published)
1. Energy & Power (fundamentals)
2. Inside the Atom (fundamentals)
3. Nuclear Fission (nuclear-technology)
4. The Nuclear Reactor (nuclear-technology)
5. Generating Electricity (nuclear-technology)
6. Safety & Defense-in-Depth (safety-and-environment)
7. Nuclear Waste & Byproducts (safety-and-environment)

### Topics (4)
1. Energy Fundamentals (published)
2. Nuclear Technology (published)
3. Safety & Environment (published)
4. Electricity Systems & Economics (in-review)

### Debates (3)
- Safety, Costs, Waste — structured with citations, arguments (supporting/disputing/contextualizing), consensus, uncertainty, and missing evidence notes

---

## 7. Accessibility Requirements

- WCAG AA contrast minimum
- Keyboard navigation for all interactive elements
- Visible focus indicators
- Semantic HTML
- 200% zoom usability
- Reduced-motion support
- Chart table/text alternatives
- Screen-reader chart summaries
- Tooltip content reachable without hover
- 44px touch targets
- Labels tied to controls
