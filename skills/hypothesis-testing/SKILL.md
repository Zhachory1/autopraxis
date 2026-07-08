---
name: hypothesis-testing
description: "Reusable hypothesis loop for ML experiments and debugging. Use for hypothesis generation, confirmation/refutation, root cause analysis, train/validate cycles, evidence tests, leakage checks, tried/rejected ledger, experiment iteration, debugging traces. Produces hypotheses with evidence, tests, verdicts, ruled-out alternatives, loop stop conditions, and telemetry."
---

# Hypothesis Testing

State candidate explanations or experiment ideas, define what would confirm or refute them, test against evidence, and keep a ledger of what was tried and rejected.

This skill supports both ML experimentation and debugging because both are controlled hypothesis loops over evidence.

## Core Principles

**Hypotheses must be falsifiable.** If no observation can refute it, rewrite it.

**One test changes belief.** Define expected evidence before collecting it.

**Record ruled-out paths.** A tried/rejected ledger prevents circular reasoning and duplicate experiments.

**Separate cause from correlation.** Evidence must explain the symptom or metric movement, not merely coincide.

**Bound loops.** Stop on confirmed root cause, metric hit, exhausted evidence, compute cap, or diminishing returns.

## Inputs

- problem statement, symptom, or ML objective.
- success criteria and metrics.
- current evidence from `grounding-brief`.
- constraints: compute, time, data availability, safety.
- prior tried/rejected ledger if present.
- run id for `run-telemetry`.

## Execution

**List candidates.** Generate plausible hypotheses from evidence, not vibes. Include null/baseline explanation.

**Define tests.** For each hypothesis, state confirming evidence, refuting evidence, method, cost, and risk.

**Prioritize.** Run low-cost, high-information tests first. Prefer tests that discriminate multiple hypotheses.

**Execute or specify.** Run feasible local checks, traces, queries, or experiments. If external execution is needed, create exact handoff.

**Update ledger.** Mark verdicts as confirmed, refuted, inconclusive, or deferred. Record evidence and next action.

**Loop or stop.** Continue only if success gate not met, budget remains, and new hypotheses are not recycled.

**Emit telemetry.** Record hypothesis count, tests run, inconclusive rate, loop count, metric lift, root-cause confidence, and cost via `run-telemetry`.

## Output Contract

```markdown
# Hypothesis Ledger

## Context
- objective/symptom:
- metric or expected behavior:
- budget cap:
- stop condition:

## Hypotheses
- id:
  claim:
  why plausible:
  confirms if:
  refutes if:
  test:
  cost/risk:
  verdict: pending | confirmed | refuted | inconclusive | deferred
  evidence:
  next action:

## Ruled Out
- hypothesis id:
  evidence:
  why ruled out:

## Loop Decision
- status: continue | stop-success | stop-budget | stop-diminishing-returns | escalate-human
- reason:
- next delta:
```

## Workflow Uses

- `ml-experiments`: hypothesis generation, baseline comparison, training iteration, validation, diminishing returns decision.
- `debug-investigation`: root-cause candidates, trace/evidence loop, RCA confidence.
- `backprop`: workflow improvement hypotheses tied to measured failure modes.
- `project-ideation`: project hypothesis and feasibility loop when needed.

## Success Criteria

- every active hypothesis has confirming and refuting evidence criteria.
- ledger prevents re-proposing rejected ideas.
- loop has success gate, budget cap, and escalation path.
- verdicts cite evidence.
- `run-telemetry` event emitted.

## Common Failure Modes

**Favorite-hypothesis bias.** Fix by writing refutation criteria before testing.

**Experiment churn.** Fix by stop rules and diminishing return threshold.

**Inconclusive pileup.** Fix by designing discriminating tests or escalating with ruled-out ledger.

**Post-hoc explanation.** Fix by requiring pre-declared expected observation.

## Self-Improvement

Capture recurring weak hypotheses, high-yield tests, common leakage/root-cause patterns, and expensive dead ends. Feed aggregated learnings into `backprop` to refine hypothesis templates and test priority rules.
