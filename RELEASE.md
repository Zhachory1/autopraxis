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
npm pack --dry-run
```

For installer changes, also smoke-test at least one native plugin install and one direct skill install:

```bash
node bin/autopraxis.mjs install --target claude-plugin --dest /tmp/autopraxis-claude-plugin --force
node bin/autopraxis.mjs install --target codex-plugin --dest /tmp/autopraxis-codex-plugin --marketplace-dest /tmp/autopraxis-marketplace.json --force
node bin/autopraxis.mjs install --target mewrite-skills --dest /tmp/autopraxis-skills --force
rm -rf /tmp/autopraxis-claude-plugin /tmp/autopraxis-codex-plugin /tmp/autopraxis-marketplace.json /tmp/autopraxis-skills
```

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

Do not publish to npm yet. `package.json` remains `"private": true` until install flows are validated with real Claude, Codex, and Me Write plugin runtimes.

Do not publish to Claude, Codex, or Me Write marketplaces yet. Native plugin manifests are included for local/plugin-dir installs and future marketplace work.

## Rollback

If a release is bad:

- mark the GitHub release as pre-release or add a warning note.
- ship a patch release with the fix.
- avoid deleting tags unless no one could have consumed the release yet.
- document the issue and fix in `CHANGELOG.md`.
