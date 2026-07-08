---
name: dev-workflow
description: "End-to-end software development workflow for AI agents. Use for dev workflow, PRD, DD, design doc, council on docs, implementation plan, ship, code-reviewer, council on review and code, launch PR, merge readiness. Enforces thought-out plan before implementation, bounded PRD/DD council loop, ship/review loop, design kickback, human approval, agent-fleet awareness, telemetry, long-term memory, and code RAG."
---

# Dev Workflow

Ensure a thought-out plan exists before implementation. Move from product intent to technical design, council stress-test, executable plan, `ship`, code review, final council, and human launch approval.

## Core Principles

**Intent before code.** PRD and DD must be good enough before implementation starts.

**Cheap failures first.** Catch wrong assumptions in docs and council, not after code exists.

**Ship follows accepted plan.** Implementation should satisfy planned tasks and flag plan/design mismatches instead of silently inventing fixes.

**Review checks fidelity.** Code-reviewer judges correctness and whether code still matches PRD/DD intent.

**Loops are bounded and delta-only.** Re-review only raised issues and changed material.

## Inputs

- product or user goal.
- target repo and branch.
- existing docs, tickets, issues, prior decisions, code context.
- success metrics or constraints.
- run id and budget caps.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP, code RAG, git, tickets, PRs, and agent-fleet journals. Use `council-review` backed by agent-fleet `/council` when available at `AGENT_FLEET_HOME=/Users/zhach/code/agent-fleet`. Use agent-fleet `/ship` or local `ship` skill for implementation when plan is accepted. Use `run-telemetry` at each gate.

## Execution

**Ground context.** Invoke `grounding-brief` over user goal, memory, code RAG, existing docs, related PRs, issues, and prior runs.

**Author PRD.** Use `structured-doc-authoring` to define what, why, users, scope, non-goals, success criteria, and launch readiness. Use `success-criteria-metrics` to lock the primary outcome and guardrails.

**Author DD.** Use `structured-doc-authoring` to translate PRD into architecture, boundaries, data/control flow, tradeoffs, tests, observability, rollout, risks, and alternatives.

**Council on docs.** Use `council-review` with product, architecture, reliability, security/adversarial, cost, and execution lenses as relevant. Verdict must pass or pass-with-nits before planning.

**Write plan.** Use `task-decomposition-planning` to create ordered implementation tasks with dependencies, acceptance criteria, validation, rollout, and stop conditions.

**Ship tasks.** Use agent-fleet `ship` for each accepted task or slice. If implementation exposes design error, stop and return to DD instead of patching around it.

**Run code-reviewer.** Review for correctness, safety, maintainability, security, performance, tests, observability, and fidelity to PRD/DD. Re-review only deltas after fixes.

**Council on review and code.** Use `council-review` to adjudicate review findings, conflicting opinions, blocker resolution, and final merge/no-merge recommendation against original intent.

**Launch PR.** Use `handoff-packaging` to create PR package with linked docs, rationale, tests, council verdicts, and known limitations. Use `human-approval-gate` for final signoff.

## Loop Controls

**Doc loop.** PRD/DD and council iterate until council verdict is pass/pass-with-nits, max doc iterations hit, or human escalates.

**Implementation loop.** `ship` and code-reviewer iterate until review has no blockers, cap hit, or plan mismatch discovered.

**Outer design kickback.** If final council finds design intent wrong, return to DD and preserve implementation learnings as evidence.

**Delta-only rule.** Re-council and re-review focus on required changes, not settled material.

**State carry-forward.** Maintain decisions, rejected alternatives, review issues, and plan mismatches in the run directory.

## Output Contract

```markdown
# Dev Workflow Run

## Artifacts
- PRD:
- DD:
- council docs verdict:
- implementation plan:
- shipped tasks:
- code review:
- final council verdict:
- PR package:

## Gate State
- docs: pass | pass-with-nits | block
- implementation: clean | needs-fix | design-kickback
- final: launch | revise | escalate-human

## Evidence
- tests:
- validation:
- linked PR/docs:
- telemetry path:
```

## Success Criteria

- PRD and DD exist before implementation.
- council docs gate passes or human explicitly overrides.
- task plan has acceptance criteria and dependencies.
- shipped code maps to planned tasks.
- code-reviewer blockers resolved or escalated.
- final council confirms merge/no-merge call.
- launch package and human approval ask exist.
- `run-telemetry` events emitted for all major gates.

## Common Failure Modes

**Skipping docs for speed.** Fix by writing lightweight PRD/DD, not by jumping to code.

**Council churn.** Fix by cap, delta-only review, and human escalation.

**Implementation invents new design.** Fix by DD kickback.

**Review drifts from intent.** Fix by linking every blocker to PRD/DD, code evidence, or safety risk.

## Self-Improvement

Record which gates found real defects, which council blockers were false positives, where plan missed implementation reality, and where human reviewers edited PR package. Feed these into `backprop` for workflow optimization.
