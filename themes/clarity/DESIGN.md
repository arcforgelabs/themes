---
name: Clarity
description: shadcn preset bJy2uzsR (maia style, stone base, teal theme)
colors:
  background: "#FFFFFF"
  foreground: "#0C0A09"
  card: "#FFFFFF"
  card-foreground: "#0C0A09"
  popover: "#FFFFFF"
  popover-foreground: "#0C0A09"
  primary: "#00786F"
  primary-foreground: "#F0FDFA"
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
  sidebar-primary: "#009689"
  sidebar-primary-foreground: "#F0FDFA"
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
  dark-primary: "#005F5A"
  dark-primary-foreground: "#F0FDFA"
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
  dark-sidebar: "#1C1917"
  dark-sidebar-foreground: "#FAFAF9"
  dark-sidebar-primary: "#00BBA7"
  dark-sidebar-primary-foreground: "#022F2E"
  dark-sidebar-accent: "#292524"
  dark-sidebar-accent-foreground: "#FAFAF9"
  dark-sidebar-border: "#FFFFFF1A"
  dark-sidebar-ring: "#79716B"
typography:
  heading: {fontFamily: OpenDyslexic, fontSize: 1.5rem, fontWeight: 700, lineHeight: 2rem}
  card-title: {fontFamily: OpenDyslexic, fontSize: 1rem, fontWeight: 700, lineHeight: 1.5rem}
  body: {fontFamily: OpenDyslexic, fontSize: 1rem, fontWeight: 400, lineHeight: 1.6rem}
  label: {fontFamily: OpenDyslexic, fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.25rem}
  caption: {fontFamily: OpenDyslexic, fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.4rem}
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 18px
  3xl: 22px
  4xl: 26px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
---

## Overview

Clarity pairs the Maia stone/teal shadcn preset with bundled OpenDyslexic for a distinct reading option. Use it for documents, learning material and explainers. The font is a preference, not a treatment or a promise of better reading performance.

## Install and provenance

Apply the palette, components and icons with `npx shadcn@latest apply --preset bJy2uzsR`. Then load this theme's generated `typography.css` after the application theme. This file adds font faces and type variables only, so the application retains its palette and mode owner (`.dark` or its existing mode mechanism). Use the full `tokens.css` only for standalone HTML, with its documented `data-theme` light/dark/auto selectors. The preset alone installs IBM Plex Sans, not OpenDyslexic. The generated CSS embeds unmodified regular and bold WOFF2 bytes; retain `fonts/OFL.txt` when distributing it. See `fonts/font.json` for the immutable upstream commit and SHA256 checksums. Do not use a local-font or third-party font-server dependency.

## Colors

Use `background` and `foreground` for reading. Keep the preset's white light ground and charcoal dark ground; do not invent a cream tint with a medical rationale. Use `primary` for the main action, not paragraph ink. Use `foreground` for links with an underline. Use `muted-foreground` only on `background` or `card` in light mode, never on `muted` (the upstream pair misses 4.5:1). Use `sidebar-primary` as a marker, not a light-mode fill behind text. Keep sidebar text on `sidebar`.

Use `foreground` for control outlines and focus indicators: the preset's decorative `input`, `border` and `ring` are not sufficient accessible boundaries on every surface. Reserve `destructive` for an error marker with a text label; do not use it as ordinary text. Outline chart marks against their surface and label them; the neutral chart scale is not five accessible text colours. Follow the repository's diagram colour key for semantic diagrams.

## Typography

Use `font-sans` for body, controls, diagram labels and pop-ups. Use `font-heading` for headings; it inherits OpenDyslexic. Preserve intentional monospace code and data numerals with the application's mono stack. Do not overwrite mono or purposeful SVG icon fonts.

Start reading text at 1rem with a 1.6 line height. Keep compact labels at least 0.875rem; avoid the preset's small caption size for essential instructions. Use regular 400 and bold 700, the supplied real faces. Allow system sans-serif fallback for unsupported glyphs or blocked font loading. Do not shrink text to fit a diagram.

## Layout

Keep prose near 65ch, left aligned. Stack columns in narrow containers, wrap labels and keep choices visible. Let user spacing and 200% zoom reflow without clipping. Do not justify prose or hide overflow to disguise layout failures.

## Elevation

Use `card` and `popover` with their matching foregrounds. Prefer spacing and an outline to extra shadows. Keep reading surfaces still and quiet.

## Shapes

Use the generated medium `radius` scale. Keep the same shape rules in light and dark modes. Do not make every paragraph a rounded card.

## Components

Inherit the reading family in buttons, inputs, tooltips and expanded views. Use a visible foreground outline for keyboard focus. Pair every status colour with words or an icon. Retain light, dark and automatic mode choices; an explicit reader choice wins.

## Do's and don'ts

Do load the actual bundled font and keep its licence. Do test clean-client glyph delivery and fallback. Do retain the preset code as the palette and shape origin. Do not claim that this theme improves comprehension, cures dyslexia or prevents fatigue. Read `RESEARCH.md` for the evidence limits. Do not rename or alter the separate Arc Forge theme.
