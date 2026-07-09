---
name: council-review
description: "Parameterized council review wrapper for AI workflows. Use for council on docs, council on code, multi-persona review, council escalation, council minimization, product/security/scale/ops gate, ML experiment signoff, roadmap review, ideation jam, final merge call. Finds agent-fleet /council when available via AGENT_FLEET_HOME or /Users/zhach/code/agent-fleet, else runs bounded review. Returns council level, pass/pass-with-nits/block, changes, dissents, evidence, telemetry."
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

**Minimize before convening.** Select `none`, `single-lens`, `minimal-council`, or `full-council` from `references/escalation-matrix.md` before choosing personas.

## Inputs

- artifact under review: doc, diff, plan, metrics, roadmap, ideation frame, review findings.
- review purpose and stage gate.
- persona set or council mode.
- rubric with pass/block criteria.
- prior council issues if this is a re-review.
- budget cap: max iterations, max personas, max time, max cost.
- risk signals: reversibility, blast radius, cross-team impact, unresolved blockers, conflicting reviewers, security/privacy/reliability/ML/statistical concerns.
- run id for `run-telemetry`.

## Agent-Fleet Integration

Set or discover:

```bash
export AGENT_FLEET_HOME="${AGENT_FLEET_HOME:-/Users/zhach/code/agent-fleet}"
export AGENT_CHAT_ROOT="${AGENT_CHAT_ROOT:-$HOME/.agent-fleet/agent-chat}"
export AGENT_FLEET_JOURNAL="${AGENT_FLEET_JOURNAL:-$HOME/.agent-fleet/journal.jsonl}"
```

If `$AGENT_FLEET_HOME/skills/council/SKILL.md` exists, use that protocol only for `minimal-council` or `full-council`. Preserve its durable capture requirements: room artifact, transcript, synthesis, journal row.

If agent-fleet is missing and council level is `minimal-council` or `full-council`, run fallback mode:

- choose two to three lenses for `minimal-council` or four to six lenses for `full-council`.
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

**Select council level.** Use `references/escalation-matrix.md` to choose `none`, `single-lens`, `minimal-council`, or `full-council`. Record `council_level`, `council_reason`, `persona_count`, and `agent_fleet_invoked`.

**Skip when level is none.** Emit a skipped gate with verdict `pass`, reason, confidence, and next action. Do not call agent-fleet.

**Run one lens when single-lens.** Use the most relevant reviewer/persona and the normal verdict shape. Do not present it as consensus.

**Pick personas for minimal/full.** Honor operator roster first, then choose risk-matched lenses. Note overlap and bias risks.

**Run council for minimal/full.** Use agent-fleet `/council` if available. Else run fallback positions with bounded reflection.

**Synthesize verdict.** Rank blockers first, then required changes, nits, dissents, and recommendation.

**Loop on delta.** If blocked, send required changes to owner workflow. On re-review, include prior issues and only judge changed material.

**Emit telemetry.** Use `run-telemetry` for council level, non-sensitive council reason, persona count, whether agent-fleet was invoked, iteration count, verdict, blocker count, latency, cost, and whether council beat baseline.

## Output Contract

```markdown
# Council Review

## Council Level
- council_level: none | single-lens | minimal-council | full-council
- council_reason:
- agent_fleet_invoked: true | false
- persona_count:

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

## Companion Files

- `references/escalation-matrix.md` — council minimization policy, levels, triggers, cost caps, output fields, telemetry fields, and anti-patterns.

## Success Criteria

- council level and reason are recorded before review starts.
- verdict is explicit and actionable.
- blockers have evidence and concrete fix criteria.
- settled issues are not reopened on delta review.
- durable transcript exists only when `minimal-council`/`full-council` invokes agent-fleet.
- `run-telemetry` event emitted.

## Common Failure Modes

**Commentary without gate.** Fix by forcing verdict and required-change list.

**Persona pile-on.** Fix by downshifting level, overlap check, and orthogonal lens swaps.

**Infinite review churn.** Fix by cap plus human escalation when blockers persist.

**Council as implementation.** Fix by sending accepted changes to `ship`, not letting council patch.

## Self-Improvement

Track false blockers, missed blockers, repeated persona noise, and pass decisions later reverted. Feed these into `backprop` so persona rosters, rubrics, and caps improve based on measured outcomes.
