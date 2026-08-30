# Stage 0 Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the auditable repository and governance baseline required before application work.

**Architecture:** Product requirements stay in `docs/product`; immutable decisions live in `docs/decisions`; operational guidance lives in `docs/engineering`. Git provides the baseline history before feature work moves to an isolated worktree.

**Tech Stack:** Git and Markdown.

**Spec:** `docs/superpowers/specs/2026-08-30-stage-0-governance-design.md`

## Global Constraints

- Do not invent scientific values.
- Do not commit credentials or local environment files.
- Record superseding decisions instead of rewriting accepted ADR history.
- Keep product documents authoritative over summaries.

---

### Task 1: Repository Safety

- [x] Initialize Git on `main`.
- [x] Ignore dependencies, builds, credentials, reports, and `.worktrees/`.

### Task 2: Decisions and Ownership

- [x] Record the seven foundation decisions.
- [x] Define repository ownership and dependency direction.
- [x] Map product requirements to stages and verification owners.

### Task 3: Environments and Release

- [x] Document local, GitHub, Vercel, and Supabase setup.
- [x] Document preview, staging, production, and rollback behavior.

### Task 4: Verification

- [ ] Confirm ignored local files do not appear in Git status.
- [ ] Review all Stage 0 files for placeholders and contradictions.
- [ ] Commit the documentation baseline.
