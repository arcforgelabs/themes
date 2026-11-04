"""Protect generated files and authored content without network access."""

import contextlib
import importlib.machinery
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import URLError
from urllib.parse import parse_qs, urlparse


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "add-theme"
LOADER = importlib.machinery.SourceFileLoader("add_theme_tests", str(SCRIPT))
SPEC = importlib.util.spec_from_loader(LOADER.name, LOADER)
add_theme = importlib.util.module_from_spec(SPEC)
LOADER.exec_module(add_theme)


class AddThemeTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        root_patch = patch.object(add_theme, "ROOT", self.root)
        root_patch.start()
        self.addCleanup(root_patch.stop)

    def test_color_conversion_preserves_alpha_and_existing_hex(self):
        cases = {
            "oklch(0 0 0)": "#000000",
            "oklch(1 0 0)": "#FFFFFF",
            "oklch(0.5 0 0)": "#636363",
            "oklch(0.62795536 0.25768331 29.233885)": "#FF0000",
            "oklch(1 0 0 / 15%)": "#FFFFFF26",
            "oklch(1 0 0 / 0.15)": "#FFFFFF26",
            "oklch(0 0 0 / 0)": "#00000000",
            "#aabbcc": "#aabbcc",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(add_theme.oklch_to_hex(value), expected)

    def test_refresh_keeps_prose_after_front_matter(self):
        path = self.root / "DESIGN.md"
        front = "---\nname: Updated\n---\n"
        for gap in ("", "\n"):
            with self.subTest(gap=repr(gap)):
                prose = "## Overview\n\nUse the accent.\n\n---\n\nKeep this rule.\n"
                path.write_text("---\nname: Old\n---\n" + gap + prose, encoding="utf-8")
                add_theme.write_design_md(path, front, "Updated", "new-code")
                self.assertEqual(path.read_text(encoding="utf-8"), front + "\n" + prose)

    def test_resolve_encodes_values_and_omits_inherited_heading(self):
        values = {"style": "maia", "theme": "rose & stone", "fontHeading": "inherit"}
        with patch.object(add_theme.urllib.request, "urlopen", return_value=io.BytesIO(b'{}')) as request:
            add_theme.resolve(values, "aria")
        url = urlparse(request.call_args.args[0])
        self.assertEqual(url.scheme + "://" + url.netloc + url.path, "https://ui.shadcn.com/init")
        self.assertEqual(parse_qs(url.query), {
            "base": ["aria"], "rtl": ["false"], "style": ["maia"], "theme": ["rose & stone"],
        })
        self.assertEqual(values["fontHeading"], "inherit")

    def generate(self, slug, heading="inherit", fonts_available=True):
        values = {
            "style": "maia", "baseColor": "stone", "theme": "rose",
            "font": "example-sans", "fontHeading": heading,
        }
        light = {"background": "oklch(1 0 0)", "foreground": "oklch(0 0 0)", "radius": "0.5rem"}
        dark = {"background": "oklch(0 0 0)", "foreground": "oklch(1 0 0)"}

        def response(url, **kwargs):
            if urlparse(url).path == "/init":
                data = {"cssVars": {"light": light, "dark": dark}}
            elif not fonts_available:
                raise URLError("Synthetic font outage")
            else:
                is_heading = "font-heading-" in url
                data = {"font": {
                    "import": "Example_Serif" if is_heading else "Example_Sans",
                    "family": "Example, serif" if is_heading else "Example, sans-serif",
                    "variable": "--font-example", "dependency": "example-font",
                }}
            return io.BytesIO(json.dumps(data).encode())

        with (
            patch.object(sys, "argv", [str(SCRIPT), "sample-code", slug, "Example Theme"]),
            patch.object(add_theme.subprocess, "check_output", return_value=json.dumps({"values": values}).encode()),
            patch.object(add_theme.urllib.request, "urlopen", side_effect=response),
            contextlib.redirect_stdout(io.StringIO()),
        ):
            add_theme.main()
        return self.root / "themes" / slug

    def test_new_theme_writes_light_dark_shape_and_font_outputs(self):
        path = self.generate("example", heading="example-serif")
        theme = json.loads((path / "theme.json").read_text(encoding="utf-8"))
        self.assertTrue(theme["pickable"])
        self.assertEqual(theme["summary"], "")
        self.assertEqual(theme["install"], "npx shadcn@latest apply --preset sample-code")
        css = (path / "tokens.css").read_text(encoding="utf-8")
        for text in (
            ':root:not([data-theme="light"])', ':root[data-theme="dark"]',
            "@media (prefers-color-scheme: dark)", "--radius-lg: 8px;",
            '--font-heading: "Example Serif", serif;',
            "family=Example+Sans:wght@400;500;600;700&family=Example+Serif:wght@400;500;600;700",
        ):
            self.assertIn(text, css)
        front = (path / "DESIGN.md").read_text(encoding="utf-8")
        self.assertIn('  background: "#FFFFFF"', front)
        self.assertIn('  dark-background: "#000000"', front)
        self.assertIn("heading: {fontFamily: Example Serif,", front)
        self.assertIn("Install: `npx shadcn@latest apply --preset sample-code`.", front)
        item = json.loads((path / "registry-item.json").read_text(encoding="utf-8"))
        self.assertEqual(item["type"], "registry:theme")
        self.assertEqual(item["cssVars"]["dark"]["foreground"], "oklch(1 0 0)")

    def test_refresh_preserves_authored_settings_and_replaces_generated_values(self):
        path = self.generate("example")
        settings = {
            "pickable": False, "summary": "Keep this summary.", "mirror": "synthetic/example",
            "contrastExceptions": {"light:muted-foreground/muted": "Use on larger text."},
        }
        theme_path = path / "theme.json"
        theme_path.write_text(json.dumps({**settings, "preset": "old-code", "fonts": {}}), encoding="utf-8")
        prose = "\n## Overview\n\nKeep these authored rules.\n"
        (path / "DESIGN.md").write_text("---\nname: Old\n---\n" + prose, encoding="utf-8")
        self.generate("example")
        theme = json.loads(theme_path.read_text(encoding="utf-8"))
        for key, expected in settings.items():
            with self.subTest(key=key):
                self.assertEqual(theme[key], expected)
        self.assertEqual(theme["preset"], "sample-code")
        self.assertEqual(theme["fonts"]["sans"]["family"], "Example Sans")
        self.assertEqual((path / "DESIGN.md").read_text(encoding="utf-8").split("---\n", 2)[2], prose)
        registry = json.loads((self.root / "registry.json").read_text(encoding="utf-8"))
        self.assertEqual(len(registry["items"]), 1)

    def test_font_outage_uses_system_font_and_inherited_heading(self):
        path = self.generate("example", fonts_available=False)
        theme = json.loads((path / "theme.json").read_text(encoding="utf-8"))
        self.assertEqual(theme["fonts"]["sans"], {"family": "system-ui", "generic": "sans-serif"})
        self.assertIsNone(theme["fonts"]["heading"])
        self.assertIn("--font-heading: var(--font-sans);", (path / "tokens.css").read_text(encoding="utf-8"))
        self.assertIn("heading: {fontFamily: system-ui,", (path / "DESIGN.md").read_text(encoding="utf-8"))

    def test_registry_keeps_all_themes_in_slug_order_after_refresh(self):
        self.generate("zeta")
        self.generate("alpha")
        self.generate("zeta")
        registry = json.loads((self.root / "registry.json").read_text(encoding="utf-8"))
        self.assertEqual([item["name"] for item in registry["items"]], ["alpha", "zeta"])
        self.assertEqual(registry["name"], "arcforge")
        for item in registry["items"]:
            self.assertEqual(item["files"], [])
            self.assertEqual(item["cssVars"]["light"]["background"], "oklch(1 0 0)")
