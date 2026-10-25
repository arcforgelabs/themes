// Design-system gate for every theme. A theme change fails this script when
// the explainer token contract is incomplete, a text or mark pair misses
// Web Content Accessibility Guidelines level double A (4.5:1 text, 3:1 marks),
// or the diagram colour key is missing or different from docs/diagram-colour-key.md.
// The explainer's page checks (pop-ups, theme button, sideways scroll, literal
// colours in a page) stay with the explainer. They are not copied here.
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  KEYS, MODE, PAIRS, SHAPE, darkProps, deriveContract, keyProps, lightProps, over, pairRatio,
} from './contract.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const simpleRoot = join(dirname(require.resolve('simple-icons/icons.json')), '..');
const fails = [];
const warns = [];

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

const keyFile = readFileSync(join(root, 'themes/colour-key.css'), 'utf8');
const keyDoc = readFileSync(join(root, 'docs/diagram-colour-key.md'), 'utf8');
const fence = keyDoc.match(/```css\n([\s\S]*?)```/);
if (!fence) fails.push('docs/diagram-colour-key.md has no css sample');
else {
  const fromFile = keyProps(keyFile);
  const fromDoc = keyProps(fence[1]);
  if (!same(fromFile, fromDoc)) fails.push('themes/colour-key.css does not match the sample in docs/diagram-colour-key.md');
  for (const mode of ['light', 'dark']) {
    for (const name of KEYS) {
      if (!fromFile[mode][name]) fails.push(`diagram colour key ${mode} ${name} is missing`);
    }
  }
}

const themes = readdirSync(join(root, 'themes')).filter((name) => existsSync(join(root, 'themes', name, 'theme.json'))).sort();
for (const slug of themes) {
  const dir = join(root, 'themes', slug);
  const theme = readJson(join(dir, 'theme.json'));
  const contractPath = join(dir, 'contract.json');
  if (!existsSync(contractPath)) {
    fails.push(`${slug}: missing contract.json`);
    continue;
  }
  const contract = readJson(contractPath);
  const css = readFileSync(join(dir, 'tokens.css'), 'utf8');
  let expected;
  try {
    expected = deriveContract(theme.contractFrom, css);
  } catch (error) {
    fails.push(`${slug}: ${error.message}`);
    continue;
  }
  if (!same(contract, expected)) fails.push(`${slug}: contract.json is stale (run node scripts/sync-contract.mjs)`);
  for (const key of MODE) {
    if (!contract.light?.[key]) fails.push(`${slug} light: missing ${key}`);
    if (!contract.dark?.[key]) fails.push(`${slug} dark: missing ${key}`);
  }
  for (const key of SHAPE) if (!contract.shape?.[key]) fails.push(`${slug}: missing shape ${key}`);
  for (const mode of ['light', 'dark']) {
    for (const [label, name, layers, min] of PAIRS) {
      try {
        const ratio = pairRatio(contract[mode], name, layers);
        if (ratio < min) fails.push(`${slug} ${mode}: ${label} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
      } catch (error) {
        fails.push(`${slug} ${mode}: ${label}: ${error.message}`);
      }
    }
    const card = contract[mode].card;
    for (const name of KEYS) {
      const swatch = keyProps(keyFile)[mode][name];
      if (!swatch || !card) continue;
      try {
        const surface = over(card, mode === 'light' ? '#ffffff' : '#000000');
        const ratio = pairRatio({ card: surface, swatch }, 'swatch', ['card']);
        if (ratio < 3) warns.push(`${slug} ${mode}: key ${name} on card is ${ratio.toFixed(2)}:1 (a key box also has a word)`);
      } catch (error) {
        fails.push(`${slug} ${mode}: key ${name}: ${error.message}`);
      }
    }
  }
  if (theme.contractFrom !== 'shadcn') {
    const light = lightProps(css);
    const dark = darkProps(css);
    for (const [key, value] of Object.entries(contract.light)) {
      if (light[key] !== value) fails.push(`${slug}: tokens.css light --${key} does not match contract.json`);
    }
    for (const [key, value] of Object.entries(contract.dark)) {
      if (dark[key] !== value) fails.push(`${slug}: tokens.css dark --${key} does not match contract.json`);
    }
    for (const [key, value] of Object.entries(contract.shape)) {
      if (light[key] !== value) fails.push(`${slug}: tokens.css --${key} does not match contract.json`);
    }
  }
  console.log(`checked ${slug}`);
}

const manifest = readJson(join(root, 'logos/manifest.json'));
const installed = JSON.parse(readFileSync(join(simpleRoot, 'package.json'), 'utf8')).version;
if (manifest.simpleIcons !== installed) {
  fails.push(`logos/manifest.json pins Simple Icons ${manifest.simpleIcons}, installed ${installed}`);
}
const lock = readJson(join(root, 'package-lock.json'));
const locked = lock.packages?.['node_modules/simple-icons']?.version;
if (locked !== installed) fails.push(`package-lock.json simple-icons is ${locked}, installed ${installed}`);
const icons = require('simple-icons/icons.json');
const slugs = new Set(icons.map((icon) => icon.slug));
const seen = new Set();
for (const mark of manifest.marks || []) {
  for (const field of ['slug', 'file', 'source', 'fetched', 'terms']) {
    if (!mark[field]) fails.push(`logos mark missing ${field}`);
  }
  if (!mark.slug) continue;
  if (seen.has(mark.slug)) fails.push(`logos mark ${mark.slug} is listed twice`);
  seen.add(mark.slug);
  if (slugs.has(mark.slug)) fails.push(`logos/${mark.slug} duplicates Simple Icons`);
  const file = join(root, 'logos', mark.file || '');
  if (!mark.file || !existsSync(file)) fails.push(`logos mark ${mark.slug} has no file`);
  else if (!readFileSync(file, 'utf8').includes('<svg')) fails.push(`logos/${mark.file} is not an svg mark`);
}
for (const gap of manifest.gaps || []) {
  for (const field of ['slug', 'source', 'fetched', 'terms']) {
    if (!gap[field]) fails.push(`logos gap missing ${field}`);
  }
  if (gap.slug && slugs.has(gap.slug)) fails.push(`logos gap ${gap.slug} is already in Simple Icons`);
}
for (const name of readdirSync(join(root, 'logos'))) {
  if (!name.endsWith('.svg')) continue;
  if (!(manifest.marks || []).some((mark) => mark.file === name)) fails.push(`logos/${name} has no manifest entry`);
}

for (const line of warns) console.log('WARN', line);
for (const line of fails) console.log('FAIL', line);
if (fails.length) process.exit(1);
console.log('design-system: ok');
