# ATOM Codex Workflow

## 1. Objective

Use Codex as a disciplined product-development agent, not a one-shot website generator.

---

## 2. Required Workflow for Large Features

```text
Read repository instructions
↓
Understand the feature
↓
Brainstorm / clarify architecture
↓
Establish visual target for UI work
↓
Write implementation plan
↓
Create isolated branch/worktree
↓
Write tests for logic
↓
Implement smallest coherent slice
↓
Run browser verification
↓
Run design QA
↓
Run code review
↓
Run final verification
↓
Merge
```

---

## 3. Skills / Plugins to Use

Where available (ask the user to instal, if not available), prefer:

### Superpowers
- brainstorming
- writing-plans
- using-git-worktrees
- test-driven-development
- systematic-debugging
- requesting-code-review
- verification-before-completion
- dispatching-parallel-agents when tasks are truly independent

### Product Design
- get-context
- ideate
- image-to-code
- design-qa
- audit when reviewing an existing UX

### Vercel
- nextjs
- agent-browser
- agent-browser-verify
- deployments-cicd

### Supabase
- supabase skill for schema, migrations, RLS, queries, storage, and backend configuration

---

## 4. UI Feature Rule

Do not begin production UI from prose alone when a visual target can be established.

Preferred:

```text
brief
→ 3 visual directions
→ choose
→ implementation
→ design QA
```

For flagship surfaces:
- Comparison Lab
- Radiation Explorer
- Reactor Explorer
- Nuclear Globe
- Grid Builder

always establish a selected visual direction before final UI implementation.

---

## 5. Engineering Rule

Scientific/domain code is test-first.

Examples:
- conversions
- annual generation
- emissions aggregation
- range handling
- representative values
- URL-state parsing
- scenario calculations

---

## 6. Parallel Agent Rule

Good parallel tasks:
- accessibility review
- visual QA
- source research
- unit tests
- content QA

Bad parallel tasks:
- two agents editing the same core state model
- multiple agents changing shared schema simultaneously
- agents independently redefining design tokens

---

## 7. Review Rule

Every substantial feature should be reviewed for:
- correctness
- architecture
- accessibility
- mobile behavior
- performance
- scientific provenance
- tests
- maintainability

---

## 8. Verification Rule

Before declaring completion:
- run typecheck
- run lint
- run tests
- run production build
- run E2E
- verify browser
- inspect console
- inspect mobile/tablet/desktop
- verify accessibility
- verify reduced motion
- verify source/evidence states

---

## 9. Prompt Discipline

Bad:
> Build an amazing nuclear website.

Good:
> Read the product docs. Implement the approved Comparison Lab visual target. Do not alter scientific values. Use the evidence layer. Preserve mobile/accessibility requirements. Work test-first for domain logic and verify in-browser before completion.
