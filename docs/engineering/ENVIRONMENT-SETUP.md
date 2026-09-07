# Environment Setup & Local Development Guide

> **Single source of truth** for configuring local development, environment variables, Supabase, and CI/testing environments.

---

## 1. Prerequisites & Node Version

Ensure your system meets the project prerequisites:
- **Node.js**: `>=24.20.0` (as pinned in `package.json`).
- **npm**: `>=10.0.0`.
- **Docker**: Running (required for local Supabase containers).
- **Supabase CLI**: Pinned version `2.116.0` (`npx supabase` or installed globally).

Verify versions:
```bash
node -v   # v24.20.0+
npx supabase -v # 2.116.0+
```

---

## 2. Environment Variables Configuration

Create `.env.local` in the repository root by copying `.env.example`:
```bash
cp .env.example .env.local
```

### Required Variables
```ini
# Supabase API & Server-Only Credentials
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_SECRET_KEY="<service_role_key_from_supabase_status>"

# Supabase Direct PostgreSQL Connection (for migrations, seeds, and ingestion)
SUPABASE_DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Public Client Credentials
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon_key_from_supabase_status>"

# Testing Flags
ATOM_REQUIRE_SUPABASE_INTEGRATION="1"
ATOM_REQUIRE_INGESTION_INTEGRATION="1"
ATOM_TEST_DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Playwright E2E Port (avoid 3000 if occupied by other apps)
PLAYWRIGHT_PORT="3100"
```

> [!WARNING]
> Never commit `.env.local` or any file containing real API keys or credentials. Service role keys must remain server-only.

---

## 3. Local Supabase Setup

Start and reset the disposable local Supabase instance:
```bash
# Start local containers (Postgres, Studio, Auth, Storage)
npm run db:start

# Reset schema and apply canonical migration chain
npm run db:reset

# Seed test evidence for Comparison Lab and UI exploration
npm run evidence:seed
```

Useful local Supabase endpoints:
- **API URL**: `http://127.0.0.1:54321`
- **Postgres DB**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Studio UI**: `http://127.0.0.1:54323`

---

## 4. Verification & Testing Commands

Before pushing commits, run the full validation suite:

```bash
# Strict typecheck, linting, unit tests, and production build
npm run verify

# Database schema, pgTAP tests, and advisor validation
npm run db:test
npm run db:lint
npm run db:advisors

# Repository and Ingestion integration tests
npm run test:integration:supabase
npm run test:integration:ingestion
npm run test:rollback

# End-to-end browser suite (Playwright on port 3100)
npm run test:e2e
```

---

## 5. Port Allocation & Avoiding Conflicts

- **Web Development Server**: Port 3000 (`npm run dev`) or Port 3100 when running Playwright E2E.
- If port 3000 is occupied by another service on your machine, specify a distinct port:
  ```bash
  npm run dev -- -p 3100
  ```
- Playwright defaults to `PLAYWRIGHT_PORT=3100` as configured in `playwright.config.ts`.
