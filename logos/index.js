// Logo library. Simple Icons is the source for every mark it has.
// logos/ holds a mark only when Simple Icons lacks it, the file came from
// that vendor's own brand kit, and the manifest records source, fetch date,
// and usage terms.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import manifest from './manifest.json' with { type: 'json' };

const require = createRequire(import.meta.url);
const icons = require('simple-icons/icons.json');
const iconsDir = join(dirname(require.resolve('simple-icons/icons.json')), '..', 'icons');
const bySlug = new Map(icons.map((icon) => [icon.slug, icon]));

export function resolveLogo(slug) {
  const mark = (manifest.marks || []).find((item) => item.slug === slug);
  if (mark) {
    const svg = readFileSync(new URL(mark.file, import.meta.url), 'utf8');
    return { source: 'catalog', slug, svg, terms: mark.terms, fetched: mark.fetched, origin: mark.source };
  }
  const icon = bySlug.get(slug);
  if (icon) {
    const svg = readFileSync(join(iconsDir, `${slug}.svg`), 'utf8');
    return { source: 'simple-icons', slug, title: icon.title, hex: icon.hex, svg };
  }
  const gap = (manifest.gaps || []).find((item) => item.slug === slug);
  if (gap) {
    const error = new Error(`${slug} is not in this catalog. ${gap.terms}`);
    error.gap = gap;
    throw error;
  }
  throw new Error(`${slug} is not in Simple Icons ${manifest.simpleIcons} and has no catalog mark`);
}
