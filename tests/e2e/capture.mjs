/* global process, console, document, innerWidth, innerHeight, localStorage */
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL, URL } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const modulePath = process.env.RESTOK_PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const out = path.resolve(process.argv[2] ?? "docs/restok-refactor-plan/evidence/pr01/browser");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.RESTOK_CHROMIUM_EXECUTABLE });
const manifest = { kind: "E2E-FIXTURE", capturedAt: new Date().toISOString(), commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), diffSha256: createHash("sha256").update(execFileSync("git", ["diff", "--binary"])).digest("hex"), engine: browser.version(), zoom: 1, dpr: 1, reducedMotion: "no-preference emulated", captures: [], blockedRequests: [], errors: [] };
try {
  for (const [width, height] of [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "no-preference", recordVideo: { dir: out, size: { width, height } } });
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== "http://127.0.0.1:4173") { manifest.blockedRequests.push(url.origin); return route.abort(); }
      return route.continue();
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => manifest.errors.push(error.message));
    const started = Date.now();
    const captures = [];
    async function capture(id) {
      await page.waitForTimeout(350);
      const filename = `${width}-${height}-${id}.png`;
      await page.screenshot({ path: path.join(out, filename) });
      const geometry = await page.evaluate(() => {
        const rect = (node) => node ? JSON.parse(JSON.stringify(node.getBoundingClientRect())) : null;
        return { viewport: { width: innerWidth, height: innerHeight }, row: rect(document.querySelector("article")), dock: rect(document.querySelector("[data-purchase-footer]")), header: rect(document.querySelector("header")), documentWidth: document.documentElement.scrollWidth };
      });
      const current = new URL(page.url());
      const item = { id, file: filename, route: current.pathname + current.search + current.hash, fixture: current.searchParams.get("scenario") ?? "long-33", viewport: { width, height }, scriptElapsedMs: Date.now() - started, geometry, mediaSeek: null };
      captures.push(item);
      manifest.captures.push(item);
    }
    await page.goto("http://127.0.0.1:4173/app");
    await page.getByRole("button", { name: "Perfil de Pessoa de teste" }).waitFor();
    await capture("shop");
    await page.getByRole("button", { name: "Editar Cebola", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await capture("editor");
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Casa", exact: true }).first().click();
    await capture("home");
    await page.getByRole("button", { name: "Casas e pessoas", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await capture("people");
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Histórico", exact: true }).first().click();
    await capture("history");
    await page.getByRole("button", { name: /Compras de Agosto/ }).click();
    await capture("history-detail");
    await page.goto("http://127.0.0.1:4173/app?scenario=empty");
    await page.getByRole("button", { name: "Perfil de Pessoa de teste" }).waitFor();
    await capture("empty");
    await page.evaluate(() => localStorage.clear());
    await page.goto("http://127.0.0.1:4173/app?scenario=error");
    await page.getByText("Não foi possível carregar os dados da casa. Verifique a conexão e tente novamente.").waitFor();
    await capture("error");
    for (const [route, id] of [["/login", "login"], ["/reset-password", "reset-password"], ["/", "landing"]]) {
      await page.goto(`http://127.0.0.1:4173${route}`);
      await page.locator("h1").waitFor();
      await capture(id);
    }
    const video = page.video();
    await context.close();
    const videoName = `${width}-${height}-journey.webm`;
    await video.saveAs(path.join(out, videoName));
    await video.delete();
    captures.forEach((capture) => { capture.video = videoName; });
    console.log(`${width}x${height}: ${captures.length} captures`);
  }
} finally {
  await browser.close();
  await writeFile(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
}
if (manifest.errors.length || manifest.blockedRequests.length) throw new Error("Fixture had browser errors or attempted external requests; inspect manifest.");
