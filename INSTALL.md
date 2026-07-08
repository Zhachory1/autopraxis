# Install Autopraxis

Autopraxis is a portable skill bundle. Native skill runtimes consume each `skills/<name>/SKILL.md`; generic agents can use the same files as markdown prompts.

## Quick Start

From a fresh clone:

```bash
npm test
node bin/autopraxis.mjs install --target mewrite
```

Or via the package bin after linking/installing locally:

```bash
npm link
autopraxis install --target mewrite
```

## Supported Targets

| Target | Default Destination | Layout | Notes |
|---|---|---|---|
| `mewrite` | `~/.mewrite/agent/skills` | skill directories | Me Write Code-compatible `SKILL.md` directories |
| `claude-code` | `~/.claude/skills` | skill directories | Claude Code-style skill directory fallback |
| `generic-markdown` | `~/.autopraxis/prompts` | markdown bundle | Copies skill dirs and writes `AUTOPRAXIS.md` index |
| `cursor-rules` | `.cursor/rules/autopraxis` | markdown bundle | Project-local rule/prompt bundle fallback |
| `windsurf-rules` | `.windsurf/rules/autopraxis` | markdown bundle | Project-local rule/prompt bundle fallback |

List targets:

```bash
node bin/autopraxis.mjs list-targets
```

## Install Options

```bash
node bin/autopraxis.mjs install --target <target> [--dest <path>] [--link] [--force] [--dry-run]
```

Options:

- `--target <target>` — install target from `autopraxis.json`.
- `--dest <path>` — override default destination; useful for custom agent homes and tests.
- `--link` — symlink skill directories instead of copying; useful during local development.
- `--force` — replace existing installed skill directories.
- `--dry-run` — print planned work without writing files.

Examples:

```bash
node bin/autopraxis.mjs install --target mewrite --force
node bin/autopraxis.mjs install --target claude-code --dest ~/.claude/skills
node bin/autopraxis.mjs install --target generic-markdown --dest ./autopraxis-prompts
node bin/autopraxis.mjs install --target mewrite --dest /tmp/autopraxis-smoke --dry-run
```

## Manual Install Fallback

If a runtime only needs skill directories:

```bash
mkdir -p ~/.mewrite/agent/skills
cp -R skills/* ~/.mewrite/agent/skills/
```

If a runtime wants prompt files, copy the desired skill directory and paste `SKILL.md` plus any referenced companion files.

## Upgrade

Copy mode:

```bash
git pull
node bin/autopraxis.mjs install --target mewrite --force
```

Symlink mode:

```bash
git pull
npm test
```

Symlink installs follow the working tree automatically.

## Uninstall

Remove installed skill directories and install marker:

```bash
rm -rf ~/.mewrite/agent/skills/{backprop,council-review,debug-investigation,dev-workflow,grounding-brief,handoff-packaging,human-approval-gate,hypothesis-testing,ml-experiments,pr-review,project-ideation,roadmapping,run-telemetry,structured-doc-authoring,success-criteria-metrics,task-decomposition-planning}
rm -f ~/.mewrite/agent/skills/_autopraxis-plugin.json
```

Adjust the destination for other targets.

## Optional Integrations

Autopraxis works without these, but skills become stronger when they are available.

| Integration | Purpose | How Skills Use It |
|---|---|---|
| `AGENT_FLEET_HOME` | Locate `agent-fleet` | `/council`, `/ship`, personas, journals, transcripts |
| long-term memory MCP / `gbrain` | Recall prior context | decisions, plans, incidents, session notes, retros |
| code RAG / repo-index / `coderag` | Understand codebases | semantic code search, dependency graph, ownership, similar changes |
| `.workflow-runs/<run-id>/telemetry.jsonl` | Backprop data | latency, cost, loops, validation, human edits, outcomes |

Default agent-fleet hint in the manifest is `/Users/zhach/code/agent-fleet`. Treat it as optional local guidance, not a hard dependency.

## Package Manifest

`autopraxis.json` is the canonical plugin manifest. It declares:

- skill root and skill list.
- supported install targets.
- optional integrations.
- package include/exclude rules.

External agent installers should read `autopraxis.json` instead of scraping the README.

## Validation

```bash
npm test
node bin/autopraxis.mjs validate-package
```

Validation checks:

- skill frontmatter and required sections.
- workflow connective-skill references.
- structured-doc companion templates.
- plugin manifest coverage.
- package excludes for local/private/generated data.
- markdown relative links.
- install smoke test into a temp directory.

## Distribution

Local distributable smoke check:

```bash
npm pack --dry-run
```

Do not publish to npm or a marketplace until package format and install flows are validated with real agent runtimes.
