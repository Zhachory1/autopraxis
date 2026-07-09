# DD: Issue #5 Evaluation Framework

## Decision Need

- decision: Implement issue #5 as `docs/reference/evaluation-framework.md` plus README pointer.
- owner: Autopraxis maintainer.
- PRD: `docs/issues/5-evaluation-framework/PRD.md`

## Proposed Design

The framework will define:

- primary metric: actionable success with accepted outcome.
- guardrails: token/cost, human edit, rework, validation, missed-risk, privacy.
- eval methods: deterministic fixtures, telemetry replay, shadow runs, optional model-judged review, human spot checks.
- per-workflow eval approach.
- baseline/candidate comparison rules.
- data retention policy.
- backprop consumption contract.
- promotion/rollback gates.

## Why Docs First

Issue #9 provides the first deterministic harness. Model-backed and A/B evals need real usage data and should not block the policy.

## Test Plan

- `npm test` link validation.
- PR review against issue #5 acceptance criteria.
