#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'autopraxis.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const [, , command, ...args] = process.argv;

function usage(exitCode = 0) {
  const targets = Object.entries(manifest.installTargets)
    .map(([name, target]) => `  ${name.padEnd(16)} ${target.defaultDestination} — ${target.description}`)
    .join('\n');

  console.log(`Autopraxis ${manifest.version}

Usage:
  autopraxis install --target <target> [--dest <path>] [--link] [--force] [--dry-run]
  autopraxis validate-package
  autopraxis list-targets

Targets:
${targets}

Examples:
  autopraxis install --target mewrite
  autopraxis install --target claude-code --dest ~/.claude/skills
  autopraxis install --target generic-markdown --dest ./autopraxis-prompts
`);
  process.exit(exitCode);
}

function parseOptions(values) {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) throw new Error(`Unexpected argument: ${value}`);
    const [rawKey, inlineValue] = value.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (['link', 'force', 'dryRun', 'help'].includes(key)) {
      options[key] = true;
    } else {
      const next = inlineValue ?? values[index + 1];
      if (!next || next.startsWith('--')) throw new Error(`Missing value for --${rawKey}`);
      options[key] = next;
      if (inlineValue === undefined) index += 1;
    }
  }
  return options;
}

function expandHome(path) {
  if (!path) return path;
  if (path === '~') return os.homedir();
  if (path.startsWith('~/')) return join(os.homedir(), path.slice(2));
  return path;
}

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

async function copyOrLinkSkill(skill, destination, options) {
  const source = join(root, skill.path);
  const target = join(destination, skill.name);
  if (options.dryRun) return { skill: skill.name, target, action: options.link ? 'link' : 'copy' };
  if (options.force) await rm(target, { recursive: true, force: true });
  if (existsSync(target) && !options.force) throw new Error(`${target} already exists; pass --force to replace it`);
  await mkdir(dirname(target), { recursive: true });
  if (options.link) await symlink(source, target, 'dir');
  else await cp(source, target, { recursive: true, errorOnExist: true, force: false });
  return { skill: skill.name, target, action: options.link ? 'linked' : 'copied' };
}

async function writeBundleIndex(destination, targetName, options) {
  const lines = [
    '# Autopraxis Prompt Bundle',
    '',
    `Target: ${targetName}`,
    `Version: ${manifest.version}`,
    '',
    'Use each skill directory as a standalone workflow prompt. Native skill runtimes should read each `SKILL.md`; generic agents can paste the relevant file plus companion references.',
    '',
    '## Skills',
    '',
    ...manifest.skills.map((skill) => `- [${skill.name}](./${skill.name}/SKILL.md) — ${skill.kind}`),
    '',
    '## Optional Integrations',
    '',
    ...manifest.optionalIntegrations.map((integration) => `- ${integration.name}`),
    '',
  ];
  if (!options.dryRun) await writeFile(join(destination, 'AUTOPRAXIS.md'), lines.join('\n'));
}

async function writeInstallRecord(destination, targetName, options) {
  if (options.dryRun) return;
  await writeFile(
    join(destination, '_autopraxis-plugin.json'),
    `${JSON.stringify({ installedAt: new Date().toISOString(), target: targetName, version: manifest.version, skills: manifest.skills.map((skill) => skill.name) }, null, 2)}\n`,
  );
}

async function install(values) {
  const options = parseOptions(values);
  if (options.help) usage();
  const targetName = options.target;
  if (!targetName) throw new Error('Missing --target');
  const target = manifest.installTargets[targetName];
  if (!target) throw new Error(`Unknown target: ${targetName}`);
  const destination = resolve(expandHome(options.dest ?? target.defaultDestination));

  if (!options.dryRun) await mkdir(destination, { recursive: true });
  const results = [];
  for (const skill of manifest.skills) results.push(await copyOrLinkSkill(skill, destination, options));
  await writeInstallRecord(destination, targetName, options);
  if (target.layout === 'markdown-bundle') await writeBundleIndex(destination, targetName, options);

  console.log(`${options.dryRun ? 'Would install' : 'Installed'} ${results.length} Autopraxis skills to ${destination}`);
  for (const result of results) console.log(`- ${result.skill}: ${result.action} -> ${result.target}`);
}

async function validatePackage() {
  const failures = [];
  for (const skill of manifest.skills) {
    const skillDir = join(root, skill.path);
    const skillFile = join(skillDir, 'SKILL.md');
    if (!existsSync(skillFile)) failures.push(`${skill.name}: missing SKILL.md`);
    const files = existsSync(skillDir) ? await listFiles(skillDir) : [];
    if (!files.length) failures.push(`${skill.name}: no package files found`);
  }
  for (const exclude of ['.git/**', 'node_modules/**', '.workflow-runs/**', '.env']) {
    if (!manifest.package.exclude.includes(exclude)) failures.push(`manifest package.exclude missing ${exclude}`);
  }
  if (failures.length) {
    console.error('Package validation failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`Package manifest valid: ${manifest.skills.length} skills, ${Object.keys(manifest.installTargets).length} install targets.`);
}

if (!command || ['help', '--help', '-h'].includes(command)) usage();

try {
  if (command === 'install') await install(args);
  else if (command === 'validate-package') await validatePackage();
  else if (command === 'list-targets') {
    for (const [name, target] of Object.entries(manifest.installTargets)) console.log(`${name}\t${target.defaultDestination}\t${target.description}`);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(`autopraxis: ${error.message}`);
  process.exit(1);
}
