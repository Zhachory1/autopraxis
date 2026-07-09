# PRD: Issue #5 Evaluation Framework

## Decision Need

- decision: Define the Autopraxis evaluation framework that guides workflow changes after the minimal fixture harness.
- owner: Autopraxis maintainer.
- linked issue: https://github.com/Zhachory1/autopraxis/issues/5
- base branch: `feat/issue-6-token-efficiency`

## Problem

Autopraxis needs a durable way to decide whether workflow changes improve outcomes. Issue #9 adds deterministic fixture coverage, but maintainers still need a broader evaluation policy for metrics, guardrails, privacy, and promotion/rollback.

## Goals

- Define primary and guardrail metrics for workflow quality.
- Define eval methods for current workflows.
- Define fair baseline-vs-candidate comparison rules.
- Define what data can be stored vs. pointer-only.
- Define how `backprop` consumes eval output without adding new runner behavior.
- Define promotion/rollback rules.

## Non-Goals

- Implement model-backed eval runner now.
- Run real A/B tests now.
- Store private artifacts.

## Acceptance Criteria

- evaluation framework doc exists.
- every current workflow has at least one eval method.
- baseline/candidate fairness rules are explicit.
- privacy/data-retention rules are explicit.
- promotion/rollback rules are explicit.
- PR changes only issue #5 docs, docs/reference/evaluation-framework.md, one README pointer, and a lightweight validation smoke check.
