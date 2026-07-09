# Implementation Plan: Issue #8 Workflow Router

## Accepted Scope

- Add README Start Here router above the skill inventory.
- Use one canonical router table with role as context.
- Add advisory depth labels only; real mode semantics remain issue #10.
- Add `Use when` / `Do not use when` guidance for top-level workflows.
- Mark shared skills as connective primitives, not default entrypoints.
- Add validation for router structure.

## Non-Goals

- no new `workflow-router` skill.
- no CLI `which-skill` command.
- no manifest changes.
- no enforceable mode/token budgets.
- no council minimization matrix.

## Council Decisions Incorporated

- MVP/Occams: keep one README section and one table; no new router skill or runtime.
- Docs-DX/Product: include canonical routes and prevent shared-skill entrypoints.
- Generalist: validate README structure using `autopraxis.json` workflow/shared metadata.
- Cost: keep common paths `lite`/`default`; reserve `deep` for high-risk tasks.

## Tasks

### Task 1: README router

**Inputs**

- `README.md`
- `autopraxis.json`

**Outputs**

- `## Start here` section before `## Skills`.
- role quick path bullets.
- advisory depth legend.
- router table with at least 10 rows.
- workflow inventory with `Use when` / `Do not use when` guidance.
- shared skills section labeled connective primitives.

**Acceptance Criteria**

- user can pick one top-level workflow from router table.
- no shared skill appears as a router recommendation.
- leadership routes to `roadmapping`, not `human-approval-gate`.

### Task 2: Validation

**Inputs**

- `tests/validate-skills.mjs`
- `README.md`
- `autopraxis.json`

**Outputs**

- validation checks Start Here placement.
- validation parses router rows.
- validation rejects shared-skill entrypoints.
- validation ensures all workflows have guidance.

**Acceptance Criteria**

- `npm test` passes.
- test would fail if router section disappears or uses a shared skill as entrypoint.

### Task 3: Validate and PR

**Validation**

```bash
npm test
npm pack --dry-run
```

**PR Notes**

- closes #8 if all acceptance criteria pass.
- references council decision to defer router skill and enforceable modes.
