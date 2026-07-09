---
name: project-ideation
description: "Project ideation workflow for OKR planning and feature discovery. Use for project ideation, feature ideas, goal deconstruction, gap analysis, customer/data-backed unmet needs, cross-functional jam, multi-persona council, project framing, success metric, technical feasibility, engineering lift. Produces framed candidates ready for roadmap evaluation with telemetry, memory, code RAG, and bounded diverge/converge loops."
---

# Project Ideation

Turn high-level goals into framed, evaluable project candidates. Use customer/data gaps, cross-functional creativity, and engineering feasibility to avoid surface-feature ideation.

## Core Principles

**Start from outcomes.** Deconstruct goals into measurable drivers before proposing features.

**Ground gaps in evidence.** Customer feedback, data, support pain, sales objections, product usage, and incidents beat brainstorming alone.

**Diverge then converge.** Generate broad options, then pressure-test and narrow.

**Frame projects as hypotheses.** A project candidate states problem, hypothesis, target outcome, rough scope, and success metric.

**Feasibility shapes scope.** Infeasible ideas loop back to reframe or downscope before roadmapping.

## Inputs

- OKR, strategic goal, customer problem, or opportunity area.
- user/customer data, feedback, support tickets, sales notes, product analytics.
- current roadmap, constraints, technical context, known platform limits.
- stakeholder personas and decision owner.
- run id for `run-telemetry`.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP for past ideas, product decisions, customer notes, and strategy docs. Use code RAG for technical feasibility and existing capabilities. Use `council-review` as cross-function jam with product/eng/design/GTM/data/executive lenses. Use `success-criteria-metrics`, `hypothesis-testing`, `handoff-packaging`, and `run-telemetry`.

## Council Policy

Use `../council-review/references/escalation-matrix.md`. Ordinary ideation can use no council or one product/engineering lens. Use minimal/full council for cross-functional jam, high-opportunity-cost bets, major strategic tradeoffs, or conflicting constraints across product, engineering, GTM, data, and strategy.

## Workflow Modes

- `lite`: fuzzy idea or OKR needs initial framing. Budget: one brief, no council, no full gap analysis unless evidence exists.
- `default`: product opportunity needs evidence-backed candidates and feasibility. Budget: focused customer/data/context refs, one converge loop, `council_level` max `minimal-council`.
- `deep`: cross-functional strategy, high opportunity cost, major GTM/design/data constraints, or leadership-visible bet. Budget: full jam/council allowed with reason and roadmap-ready handoff.
- Escalate: conflicting constraints, high opportunity cost, major feasibility uncertainty, or leadership commitment.
- Load: start with goal and evidence; load council matrix, metrics, handoff, or code RAG only when that phase is active.

## Execution

**Deconstruct goal.** Break objective into drivers, constraints, target users, measurable sub-outcomes, and non-goals.

**Analyze gaps.** Compare current vs desired state using customer feedback, analytics, support signals, competitive context, and internal constraints.

**Run cross-function jam.** Use `../council-review/references/escalation-matrix.md` to decide whether ideation needs no council, one lens, minimal council, or full cross-functional council across product, engineering, design, GTM, data, and strategy.

**Converge candidates.** Cluster ideas by user problem, value lever, feasibility, and strategic fit.

**Frame strongest projects.** Use `success-criteria-metrics` to define problem, hypothesis, target outcome, rough scope, primary metric, guardrails, and assumptions.

**Check technical feasibility and eng lift.** Use code RAG, architecture context, and engineering lenses to estimate effort, dependencies, risk, reversibility, and unknowns.

**Package for roadmap.** Use `handoff-packaging` to send candidates to `roadmapping` with evidence, metrics, cost/risk, dependencies, and open questions. Use `human-approval-gate` when candidate framing needs accountable stakeholder selection before roadmap scoring.

## Loop Controls

**Diverge/converge loop.** Run ideation passes until option space is broad enough, time cap hit, or repeated ideas dominate.

**Framing feasibility loop.** If candidate is infeasible, reframe, downscope, or discard; do not pass fantasy scope to roadmap.

**Delta-only re-jam.** Re-open only rejected or changed assumptions, not the full idea space.

**State carry-forward.** Keep idea clusters, rejected ideas, assumptions, feasibility notes, and candidate scores.

## Output Contract

```markdown
# Project Ideation Output

## Goal Deconstruction
- goal:
- drivers:
- target users:
- measurable sub-outcomes:

## Gaps
- gap:
  evidence:
  user/business impact:

## Candidate Projects
- name:
  problem:
  hypothesis:
  target outcome:
  rough scope:
  success metric:
  feasibility:
  eng lift:
  risks:
  dependencies:

## Rejected Or Deferred Ideas
- idea:
  reason:

## Roadmap Handoff
- recommended candidates:
- evidence links:
- telemetry path:
```

## Success Criteria

- goals are decomposed into drivers and measurable outcomes.
- gaps cite evidence.
- jam produces multiple distinct options and constraints.
- candidates are framed as testable project hypotheses.
- feasibility and lift are realistic enough for roadmap scoring.
- handoff package is ready for `roadmapping`.
- `run-telemetry` events emitted.

## Common Failure Modes

**Feature-first brainstorm.** Fix by returning to goal drivers and gaps.

**Evidence-free ideas.** Fix by requiring source links for gaps.

**Fantasy roadmap input.** Fix by feasibility loop and downscope.

**Council homogeny.** Fix by diverse lenses and explicit dissent preservation.

## Self-Improvement

Track ideas that later scored well, failed feasibility, got rejected by leadership, or produced real OKR impact. Feed outcomes into `backprop` to improve gap sourcing, persona rosters, and framing templates.
