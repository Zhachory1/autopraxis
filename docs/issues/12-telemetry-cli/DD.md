# DD: Issue #12 Executable Run Telemetry

## Decision Need

- decision: Implement telemetry CLI as dependency-free Node commands in `bin/autopraxis.mjs`.
- owner: Autopraxis maintainer.
- PRD: `docs/issues/12-telemetry-cli/PRD.md`

## Proposed Design

### Commands

```bash
node bin/autopraxis.mjs telemetry emit --workflow <name> --step <name> --event <event> --status <status> [--run-id <id>] [--path <file>] [--metric key=value]
node bin/autopraxis.mjs telemetry validate --path <file>
node bin/autopraxis.mjs telemetry summarize --path <file>
```

### Schema

Add `skills/run-telemetry/references/telemetry-event-v1.schema.json` as documented schema. Keep runtime validation hand-written and dependency-free so v1 adds no dependencies.

### Fixtures

Add:

- `examples/telemetry/valid.jsonl`
- `examples/telemetry/invalid.jsonl`
- `examples/telemetry/sensitive.jsonl`

### Sensitive field policy

Validator recursively rejects keys or values that imply raw sensitive content:

- `prompt`
- `raw_prompt`
- `secret`
- `password`
- `api_key`
- `authorization`
- `access_token`
- `token_value`
- `customer_data`
- `raw_log`

Reason: telemetry should store pointers and summaries, not raw private content.

## Tradeoffs

- Manual schema validation is smaller than adding a dependency.
- CLI cannot know true model tokens/cost unless caller provides them, so non-null cost/tokens require `cost_source` or `token_source`.
- Summary is mechanical aggregate data, not an eval report.

## Test Plan

- `node bin/autopraxis.mjs telemetry validate --path examples/telemetry/valid.jsonl` passes.
- invalid fixture fails.
- sensitive fixture fails or warns; v1 chooses fail.
- summarize fixture outputs expected aggregate JSON.
- emit creates parent directories, writes `schema_version: 1`, and validates the emitted event.
- `npm test` runs telemetry checks.
