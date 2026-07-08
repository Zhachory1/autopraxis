---
name: run-telemetry
description: "Emit structured workflow telemetry for AI agent runs. Use for run metrics, step latency, cost, tokens, model, loop count, failure rate, human-edit rate, escalations, council verdicts, validation status, PR outcomes, ML metrics, debug evidence, backprop data. Writes JSONL events to .workflow-runs/<run-id>/telemetry.jsonl or caller-provided store for later optimization."
---

# Run Telemetry

Emit structured events for every workflow step so `backprop` can measure and improve the workflow library. The `run-telemetry` skill also emits telemetry for its own failures and schema changes. Without telemetry, optimization becomes anecdotes.

## Core Principles

**Telemetry is workflow evidence.** Capture enough metadata to compare runs, steps, loops, and outcomes.

**Low friction wins.** Prefer small JSONL events over perfect observability that agents skip.

**No secrets.** Store pointers and summaries, not credentials, customer data, or sensitive raw logs.

**Stable schema beats prose.** Backprop needs consistent field names across workflows.

**Emit at boundaries.** Record start, end, gate, loop, escalation, validation, and human response events.

## Inputs

- workflow name and step name.
- run id, repo, branch, artifact pointers.
- model/tool metadata if available.
- latency, cost, tokens, iterations, validation, verdicts, human edits.
- caller-provided telemetry path or default `.workflow-runs/<run-id>/telemetry.jsonl`.

## Event Store

Default path:

```text
.workflow-runs/<run-id>/telemetry.jsonl
```

Fallback path when no repo is available:

```text
~/.autopraxis/runs/<run-id>/telemetry.jsonl
```

Use existing run dirs when the workflow provides them. Do not write sensitive content to long-term memory unless explicitly approved.

## Event Schema

```json
{
  "ts": "2026-07-08T00:00:00.000Z",
  "run_id": "workflow-20260708-abc123",
  "workflow": "dev-workflow",
  "step": "council-on-docs",
  "event": "start|end|gate|loop|escalation|validation|human_response",
  "status": "ok|fail|blocked|skipped|inconclusive",
  "latency_ms": 0,
  "cost_usd": null,
  "tokens_in": null,
  "tokens_out": null,
  "model": null,
  "tools": [],
  "artifact_refs": [],
  "metrics": {},
  "verdict": null,
  "loop_iteration": 0,
  "loop_cap": 0,
  "human_edit_rate": null,
  "escalation_reason": null,
  "notes": null
}
```

## Execution

**Create run id.** Use caller id if supplied. Else derive from workflow, timestamp, and short random suffix.

**Emit start.** Record workflow, step, source refs, model/tool availability, and budget cap.

**Emit gates.** Record pass/block, council verdicts, validation results, metrics, and reasons.

**Emit loops.** Record iteration number, delta scope, remaining budget, and stop decision.

**Emit escalations.** Record cap hit, human ask, missing data, destructive action confirmation, or high-risk blocker.

**Emit end.** Record outcome, latency, cost/tokens if available, artifacts, and next step.

**Summarize.** At handoff, aggregate events into latency, cost, loop count, failure, validation, and human-edit summary.

## Output Contract

```markdown
# Telemetry Event Emitted

- run id:
- path:
- workflow:
- step:
- event:
- status:
- notable metrics:
```

## Backprop Metrics

`backprop` should compute:

- per-step latency and cost.
- failure and block rates.
- rework and loop counts.
- human-edit and override rates.
- validation failure rates.
- missing-context rates.
- council blocker precision where outcome is known.
- PR merge, rollback, deploy, or experiment promotion outcomes.

## Success Criteria

- JSONL event written or unavailable store reported.
- event includes workflow, step, status, and timestamp.
- no secrets or raw sensitive data stored.
- run id links all workflow artifacts.
- event schema remains parseable.

## Common Failure Modes

**Telemetry skipped because it is annoying.** Fix by emitting minimal fields first and filling optional metrics later.

**Raw data leakage.** Fix by storing pointers and summaries only.

**Unstable field names.** Fix by preserving schema and adding new data under `metrics`.

**Backprop cannot join events.** Fix by consistent run id and artifact refs.

## Self-Improvement

Track fields that are frequently missing but useful for `backprop`, plus fields nobody uses. Propose schema changes through `backprop` with migration notes and council review before promotion.
