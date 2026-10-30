import { chromium } from "file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
/* global document, innerWidth, innerHeight, getComputedStyle, URL */

const output = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const manifest = { kind: "AppShell optional context region / isolated local Next fixture", at: new Date().toISOString(), commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), engine: browser.version(), captures: [], checks: [], errors: [] };

try {
  for (const [width, height] of [[1024, 768], [1280, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    await context.route("**/*", (route) => new URL(route.request().url()).origin === "http://localhost:3011" ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on("pageerror", (error) => manifest.errors.push({ width, message: error.message }));
    await page.goto("http://localhost:3011/block0-probe", { waitUntil: "domcontentloaded" });
    await page.locator("[data-app-context]").waitFor();
    const geometry = await page.evaluate(() => {
      const rect = (element) => { const box = element?.getBoundingClientRect(); return box ? { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom } : null; };
      const sidebar = document.querySelector("[data-app-sidebar]");
      const navigation = document.querySelector('[class*="_navigation_"]');
      const work = document.querySelector("[data-app-work]");
      const region = document.querySelector("[data-app-context]");
      const workspace = work?.parentElement;
      return {
        viewport: { width: innerWidth, height: innerHeight },
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        sidebar: { ...rect(sidebar), display: sidebar ? getComputedStyle(sidebar).display : null },
        navigation: { ...rect(navigation), display: navigation ? getComputedStyle(navigation).display : null },
        workspace: { ...rect(workspace), columns: workspace ? getComputedStyle(workspace).gridTemplateColumns : null },
        work: rect(work),
        context: { ...rect(region), display: region ? getComputedStyle(region).display : null, position: region ? getComputedStyle(region).position : null, label: region?.getAttribute("aria-label") ?? null },
      };
    });
    const file = `shell-context-${width}x${height}.png`;
    await page.screenshot({ path: path.join(output, file) });
    manifest.captures.push({ file, route: "/block0-probe", geometry });
    manifest.checks.push({ width, height, id: "no-overflow", passed: geometry.overflow === 0, overflow: geometry.overflow });
    if (width === 1024) manifest.checks.push({ width, height, id: "intermediate-navigation", passed: geometry.sidebar.display === "flex" && geometry.navigation.display === "none" && geometry.workspace.columns.split(" ").length === 1 });
    if (width === 1280) manifest.checks.push({ width, height, id: "optional-context-column", passed: geometry.sidebar.display === "flex" && geometry.navigation.display === "none" && geometry.context.width === 256 && geometry.work.width >= 560 && geometry.context.position === "sticky" && geometry.workspace.columns.split(" ").length === 2 });
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(path.join(output, "shell-context-manifest.json"), JSON.stringify(manifest, null, 2));
}

if (manifest.errors.length || manifest.checks.some((check) => !check.passed)) throw new Error("AppShell context or intermediate layout check failed; inspect shell-context-manifest.json.");
