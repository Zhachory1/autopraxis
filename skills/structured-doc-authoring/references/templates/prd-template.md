# PRD Template

Use this template when the work needs product, user, or business alignment before technical design. Keep implementation detail high level; detailed architecture belongs in the DD.

## Header

```markdown
# PRD: <Project Name>

- one-line description:
- status: draft | problem-review | solution-review | launch-review | launched | superseded
- responsible owner:
- contributors:
- reviewers:
- linked resources:
- next gate:
```

## Problem Alignment

```markdown
## Problem

Describe the problem in one to two sentences. A reader should be able to repeat the value and risk without reading the rest of the doc.

## Why This Matters

- customer/user impact:
- business impact:
- why now:
- evidence:
  - source:
  - finding:
  - confidence: high | medium | low

## Current State

- what users do today:
- known pain:
- current workaround:
- baseline metric:

## Target User Or Segment

- primary user:
- secondary user:
- excluded users:
```

## Success Criteria

```markdown
## Goals

- goal:
  metric or signal:
  target:
  priority:

## Non-Goals

- non-goal:
  why excluded:

## Primary Metric

- name:
- definition:
- baseline:
- target:
- measurement source:
- evaluation window:

## Guardrails

- guardrail:
  threshold:
  failure action:
```

## High-Level Approach

```markdown
## Approach

Describe the rough shape of the solution. The reader should be able to squint and see the same product direction without treating this as final architecture.

## Key Features

- feature:
  user value:
  priority:
  acceptance criteria:

## Key Flows

Describe end-to-end user experience. Use prose plus visuals. Include Mermaid for the main user journey and Graphviz/DOT when stakeholder, dependency, or decision relationships are dense.

## Visual Model

- Mermaid flowchart to show current and proposed user journey:
- Graphviz/DOT graph for dependency, stakeholder, or decision relationships:
- what the reader should notice:

## Key Logic

- rule:
  why it exists:
  edge cases:
```

## Decision Framing

Use SPADE when this PRD makes or requests a hard product decision.

```markdown
## Decision Frame

- setting:
  - what decision:
  - why it matters:
  - when needed:
  - why that timing:
- people:
  - responsible:
  - approver:
  - consulted:
  - informed:
- alternatives:
  - option:
    pros:
    cons:
    evidence:
- decision needed:
- explanation plan:
```

## Launch And Operations

```markdown
## Launch Plan

| Target Date | Milestone | Description | Exit Criteria | Owner |
|---|---|---|---|---|
| <date> | <milestone> | <description> | <criteria> | <owner> |

## Operational Checklist

| Team/Function | Prompt | Status | Owner |
|---|---|---|---|
| Analytics | Measurement ready? | yes/no/na | |
| Sales/GTM | Customer-facing messaging ready? | yes/no/na | |
| Support/CS | Support playbook ready? | yes/no/na | |
| Marketing/Product Marketing | Launch materials ready? | yes/no/na | |
| Legal/Risk/Privacy | Review required or complete? | yes/no/na | |
| Engineering/Ops | Monitoring/rollback ready? | yes/no/na | |
```

## Open Questions And Review

```markdown
## Open Questions

| Question | Owner | Blocks | Due | Status |
|---|---|---|---|---|
| <question> | <owner> | problem/design/launch | <date> | open |

## Review State

| Reviewer | Role | Status | Required Changes |
|---|---|---|---|
| <name> | <role> | pending/approved/blocked | <changes> |

## Do Not Continue If

- contributors are not aligned on the problem.
- primary success metric is missing.
- non-goals are unclear.
- launch/operational ownership is missing for risky work.
```

## Changelog

```markdown
## Changelog

| Date | Change | Owner |
|---|---|---|
| <date> | <change> | <owner> |
```
