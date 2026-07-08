---
name: council-review
description: "Parameterized council review wrapper for AI workflows. Use for council on docs, council on code, multi-persona review, product/security/scale/ops gate, ML experiment signoff, roadmap review, ideation jam, final merge call. Finds agent-fleet /council when available via AGENT_FLEET_HOME or /Users/zhach/code/agent-fleet, else runs a bounded persona review. Returns pass, pass-with-nits, or block with required changes, dissents, evidence, and telemetry."
---

# Council Review

Run a bounded multi-persona review that returns a decision-grade verdict, not loose commentary. Prefer agent-fleet `/council`; fall back to an inline multi-lens review only when council tooling is unavailable.

Use for PRD/DD gates, ML framing and experiment plan gates, roadmap approval prep, ideation jams, code/review adjudication, and backprop regression checks.

## Core Principles

**Verdict required.** Every run ends with `pass`, `pass-with-nits`, or `block`.

**Personas match risk.** Pick lenses by artifact type: product, architecture, security, reliability, ML, data, cost, execution, adversarial risk.

**Delta-only loops.** Re-review only required changes and new evidence, not settled context.

**Dissents survive synthesis.** Named minority concerns stay visible even when verdict passes.

**Bounded debate.** Persona count, iteration count, cost, and elapsed time have caps.

## Inputs

- artifact under review: doc, diff, plan, metrics, roadmap, ideation frame, review findings.
- review purpose and stage gate.
- persona set or council mode.
- rubric with pass/block criteria.
- prior council issues if this is a re-review.
- budget cap: max iterations, max personas, max time, max cost.
- run id for `run-telemetry`.

## Agent-Fleet Integration

Set or discover:

```bash
export AGENT_FLEET_HOME="${AGENT_FLEET_HOME:-/Users/zhach/code/agent-fleet}"
export AGENT_CHAT_ROOT="${AGENT_CHAT_ROOT:-$HOME/.agent-fleet/agent-chat}"
export AGENT_FLEET_JOURNAL="${AGENT_FLEET_JOURNAL:-$HOME/.agent-fleet/journal.jsonl}"
```

If `$AGENT_FLEET_HOME/skills/council/SKILL.md` exists, use that protocol. Preserve its durable capture requirements: room artifact, transcript, synthesis, journal row.

If agent-fleet is missing, run fallback mode:

- choose three to six lenses.
- produce blind positions first.
- run at most one reflection pass unless operator requests more.
- synthesize ranked issues, named dissents, strongest counterargument, and verdict.
- persist output under `.workflow-runs/<run-id>/council/` when a run directory exists.

## Persona Selection Hints

- PRD or feature scope: product-pm, ceo, red-team, mvp.
- DD or architecture: software-architect, generalist-swe, reliability-sentinel, occams-razor, cto.
- code or PR: generalist-swe, reliability-sentinel, perf-engineer, software-architect, docs-dx.
- ML experiment or model: ml-scientist, ab-critic, data-engineer, reliability-sentinel.
- roadmap or capacity: ceo, vp-eng, product-pm, cost-finops, cto.
- backprop changes: red-team, generalist-swe, docs-dx, cost-finops, relevant domain lens.

## Execution

**Prepare artifact.** Use `grounding-brief` context plus exact artifact pointer or copied content. Remove unrelated noise.

**Define rubric.** Convert stage goals into pass/block criteria before convening.

**Pick personas.** Honor operator roster first, then choose risk-matched lenses. Note overlap and bias risks.

**Run council.** Use agent-fleet `/council` if available. Else run fallback positions with bounded reflection.

**Synthesize verdict.** Rank blockers first, then required changes, nits, dissents, and recommendation.

**Loop on delta.** If blocked, send required changes to owner workflow. On re-review, include prior issues and only judge changed material.

**Emit telemetry.** Use `run-telemetry` for persona count, iteration count, verdict, blocker count, latency, cost, and whether council beat baseline.

## Output Contract

```markdown
# Council Review

## Verdict
- status: pass | pass-with-nits | block
- confidence: low | medium | high
- recommendation:

## Rubric
- criterion:
  result: pass | fail | uncertain
  evidence:

## Required Changes
- id:
  severity: blocker | major | minor
  owner:
  claim:
  evidence:
  required fix:
  re-review scope:

## Dissents
- persona:
  dissent:
  why preserved:

## Delta Loop
- next action: proceed | revise-and-re-review | escalate-human
- only re-review:
- cap remaining:
```

## Success Criteria

- verdict is explicit and actionable.
- blockers have evidence and concrete fix criteria.
- settled issues are not reopened on delta review.
- durable transcript exists when agent-fleet is available.
- `run-telemetry` event emitted.

## Common Failure Modes

**Commentary without gate.** Fix by forcing verdict and required-change list.

**Persona pile-on.** Fix by overlap check and orthogonal lens swaps.

**Infinite review churn.** Fix by cap plus human escalation when blockers persist.

**Council as implementation.** Fix by sending accepted changes to `ship`, not letting council patch.

## Self-Improvement

Track false blockers, missed blockers, repeated persona noise, and pass decisions later reverted. Feed these into `backprop` so persona rosters, rubrics, and caps improve based on measured outcomes.
