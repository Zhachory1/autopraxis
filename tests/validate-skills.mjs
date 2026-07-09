import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const skillsDir = join(root, 'skills');
const workflowSkills = new Set([
  'dev-workflow',
  'ml-experiments',
  'pr-review',
  'debug-investigation',
  'project-ideation',
  'roadmapping',
  'backprop',
]);
const sharedSkillNames = [
  'grounding-brief',
  'council-review',
  'success-criteria-metrics',
  'task-decomposition-planning',
  'hypothesis-testing',
  'structured-doc-authoring',
  'handoff-packaging',
  'human-approval-gate',
  'run-telemetry',
];
const requiredDocReferenceFiles = [
  'references/standards.md',
  'references/templates/prd-template.md',
  'references/templates/design-doc-template.md',
  'references/templates/technical-plan-template.md',
  'references/templates/adr-template.md',
  'references/templates/roadmap-template.md',
  'references/templates/rca-template.md',
];

const failures = [];

async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolutePath, relativePath));
    else files.push(relativePath);
  }
  return files;
}

const dirs = (await readdir(skillsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (dirs.length < 16) failures.push(`expected at least 16 skills, found ${dirs.length}`);

for (const dir of dirs) {
  const file = join(skillsDir, dir, 'SKILL.md');
  const text = await readFile(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    failures.push(`${dir}: missing YAML frontmatter`);
    continue;
  }

  const frontmatter = match[1];
  const body = text.slice(match[0].length);
  const name = frontmatter.match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const description = frontmatter.match(/^description:\s*"([\s\S]*?)"\s*$/m)?.[1];

  if (name !== dir) failures.push(`${dir}: frontmatter name ${name ?? '<missing>'} does not match directory`);
  if (!description) failures.push(`${dir}: missing quoted description`);
  if (description && description.length > 1024) failures.push(`${dir}: description exceeds 1024 chars (${description.length})`);
  if (!body.includes('## Self-Improvement')) failures.push(`${dir}: missing Self-Improvement section`);
  if (/^\s*\d+[.)]\s+/m.test(body)) failures.push(`${dir}: ordered-list prose found; use bullets/bold headers`);
  if (!body.includes('run-telemetry')) failures.push(`${dir}: missing run-telemetry integration`);
}

for (const dir of workflowSkills) {
  const text = await readFile(join(skillsDir, dir, 'SKILL.md'), 'utf8');
  for (const token of ['grounding-brief', 'handoff-packaging', 'human-approval-gate']) {
    if (!text.includes(token)) failures.push(`${dir}: missing workflow connective skill ${token}`);
  }
  if (!text.includes('Loop Controls')) failures.push(`${dir}: missing Loop Controls section`);
}

const dev = await readFile(join(skillsDir, 'dev-workflow', 'SKILL.md'), 'utf8');
for (const token of ['council-review', 'ship', 'code-reviewer', 'PRD', 'DD']) {
  if (!dev.includes(token)) failures.push(`dev-workflow: missing ${token}`);
}

const backprop = await readFile(join(skillsDir, 'backprop', 'SKILL.md'), 'utf8');
for (const token of ['long-term memory MCP', 'code RAG', 'agent-fleet', 'A/B', 'promote-or-rollback']) {
  if (!backprop.includes(token)) failures.push(`backprop: missing ${token}`);
}

const council = await readFile(join(skillsDir, 'council-review', 'SKILL.md'), 'utf8');
for (const token of ['AGENT_FLEET_HOME', '/Users/zhach/code/agent-fleet', 'pass-with-nits', 'block']) {
  if (!council.includes(token)) failures.push(`council-review: missing ${token}`);
}

const docSkill = await readFile(join(skillsDir, 'structured-doc-authoring', 'SKILL.md'), 'utf8');
for (const token of ['references/standards.md', 'prd-template.md', 'design-doc-template.md', 'technical-plan-template.md', 'adr-template.md', 'roadmap-template.md', 'rca-template.md', 'Mermaid', 'Graphviz/DOT']) {
  if (!docSkill.includes(token)) failures.push(`structured-doc-authoring: missing reference to ${token}`);
}

for (const relativePath of requiredDocReferenceFiles) {
  const text = await readFile(join(skillsDir, 'structured-doc-authoring', relativePath), 'utf8');
  if (text.length < 1000) failures.push(`structured-doc-authoring: ${relativePath} looks too small`);
}

const standards = await readFile(join(skillsDir, 'structured-doc-authoring', 'references/standards.md'), 'utf8');
for (const token of ['SPADE', 'Evidence Standard', 'Review Gate Standard', 'Diagram Standard', 'Mermaid', 'Graphviz/DOT', 'PRD', 'Roadmap', 'RCA']) {
  if (!standards.includes(token)) failures.push(`structured-doc-authoring standards: missing ${token}`);
}

for (const relativePath of requiredDocReferenceFiles) {
  const text = await readFile(join(skillsDir, 'structured-doc-authoring', relativePath), 'utf8');
  if (!text.includes('Mermaid') && !text.includes('mermaid')) failures.push(`structured-doc-authoring: ${relativePath} missing Mermaid guidance`);
  if (!text.includes('Graphviz') && !text.includes('dot')) failures.push(`structured-doc-authoring: ${relativePath} missing Graphviz/DOT guidance`);
}

const manifest = JSON.parse(await readFile(join(root, 'autopraxis.json'), 'utf8'));
if (manifest.name !== 'autopraxis') failures.push('manifest: name must be autopraxis');
const manifestSkillNames = manifest.skills.map((skill) => skill.name).sort();
if (JSON.stringify(manifestSkillNames) !== JSON.stringify(dirs)) {
  failures.push(`manifest: skill list does not match skills directory (${manifestSkillNames.join(',')} vs ${dirs.join(',')})`);
}
for (const skill of manifest.skills) {
  if (!existsSync(join(root, skill.path, 'SKILL.md'))) failures.push(`manifest: ${skill.name} path missing SKILL.md`);
  if (!['workflow', 'shared'].includes(skill.kind)) failures.push(`manifest: ${skill.name} has invalid kind ${skill.kind}`);
}
for (const target of ['claude-plugin', 'codex-plugin', 'mewrite-plugin', 'mewrite-skills', 'claude-skills', 'codex-skills', 'generic-markdown', 'cursor-rules', 'windsurf-rules']) {
  if (!manifest.installTargets[target]) failures.push(`manifest: missing install target ${target}`);
}
for (const [runtime, manifestPath] of Object.entries(manifest.standardPluginManifests ?? {})) {
  if (!existsSync(join(root, manifestPath))) failures.push(`manifest: missing ${runtime} plugin manifest at ${manifestPath}`);
}
const claudePlugin = JSON.parse(await readFile(join(root, '.claude-plugin/plugin.json'), 'utf8'));
if (claudePlugin.name !== 'autopraxis') failures.push('claude plugin manifest: name must be autopraxis');
const codexPlugin = JSON.parse(await readFile(join(root, '.codex-plugin/plugin.json'), 'utf8'));
if (codexPlugin.name !== 'autopraxis') failures.push('codex plugin manifest: name must be autopraxis');
if (codexPlugin.skills !== './skills/') failures.push('codex plugin manifest: skills must be ./skills/');
const cavePlugin = JSON.parse(await readFile(join(root, '.cave-plugin/plugin.json'), 'utf8'));
if (cavePlugin.capabilities?.skills !== true) failures.push('cave plugin manifest: capabilities.skills must be true');
const codexMarketplace = JSON.parse(await readFile(join(root, '.agents/plugins/marketplace.json'), 'utf8'));
if (!codexMarketplace.plugins?.some((plugin) => plugin.name === 'autopraxis')) failures.push('codex marketplace: missing autopraxis entry');
for (const integration of ['agent-fleet', 'long-term-memory-mcp', 'code-rag', 'run-telemetry']) {
  if (!manifest.optionalIntegrations.some((item) => item.name === integration)) failures.push(`manifest: missing optional integration ${integration}`);
}
for (const exclude of ['.git/**', 'node_modules/**', '.workflow-runs/**', '.env']) {
  if (!manifest.package.exclude.includes(exclude)) failures.push(`manifest package.exclude missing ${exclude}`);
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (packageJson.bin?.autopraxis !== 'bin/autopraxis.mjs') failures.push('package.json: missing autopraxis bin');
for (const file of ['.agents/plugins/marketplace.json', '.cave-plugin/', '.claude-plugin/', '.codex-plugin/', 'README.md', 'INSTALL.md', 'CHANGELOG.md', 'RELEASE.md', 'autopraxis.json', 'assets/', 'bin/', 'examples/', 'releases/', 'skills/']) {
  if (!packageJson.files.includes(file)) failures.push(`package.json: files missing ${file}`);
}

const markdownFiles = [
  'README.md',
  'INSTALL.md',
  'CHANGELOG.md',
  'RELEASE.md',
  ...await listFiles(skillsDir, 'skills').then((files) => files.filter((file) => file.endsWith('.md'))),
  ...await listFiles(join(root, 'examples'), 'examples').then((files) => files.filter((file) => file.endsWith('.md'))),
  ...await listFiles(join(root, 'releases'), 'releases').then((files) => files.filter((file) => file.endsWith('.md'))),
];
for (const relativeFile of markdownFiles) {
  const text = await readFile(join(root, relativeFile), 'utf8');
  const linkPattern = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const rawTarget = match[1].split('#')[0].trim();
    if (!rawTarget || rawTarget.startsWith('<') || rawTarget.includes(' ')) continue;
    const target = normalize(join(root, dirname(relativeFile), rawTarget));
    if (!target.startsWith(normalize(root))) failures.push(`${relativeFile}: link escapes repo: ${match[1]}`);
    else if (!existsSync(target)) failures.push(`${relativeFile}: broken relative link ${match[1]}`);
  }
}

const packageValidation = spawnSync(process.execPath, ['bin/autopraxis.mjs', 'validate-package'], { cwd: root, encoding: 'utf8' });
if (packageValidation.status !== 0) failures.push(`validate-package failed: ${packageValidation.stderr || packageValidation.stdout}`);

const skillInstallRoot = await mkdtemp(join(tmpdir(), 'autopraxis-skills-install-'));
try {
  const install = spawnSync(process.execPath, ['bin/autopraxis.mjs', 'install', '--target', 'mewrite-skills', '--dest', skillInstallRoot], { cwd: root, encoding: 'utf8' });
  if (install.status !== 0) failures.push(`skill install smoke failed: ${install.stderr || install.stdout}`);
  for (const dir of dirs) {
    if (!existsSync(join(skillInstallRoot, dir, 'SKILL.md'))) failures.push(`skill install smoke missing ${dir}/SKILL.md`);
  }
  for (const relativePath of requiredDocReferenceFiles) {
    if (!existsSync(join(skillInstallRoot, 'structured-doc-authoring', relativePath))) failures.push(`skill install smoke missing structured-doc-authoring/${relativePath}`);
  }
  if (!existsSync(join(skillInstallRoot, '_autopraxis-plugin.json'))) failures.push('skill install smoke missing _autopraxis-plugin.json');
} finally {
  await rm(skillInstallRoot, { recursive: true, force: true });
}

const pluginInstallRoot = await mkdtemp(join(tmpdir(), 'autopraxis-plugin-install-'));
try {
  const claudeDest = join(pluginInstallRoot, 'claude-plugin');
  const codexDest = join(pluginInstallRoot, 'codex-plugin');
  const marketplaceDest = join(pluginInstallRoot, 'agents', 'plugins', 'marketplace.json');
  const claudeInstall = spawnSync(process.execPath, ['bin/autopraxis.mjs', 'install', '--target', 'claude-plugin', '--dest', claudeDest], { cwd: root, encoding: 'utf8' });
  if (claudeInstall.status !== 0) failures.push(`claude plugin install smoke failed: ${claudeInstall.stderr || claudeInstall.stdout}`);
  if (!existsSync(join(claudeDest, '.claude-plugin/plugin.json'))) failures.push('claude plugin install smoke missing .claude-plugin/plugin.json');
  if (!existsSync(join(claudeDest, 'assets/autopraxis.png'))) failures.push('claude plugin install smoke missing assets/autopraxis.png');
  if (!existsSync(join(claudeDest, 'skills/dev-workflow/SKILL.md'))) failures.push('claude plugin install smoke missing skills/dev-workflow/SKILL.md');

  const codexInstall = spawnSync(process.execPath, ['bin/autopraxis.mjs', 'install', '--target', 'codex-plugin', '--dest', codexDest, '--marketplace-dest', marketplaceDest], { cwd: root, encoding: 'utf8' });
  if (codexInstall.status !== 0) failures.push(`codex plugin install smoke failed: ${codexInstall.stderr || codexInstall.stdout}`);
  if (!existsSync(join(codexDest, '.codex-plugin/plugin.json'))) failures.push('codex plugin install smoke missing .codex-plugin/plugin.json');
  if (!existsSync(join(codexDest, 'skills/dev-workflow/SKILL.md'))) failures.push('codex plugin install smoke missing skills/dev-workflow/SKILL.md');
  if (!existsSync(marketplaceDest)) failures.push('codex plugin install smoke missing marketplace file');
} finally {
  await rm(pluginInstallRoot, { recursive: true, force: true });
}

if (failures.length) {
  console.error('Skill validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${dirs.length} skills and plugin package.`);
