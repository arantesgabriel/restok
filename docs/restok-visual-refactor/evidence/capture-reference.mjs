/* global console, process, document, getComputedStyle, innerWidth, innerHeight */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const origin='https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site';
const out=path.resolve('docs/restok-visual-refactor/evidence/reference');await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const manifest={kind:'APPROVED-DEMO / simulated data / viewport differs from internal canvas',at:new Date().toISOString(),engine:browser.version(),captures:[],interactions:[],errors:[]};
try {
 for(const [width,height] of [[320,640],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  await context.route(origin+'/**',r=>r.continue({headers:{...r.request().headers(),'OAI-Sites-Authorization':`Bearer ${process.env.AUDIT_SITE_TOKEN}`}}));
  const page=await context.newPage();page.on('pageerror',e=>manifest.errors.push({width,message:e.message}));
  const capture=async(id)=>{await page.waitForTimeout(400);const file=`${width}-${height}-${id}.png`;await page.screenshot({path:path.join(out,file)});await page.locator('#app').screenshot({path:path.join(out,file.replace('.png','-canvas.png'))});const geometry=await page.evaluate(()=>{const app=document.querySelector('#app');const rect=e=>e?JSON.parse(JSON.stringify(e.getBoundingClientRect())):null;const styles=e=>e?{font:getComputedStyle(e).font,padding:getComputedStyle(e).padding,bg:getComputedStyle(e).backgroundColor,border:getComputedStyle(e).borderColor}:null;return {viewport:{width:innerWidth,height:innerHeight},canvas:{width:app.offsetWidth,height:app.offsetHeight,transform:app.style.transform,rect:rect(app)},overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,budget:rect(app.querySelector('.budget')),budgetStyle:styles(app.querySelector('.budget')),firstItem:rect(app.querySelector('.item')),title:styles(app.querySelector('h2')),text:app.innerText};});manifest.captures.push({id,file,geometry});console.log(file);};
  for(const [route,id] of [['compra','compra'],['casa','casa'],['historico','historico'],['pessoas','pessoas']]) {
   await page.goto(origin+'/');await page.locator('#app .budget').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator(`[data-device="${width===320?'320':width<1024?'390':'1440'}"]`).click();
   await page.locator(`.r2-navbtn[data-nav="${route}"]`).click();await page.locator('#r25Focus').click();await capture(id);
   if([390,1440].includes(width)){
    console.log('CONTROLS '+id+' '+JSON.stringify(await page.locator('#app button,#app input').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),aria:e.getAttribute('aria-label'),name:e.getAttribute('name'),placeholder:e.getAttribute('placeholder'),class:e.className})))));
   }
  }
  await context.close();
 }
}finally{await browser.close();await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));}
