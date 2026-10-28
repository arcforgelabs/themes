# Diagram colour key

Every Arc Forge diagram uses this key: architecture maps, flow diagrams and component maps, in artifacts, reports, slides and docs. One colour has one meaning on every page. The key is the same in every theme.

## The key

| Colour | Label | Meaning |
| --- | --- | --- |
| Green | Stock | Built into the product. It works this way after install. |
| Blue | Configured | A stock setting that we chose. |
| Yellow | Experimental | Upstream marks it as experimental. |
| Orange | Ours | Our own code or infrastructure. |
| Red | Risk | A danger or a known break. |
| Grey | Outside | Not part of the product. For example people, chat apps or another vendor. |
| Dashed outline | Planned | Not done yet. This is a line style, not a colour. Use it with any colour above. |

## Rules

1. Give each box exactly one colour from the key. A box is never two things at once. If a stock part is also a risk, choose the meaning that the diagram is about, and put the other fact in the box's details.
2. Never give a colour a second meaning. For example, red is risk only. It is never "ours", "failed" or "in progress".
3. Show status in words, never in colour. Put "Done", "Waiting" or "In progress" in the box text or its details.
4. Draw arrows and lines in `muted-foreground`. Arrows do not carry the key.
5. Keep chart bars and data series off the key colours. Use the theme's chart tokens, so a bar never reads as a category.
6. Show only the colours that the diagram uses in its legend.
7. Write each legend label as one word from the table. Put the meaning in a hover and focus tip, not in the legend text.
8. Give the legend a keyboard focus state, so the tip also opens on a tap and from the keyboard.

## Values for standalone HTML

These values have contrast on the Maia Rose surfaces in both modes. Add them next to the theme tokens: the light values on `:root`, and the dark values in both dark blocks.

```css
:root {
  --key-stock: oklch(0.55 0.12 150);
  --key-conf: oklch(0.52 0.12 240);
  --key-exp: oklch(0.64 0.15 90);
  --key-ours: oklch(0.64 0.17 50);
  --key-risk: oklch(0.55 0.22 25);
  --key-outside: oklch(0.60 0.01 60);
}
/* dark, in both @media (prefers-color-scheme: dark) and [data-theme="dark"] */
:root {
  --key-stock: oklch(0.74 0.13 150);
  --key-conf: oklch(0.72 0.12 240);
  --key-exp: oklch(0.86 0.15 95);
  --key-ours: oklch(0.76 0.16 55);
  --key-risk: oklch(0.68 0.21 22);
  --key-outside: oklch(0.70 0.01 60);
}
```

A legend item:

```html
<span class="key" tabindex="0" data-tip="A stock setting that we chose." style="--c: var(--key-conf)">Configured</span>
```

```css
.key { position: relative; cursor: help; }
.key::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; background: var(--c); }
.key:hover::after, .key:focus::after { content: attr(data-tip); position: absolute; left: 0; bottom: calc(100% + 6px); width: max-content; max-width: 240px; padding: 6px 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--card); color: var(--foreground); font-size: 0.8rem; }
```
