/* global process, console, document, innerWidth, scrollY, getComputedStyle, window */
import { chromium } from "./runtime.mjs";
import { mkdir, writeFile } from "node:fs/promises";
const out=process.env.RESTOK_QA_OUT ?? "docs/restok-mobile-island/evidence";await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.RESTOK_CHROMIUM_EXECUTABLE});
const report={checks:[],errors:[]};const check=(name,pass,actual)=>report.checks.push({name,pass,actual});
try{
  for(const width of [320,390,768,1440]){
    const height=width===320?640:width===390?844:900;
    const context=await browser.newContext({viewport:{width,height},hasTouch:width<1024,reducedMotion:"reduce"});const page=await context.newPage();page.on("pageerror",e=>report.errors.push(e.message));
    await page.goto("http://127.0.0.1:4173/app?scenario=list100");await page.locator("[data-shopping-row]").first().waitFor();
    const island=page.locator("[data-mobile-navigation]");
    check(`${width}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
    if(width>=1024){check("desktop keeps house selector",await page.getByRole("button",{name:/^Casas e pessoas:/}).isVisible());check("desktop hides island",!await island.isVisible());}
    else {
      check(`${width}: header hides house`,!await page.getByRole("button",{name:/^Casas e pessoas:/}).isVisible());
      check(`${width}: profile remains available`,await page.getByRole("button",{name:/^Perfil de/}).isVisible());
      await page.screenshot({path:`${out}/${width}-expanded.png`});
      await page.mouse.wheel(0,350);await page.waitForFunction(()=>scrollY>100);await page.locator('[data-mobile-navigation="compact"]').waitFor();
      check(`${width}: downward scroll compacts`,await island.getAttribute("data-mobile-navigation")==="compact");
      const compact=await island.evaluate(e=>({surface:getComputedStyle(e,"::before").transform,duration:getComputedStyle(e,"::before").transitionDuration,buttons:[...e.querySelectorAll("button")].map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height};})}));
      const selected=await island.locator("[aria-current=page]").evaluate(e=>({name:e.textContent,background:getComputedStyle(e.querySelector("svg")).backgroundColor,color:getComputedStyle(e.querySelector("svg")).color}));
      check(`${width}: selection stays visible while compact`,selected.name==="Compra" && selected.background==="rgb(45, 90, 39)" && selected.color==="rgb(255, 255, 255)",selected);
      check(`${width}: compact shrinks surface`,compact.surface.startsWith("matrix(0.88"),compact.surface);
      check(`${width}: reduced motion`,compact.duration==="0s",compact.duration);
      check(`${width}: compact keeps44px targets`,compact.buttons.every(b=>b.w>=44&&b.h>=44),compact.buttons);
      await page.screenshot({path:`${out}/${width}-compact.png`});
      await island.getByRole("button",{name:"Compra",exact:true}).click();check(`${width}: one tap expands`,await island.getAttribute("data-mobile-navigation")==="expanded");
      await page.mouse.wheel(0,-120);await page.locator('[data-mobile-navigation="compact"]').waitFor();check(`${width}: upward scroll compacts`,await island.getAttribute("data-mobile-navigation")==="compact");
      await island.getByRole("button",{name:"Casa",exact:true}).click();await page.getByRole("heading",{name:"Produtos da casa",exact:true}).waitFor();
      check(`${width}: one tap also navigates`,await island.getAttribute("data-mobile-navigation")==="expanded");
      await page.mouse.move(200,300);await page.mouse.wheel(0,150);await page.locator('[data-mobile-navigation="compact"]').waitFor();
      const homeSelected=await island.locator("[aria-current=page]").evaluate(e=>({name:e.textContent,background:getComputedStyle(e.querySelector("svg")).backgroundColor}));check(`${width}: Casa remains selected during scroll`,homeSelected.name==="Casa" && homeSelected.background==="rgb(45, 90, 39)",homeSelected);
      await page.screenshot({path:`${out}/${width}-home.png`});
      await island.getByRole("button",{name:"Compra",exact:true}).click();await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
      const row=await page.locator("[data-shopping-row]").last().boundingBox(),dock=await page.locator("[data-shopping-dock]").boundingBox(),nav=await island.boundingBox();
      check(`${width}: last row clears island`,row.y+row.height<=nav.y+1,{row,nav});check(`${width}: island sits above action card`,nav.y+nav.height+7<=dock.y,{dock,nav});
      await page.screenshot({path:`${out}/${width}-last-row.png`});
    }
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:"no-preference"});const page=await context.newPage();await page.goto("http://127.0.0.1:4173/app?scenario=list100");await page.locator("[data-shopping-row]").first().waitFor();
  const cdp=await context.newCDPSession(page);await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:200,y:500}]});for(const y of [460,400,320,240])await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:200,y}]});await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await page.locator('[data-mobile-navigation="compact"]').waitFor();
  check("390: native touch scroll compacts",true);await page.screenshot({path:`${out}/390-touch-motion.png`});
  await context.close();
}catch(error){report.errors.push(error.stack);}finally{await browser.close();await writeFile(`${out}/validation.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(c=>!c.pass),errors:report.errors}));if(report.errors.length||report.checks.some(c=>!c.pass))process.exitCode=1;

