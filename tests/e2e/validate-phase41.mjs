/* global process, console, document, window, localStorage, innerWidth, getComputedStyle */
import { chromium } from "./runtime.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { URL } from "node:url";
import path from "node:path";

const out=path.resolve(process.env.RESTOK_QA_OUT ?? "docs/restok-phase41/evidence");await mkdir(out,{recursive:true});
const report={at:new Date().toISOString(),referenceCommit:"f0214b71d9497caa62ccaa3b804579f7cd757959",kind:"Real components, isolated local data adapter; no backend",checks:[],comparisons:[],errors:[],captures:[]};
const check=(name,pass,actual)=>report.checks.push({name,pass,actual});
const browser=await chromium.launch({executablePath:process.env.RESTOK_CHROMIUM_EXECUTABLE});report.engine=browser.version();
const referenceUrl="http://127.0.0.1:4173/@fs/C:/Fontes/restok/docs/restok-demo-v6-handoff/original/dist/index.html";
async function metrics(page,reference=false) {
  return page.evaluate(ref=>{
    const root=ref?document.querySelector("#app"):document.querySelector("[data-shopping-view]");
    const inspect=selector=>{const e=root.querySelector(selector);if(!e)return null;const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:b.x,y:b.y,width:b.width,height:b.height,font:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight,tracking:s.letterSpacing,fontFamily:s.fontFamily,color:s.color,background:s.backgroundColor,border:s.borderTopWidth,borderColor:s.borderTopColor,radius:s.borderTopLeftRadius,padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft],text:e.textContent};};
    return {overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),title:inspect(ref?".r2-view-head h2":"[data-purchase-title]"),budget:inspect(ref?".budget":"[data-budget-summary]"),amount:inspect(ref?".budget-number":"[data-budget-summary] strong"),progress:inspect(ref?".progress":"[role=progressbar]"),list:inspect(ref?".items":"[data-purchase-list]"),row:inspect(ref?".item":"[data-shopping-row]"),name:inspect(ref?".item-main b":"[data-item-name]"),names:[...root.querySelectorAll(ref?".item-main b":"[data-item-name]")].map(e=>e.textContent)};
  },reference);
}
async function image(page,file){await page.screenshot({path:path.join(out,file)});report.captures.push(file);}
try {
  for(const [width,height] of [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]) {
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"reduce"});
    await context.route("**/*",r=>new URL(r.request().url()).origin==="http://127.0.0.1:4173"?r.continue():r.abort());
    const app=await context.newPage();app.on("pageerror",e=>report.errors.push(e.message));
    await app.goto("http://127.0.0.1:4173/app?scenario=demo-v6");await app.getByRole("heading",{name:"Compra da semana",exact:true}).waitFor();await app.evaluate(()=>document.fonts.ready);
    const actual=await metrics(app);await image(app,`${width}-${height}-compra.png`);
    check(`${width}: no overflow`,actual.overflow===0,actual.overflow);
    check(`${width}: original names/order`,actual.names[0]==="Arroz integral"&&actual.names[1]==="Café em pó"&&actual.names.length===14,actual.names);
    check(`${width}: canonical palette`,actual.budget.background==="rgb(33, 63, 29)"&&actual.list.background==="rgb(255, 255, 255)",actual);
    check(`${width}: one collection, thin border, radius12`,actual.list.border==="1px"&&actual.list.radius==="12px",actual.list);
    const geometry=await app.locator("[data-shopping-row]").evaluateAll(rows=>rows.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height};}));
    if(width<1024) {
      const dock=await app.locator("[data-shopping-dock]").boundingBox();
      check(`${width}: first complete row before dock`,geometry[0].bottom<=dock.y, {row:geometry[0],dock});
    } else if(width>=1280)check(`${width}: at least4 full rows`,geometry.filter(r=>r.bottom<=height).length>=4,geometry);
    if([320,390,1440].includes(width)) {
      const ref=await context.newPage();ref.on("pageerror",e=>report.errors.push(`reference: ${e.message}`));
      await ref.goto(referenceUrl);await ref.locator("#purchaseItems .item").first().waitFor();await ref.locator(`[data-device="${width}"]`).click();
      await ref.addStyleTag({content:'@font-face{font-family:Manrope;src:url("/fonts/manrope/manrope-latin-variable.woff2");font-weight:400 800}.frame,.stage{overflow:visible}'});
      await ref.locator("#app").evaluate(e=>{
        for(let ancestor=e.parentElement;ancestor&&ancestor!==document.body;ancestor=ancestor.parentElement){ancestor.style.overflow="visible";ancestor.style.transform="none";}
        e.style.transform="none";e.style.position="fixed";e.style.left="0";e.style.top="0";e.style.zIndex="99999";
      });await ref.evaluate(()=>document.fonts.ready);
      await ref.locator("#app").screenshot({path:path.join(out,`${width}-${height}-reference.png`)});
      const expected=await metrics(ref,true);report.comparisons.push({viewport:{width,height},actual,reference:expected,referenceFont:"Same licensed Manrope injected locally; no source file changed; laboratory scale removed"});
      check(`${width}: names/order equal original code`,JSON.stringify(actual.names)===JSON.stringify(expected.names),null);
      check(`${width}: budget amount equals original code`,actual.amount.text.replace(/\s/g,"")===expected.amount.text.replace(/\s/g,""),{actual:actual.amount.text,expected:expected.amount.text});
      check(`${width}: budget brand/radius equal source`,actual.budget.background===expected.budget.background&&actual.budget.radius===expected.budget.radius,{actual:actual.budget,reference:expected.budget});
      check(`${width}: amount type size equals source`,Math.abs(parseFloat(actual.amount.font)-parseFloat(expected.amount.font))<=.1,{actual:actual.amount.font,reference:expected.amount.font});
      check(`${width}: title type equals source`,actual.title.font===expected.title.font&&actual.title.weight===expected.title.weight,{actual:actual.title,reference:expected.title});
      check(`${width}: title leading/tracking equal source`,actual.title.lineHeight===expected.title.lineHeight&&actual.title.tracking===expected.title.tracking,{actual:actual.title,reference:expected.title});
      check(`${width}: row type and height equal source`,actual.name.font===expected.name.font&&actual.name.weight===expected.name.weight&&Math.abs(actual.row.height-expected.row.height)<=1,{actual:actual.row,reference:expected.row});
      if(width===1440) {
        const a=await app.getByRole("region",{name:"Resumo da compra",exact:true}).locator("dd").allTextContents();
        const r=await ref.locator("#app .r2-aside-card").first().locator("dd").allTextContents();
        check("1440: summary counts equal original code",JSON.stringify(a)===JSON.stringify(r),{actual:a,reference:r});
      }
      for(const [original,label] of [["todo","Pendentes"],["done","Comprados"],["have","Já temos"],["all","Todos"]]) {
        await ref.locator(`#app [data-purchase-filter="${original}"]`).click();await app.getByRole("group",{name:"Filtros da lista"}).getByRole("button",{name:label,exact:true}).click();
        const r=await metrics(ref,true),a=await metrics(app);check(`${width}/${original}: filter equals demo`,JSON.stringify(a.names)===JSON.stringify(r.names),{actual:a.names,reference:r.names});
      }
      await ref.locator("#app .r2-search-field").fill("Café");await app.getByRole("searchbox",{name:"Buscar na lista"}).fill("Café");
      check(`${width}: search equals demo`,JSON.stringify((await metrics(app)).names)===JSON.stringify((await metrics(ref,true)).names),null);
      await image(app,`${width}-${height}-search.png`);
      await ref.locator("#app .r2-search-field").fill("Limpeza");await app.getByRole("searchbox",{name:"Buscar na lista"}).fill("Limpeza");
      check(`${width}: category search equals original code`,JSON.stringify((await metrics(app)).names)===JSON.stringify((await metrics(ref,true)).names),null);
      await ref.locator("#app .r2-search-field").fill("Produto inexistente");await app.getByRole("searchbox",{name:"Buscar na lista"}).fill("Produto inexistente");
      check(`${width}: empty search in both`,(await metrics(app)).names.length===0&&(await metrics(ref,true)).names.length===0,null);await image(app,`${width}-${height}-empty-search.png`);
      await ref.locator("#app [data-clear-list]").click();await app.getByRole("button",{name:"Limpar busca e filtros"}).click();
      for(const [source,target] of [["[data-purchase-toggle='2']","Marcar Café em pó como comprado"],["[data-purchase-have='2']","Marcar Café em pó como já temos"],["[data-purchase-toggle='2']","Marcar Café em pó como comprado"],["[data-purchase-toggle='2']","Desfazer situação de Café em pó"]]) {
        await ref.locator(`#app ${source}`).click();await app.getByRole("button",{name:target,exact:true}).click();
        const a=await metrics(app),r=await metrics(ref,true);
        const localState=await app.getByRole("button",{name:"Editar Café em pó",exact:true}).evaluate(e=>e.closest("[data-shopping-row]").getAttribute("data-item-status"));
        const sourceState=await ref.locator("#app [data-purchase-toggle='2']").evaluate(e=>e.closest(".item").classList.contains("done")?"purchased":e.closest(".item").classList.contains("have")?"already_have":"pending");
        check(`${width}/${target}: same total/state transition`,a.amount.text.replace(/\s/g,"")===r.amount.text.replace(/\s/g,"")&&localState===sourceState,{actual:a.amount.text,reference:r.amount.text,localState,sourceState});
      }
      await ref.close();
    }
    await app.goto("http://127.0.0.1:4173/app?scenario=demo-v6");await app.locator("[data-budget-summary]").waitFor();
    await app.getByRole("button",{name:"Editar meta da compra"}).click();await app.getByRole("textbox",{name:"Orçamento da compra"}).fill("0,00");await app.getByRole("button",{name:"Salvar meta",exact:true}).click();await app.getByRole("dialog").waitFor({state:"hidden"});
    check(`${width}: zero budget retains registered total`,(await app.locator("[data-budget-summary]").innerText()).includes("50,68")&&await app.locator("[data-budget-summary]").getAttribute("data-budget-over")==="true",null);await image(app,`${width}-${height}-budget-zero.png`);
    await app.getByRole("button",{name:/Menu da compra/}).click();await app.getByRole("menuitem",{name:"Finalizar compra",exact:true}).click();
    await app.getByRole("dialog",{name:"Finalizar compra?"}).waitFor();await image(app,`${width}-${height}-finish-warning.png`);await app.getByRole("button",{name:"Continuar comprando"}).click();await app.getByRole("dialog").waitFor({state:"hidden"});
    const add=width<1024?app.getByRole("button",{name:"Adicionar item à compra",exact:true}):app.getByRole("button",{name:"Adicionar item",exact:true});await add.click();await app.getByRole("dialog",{name:"Adicionar item",exact:true}).waitFor();await image(app,`${width}-${height}-add.png`);
    await app.getByRole("textbox",{name:"Nome do produto"}).fill("Item de validação F41");await app.getByRole("textbox",{name:"Quantidade",exact:true}).fill("2");await app.getByRole("button",{name:"Adicionar à compra",exact:true}).click();await app.getByRole("dialog").waitFor({state:"hidden"});
    check(`${width}: add uses real handler`,await app.getByRole("button",{name:"Editar Item de validação F41",exact:true}).count()===1,null);
    await app.getByRole("button",{name:"Editar Item de validação F41",exact:true}).click();await app.getByRole("dialog").waitFor();await app.getByRole("textbox",{name:"Preço unitário",exact:true}).fill("4,50");await image(app,`${width}-${height}-edit.png`);await app.getByRole("button",{name:"Adicionar ao carrinho",exact:true}).click();await app.getByRole("dialog").waitFor({state:"hidden"});
    check(`${width}: quantity2 times4.50 plus baseline`,(await app.locator("[data-budget-summary]").innerText()).includes("59,68"),null);
    await app.getByRole("button",{name:/Menu da compra/}).click();await app.getByRole("menuitem",{name:"Finalizar compra",exact:true}).click();await app.getByRole("button",{name:"Finalizar e salvar",exact:true}).click();await app.getByRole("dialog",{name:"Compra finalizada",exact:true}).waitFor();await image(app,`${width}-${height}-complete.png`);await app.getByRole("button",{name:"Fechar",exact:true}).click();await app.getByRole("dialog").waitFor({state:"hidden"});
    if([320,390,1440,1920].includes(width)) {
      for(const scenario of ["empty-list","list100","money","money-equal","money-over","stress"]) {
        await app.evaluate(()=>localStorage.clear());await app.goto(`http://127.0.0.1:4173/app?scenario=${scenario}`);await app.locator("[data-shopping-view]").waitFor();await app.evaluate(()=>document.fonts.ready);
        await image(app,`${width}-${height}-${scenario}.png`);
        check(`${width}/${scenario}: no overflow`,await app.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),null);
        if(scenario==="empty-list")check(`${width}: one empty add action`,await app.getByRole("button",{name:"Adicionar item",exact:true}).filter({visible:true}).count()===1,null);
        const money=await app.locator("[data-budget-summary]").evaluate(e=>({text:e.textContent,clipped:[...e.querySelectorAll("strong,b")].some(n=>n.scrollWidth>Math.ceil(n.getBoundingClientRect().width))}));
        check(`${width}/${scenario}: financial digits fit`,!money.clipped,money);
        if(scenario==="list100")check(`${width}: all100 rows retained`,await app.locator("[data-shopping-row]").count()===100,null);
        if(width<1024&&scenario!=="empty-list") {
          await app.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
          const last=await app.locator("[data-shopping-row]").last().boundingBox(),dock=await app.locator("[data-shopping-dock]").boundingBox();
          check(`${width}/${scenario}: last row above dock`,last.y+last.height<=dock.y+1,{last,dock});
        }
      }
      await app.evaluate(()=>localStorage.clear());await app.goto("http://127.0.0.1:4173/app?scenario=retry");await app.locator("[data-shopping-row]").first().waitFor();
      await app.getByRole("button",{name:/^Marcar .* como comprado$/}).first().click();await app.getByText("Há alterações sem sincronizar",{exact:true}).waitFor();await image(app,`${width}-${height}-retry.png`);
      check(`${width}: failure is actionable`,await app.getByRole("button",{name:"Tentar novamente",exact:true}).isVisible(),null);
      await app.getByRole("button",{name:"Tentar novamente",exact:true}).click();await app.getByRole("button",{name:"Confirmar gravação simulada",exact:true}).click();await app.getByRole("button",{name:"Dispensar aviso",exact:true}).waitFor();
      check(`${width}: confirmation only after fixture release`,await app.getByRole("button",{name:"Dispensar aviso",exact:true}).isVisible(),null);
      await app.evaluate(()=>localStorage.clear());await app.goto("http://127.0.0.1:4173/app?scenario=collection100");await app.locator("[data-shopping-view]").waitFor();await app.getByRole("button",{name:"Menu da compra",exact:true}).click();await app.getByRole("menuitem",{name:"Nova compra",exact:true}).click();
      const dialog=app.getByRole("dialog",{name:"Nova compra",exact:true});await dialog.waitFor();await image(app,`${width}-${height}-new100.png`);
      const footer=await dialog.locator("[data-sheet-footer]").boundingBox();check(`${width}: new100 footer reachable`,footer.y>=0&&footer.y+footer.height<=height,footer);
      await app.evaluate(()=>localStorage.clear());await app.goto("http://127.0.0.1:4173/app?scenario=loading");
      await app.getByRole("status",{name:"Carregando seus dados…",exact:true}).waitFor();await image(app,`${width}-${height}-loading.png`);
      await app.getByRole("button",{name:"Liberar resposta da fixture",exact:true}).click();await app.locator("[data-shopping-view]").waitFor();
      check(`${width}: real loading replaced after response`,await app.getByRole("status",{name:"Carregando seus dados…",exact:true}).count()===0,null);
    }
    await context.close();
  }
} finally {
  await browser.close();
  const sources=["components/shopping/shopping-view.tsx","components/shopping/shopping-toolbar.tsx","components/shopping/use-shopping-view.ts","components/shopping/item-row.tsx","components/shopping/status-toggle.tsx","components/shopping/already-have.tsx","components/shopping/budget-summary.tsx","components/shopping/purchase-context.tsx","components/shopping/shopping.module.css","components/shopping/shopping-controls.module.css","components/shopping/shopping-dock.tsx","components/restok-app.tsx"];
  report.sources=await Promise.all(sources.map(async file=>({file,sha256:createHash("sha256").update(await readFile(file)).digest("hex")})));
  report.referenceSources=await Promise.all(["index.html","r2.js","r2.css","r26.css","r27.css","r28.css","r3.css","r4-consolidated.css"].map(async file=>({file,sha256:createHash("sha256").update(await readFile(`docs/restok-demo-v6-handoff/original/dist/${file}`)).digest("hex")})));
  const previous=JSON.parse(await readFile("docs/restok-phase23/evidence/phase3-after/manifest.json","utf8"));
  report.outsideScope=await Promise.all(previous.sources.filter(s=>/components\/(products|ui|app)\//.test(s.file)).map(async s=>({file:s.file,unchanged:createHash("sha256").update(await readFile(s.file)).digest("hex")===s.sha256})));
  await writeFile(path.join(out,"manifest.json"),JSON.stringify(report,null,2));
}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(c=>!c.pass),errors:report.errors}));if(report.errors.length||report.checks.some(c=>!c.pass))process.exitCode=1;
