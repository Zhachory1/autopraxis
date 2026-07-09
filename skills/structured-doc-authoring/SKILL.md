---
name: structured-doc-authoring
description: "Author and revise structured workflow docs for agents: PRD, DD, design doc, implementation plan, RCA, ADR, experiment plan, roadmap proposal, handoff doc. Use for doc writing, doc quality gate, templates, acceptance criteria, risks, tradeoffs, decision records, prevention actions, Mermaid diagrams, Graphviz/DOT diagrams, visual explanations. Produces concise docs with fixed sections, visuals, source links, open questions, and telemetry."
---

# Structured Doc Authoring

Create workflow documents that downstream agents can execute and reviewers can gate. Covers PRDs, DDs, plans, RCAs, ADRs, experiment plans, roadmap proposals, and handoffs.

## Core Principles

**Docs exist to reduce expensive rework.** Put ambiguity, tradeoffs, and risks on paper before code or compute spend.

**Audience first.** PRD explains what and why. DD explains how. Plan explains order and acceptance. RCA explains cause and prevention.

**Decision-grade, not verbose.** Include only content that changes a decision, execution, or risk.

**Trace intent to evidence.** Link claims to grounding brief sources, metrics, code, logs, or prior decisions.

**Text plus visuals.** Use Mermaid and Graphviz/DOT diagrams liberally so agents and humans can see flows, dependencies, decisions, timelines, and causes instead of reconstructing them from prose.

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

**Choose visual model.** Add at least one diagram for non-trivial docs. Prefer Mermaid for flows, sequences, timelines, gantts, and state machines. Prefer Graphviz/DOT for dense dependency graphs, decision graphs, ownership maps, and causal graphs.

**Fill intent first.** Capture problem, why now, user/business outcome, and non-goals before implementation details.

**Expose tradeoffs.** State alternatives considered, chosen path, rejected paths, and why.

**Add gates.** Include success criteria, risks, validation, rollback/prevention, and human approval asks.

**Pair prose with diagrams.** Every diagram needs a one-paragraph interpretation: what to notice, what changed, and what risk or decision it clarifies. Do not drop unlabeled visuals into docs.

**Prepare for council.** Highlight decisions needing stress-test and unresolved assumptions.

**Revise on delta.** Apply specific feedback only; preserve settled sections.

**Emit telemetry.** Record doc type, revision count, open-question count, council-blocker count, and authoring latency via `run-telemetry`.

## Companion Files

Load these references on demand:

- `references/standards.md` — reconciled standards for doc selection, evidence, review gates, diagram use, SPADE decisions, and anti-patterns.
- `references/templates/prd-template.md` — product requirements document focused on problem alignment, goals, non-goals, metrics, visual flows, launch, and review.
- `references/templates/design-doc-template.md` — DD/RFC template focused on context, goals, proposed design, Mermaid/Graphviz diagrams, alternatives, tradeoffs, cross-cutting concerns, rollout, and review.
- `references/templates/technical-plan-template.md` — implementation plan/task-list template with file map, task graph, visual execution map, acceptance criteria, validation, and handoff.
- `references/templates/adr-template.md` — architecture decision record template with context, decision, alternatives, decision graph, consequences, guardrails, and supersession.
- `references/templates/roadmap-template.md` — engineering roadmap template with strategy, themes, scoring, visual roadmap, dependencies, capacity, horizons, and approval narrative.
- `references/templates/rca-template.md` — root cause analysis template with impact, timeline, causal diagrams, evidence, confirmed cause, ruled-out hypotheses, prevention, and opportunities.

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

## Visuals
- Mermaid diagram:
- Graphviz/DOT diagram:
- what the reader should notice:

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
- at least one useful Mermaid or Graphviz/DOT diagram exists for non-trivial docs.
- assumptions and open questions are visible.
- council/review feedback is traceable to revisions.
- `run-telemetry` event emitted.

## Common Failure Modes

**PRD contains solution too early.** Fix by moving implementation details to DD.

**DD hides product ambiguity.** Fix by returning to PRD before architecture locks.

**RCA stops at proximate cause.** Fix by requiring contributing factors and prevention.

**Plan lacks acceptance.** Fix by invoking `task-decomposition-planning`.

**Wall of text.** Fix by adding Mermaid or Graphviz/DOT diagrams for flows, dependencies, timelines, and causal links.

## Self-Improvement

Track doc sections that repeatedly trigger council blockers, human rewrites, or implementation confusion. Feed patterns into `backprop` to refine templates and quality gates.
