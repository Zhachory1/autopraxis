---
name: task-decomposition-planning
description: "Turn approved goals, PRDs, DDs, ML experiment plans, roadmaps, or investigations into ordered dependency-aware tasks. Use for implementation plan writing, experiment plan, roadmap sequencing, acceptance criteria, blockers, atomic PRs, verifiable tasks, handoff to ship agents. Produces tasks with owners, dependencies, validation, acceptance criteria, risk, and telemetry."
---

# Task Decomposition And Planning

Convert an approved goal or design into ordered, verifiable tasks. The output should let an implementer or experiment runner execute without re-deriving intent.

## Core Principles

**Plan after intent is approved.** Do not decompose unstable goals; send unclear PRD/DD/metrics back to `structured-doc-authoring`, `success-criteria-metrics`, or `council-review`.

**Make every task testable.** Each task needs acceptance criteria and validation evidence.

**Order by dependency and risk.** Unblock learning and de-risk unknowns early.

**Keep tasks atomic.** Prefer one concern per task or PR. Split work when reviewability suffers.

**Escalate plan/design mismatch.** If planning reveals design flaws, return to DD or framing instead of hiding changes in implementation.

## Inputs

- approved PRD, DD, roadmap candidate, experiment proposal, or investigation goal.
- success criteria and metrics.
- constraints: timeline, owners, systems, dependencies, non-goals.
- preferred task granularity.
- run id for `run-telemetry`.

## Execution

**Restate accepted scope.** Capture goal, non-goals, and source artifacts.

**Extract deliverables.** Identify user-visible, system, data, test, docs, rollout, and observability outputs.

**Map dependencies.** Order prerequisites, external blockers, owner handoffs, and risky unknowns.

**Create tasks.** Write each task with context, exact outcome, acceptance criteria, validation, owner, and rollback or stop condition where relevant.

**Add loop gates.** Define when implementation, review, experiment, or roadmap loops stop, continue, or escalate.

**Prepare handoff.** Package plan for `ship`, ML run, roadmap owner, or investigation agent.

**Emit telemetry.** Record task count, dependency count, unresolved blockers, estimated effort, and plan confidence via `run-telemetry`.

## Output Contract

```markdown
# Task Plan

## Scope
- source artifacts:
- goal:
- non-goals:
- success criteria:

## Task Graph
- id:
  title:
  why:
  depends on:
  owner:
  acceptance criteria:
  validation:
  risks:
  stop condition:
  handoff target:

## Execution Order
- wave:
  tasks:
  gate before next wave:

## Open Blockers
- blocker:
  owner:
  required decision:

## Loop Policy
- loop:
  success gate:
  budget cap:
  escalation:
  delta-only rule:
```

## Workflow Uses

- `dev-workflow`: plan writing before `ship`.
- `ml-experiments`: experiment schedule, baselines, training runs, validation checks.
- `roadmapping`: dependency and capacity-aware sequencing.
- `debug-investigation`: evidence collection and hypothesis test plan when issue is complex.
- `backprop`: improvement hypothesis rollout plan.

## Success Criteria

- every task has acceptance criteria and validation.
- dependencies are explicit.
- plan exposes blockers rather than burying them.
- task order reduces risk early.
- handoff target is clear.
- `run-telemetry` event emitted.

## Common Failure Modes

**Implementation hidden in planning.** Fix by writing desired change and validation, not code details unless required by DD.

**Task list without gates.** Fix by adding stop/continue/escalate conditions.

**Scope creep during decomposition.** Fix by returning new requirements to PRD/DD approval.

**Huge task.** Fix by splitting into reviewable slices with independent evidence.

## Self-Improvement

Track task types that repeatedly miss acceptance criteria, create rework, or block on hidden dependencies. Feed patterns into `backprop` to improve decomposition heuristics and default task granularity.
