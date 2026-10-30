/* global process, console, document, innerWidth */
import { chromium } from "./runtime.mjs";
import { writeFile, mkdir } from "node:fs/promises";
const out="docs/restok-remaining/evidence";await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.RESTOK_CHROMIUM_EXECUTABLE});
const result={checks:[],errors:[]};
function check(name,pass,actual){result.checks.push({name,pass,actual});}
try {
  for(const width of [320,390,768,1024,1280,1440,1920]){
    const context=await browser.newContext({viewport:{width,height:width===320?640:900},hasTouch:width<1024,reducedMotion:"reduce"});
    const page=await context.newPage();page.on("pageerror",error=>result.errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/app?scenario=demo-v6#home");await page.getByRole("heading",{name:"Produtos da casa",exact:true}).waitFor();
    check(`${width}: catalog rows`,await page.locator("[data-product-row]").count()===10);
    check(`${width}: overflow`,await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
    if(width>=1024){check(`${width}: topbar`,await page.locator("[data-app-topbar]").isVisible());check(`${width}: four sidebar routes`,await page.locator("[data-app-sidebar] nav button").count()===4);}
    else check(`${width}: mobile dock`,await page.locator("[data-shopping-dock]").isVisible());
    await page.getByRole("searchbox").fill("Café");check(`${width}: catalog search`,await page.locator("[data-product-row]").count()===1);
    await page.getByRole("searchbox").fill("");await page.getByRole("button",{name:"Limpeza",exact:true}).click();check(`${width}: category filter`,await page.locator("[data-product-row]").count()===2);
    await page.getByRole("button",{name:"Todos",exact:true}).click();await page.getByRole("button",{name:"Adicionar Café em pó à compra",exact:true}).click();
    check(`${width}: duplicate pending product blocked`,await page.getByText("Este produto já está pendente na compra",{exact:true}).isVisible());
    await page.getByRole("button",{name:"Adicionar Ovos caipiras à compra",exact:true}).click();
    const nav=page.locator(width>=1024 ? "[data-app-sidebar] nav" : '[class*="navigation_"] nav');await nav.getByRole("button",{name:"Compra",exact:true}).click();
    await page.getByRole("heading",{name:"Compra da semana",exact:true}).waitFor();check(`${width}: catalog add to purchase`,await page.locator("[data-shopping-row]").count()===15);
    const first=page.locator("[data-shopping-row]").first(),wrapper=first.locator("..");
    if(width<1024){
      const rect=await first.boundingBox(),y=rect.y+rect.height/2,x=rect.x+rect.width-50;
      const cdp=await context.newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      for(const dx of [15,35,60,95])await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x-dx,y}]});
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      check(`${width}: native touch reveals delete`,await wrapper.getAttribute("data-delete-revealed")==="true");
      check(`${width}: swipe does not delete automatically`,await page.locator("[data-shopping-row]").count()===15 && await page.getByRole("dialog").count()===0);
      await page.screenshot({path:`${out}/${width}-swipe.png`});
    }
    await wrapper.getByRole("button",{name:"Excluir Arroz integral",exact:true}).click();
    const dialog=page.getByRole("dialog",{name:"Excluir item da compra?"});await dialog.waitFor();
    await dialog.getByRole("button",{name:"Cancelar",exact:true}).click();await dialog.waitFor({state:"hidden"});check(`${width}: cancel keeps item`,await page.locator("[data-shopping-row]").count()===15);
    await wrapper.getByRole("button",{name:"Excluir Arroz integral",exact:true}).focus();await page.keyboard.press("Enter");await dialog.waitFor();await dialog.getByRole("button",{name:"Excluir item",exact:true}).click();await dialog.waitFor({state:"hidden"});
    check(`${width}: confirm removes only selected item`,await page.locator("[data-shopping-row]").count()===14 && await page.getByRole("button",{name:"Editar Arroz integral",exact:true}).count()===0);
    check(`${width}: purchased total recalculated`,(await page.locator("[data-budget-summary] strong").first().innerText()).replace(/\s/g,"")==="R$31,78");
    await page.goto("http://127.0.0.1:4173/app?scenario=long#history");await page.getByRole("heading",{name:"Compras anteriores",exact:true}).waitFor();
    const historyRow=page.locator("[data-app-main] ol li button").first();await historyRow.click();await page.getByRole("button",{name:"Voltar ao histórico",exact:true}).waitFor();check(`${width}: history detail preserves snapshots`,await page.locator("[data-app-main] li").count()>0);
    await page.screenshot({path:`${out}/${width}-history-detail.png`});await page.getByRole("button",{name:"Voltar ao histórico",exact:true}).click();check(`${width}: history back focuses record`,await historyRow.evaluate(element=>document.activeElement===element));
    await page.goto("http://127.0.0.1:4173/app?scenario=demo-v6#people");await page.getByRole("heading",{name:"Pessoas da casa",exact:true}).waitFor();await page.getByRole("button",{name:"Trocar casa",exact:true}).first().click();check(`${width}: actual house selector`,await page.getByRole("combobox",{name:"Selecionar casa"}).isVisible());
    check(`${width}: member list`,await page.locator('section[aria-label="Pessoas da casa"] li').count()===3);
    await context.close();
  }
}catch(error){result.errors.push(error.stack);}finally{await browser.close();await writeFile(`${out}/validation.json`,JSON.stringify(result,null,2));}
console.log(JSON.stringify({checks:result.checks.length,failed:result.checks.filter(check=>!check.pass),errors:result.errors}));
if(result.errors.length||result.checks.some(check=>!check.pass))process.exitCode=1;

