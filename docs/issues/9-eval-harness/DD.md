# DD: Issue #9 Minimal Workflow Eval Harness

## Decision Need

- decision: Implement eval v1 as deterministic fixture validation and coverage summary.
- owner: Autopraxis maintainer.
- PRD: `docs/issues/9-eval-harness/PRD.md`

## Proposed Design

### Fixtures

Each fixture under `evals/workflows/*.json` contains:

- `schema_version`
- `id`
- `workflow`
- `scenario`
- `expected_mode`
- `expected_council_level`
- `expected_artifacts`
- `required_telemetry`
- `outcome_contract`
- `privacy`
- `metric_status`
- `privacy`

### CLI

Add:

```bash
autopraxis eval validate --fixtures evals/workflows
autopraxis eval summarize --fixtures evals/workflows
```

This does not call models. It validates fixture contracts and reports coverage by workflow/mode/council level.

### Baseline

Add `evals/baselines/v0.1.0.json` as a structural baseline: fixture count, workflow coverage, mode coverage, council-level coverage, and metric status. Future model-backed evals can add scores.

### Privacy

Fixtures are synthetic and must not include raw private logs, customer data, secrets, or hidden prompts.

## Tradeoffs

- Deterministic fixtures are not proof of model quality, but they define what quality should be measured against.
- One fixture per workflow is minimal; later releases should add more cases and model-backed optional evals.

## Test Plan

- `npm test`
- `node bin/autopraxis.mjs eval validate --fixtures evals/workflows`
- `node bin/autopraxis.mjs eval summarize --fixtures evals/workflows`
