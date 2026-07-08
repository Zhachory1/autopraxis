---
name: structured-doc-authoring
description: "Author and revise structured workflow docs for agents: PRD, DD, design doc, implementation plan, RCA, ADR, experiment plan, roadmap proposal, handoff doc. Use for doc writing, doc quality gate, templates, acceptance criteria, risks, tradeoffs, decision records, prevention actions. Produces concise docs with fixed sections, source links, open questions, and telemetry."
---

# Structured Doc Authoring

Create workflow documents that downstream agents can execute and reviewers can gate. Covers PRDs, DDs, plans, RCAs, ADRs, experiment plans, roadmap proposals, and handoffs.

## Core Principles

**Docs exist to reduce expensive rework.** Put ambiguity, tradeoffs, and risks on paper before code or compute spend.

**Audience first.** PRD explains what and why. DD explains how. Plan explains order and acceptance. RCA explains cause and prevention.

**Decision-grade, not verbose.** Include only content that changes a decision, execution, or risk.

**Trace intent to evidence.** Link claims to grounding brief sources, metrics, code, logs, or prior decisions.

**Revision is bounded.** Council feedback changes specific sections; do not rewrite settled docs without reason.

## Inputs

- requested doc type.
- `grounding-brief` output.
- success criteria and metrics.
- target audience and decision owner.
- known constraints, non-goals, risks.
- prior council issues or reviewer comments.
- run id for `run-telemetry`.

## Execution

**Load standards.** Read `references/standards.md` before authoring high-stakes PRDs, DDs, plans, ADRs, roadmaps, or RCAs.

**Pick template.** Choose the matching file under `references/templates/`: PRD, design doc, technical plan, ADR, roadmap, or RCA. Use lightweight inline sections only for trivial docs.

**Fill intent first.** Capture problem, why now, user/business outcome, and non-goals before implementation details.

**Expose tradeoffs.** State alternatives considered, chosen path, rejected paths, and why.

**Add gates.** Include success criteria, risks, validation, rollback/prevention, and human approval asks.

**Prepare for council.** Highlight decisions needing stress-test and unresolved assumptions.

**Revise on delta.** Apply specific feedback only; preserve settled sections.

**Emit telemetry.** Record doc type, revision count, open-question count, council-blocker count, and authoring latency via `run-telemetry`.

## Companion Files

Load these references on demand:

- `references/standards.md` — reconciled standards for doc selection, evidence, review gates, SPADE decisions, and anti-patterns.
- `references/source-notes.md` — source synthesis and attribution notes for the supplied PRD/DD/ADR/roadmap/plan/RCA references.
- `references/templates/prd-template.md` — product requirements document focused on problem alignment, goals, non-goals, metrics, features, flows, launch, and review.
- `references/templates/design-doc-template.md` — DD/RFC template focused on context, goals, proposed design, alternatives, tradeoffs, cross-cutting concerns, rollout, and review.
- `references/templates/technical-plan-template.md` — implementation plan/task-list template with file map, task graph, acceptance criteria, validation, and handoff.
- `references/templates/adr-template.md` — architecture decision record template with context, decision, alternatives, consequences, guardrails, and supersession.
- `references/templates/roadmap-template.md` — engineering roadmap template with strategy, themes, scoring, dependencies, capacity, horizons, and approval narrative.
- `references/templates/rca-template.md` — root cause analysis template with impact, timeline, evidence, confirmed cause, ruled-out hypotheses, prevention, and opportunities.

## Output Contract

```markdown
# <Doc Type>: <Title>

## Decision Need
- decision:
- owner:
- deadline:

## Context
- source:
- facts:

## Proposal
- scope:
- non-goals:
- approach:

## Success And Validation
- primary metric:
- acceptance criteria:
- evidence required:

## Risks And Tradeoffs
- risk:
  mitigation:
  owner:

## Open Questions
- question:
  owner:
  blocks:

## Next Gate
- council-review | task-decomposition-planning | ship | human-approval-gate
```

## Success Criteria

- doc type matches audience and stage.
- sections needed by downstream workflow are complete.
- assumptions and open questions are visible.
- council/review feedback is traceable to revisions.
- `run-telemetry` event emitted.

## Common Failure Modes

**PRD contains solution too early.** Fix by moving implementation details to DD.

**DD hides product ambiguity.** Fix by returning to PRD before architecture locks.

**RCA stops at proximate cause.** Fix by requiring contributing factors and prevention.

**Plan lacks acceptance.** Fix by invoking `task-decomposition-planning`.

## Self-Improvement

Track doc sections that repeatedly trigger council blockers, human rewrites, or implementation confusion. Feed patterns into `backprop` to refine templates and quality gates.
