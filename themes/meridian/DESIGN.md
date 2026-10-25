---
name: Meridian
description: Navy, champagne and stone.
colors:
  bg-accent: "#f6f3ef"
  card: "#ffffff"
  text: "#1d3444"
  text-strong: "#13242f"
  muted: "#4d6575"
  border: "#e0dbd1"
  border-strong: "#b8a685"
  ring: "#b08850"
  accent: "#1d3444"
  on-accent: "#f8dfb9"
  accent-2: "#526a7a"
  series-1: "#1d3444"
  series-2: "#22663f"
  series-3: "#8a5a00"
  series-4: "#ae9064"
  series-5: "#526a7a"
  dark-bg-accent: "#14252f"
  dark-card: "#192d3a"
  dark-text: "#ece5d8"
  dark-text-strong: "#fbf4e8"
  dark-muted: "#b9c3c9"
  dark-border: "#2c4555"
  dark-border-strong: "#56707f"
  dark-ring: "#f8dfb9"
  dark-accent: "#f8dfb9"
  dark-on-accent: "#1d3444"
  dark-accent-2: "#a3b2bb"
  dark-series-1: "#f8dfb9"
  dark-series-2: "#86d3a1"
  dark-series-3: "#e7b75c"
  dark-series-5: "#a3b2bb"
typography:
  heading: {fontFamily: "Playfair Display", fontSize: 1.5rem, fontWeight: 400, lineHeight: 2rem}
  card-title: {fontFamily: "Playfair Display", fontSize: 1rem, fontWeight: 400, lineHeight: 1.5rem}
  body: {fontFamily: "Plus Jakarta Sans", fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.25rem}
  label: {fontFamily: "Plus Jakarta Sans", fontSize: 0.75rem, fontWeight: 600, lineHeight: 1rem}
  caption: {fontFamily: "Plus Jakarta Sans", fontSize: 0.75rem, fontWeight: 600, lineHeight: 1rem}
rounded:
  sm: 0px
  md: 0px
  lg: 2px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
---

## Overview

Navy, champagne and stone. Navy carries ink and filled buttons. Champagne is the highlight and, in dark mode, the accent. The page is warm stone and the card is white. Plus Jakarta Sans for reading. Playfair Display at regular weight for titles. Corners are square. For a plain page, load `tokens.css` from this folder and `themes/colour-key.css` beside it. A Flow screen reads the `--t-*` properties in the same file.

## Colors

- The page is `bg-accent`. Cards are `card`. Body text is `text`. Titles are `text-strong`. Helper text is `muted`.
- `accent` is navy in light mode and champagne in dark mode. Use it for the single main action.
- Text on that fill is `on-accent` (champagne on navy, navy on champagne).
- `accent-2` is the quiet blue-grey. Use it for a second mark.
- `series-4` is the champagne edge after the readability nudge. Use the chart tokens for series, never a diagram-key color.
- Diagram boxes use the catalog [diagram colour key](../../docs/diagram-colour-key.md). Draw arrows in `muted`.

## Typography

- Titles: Playfair Display, weight 400. Everything else: Plus Jakarta Sans.
- Labels are 12px, weight 600, uppercase, tracked at 0.16em.
- Code and identifiers: JetBrains Mono.
- Sentence case for sentences and buttons. Uppercase only for those labels.

## Layout

- Card padding is 24px. Leave more air than you think.
- Keep one filled navy button in a view.

## Elevation & Depth

- Shadows are a single soft step (`shadow-md`). Do not stack large drop shadows.
- Do not add a colored left edge to a card.

## Shapes

- Corners are square. Controls and cards use `rounded.md` (0px). A dialog may use `rounded.lg` (2px). Pills are the only full radius, and only for a status word.

## Components

- The main button is `accent` with `on-accent` text. An outlined button uses `border`.
- Focus uses `ring` (champagne).
- A warning surface uses the warning tint and the word "Warning".

## Do's and Don'ts

- Do keep stone pages and white cards.
- Do carry status as a word, never color alone.
- Don't round the corners.
- Don't give a diagram color a second meaning.
- Don't write explanations in a legend. Use one word, with the meaning in a hover and focus tip.
- Don't edit the unprefixed contract properties by hand. Change a `--t-*` value and run `node scripts/sync-contract.mjs`.
