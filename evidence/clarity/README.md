# Clarity source validation

1 November 2026; Linux 6.8.0-147-generic x86_64, Node 24.22.1, Python 3.12, headless Google Chrome 156.0.8078.79. The page is `themes/clarity/preview.html`, a real rendered theme specimen with synthetic text, not an authenticated OpenClaw screen. No user browser/profile was used.

## Commands and results

- `scripts/add-theme bJy2uzsR clarity Clarity`: generated the preset tokens, adapted font metadata, DESIGN front matter and registry. Fresh upstream decode/resolve matched both stored token sets exactly.
- `scripts/check`: PASS for both themes. Clarity explicitly excludes upstream light muted-on-muted (4.39:1) and sidebar-primary text fill (3.52:1); the generated values were not changed. Foreground control outlines and underlined foreground links are used in the specimen. Maia Rose is unchanged.
- `PLAYWRIGHT_MODULE=/home/deploy/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs CHROMIUM_PATH=/usr/bin/google-chrome node scripts/check-clarity.mjs`: PASS. Clean context, offline; CDP actual custom glyph receipts in browser-result.json show OpenDyslexic-Regular for body/control/pop-up and OpenDyslexic-Bold for heading/bold. Mono remains DejaVu Sans Mono; missing glyphs use system CJK/emoji. Font-src none falls back to DejaVu Sans. No HTTP font requests.
- Negative control: remove generated font faces while retaining family declaration; CDP renders DejaVu Sans, not OpenDyslexic. The actual-glyph assertion rejects the original CSS-name-only failure.
- 320/390/768/1280 × light/dark: no horizontal overflow. Auto follows emulated system, explicit light beats dark system. Pop-up opens and Escape closes it. 320px with 200% text plus WCAG text-spacing overrides reflows. This is text resizing, not a claim of full browser zoom/host validation.
- Immutable upstream raw downloads for regular, bold and OFL matched every SHA256 in fonts/font.json. Generated CSS byte-for-byte reproduction passed.
- `git diff --cached --check`: PASS with the verbatim upstream OFL exempt from whitespace checks in .gitattributes (one original trailing space retained to preserve its pinned hash).

Screenshots: width-mode.png uses that CSS viewport width × 1000px, full-page capture; 320-spacing-200.png uses 320px with enlarged text and spacing. These are source-theme evidence, not the later tools chart/picker/full artifact/inline/host roundtrip acceptance.

## Simplification

One optional font manifest extends the existing add-theme owner, with no second registry, font server, local-font probe, package dependency or new install command. Palette/shape remain upstream-owned. The necessary growth is exact font/licence bytes, generation, usage rules and one browser boundary test. No tools, Arc Forge fallback, OpenClaw core/config or public explainer export was edited.

## Independent review

Reviewer session 3908a0cb-eead-400d-9341-808a72499dca independently verified upstream tokens, font/licence bytes and glyph-test design. One P2 found: loading standalone CSS after a shadcn app competes with `.dark` mode ownership. Fixed with generated typography.css (faces/type variables only), corrected instructions, and a browser regression for explicit app dark/system light and app light/system dark. Strengthened real-bold proof to require OpenDyslexic-Bold PostScript face, not synthesised regular. Browser proof remains an explicit local check; existing CI checks assets/generated CSS/lint/contrast.

## Import handoff

The tools importer must consume `themes/clarity/tokens.css` INCLUDING its two @font-face rules, and carry `themes/clarity/fonts/OFL.txt` into generated bundles/packages alongside the embedded bytes. Its variable mapper should map font-sans to font-body and font-heading to font-display, without replacing intentional mono. An importer that extracts only root variables will lose glyph delivery. Do not route OpenDyslexic through Google Fonts. Preserve explicit picks/saved defaults and light/dark/auto; retain Arc Forge as a separate unchanged theme. Wait for the reviewed source merge and pin its exact SHA before final integration/release.

Not run here: authenticated OpenClaw iframe/CSP delivery, all tools chart/expanded view layouts, actual host choice-to-conversation roundtrip, two-view delivery, marketplace packaging/release/activation. Those are owned by the next tools stage. No release or deployment is claimed.
