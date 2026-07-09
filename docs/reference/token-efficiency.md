# Token Efficiency

Token efficiency is a first-class Autopraxis quality target because excess context increases cost, latency, and confusion. The goal is not fewer tokens at all costs; the goal is fewer tokens per accepted outcome without increasing rework or missed risk.

## Current Mechanisms

- Start with README router so users pick one workflow, not the whole graph.
- Use `lite`, `default`, or `deep` mode before loading references.
- Use council escalation matrix so full council is not the default.
- Store telemetry summaries and pointers, not raw docs/logs/prompts.
- Validate deterministic eval fixtures before changing workflow contracts.

## Mode Envelopes

| Mode | References | Artifacts | Council | Loops | Validation |
|---|---|---|---|---|---|
| `lite` | selected skill + user artifact | one concise artifact | `none` or `single-lens` | 1 | focused |
| `default` | selected refs only | selected artifacts | up to `minimal-council` | 2 | standard |
| `deep` | full relevant refs | full workflow artifacts | `minimal-council` or `full-council` with reason | explicit budget | broad |

Escalate only with a non-sensitive reason: ambiguity, high blast radius, irreversible decision, unresolved blocker, conflicting evidence, security/privacy/reliability risk, ML/statistical risk, or leadership commitment.

## Progressive Disclosure Rules

- Load router/trigger text first.
- Load one selected workflow next.
- Load shared skills only when workflow step requires them.
- Load templates only after artifact type is chosen.
- Load council matrix only when a review gate may run.
- Load raw source/log/transcript content only when needed and privacy-safe; prefer pointers and summaries.
- Re-review deltas, not settled context.

## Metric Dictionary

Use existing telemetry fields; do not add new schema in this note.

| Metric | Definition |
|---|---|
| `tokens_total` | `tokens_in + tokens_out` when both are present |
| `cost_usd` | provider-reported, estimated, or user-supplied cost in USD |
| `missing_token_coverage` | events missing token fields / total events |
| `missing_cost_coverage` | events missing cost fields / total events |
| `tokens_per_successful_run` | total observed tokens / successful runs |
| `cost_per_successful_run` | total observed cost / successful runs |
| `workflow_mode` | `lite`, `default`, or `deep` |
| `council_level` | `none`, `single-lens`, `minimal-council`, or `full-council` |
| `loop_count` | max loop iteration or counted loop events |
| `human_edit_rate` | human edit/rewrite rate when available |

Cost/token values must include `token_source` or `cost_source`: `provider_reported`, `estimated`, or `user_supplied`. Prefer reporting by workflow, mode, council level, provider, and model. Mixed-source aggregates are directional, not billing truth.

## Quality Guardrails

Token reduction is only good if these do not regress:

- task success rate.
- validation pass rate.
- blocker/missed-defect rate.
- loop count / rework rate.
- human edit rate.
- escalation correctness.
- handoff usefulness.

## Low-Risk Follow-Ups

Deferred candidates, not implemented here:

- compress repeated self-improvement/telemetry boilerplate into shared defaults.
- add prompt-byte budget checks for README and skill descriptions.
- add package-size budget and compress large assets separately from workflow tokens.
