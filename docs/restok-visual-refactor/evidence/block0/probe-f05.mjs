import { chromium } from "file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
/* global process, URL, document, getComputedStyle */

const output = path.dirname(fileURLToPath(import.meta.url));
const phase = process.argv[2] === "after" ? "after" : "before";
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const manifest = { kind: "F-05 cascade comparison / local fixtures only", phase, at: new Date().toISOString(), commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), engine: browser.version(), viewport: { width: 320, height: 640 }, captures: [], errors: [] };

try {
  const context = await browser.newContext({ viewport: manifest.viewport, deviceScaleFactor: 1 });
  await context.route("**/*", (route) => {
    const origin = new URL(route.request().url()).origin;
    return ["http://127.0.0.1:4173", "http://localhost:3011"].includes(origin) ? route.continue() : route.abort();
  });
  for (const target of [
    { id: "vite", url: "http://127.0.0.1:4173/app?scenario=long" },
    { id: "next", url: "http://localhost:3011/block0-probe", wait: (page) => page.locator("[data-budget-summary]").waitFor() },
  ]) {
    const page = await context.newPage();
    page.on("pageerror", (error) => manifest.errors.push({ target: target.id, message: error.message }));
    await page.goto(target.url, { waitUntil: "domcontentloaded" });
    if (target.id === "vite") await page.getByRole("button", { name: "Perfil de Pessoa de teste" }).waitFor();
    else await target.wait(page);
    await page.evaluate(() => document.fonts.ready);
    const measured = await page.evaluate(() => {
      const budget = document.querySelector("[data-budget-summary]");
      const label = budget ? Array.from(budget.querySelectorAll("span")).find((element) => element.textContent?.trim() === "Total registrado") : null;
      const value = budget?.querySelector("strong");
      const rules = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (!rule.selectorText || !rule.style?.getPropertyValue("color")) continue;
            if (/restok-theme|budget|primary|button/i.test(rule.selectorText)) rules.push({ selector: rule.selectorText, color: rule.style.getPropertyValue("color"), important: rule.style.getPropertyPriority("color") === "important" });
          }
        } catch { /* Cross-origin or inaccessible stylesheet. */ }
      }
      return {
        documentTheme: document.documentElement.className,
        budgetClass: budget?.className ?? null,
        budgetColor: budget ? getComputedStyle(budget).color : null,
        labelColor: label ? getComputedStyle(label).color : null,
        valueColor: value ? getComputedStyle(value).color : null,
        backgroundColor: budget ? getComputedStyle(budget).backgroundColor : null,
        matchingColorRulesInStylesheetOrder: rules,
      };
    });
    const file = `f05-${phase}-${target.id}.png`;
    await page.screenshot({ path: path.join(output, file) });
    manifest.captures.push({ id: target.id, route: new URL(page.url()).pathname + new URL(page.url()).search, file, computed: measured });
    await page.close();
  }
  await context.close();
} finally {
  await browser.close();
  await writeFile(path.join(output, `f05-${phase}.json`), JSON.stringify(manifest, null, 2));
}
if (manifest.errors.length || manifest.captures.some((capture) => !capture.computed.budgetColor)) throw new Error(`F-05 ${phase} probe did not render cleanly; inspect manifest.`);
