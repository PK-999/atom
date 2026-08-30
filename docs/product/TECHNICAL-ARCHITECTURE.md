# ATOM Technical Architecture

## 1. Architecture Goals

The system should be:
- fast
- inspectable
- maintainable
- evidence-driven
- accessible
- mobile-first
- friendly to incremental delivery
- friendly to AI-assisted development

---

## 2. High-Level Architecture

```text
Vercel CDN
   ↓
Next.js App Router
   ├── static educational routes
   ├── server-rendered evidence routes
   ├── interactive client features
   └── API/server actions where necessary
   ↓
Supabase / PostgreSQL
   ├── metrics
   ├── studies
   ├── citations
   ├── claims
   ├── facilities
   ├── reactors
   └── optional user data
   ↓
Evidence ingestion/normalization
   ├── TypeScript
   └── Python where data work is easier
```

---

## 3. Frontend

Preferred:
- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui + Radix
- Motion
- D3
- Observable Plot
- MapLibre GL

Use React for lifecycle/state.
Use D3 primarily for scales, geometry, and specialized chart calculations.

---

## 4. Rendering Strategy

### Static/SSG
Use for:
- core explainers
- glossary
- stable educational pages
- debate pages where data is periodically rebuilt

### SSR/server components
Use for:
- evidence-heavy pages
- dynamic metadata
- query-driven comparisons where beneficial

### Client components
Use only where interaction requires them:
- simulations
- charts
- sliders
- complex filters
- maps

Avoid making entire pages client-rendered without need.

---

## 5. Content Strategy

### MDX
Use for:
- lessons
- narrative explainers
- guided stories
- debate editorial framing

### PostgreSQL
Use for:
- metrics
- observations
- sources
- studies
- citations
- facilities
- reactor metadata
- structured claims

### Typed JSON/config
Use for:
- simulation presets
- chart definitions
- quiz configuration
- learning-path configuration

---

## 6. Suggested Data Model

Core entities:

```text
technology
metric
metric_observation
study
source
citation
claim
claim_evidence
country
facility
reactor
dataset
concept
explanation
glossary_term
scenario
quiz
question
```

Suggested relationships:

```text
metric
  └── metric_observation
        ├── technology
        ├── geography
        ├── study
        └── source

claim
  └── claim_evidence
        ├── supports
        ├── disputes
        └── contextualizes
```

---

## 7. Metric Observation Shape

Conceptual fields:

```text
id
metric_id
technology_id
value
unit
value_min
value_max
representative_kind
geography
year_start
year_end
study_id
source_id
methodology
system_boundary
uncertainty_note
transformation_note
last_verified_at
```

Use Zod or equivalent validation.

---

## 8. Evidence Ingestion Pipeline

```text
RAW SOURCE
   ↓
DOWNLOAD / FETCH
   ↓
CHECKSUM
   ↓
SOURCE METADATA
   ↓
SCHEMA VALIDATION
   ↓
NORMALIZATION
   ↓
UNIT CONVERSION
   ↓
QUALITY CHECK
   ↓
DERIVED METRICS
   ↓
PUBLISH
```

Store:
- source URL/id
- access date
- version
- license
- checksum
- transformations

---

## 9. Scientific Logic

Keep scientific calculations in framework-independent modules.

Examples:
- energy generation math
- capacity factor math
- unit conversions
- storage efficiency
- scenario math
- emissions aggregation

UI should call domain functions.

Domain functions should have unit tests.

---

## 10. State Management

Prefer:
- URL state for shareable comparison configuration
- local component state for ephemeral UI
- Zustand for complex cross-component simulation state
- server state tools only where needed

Do not use a global store for everything.

---

## 11. Search

Search should eventually support:
- concepts
- topics
- technologies
- countries
- facilities
- metrics
- claims
- glossary
- datasets

Start simple.
Add semantic search only if normal search proves insufficient.

---

## 12. Ask ATOM Architecture

Do not build before evidence architecture is mature.

Conceptual:

```text
User question
   ↓
intent/query parsing
   ↓
evidence retrieval
   ↓
curated ATOM corpus
   ↓
LLM
   ↓
answer
 + citations
 + evidence links
```

AI may explain evidence.
AI may not invent evidence.

---

## 13. Performance

Targets:
- LCP < 2.5s on representative mobile connection
- Lighthouse Performance > 90 target
- Accessibility > 95 target
- Best Practices > 95 target
- SEO > 95 target

Strategies:
- static generation
- cache stable evidence
- lazy-load heavy maps/simulations
- code-split charts
- optimize fonts
- responsive images
- minimize client JS

---

## 14. Progressive Enhancement

If JavaScript fails:
- educational content remains readable

If chart JS fails:
- table fallback remains

If map cannot load:
- facility list/table remains

If GPU is weak:
- simplified experience allowed

If data fetch fails:
- show cached value with timestamp where safe

---

## 15. Authentication

V1:
- no login required for learning

Later optional accounts:
- saved simulations
- bookmarks
- learning progress
- quiz history

Never gate public educational content behind account creation.

---

## 16. Security

- validate external data
- sanitize rendered content
- use RLS for user-owned Supabase data
- avoid exposing service-role secrets
- rate-limit AI endpoints
- validate URL-state params
- keep dependencies current
- use CSP/security headers where practical

---

## 17. Deployment

Preferred:
- GitHub
- Vercel
- Supabase
- GitHub Actions

Stages:
- preview
- staging
- production

Use preview deployments for design review.

---

## 18. Observability

Track:
- errors
- performance
- failed data ingestion
- stale datasets
- AI retrieval failures
- broken source links

Prefer privacy-respecting analytics.

---

## 19. Repository Structure

```text
app/
components/
  ui/
  education/
  evidence/
  charts/
  simulations/
  maps/
features/
  comparison/
  radiation/
  grid-builder/
  reactor-explorer/
  nuclear-globe/
content/
  concepts/
  lessons/
  debates/
data/
  schemas/
  sources/
  transforms/
lib/
  analytics/
  evidence/
  accessibility/
  search/
tests/
public/
docs/
  product/
```
