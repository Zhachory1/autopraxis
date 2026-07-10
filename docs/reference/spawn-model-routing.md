# Spawn Model Routing

Autopraxis can reduce cost only if cheaper spawned-agent models preserve accepted outcomes. This document is a research and rollout plan, not an active default-routing policy.

## Status

- current state: guidance only.
- no production/default model routing changes are implemented here.
- any `cheap-default` recommendation requires a runtime adapter that can actually select per-spawn models.
- required council synthesis and high-risk decisions stay on `strong` until evaluation proves otherwise.

## Runtime Control Boundary

Autopraxis is a skills package. It can classify spawn work and emit telemetry, but it cannot force model choice unless the host runtime or wrapper exposes per-spawn model selection.

| Runtime or wrapper | Per-spawn control status | Routing implication |
|---|---|---|
| Me Write Code task/subagent harness | supports task-level model override in agent invocation | can test model tiers for spawned tasks |
| agent-fleet council | package dependency exists; council model policy must be exposed by agent-fleet or caller | Autopraxis can request tier, but agent-fleet owns enforcement |
| Claude Code plugin skills | not proven here for plugin-managed spawned agents | guidance only until verified |
| Codex plugin flow | not proven here | guidance only until verified |
| OpenCode skills | not proven here | guidance only until verified |
| shell/CI wrapper | possible when wrapper launches model-specific commands | safe for offline evaluation and smoke tests |

If a runtime cannot prove model control, use this document only as non-binding review guidance and telemetry schema planning.

## Spawn Inventory

| Spawn site | Current behavior | Task class | Risk | Validation available | Cost loop |
|---|---|---|---|---|---|
| agent-fleet `/council` persona positions | host/default model unless caller sets policy | critique / decision support | medium to high | synthesis review, human decision, transcript/journal | high: personas × rounds |
| council synthesis | host/default model | final decision synthesis | high | human review, acted-on findings, later outcomes | medium |
| codebase exploration subagents | host/default model | inventory / context extraction | low to medium | file existence, citations, follow-up reads | medium in broad repos |
| docs/package validation review | host/default model plus deterministic tests | docs/install QA | low to medium | `npm test`, `npm pack`, runtime CLI smoke | low to medium |
| PR review subagents | host/default model | correctness and risk review | medium to high | human accepted findings, CI, later defects | high on large diffs |
| implementation lead | host/default model | code patching | medium | focused tests, diff review, CI | medium |
| spec/acceptance checker | host/default model | acceptance mapping | medium | spec-to-diff mapping, tests | medium |
| tester/failure summarizer | host/default model | failure triage | low to high | focused reruns, log evidence | medium in flaky loops |
| backprop analysis | host/default model | telemetry synthesis | medium | promotion/rollback outcome | medium |
| eval fixture validation | deterministic CLI | contract validation | low | deterministic fixtures | low |

## Model Tiers

| Tier | Intended use | Constraints |
|---|---|---|
| `cheap` | extraction, inventory, formatting, deterministic-check interpretation | objective verification or low blast radius required |
| `standard` | first-pass review, simple implementation, routine debugging | reversible, testable, bounded scope required |
| `strong` | final synthesis, high-risk review, ML/statistical/security decisions | use when missed-issue cost is high |

Provider-specific model names belong in runtime config, not workflow prose.

Example local mapping shape:

```json
{
  "schema_version": 1,
  "policy_name": "spawn-model-routing-v1",
  "tiers": {
    "cheap": { "provider": "example", "model": "cheap-model" },
    "standard": { "provider": "example", "model": "standard-model" },
    "strong": { "provider": "example", "model": "strong-model" }
  }
}
```

## Routing Recommendation

| Spawn class | Recommendation | Default tier after proof | Escalate to `strong` when |
|---|---|---|---|
| file inventory / context extraction | `cheap-default` | `cheap` | repo is huge, ambiguous, or result drives irreversible decision |
| docs/link/package validation review | `cheap-default` | `cheap` | public API, install path, or release-critical docs |
| eval fixture validation explanation | `cheap-default` | `cheap` | fixture result changes promotion decision |
| test failure summarization | `mixed` | `standard` | flaky, concurrent, data-dependent, or production-critical failure |
| first-pass PR review | `mixed` | `standard` | security, reliability, performance, data migration, broad architecture |
| implementation patching | `mixed` | `standard` | high-risk code, low test coverage, broad refactor, unclear spec |
| council first-pass personas | `mixed` | `standard` for generalist/product/docs/cost; `strong` for security/reliability/ML/statistics/architecture blockers | persona owns a blocker decision or confidence is low |
| council synthesis | `strong-default` | `strong` | always |
| final spec/acceptance checker | `mixed` | `standard` | user-visible contract, release gate, or high-risk launch |
| ML/statistical experiment critique | `strong-default` | `strong` | always until evaluation proves narrower cheap substeps |
| security/reliability/perf blocker review | `strong-default` | `strong` | always for blocker calls; cheaper only for preliminary inventory |

