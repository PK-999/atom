# Local Deployment & Manual Visual Testing Guide

> **Single source of truth** for setting up local instances, running development and production builds, verifying external services, and conducting comprehensive manual visual and accessibility QA across all ATOM routes.

---

## 1. Prerequisites & System Requirements

Before running the application locally, ensure your workstation satisfies the following requirements:

| Requirement | Minimum Version | Verified Active Version | Notes |
|---|---|---|---|
| **Node.js** | `>=24.20.0` | `v24.20.0` | Enforced by `package.json` `engines` |
| **npm** | `>=10.0.0` | `10.8.2` | Recommended package manager |
| **Docker Desktop** | `>=24.0.0` | Latest desktop build | Required for local Supabase PostgreSQL engine |
| **Supabase CLI** | `2.116.0` | Pinned via devDependencies | Run via `npx supabase` or global install |
| **Browsers** | Latest Chromium, Firefox, WebKit | Installed via Playwright | Required for cross-browser testing |

Verify your system versions:
```bash
node -v
npm -v
npx supabase -v
```

---

## 2. Environment Configuration

1. Initialize your local environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Verify or update the required environment variables in `.env.local`:
   ```ini
   # ---------------------------------------------------------------------------
   # Supabase Local Development Configuration (Ports 54321, 54322, 54323)
   # ---------------------------------------------------------------------------
   SUPABASE_URL="http://127.0.0.1:54321"
   SUPABASE_SECRET_KEY="<service_role_key_from_supabase_status>"
   SUPABASE_DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

   # ---------------------------------------------------------------------------
   # Public Client Credentials
   # ---------------------------------------------------------------------------
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon_key_from_supabase_status>"

   # ---------------------------------------------------------------------------
   # Integration & Testing Flags
   # ---------------------------------------------------------------------------
   ATOM_REQUIRE_SUPABASE_INTEGRATION="1"
   ATOM_REQUIRE_INGESTION_INTEGRATION="1"
   ATOM_TEST_DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

   # ---------------------------------------------------------------------------
   # Port Allocation (Default: 3000 for dev, 3100 for E2E / production rehearsal)
   # ---------------------------------------------------------------------------
   PORT=3000
   PLAYWRIGHT_PORT=3100
   ```

> [!CAUTION]
> Never commit `.env.local` to source control. Ensure service role keys remain server-only and are never passed to client components.

---

## 3. Local Supabase Setup & Evidence Seeding

ATOM can run in two modes:
- **Standalone Static Mode**: Uses compiled peer-reviewed static evidence registries (Ask ATOM, India deep-dive, Reactor models, Global facilities, Radiation scales). No database container required.
- **Full Database Mode**: Runs local Supabase with PostgreSQL 15, Row-Level Security (RLS), multi-gate ingestion pipelines, and dynamic metric version activation.

### Starting Full Database Mode:
```bash
# 1. Start local Supabase Docker containers
npm run db:start

# 2. Apply database migrations and pgTAP test suites
npm run db:reset

# 3. Seed authoritative evidence data (IPCC, UNECE, UNSCEAR, Our World in Data)
npm run evidence:seed

# 4. Verify database schema health and advisors
npm run db:test
npm run db:lint
npm run db:advisors
```

Local Supabase Endpoints:
- **REST / Auth API**: `http://127.0.0.1:54321`
- **PostgreSQL Connection**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Supabase Studio (Web UI)**: `http://127.0.0.1:54323`

---

## 4. Local Execution & Deployment Modes

### Mode A: Development Server (Fast Refresh)
Best for rapid code editing and inspecting component behavior:
```bash
npm run dev
```
- Opens at: `http://localhost:3000`
- To run on a different port if 3000 is in use:
  ```bash
  npm run dev -- -p 3005
  ```

