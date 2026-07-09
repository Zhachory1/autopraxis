# PRD: Issue #9 Minimal Workflow Eval Harness

## Decision Need

- decision: Add a deterministic eval harness that makes workflow routing/contracts measurable before model-backed evals.
- owner: Autopraxis maintainer.
- linked issue: https://github.com/Zhachory1/autopraxis/issues/9
- related issue: https://github.com/Zhachory1/autopraxis/issues/5
- base branch: `feat/issue-12-telemetry-cli`

## Problem

Autopraxis has workflow skills, routing, modes, council minimization, and telemetry, but no eval fixture set or runner. Backprop needs evidence that workflow changes improve outcomes instead of adding prompt bloat.

## Goals

- Add one deterministic golden task per top-level workflow.
- Add eval fixture schema and baseline summary.
- Add CLI commands to validate and summarize fixtures.
- Track expected workflow, mode, artifacts, council level, telemetry fields, outcome contract, and privacy status.
- Keep model-backed judging out of v1.

## Non-Goals

- Run LLMs or judge generated answers.
- Build A/B routing.
- Store private prompts/logs/artifacts.
- Replace telemetry CLI.

## Primary Metric

- all top-level workflows have at least one valid eval fixture with expected route/mode/artifact contract.

## Acceptance Criteria

- `evals/workflows/` contains at least one fixture for every top-level workflow.
- fixture schema is documented and validated.
- baseline file exists for v0.1.x and is compared by validation.
- deterministic CLI validates fixtures and summarizes coverage.
- `npm test` runs eval fixture checks.
- privacy rule forbids raw sensitive content.
