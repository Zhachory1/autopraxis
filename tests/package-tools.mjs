import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = new URL('..', import.meta.url).pathname;
const failures = [];

const pack = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: root, encoding: 'utf8' });
if (pack.status !== 0) {
  failures.push(`npm pack --dry-run failed: ${pack.stderr || pack.stdout}`);
} else {
  let files = [];
  try {
    const output = JSON.parse(pack.stdout);
    files = output[0]?.files?.map((file) => file.path) ?? [];
  } catch (error) {
    failures.push(`npm pack --dry-run output was not JSON: ${error.message}`);
  }

  for (const required of [
    'package.json',
    'bin/autopraxis.mjs',
    'autopraxis.json',
    '.claude-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.codex-plugin/plugin.json',
    '.cave-plugin/plugin.json',
    '.agents/plugins/marketplace.json',
    'skills/dev-workflow/SKILL.md',
    'skills/run-telemetry/SKILL.md',
    'assets/autopraxis.png',
    'README.md',
    'INSTALL.md',
    'RELEASE.md',
  ]) {
    if (!files.includes(required)) failures.push(`packed package missing ${required}`);
  }
}

const packArtifact = spawnSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' });
if (packArtifact.status !== 0) {
  failures.push(`npm pack failed: ${packArtifact.stderr || packArtifact.stdout}`);
} else {
  let tarball;
  try {
    tarball = JSON.parse(packArtifact.stdout)[0]?.filename;
  } catch (error) {
    failures.push(`npm pack output was not JSON: ${error.message}`);
  }
  if (tarball) {
    const temp = await mkdtemp(join(tmpdir(), 'autopraxis-package-tools-'));
    const tarballPath = join(root, tarball);
    try {
      let install = spawnSync('npm', ['exec', '--yes', '--package', tarballPath, '--', 'autopraxis', 'install', '--target', 'codex-plugin', '--dest', join(temp, 'codex'), '--marketplace-dest', join(temp, 'marketplace.json')], { cwd: root, encoding: 'utf8' });
      if (install.status !== 0) failures.push(`packed codex install failed: ${install.stderr || install.stdout}`);
      if (!existsSync(join(temp, 'codex/.codex-plugin/plugin.json'))) failures.push('packed codex install missing plugin manifest');
      if (!existsSync(join(temp, 'marketplace.json'))) failures.push('packed codex install missing marketplace file');

      install = spawnSync('npm', ['exec', '--yes', '--package', tarballPath, '--', 'autopraxis', 'install', '--target', 'opencode-skills', '--dest', join(temp, 'opencode-skills')], { cwd: root, encoding: 'utf8' });
      if (install.status !== 0) failures.push(`packed opencode-skills install failed: ${install.stderr || install.stdout}`);
      if (!existsSync(join(temp, 'opencode-skills/dev-workflow/SKILL.md'))) failures.push('packed opencode-skills install missing dev-workflow skill');
    } finally {
      await rm(temp, { recursive: true, force: true });
      await rm(tarballPath, { force: true });
    }
  }
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (packageJson.private !== false) failures.push('package.json private must be false for package-runner install');
if (packageJson.publishConfig?.access !== 'public') failures.push('package.json publishConfig.access must be public');
const agentFleetVersion = packageJson.dependencies?.['@zhachory1/agent-fleet'];
if (!agentFleetVersion) failures.push('package.json: missing @zhachory1/agent-fleet dependency');
else if (!/(^|\D)0\.4\.0/.test(agentFleetVersion)) failures.push(`package.json: @zhachory1/agent-fleet must require minimum 0.4.0, got ${agentFleetVersion}`);

const readme = await readFile(join(root, 'README.md'), 'utf8');
const install = await readFile(join(root, 'INSTALL.md'), 'utf8');
for (const [name, text] of [['README.md', readme], ['INSTALL.md', install]]) {
  for (const token of ['Install by runtime', 'Claude Code', 'Codex', 'OpenCode']) {
    if (!text.includes(token)) failures.push(`${name}: missing install docs token ${token}`);
  }
}
for (const token of ['claude plugin marketplace add', 'claude plugin install', 'claude plugin list']) {
  if (!install.includes(token)) failures.push(`INSTALL.md: missing Claude native command ${token}`);
}
for (const token of ['codex /plugins', 'opencode debug skill']) {
  if (!install.includes(token)) failures.push(`INSTALL.md: missing runtime verification command ${token}`);
}
if (install.indexOf('node bin/autopraxis.mjs install') !== -1 && install.indexOf('node bin/autopraxis.mjs install') < install.indexOf('## Local Development Fallback')) {
  failures.push('INSTALL.md: node bin/autopraxis.mjs install must only appear in local development fallback');
}

function assertPostPublishOnly(name, text, token) {
  const tokenIndex = text.indexOf(token);
  if (tokenIndex === -1) return;
  const postPublishIndex = text.indexOf('Post-publish');
  if (postPublishIndex === -1 || tokenIndex < postPublishIndex) failures.push(`${name}: ${token} must only appear under post-publish docs`);
}

for (const [name, text] of [['README.md', readme], ['INSTALL.md', install]]) {
  assertPostPublishOnly(name, text, 'npx autopraxis@latest');
}
assertPostPublishOnly('README.md', readme, 'claude plugin marketplace add Zhachory1/autopraxis');
assertPostPublishOnly('INSTALL.md', install, 'claude plugin marketplace add Zhachory1/autopraxis');

if (failures.length) {
  console.error('Package/tool install validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Package/tool install docs validated.');
