/* global process, console, document, getComputedStyle, innerWidth */
import { chromium } from "./runtime.mjs";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { URL } from "node:url";

const stage = process.argv[2] ?? "after";
if (!["before", "after"].includes(stage)) throw new Error("Use before or after");
const out = path.resolve("docs/restok-phase1/evidence", stage);
await mkdir(out, { recursive: true });
const report = { stage, at: new Date().toISOString(), kind: "Isolated real CSS/components, no backend", commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), diffSha256: createHash("sha256").update(execFileSync("git", ["diff", "--binary"])).digest("hex"), captures: [], checks: [], errors: [] };
const check = (name, pass, actual) => report.checks.push({ name, pass, actual });
const referenceTokens = JSON.parse(await readFile("docs/restok-demo-v6-handoff/original/dist/handoff/tokens.v1.json", "utf8"));
const expectedColors = Object.entries(referenceTokens.color).map(([name, token]) => ({
  role: name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`),
  hex: token.$value ?? Object.values(token)[0].$value,
}));
const browser = await chromium.launch({ executablePath: process.env.RESTOK_CHROMIUM_EXECUTABLE });
report.engine = browser.version();
try {
  for (const [width, height] of [[320,640],[390,844],[1440,900],[1920,1080]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    await context.route("**/*", r => new URL(r.request().url()).origin === "http://127.0.0.1:4173" ? r.continue() : r.abort());
    const page = await context.newPage();
    page.on("pageerror", e => report.errors.push(e.message));
    await page.goto("http://127.0.0.1:4173/foundations.html");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    const file = `${width}-${height}-foundations.png`;
    await page.screenshot({ path: path.join(out, file), fullPage: true });
    report.captures.push({ file, viewport: { width, height }, dpr: 1 });
    const metrics = await page.evaluate(() => {
      const root = document.querySelector(".restok-theme"), style = getComputedStyle(root);
      const color = role => { const node = document.createElement("span"); root.append(node); node.style.color = `var(--color-${role})`; const value = getComputedStyle(node).color.match(/[\d.]+/g).map(Number); node.remove(); return value; };
      const lum = rgb => rgb.map(n => { const c = n / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, n, i) => sum + n * [.2126,.7152,.0722][i], 0);
      const pairs = [["ink","canvas"],["surface","action"],["highlight","brand"],["info","canvas"],["danger","surface-danger"],["warning","surface-warning"]].map(([fg,bg]) => { const a = lum(color(fg)), b = lum(color(bg)); return { fg,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05) }; });
      return { overflow: document.documentElement.scrollWidth - innerWidth, font: style.fontFamily, fontLoaded: document.fonts.check('800 16px "Restok Manrope"'), pairs, gutter: style.getPropertyValue("--layout-gutter").trim() };
    });
    check(`${width}: foundations fit`, metrics.overflow === 0, metrics);
    check(`${width}: text contrast`, metrics.pairs.every(p => p.ratio >= 4.5), metrics.pairs);
    const canonical = await page.locator(".foundation-preview").evaluate((root, colors) => colors.map(({role,hex}) => {
      const sample = document.createElement("span"); root.append(sample); sample.style.color = `var(--color-${role})`;
      const actual = getComputedStyle(sample).color;
      sample.style.color = hex; const expected = getComputedStyle(sample).color; sample.remove();
      return { role, expected, actual, pass: actual === expected };
    }), expectedColors);
    check(`${width}: 17 canonical colors`, canonical.every(c => c.pass), canonical);
    if (stage === "after") {
      const gutter = await page.locator(".foundation-preview").evaluate(e => getComputedStyle(e).paddingLeft);
      check(`${width}: responsive gutter token`, gutter === `${width < 390 ? 12 : width < 1024 ? 16 : 24}px`, gutter);
    }
    const cdp = await context.newCDPSession(page);
    await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument");
    const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: "h1" });
    const fonts = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    check(`${width}: real Manrope glyphs`, fonts.fonts.some(f => f.isCustomFont && /Manrope/.test(f.familyName)), fonts);
    await page.getByRole("button", { name: "Começar compra" }).focus();
    await page.keyboard.press("Tab");
    const focus = await page.locator("input").first().evaluate(e => { const s = getComputedStyle(e); return { visible: e.matches(":focus-visible"), width: s.outlineWidth, color: s.outlineColor, offset: s.outlineOffset, shadow: s.boxShadow }; });
    await page.screenshot({ path: path.join(out, `${width}-${height}-focus.png`) });
    if (stage === "after") check(`${width}: keyboard focus`, focus.visible && focus.width === "2px" && focus.offset === "3px" && focus.color === "rgb(45, 90, 39)", focus);
    else report.checks.push({ name: `${width}: baseline focus`, pass: null, actual: focus });
    if (stage === "after") {
      for (const label of ["Produto", "Preço inválido", "Preço unitário", "Quantidade"]) {
        const input = page.getByRole("textbox", { name: label, exact: true });
        await input.focus();
        const m = await input.evaluate(e => {
          const own = getComputedStyle(e), parent = getComputedStyle(e.parentElement);
          return { invalid:e.getAttribute("aria-invalid"), edge:own.borderColor, outline:own.outlineWidth, wrapperOutline:parent.outlineWidth, wrapperColor:parent.outlineColor };
        });
        check(`${width}: ${label} visible focus`, m.outline === "2px" || (m.wrapperOutline === "2px" && m.wrapperColor === "rgb(45, 90, 39)"), m);
        if (label === "Preço inválido") check(`${width}: error edge survives focus`, m.edge === "rgb(185, 65, 50)", m);
        await page.screenshot({ path:path.join(out, `${width}-${height}-field-${label === "Preço unitário" ? "money" : label === "Quantidade" ? "quantity" : label === "Produto" ? "normal" : "error"}.png`) });
      }
      const iconStroke = await page.locator(".foundation-icons svg").first().evaluate(e => getComputedStyle(e).strokeWidth);
      check(`${width}: light icons`, iconStroke === "1.75px", iconStroke);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    const durations = await page.locator(".foundation-preview").evaluate(e => Object.fromEntries(["feedback","state","enter","exit"].map(role => [role,getComputedStyle(e).getPropertyValue(`--duration-${role}`).trim()])));
    check(`${width}: reduced motion`, Object.values(durations).every(v => v === "0ms"), durations);
    // Smoke the production CSS import path and real components. No backend requests allowed.
    await page.goto("http://127.0.0.1:4173/app");
    await page.getByRole("button", { name: "Perfil de Pessoa de teste" }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    const budget = await page.locator("[data-budget-summary]").evaluate(e => ({ color: getComputedStyle(e).color, background: getComputedStyle(e).backgroundColor }));
    check(`${width}: budget cascade`, budget.color === "rgb(255, 255, 255)" && budget.background === "rgb(33, 63, 29)", budget);
    for (const [id, label] of [["compra",null],["casa","Casa"],["historico","Histórico"]]) {
      if (label) await page.getByRole("button", { name: label, exact: true }).first().click();
      await page.screenshot({ path: path.join(out, `${width}-${height}-${id}.png`) });
      check(`${width}: ${id} fits`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), null);
    }
    for (const route of ["login", ""]) {
      await page.goto(`http://127.0.0.1:4173/${route}`);
      await page.locator("h1").first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, `${width}-${height}-${route || "landing"}.png`) });
      check(`${width}: ${route || "landing"} fits`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), null);
    }
    await context.close();
  }
  // Block the font files to verify the system fallback remains usable.
  const fallback = await browser.newContext({ viewport: { width: 320, height: 640 } });
  await fallback.route("**/*", r => r.request().url().endsWith(".woff2") || new URL(r.request().url()).origin !== "http://127.0.0.1:4173" ? r.abort() : r.continue());
  const page = await fallback.newPage();
  await page.goto("http://127.0.0.1:4173/foundations.html");
  await page.evaluate(() => document.fonts.ready);
  check("fallback fits", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), null);
  await page.screenshot({ path: path.join(out, "320-fallback.png"), fullPage: true });
  await fallback.close();
  if (stage === "after") {
    // Reference stays unmodified on disk. Supply the same licensed Manrope locally,
    // because the original fetches Google Fonts; record this controlled substitution.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await context.route("**/*", r => new URL(r.request().url()).origin === "http://127.0.0.1:4173" ? r.continue() : r.abort());
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/@fs/C:/Fontes/restok/docs/restok-demo-v6-handoff/original/dist/index.html");
    await page.addStyleTag({ content: '@font-face{font-family:Manrope;src:url("/fonts/manrope/manrope-latin-variable.woff2");font-weight:400 800}' });
    for (const [width,height] of [[320,640],[390,844],[1440,900]]) {
      await page.locator(`[data-device="${width}"]`).click();
      await page.evaluate(() => document.fonts.ready);
      // Remove only laboratory scaling; preserve the app's own dimensions/styles.
      await page.locator("#app").evaluate(e => { e.style.transform = "none"; });
      await page.locator("#app").screenshot({ path: path.join(out, `reference-${width}-${height}.png`) });
      report.captures.push({ file: `reference-${width}-${height}.png`, kind: "Original v6 app canvas; laboratory scale removed; local Manrope substitution", mode: { width,height } });
    }
    await context.close();
  }
} finally {
  await browser.close();
  report.sourceHash = createHash("sha256").update(await readFile("styles/tokens.css")).digest("hex");
  report.sources = await Promise.all(["styles/tokens.css", "styles/base.css", "styles/responsive.css", "styles/motion.css", "components/ui/numeric-fields.module.css", "tailwind.raiz.config.ts", "tests/e2e/foundations.tsx", "tests/e2e/foundations.css", "tests/e2e/capture-phase1.mjs"].map(async file => ({ file, sha256:createHash("sha256").update(await readFile(file)).digest("hex") })));
  report.artifacts = (await readdir(out)).filter(file => file.endsWith(".png"));
  await writeFile(path.join(out, "manifest.json"), JSON.stringify(report,null,2));
}
console.log(JSON.stringify({ stage, checks: report.checks.length, failed: report.checks.filter(c => c.pass === false), errors: report.errors }));
if (report.errors.length || report.checks.some(c => c.pass === false)) process.exitCode = 1;
