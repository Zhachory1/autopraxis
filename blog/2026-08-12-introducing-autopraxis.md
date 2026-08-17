# Introducing Autopraxis: self-improving workflow skills for AI agents

Most AI coding agents are good at execution and bad at everything around it.
They'll write the code, but they skip the grounding, the plan, the review, and
the learning loop — the parts that decide whether the work was actually right.

Autopraxis is a set of portable **workflow skills** that put that process back,
without drowning you in ceremony.

## The idea

Autopraxis turns messy goals into grounded briefs, reviewed plans, shipped work,
and measured learning loops. It's built for chaotic quests where planning,
review, and adaptation matter as much as raw execution.

Each skill is a portable `SKILL.md` with YAML frontmatter, explicit input/output
contracts, bounded loops, and telemetry hooks. Drop them into an agent and they
compose.

## Load only as much process as the work deserves

The fastest way to make process useless is to apply the same heavy gates to
everything. Autopraxis uses **workflow modes** to right-size the ceremony:

- **`lite`** — the shortest useful path; skip optional councils and templates
  unless risk appears.
- **`default`** — the normal gate for planned work; load only what the selected
  artifacts need.
- **`deep`** — high-risk, ambiguous, cross-functional, irreversible, or
  leadership-visible work; full gates allowed, with an explicit reason.

You escalate `lite → default → deep` only when risk or ambiguity shows up — and
you record why.

## The workflows

Pick one top-level workflow first; the shared skills are connective tissue the
workflows call as needed.

- **`plan-to-launch`** — PRD → DD → council → plan → ship → review → final
  council → launch PR. For building or changing software from accepted intent.
- **`ml-experiments`** — problem/metric framing → data/EDA → tracking →
  hypothesis/train/validate loop → handoff. For judging models and experiments
  against locked metrics.
- **`pr-review`** — context → architecture → line-level review → optional local
  test → feedback → human signoff.
- **`debug-investigation`** — symptom → evidence → repro → trace → hypothesis
  loop → RCA/handoff. For when behavior is wrong and the cause is unknown.
- **`adversarial-probe`** — surface map → locked thresholds → attack plan →
  approval gate → attack loop → confirmed-breakage handoff. For attacking a
  working system before a symptom exists.
- **`project-ideation`** — OKR deconstruction → gap analysis → cross-functional
  jam → framing → feasibility. For fuzzy opportunities that need framing.
- **`roadmapping`** — ROI scoring → dependency/capacity iteration → horizon
  themes → council → approval.
- **`backprop`** — ingest run history/telemetry → diagnose workflow failures →
  propose improvements → council → shadow-A/B → promote/rollback. This is the
  self-improving part: Autopraxis analyzing its own runs to get better.

Under those sit reusable primitives — `grounding-brief`,
`success-criteria-metrics`, `task-decomposition-planning`, `hypothesis-testing`,
`structured-doc-authoring`, `handoff-packaging`, `human-approval-gate`,
`run-telemetry` — so the workflows share one vocabulary instead of reinventing
each step.

## Why "praxis"

Praxis is practice informed by theory, refined by doing. `backprop` closes that
loop: run history feeds diagnosis, diagnosis proposes improvements, and the
improvements are gated before they land. The workflows don't just run — they're
meant to get better from having run.

Start with one workflow that matches your role — developers with
`plan-to-launch`, PMs with `project-ideation`, leadership with `roadmapping` —
and let it pull in the rest only when the work calls for it.
