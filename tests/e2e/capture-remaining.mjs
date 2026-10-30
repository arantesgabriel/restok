/* global process, console, document, innerWidth */
import { chromium } from "./runtime.mjs";
import { mkdir, writeFile } from "node:fs/promises";
const out="docs/restok-remaining/evidence";await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.RESTOK_CHROMIUM_EXECUTABLE});
const report={errors:[],screens:[],reference:[]};
try {
  if(process.env.AUDIT_SITE_TOKEN){
    const context=await browser.newContext({viewport:{width:1440,height:1000},extraHTTPHeaders:{"OAI-Sites-Authorization":`Bearer ${process.env.AUDIT_SITE_TOKEN}`}});
    const page=await context.newPage();await page.goto("https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/");
    await page.locator('#app').waitFor();await page.locator('[data-device="1440"]').click();
    for(const view of ["compra","casa","historico","pessoas"]){
      await page.locator(`.r2-nav [data-nav="${view}"]`).click();
      report.reference.push({view,title:await page.locator("#app h2").allTextContents()});
      await page.locator("#app").screenshot({path:`${out}/live-${view}.png`});
    }
    await writeFile(`${out}/live-reference.json`,JSON.stringify({url:"https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/",version:6,observations:report.reference},null,2));
    await context.close();
  }
  for(const [width,height] of [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce"});const page=await context.newPage();page.on("pageerror",error=>report.errors.push(error.message));
    for(const screen of ["shop","home","history","people"]){
      await page.goto(`http://127.0.0.1:4173/app?scenario=${screen === "history" ? "long" : "demo-v6"}#${screen}`);
      await page.locator('[data-app-main] h1').waitFor();await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:`${out}/${width}-${screen}.png`});
      report.screens.push({width,screen,title:await page.locator('[data-app-main] h1').innerText(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});
    }
    await context.close();
  }
} finally {await browser.close();await writeFile(`${out}/capture.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));

