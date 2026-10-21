# Arc Forge themes

The Arc Forge catalog of design systems. Each theme is a shadcn/ui preset with its tokens, a `DESIGN.md` and a shadcn registry item. Agents read this file to choose or apply a design system.

## Choose a design system

Use the first source that exists. Stop at that source.

1. **The user's words.** If the user names a design, a theme or a preset, use it.
2. **The repo's `DESIGN.md`.** It is at the repo root. It is the design contract of the repo.
3. **The repo's shadcn setup.** If `components.json` exists, run `npx shadcn@latest info --json`. To get the preset code, run `npx shadcn@latest preset resolve --json`.
4. **Theme tokens in the code.** For example, CSS custom properties in `globals.css` or a Tailwind theme.
5. **The harness default.** If the harness has its own design-system default, use it. In Claude Code, the Artifact tool `quickstart` action lists the account's design systems. A harness without this feature skips this step.
6. **This catalog.** Use the catalog default:
   - When the catalog has one pickable theme, use it.
   - When it has more than one, run `scripts/pick <owner/repo>` from this repo. The pick is the same for the same repo name every time, so two agents agree.

## Apply a catalog theme

**In a repo.** Record the theme so the next agent finds it at step 2:

1. Apply the preset. In a new shadcn project, run `npx shadcn@latest init --preset <code>`. In an existing one, run `npx shadcn@latest apply --preset <code>`.
2. Copy `themes/<slug>/DESIGN.md` to the repo root as `DESIGN.md`.

**In standalone HTML** (an artifact, a report, a slide): copy the CSS variables from `themes/<slug>/tokens.css` into the page. Copy the light block and both dark blocks. Load the fonts from the link in the file's second line.

**Diagrams, in every theme:** colour every box with the [diagram colour key](docs/diagram-colour-key.md). One colour has one meaning on every page.

**Explainer pages and charts:** follow [explainer/SKILL.md](explainer/SKILL.md). Pick a chart kind from [explainer/references/charts.md](explainer/references/charts.md).

**Theme tokens only** (keep the repo's components): run `npx shadcn@latest apply --preset <code> --only theme`.

## Catalog

| Theme | Preset | Look | Install |
| --- | --- | --- | --- |
| [Maia Rose](themes/maia-rose/DESIGN.md) (default) | `b4W4Iv9tfn` | Soft and rounded. Stone neutrals, one rose accent, Merriweather headings over IBM Plex Sans, Remix icons. | `npx shadcn@latest apply --preset b4W4Iv9tfn` |

Preview or change a preset at `https://ui.shadcn.com/create?preset=<code>`.

## Files

| Path | What it is |
| --- | --- |
| `VISION.md` | What this repo is for. |
| `CONTRIBUTING.md` | How to propose, add or change a theme. |
| `LICENSE` | MIT. |
| `SECURITY.md` | How to report a problem, the trust model, and the rules held here. |
| `docs/theme-contract.md` | What every theme must contain. |
| `docs/diagram-colour-key.md` | The one colour key for every diagram, in every theme. |
| `explainer/` | The explainer library: a skill, chart catalogue and kit for visual explainer pages. Generated from `arcforgelabs/tools`; do not edit by hand. Published at https://arcforgelabs.github.io/themes/. |
| `themes/<slug>/theme.json` | The preset code, its decoded values, fonts and install command. `pickable` controls step 6. |
| `themes/<slug>/DESIGN.md` | The design contract in the [DESIGN.md format](https://www.npmjs.com/package/@google/design.md): tokens in front matter, usage rules in prose. |
| `themes/<slug>/tokens.css` | Light and dark CSS variables for plain HTML. Generated. |
| `themes/<slug>/registry-item.json` | A shadcn `registry:theme` item. Generated. |
| `registry.json` | The shadcn registry index of all themes. Generated. |
| `scripts/add-theme` | Adds or refreshes a theme from a preset code. |
| `scripts/pick` | Picks a theme for a repo name. |
| `scripts/check` | Checks every theme against the contract. |

## Add a theme

1. Design it at [ui.shadcn.com/create](https://ui.shadcn.com/create) and copy the preset code.
2. Run `scripts/add-theme <code> <slug> "<Name>"`.
3. Replace the generated prose in `themes/<slug>/DESIGN.md` with real usage rules. Do not edit the front matter or the generated files by hand. To change a token, change the preset and run step 2 again.
4. Add a row to the catalog table above.
5. Run `scripts/check`. Open a pull request.
