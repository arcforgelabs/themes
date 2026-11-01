// Run with: PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/check-clarity.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'themes/clarity');
const out = path.join(root, 'evidence/clarity');
await fs.mkdir(out, { recursive: true });
const html = await fs.readFile(path.join(dir, 'preview.html'), 'utf8');
const css = await fs.readFile(path.join(dir, 'tokens.css'), 'utf8');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
const results = { date: new Date().toISOString(), browser: browser.version(), platform: process.platform, fonts: {}, cases: [] };
try {
  const context = await browser.newContext();
  await context.setOffline(true);
  const page = await context.newPage();
  const requests = [];
  page.on('request', r => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
  await page.setContent(html.replace('<link rel="stylesheet" href="tokens.css">', '<style>' + css + '</style>'));
  await page.evaluate(async () => { await document.fonts.load('400 16px OpenDyslexic'); await document.fonts.load('700 16px OpenDyslexic'); await document.fonts.ready; });
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  async function fonts(selector) {
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    return (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts;
  }
  for (const selector of ['#body', '#heading', '#bold', '#open']) {
    const actual = await fonts(selector); results.fonts[selector] = actual;
    assert(actual.some(f => f.isCustomFont && /OpenDyslexic/.test(f.familyName) && f.glyphCount > 0), selector + ': actual custom glyph face');
  }
  results.fonts.mono = await fonts('#mono');
  assert(!results.fonts.mono.some(f => /OpenDyslexic/.test(f.familyName)), 'intentional mono retained');
  results.fonts.fallback = await fonts('#fallback');
  assert(results.fonts.fallback.some(f => !f.isCustomFont && f.glyphCount > 0), 'missing glyph fallback');
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const mode of ['light', 'dark']) {
      await page.locator('[data-mode="' + mode + '"]').click();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + '/' + mode + ': no horizontal overflow');
      await page.screenshot({ path: path.join(out, width + '-' + mode + '.png'), fullPage: true });
      results.cases.push({ width, mode, overflow: false });
    }
  }
  await page.locator('#open').click();
  results.fonts.popup = await fonts('#popup');
  assert(results.fonts.popup.some(f => f.isCustomFont && /OpenDyslexic/.test(f.familyName)), 'popup glyph face');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(el => el.open), false);
  await page.locator('[data-mode="auto"]').click();
  await page.emulateMedia({ colorScheme: 'light' });
  const light = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: 'dark' });
  assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), light, 'auto follows system');
  await page.locator('[data-mode="light"]').click();
  assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), light, 'explicit light beats system dark');
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.addStyleTag({ content: 'html{font-size:200%}*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '200% text and spacing reflow');
  await page.screenshot({ path: path.join(out, '320-spacing-200.png'), fullPage: true });
  assert.deepEqual(requests, [], 'offline font rendering without external requests');
  await context.close();
  const blocked = await browser.newContext();
  const fallback = await blocked.newPage();
  await fallback.setContent(html.replace('<link rel="stylesheet" href="tokens.css">', `<meta http-equiv="Content-Security-Policy" content="font-src 'none'"><style>` + css + '</style>'));
  const bcdp = await blocked.newCDPSession(fallback);
  await bcdp.send('DOM.enable'); await bcdp.send('CSS.enable');
  const { root: bRoot } = await bcdp.send('DOM.getDocument');
  const { nodeId } = await bcdp.send('DOM.querySelector', { nodeId: bRoot.nodeId, selector: '#body' });
  results.blockedFonts = (await bcdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts;
  assert(results.blockedFonts.some(f => !f.isCustomFont && f.glyphCount > 0), 'blocked font remains readable');
  await blocked.close();
  await fs.writeFile(path.join(out, 'browser-result.json'), JSON.stringify(results, null, 2) + '\n');
  console.log('PASS Clarity: offline actual glyphs, 8 light/dark viewports, mode, popup, mono, fallback, 200% text/spacing');
} finally { await browser.close(); }