## Evaluation Plan

Compare at least two cheaper tiers against current default on the same artifact.

### Fixture set

Minimum fixtures per spawn class before opt-in:

| Spawn class | Minimum comparable tasks |
|---|---:|
| context extraction | 10 |
| docs/package validation | 10 |
| PR review | 10 |
| implementation checks | 10 |
| council first-pass personas | 10 councils or 40 persona positions |
| test failure summarization | 10 |

Use synthetic fixtures for coverage and real historical tasks when available. Store pointers and summaries only; do not commit raw private prompts/logs/customer data.

### Metrics

| Metric | Definition |
|---|---|
| cost reduction | `(baseline_cost - candidate_cost) / baseline_cost` |
| latency delta | candidate latency vs baseline latency |
| agreement rate | candidate verdict matches baseline/human verdict |
| accepted findings | findings accepted or acted on by human/downstream workflow |
| missed blocker rate | blocker found by baseline/human but missed by candidate |
| false blocker rate | candidate blocker rejected by human/baseline |
| human override rate | human changes model recommendation |
| rework rate | downstream revision caused by missed/poor model output |
| escalation rate | cheap/standard spawn escalates to strong |

### Rollout gates

All must pass before opt-in routing:

- at least 30% cost reduction per accepted workflow or per spawn class.
- missed-blocker rate non-inferior to current default within agreed margin.
- false-blocker, human-override, and rework rates no worse than current default.
- latency improves or remains acceptable for the workflow mode.
- minimum fixture count met for each spawn class.
- no privacy failures.
- runtime model-control boundary verified for target runtime.

Default routing requires an additional maintainer review of the readout and rollback plan.

## Telemetry Proposal

Spawn-level telemetry fields:

```json
{
  "schema_version": 1,
  "event": "spawn_result",
  "spawn_id": "spawn-123",
  "parent_run_id": "run-123",
  "spawn_role": "docs-dx",
  "spawn_reason": "package install docs review",
  "model_tier": "cheap|standard|strong",
  "provider": "provider-name",
  "model": "model-name",
  "tokens_in": 0,
  "tokens_out": 0,
  "cost_usd": 0,
  "pricing_version": "pricing-2026-07-10",
  "latency_ms": 0,
  "verdict": "pass|pass-with-nits|block|needs-info|null",
  "confidence": "low|medium|high|null",
  "escalated_to_strong": false,
  "escalation_reason": null,
  "human_override": false,
  "accepted_findings_count": 0,
  "missed_blocker_count": 0,
  "rework_required": false
}
```

Collection modes:

| Field group | Automatic when possible | Manual/source required |
|---|---|---|
| provider/model/tokens/cost/latency | provider/runtime telemetry | estimated/user-supplied when missing |
| spawn role/reason/tier | wrapper/runtime policy | caller-provided when no wrapper exists |
| verdict/confidence | agent output parser | manual if unstructured |
| accepted findings/rework/missed blockers | no | human review, PR outcome, eval judge, later backprop |

## Pricing Catalog Proposal

Pricing must be versioned so old telemetry remains interpretable.

```json
{
  "pricing_version": "pricing-2026-07-10",
  "currency": "USD",
  "models": [
    {
      "provider": "provider-name",
      "model": "model-name",
      "input_rate": 0,
      "output_rate": 0,
      "cache_read_rate": 0,
      "cache_write_rate": 0,
      "unit": "per_1m_tokens",
      "source_url": "https://provider.example/pricing",
      "effective_date": "2026-07-10",
      "last_checked": "2026-07-10",
      "owner": "autopraxis maintainer",
      "stale_after": "30d"
    }
  ]
}
```

If pricing is stale, cost comparisons are directional only and cannot justify default routing.

## Shadow Rollout

Start with shadow mode for low-risk classes only:

- max 20 shadow spawns/day.
- max $5/day shadow spend until first readout.
- max 20% of eligible workflows.
- auto-disable on any privacy failure, missed-blocker spike, or daily budget breach.
- owner approval required to raise caps.
- rollback is config-only: all spawn classes return to current default model.

## Recommendation

- ship no default routing until runtime enforcement and evaluation pass.
- allow research/shadow experiments for `cheap-default` candidates first: context extraction and docs/package validation.
- keep council synthesis, ML/statistical critique, and security/reliability/perf blocker review on `strong`.
- use `mixed` for implementation, PR review, and council persona first pass with escalation on uncertainty or high-risk domain.

## Privacy Rules

- store summaries, metrics, artifact pointers, and verdict metadata only.
- do not store raw prompts, raw logs, secrets, credentials, customer data, hidden prompts, or private transcripts in repo fixtures.
- council transcripts stay in agent-fleet storage; Autopraxis telemetry stores pointers by default.
