/* global process, console, document, window, innerWidth, innerHeight, getComputedStyle */
import { chromium } from "./runtime.mjs";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { URL } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const stage = process.argv[2];
if (!["phase2-before", "phase2-after", "phase3-after"].includes(stage)) throw new Error("Choose phase2-before, phase2-after or phase3-after");
const out = path.resolve("docs/restok-phase23/evidence", stage);
await mkdir(out,{recursive:true});
const report={stage,at:new Date().toISOString(),kind:"Isolated real components/CSS, local fixtures only",fixture:"demo-v6: original names, quantity, price, status, budget; categories mapped to real domain",dpr:1,reducedMotion:"reduce",checks:[],captures:[],errors:[]};
const check=(name,pass,actual)=>report.checks.push({name,pass,actual});
const browser=await chromium.launch({executablePath:process.env.RESTOK_CHROMIUM_EXECUTABLE});
report.engine=browser.version();
try {
  for(const [width,height] of [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]) {
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"reduce"});
    await context.route("**/*",r=>new URL(r.request().url()).origin==="http://127.0.0.1:4173"?r.continue():r.abort());
    const page=await context.newPage();page.on("pageerror",e=>report.errors.push(e.message));
    const capture=async id=>{
      await page.evaluate(()=>document.fonts.ready);
      const m=await page.evaluate(()=>{
        const rect=e=>e?JSON.parse(JSON.stringify(e.getBoundingClientRect())):null;
        const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=="hidden";
        return {width:innerWidth,height:innerHeight,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),sidebar:rect(document.querySelector("[data-app-sidebar]")),houseCount:[...document.querySelectorAll('button[aria-label^="Casas e pessoas:"]')].filter(visible).length,navigations:[...document.querySelectorAll('nav[aria-label="Navegação principal"]')].filter(visible).length,work:rect(document.querySelector("[data-app-work]")),dock:[...document.querySelectorAll("[data-shopping-dock]")].filter(visible).map(rect),budget:rect(document.querySelector("[data-budget-summary]")),rows:[...document.querySelectorAll("[data-shopping-row]")].slice(0,6).map(rect)};
      });
      const file=`${width}-${height}-${id}.png`;await page.screenshot({path:path.join(out,file)});report.captures.push({file,...m});
      check(`${width}/${id}: no overflow`,m.overflow===0,m.overflow);
      return m;
    };
    await page.goto("http://127.0.0.1:4173/app?scenario=demo-v6");
    await page.getByRole("heading",{name:"Compra da semana",exact:true}).waitFor();
    const shell=await capture("compra");
    if(stage!=="phase2-before") {
      check(`${width}: one house selector`,shell.houseCount===1,shell.houseCount);
      check(`${width}: one visible navigation`,shell.navigations===1,shell.navigations);
      check(`${width}: sidebar uses useful width`,width<1024?shell.sidebar.height<=52:shell.sidebar.width===228,shell.sidebar);
      check(`${width}: dock only below1024`,width<1024?shell.dock.length===1:shell.dock.length===0,shell.dock);
      check(`${width}: same reference total`,await page.locator("[data-budget-summary]").innerText().then(t=>t.includes("50,68")),null);
      if(width===320)check("320: at least one full shopping row above dock",shell.rows.some(r=>r.bottom<=shell.dock[0]?.y),shell.rows);
    }
    await page.getByRole("button",{name:"Casa",exact:true}).filter({visible:true}).click();
    await capture("casa");
    await page.getByRole("button",{name:"Histórico",exact:true}).filter({visible:true}).click();
    await capture("historico");
    // Open management via the existing account shortcut before Phase 2,
    // via the single house selector afterwards. Both call the real handler.
    if(stage==="phase2-before") {await page.getByRole("button",{name:"Perfil de Pessoa de teste"}).click();await page.getByRole("menuitem",{name:"Casas e pessoas"}).click();}
    else await page.getByRole("button",{name:"Casas e pessoas: Nossa Casa",exact:true}).click();
    await page.getByRole("dialog").waitFor();await capture("pessoas");
    await page.keyboard.press("Escape");await page.getByRole("dialog").waitFor({state:"hidden"});
    if(stage!=="phase2-before")check(`${width}: management returns focus`,await page.getByRole("button",{name:"Casas e pessoas: Nossa Casa",exact:true}).evaluate(e=>e===document.activeElement),null);
    await page.goto("http://127.0.0.1:4173/components.html");await page.waitForLoadState("networkidle");
    await page.getByRole("heading",{name:"Componentes da casa"}).waitFor();
    await page.screenshot({path:path.join(out,`${width}-${height}-components-full.png`),fullPage:true});
    if(stage==="phase3-after") {
      for(const label of ["Nome da compra","Nome inválido","Preço de exemplo"]) {
        const field=page.getByRole("textbox",{name:label,exact:true});await field.focus();
        const state=await field.evaluate(e=>{const s=getComputedStyle(e),p=getComputedStyle(e.parentElement);return {font:s.fontSize,height:e.getBoundingClientRect().height,border:s.borderColor,focus:s.outlineWidth,wrapperFocus:p.outlineWidth};});
        check(`${width}/${label}: input16 and touch44`,state.font==="16px"&&state.height>=44,state);
        check(`${width}/${label}: visible keyboard focus`,state.focus==="2px"||state.wrapperFocus==="2px",state);
        if(label==="Nome inválido") {
          await field.hover();
          check(`${width}: hover preserves error`,await field.evaluate(e=>getComputedStyle(e).borderColor)==="rgb(185, 65, 50)",null);
        }
      }
      check(`${width}: disabled and busy protected`,await page.getByRole("button",{name:"Indisponível",exact:true}).isDisabled()&&await page.getByRole("button",{name:"Salvando",exact:true}).isDisabled(),null);
      await page.getByRole("button",{name:"Adicionar item",exact:true}).hover();
      await page.getByRole("region",{name:"Botões",exact:true}).screenshot({path:path.join(out,`${width}-${height}-button-states.png`)});
      await page.getByRole("button",{name:"Ver confirmação"}).click();
      const dismiss=page.getByRole("button",{name:"Dispensar aviso"});await dismiss.waitFor();await page.keyboard.press("Tab");await dismiss.focus();
      check(`${width}: toast focus on dark`,await dismiss.evaluate(e=>getComputedStyle(e).outlineColor)==="rgb(180, 211, 167)",null);
      await page.screenshot({path:path.join(out,`${width}-${height}-toast.png`)});await dismiss.click();
      await dismiss.waitFor({state:"hidden"});
    }
    await page.getByRole("button",{name:"Abrir 100 itens"}).click();
    const dialog=page.getByRole("dialog");await dialog.waitFor();await capture("sheet100");
    const geometry=await dialog.locator("[data-sheet-footer]").evaluate(e=>{const b=e.getBoundingClientRect();return {top:b.top,bottom:b.bottom,height:b.height};});
    check(`${width}: sheet footer reachable`,geometry.top>=0&&geometry.bottom<=height,geometry);
    await page.keyboard.press("Escape");await dialog.waitFor({state:"hidden"});
    check(`${width}: sheet returns focus`,await page.getByRole("button",{name:"Abrir 100 itens"}).evaluate(e=>e===document.activeElement),null);
    await page.getByRole("button",{name:"Menu de exemplo"}).click();await page.getByRole("menu").waitFor();await capture("menu");
    await page.keyboard.press("End");check(`${width}: menu keyboard`,await page.getByRole("menuitem",{name:"Última ação"}).evaluate(e=>e===document.activeElement),null);
    await page.keyboard.press("Escape");check(`${width}: menu focus return`,await page.getByRole("button",{name:"Menu de exemplo"}).evaluate(e=>e===document.activeElement),null);
    if(stage!=="phase2-before") {
      await page.goto("http://127.0.0.1:4173/app?scenario=notice");await page.getByRole("button",{name:"Perfil de Pessoa de teste"}).waitFor();
      const summary=page.locator("[data-global-notice] summary");await summary.click();await capture("notice");
      const box=await page.locator("[data-global-notice-panel]").boundingBox();check(`${width}: notice stays in viewport`,box.x>=0&&box.x+box.width<=width&&box.y>=0&&box.y+box.height<=height,box);
      await page.keyboard.press("Escape");check(`${width}: notice Escape`,await page.locator("[data-global-notice]").evaluate(e=>!e.open&&e.querySelector("summary")===document.activeElement),null);
      await page.goto("http://127.0.0.1:4173/shell.html");await page.getByRole("heading",{name:"Shell isolado · fixture local"}).waitFor();await capture("optional-context");
      const layout=await page.evaluate(()=>{
        const work=document.querySelector("[data-app-work]").getBoundingClientRect();const context=document.querySelector("[data-app-context]");
        return {work:work.width,context:context.getBoundingClientRect().width,visible:!!context.getClientRects().length};
      });
      check(`${width}: optional context only with room`,width>=1280?layout.visible&&layout.work>=560&&layout.context===256:!layout.visible,layout);
    }
    if(stage==="phase3-after"&&[320,390,1440,1920].includes(width)) {
      for(const scenario of ["money","money-equal","money-over","stress"]) {
        await page.goto(`http://127.0.0.1:4173/app?scenario=${scenario}`);await page.locator("[data-budget-summary]").waitFor();
        await capture(scenario);
        const values=await page.locator("[data-budget-summary]").evaluate(e=>({over:e.getAttribute("data-budget-over"),text:e.textContent,overflow:[...e.querySelectorAll("strong,b")].map(n=>({text:n.textContent,overflows:n.scrollWidth>Math.ceil(n.getBoundingClientRect().width)}))}));
        check(`${width}/${scenario}: complete financial digits`,values.overflow.every(v=>!v.overflows),values);
        if(scenario==="money-equal")check(`${width}: exact budget`,values.over==="false"&&values.text.includes("15,00"),values);
        if(scenario==="money-over")check(`${width}: excess preserved`,values.over==="true"&&values.text.includes("5,00"),values);
        if(width<1024) {
          await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
          const last=await page.locator("[data-shopping-row]").last().boundingBox(),dock=await page.locator("[data-shopping-dock]").boundingBox();
          check(`${width}/${scenario}: last row clear of dock`,last.y+last.height<=dock.y+1,{last,dock});
          const digits=await page.locator("[data-dock-total]").evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return {lines:range.getClientRects().length,width:range.getBoundingClientRect().width,available:e.closest("button").getBoundingClientRect().width};});
          check(`${width}/${scenario}: dock amount never splits digits`,digits.lines===1&&digits.width<=digits.available,digits);
        }
      }
      await page.goto("http://127.0.0.1:4173/app?scenario=demo-v6");await page.getByRole("button",{name:"Marcar Azeite extravirgem como comprado",exact:true}).click();
      await page.getByRole("button",{name:"Dispensar aviso"}).waitFor();
      check(`${width}: shared toast consumes real confirmed state`,await page.locator("[data-budget-summary]").innerText().then(text=>text.includes("88,58")),null);
      await page.screenshot({path:path.join(out,`${width}-${height}-confirmed-state.png`)});
    }
    await context.close();
  }
} finally {
  await browser.close();
  report.artifacts=(await readdir(out)).filter(f=>f.endsWith(".png"));
  const sources=["components/app/app-shell.tsx","components/app/app-shell.module.css","components/app/navigation.module.css","components/ui/controls.module.css","components/ui/numeric-fields.module.css","components/ui/feedback.module.css","components/ui/overlay.module.css","components/ui/search-field.tsx","components/ui/action-menu.tsx","components/shopping/item-row.tsx","components/shopping/shopping-dock.tsx","components/products/product-row.tsx","components/shopping/shopping-controls.module.css","components/shopping/shopping.module.css","components/products/products.module.css","components/restok-app.tsx"];
  report.sources=await Promise.all(sources.map(async file=>({file,sha256:createHash("sha256").update(await readFile(file)).digest("hex")})));
  await writeFile(path.join(out,"manifest.json"),JSON.stringify(report,null,2));
}
console.log(JSON.stringify({stage,checks:report.checks.length,failed:report.checks.filter(c=>!c.pass),errors:report.errors}));
if(report.errors.length||report.checks.some(c=>!c.pass))process.exitCode=1;
