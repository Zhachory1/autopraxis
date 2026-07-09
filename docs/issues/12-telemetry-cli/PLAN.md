# Implementation Plan: Issue #12 Telemetry CLI

## Accepted Scope

- Add `telemetry emit|validate|summarize` subcommands.
- Add schema docs and fixtures.
- Add validation tests.

## Non-Goals

- no remote service.
- no runtime auto-capture.
- no eval harness.

## Tasks

### Task 1: Schema and fixtures

**Files**

- `skills/run-telemetry/references/telemetry-event-v1.schema.json`
- `examples/telemetry/valid.jsonl`
- `examples/telemetry/invalid.jsonl`
- `examples/telemetry/sensitive.jsonl`

### Task 2: CLI commands

**Files**

- `bin/autopraxis.mjs`

**Acceptance**

- emit appends one JSON event with `schema_version: 1`.
- validate checks JSONL syntax, required fields, enums, cost/token source fields, and recursive sensitive keys/values.
- summarize prints deterministic aggregate JSON.

### Task 3: Docs and validation

**Files**

- `skills/run-telemetry/SKILL.md`
- `tests/telemetry-cli.mjs`
- `package.json`

**Acceptance**

- skill references CLI commands and schema.
- tests run valid/invalid/sensitive/summarize/emit checks.

## Validation

```bash
npm test
node bin/autopraxis.mjs telemetry validate --path examples/telemetry/valid.jsonl
node bin/autopraxis.mjs telemetry summarize --path examples/telemetry/valid.jsonl
```
