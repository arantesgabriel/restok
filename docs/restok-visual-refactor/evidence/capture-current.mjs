import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
/* global console, document, innerWidth, innerHeight, localStorage, URL, getComputedStyle */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const out=path.resolve('docs/restok-visual-refactor/evidence/current'); await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const manifest={kind:'CURRENT-COMPONENTS / E2E-FIXTURE / no backend',at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),engine:browser.version(),dpr:1,zoom:1,captures:[],checks:[],errors:[]};
try {
 for(const [width,height] of [[320,640],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());
  const page=await context.newPage();page.on('pageerror',e=>manifest.errors.push({width,message:e.message}));
  const wait=async()=>{await page.getByRole('button',{name:'Perfil de Pessoa de teste'}).waitFor();await page.evaluate(()=>document.fonts.ready);};
  const go=async(s='long')=>{await page.goto(`http://127.0.0.1:4173/app?scenario=${s}`);await wait();};
  const capture=async(id)=>{
   await page.waitForTimeout(300);const file=`${width}-${height}-${id}.png`;await page.screenshot({path:path.join(out,file)});
   const geometry=await page.evaluate(()=>{
    const rect=e=>e?{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,bottom:e.getBoundingClientRect().bottom}:null;
    const style=e=>{if(!e)return null;const s=getComputedStyle(e);return {font:s.font,fontFamily:s.fontFamily,fontWeight:s.fontWeight,fontSize:s.fontSize,lineHeight:s.lineHeight,borderColor:s.borderColor,background:s.backgroundColor,padding:s.padding,borderRadius:s.borderRadius}};
    const dock=document.querySelector('[data-shopping-dock]');const rows=[...document.querySelectorAll('[data-shopping-row],[data-product-row]')];
    const navigation=document.querySelector('[class*="_navigation_"]');
    const navRect=navigation?.getBoundingClientRect();
    const boundary=dock?.getBoundingClientRect().y??(navRect?.height?navRect.y:innerHeight);
    const dialog=document.querySelector('[open][role=dialog],dialog[open]');
    return {viewport:{width:innerWidth,height:innerHeight},documentWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,nodeCount:document.querySelectorAll('*').length,rows:rows.length,completeVisibleRows:rows.filter(e=>e.getBoundingClientRect().y>=0&&e.getBoundingClientRect().bottom<=boundary).length,firstRow:rect(rows[0]),rowStyle:style(rows[0]),budget:rect(document.querySelector('[data-budget-summary]')),budgetStyle:style(document.querySelector('[data-budget-summary]')),dock:rect(dock),dialog:rect(dialog),panel:rect(document.querySelector('[data-sheet-panel]')),body:rect(document.querySelector('[data-sheet-body]')),h1:style(document.querySelector('h1')),active:document.activeElement?.outerHTML.slice(0,400)};
   });
   manifest.captures.push({id,file,route:page.url().replace('http://127.0.0.1:4173',''),geometry}); console.log(file);
  };
  await go();await capture('compra-filled');
  await page.getByRole('button',{name:'Editar Cebola',exact:true}).click();await page.getByRole('dialog').waitFor();await capture('compra-editor');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.getByRole('button',{name:'Casa',exact:true}).first().click();await capture('casa-filled');
  await page.getByRole('button',{name:'Casas e pessoas',exact:true}).click();await page.getByRole('dialog').waitFor();await capture('pessoas-filled');
  await page.locator('[data-sheet-body]').evaluate(e=>{e.scrollTop=e.scrollHeight;});await capture('pessoas-bottom');
  await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.getByRole('button',{name:'Histórico',exact:true}).first().click();await capture('historico-filled');
  await page.getByRole('button',{name:/Compras de Agosto/}).click();await capture('historico-detail');
  await go('empty');await capture('compra-empty');
  await page.getByRole('button',{name:'Casa',exact:true}).first().click();await capture('casa-empty');
  await page.getByRole('button',{name:'Histórico',exact:true}).first().click();await capture('historico-empty');
  if([320,390,1440].includes(width)) {
   await go('stress');await capture('compra-stress');
   await go('money');await capture('compra-money');
   await go('catalog');await page.getByRole('button',{name:'Casa',exact:true}).first().click();await capture('casa-long-names');
   await page.getByRole('searchbox',{name:'Buscar produtos da casa'}).fill('nenhum-corresponde');await capture('casa-no-result');
   await go();await page.getByRole('searchbox',{name:'Buscar na lista'}).fill('nenhum-corresponde');await capture('compra-no-result');
   await page.evaluate(()=>localStorage.clear());await page.goto('http://127.0.0.1:4173/app?scenario=error');await wait();await page.getByText('Não foi possível carregar os dados da casa. Verifique a conexão e tente novamente.').waitFor({state:'attached'});await page.locator('details summary').first().click();await capture('snapshot-error');
   await page.goto('http://127.0.0.1:4173/app?scenario=loading');await page.getByText('Liberar resposta da fixture').waitFor();await capture('loading');await page.getByRole('button',{name:'Liberar resposta da fixture'}).click();await wait();await capture('loading-resolved');
   await go();await page.getByRole('button',{name:'Casa',exact:true}).first().click();const trigger=page.getByRole('button',{name:'Casas e pessoas',exact:true});await trigger.focus();await page.keyboard.press('Enter');await page.getByRole('dialog').waitFor();await page.keyboard.press('Tab');await capture('pessoas-focus');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});manifest.checks.push({width,id:'escape-return',passed:await trigger.evaluate(e=>e===document.activeElement)});
   await page.emulateMedia({reducedMotion:'reduce'});await trigger.click();await page.getByRole('dialog').waitFor();manifest.checks.push({width,id:'reduced-motion',animations:await page.locator('[data-sheet-panel]').evaluate(e=>getComputedStyle(e).animationName)});await capture('pessoas-reduced');
  }
  await context.close();
 }
}finally{await browser.close();await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));}
if(manifest.errors.length)throw new Error('Browser errors: inspect manifest');
