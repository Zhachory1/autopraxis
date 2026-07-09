---
name: debug-investigation
description: "Debug and investigation workflow for agents. Use for production issue, failing test, API bug, performance regression, data issue, incident, root cause analysis, evidence gathering, logs, traces, metrics, reproduction, codebase tracing, hypothesis confirmation, RCA handoff. Enforces symptom definition, bounded hypothesis loop, evidence ledger, human escalation, telemetry, long-term memory, code RAG, and prevention actions."
---

# Debug Investigation

Investigate symptoms with evidence, reproduction, code/data tracing, hypothesis testing, and RCA. Stop on confirmed root cause or evidence exhaustion; never loop forever on a non-reproducible issue.

## Core Principles

**Define the symptom precisely.** What, where, when, frequency, blast radius, and expected-vs-actual guide the search.

**Evidence before theories.** Logs, traces, metrics, recent changes, and repro beat speculation.

**Reproduction accelerates learning.** Establish a reliable trigger when feasible, but do not block forever if production-only evidence is enough.

**Hypotheses must be tested.** Confirm one root cause and rule out alternatives.

**RCA creates durable learning.** Document cause, contributing factors, fix, and prevention.

## Inputs

- symptom report, failing test, alert, dashboard, log snippet, or user complaint.
- affected repo/service/data path.
- expected behavior and success criteria.
- access to logs, traces, metrics, recent deploys, commits, incidents.
- time/impact severity and escalation owner.
- run id for `run-telemetry`.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP for prior incidents and decisions, code RAG for implicated paths, logs/traces/metrics for evidence, git/CI/deploy history for recent changes, and `hypothesis-testing` for root-cause loop. Use `council-review` for high-risk fixes or ambiguous RCA. Use `run-telemetry` throughout.

## Council Policy

Use `../council-review/references/escalation-matrix.md`. Most investigations use no council until root-cause ambiguity, high-risk fix, ambiguous RCA, production blast radius, security/privacy/reliability concern, or conflicting evidence justifies `single-lens`, minimal, or full council.

## Execution

**Define symptom.** Capture what/where/when/how often/blast radius, expected-vs-actual, severity, and done criteria via `success-criteria-metrics` when helpful.

**Gather logs and evidence.** Use `grounding-brief` over logs, traces, metrics, recent changes, dashboards, alerts, tickets, incidents, and user reports.

**Attempt reproduction.** Create minimal repro, failing test, query, request, or scenario when feasible. If not feasible, state why and rely on production evidence.

**Trace codebase and data path.** Use code RAG and direct reads to follow request/data/control flow until behavior diverges from intent.

**Generate and test hypotheses.** Use `hypothesis-testing` to confirm/refute candidate root causes with evidence and keep tried/rejected ledger.

**Fix or hand off.** If fix is in scope and safe, route to `dev-workflow` or `ship`. If not, package exact handoff.

**Write RCA.** Use `structured-doc-authoring` and `handoff-packaging` for root cause, contributing factors, fix, prevention, tests, alerts, and open risks.

**Escalate when needed.** Use `../council-review/references/escalation-matrix.md` for high-risk fixes or ambiguous RCA; use `human-approval-gate` for evidence exhaustion, access gaps, or unresolved production impact.

## Loop Controls

**Hypothesis trace evidence loop.** Iterate until confirmed root cause, evidence exhausted, budget cap hit, or human escalation.

**Non-repro cap.** If reproducibility fails after budget, stop and report evidence gathered plus ruled-out causes.

**Delta-only fix validation.** Validate the specific suspected cause/fix, not the entire system unless required.

**State carry-forward.** Maintain symptom definition, evidence inventory, trace map, hypotheses, ruled-out ledger, and RCA draft.

## Output Contract

```markdown
# Debug Investigation

## Symptom
- expected:
- actual:
- where:
- when/frequency:
- blast radius:
- done criteria:

## Evidence
- source:
  finding:
  confidence:

## Reproduction
- status:
- trigger:
- caveat:

## Trace
- path:
- divergence point:

## Hypothesis Ledger
- confirmed root cause:
- ruled out:
- inconclusive:

## RCA And Handoff
- fix:
- prevention:
- owner:
- telemetry path:
```

## Success Criteria

- symptom is precise and success is recognizable.
- evidence sources are listed and source-linked.
- repro status is explicit.
- confirmed root cause cites evidence or escalation explains why not.
- ruled-out hypotheses are recorded.
- RCA includes fix and prevention.
- `run-telemetry` events emitted.

## Common Failure Modes

**Symptom drift.** Fix by returning to expected-vs-actual and blast radius.

**Log fishing.** Fix by hypotheses and targeted evidence requests.

**Correlation as cause.** Fix by requiring a divergence point and confirming/refuting tests.

**Endless non-repro loop.** Fix by cap and escalation with ruled-out ledger.

## Self-Improvement

Track recurring incident classes, missing logs, weak alerts, flaky repro patterns, and high-yield trace paths. Feed into `backprop` to improve debug playbooks, observability requirements, and code RAG indexing.
