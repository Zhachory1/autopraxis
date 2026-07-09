# PRD: Issue #6 Token Efficiency

## Decision Need

- decision: Document Autopraxis token/context strategy now that router, council levels, modes, telemetry, and eval fixtures exist in the stack.
- owner: Autopraxis maintainer.
- linked issue: https://github.com/Zhachory1/autopraxis/issues/6
- base branch: `feat/issue-9-eval-harness`

## Problem

Autopraxis can improve quality by adding structure, but excessive structure can waste tokens, slow work, and confuse agents. Token efficiency needs an explicit strategy that preserves high-risk rigor while making low-risk paths cheap.

## Goals

- Define token usage as a first-class optimization target.
- Summarize current low-risk token reduction mechanisms.
- Document progressive-disclosure rules.
- Reference existing token/cost telemetry fields and known gaps; no schema/runtime changes.
- Identify up to 3 low-risk follow-up changes.

## Non-Goals

- exact tokenizer integration.
- model-provider cost calculator.
- eval-backed token reduction proof; issue #9 provides the fixture base, later work can measure actual deltas.

## Acceptance Criteria

- docs define why token usage matters.
- docs describe `lite/default/deep` behavior.
- docs define reference/template loading rules.
- docs define token/cost metric dictionary using existing telemetry fields.
- docs list up to 3 deferred low-risk token reduction changes.
