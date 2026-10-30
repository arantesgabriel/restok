/* global document, getComputedStyle, URL, console */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const checks=[];
function check(name,pass,value){checks.push({name,pass,value});}
try {
  for(const width of [320,390,992,1920]) {
    const context=await browser.newContext({viewport:{width,height:width===1920?1080:844},reducedMotion:'reduce'});
    await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());
    const page=await context.newPage();
    await page.goto('http://127.0.0.1:4173/app?scenario=list100');
    await page.getByRole('heading',{name:'Compra ilustrativa da casa para o mês'}).waitFor();
    const budget=page.getByRole('button',{name:'Editar meta da compra'});
    await budget.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({state:'hidden'});
    check(`${width}: budget Escape restores focus`,await budget.evaluate(e=>e===document.activeElement));
    const query=page.getByRole('searchbox',{name:'Buscar na lista'});
    await query.fill('xyz sem correspondência');
    await page.getByRole('heading',{name:'Nenhum item encontrado'}).waitFor();
    await page.getByRole('button',{name:'Limpar busca e filtros'}).click();
    check(`${width}: search clears`,await query.inputValue()==='');
    await page.getByRole('button',{name:/Organizar lista/}).click();
    await page.getByRole('menuitem',{name:'Ordenar por nome A–Z'}).click();
    check(`${width}: sort changes presentation`,await page.locator('[data-category-section]').count()===0);
    await page.locator('[data-shopping-row]').last().scrollIntoViewIfNeeded();
    const geometry=await page.evaluate(()=>{
      const row=[...document.querySelectorAll('[data-shopping-row]')].at(-1).getBoundingClientRect();
      const dock=document.querySelector('[data-shopping-dock]')?.getBoundingClientRect();
      return {bottom:row.bottom,dockTop:dock?.height?dock.top:null,progressDuration:getComputedStyle(document.querySelector('[role=progressbar] > span')).transitionDuration};
    });
    check(`${width}: last row clears dock`,geometry.dockTop===null||geometry.bottom<=geometry.dockTop,geometry);
    check(`${width}: reduced motion`,geometry.progressDuration==='0s',geometry.progressDuration);
    await context.close();
  }
} finally {await browser.close();await writeFile('docs/restok-lightness-density/evidence/interactions.json',JSON.stringify(checks,null,2));}
console.log(`${checks.filter(c=>c.pass).length}/${checks.length} checks passed`);
if(checks.some(c=>!c.pass))throw new Error('Failed checks; see interactions.json');
