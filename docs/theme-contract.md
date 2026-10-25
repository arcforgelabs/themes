# Theme contract

Every theme in `themes/<slug>/` holds these parts. `scripts/check` tests the ones a script can test, and continuous integration runs it on every pull request (`.github/workflows/check.yml`). It blends a translucent token over its surface before it takes a contrast ratio.

The same command also runs `scripts/design-check.mjs`. That gate is the explainer token contract, contrast at Web Content Accessibility Guidelines level double A (4.5:1 for text, 3:1 for marks), and the diagram colour key. The pairs are the ones the explainer draws. Page checks stay with the explainer.

## Required files

- `theme.json` with `name`, `slug`, `preset`, `values`, `install`, `pickable` and `contractFrom`.
- `DESIGN.md` that passes `npx @google/design.md lint` with no errors.
- `tokens.css` and `registry-item.json`. For a preset, `scripts/add-theme` writes them. For Arc Forge, Harbour and Meridian they are copied from the product source.
- `contract.json`, written by `node scripts/sync-contract.mjs`. It holds `bg-accent`, `card`, `text`, `text-strong`, `muted`, `border`, `border-strong`, `ring`, `accent`, `accent-subtle`, `on-accent`, `accent-2`, `accent-2-subtle`, `series-1` to `series-5`, `shadow-md`, `shadow-lg`, and the shape keys `radius-sm`, `radius-md`, `radius-lg`, `radius-full`, `font-body`, `font-display`, `font-mono`, in light and dark.

`themes/colour-key.css` matches the sample in `docs/diagram-colour-key.md`. A theme does not replace those values.

## Tokens

The shadcn token set, in light and dark:

- Surfaces and text: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`.
- Roles: `primary`, `secondary`, `muted`, `accent`, `destructive`, each with its `-foreground` where shadcn defines one.
- Lines and focus: `border`, `input`, `ring`.
- Charts: `chart-1` to `chart-5`.
- Sidebar: `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`.
- Shape: `radius`, with the scale `radius-sm` to `radius-4xl` derived from it.
- Type: `font-sans`, and `font-heading` when the heading face differs.

## Legibility

- Each text color reads at 4.5:1 or more on the surfaces it is used on, in both light and dark. Large text (24px and up) needs 3:1.
- Focus rings, input borders and meaningful icons reach 3:1 on their surface.
- Status never relies on color alone.
- Diagrams use the [diagram colour key](diagram-colour-key.md). A theme does not change what a key colour means.

## DESIGN.md prose

The prose tells an agent how to use the tokens. It names tokens, gives rules in short imperative sentences, and covers: overview, colors, typography, layout, elevation, shapes, components, and do's and don'ts. It does not repeat token values that the front matter already holds.

## Source of values

Values come from the shadcn preset through `scripts/add-theme`. Do not edit generated files or the `DESIGN.md` front matter by hand. Change the preset and regenerate.
