# RCA Template

Use this template after an incident, severe bug, failed launch, or repeated workflow failure. The goal is durable learning: confirmed cause, contributing factors, fix, and prevention.

## Header

```markdown
# RCA: <Incident Or Bug Title>

- status: draft | in-review | accepted | follow-up-open | closed
- date/time window:
- owner:
- affected systems/users:
- severity:
- related incident/ticket/PR:
- next gate:
```

## Executive Summary

```markdown
## Summary

One paragraph: what happened, impact, confirmed root cause, current status, and primary prevention action.

## Impact

- user/customer impact:
- business impact:
- systems impacted:
- duration:
- error budget/SLO impact:
- detection source:
```

Use precise numbers: dates, times, counts, percentages, latency deltas, dollars, affected segments.

## Timeline

```markdown
## Timeline

| Time | Event | Source | Owner/Actor |
|---|---|---|---|
| <timestamp> | <event> | <log/trace/person> | <owner> |
```

## Expected Vs Actual

```markdown
## Expected Behavior

- expected:
- source of expectation:

## Actual Behavior

- actual:
- evidence:
```

## Root Cause Analysis

```markdown
## Confirmed Root Cause

- cause:
- evidence:
- why this explains the symptom:
- confidence: high | medium | low

## Contributing Factors

- factor:
  evidence:
  impact:

## Ruled-Out Hypotheses

| Hypothesis | Test/Evidence | Verdict |
|---|---|---|
| <hypothesis> | <evidence> | ruled out |
```

Use mechanism language: trigger, condition, sequence of effects, root cause, driver/inhibitor. Avoid blame language.

## Remediation And Prevention

```markdown
## Immediate Fix

- fix:
- owner:
- validation:
- deployed/complete:

## Prevention Actions

| Action | Type | Owner | Due | Success Evidence | Status |
|---|---|---|---|---|---|
| <action> | containment/prevention/detection | <owner> | <date> | <evidence> | open |

## Monitoring And Detection

- alert/dashboard/log needed:
- threshold:
- owner:
- validation:
```

## Consequences And Opportunities

```markdown
## Consequences

- short-term:
- long-term:
- stakeholders impacted:
- best/worst/likely future scenario:

## Opportunities

- product/platform/process improvement:
- follow-up owner:
```

## Review Checklist

```markdown
## RCA Checklist

- symptom and impact are precise.
- evidence sources are linked.
- root cause is confirmed, not merely correlated.
- contributing factors are system-focused.
- ruled-out hypotheses are recorded.
- prevention actions have owners and success evidence.
- open risks and follow-up gates are clear.
```
