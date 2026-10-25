---
name: Arc Forge
description: Red, steel and grey. The fallback theme.
colors:
  bg-accent: "#f2f2f5"
  card: "#ffffff"
  text: "#3a3a42"
  text-strong: "#18181b"
  muted: "#68676f"
  border: "#e2e2e8"
  border-strong: "#ccccd4"
  ring: "#c41e30"
  accent: "#c41e30"
  on-accent: "#ffffff"
  accent-2: "#5a626e"
  series-1: "#c41e30"
  series-2: "#5a626e"
  series-3: "#18181b"
  series-4: "#8a6d3b"
  series-5: "#3f6f8f"
  dark-bg-accent: "#0d0d0f"
  dark-card: "#111113"
  dark-text: "#c6c6cb"
  dark-text-strong: "#f5f5f7"
  dark-muted: "#8a8a94"
  dark-border: "#202026"
  dark-border-strong: "#303038"
  dark-ring: "#e5243b"
  dark-accent: "#e7364b"
  dark-on-accent: "#0d0d0f"
  dark-accent-2: "#b8bdc4"
  dark-series-1: "#ef4e61"
  dark-series-2: "#b8bdc4"
  dark-series-3: "#f5f5f7"
  dark-series-4: "#d9b26a"
  dark-series-5: "#7fb3d5"
typography:
  heading: {fontFamily: Geist, fontSize: 1.5rem, fontWeight: 600, lineHeight: 2rem}
  card-title: {fontFamily: Geist, fontSize: 1rem, fontWeight: 500, lineHeight: 1.5rem}
  body: {fontFamily: Geist, fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.25rem}
  label: {fontFamily: Geist, fontSize: 0.875rem, fontWeight: 500, lineHeight: 1.25rem}
  caption: {fontFamily: Geist, fontSize: 0.75rem, fontWeight: 500, lineHeight: 1rem}
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
---

## Overview

Red, steel and grey. This is the fallback theme: a page shows it when no other theme is chosen. Geist carries the text. JetBrains Mono carries code and identifiers. For a plain page, load `tokens.css` from this folder and `themes/colour-key.css` beside it.

## Colors

- The page is `bg-accent`. Cards are `card`. Body text is `text`. Titles are `text-strong`. Helper text is `muted`.
- `accent` is the one red. Use it for the single main action, the focus ring in light mode, and the first chart series. Do not paint large surfaces with it.
- Text on a red fill is `on-accent`. In dark mode the red is `#e7364b` and the ink is `#0d0d0f`, so the pair stays at 4.5:1. Do not put white on that dark red.
- `accent-2` is steel. Use it for the second family of marks, not for a second brand color.
- Chart series are `series-1` to `series-5`. Do not paint a series with a diagram-key color.
- Diagram boxes use the catalog [diagram colour key](../../docs/diagram-colour-key.md). Draw arrows in `muted`.

## Typography

- Text and headings: Geist. Code, identifiers and amounts: JetBrains Mono.
- Sentence case everywhere, including buttons.

## Layout

- Card padding is 24px. Small cards use 16px.
- Keep one primary action in view.

## Elevation & Depth

- Cards lift with `shadow-md`. Menus and dialogs use `shadow-lg`.
- Do not add a colored edge to a card.

## Shapes

- Controls use `rounded.md` (10px). Cards use `rounded.lg` (14px). Pills use `rounded.full`.

## Components

- The main button is `accent` with `on-accent` text. A second button is steel (`accent-2`) or an outline in `border-strong`.
- Focus: a `ring` outline. In dark mode the ring stays `#e5243b` while the button red is lighter. Do not swap them.
- Icons are 16px, line weight, in `text` or `accent`.

## Do's and Don'ts

- Do use one red thing per view.
- Do carry status as a word, never color alone.
- Don't give a diagram color a second meaning. Red in a diagram is risk only, and it is the key red, not `accent`.
- Don't write explanations in a legend. Use one word, with the meaning in a hover and focus tip.
- Don't nudge these tokens in a consumer. If a pair misses 4.5:1, change it here.