### Mode B: Production Build & Local Production Server (Mandatory for Visual QA)
Because Next.js App Router optimizes chunking, server components, and static asset pre-rendering, **all final visual testing must be performed against a production build**:
```bash
# 1. Compile production bundle (Webpack build with strict validation)
npm run build

# 2. Launch production server
npm start
```
- Opens at: `http://localhost:3000`
- All 49+ static and dynamic routes will be served exactly as deployed to production edge CDN.

---

## 5. Automated Verification Checklist

Before starting manual visual inspection, execute the automated verification sequence:

```bash
# 1. Code standards, linting, typechecking, vitest unit tests, and production build
npm run verify

# 2. Database integration tests (when Supabase is running)
npm run test:integration:supabase
npm run test:integration:ingestion
npm run test:rollback

# 3. Automated Playwright E2E browser tests across Chromium, Firefox, WebKit
npm run test:e2e

# 4. External source freshness check
npm run monitoring:sources -- --dry-run
```

---

## 6. Manual Visual Testing Protocol

Follow this structured protocol to visually test and validate the application across multiple screen resolutions, themes, and input modalities.

### A. Viewport Testing Matrix

Open browser developer tools and test each page at these responsive breakpoints:

| Breakpoint | Target Resolution | Device Equivalent | Key Checks |
|---|---|---|---|
| **Mobile Compact** | `320 × 568` | iPhone SE (1st gen) | Zero horizontal scroll overflow; buttons wrap without overlapping; text remains legible. |
| **Mobile Standard** | `390 × 844` | iPhone 14/15/16 Pro | Bottom sheets open cleanly; touch targets are `>= 44px`; navigation burger menu functions smoothly. |
| **Tablet Portrait** | `768 × 1024` | iPad Mini / Air | Two-column grid layouts adapt gracefully; charts scale to full width; table scroll indicators display. |
| **Desktop Standard** | `1440 × 900` | MacBook Air / Pro 14" | Sidebars, split views, and full multi-column evidence comparisons render with optimal breathing room. |
| **Wide Desktop** | `1920 × 1080` | External 1080p Monitor | Max-width constraints (`max-w-7xl`) prevent unnatural horizontal stretching; central reading line length stays under 80 characters. |

### B. Color Scheme & Contrast Verification

ATOM supports Dark mode, Light mode, and System preference.

- **Dark Theme (`#0b0f19` / obsidian)**:
  - Verify card backgrounds use subtle slate tints (`#111827`, `#1e293b`).
  - Verify primary text is high-contrast crisp white/zinc (`#f8fafc`).
  - Verify secondary text meets WCAG AA contrast minimums (`#94a3b8` or lighter).
  - Verify scientific badges (low carbon, high capacity factor) use muted, accessible tones, not vibrating fluorescent neons.
- **Light Theme**:
  - Verify crisp light slate background with high-contrast text (`#0f172a`).
  - Verify borders provide distinct card separation (`#e2e8f0`).
- **System Theme Switching**:
  - Toggle OS appearance while viewing the app; confirm instantaneous theme transition without page reload or visual flash of unstyled content (FOUC).
- **Reduced Motion**:
  - In OS settings, enable *Reduce Motion*.
  - Navigate between lessons, trigger dialogs, and adjust simulator sliders. Verify that transitions snap instantly without animated sliding or pulsing.

### C. Keyboard & Assistive Technology Verification

1. **Skip Links**:
   - Press `Tab` immediately upon page load.
   - Verify a visible `Skip to main content` button appears at the top left.
   - Press `Enter` and confirm focus jumps directly to the `<main>` container.
2. **Keyboard Focus Rings**:
   - Tab through all interactive elements (buttons, sliders, links, tabs).
   - Ensure every element has a prominent, visible focus ring (`ring-2 ring-primary`).
3. **Dialog & Sheet Focus Trapping**:
   - Open the "Inspect Evidence" slide-over drawer or modal.
   - Press `Tab`: focus must circulate strictly inside the drawer.
   - Press `Escape`: the drawer must close immediately, and focus must return to the trigger button that opened it.
