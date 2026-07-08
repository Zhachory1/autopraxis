# Install Autopraxis

Autopraxis is a skills plugin bundle. It uses the standard `skills/<name>/SKILL.md` layout and ships native plugin manifests for Claude Code, Codex, and Me Write Code:

- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `.cave-plugin/plugin.json`

`autopraxis.json` is an extra cross-runtime manifest for this repo's installer and validation; the runtime-native manifests above are the actual plugin entry points.

## Quick Start

Claude Code plugin install:

```bash
node bin/autopraxis.mjs install --target claude-plugin --force
# then start Claude with normal plugin discovery, or test with:
# claude --plugin-dir ~/.claude/skills/autopraxis
```

Codex plugin install:

```bash
node bin/autopraxis.mjs install --target codex-plugin --force
# writes/updates ~/.agents/plugins/marketplace.json so Codex can discover the plugin
# then restart Codex and open: codex /plugins
```

Me Write Code plugin install:

```bash
node bin/autopraxis.mjs install --target mewrite-plugin --force
```

## Supported Targets

| Target | Default Destination | Layout | Notes |
|---|---|---|---|
| `claude-plugin` | `~/.claude/skills/autopraxis` | plugin root | Claude Code skills plugin with `.claude-plugin/plugin.json` |
| `codex-plugin` | `~/.codex/plugins/autopraxis` | plugin root | Codex plugin with `.codex-plugin/plugin.json`; installer updates marketplace file |
| `mewrite-plugin` | `~/.mewrite/plugins/Zhachory1/autopraxis` | plugin root | Me Write Code plugin with `.cave-plugin/plugin.json` |
| `mewrite-skills` | `~/.mewrite/agent/skills` | skill dirs | Legacy direct skill install |
| `claude-skills` | `~/.claude/skills` | skill dirs | Standalone Claude skill dirs, not namespaced as plugin |
| `codex-skills` | `~/.codex/skills` | skill dirs | Standalone Codex skill dirs, not marketplace plugin |
| `generic-markdown` | `~/.autopraxis/prompts` | markdown bundle | Copies skill dirs and writes `AUTOPRAXIS.md` index |
| `cursor-rules` | `.cursor/rules/autopraxis` | markdown bundle | Project-local rule/prompt fallback |
| `windsurf-rules` | `.windsurf/rules/autopraxis` | markdown bundle | Project-local rule/prompt fallback |

List targets:

```bash
node bin/autopraxis.mjs list-targets
```

## Install Options

```bash
node bin/autopraxis.mjs install --target <target> [--dest <path>] [--marketplace-dest <path>] [--link] [--force] [--dry-run]
```

Options:

- `--target <target>` — install target from `autopraxis.json`.
- `--dest <path>` — override default destination; useful for custom agent homes and tests.
- `--marketplace-dest <path>` — override Codex marketplace file when using `codex-plugin`.
- `--link` — symlink package entries or skill directories instead of copying; useful during local development.
- `--force` — replace existing installed destination.
- `--dry-run` — print planned work without writing files.

Examples:

```bash
node bin/autopraxis.mjs install --target claude-plugin --force
node bin/autopraxis.mjs install --target codex-plugin --marketplace-dest /tmp/marketplace.json --force
node bin/autopraxis.mjs install --target mewrite-skills --dest ~/.mewrite/agent/skills --force
node bin/autopraxis.mjs install --target generic-markdown --dest ./autopraxis-prompts
```

## Runtime-Native Plugin Layout

Autopraxis is intentionally shaped like a Claude/Codex skills plugin repo:

```text
autopraxis/
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  .cave-plugin/plugin.json
  .agents/plugins/marketplace.json
  skills/<skill-name>/SKILL.md
  skills/<skill-name>/references/...
  skills/<skill-name>/assets/...
```

Only manifest files belong under the hidden plugin manifest directories. `skills/`, references, examples, and future hooks/MCP files stay at the plugin root.

## Manual Install Fallback

Direct skill directory install:

```bash
mkdir -p ~/.codex/skills
cp -R skills/* ~/.codex/skills/
```

Claude plugin dev test from repo checkout:

```bash
claude --plugin-dir /path/to/autopraxis
```

Codex repo marketplace from repo checkout:

```bash
# repo already includes .agents/plugins/marketplace.json pointing at ./
# restart Codex and open:
codex /plugins
```

## Upgrade

Copy mode:

```bash
git pull
node bin/autopraxis.mjs install --target claude-plugin --force
```

Symlink mode:

```bash
git pull
npm test
```

Symlink installs follow the working tree automatically.

## Uninstall

Remove plugin install directories:

```bash
rm -rf ~/.claude/skills/autopraxis
rm -rf ~/.codex/plugins/autopraxis
rm -rf ~/.mewrite/plugins/Zhachory1/autopraxis
```

For Codex, also remove the `autopraxis` entry from `~/.agents/plugins/marketplace.json` if the installer added it.

For legacy direct skill installs, remove the installed skill directories from the target skill directory.

## Optional Integrations

Autopraxis works without these, but skills become stronger when they are available.

| Integration | Purpose | How Skills Use It |
|---|---|---|
| `AGENT_FLEET_HOME` | Locate `agent-fleet` | `/council`, `/ship`, personas, journals, transcripts |
| long-term memory MCP / `gbrain` | Recall prior context | decisions, plans, incidents, session notes, retros |
| code RAG / repo-index / `coderag` | Understand codebases | semantic code search, dependency graph, ownership, similar changes |
| `.workflow-runs/<run-id>/telemetry.jsonl` | Backprop data | latency, cost, loops, validation, human edits, outcomes |

Default agent-fleet hint in the manifests is `/Users/zhach/code/agent-fleet`. Treat it as optional local guidance, not a hard dependency.

## Validation

```bash
npm test
node bin/autopraxis.mjs validate-package
npm pack --dry-run
```

Validation checks:

- native Claude/Codex/Me Write plugin manifests.
- skill frontmatter and required sections.
- workflow connective-skill references.
- structured-doc companion templates.
- cross-runtime manifest coverage.
- package excludes for local/private/generated data.
- markdown relative links.
- plugin-root and skill-directory smoke installs into temp directories.

## Distribution

Do not publish to npm, a Claude marketplace, Codex marketplace, or Me Write marketplace until plugin format and install flows are validated with real agent runtimes.
