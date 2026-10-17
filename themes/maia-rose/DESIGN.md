---
name: Maia Rose
description: shadcn preset b4W4Iv9tfn (maia style, stone base, rose theme)
colors:
  background: "#FFFFFF"
  foreground: "#0C0A09"
  card: "#FFFFFF"
  card-foreground: "#0C0A09"
  popover: "#FFFFFF"
  popover-foreground: "#0C0A09"
  primary: "#C70036"
  primary-foreground: "#FFF1F2"
  secondary: "#F4F4F5"
  secondary-foreground: "#18181B"
  muted: "#F5F5F4"
  muted-foreground: "#79716B"
  accent: "#F5F5F4"
  accent-foreground: "#1C1917"
  destructive: "#E7000B"
  border: "#E7E5E4"
  input: "#E7E5E4"
  ring: "#A6A09B"
  chart-1: "#D6D3D1"
  chart-2: "#79716B"
  chart-3: "#57534D"
  chart-4: "#44403B"
  chart-5: "#292524"
  sidebar: "#FAFAF9"
  sidebar-foreground: "#0C0A09"
  sidebar-primary: "#EC003F"
  sidebar-primary-foreground: "#FFF1F2"
  sidebar-accent: "#F5F5F4"
  sidebar-accent-foreground: "#1C1917"
  sidebar-border: "#E7E5E4"
  sidebar-ring: "#A6A09B"
  dark-background: "#0C0A09"
  dark-foreground: "#FAFAF9"
  dark-card: "#1C1917"
  dark-card-foreground: "#FAFAF9"
  dark-popover: "#1C1917"
  dark-popover-foreground: "#FAFAF9"
  dark-primary: "#A50036"
  dark-primary-foreground: "#FFF1F2"
  dark-secondary: "#27272A"
  dark-secondary-foreground: "#FAFAFA"
  dark-muted: "#292524"
  dark-muted-foreground: "#A6A09B"
  dark-accent: "#292524"
  dark-accent-foreground: "#FAFAF9"
  dark-destructive: "#FF6467"
  dark-border: "#FFFFFF1A"
  dark-input: "#FFFFFF26"
  dark-ring: "#79716B"
  dark-chart-1: "#D6D3D1"
  dark-chart-2: "#79716B"
  dark-chart-3: "#57534D"
  dark-chart-4: "#44403B"
  dark-chart-5: "#292524"
  dark-sidebar: "#18181B"
  dark-sidebar-foreground: "#FAFAF9"
  dark-sidebar-primary: "#FF2056"
  dark-sidebar-primary-foreground: "#FFF1F2"
  dark-sidebar-accent: "#292524"
  dark-sidebar-accent-foreground: "#FAFAF9"
  dark-sidebar-border: "#FFFFFF1A"
  dark-sidebar-ring: "#79716B"
typography:
  heading: {fontFamily: Merriweather, fontSize: 1.5rem, fontWeight: 600, lineHeight: 2rem}
  card-title: {fontFamily: Merriweather, fontSize: 1rem, fontWeight: 500, lineHeight: 1.5rem}
  body: {fontFamily: IBM Plex Sans, fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.25rem}
  label: {fontFamily: IBM Plex Sans, fontSize: 0.875rem, fontWeight: 500, lineHeight: 1.25rem}
  caption: {fontFamily: IBM Plex Sans, fontSize: 0.75rem, fontWeight: 500, lineHeight: 1rem}
rounded:
  sm: 8.4px
  md: 11.2px
  lg: 14px
  xl: 19.6px
  2xl: 25.2px
  3xl: 30.8px
  4xl: 36.4px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
---

## Overview

Soft, rounded and unhurried. Warm stone neutrals carry the page, a single rose accent marks the action that matters, and a serif heading face gives product screens an editorial calm. Built on the shadcn/ui Maia style: generous spacing, pill controls, cards without shadows.

Install in a shadcn project: `npx shadcn@latest init --preset b4W4Iv9tfn` (new) or `npx shadcn@latest apply --preset b4W4Iv9tfn` (existing). For plain HTML, load `tokens.css` from this folder.

## Colors

- Build every screen from the stone neutrals: `background`, `card`, `muted`, `border`. Text is `foreground`; helper text is `muted-foreground`.
- `primary` (rose, #C70036) is for the single main action on a view, switch on-states and links. Never use it for large surfaces or decoration.
- `destructive` is text on its own tint (10% light, 20% dark), never a solid fill.
- Charts are monochrome stone, `chart-1` (lightest) to `chart-5` (darkest). Color one series `primary` to call it out.
- Diagrams take box colors from the catalog [diagram colour key](../../docs/diagram-colour-key.md) and from nothing else. Draw arrows in `muted-foreground`.
- Dark mode (`dark-*` tokens) steps surfaces up in lightness, turns borders into white at 10%, and deepens `primary` so its foreground keeps contrast.

## Typography

- Headings: Merriweather. Everything else: IBM Plex Sans. IDs, amounts in tables and code: IBM Plex Mono.
- Card titles are Merriweather 16px medium over 14px Plex Sans body. Keep that pairing.
- Sentence case everywhere, including buttons.

## Layout

- Card padding and the gap between card sections is 24px; small cards use 16px.
- Controls are 36px tall (32px small, 40px large, 24px extra small). Inputs match buttons so they share a row.
- Prefer one more step of padding over a denser layout.

## Elevation & Depth

- Cards have no shadow. A 1px ring of `foreground` at 10% sets them off.
- Menus and dropdowns are inverted and translucent: a dark frosted panel in light mode, a light one in dark mode.

## Shapes

- Buttons, inputs, selects and badges are pills (`rounded.4xl`). Cards and dialogs use `rounded.2xl`. Popovers use `rounded.lg`.
- The whole scale derives from one radius, 0.875rem.

## Components

- Button variants: `default` (rose) for the main action, `outline` beside it, `secondary` inside cards, `ghost` in toolbars, `destructive` (tinted) for delete, `link` inline.
- Inputs fill with `input` at 30% and carry a 1px `input` border.
- Focus: a `ring` border plus a 3px `ring` halo at 50%. Invalid: `destructive` border and a 20% halo.
- Icons: Remix Icon, line style, 16px in buttons and 12px in badges (`@remixicon/react`).

## Do's and Don'ts

- Do use one rose button per view; pair it with `outline`.
- Do carry status as a word, never color alone.
- Don't give a diagram color a second meaning. Red is risk only; orange is our own code only.
- Don't write explanations in a legend. Use one word, with the meaning in a hover and focus tip.
- Don't add drop shadows, colored borders or a colored left edge to cards.
- Don't use emoji in UI.
- Don't set `muted-foreground` text on a `muted` fill (4.39:1). Use it on `background` or `card`.
- Don't put text on a `sidebar-primary` fill (below 4.5:1 in both modes). Use `sidebar-primary` for the active item's marker or icon, and `sidebar-accent` behind its text.
