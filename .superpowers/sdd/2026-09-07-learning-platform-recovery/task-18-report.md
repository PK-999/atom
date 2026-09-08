# Task Report: Package R18 — Ask ATOM Evidence Engine

**Task ID:** R18
**Date:** 2026-09-08
**Status:** Completed & Verified
**Git Commit:** `9d36eae`

---

## 1. Scope & Accomplishments

Package R18 implements an evidence-grounded Ask ATOM question-answering experience grounded in peer-reviewed scientific literature and the published evidence catalog:

1. **Answer State Integrity (No Naive Confidence Scores):**
   - Explicit finite answer states: `idle`, `loading`, `answered`, `insufficient-evidence`, `error`.
   - Response bound deterministically to `queryId`.

2. **60+ Case Evaluated Retrieval Engine:**
   - Grounded knowledge across carbon footprint (IPCC AR5 median 12 gCO2eq/kWh), safety & mortality (Our World in Data / Markandya & Wilkinson 0.03 deaths/TWh), radiation doses & banana equivalent dose (UNSCEAR 2020), waste storage & deep geological disposal (IAEA 2022 / Onkalo), land use intensity (UNECE 2021), and India's Bhabha 3-stage thorium fuel cycle (DAE 2023).
   - 100% resolved citations on all answered responses with verified source metadata.

3. **Strict Evidence Boundary & Abstention:**
   - Strict abstention policy: "ATOM does not currently have verified peer-reviewed scientific evidence in its published catalog to answer this query. To preserve evidence integrity, ATOM abstains from ungrounded speculation."
   - Tested against weapons instructions, political forecasting, speculative stock picking, conspiracy theories, and off-topic prompts.

4. **Prompt Injection & XSS Defenses:**
   - Detects jailbreak and system-prompt override attempts (`ignore all previous instructions`, `unrestricted DAN mode`, etc.) and safely abstains.
   - Script tag and event handler sanitization preventing untrusted HTML injection.

5. **Multi-Tier Explanations & Accessible UI:**
   - Explanations available in Simple, Standard, and Technical tiers without changing underlying scientific facts.
   - Keyboard accessible, suggested questions chips, and `data-hydrated` state guarantees.

---

## 2. Verification Results

- **Unit Tests:**
  - `lib/ask/schemas.test.ts`: 4 passed
  - `lib/ask/retrieval-engine.test.ts`: 63 passed
  - `features/ask/AskAtom.test.tsx`: 4 passed
  - Total: 71/71 passed
- **Verification Pipeline:**
  - `npm run verify`: Prettier format OK, Typecheck OK, ESLint 0 errors, Vitest 76 files / 482 tests passed, Next.js build 49/49 static pages generated.
- **Playwright E2E Tests (`tests/e2e/ask.spec.ts`):**
  - Chromium: 5/5 passed
  - Firefox: 5/5 passed
  - WebKit: 5/5 passed
  - Total: 15/15 passed
