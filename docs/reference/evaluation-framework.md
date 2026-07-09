# Evaluation Framework

Autopraxis evaluates workflow changes by asking: did the change improve accepted outcomes without increasing cost, rework, missed risk, or privacy exposure?

## Primary Metric

`accepted_success_rate = accepted_runs / evaluated_runs`

A run is accepted when a qualified human or durable downstream signal confirms the artifact was usable:

- PR merged or review feedback accepted.
- RCA/handoff accepted by owner.
- roadmap/decision brief approved or explicitly revised.
- model/experiment handoff accepted for next stage.
- workflow improvement promoted after review.

Abandoned runs are counted unless they have an explicit out-of-scope reason.

## Guardrail Metrics

| Guardrail | Fail Condition |
|---|---|
| deterministic fixtures | fixture validation or coverage drops |
| validation | required checks fail more often than baseline |
| cost/tokens | `cost_per_successful_run` or `tokens_per_successful_run` regresses without quality gain |
| rework | loop count or human edit rate increases materially |
| missed risk | blocker, rollback, or human rejection appears after pass |
| privacy | raw private content, secrets, or customer data stored without explicit approval |
| council efficiency | unnecessary `minimal-council`/`full-council` usage rises |

Cost/token reports must include `cost_source` and `token_source`. Contract-only evals must not claim measured percentage uplift.

## Workflow Evaluation Matrix

| Workflow | Eval Method | Input Artifact | Expected Output | Primary Signal | Guardrails |
|---|---|---|---|---|---|
| `dev-workflow` | deterministic fixture + PR outcome audit | accepted spec/issue | plan, patch handoff, PR package | PR accepted or merged | validation, review blockers, rework, cost |
| `ml-experiments` | deterministic fixture + experiment handoff audit | ML problem/metric prompt | metric lock, baseline/hypothesis handoff | handoff accepted for run/deploy decision | leakage, metric shopping, cost, reproducibility |
| `pr-review` | deterministic fixture + human review audit | PR/diff | prioritized findings | reviewer accepts/acts on findings | false blockers, missed defects, token cost |
| `debug-investigation` | deterministic fixture + RCA audit | symptom/evidence | root-cause ledger and RCA handoff | owner accepts RCA/fix direction | evidence quality, rework, missed cause |
| `project-ideation` | deterministic fixture + roadmap intake audit | OKR/opportunity | framed candidates | candidate accepted for roadmap scoring | evidence quality, feasibility, scope creep |
| `roadmapping` | deterministic fixture + approval audit | candidate set | prioritized roadmap/decision brief | leadership approves or revises with clear delta | capacity realism, missed dependencies, cost |
| `backprop` | deterministic fixture + promotion audit | run history/telemetry | improvement hypothesis + rollout decision | promote/rollback decision accepted | regression, prompt bloat, privacy, cost |

## Eval Methods

| Method | Use Now? | Notes |
|---|---|---|
| deterministic fixtures | yes | current `evals/workflows` + `autopraxis eval validate/summarize` |
| telemetry replay | yes, when available | use summaries/pointers, not raw private content |
| human spot check | yes, sampled | required for ambiguous quality claims |
| model judge | future only | must be sampled, budgeted, and labeled directional |
| shadow/A-B rollout | future only | requires comparable task assignment and guardrails |

## Comparison Rules

- compare candidate against latest release or named baseline.
- use comparable tasks and same input artifacts.
- report workflow mode and council level.
- separate contract-only, directional, measured, and statistically powered claims.
- do not mix provider-reported and estimated costs without labeling aggregate as directional.

## Eval Report Contract For Backprop

`backprop` consumes an eval report with:

```json
{
  "schema_version": 1,
  "baseline_version": "v0.1.0",
  "candidate_version": "branch-or-tag",
  "fixture_summary": {},
  "primary_metric": { "accepted_success_rate": null, "metric_status": "contract_only|directional|measured|statistically_powered" },
  "guardrails": {},
  "failure_clusters": [],
  "decision_rule": "promote|rollback|needs-more-data",
  "telemetry_path": ".workflow-runs/<run-id>/telemetry.jsonl",
  "privacy": { "raw_private_content_stored": false }
}
```

## Promotion / Rollback Rules

Required counters:

| Counter | Source |
|---|---|
| `evaluated_runs` | eval report run count or fixture count |
| `accepted_runs` | merged PR, accepted RCA, approved decision, accepted handoff, or maintainer approval |
| `fixture_coverage` | `autopraxis eval summarize` |
| `validation_failures` | validation telemetry or CI |
| `privacy_failures` | telemetry/eval validation |
| `cost_per_successful_run` | observed cost / accepted runs, when cost coverage exists |
| `tokens_per_successful_run` | observed tokens / accepted runs, when token coverage exists |

Default gates:

| Condition | Decision |
|---|---|
| privacy failure | rollback or block |
| deterministic fixture coverage drops | rollback or block |
| required validation fails | rollback or block |
| accepted success rate drops with measured status | rollback unless explicitly accepted by human owner |
| cost/tokens per successful run rise >10% without accepted success improvement | revise before promotion |
| metric status is `contract_only` | do not claim quality/cost uplift; use as structural gate only |
| metric status is `directional` | require human spot check before promotion |
| metric status is `measured` or `statistically_powered` | may promote when primary metric passes and guardrails do not fail |

Promote when deterministic fixtures pass, primary metric meets the current decision rule, guardrails do not fail, and council/review passes when escalation policy triggers it.

Rollback or revise when any hard-fail gate triggers, human reviewers reject the artifact or decision, or causality is unclear for the claim being made.

## Privacy And Retention

| Data | Durable Storage |
|---|---|
| synthetic fixtures | allowed in repo |
| aggregate metrics | allowed |
| telemetry pointers/summaries | allowed |
| raw private prompts/logs/customer data | forbidden unless explicitly approved |
| secrets/credentials | forbidden |
| council transcripts | pointers only by default |
| hidden/system prompts | forbidden |

Default retention: keep fixtures and aggregate summaries; keep raw run artifacts out of repo and public releases.
