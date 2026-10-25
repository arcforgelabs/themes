---
name: Harbour
description: Teal, mint and cream.
colors:
  bg-accent: "#fdfaf8"
  card: "#fefffe"
  text: "#0d4e5f"
  text-strong: "#0a3c49"
  muted: "#4e6365"
  border: "#dee5e6"
  border-strong: "#8fb7be"
  ring: "#4a7c88"
  accent: "#0d4e5f"
  on-accent: "#fefffe"
  accent-2: "#5d7374"
  series-1: "#0d4e5f"
  series-2: "#22663f"
  series-3: "#8a5a00"
  series-4: "#4a7c88"
  series-5: "#5d7374"
  dark-bg-accent: "#071f26"
  dark-card: "#0c2830"
  dark-text: "#d9e8ea"
  dark-text-strong: "#fefffe"
  dark-muted: "#a5bfc3"
  dark-border: "#1b414b"
  dark-border-strong: "#4a7c88"
  dark-ring: "#8fb7be"
  dark-accent: "#c5feff"
  dark-on-accent: "#0d4e5f"
  dark-accent-2: "#8fb0b5"
  dark-series-1: "#c5feff"
  dark-series-2: "#86d3a1"
  dark-series-3: "#e7b75c"
  dark-series-5: "#8fb0b5"
typography:
  heading: {fontFamily: "Playfair Display", fontSize: 1.5rem, fontWeight: 700, lineHeight: 2rem}
  card-title: {fontFamily: "Playfair Display", fontSize: 1rem, fontWeight: 700, lineHeight: 1.5rem}
  body: {fontFamily: "Nunito Sans", fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.25rem}
  label: {fontFamily: "Nunito Sans", fontSize: 0.75rem, fontWeight: 600, lineHeight: 1rem}
  caption: {fontFamily: "Nunito Sans", fontSize: 0.75rem, fontWeight: 600, lineHeight: 1rem}
rounded:
  sm: 4px
  md: 6px
  lg: 10px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
---

## Overview

Teal, mint and cream. Deep teal carries ink, filled buttons and labels. The page is warm cream and the card is cool white. Dark mode turns the teal into the page and the mint into the accent. Nunito Sans for reading, Playfair Display for titles. For a plain page, load `tokens.css` from this folder and `themes/colour-key.css` beside it. A Flow screen reads the `--t-*` properties in the same file.

## Colors

- The page is `bg-accent` (`--t-bg`). Cards are `card` (`--t-paper`). Body text is `text`. Titles are `text-strong`. Helper text is `muted`.
- `accent` (`--t-primary`) is the one teal in light mode and the mint in dark mode. Use it for the single main action.
- Text on that fill is `on-accent`.
- `accent-2` is the quiet teal-grey. Use it for a second mark, not a second brand.
- Success is `series-2`. Warning is `series-3`. Do not use those hues for diagram boxes.
- Diagram boxes use the catalog [diagram colour key](../../docs/diagram-colour-key.md). Draw arrows in `muted`.

## Typography

- Titles: Playfair Display, weight 700. Everything else: Nunito Sans.
- Labels are 12px, weight 600, uppercase, tracked at 0.09em.
- Code and identifiers: JetBrains Mono.
- Sentence case for sentences and buttons. Uppercase only for those labels.

## Layout

- Card padding is 24px. Dense rows use 16px.
- Keep one filled teal button in a view.

## Elevation & Depth

- Shadows stay short and teal-tinted in light mode (`shadow-md`). Dark mode uses a soft black shadow.
- Do not add a colored left edge to a card.

## Shapes

- Controls use `rounded.md` (6px). Cards use `rounded.lg` (10px). The small step is 4px.

## Components

- The main button is `accent` with `on-accent` text. An outlined button uses `border-strong`.
- Focus uses `ring`.
- A warning surface uses the warning tint (`--t-warn-bg`) and the word "Warning". Color is not the status.

## Do's and Don'ts

- Do keep the cream page and the white card distinct.
- Do carry status as a word, never color alone.
- Don't give a diagram color a second meaning.
- Don't write explanations in a legend. Use one word, with the meaning in a hover and focus tip.
- Don't edit the unprefixed contract properties by hand. Change a `--t-*` value and run `node scripts/sync-contract.mjs`.
