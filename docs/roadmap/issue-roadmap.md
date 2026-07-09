# Autopraxis Issue Roadmap

## Goal

Streamline workflows for developers, PMs, and leadership with maximum overlap, low friction, high efficiency, and low token/confusion overhead.

## Sequencing Principle

Do not add broad workflow surface before routing, council minimization, modes, telemetry, and evals make the existing surface easy to choose and cheap to run.

## Now

### Issue #8 — Workflow router and role-based start paths

**Why first:** Users need a small front door before more skills, modes, or evals matter.

**Output:** README start-here router, role/task matrix, workflow chooser guide, shared-skill guidance, validation.

**Non-goal:** Full router runtime or new top-level router skill unless later evals prove it is needed.

### Issue #11 — Council escalation and minimization matrix

**Why second:** Council is a major token/cost multiplier and should become an explicit risk-based choice before mode work relies on it.

**Output:** shared matrix, skip/minimal/full triggers, workflow references, telemetry field definition.

### Issue #10 — Workflow modes, token budgets, progressive disclosure

**Why third:** Modes depend on router entrypoints and council minimization. This converts full workflows into lite/default/deep paths.

**Output:** mode tables, budget defaults, escalation triggers, reference-loading rules.

### Issue #12 — Executable telemetry

**Why paired with #10:** Modes and budgets need observable events. Telemetry also unlocks eval/backprop.

**Output:** `telemetry emit|validate|summarize`, schema, fixtures, privacy checks.

## Next

### Issue #9 / #5 — Minimal eval harness and evaluation framework

**Why after telemetry:** Eval data should use real schemas and mode/council fields instead of inventing parallel formats.

**Output:** fixtures, baseline/candidate runner, rubrics, privacy policy, promotion/rollback rule.

### Issue #6 — Token/context overhead reduction

**Why after modes/evals:** Token reductions must be measured and regression-safe. #10 handles the first implementation slice; #6 becomes the umbrella analysis and follow-through.

**Output:** token-risk analysis, prompt-byte budget checks, shared boilerplate dedupe, progressive disclosure refinements.

## Later

### Issue #4 — Additional workflow research

**Why later:** New workflows should be gated by evidence, evalability, and overlap scoring.

**Output:** ranked candidates, accepted/rejected list, top 3 one-pagers, recommendation for next workflow or recipe.

## Release Shape

Each issue should ship as a focused PR using risk-sized dev workflow:

- PRD and DD for workflow-shape changes.
- council with a strong MVP voice when scope, risk, or user-facing behavior changes.
- task plan.
- implementation.
- code review.
- final council only when runtime behavior, new skills, security/privacy, or large diffs increase risk.
- PR.

Issue #8 intentionally stays docs + validation only, so one council plus code review is enough unless implementation expands scope.

## Roadmap Guardrails

- prefer recipes and routing over new skills.
- require eval path before adding net-new workflow surface.
- minimize default councils.
- keep shared skills as primitives, not user-facing entrypoints.
- measure token/cost and confusion before optimizing further.
