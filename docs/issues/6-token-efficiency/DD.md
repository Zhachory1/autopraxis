# DD: Issue #6 Token Efficiency

## Decision Need

- decision: Implement issue #6 as a reference note that ties together #8, #10, #11, #12, and #9.
- owner: Autopraxis maintainer.
- PRD: `docs/issues/6-token-efficiency/PRD.md`

## Proposed Design

Add `docs/reference/token-efficiency.md` with:

- first-class token strategy.
- current mechanisms: router, modes, council minimization, telemetry, eval fixtures.
- progressive-disclosure rules.
- mode envelopes.
- metric dictionary using existing telemetry fields.
- quality guardrails.
- up to 3 deferred low-risk follow-up improvements.

## Why Docs First

Exact token measurement needs model/runtime integration and eval runs. The current stack has enough primitives to document policy and make later measurement coherent without adding runtime complexity or new telemetry schema now.

## Test Plan

- `npm test` ensures docs links are valid.
- PR review checks issue #6 acceptance criteria are represented.
