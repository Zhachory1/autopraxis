# Release Process

Autopraxis releases are lightweight, GitHub-first, and validation-gated.

## Version Policy

Use SemVer-style versions:

- `PATCH` for docs, template, validation, installer, or compatibility fixes.
- `MINOR` for new workflows, skills, install targets, or reusable reference packs.
- `MAJOR` for breaking skill layout, manifest, installer, telemetry, or workflow contract changes.

Before `1.0.0`, minor versions may still change APIs, but breaking changes must be called out in the release notes.

## Release Artifacts

Every release should include:

- `CHANGELOG.md` entry.
- `releases/vX.Y.Z.md` GitHub release notes.
- version updates in:
  - `package.json`
  - `autopraxis.json`
  - `.claude-plugin/plugin.json`
  - `.codex-plugin/plugin.json`
  - `.cave-plugin/plugin.json`
- passing validation output.
- annotated git tag `vX.Y.Z`.
- GitHub release attached to the tag.

## Validation Gate

Run before tagging:

```bash
npm test
node bin/autopraxis.mjs list-targets
npm exec -- agent-fleet --version
npm exec -- agent-fleet home
npm pack --dry-run
```

For install changes, verify current local-checkout paths first:

```bash
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate . --strict
claude plugin marketplace add ./ --scope local
claude plugin list --available --json
```

Then smoke-test fallback installs into temp paths only:

```bash
node bin/autopraxis.mjs install --target claude-plugin --dest /tmp/autopraxis-claude-plugin --force
node bin/autopraxis.mjs install --target codex-plugin --dest /tmp/autopraxis-codex-plugin --marketplace-dest /tmp/autopraxis-marketplace.json --force
HOME=/tmp/autopraxis-opencode-home node bin/autopraxis.mjs install --target opencode-skills --force
HOME=/tmp/autopraxis-opencode-home XDG_CONFIG_HOME=/tmp/autopraxis-opencode-home/.config XDG_DATA_HOME=/tmp/autopraxis-opencode-home/.local/share XDG_CACHE_HOME=/tmp/autopraxis-opencode-home/.cache opencode debug skill --pure
node bin/autopraxis.mjs install --target mewrite-skills --dest /tmp/autopraxis-skills --force
rm -rf /tmp/autopraxis-claude-plugin /tmp/autopraxis-codex-plugin /tmp/autopraxis-marketplace.json /tmp/autopraxis-opencode-home /tmp/autopraxis-skills
```

For post-publish install docs, record evidence before moving `npx autopraxis@latest` or remote marketplace commands into the current quickstart:

```bash
npm view autopraxis version
npx autopraxis@latest list-targets
claude plugin marketplace add Zhachory1/autopraxis --scope local
claude plugin list --available --json
```

If npm or remote marketplace verification fails, keep those commands under `Post-publish install` only.

## Release Steps

**Prepare release docs.** Update `CHANGELOG.md` and add `releases/vX.Y.Z.md`.

**Bump versions.** Keep `package.json`, `autopraxis.json`, and plugin manifests in sync.

**Validate.** Run the validation gate and fix failures before continuing.

**Merge to main.** Release tags must point at `main`, not a feature branch.

**Tag.** Create an annotated tag:

```bash
git switch main
git pull --ff-only origin main
git tag -a vX.Y.Z -m "Autopraxis vX.Y.Z"
git push origin vX.Y.Z
```

**Create GitHub release.** Use the release notes file:

```bash
gh release create vX.Y.Z --repo Zhachory1/autopraxis --title "Autopraxis vX.Y.Z" --notes-file releases/vX.Y.Z.md
```

## Current Publishing Policy

Do not publish to npm yet, even though package metadata is publish-ready for `npx autopraxis@latest ...`. Publish only after post-publish install docs are verified with real Claude, Codex, OpenCode, and Me Write runtimes.

Do not move npm or remote marketplace commands into current quickstarts until verification evidence is recorded in release notes.

Do not publish to Claude, Codex, Me Write, or OpenCode marketplaces yet. Native plugin manifests are included for local/plugin-dir installs and future marketplace work.

## Rollback

If a release is bad:

- mark the GitHub release as pre-release or add a warning note.
- ship a patch release with the fix.
- avoid deleting tags unless no one could have consumed the release yet.
- document the issue and fix in `CHANGELOG.md`.
