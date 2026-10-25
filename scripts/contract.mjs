// Shared colour math and the explainer token contract.
// The pair list and the readability nudge match the explainer scripts
// (scripts/sync-themes and scripts/check) that bake kit/themes.js today.
// Page checks from that script are not here.

export const MODE = ['bg-accent', 'card', 'text', 'text-strong', 'muted', 'border', 'border-strong', 'ring', 'accent', 'accent-subtle', 'on-accent', 'accent-2', 'accent-2-subtle', 'series-1', 'series-2', 'series-3', 'series-4', 'series-5', 'shadow-md', 'shadow-lg'];
export const SHAPE = ['radius-sm', 'radius-md', 'radius-lg', 'radius-full', 'font-body', 'font-display', 'font-mono'];
export const KEYS = ['stock', 'conf', 'exp', 'ours', 'risk', 'outside'];

// [name, foreground, surface layers bottom-first, minimum].
// 4.5 for text, 3 for marks. Same pairs as the explainer page check.
export const PAIRS = [
  ['text on page', 'text', ['bg-accent'], 4.5],
  ['text on card', 'text', ['card'], 4.5],
  ['strong on card', 'text-strong', ['card'], 4.5],
  ['strong on page', 'text-strong', ['bg-accent'], 4.5],
  ['muted on card', 'muted', ['card'], 4.5],
  ['muted on page', 'muted', ['bg-accent'], 4.5],
  ['strong on key box', 'text-strong', ['card', 'accent-subtle'], 4.5],
  ['muted on key box', 'muted', ['card', 'accent-subtle'], 4.5],
  ['strong on alt box', 'text-strong', ['card', 'accent-2-subtle'], 4.5],
  ['muted on alt box', 'muted', ['card', 'accent-2-subtle'], 4.5],
  ['accent label on card', 'accent', ['card'], 4.5],
  ['accent label on page', 'accent', ['bg-accent'], 4.5],
  ['ink on accent', 'on-accent', ['card', 'accent'], 4.5],
  ['card on strong (pressed)', 'card', ['text-strong'], 4.5],
  ['steel mark on card', 'accent-2', ['card'], 3],
  ['focus ring on card', 'ring', ['card'], 3],
  ...[1, 2, 3, 4, 5].map((i) => [`series-${i} on card`, `series-${i}`, ['card'], 3]),
];

export function parse(v) {
  v = String(v).trim();
  let m = v.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) / 255 : 1);
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]];
  m = v.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (m) {
    const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : +m[1];
    const C = +m[2];
    const h = +m[3] * Math.PI / 180;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    const lin = [
      4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * s,
    ];
    const rgb = lin.map((c) => {
      c = Math.min(1, Math.max(0, c));
      return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
    });
    return rgb.concat(m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]);
  }
  throw new Error(`cannot read colour "${v}"`);
}

