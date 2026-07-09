# Council Escalation Matrix

Use this before convening council. Goal: spend council tokens only when added judgment is worth it.

## Levels

| Level | Behavior | Use When | Cost Cap |
|---|---|---|---|
| `none` | emit skipped gate with reason; no reviewer/persona | low-risk work, clear owner, reversible change, no cross-functional tradeoff | 0 personas |
| `single-lens` | run one relevant lens/reviewer with normal verdict shape | one domain concern needs a check, but no broad debate | 1 persona, no reflection |
| `minimal-council` | run small multi-persona review | multiple domains, meaningful ambiguity, or conflicting signals | 2-3 personas, max 1 reflection |
| `full-council` | run broad high-stakes council | high blast radius, irreversible decision, security/privacy/reliability risk, executive/resource commitment, production ML/statistical claim | 4-6 personas, explicit high-risk trigger |

## Default Rules

- default to `none` for low-risk, reversible work.
- default to `single-lens` for one clear domain concern.
- default to `minimal-council` when two or more domains must agree or reviewer opinions conflict.
- use `full-council` only with a named high-risk trigger.
- if uncertain between two levels, pick the cheaper level and record escalation criteria.

## High-Risk Triggers

Escalate to `minimal-council` or `full-council` when any apply:

- hard-to-rollback or irreversible decision.
- production blast radius, SLO, security, privacy, data loss, or compliance risk.
- model/experiment claim affecting launch, spend, ranking, or user experience.
- cross-team roadmap, staffing, capacity, or leadership commitment.
- unresolved blockers or conflicting reviews.
- design mismatch discovered after implementation starts.

## Output Fields

Every council decision path should record:

```yaml
council_level: none | single-lens | minimal-council | full-council
council_reason: short non-sensitive reason
agent_fleet_invoked: true | false
persona_count: 0 | 1 | 2-6
```

For `none`, use verdict `pass` when the gate is explicitly skipped, with reason.
For `single-lens`, use the normal verdict shape but identify the lens/reviewer.
For `minimal-council` and `full-council`, use the council protocol and preserve dissents.

## Telemetry Fields

Use existing `run-telemetry` metrics fields. Canonical keys are `metrics.council_level`, `metrics.council_reason`, `metrics.persona_count`, and `metrics.agent_fleet_invoked`:

```json
{
  "metrics": {
    "council_level": "minimal-council",
    "council_reason": "conflicting architecture and reliability concerns",
    "persona_count": 3,
    "agent_fleet_invoked": true
  }
}
```

Do not store raw artifact text, logs, secrets, or customer data in reason fields.

## Anti-Patterns

**Full council by habit.** Fix by naming high-risk trigger or downshifting.

**Single lens pretending to be consensus.** Fix by preserving reviewer identity and confidence.

**Council for implementation.** Fix by sending accepted changes to implementation workflow.

**Council loop on settled issues.** Fix by delta-only re-review.
