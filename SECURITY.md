# Security Policy

If you believe you found a security issue in this repo, report it privately first.

## Reporting

Submit a private [GitHub Security Advisory](https://github.com/arcforgelabs/themes/security/advisories/new). If you cannot use it, open a public issue that only asks for a disclosure contact and contains no details.

Useful reports name the file, the commit, what an attacker could make an agent or a project do, and how to reproduce it.

## Trust model

This repo holds no secrets and no customer data. Its values come from public shadcn/ui presets.

The risk is its reach. Arc Forge's global agent instructions tell every agent, in every harness, to obey `README.md` here. Text in this repo is therefore an instruction surface for every agent session, and the install commands it lists run in every project that applies a theme.

- `README.md`, `AGENTS.md`, every `DESIGN.md` and every install command are security-relevant. A change that adds an instruction, a command, a URL or a package to them needs a careful review.
- Install commands use only `npx shadcn@latest` with a preset code, or a registry item URL inside this repo. Do not add other packages, scripts or hosts.
- `scripts/add-theme` fetches from `ui.shadcn.com` and runs `npx shadcn@latest`. `scripts/check` runs a pinned `@google/design.md`. Do not add other network calls.

## Rules held here

- Changes to `main` go through pull requests. Force pushes and branch deletion are blocked.
- The `gitleaks` secret scan must pass on every pull request.
- GitHub Actions tokens are read-only and cannot approve pull requests. Workflows from outside contributors need approval before they run. Pin every action to a commit SHA.
- No secrets, tokens or private URLs in any file, issue or pull request.

The company-wide policy is [arcforgelabs/business `SECURITY.md`](https://github.com/arcforgelabs/business/blob/master/SECURITY.md).
