---
name: plan-to-launch
description: "End-to-end software development workflow for AI agents. Use for plan-to-launch, dev workflow, PRD, DD, design doc, council on docs, implementation plan, ship, code-reviewer, council on review and code, launch PR, merge readiness. Enforces thought-out plan before implementation, bounded PRD/DD council loop, ship/review loop, design kickback, human approval, agent-fleet awareness, telemetry, long-term memory, and code RAG."
---

# Plan to Launch

Ensure a thought-out plan exists before implementation. Move from product intent to technical design, council stress-test, executable plan, `ship`, code review, final council, and human launch approval.

## Core Principles

**Intent before code.** PRD and DD must be good enough before implementation starts.

**Cheap failures first.** Catch wrong assumptions in docs and council, not after code exists.

**Smallest viable slice first.** MVP cuts what to build; Occam's razor cuts how it is built. Keep only work needed for the primary outcome, explicit constraints, and safety; defer the rest instead of making the design bigger to satisfy speculative risks.

**Ship follows accepted plan.** Implementation should satisfy planned tasks and flag plan/design mismatches instead of silently inventing fixes.

**Material expansion renews approval.** Discovery does not amend accepted scope. Pause implementation and obtain human approval for recorded material scope delta before continuing.

**Review checks fidelity.** Code-reviewer judges correctness and whether code still matches PRD/DD intent.

**Loops are bounded and delta-only.** Re-review only raised issues and changed material.

## Inputs

- product or user goal.
- target repo and branch.
- existing docs, tickets, issues, prior decisions, code context.
- success metrics or constraints.
- run id and budget caps.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP, code RAG, git, tickets, PRs, and agent-fleet journals. Use agent-fleet `/council` for required minimal/full councils after `AGENT_FLEET_HOME` preflight. Use agent-fleet `/ship` or local `ship` skill for implementation when plan is accepted. Use `run-telemetry` at each gate.

## Council Policy

Use agent-fleet council levels: `none`, `single-lens`, `minimal-council`, or `full-council`. Low-risk, reversible work may record `council_level: none` or use `single-lens`. Suspected PRD scope bloat or DD over-engineering is a docs-council trigger: use `mvp` for unnecessary deliverables and `occams-razor` for unnecessary solution complexity. Optional features, hypothetical future requirements, or a new service/abstraction without a first-release need are signals. For any multi-persona PRD/DD council, include both personas plus an independent product, domain, or safety lens; escalate `lite` to `default` rather than exceeding its council cap. Other docs and final code councils are required only when risk, ambiguity, conflicting review, unresolved blocker, design mismatch, security/privacy/reliability concern, or leadership-visible tradeoff appears. Do not convene a council for a clear small change solely to satisfy this check. Required `minimal-council`/`full-council` must block if agent-fleet preflight fails.

## Workflow Modes

- `lite`: accepted small change; produce scope lock, focused plan, patch/review handoff. Budget: focused refs, one artifact, `council_level` max `single-lens`, loop cap 1, focused validation.
- `default`: normal feature/change; PRD/DD may be lightweight, task plan required, council only if risk triggers. Budget: selected docs, up to two artifacts, `council_level` max `minimal-council`, loop cap 2.
- `deep`: high-risk architecture, launch, security/reliability, cross-team, or leadership-visible work. Budget: full docs, required gates, council allowed with reason.
- Escalate: ambiguity, design mismatch, unresolved blocker, risky rollout, or conflicting review.
- Load: start with this skill and user artifact; load doc templates, agent-fleet council protocol, handoff, or telemetry references only when that gate will run.

## Execution

Run only the steps required by selected mode. `lite` may use scope lock instead of formal PRD/DD; `default` may use lightweight PRD/DD; `deep` uses full docs and gates.

**Ground context.** Invoke `grounding-brief` over user goal, memory, code RAG, existing docs, related PRs, issues, and prior runs. Do not propose infrastructure until its capability reuse inventory is complete.

**Lock scope.** Before implementation, record a scope fingerprint: intended files, effort, systems, trust/deployment/rollback boundaries, and issue-wide implementation PR count.

**Author PRD.** Use `structured-doc-authoring` to define what, why, users, scope, non-goals, success criteria, and launch readiness. Use `success-criteria-metrics` to lock the primary outcome and guardrails. Name the smallest end-to-end release that can test the primary outcome; list deferred features and why each included feature is needed now.

**Author DD.** Use `structured-doc-authoring` to translate PRD into architecture, boundaries, data/control flow, tradeoffs, tests, observability, rollout, risks, and alternatives. Prefer existing capabilities and the simplest design that ships the MVP safely; justify any new infrastructure, abstraction, or flexibility against a concrete first-release need.

