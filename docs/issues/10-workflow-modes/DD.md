# DD: Issue #10 Workflow Modes, Token Budgets, Progressive Disclosure

## Decision Need

- decision: Implement workflow modes as skill-level guidance plus validation.
- owner: Autopraxis maintainer.
- PRD: `docs/issues/10-workflow-modes/PRD.md`
- next gate: council review.

## Context

Issue #8 added README advisory depth labels. Issue #11 adds council minimization. Issue #10 makes depth labels meaningful inside workflow skills.

## Proposed Design

### Workflow mode sections

Add compact `## Workflow Modes` sections to each top-level workflow:

- `lite`: shortest useful path, no optional council/templates, narrow artifact set.
- `default`: normal workflow with one planned gate and focused artifacts.
- `deep`: full rigor for high-risk/cross-functional/irreversible work.
- `Escalate`: one line of risk triggers.
- `Load`: one line of progressive-disclosure rules.

Do not require repeated mode tables; keep each local section short.

### Telemetry fields

Add mode metrics to `run-telemetry`:

```json
{
  "metrics": {
    "workflow_mode": "lite|default|deep",
    "mode_budget": {
      "refs": "focused|selected|full",
      "artifacts": "one|selected|full",
      "council_level_max": "none|single-lens|minimal-council|full-council",
      "loop_cap": 1,
      "validation_scope": "focused|standard|broad"
    },
    "mode_escalation_reason": "non-sensitive reason when mode changes"
  }
}
```

### Validation

Extend `tests/validate-skills.mjs`:

- every top-level workflow has `## Workflow Modes`.
- each mode name appears.
- each workflow includes `Escalate:` and `Load:` lines.
- run telemetry includes structured mode fields.
- README future-work placeholder for #10 is removed.

## Alternatives Considered

| Option | Pros | Cons | Decision |
|---|---|---|---|
| README labels only | tiny | labels stay vague | rejected |
| CLI mode flags | executable | more runtime surface | defer |
| full per-workflow tables | visible in installed skills | repeated boilerplate | rejected |
| shared reference only | less repetition | agents may not load it | rejected for v1 |
| compact local mode blocks | visible and small | some repetition | selected |

## Rollout

Skill guidance only. Later issues can add CLI flags, eval checks, and prompt-byte measurement.
