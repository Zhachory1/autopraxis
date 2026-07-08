---
name: success-criteria-metrics
description: "Define success criteria and metrics before work starts. Use for PRD outcomes, ML offline/online metrics, experiment yardsticks, roadmap ROI, ideation framing, debug done criteria, backprop workflow optimization, launch gates, acceptance criteria. Produces measurable targets, guardrails, measurement plan, anti-metric-shopping lock, baselines, decision thresholds, and telemetry."
---

# Success Criteria And Metrics

Define what success means before execution begins. Use this wherever a workflow needs an unmovable yardstick: PRD outcomes, ML metrics, roadmap ROI, ideation framing, debug completion, PR launch gates, and backprop optimization.

## Core Principles

**Lock metrics early.** Do not pick winning metrics after seeing results.

**Separate target from guardrail.** Primary success metric drives the decision; guardrails prevent harmful wins.

**Measure what matters.** Prefer user/business outcomes over activity metrics unless the workflow stage is explicitly diagnostic.

**Make thresholds decision-grade.** A metric without pass/fail criteria cannot gate work.

**Track evaluation cost.** Measurement work has latency, compute, and human-review cost; emit `run-telemetry`.

## Inputs

- objective, problem statement, or project candidate.
- stakeholders and decision owner.
- baseline or current state.
- available data sources and instrumentation.
- business constraints, quality bars, risk tolerances.
- desired launch or experiment decision.

## Execution

**Define objective.** State outcome in user/business terms and why it matters.

**Pick primary metric.** Choose one metric that decides success. If multiple matter, define a hierarchy rather than a dashboard soup.

**Set guardrails.** Add safety, quality, cost, reliability, fairness, privacy, latency, and support-load constraints where relevant.

**Establish baseline.** Record current value, source, freshness, and uncertainty.

**Set threshold.** Define target, minimum detectable effect, confidence or tolerance, and decision rule.

**Design measurement.** Specify how, when, and where the metric will be computed. Include offline/online linkage for ML.

**Lock anti-shopping rules.** List metrics that may be explored but cannot override the primary decision without human approval.

**Emit telemetry.** Record metric count, baseline availability, instrumentation gaps, and decision readiness via `run-telemetry`.

## Output Contract

```markdown
# Success Criteria And Metrics

## Objective
- outcome:
- why now:
- decision owner:

## Primary Metric
- name:
- definition:
- unit:
- source:
- baseline:
- target:
- decision rule:
- freshness:
- caveats:

## Guardrails
- name:
  threshold:
  source:
  failure action:

## Measurement Plan
- data source:
- instrumentation needed:
- evaluation window:
- segment checks:
- confidence/tolerance:

## Anti-Metric-Shopping Lock
- locked before results: yes | no
- exploratory metrics:
- metric changes require:

## Gate
- status: ready | needs-instrumentation | needs-human-decision | blocked
- reason:
```

## Workflow Uses

- `dev-workflow`: PRD outcome metrics and launch acceptance.
- `ml-experiments`: offline/online primary metric, guardrails, no metric shopping.
- `project-ideation`: project hypothesis and target outcome.
- `roadmapping`: ROI, confidence, cost, risk, and sequencing score.
- `debug-investigation`: expected-vs-actual and fix verification criteria.
- `backprop`: workflow latency, cost, failure rate, human-edit rate, and rework metrics.

## Success Criteria

- one primary metric or explicit metric hierarchy.
- baseline and target documented.
- guardrails have failure actions.
- measurement method is feasible.
- post-result metric changes require human approval.
- `run-telemetry` event emitted.

## Common Failure Modes

**Metric soup.** Fix by choosing one deciding metric and demoting others to guardrails or diagnostics.

**Proxy drift.** Fix by linking proxy to outcome and stating when proxy is invalid.

**Invisible baseline.** Fix by requiring current value or marking gate not ready.

**Over-precision.** Fix by matching threshold to data quality and decision stakes.

## Self-Improvement

Capture metrics that later failed to predict real outcomes, guardrails that caught issues, and missing instrumentation that blocked decisions. Feed patterns into `backprop` to improve future metric templates.
