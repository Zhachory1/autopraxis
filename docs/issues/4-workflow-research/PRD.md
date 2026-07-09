# PRD: Issue #4 Additional Workflow Research

## Decision Need

- decision: Rank candidate future workflows and recommend next build without expanding skill surface prematurely.
- owner: Autopraxis maintainer.
- linked issue: https://github.com/Zhachory1/autopraxis/issues/4
- base branch: `docs/issue-5-evaluation-framework`

## Problem

Autopraxis can add many workflows, but more workflows also increase routing confusion, maintenance cost, and token overhead. New workflow surface should be evidence-gated and overlap-aware.

## Goals

- Rank candidate workflows with explicit criteria.
- Define top candidates with step goals and output contracts.
- Document rejected/deferred workflow ideas.
- Recommend what to build next and why.

## Non-Goals

- Implement new workflow skills.
- Add new shared primitives.
- Change router behavior.

## Acceptance Criteria

- candidate workflows ranked with criteria.
- top 3-5 candidates have clear goals and output contracts.
- non-goals/rejected workflows documented.
- recommendation states next workflow/recipe to build.