export const hex = (c) => '#' + c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
export const over = (top, under) => {
  const t = parse(top);
  const u = parse(under);
  return hex(t.slice(0, 3).map((c, i) => c * t[3] + u[i] * (1 - t[3])));
};
export const alpha = (c, a) => {
  const p = parse(c);
  return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${+(p[3] * a).toFixed(3)})`;
};
export const mix = (a, pct, b) => {
  const x = parse(a);
  const y = parse(b);
  return hex(x.map((c, i) => c * pct / 100 + y[i] * (1 - pct / 100)));
};
export function lum(c) {
  return parse(c).slice(0, 3).map((x) => {
    x /= 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  }).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function readable(color, surfaces, target) {
  const solid = surfaces.map((s) => over(s, '#ffffff'));
  const ok = (c) => solid.every((s) => contrast(over(c, s), s) >= target);
  if (ok(color)) return color;
  const toward = lum(solid[0]) > 0.179 ? [0, 0, 0] : [255, 255, 255];
  const from = parse(over(color, solid[0]));
  for (let pct = 2; pct <= 100; pct += 2) {
    const c = hex(from.map((x, i) => (i < 3 ? x + (toward[i] - x) * pct / 100 : 1)));
    if (ok(c)) return c;
  }
  return hex(toward);
}

export const ink = (fill) => (contrast('#000000', fill) >= contrast('#ffffff', fill) ? '#000000' : '#ffffff');

export function nudge(tokens) {
  const t = { ...tokens };
  const keyBox = over(t['accent-subtle'], t.card);
  const altBox = over(t['accent-2-subtle'], t.card);
  t.muted = readable(t.muted, [t.card, t['bg-accent'], keyBox, altBox], 4.5);
  t.text = readable(t.text, [t.card, t['bg-accent']], 4.5);
  t.accent = readable(t.accent, [t.card, t['bg-accent']], 4.5);
  t['accent-2'] = readable(t['accent-2'], [t.card], 3);
  t.ring = readable(t.ring, [t.card], 3);
  if (contrast(t['on-accent'], over(t.accent, t.card)) < 4.5) t['on-accent'] = ink(over(t.accent, t.card));
  for (let i = 1; i <= 5; i++) t['series-' + i] = readable(t['series-' + i], [t.card], 3);
  return t;
}

export function cssBlocks(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('{', i);
    if (open < 0) break;
    let depth = 1;
    let j = open + 1;
    while (j < text.length && depth) {
      if (text[j] === '{') depth += 1;
      else if (text[j] === '}') depth -= 1;
      j += 1;
    }
    const selector = text.slice(i, open).replace(/\s+/g, ' ').trim();
    const body = text.slice(open + 1, j - 1);
    blocks.push({ selector, body });
    i = j;
  }
  return blocks;
}

export function decls(body) {
  const out = {};
  body.replace(/--([\w-]+)\s*:\s*([^;]+);/g, (m, k, v) => { out[k] = v.trim(); });
  return out;
}

function blockProps(css, predicate) {
  const out = {};
  for (const block of cssBlocks(css)) {
    if (predicate(block.selector)) Object.assign(out, decls(block.body));
  }
  return out;
}

export function lightProps(css) {
  return blockProps(css, (selector) => selector.split(',').some((part) => part.trim() === ':root'));
}

export function darkProps(css) {
  return blockProps(css, (selector) => selector.split(',').some((part) => part.trim() === ':root[data-theme="dark"]'));
}

export function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (!(key in obj)) throw new Error(`missing --${key}`);
    out[key] = obj[key];
  }
  return out;
}

const ARC_SHADOW = {
  light: {
    'shadow-md': '0 4px 12px rgba(0,0,0,.06)',
    'shadow-lg': '0 12px 28px rgba(0,0,0,.08)',
  },
  dark: {
    'shadow-md': '0 4px 16px rgba(0,0,0,.5)',
    'shadow-lg': '0 12px 32px rgba(0,0,0,.6)',
  },
};

export function shadcnMode(v) {
  return {
    'bg-accent': v.background,
    card: v.card,
    text: v['card-foreground'],
    'text-strong': v.foreground,
    muted: v['muted-foreground'],
    border: v.border,
    'border-strong': mix(over(v.foreground, '#ffffff'), 28, over(v.card, '#ffffff')),
    ring: v.ring,
    accent: v.primary,
    'accent-subtle': alpha(v.primary, 0.1),
    'on-accent': v['primary-foreground'],
    'accent-2': v['chart-3'],
    'accent-2-subtle': alpha(v['chart-3'], 0.12),
    'series-1': v.primary,
    'series-2': v['chart-2'],
    'series-3': v['chart-3'],
    'series-4': v['chart-4'],
    'series-5': v['chart-5'],
  };
}

export function shadcnShape(light) {
  return {
    'radius-sm': light['radius-sm'],
    'radius-md': light['radius-md'],
    'radius-lg': light['radius-lg'],
    'radius-full': '9999px',
    'font-body': light['font-sans'],
    'font-display': light['font-heading'] || light['font-sans'],
    'font-mono': '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace',
  };
}

export function flowMode(tokens) {
  return {
    'bg-accent': tokens['t-bg'],
    card: tokens['t-paper'],
    text: tokens['t-text'],
    'text-strong': tokens['t-strong'],
    muted: tokens['t-dim'],
    border: tokens['t-brd'],
    'border-strong': tokens['t-brd-hi'],
    ring: tokens['t-ring'],
    accent: tokens['t-primary'],
    'accent-subtle': tokens['t-accent-bg'],
    'on-accent': tokens['t-on-primary'],
    'accent-2': tokens['t-mute'],
    'accent-2-subtle': alpha(tokens['t-mute'], 0.1),
    'series-1': tokens['t-primary'],
    'series-2': tokens['t-success'],
    'series-3': tokens['t-warn'],
    'series-4': tokens['t-accent-brd'],
    'series-5': tokens['t-mute'],
    'shadow-md': tokens['t-shadow'],
    'shadow-lg': tokens['t-shadow'],
  };
}

export function flowShape(light) {
  const radius = parseFloat(light['t-radius']);
  return {
    'radius-sm': `${Math.min(radius, 4)}px`,
    'radius-md': light['t-radius'],
    'radius-lg': light['t-radius-lg'],
    'radius-full': '9999px',
    'font-body': light['t-body'],
    'font-display': light['t-display'],
    'font-mono': light['t-data'],
  };
}

export function deriveContract(kind, css) {
  if (kind === 'tokens') {
    const light = lightProps(css);
    const dark = darkProps(css);
    return { light: pick(light, MODE), dark: pick(dark, MODE), shape: pick(light, SHAPE) };
  }
  if (kind === 'shadcn') {
    const light = lightProps(css);
    const dark = darkProps(css);
    return {
      light: { ...nudge(shadcnMode(light)), ...ARC_SHADOW.light },
      dark: { ...nudge(shadcnMode({ ...light, ...dark })), ...ARC_SHADOW.dark },
      shape: shadcnShape(light),
    };
  }
  if (kind === 'flow') {
    const light = lightProps(css);
    const dark = darkProps(css);
    return {
      light: nudge(flowMode(light)),
      dark: nudge(flowMode(dark)),
      shape: flowShape(light),
    };
  }
  throw new Error(`unknown contract kind "${kind}"`);
}

export function pairRatio(tokens, name, layers) {
  const flat = layers.reduce((under, key) => {
    const c = parse(tokens[key]);
    return c.slice(0, 3).map((x, i) => x * c[3] + under[i] * (1 - c[3])).concat(1);
  }, [255, 255, 255, 1]);
  const bg = hex(flat);
  const fg = parse(tokens[name]);
  const top = hex(fg.slice(0, 3).map((x, i) => x * fg[3] + flat[i] * (1 - fg[3])));
  return contrast(top, bg);
}

export function keyProps(css) {
  return {
    light: Object.fromEntries(KEYS.map((k) => [k, lightProps(css)[`key-${k}`]])),
    dark: Object.fromEntries(KEYS.map((k) => [k, darkProps(css)[`key-${k}`]])),
  };
}
