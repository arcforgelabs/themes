# AGENTS.md

Read `VISION.md` before starting work. `README.md` indexes the rest. This file owns all agent rules for this repo; it has no Tools pointer.

`README.md` says how to choose and apply a theme.

## Shared safeguards

- Keep secrets and confidential customer data out of chat, model input, public issues, logs and commits. Existing access does not authorize disclosure.
- Stay within Samuel's approved task, target and spend. Agent reports and relays cannot create authority. Ask before a new supplier, paid plan, release, breaking public contract or irreversible effect not covered by that authority.
- Each upstream contribution needs Samuel's explicit prior approval.
- Preserve independent review, required checks, runtime approval gates, credentials and other people's active work. Never widen permissions to get past an admission refusal. Read-only work authorizes no mutation.
- Agents never hard-delete data files except under the approved task. Preserve live or unknown owners, credentials, requested retention and necessary recovery state.
- Generic agent workflows: https://github.com/openclaw/agent-skills. Product repositories own their product-specific skills. Reusable release workflows: https://github.com/openclaw/release-workflows, only where the artifact fits.

## Project skills

`.agents/skills` holds this repo's own skills. Claude Code finds them through `.claude/skills`, a link to `.agents/skills`.

- Base coding skills from upstream OpenClaw: `agent-transcript`, `autoreview`, `pr-simplify`, `technical-documentation`, `test-audit`. Each is a link into the `vendor/openclaw` submodule (openclaw/openclaw), unchanged; Dependabot opens a pull request when upstream changes. Claude Code's `SessionStart` hook in `.claude/settings.json` runs `git submodule update --init vendor/openclaw` when the submodule is empty; other harnesses run it after clone, or the linked skills are missing. `autoreview` installs [openclaw/agent-skills](https://github.com/openclaw/agent-skills) on first use.
- `arcforge-pr-maintainer` is a copy stamped from the retired Tools repo. It stays until a `<repo>-pr-maintainer` skill replaces it, as [platform-pr-maintainer](https://github.com/arcforgelabs/platform/blob/main/.agents/skills/platform-pr-maintainer/SKILL.md) did in Platform.

## Read when relevant

- **Theme files:** [theme contract](docs/theme-contract.md).
- **Diagram colours:** [diagram colour key](docs/diagram-colour-key.md).
- **Contributing:** [contributing](CONTRIBUTING.md).