4. **Screen Reader Check (VoiceOver on macOS: `Cmd + F5`)**:
   - Navigate through charts and ensure accessible text or table alternatives are announced.
   - Confirm simulator calculation outputs use `aria-live="polite"` so dynamic updates are voiced without interrupting the user.

---

## 7. Route-by-Route Visual Inspection Checklist

Perform manual visual inspection of every route before tagging a public release:

### 1. Home Page (`/`)
- [ ] Hero section renders headline, sub-headline, and quick-jump exploration cards.
- [ ] Navigation bar links (`Learn`, `Compare`, `Radiation`, `Reactors`, `Globe`, `India`, `Grid`, `Ask`, `Debates`) are responsive.
- [ ] Visual indicators demonstrate the evidence-first, non-advocacy philosophy.
- [ ] Footer contains copyright, license statement, and methodology link.

### 2. Comparison Lab (`/compare`)
- [ ] **Metric Selection**: Switch between Greenhouse Gas Emissions, Mortality Rate, Land Footprint, and Levelized Cost.
- [ ] **Technology Toggles**: Select/deselect technologies (Nuclear, Solar, Wind, Gas, Coal); chart dynamically updates.
- [ ] **Uncertainty Visualization**: Ranges (min, median, max) display cleanly without bar overlap.
- [ ] **Evidence Drawer**: Click "Inspect Evidence" on any technology bar; drawer slides in showing publisher, methodology, system boundary, and source URL.
- [ ] **Accessible Fallback**: Click "View as Data Table"; verify full tabular view displays with sorting and screen-reader accessibility.

### 3. Radiation Dose Explorer (`/radiation`)
- [ ] **Logarithmic Dose Scale**: Verify intuitive visualization from banana equivalent (0.1 µSv) to background dose (2.4 mSv/yr), medical scans (7 mSv), and regulatory occupational limit (20 mSv/yr).
- [ ] **Units**: Ensure µSv, mSv, and Sv units are clearly distinguished and mathematically accurate.
- [ ] **Citations**: Verify UNSCEAR and IAEA reference notes are visible.

### 4. Reactor Architecture Explorer (`/reactors`)
- [ ] **Reactor Families**: Toggle between PWR, BWR, PHWR (CANDU), FBR, SMR, and HTGR.
- [ ] **Schematic Diagram**: Confirm primary loop, secondary loop, steam generator, containment building, and control rods are visually identifiable.
- [ ] **Defense-in-Depth**: Review passive safety features and multi-barrier containment breakdown.

### 5. Global Facilities & Interactive Globe (`/globe`)
- [ ] **Station Directory**: Search or filter 400+ operational units across 30+ nations.
- [ ] **Facility Cards**: Verify IAEA PRIS station codes, net electrical output (MWe), reactor model, and operational status.
- [ ] **Globe / Map View**: Test pan, zoom, and station marker tooltips.

### 6. India Energy Deep-Dive (`/india`)
- [ ] **Capacity vs Generation Callout**: Check explicit distinction between ~8.18 GW capacity (~1.8% of total installed) and ~47.8 TWh generation (~2.8% of generation due to ~80% high PLF baseload).
- [ ] **Three-Stage Program**: Inspect Stage 1 (PHWR natural uranium), Stage 2 (FBR plutonium breeding), and Stage 3 (Advanced Thorium-U233 fuel cycle).
- [ ] **Station Tracker**: Inspect operational stations (Tarapur, Rawatbhata, Kudankulam, Kalpakkam PFBR, Kakrapar 700 MWe indigenous PHWRs, Narora, Kaiga).
- [ ] **DAE Roadmap**: Verify 2032 (22.4 GW) and 2047 expansion scenarios.

