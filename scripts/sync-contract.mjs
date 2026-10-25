// Rewrite themes/<slug>/contract.json from tokens.css. Run this after a token
// change, then scripts/check. Do not edit contract.json by hand.
import { writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveContract } from './contract.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const slug of readdirSync(join(root, 'themes')).sort()) {
  const dir = join(root, 'themes', slug);
  const themePath = join(dir, 'theme.json');
  if (!existsSync(themePath)) continue;
  const theme = JSON.parse(readFileSync(themePath, 'utf8'));
  const css = readFileSync(join(dir, 'tokens.css'), 'utf8');
  const contract = deriveContract(theme.contractFrom, css);
  writeFileSync(join(dir, 'contract.json'), JSON.stringify(contract, null, 2) + '\n');
  console.log(`themes/${slug}/contract.json`);
}
