/* global process, console, document, innerWidth, getComputedStyle */
import { chromium } from "./runtime.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.resolve("docs/restok-refactor-plan/evidence/pr03/browser");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.RESTOK_CHROMIUM_EXECUTABLE });
const report = { engine: browser.version(), kind: "E2E-FIXTURE isolated foundations", captures: [], errors: [] };
try {
  for (const [width,height] of [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900]]) {
    const context = await browser.newContext({ viewport: { width,height }, deviceScaleFactor: 1, recordVideo: { dir: out, size: { width,height } } });
    const page = await context.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/foundations.html");
    await page.evaluate(() => document.fonts.ready);
    const checks = await page.evaluate(() => {
      const root = document.querySelector(".restok-theme");
      const pixel = (role) => { const element = document.createElement("span"); root.append(element); element.style.color = `var(--color-${role})`; const rgb = getComputedStyle(element).color.match(/[\d.]+/g).map(Number); element.remove(); return rgb; };
      const lum = (rgb) => rgb.map((value) => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; }).reduce((sum,value,index) => sum + value * [.2126,.7152,.0722][index], 0);
      const pairs = [["ink","canvas",4.5],["muted","canvas",4.5],["surface","action",4.5],["highlight","brand",4.5],["info","canvas",4.5],["danger","surface-danger",4.5],["warning","surface-warning",4.5],["info","surface",3],["action","canvas",3]].map(([fg,bg,min]) => { const a = lum(pixel(fg)), b = lum(pixel(bg)); return {fg,bg,min,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)}; });
      return { pairs, overflow: document.documentElement.scrollWidth > innerWidth, font: getComputedStyle(root).fontFamily, weight800: document.fonts.check('800 16px "Restok Manrope"'), legacyCss: [...document.styleSheets].some((sheet) => /app\/(globals|ui|landing)\.css/.test(sheet.href ?? "")) };
    });
    if (checks.overflow || checks.legacyCss || !checks.weight800 || checks.pairs.some((pair) => pair.ratio < pair.min)) throw new Error("Foundation gate failed");
    const file = `${width}-${height}.png`;
    await page.screenshot({ path: path.join(out,file) });
    await page.screenshot({ path: path.join(out,`${width}-${height}-full.png`), fullPage: true });
    const cdp = await context.newCDPSession(page);
    await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument");
    const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: "h1" });
    const platformFonts = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    report.captures.push({id:"foundations",file,video:`${width}-${height}.webm`,viewport:{width,height},checks,platformFonts});
    await page.getByRole("button", {name:"Começar compra"}).focus();
    await page.keyboard.press("Tab");
    const focusFile = `${width}-${height}-focus.png`;
    await page.screenshot({path:path.join(out,focusFile)});
    report.captures.push({id:"keyboard-focus",file:focusFile,video:`${width}-${height}.webm`,viewport:{width,height}});
    const video = page.video();
    await context.close();
    await video.saveAs(path.join(out,`${width}-${height}.webm`)); await video.delete();
  }
  const fallback = await browser.newContext({viewport:{width:390,height:844}});
  await fallback.route("**/*.woff2", (route) => route.abort());
  const page = await fallback.newPage();
  await page.goto("http://127.0.0.1:4173/foundations.html");
  await page.screenshot({path:path.join(out,"390-fallback.png"),fullPage:true});
  await fallback.close();
} finally { await browser.close(); await writeFile(path.join(out,"manifest.json"),JSON.stringify(report,null,2)); }
if (report.errors.length) throw new Error("Browser errors in foundations");
console.log("Six viewports, computed contrast/font/overflow and fallback captured.");