### 7. Annual Grid Learning Simulator (`/grid`)
- [ ] **Energy Arithmetic**: Adjust Nuclear, Solar, Wind, and Clean Firm sliders. Verify calculation computes explicit annual MWh balance.
- [ ] **Calendar Toggle**: Switch between standard year (8,760 hours) and leap year (8,784 hours).
- [ ] **Coverage Indicator**: Verify annual percentage energy demand coverage is displayed (labeled as *Energy Coverage*, NOT "Reliability").
- [ ] **Four Pillars Disclaimer**: Check prominent educational callout explaining the 4 real-time grid stability pillars (sub-second frequency/inertia, fast ramping, multi-day weather lulls, transmission capacity).

### 8. Ask ATOM Evidence Engine (`/ask`)
- [ ] **Query Box**: Enter standard questions or click suggested prompt chips.
- [ ] **Explanation Tiers**: Toggle between *Simple (L2)*, *Standard (L3)*, and *Technical (L4)* explanations.
- [ ] **Citation Chips**: Click citation badges to verify popup showing verified source publication (IPCC, UNECE, UNSCEAR, OWID, IAEA, DAE).
- [ ] **Abstention Policy**: Enter an unanchored non-energy query (e.g., *"Who won the cricket match?"*); verify polite scientific abstention explaining query falls outside ATOM's peer-reviewed evidence catalog.
- [ ] **Security**: Verify prompt injection attempts are safely neutralized and rendered as plain sanitized text.

### 9. Debates & Critical Issues (`/debates`)
- [ ] **Debate Modules**: Test Waste & Spent Fuel, Reactor Safety & Accidents, Capital Costs & Construction Timelines, Proliferation Safeguards.
- [ ] **Balanced Evidence**: Ensure counter-arguments, uncertainties, and peer-reviewed trade-offs are presented neutrally without promotional bias.

### 10. Learning Lessons (`/learn` and `/learn/[lesson]`)
- [ ] Navigate through curriculum lessons (Fission Physics, Radiation, Baseload & Grid Stability).
- [ ] Complexity slider: Test levels L1 through L5.
- [ ] Interactive diagrams and comprehension checkpoints.

### 11. Scientific Methodology (`/methodology`)
- [ ] Verify system boundary explanations, harmonization standards, lifecycle calculation rules, and correction submission guidelines.

---

## 8. Flagged External Gates & Deployment Handoff

The following manual gates cannot be automated locally and require formal external sign-offs before public deployment:

| External Gate | Stakeholder | Verification Action | Status |
|---|---|---|---|
| **Scientific Review** | Domain Scientist | Review evidence extractions and uncertainty bounds in `scripts/evidence/` | Gated per release |
| **Editorial Review** | Technical Editor | Audit explanations for neutrality, absence of promotional framing, and tone compliance | Gated per release |
| **Licensing Audit** | Legal / Open Data Lead | Verify reuse rights for source charts and documents | Completed for V1 |
| **Hosted Staging Deployment** | Lead Engineer | Deploy branch to Vercel Staging and verify against hosted Supabase | Pre-launch |
| **Production Migration** | Database Admin | Run migration scripts on Supabase Production instance | Pre-launch |
| **DNS & Custom Domain** | Infrastructure Admin | Verify SSL certificates, CDN caching rules, and HSTS headers | Pre-launch |

---

## 9. Rollback & Emergency Procedures

If any critical defect or data discrepancy is observed post-deployment:

### Immediate Evidence Rollback:
```bash
npm run evidence:ingest -- rollback \
  --metric <metric-id> \
  --dataset-version <previous-verified-version-id> \
  --reason "Operational correction: rolled back due to discrepancy in version-xxxxxxxx"
```

### Application Code Rollback:
1. In Vercel / Cloud Dashboard: Click **Instant Rollback** to the preceding green deployment hash.
2. In Git:
   ```bash
   git checkout <last-green-commit-hash>
   npm run verify
   git push origin main --force-with-lease  # If emergency hotfix branch
   ```
