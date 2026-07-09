---
name: roadmapping
description: "Roadmap creation workflow for agents. Use for roadmap, OKR planning, project evaluation, ROI scoring, dependency mapping, capacity allocation, now/next/later, theme grouping, council review, leadership approval. Produces prioritized roadmap with value/cost/risk tradeoffs, dependencies, resource plan, approval package, telemetry, memory and code RAG context, bounded allocation/dependency loops."
---

# Roadmapping

Sequence project candidates into an executable and defensible roadmap. Make tradeoffs explicit across ROI, dependencies, themes, capacity, risk, and strategic narrative.

## Core Principles

**Roadmaps are tradeoff artifacts.** Show why work is sequenced, not just what is listed.

**Use consistent scoring.** Compare candidates with shared criteria for value, cost, risk, confidence, and strategic fit.

**Dependencies shape time.** Do not schedule work before technical or organizational blockers are ready.

**Capacity is real.** Match work to actual people, skills, focus, and time.

**Approval creates commitment.** Leadership owns final plan and tradeoffs.

## Inputs

- project candidates from `project-ideation` or existing backlog.
- OKRs, strategy, constraints, deadlines, dependencies.
- team capacity, skill availability, ownership, budget.
- historical delivery data from memory, git, project tools, or prior roadmaps.
- run id for `run-telemetry`.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP for prior roadmaps, strategy, team constraints, and decisions. Use code RAG for technical dependencies and platform constraints. Use `success-criteria-metrics` for ROI scoring, `task-decomposition-planning` for dependency-aware sequencing, `council-review` for feasibility/alignment stress-test, `handoff-packaging`, `human-approval-gate`, and `run-telemetry`.

## Council Policy

Use `../council-review/references/escalation-matrix.md`. Simple sequencing can use no council or one execution/product lens. Use minimal/full council for leadership commitments, multi-team capacity conflicts, platform bets, high opportunity cost, or unresolved feasibility/risk disputes.

## Execution

**Evaluate ROI.** Score candidates by user/business value, strategic alignment, confidence, effort, risk, reversibility, time sensitivity, and learning value.

**Map dependencies.** Identify technical prerequisites, org dependencies, external commitments, staffing gaps, data/infrastructure blockers, and sequencing constraints.

**Group themes and horizons.** Organize into now, next, later with coherent themes that explain strategy and balance quick wins with long bets.

**Allocate capacity.** Match projects to teams/owners/skills and realistic time windows. Include buffers for support, interrupts, and unknowns.

**Iterate allocation and dependencies.** Adjust sequence when allocation reveals conflict or dependency mapping reveals hidden blocker.

**Council review.** Select council level from `../council-review/references/escalation-matrix.md`; use executive, product, engineering, architecture, cost, and risk lenses only when roadmap stakes justify minimal/full council.

**Revise and approval.** Apply council deltas, package final roadmap, and route to `human-approval-gate` for leadership commitment.

## Loop Controls

**Dependency capacity loop.** Iterate until timeline is executable, cap hit, or blockers require leadership decision.

**Council revise loop.** When council level is minimal/full, council, revise, and re-review only raised issues until pass/pass-with-nits or escalation. For none/single-lens, record reason and only re-review if the lens finds a blocker.

**Theme stability check.** Re-group only when scoring or dependencies materially change the story.

**State carry-forward.** Keep scoring rationale, rejected sequences, dependency graph, capacity assumptions, and council issues.

## Output Contract

```markdown
# Roadmap

## Scoring Model
- criteria:
- weights:
- confidence notes:

## Candidate Scores
- project:
  value:
  cost:
  risk:
  confidence:
  strategic fit:
  score:
  rationale:

## Dependencies And Capacity
- dependency:
  blocks:
  owner:
  ready by:
- team/owner:
  capacity:
  assigned work:
  risk:

## Horizons
- now:
- next:
- later:

## Council And Approval
- council level/verdict:
- required changes:
- leadership ask:
- telemetry path:
```

## Success Criteria

- candidates scored with consistent criteria.
- dependencies and prerequisites are explicit.
- capacity allocation is realistic.
- roadmap has now/next/later narrative and themes.
- council review either records skipped/one-lens reason or passes when minimal/full council is triggered.
- human approval package exists.
- `run-telemetry` events emitted.

## Common Failure Modes

**Loudest voice wins.** Fix by shared scoring rubric and evidence.

**Calendar fantasy.** Fix by capacity allocation and dependency loop.

**Theme salad.** Fix by grouping around strategic outcomes, not org charts.

**Approval ambiguity.** Fix by exact `human-approval-gate` ask and tradeoffs.

## Self-Improvement

Track roadmap commitments that slipped, delivered ROI, got descoped, or were blocked by missed dependencies. Feed outcomes into `backprop` to improve scoring, capacity assumptions, and council rubrics.
