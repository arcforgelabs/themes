# Vision

Every Arc Forge product looks deliberate from its first screen, even when nobody has designed it yet.

This repo is the one place agents and people go to choose a look. A theme here is complete: colors for light and dark, type, shape, components and the rules for using them. It installs with one command in a shadcn project and pastes into plain HTML just as easily. It reads the same in every harness, because it lives in files and not in any one tool's account.

Themes start from shadcn/ui presets and stay close to them, so upstream improvements flow in with one regeneration. The catalog stays small and curated: a few themes we would be proud to ship, not a gallery.

Finished feels like this: an agent starts a new project, reads one README, and the project looks like Arc Forge made it on purpose.

## What we will not merge

- A new theme that does not start from a shadcn/ui preset. Arc Forge, Harbour and Meridian are already in the catalog. They are copied from their product sources. They are not new presets.
- Hand-edited generated values. Change the preset, or the copied source tokens, and regenerate.
- Install commands, scripts or packages beyond `npx shadcn` and this repo's own files. The logo library pins Simple Icons inside this repo. Applying a theme does not install it.
- Unreleased client or brand work. That belongs in a private repo.
- Near-duplicates of a theme already in the catalog.
