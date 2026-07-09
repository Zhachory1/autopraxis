---
name: backprop
description: "Backprop workflow optimizer for AI agent workflows. Use for retrospective optimization, previous execution review, workflow telemetry analysis, run history, latency/cost/failure rate, human-edit rate, rework loops, recurring failure modes, prompt/skill improvement, council regression review, shadow rollout, A/B test, promote-or-rollback changelog. Uses long-term memory MCP, code RAG, agent-fleet journal/transcripts, PR/CI data, and run telemetry."
---

# Backprop

Optimize workflow skills by reviewing prior executions, telemetry, human edits, and outcomes. Treat workflow improvement like gradient descent over measured failures, with council regression checks and shadow or A/B rollout before promotion.

## Core Principles

**Optimize measured problems.** Every proposed change must tie to observed failure, cost, latency, rework, human override, or quality gap.

**Use multiple data sources.** Combine run telemetry, long-term memory MCP, code RAG, agent-fleet journals/transcripts, PR/CI outcomes, git history, and human feedback.

**Hypotheses before edits.** Workflow changes are testable hypotheses with expected metric movement and regression risks.

**Regression review before promotion.** Use `council-review` to catch new failure modes introduced by prompt or skill changes.

**Roll out safely.** Shadow, A/B, promote-or-rollback, and changelog rather than mutating core workflows blindly.

## Inputs

- target workflow or skill set.
- `.workflow-runs/<run-id>/telemetry.jsonl` files.
- run artifacts, handoffs, council outputs, PRs, reviews, CI results.
- long-term memory MCP notes, decisions, retros, incidents.
- code RAG/repo-index metadata for affected skill repo and downstream code repos.
- agent-fleet journal and transcripts from `$AGENT_FLEET_JOURNAL` and `$AGENT_CHAT_ROOT/rooms`.
- baseline workflow version and candidate change budget.

## Data Sources

Use available sources in this priority order:

- `run-telemetry` JSONL from current workflow runs.
- agent-fleet `agent-fleet` council journal and room transcripts.
- long-term memory MCP / `gbrain` for session notes, decisions, incidents, project docs, human feedback, prior retros.
- code RAG / repo-index / `coderag` for skill definitions, code changes, recurring affected paths, ownership, semantic similarity.
- git history for workflow skill commits, downstream patch diffs, revert frequency, commit size, review churn.
- GitHub PR reviews, comments, CI failures, merge/rollback status.
- experiment trackers, benchmark artifacts, validation logs where relevant.

Store only summaries and pointers unless operator approves durable capture of sensitive details.

## Council Policy

Use `../council-review/references/escalation-matrix.md`. Small prompt/template changes can use one reviewer lens or no council after eval evidence. Use minimal/full council for workflow contract changes, regression-risk changes, cost/telemetry schema changes, or changes that alter human approval/council behavior.

## Workflow Modes

- `lite`: inspect one run or small prompt/template change. Budget: summary/pointers only, no council unless regression risk appears.
- `default`: analyze multiple runs, cluster failures, propose measured improvements. Budget: focused telemetry, one hypothesis loop, `council_level` max `single-lens` unless risky.
- `deep`: workflow contract, telemetry schema, human approval, or release-impacting change. Budget: council allowed with reason, shadow/A-B plan, changelog package.
- Escalate: regression risk, cost/telemetry schema change, human approval behavior change, or conflicting outcome evidence.
- Load: start with telemetry summaries/pointers; load raw artifacts, council transcripts, or eval reports only when needed and permitted.

## Execution

**Ingest run history.** Use `grounding-brief` to gather telemetry, artifacts, memory, code RAG, agent-fleet, PR/CI, and git sources. Normalize into comparable run records.

**Compute per-step metrics.** Use `success-criteria-metrics` to track latency, cost, token use, failure rate, blocker rate, human-edit rate, rework count, loop count, escalation count, validation pass rate, council precision, and final outcome.

**Cluster failure modes.** Group recurring issues by workflow, step, skill, source, model, tool availability, artifact type, and severity.

**Attribute root cause.** Use `hypothesis-testing` to distinguish bad prompt/skill, missing context, wrong ordering, weak rubric, bad persona roster, absent telemetry, code RAG gap, memory drift, model limitation, or human process mismatch.

**Generate improvement hypotheses.** For each measured problem, propose a minimal skill or workflow change with expected metric movement, regression risk, owner, and validation plan.

**Council review proposed changes.** Use `../council-review/references/escalation-matrix.md` to pick one lens, minimal council, or full council. Gate against overfitting, prompt bloat, regressions, and cost creep when measured risk justifies council.

**Shadow or A/B rollout.** Run candidate workflow against baseline on comparable tasks. Prefer shadow mode first for high-risk changes; use A/B only when routing and metrics are fair.

**Promote or rollback.** If candidate beats baseline without guardrail regressions, promote with changelog and version bump. Else rollback and record why.

**Package learning.** Use `handoff-packaging` and `human-approval-gate` for promotion decisions, especially changes that alter gates or human approval behavior.

## Loop Controls

**Backprop cycle.** Ingest, measure, cluster, attribute, hypothesize, select council level, review only when risk justifies it, shadow/A/B, promote-or-rollback.

**Stop on no measured problem.** Do not edit workflows for aesthetics.

**Stop on insufficient data.** Escalate with data gaps and instrumentation recommendations.

**Stop on regression.** Roll back candidate if guardrails fail even when primary metric improves.

**Limit optimization batch.** Change the smallest set of skills needed to test the hypothesis.

**Carry state.** Maintain baseline version, candidate version, failure clusters, ruled-out causes, A/B assignment, results, and changelog.

## Output Contract

```markdown
# Backprop Report

## Scope
- workflows analyzed:
- baseline version:
- data sources:
- run count:

## Metrics
- step:
  latency:
  cost:
  failure rate:
  human-edit rate:
  loop count:
  escalation rate:
  outcome:

## Failure Clusters
- cluster:
  evidence:
  affected workflows:
  frequency:
  impact:

## Root Cause Attribution
- hypothesis:
  verdict:
  evidence:
  ruled out:

## Proposed Changes
- change:
  measured problem:
  expected improvement:
  regression risk:
  validation:

## Rollout
- mode: shadow | A/B | direct-with-approval | rollback
- baseline:
- candidate:
- decision rule:

## Decision
- promote-or-rollback:
- rationale:
- changelog:
- telemetry path:
```

## Success Criteria

- analysis uses actual run data, not anecdote alone.
- proposed changes tie to measured failure modes.
- root cause alternatives are considered and ruled out.
- council level is recorded; minimal/full council reviews regression risk only when escalation matrix triggers it.
- shadow or A/B result compares candidate to baseline when feasible.
- promote-or-rollback decision has changelog.
- `run-telemetry` events emitted for the backprop run itself.

## Common Failure Modes

**Prompt gardening.** Fix by requiring measured problem and expected metric movement.

**Overfitting to one run.** Fix by minimum data threshold or shadow-only recommendation.

**Telemetry blind spot.** Fix by proposing `run-telemetry` instrumentation before workflow edits.

**Bloat as improvement.** Fix by single-lens or council review with docs-dx, cost-finops, red-team, and occams-style simplicity lens when risk justifies it.

**Unfair A/B.** Fix by comparable task assignment and guardrail metrics.

## Self-Improvement

Backprop improves itself by tracking whether its own recommendations later reduced failure, cost, latency, or human-edit rate. If backprop changes repeatedly fail to promote, simplify its attribution rubric and raise the data threshold.
