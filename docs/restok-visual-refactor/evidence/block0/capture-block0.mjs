import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
/* global console, document, innerWidth, innerHeight, localStorage, URL, getComputedStyle, HTMLElement */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const out=path.resolve('docs/restok-visual-refactor/evidence/block0/screens'); await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const sourcePaths=['components/app','components/ui','components/history/history-view.tsx','components/products/products-home.tsx','components/shopping/shopping-view.tsx','components/restok-app.tsx','styles/base.css','tests/e2e/components.tsx','tests/styles/global-migration.test.ts'];
const sourceDiff=execFileSync('git',['diff','--',...sourcePaths]);
const manifest={kind:'BLOCO 0 / CURRENT-COMPONENTS / E2E-FIXTURE / no backend',at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceDiffSha256:createHash('sha256').update(sourceDiff).digest('hex'),engine:browser.version(),dpr:1,zoom:1,captures:[],checks:[],smoke:[],controlStates:[],errors:[]};
try {
 for(const [width,height] of [[320,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]) {
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());
  const page=await context.newPage();page.on('pageerror',e=>manifest.errors.push({width,message:e.message}));
  const wait=async()=>{await page.getByRole('button',{name:'Perfil de Pessoa de teste'}).waitFor();await page.evaluate(()=>document.fonts.ready);};
  const clickNav=async name=>{const locator=page.getByRole('button',{name,exact:true});const index=await locator.evaluateAll(elements=>elements.findIndex(element=>{const rect=element.getBoundingClientRect(),style=getComputedStyle(element);return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0&&rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;}));if(index<0)throw new Error(`Visible navigation button not found: ${name}`);await locator.nth(index).click();};
  const go=async(s='long')=>{await page.goto(`http://127.0.0.1:4173/app?scenario=${s}`);await wait();};
  const capture=async(id)=>{
   await page.waitForTimeout(300);const file=`${width}-${height}-${id}.png`;await page.screenshot({path:path.join(out,file)});
   const geometry=await page.evaluate(()=>{
    const rect=e=>e?{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,bottom:e.getBoundingClientRect().bottom}:null;
    const style=e=>{if(!e)return null;const s=getComputedStyle(e),r=e.getBoundingClientRect();return {font:s.font,fontFamily:s.fontFamily,fontWeight:s.fontWeight,fontSize:s.fontSize,lineHeight:s.lineHeight,color:s.color,borderColor:s.borderColor,background:s.backgroundColor,padding:s.padding,borderRadius:s.borderRadius,outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,width:r.width,height:r.height}};
    const dock=document.querySelector('[data-shopping-dock]');const rows=[...document.querySelectorAll('[data-shopping-row],[data-product-row]')];
    const navigation=document.querySelector('[class*="_navigation_"]');
    const navRect=navigation?.getBoundingClientRect();
    const visibleNav=[...document.querySelectorAll('nav[aria-label="Navegação principal"]')].find(nav=>{const s=getComputedStyle(nav),r=nav.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;});
    const visibleNavRect=visibleNav?.getBoundingClientRect();
    const navigationItems=visibleNav?[...visibleNav.querySelectorAll('button')].map(button=>{const r=button.getBoundingClientRect(),s=getComputedStyle(button);return {label:button.innerText.trim(),visible:s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0,contained:Boolean(visibleNavRect&&r.left>=visibleNavRect.left&&r.right<=visibleNavRect.right&&r.top>=visibleNavRect.top&&r.bottom<=visibleNavRect.bottom)}}):[];
    const boundary=dock?.getBoundingClientRect().y??(navRect?.height?navRect.y:innerHeight);
    const dialog=document.querySelector('[open][role=dialog],dialog[open]');
    const header=document.querySelector('[data-app-header]'),work=document.querySelector('[data-app-work]'),sidebar=document.querySelector('[data-app-sidebar]'),context=document.querySelector('[data-app-context]'),search=document.querySelector('input[type="search"]'),primary=document.querySelector('button[class*="_primary_"]');
    return {viewport:{width:innerWidth,height:innerHeight},documentWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,nodeCount:document.querySelectorAll('*').length,rows:rows.length,completeVisibleRows:rows.filter(e=>e.getBoundingClientRect().y>=0&&e.getBoundingClientRect().bottom<=boundary).length,firstRow:rect(rows[0]),rowStyle:style(rows[0]),budget:rect(document.querySelector('[data-budget-summary]')),budgetStyle:style(document.querySelector('[data-budget-summary]')),header:rect(header),headerStyle:style(header),work:rect(work),workStyle:style(work),sidebar:rect(sidebar),context:rect(context),navigation:rect(navigation),navigationItems,search:rect(search),searchStyle:style(search),primary:rect(primary),primaryStyle:style(primary),dock:rect(dock),dialog:rect(dialog),panel:rect(document.querySelector('[data-sheet-panel]')),body:rect(document.querySelector('[data-sheet-body]')),h1:style(document.querySelector('h1')),active:document.activeElement?.outerHTML.slice(0,400)};
   });
   manifest.checks.push({width,height,id:'overflow',passed:geometry.overflow===0,overflow:geometry.overflow});
   if(id!=='loading')manifest.checks.push({width,height,id:'navigation-contained',passed:geometry.navigationItems.length===3&&geometry.navigationItems.every(item=>item.visible&&item.contained),items:geometry.navigationItems});
   manifest.captures.push({id,file,route:page.url().replace('http://127.0.0.1:4173',''),geometry}); console.log(file);
  };
  await go();await capture('compra-filled');
  await page.getByRole('button',{name:'Editar Cebola',exact:true}).click();await page.getByRole('dialog').waitFor();await capture('compra-editor');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
  await clickNav('Casa');await capture('casa-filled');
  await page.getByRole('button',{name:'Casas e pessoas',exact:true}).click();await page.getByRole('dialog').waitFor();await capture('pessoas-filled');
  await page.locator('[data-sheet-body]').evaluate(e=>{e.scrollTop=e.scrollHeight;});await capture('pessoas-bottom');
  await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
  await clickNav('Histórico');await capture('historico-filled');
  await page.getByRole('button',{name:/Compras de Agosto/}).click();await capture('historico-detail');
  await go('empty');await capture('compra-empty');
  await clickNav('Casa');await capture('casa-empty');
  await clickNav('Histórico');await capture('historico-empty');
  if([320,390,1440].includes(width)) {
   await go('stress');await capture('compra-stress');
   await go('money');await capture('compra-money');
   await go('catalog');await clickNav('Casa');await capture('casa-long-names');
   await page.getByRole('searchbox',{name:'Buscar produtos da casa'}).fill('nenhum-corresponde');await capture('casa-no-result');
   await go();await page.getByRole('searchbox',{name:'Buscar na lista'}).fill('nenhum-corresponde');await capture('compra-no-result');
   await page.evaluate(()=>localStorage.clear());await page.goto('http://127.0.0.1:4173/app?scenario=error');await wait();await page.getByText('Não foi possível carregar os dados da casa. Verifique a conexão e tente novamente.').waitFor({state:'attached'});await page.locator('details summary').first().click();await capture('snapshot-error');
   await page.goto('http://127.0.0.1:4173/app?scenario=loading');await page.getByText('Liberar resposta da fixture').waitFor();await capture('loading');await page.getByRole('button',{name:'Liberar resposta da fixture'}).click();await wait();await capture('loading-resolved');
   await go();await clickNav('Casa');const trigger=page.getByRole('button',{name:'Casas e pessoas',exact:true});await trigger.focus();await page.keyboard.press('Enter');await page.getByRole('dialog').waitFor();await page.keyboard.press('Tab');await capture('pessoas-focus');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});manifest.checks.push({width,id:'escape-return',passed:await trigger.evaluate(e=>e===document.activeElement)});
   await page.emulateMedia({reducedMotion:'reduce'});await trigger.click();await page.getByRole('dialog').waitFor();const animation=await page.locator('[data-sheet-panel]').evaluate(e=>getComputedStyle(e).animationName);manifest.checks.push({width,id:'reduced-motion',animations:animation,passed:animation==='none'});await capture('pessoas-reduced');
  }
  await context.close();
 }
  for(const [width,height] of [[390,844],[1440,900]]) {
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
   await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());
   for(const [id,route] of [['landing','/'],['login','/login'],['reset','/reset-password']]) {
    const page=await context.newPage();page.on('pageerror',e=>manifest.errors.push({surface:id,width,message:e.message}));
    const response=await page.goto(`http://127.0.0.1:4173${route}`,{waitUntil:'domcontentloaded'});await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
    const result=await page.evaluate(()=>({title:document.querySelector('h1')?.textContent?.trim()??null,viewport:{width:innerWidth,height:innerHeight},overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
    const file=`smoke-${width}x${height}-${id}.png`;await page.screenshot({path:path.join(out,file)});
    manifest.smoke.push({id,route,file,status:response?.status()??null,...result});manifest.checks.push({width,height,id:`smoke-${id}`,passed:Boolean(response?.ok())&&result.overflow===0,overflow:result.overflow});await page.close();
   }
   await context.close();
  }
  {
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
   await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());
   const page=await context.newPage();page.on('pageerror',e=>manifest.errors.push({surface:'controls',message:e.message}));await page.goto('http://127.0.0.1:4173/components.html',{waitUntil:'domcontentloaded'});await page.getByRole('heading',{name:'Componentes da casa'}).waitFor();await page.evaluate(()=>document.fonts.ready);
   const section=page.locator('section[aria-label="Botões"]'),secondary=page.getByRole('button',{name:'Ver confirmação'});const fileDefault='controls-390x844-default.png';await section.screenshot({path:path.join(out,fileDefault)});
   const metrics=await page.evaluate(()=>{const read=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {text:e.textContent?.trim()??'',width:r.width,height:r.height,color:s.color,background:s.backgroundColor,borderColor:s.borderColor,borderRadius:s.borderRadius,opacity:s.opacity,transform:s.transform,outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineOffset:s.outlineOffset,disabled:e.disabled,busy:e.getAttribute('aria-busy')}};return {secondary:read([...document.querySelectorAll('button')].find(e=>e.textContent?.trim()==='Ver confirmação')),search:read(document.querySelector('input[type="search"]')),disabled:read([...document.querySelectorAll('button')].find(e=>e.textContent?.trim()==='Indisponível')),busy:read([...document.querySelectorAll('button')].find(e=>e.getAttribute('aria-busy')==='true'))}});
   let focusVisible=false;for(let i=0;i<32;i++){await page.keyboard.press('Tab');focusVisible=await secondary.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible'));if(focusVisible)break;}
   const focus=await secondary.evaluate(e=>{const s=getComputedStyle(e);return {focused:e===document.activeElement,focusVisible:e.matches(':focus-visible'),outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineOffset:s.outlineOffset}});const fileFocus='controls-390x844-focus.png';await section.screenshot({path:path.join(out,fileFocus)});
   await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});await secondary.hover();await page.waitForTimeout(180);const hover=await secondary.evaluate(e=>({background:getComputedStyle(e).backgroundColor,borderColor:getComputedStyle(e).borderColor}));const fileHover='controls-390x844-hover.png';await section.screenshot({path:path.join(out,fileHover)});
   const box=await secondary.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(30);const pressed=await secondary.evaluate(e=>({transform:getComputedStyle(e).transform,disabled:e.disabled}));const filePressed='controls-390x844-pressed.png';await section.screenshot({path:path.join(out,filePressed)});await page.mouse.up();
   manifest.controlStates.push({viewport:{width:390,height:844},files:{default:fileDefault,focus:fileFocus,hover:fileHover,pressed:filePressed},metrics,focus,hover,pressed});manifest.checks.push({width:390,height:844,id:'controls-touch-target-and-border',passed:metrics.secondary.height>=44&&metrics.secondary.borderRadius==='8px'&&metrics.secondary.borderColor==='rgb(201, 217, 197)'&&metrics.search.height>=44&&metrics.search.borderColor==='rgb(201, 217, 197)'},{width:390,height:844,id:'controls-focus-visible',passed:focusVisible&&focus.outlineStyle==='solid'&&focus.outlineWidth==='2px'&&focus.outlineOffset==='3px'},{width:390,height:844,id:'controls-hover',passed:hover.background!==metrics.secondary.background},{width:390,height:844,id:'controls-pressed',passed:pressed.transform!=='none'},{width:390,height:844,id:'controls-disabled-busy',passed:metrics.disabled.disabled&&metrics.busy.disabled&&metrics.busy.busy==='true'});
   await context.close();
  }
}finally{await browser.close();await writeFile(path.join(path.dirname(out),'manifest.json'),JSON.stringify(manifest,null,2));}
if(manifest.errors.length||manifest.checks.some(check=>!check.passed))throw new Error('Browser errors or failed acceptance checks: inspect manifest');
