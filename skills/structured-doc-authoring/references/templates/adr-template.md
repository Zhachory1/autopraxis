# ADR Template

Use this template to record an important architecture or technical decision. ADRs are short, durable, and discoverable. They explain context and consequences for future readers.

## File Header

```markdown
# ADR-<number>: <Decision Title>

- status: proposed | accepted | rejected | deprecated | superseded
- date:
- decision owner:
- consulted:
- supersedes:
- superseded by:
- related PRD/DD/issue/PR:
```

## Context

```markdown
## Context

What situation forces this decision now?

- business/user priority:
- technical constraints:
- operational constraints:
- relevant prior decisions:
- forces in tension:
```

Good context explains the organization’s situation and priorities, includes relevant pros/cons, and uses terms aligned with current goals.

## Decision

```markdown
## Decision

We will <decision>.

This means:

- included:
- excluded:
- owner:
- expected lifetime/review date:
```

## Alternatives

```markdown
## Alternatives Considered

| Option | Pros | Cons | Cost/Risk | Verdict |
|---|---|---|---|---|
| <option> | <pros> | <cons> | <cost/risk> | selected/rejected |
```

## Consequences

```markdown
## Consequences

### Positive

- <what becomes easier/better/safer>

### Negative

- <what becomes harder/riskier/more constrained>

### Neutral Or Follow-Up

- <migration, documentation, monitoring, or review work>
```

Consequences should explain effects, outcomes, follow-ups, and constraints created by the decision.

## Decision Guardrails

```markdown
## Guardrails

- enforcement:
- tests/fitness functions:
- code review checks:
- observability:
- when to revisit:
```

## SPADE Block For Hard Decisions

```markdown
## Decision Process

- setting:
  - what decision:
  - why it matters:
  - when needed:
- people:
  - responsible:
  - approver:
  - consulted:
  - informed:
- alternatives:
- decision:
- explanation plan:
```

## Review Checklist

```markdown
## ADR Checklist

- decision is significant enough to record.
- context explains why now.
- alternatives are realistic.
- consequences are concrete.
- status and supersession links are clear.
- future guardrails or revisit trigger exists.
```
