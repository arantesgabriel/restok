/* global document, innerWidth, innerHeight, getComputedStyle, process, URL, console, localStorage */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const phase = process.argv[2] || 'before';
const out = `docs/restok-lightness-density/evidence/${phase}`;
await mkdir(out, {recursive:true});
const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const manifest = {kind:'Real components / isolated fixtures / no backend',timestamp:new Date().toISOString(),captures:[],errors:[]};
try {
  for (const [width,height] of [[320,640],[390,844],[768,1024],[992,768],[1280,800],[1440,900],[1920,1080]]) {
    const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
    await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4173' ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror',error=>manifest.errors.push(error.message));
    for (const scenario of (phase === 'before' ? ['empty-list','long'] : ['empty-list','long','few','list100','stress','money','money-equal','money-over','money-high','loading','error'])) {
      if(page.url().startsWith('http://127.0.0.1:4173')) await page.evaluate(()=>localStorage.clear());
      await page.goto(`http://127.0.0.1:4173/app?scenario=${scenario}`);
      if (scenario === 'loading') await page.getByRole('button',{name:'Liberar resposta da fixture'}).waitFor();
      else await page.getByRole('button',{name:'Perfil de Pessoa de teste'}).waitFor();
      if (!['loading','error'].includes(scenario)) await page.getByRole('heading',{name:'Compra ilustrativa da casa para o mês'}).waitFor();
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:`${out}/${width}x${height}-${scenario}.png`});
      const geometry=await page.evaluate(()=>{
        const rect=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
        const dock=rect('[data-shopping-dock]');
        const rows=[...document.querySelectorAll('[data-shopping-row]')];
        return {viewport:[innerWidth,innerHeight],overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,budget:rect('[data-budget-summary]'),sidebar:rect('[data-app-sidebar]'),dock,rows:rows.length,completeRows:rows.filter(e=>e.getBoundingClientRect().bottom<=(dock?.height?dock.y:innerHeight)).length,context:rect('[data-app-context]'),font:getComputedStyle(document.body).fontFamily};
      });
      manifest.captures.push({width,height,scenario,...geometry});
    }
    if(phase==='after') {
      await page.goto('http://127.0.0.1:4173/app?scenario=long');
      await page.getByRole('heading',{name:'Compra ilustrativa da casa para o mês'}).waitFor();
      for(const destination of ['Casa','Histórico']) {
        await page.getByRole('button',{name:destination,exact:true}).filter({visible:true}).click();
        await page.screenshot({path:`${out}/${width}x${height}-${destination}.png`});
      }
    }
    await context.close();
  }
} finally {await browser.close();await writeFile(`${out}/manifest.json`,JSON.stringify(manifest,null,2));}
console.log(`${phase}: ${manifest.captures.length} captures; ${manifest.errors.length} errors; overflow ${manifest.captures.filter(c=>c.overflow>0).length}`);
