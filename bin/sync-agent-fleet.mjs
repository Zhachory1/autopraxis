#!/usr/bin/env node
// Vendor the agent-fleet payload (council + ship skills, personas, ship-agents,
// prompts, lib helpers) into vendor/agent-fleet/ so native git-clone plugin
// installs ship council/ship without an npm install step.
//
// Pins to the version declared in package.json dependencies. Run after bumping
// the @zhachory1/agent-fleet dependency, then commit vendor/agent-fleet/.
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const range = pkg.dependencies?.['@zhachory1/agent-fleet'];
if (!range) throw new Error('package.json missing @zhachory1/agent-fleet dependency');
const version = range.replace(/^[^0-9]*/, '');
const spec = `@zhachory1/agent-fleet@${version}`;
const vendorDir = join(root, 'vendor', 'agent-fleet');

const temp = await mkdtemp(join(tmpdir(), 'agent-fleet-sync-'));
try {
  const pack = spawnSync('npm', ['pack', spec, '--json'], { cwd: temp, encoding: 'utf8' });
  if (pack.status !== 0) throw new Error(`npm pack ${spec} failed: ${pack.stderr || pack.stdout}`);
  const tarball = JSON.parse(pack.stdout)[0].filename;
  const extract = spawnSync('tar', ['-xzf', join(temp, tarball), '-C', temp], { encoding: 'utf8' });
  if (extract.status !== 0) throw new Error(`tar extract failed: ${extract.stderr}`);
  const payload = join(temp, 'package');
  const packed = JSON.parse(await readFile(join(payload, 'package.json'), 'utf8'));
  if (packed.version !== version) throw new Error(`packed version ${packed.version} != pinned ${version}`);

  await rm(vendorDir, { recursive: true, force: true });
  await cp(payload, vendorDir, { recursive: true });
  await writeFile(join(vendorDir, '.pinned-version'), `${version}\n`);
  const entries = (await readdir(vendorDir, { withFileTypes: true })).map((e) => e.name).sort();
  console.log(`Vendored ${spec} into vendor/agent-fleet (${entries.length} entries).`);
  for (const required of ['skills/council/SKILL.md', 'skills/ship/SKILL.md', 'agents', 'ship-agents']) {
    if (!existsSync(join(vendorDir, required))) throw new Error(`vendored payload missing ${required}`);
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}
