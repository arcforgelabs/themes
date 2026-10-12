# Contributing

Contributions are welcome. Agent work lives in GitHub issues and pull requests.

Read [`VISION.md`](VISION.md) first. This repo is a small, curated catalog of Arc Forge design systems, not a gallery. Changes on its "What we will not merge" list will be closed however well they are built. If you think the vision should change, open an issue about the vision first.

By opening a pull request or submitting a patch, you confirm that:

- You have the right to submit the contribution.
- Your contribution does not knowingly include secrets, private credentials, or material you are not allowed to publish.
- Your contribution is provided under the MIT License.

## Why changes here get a careful review

Arc Forge's agent instructions tell every agent to obey this repo's `README.md`. A change to the README, `AGENTS.md`, any `DESIGN.md` or any install command changes what every agent does. Say so in the pull request when you touch them. [`SECURITY.md`](SECURITY.md) has the rules and the private path for security reports.

## Add or change a theme

1. Start from a preset at [ui.shadcn.com/create](https://ui.shadcn.com/create). For a new theme, open a "Propose a theme" issue first.
2. Run `scripts/add-theme <code> <slug> "<Name>"`. Change a token by changing the preset and running it again. Never edit `tokens.css`, `registry-item.json`, `registry.json` or the `DESIGN.md` front matter by hand.
3. Write the `DESIGN.md` prose as usage rules: short imperative sentences that name tokens. [`docs/theme-contract.md`](docs/theme-contract.md) lists what a theme must contain.
4. Run `scripts/check` and put its output in the pull request's Evidence. A new contrast exception needs a reason in `theme.json` and a matching rule in `DESIGN.md`.
5. For a change to the look, add a screenshot of the theme applied to a real page, with the viewport and both light and dark.

`scripts/add-theme` and `scripts/check` need Python 3.10 or newer and Node with `npx`.

## Agent rules

`AGENTS.md` holds the rules for coding agents. `CLAUDE.md` and `GEMINI.md` are git symlinks to it; edit `AGENTS.md`, never the links.

On Windows, Git only creates the links when `core.symlinks` is on, which needs Developer Mode or an elevated shell. Without it, the links are checked out as plain files holding the text `AGENTS.md`. Clone with `git clone -c core.symlinks=true`, or fix an existing clone with `git config core.symlinks true`, then delete the two files and run `git checkout -- CLAUDE.md GEMINI.md`.

<!-- arc-forge-org-consistency:start -->
## Pull request body

Use `.github/pull_request_template.md` and keep the body current:

- **What Problem This Solves** — the concrete problem and when it happens.
- **Why This Change Was Made** — the shipped solution and any boundary that matters.
- **User Impact** — what someone can now do, or a plain statement that there is no user-visible change.
- **Evidence** — the command, commit, result, and what was not run. Screenshots show the real product. Placeholder text does not count.

Edit the pull request body when someone asks for more proof. A review comment can point at that edit. The body stays the record. Maintainer authorship does not remove this requirement.
<!-- arc-forge-org-consistency:end -->
