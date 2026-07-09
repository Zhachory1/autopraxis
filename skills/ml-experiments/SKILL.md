---
name: ml-experiments
description: "ML experiment workflow from problem formulation through reproducible handoff. Use for model experiments, metric definition, council signoff, data pipeline, EDA, tracking/logging, hypothesis generation, baseline, training, validation, artifacts. Enforces locked metrics, leakage checks, experiment tracking, hypothesis/train/validate loop, compute caps, tried-rejected ledger, handoff, telemetry, long-term memory, and code RAG."
---

# ML Experiments

Run ML work as a scientific workflow from problem and metric framing through reproducible artifacts and handoff. Optimize for valid learning, not offline metric theater.

## Core Principles

**Metric before modeling.** Lock offline and online success criteria before seeing experiment results.

**Data quality gates everything.** Pipeline reproducibility, leakage risk, label quality, and distribution understanding come before model complexity.

**Tracking is integrity.** Params, metrics, artifacts, seeds, code versions, and data lineage must be logged.

**Baselines anchor lift.** Every gain is measured against a simple, reasonable reference.

**Iteration is bounded.** Hypothesis, training, and validation loop stops on metric hit, compute cap, or diminishing returns.

## Inputs

- business/user problem and target decision.
- candidate metric and guardrails.
- datasets, pipelines, feature sources, model code, notebooks.
- compute budget, time budget, and deployment constraints.
- prior experiment runs from memory, tracking systems, git, code RAG, or run directories.
- run id for `run-telemetry`.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP for prior experiment decisions and code RAG for model/data pipeline code. Query experiment tracking when available. Use `council-review` with ml-scientist, ab-critic, data-engineer, reliability-sentinel, and product/business lenses. Use `hypothesis-testing`, `success-criteria-metrics`, `handoff-packaging`, and `run-telemetry` throughout.

## Council Policy

Use `../council-review/references/escalation-matrix.md`. ML work often needs at least `single-lens` statistical/ML review, but full council is reserved for production-impacting model changes, metric conflicts, leakage/statistical blockers, expensive compute commitments, or irreversible business decisions.

## Execution

**Frame problem and metrics.** Use `success-criteria-metrics` to define primary offline metric, online decision metric, guardrails, baseline, segments, and anti-metric-shopping lock.

**Council on docs and plan.** Select council level from `../council-review/references/escalation-matrix.md`. Use one ML/statistical lens for simple framing, minimal/full council for business-impacting or statistically risky plans before data/engineering spend.

**Build data pipeline and EDA.** Establish reproducible data path, lineage, schema, label quality, leakage risks, missingness, distributions, temporal splits, segment coverage, and learnability.

**Set tracking and logging.** Configure experiment tracking for params, metrics, artifacts, seeds, code/data versions, feature sets, and environment.

**Generate hypotheses.** Use `hypothesis-testing` to state model/feature/loss assumptions, math, expected metric movement, and refutation criteria.

**Council signoff.** Re-run `council-review` at the cheapest level that covers risk before expensive training; escalate to minimal/full only for costly, production-impacting, or disputed hypotheses.

**Create baseline.** Train or compute the simplest reasonable reference. Validate tracking and evaluation with this baseline.

**Train and experiment.** Run planned experiments systematically. Update tried/rejected ledger after each run.

**Validate candidate.** Confirm generalization via held-out/temporal tests, robustness, leakage checks, fairness/segment checks, calibration, reliability, and guardrails.

**Package artifacts.** Use `handoff-packaging` for model, code, data lineage, metrics, known limitations, deployment risks, and next decision. Use `human-approval-gate` for deploy or compute extension.

## Loop Controls

**Hypothesis train validate loop.** Continue only when metric target not met, budget remains, and new hypothesis is not a recycled rejected idea.

**Stop on success.** Stop when primary metric and guardrails meet decision rule.

**Stop on compute cap.** Escalate with best result, ledger, and recommended next spend.

**Stop on diminishing returns.** Stop when last configured window of iterations gains less than threshold.

**Carry state.** Maintain tried/rejected approaches, seeds, artifacts, metrics, data versions, and known leakage risks.

## Output Contract

```markdown
# ML Experiment Run

## Framing
- problem:
- primary metric:
- online decision metric:
- guardrails:

## Data
- pipeline:
- lineage:
- leakage checks:
- EDA findings:

## Experiments
- baseline:
- tried/rejected ledger:
- best candidate:
- validation:

## Handoff
- artifacts:
- limitations:
- deployment readiness:
- human decision ask:
- telemetry path:
```

## Success Criteria

- metrics locked before results.
- data pipeline and EDA are reproducible.
- tracking records params, metrics, artifacts, seeds, code, and data lineage.
- hypotheses have confirmation/refutation criteria.
- baseline exists.
- best candidate passes validation and guardrails or failure is explained.
- handoff package is deployment/research-ready.
- `run-telemetry` events emitted.

## Common Failure Modes

**Metric shopping.** Fix by locked primary metric and human approval for metric changes.

**Leakage disguised as lift.** Fix by temporal splits, source audit, and ab-critic/ml-scientist council.

**Notebook-only science.** Fix by reproducible pipeline and artifact tracking.

**Experiment amnesia.** Fix by tried/rejected ledger and telemetry.

## Self-Improvement

Track which hypothesis classes produced real gains, which validation checks caught false wins, compute spent per useful learning, and missing telemetry. Feed patterns into `backprop` to improve experiment workflow and default councils.
