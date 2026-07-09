# Implementation Plan: Issue #9 Eval Harness

## Accepted Scope

- Deterministic eval fixtures only.
- One fixture per top-level workflow.
- CLI validate/summarize commands.
- Baseline summary file.
- Tests included in `npm test`.

## Non-Goals

- no model invocation.
- no LLM-as-judge.
- no A/B routing.

## Tasks

### Task 1: Fixtures and baseline

**Files**

- `evals/workflows/*.json`
- `evals/baselines/v0.1.0.json`

**Acceptance**

- one fixture per top-level workflow.
- all fixtures synthetic and privacy-safe.

### Task 2: CLI eval commands

**Files**

- `bin/autopraxis.mjs`

**Acceptance**

- `eval validate` checks schema, manifest-derived workflow names, expected modes, expected council levels, artifacts, telemetry field names, metric status, baseline, and sensitive content.
- `eval summarize` reports coverage.

### Task 3: Tests and docs

**Files**

- `tests/eval-fixtures.mjs`
- `package.json`

**Acceptance**

- `npm test` runs eval checks.