**Council on docs.** Compare PRD/DD against the MVP slice before task planning. Select `none` for low-risk clear docs, `single-lens` (`mvp` or `occams-razor`) for one bloat axis, and agent-fleet `minimal-council` with both and an independent third lens when both axes are suspect or another risk calls for a multi-persona docs council; reserve `full-council` for high-risk decisions. Ask each lens what to cut, what must remain for the outcome or safety, and why; record cuts and deferred work in PRD/DD, not just a verdict. Resolve concrete bloat blockers before planning; do not add work merely to satisfy speculative council suggestions. Required council verdict must pass or pass-with-nits before planning only when council level is minimal/full.

**Scope expansion gate.** Pause implementation and invoke `human-approval-gate` when review or discovery adds infrastructure or a trust boundary; doubles expected files, effort, or systems touched; raises issue-wide implementation PR count above two; turns configuration/integration into platform capability; or changes deployment/rollback semantics. Package original scope fingerprint, discovery, smallest options, added cost/risk, and recommendation. Emit gate/escalation telemetry with reuse candidate outcomes/count, expansion reason, and renewed approval state. `approve` resumes only when tied to fingerprint; `reject` ends paused run; `revise` returns to design and remains paused; `extend budget` approves recorded cap only. No response remains pending, and later delta repeats gate.

**Write plan.** Use `task-decomposition-planning` to create ordered implementation tasks with dependencies, acceptance criteria, validation, rollout, and stop conditions.

**Ship tasks.** Use agent-fleet `ship` for each accepted task or slice, with at most two issue-wide implementation PRs unless human approval extends cap. If implementation exposes design error, stop and return to DD instead of patching around it.

**Run code-reviewer.** Review for correctness, safety, maintainability, security, performance, tests, observability, and fidelity to PRD/DD. Re-review only deltas after fixes.

**Council on review and code.** Use agent-fleet `/council` only when review findings conflict, blockers remain unresolved, implementation reveals design mismatch, or risk level justifies a final merge/no-merge council against original intent.

**Launch PR.** Use `handoff-packaging` to create PR package with linked docs, rationale, tests, council verdicts, and known limitations. Use `human-approval-gate` for final signoff.

## Loop Controls

**Doc loop.** PRD/DD and agent-fleet council gate iterate only when council level is minimal/full; otherwise record skipped or single-lens reason and proceed when doc acceptance criteria are met. Re-check MVP scope and design simplicity on material revisions; review only the new or unresolved bloat, not settled choices.

**Implementation loop.** `ship` and code-reviewer iterate until review has no blockers, cap hit, or plan mismatch discovered.

**Outer design kickback.** If final council or review evidence finds design intent wrong, return to DD and preserve implementation learnings as evidence. A material delta pauses the run until human approval for its scope fingerprint; telemetry is evidence, not gate authority.

**Delta-only rule.** Re-council and re-review focus on required changes, not settled material.

**State carry-forward.** Maintain decisions, rejected alternatives, review issues, and plan mismatches in the run directory.

## Output Contract

```markdown
# Dev Workflow Run

## Artifacts
- PRD:
- DD:
- council docs level/verdict:
- MVP slice / design cuts / deferred work:
- implementation plan:
- shipped tasks:
- code review:
- final council level/verdict:
- PR package:

## Gate State
- docs: pass | pass-with-nits | block
- implementation: clean | needs-fix | design-kickback | paused
- scope fingerprint:
- scope renewal: not-required | pending | approved | rejected | revision-requested
- paused action / resume condition:
- delivery PR budget: count, approved cap, deferred work
- final: launch | revise | escalate-human

## Evidence
- tests:
- validation:
- linked PR/docs:
- telemetry path:
```

## Success Criteria

- PRD/DD or scope lock exists before implementation, according to selected mode.
- council docs gate either records skipped/one-lens reason or passes when minimal/full council is triggered; every multi-persona PRD/DD council includes both `mvp` and `occams-razor` before planning.
- PRD/DD or scope lock identifies the smallest outcome-bearing slice, justified must-haves, and deferred work.
- task plan or lite task list has acceptance criteria and dependencies.
- material scope expansion emits a human approval gate and pauses implementation.
- delivery uses no more than two issue-wide implementation PRs without explicit approval.
- telemetry records reuse candidates, scope expansion, and renewed approval state.
- shipped code maps to planned tasks.
- code-reviewer blockers resolved or escalated.
- final council confirms merge/no-merge call only when escalation matrix triggers it; otherwise skipped reason is recorded.
- launch package and human approval ask exist.
- `run-telemetry` events emitted for all major gates.

## Common Failure Modes

**Skipping docs for speed.** Fix by writing lightweight PRD/DD, not by jumping to code.

**Council churn.** Fix by agent-fleet caps, delta-only review, and human escalation.

**Design grows to satisfy every objection.** Ask `mvp` what to defer and `occams-razor` what to remove; retain additions only for the outcome, explicit constraints, or safety.

**Implementation invents new design.** Fix by DD kickback.

**Review drifts from intent.** Fix by linking every blocker to PRD/DD, code evidence, or safety risk.

## Self-Improvement

Record which gates found real defects, which council blockers were false positives, where plan missed implementation reality, and where human reviewers edited PR package. Feed these into `backprop` for workflow optimization.
