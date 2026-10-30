import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
/* global document, innerWidth, innerHeight, getComputedStyle, URL */

const root = 'http://127.0.0.1:3012';
const output = path.resolve('docs/restok-visual-refactor/evidence/block0/screens');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const manifest = { kind: 'Next production public-route smoke / isolated build', at: new Date().toISOString(), engine: browser.version(), captures: [], checks: [], errors: [] };

try {
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    await context.route('**/*', (route) => new URL(route.request().url()).origin === root ? route.continue() : route.abort());
    for (const [id, route] of [['landing', '/'], ['login', '/login'], ['reset', '/reset-password']]) {
      const page = await context.newPage();
      page.on('pageerror', (error) => manifest.errors.push({ id, width, message: error.message }));
      const response = await page.goto(`${root}${route}`, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const heading = document.querySelector('h1');
        const body = document.body;
        return {
          viewport: { width: innerWidth, height: innerHeight },
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          heading: heading?.textContent?.trim() ?? null,
          headingColor: heading ? getComputedStyle(heading).color : null,
          bodyColor: getComputedStyle(body).color,
          bodyFont: getComputedStyle(body).fontFamily,
          themeCount: document.querySelectorAll('.restok-theme').length,
        };
      });
      const file = `next-${width}x${height}-${id}.png`;
      await page.screenshot({ path: path.join(output, file) });
      manifest.captures.push({ id, route, file, status: response?.status() ?? null, ...geometry });
      manifest.checks.push({ id, width, passed: Boolean(response?.ok()) && geometry.overflow === 0 && Boolean(geometry.heading) && geometry.themeCount > 0, overflow: geometry.overflow, themeCount: geometry.themeCount });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(path.resolve('docs/restok-visual-refactor/evidence/block0/next-public-smoke-manifest.json'), JSON.stringify(manifest, null, 2));
}

if (manifest.errors.length || manifest.checks.some((check) => !check.passed)) throw new Error('Next public route smoke failed; inspect next-public-smoke-manifest.json.');
