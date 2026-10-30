/* global document, innerWidth, innerHeight, getComputedStyle, localStorage, URL, console */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const out='docs/restok-lightness-density/direction-correction/after/fixtures';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const manifest={kind:'Components and CSS from workspace; isolated fixture data; no production backend',captures:[],checks:[],errors:[]};
function check(name,pass,value){manifest.checks.push({name,pass,value});}
async function capture(page,id,width,height){
  await page.evaluate(()=>document.fonts.ready);
  const m=await page.evaluate(()=>{
    const r=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom};};
    const profile=document.querySelector('button[aria-label^="Perfil de"]');
    const purchased=document.querySelector('[data-item-status=purchased] > button');
    const panels=[...document.querySelectorAll('[data-global-controls] details[open] > div')].map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth};});
    return {viewport:[innerWidth,innerHeight],overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),panels,horizontalHeader:document.querySelector('#restok-main > header')!==null,contextCount:document.querySelectorAll('[data-app-context]').length,houseCount:document.querySelectorAll('button[aria-label^="Casas e pessoas:"]').length,profileInSidebar:!!profile?.closest('[data-app-sidebar]'),sidebar:r('[data-app-sidebar]'),footer:r('[data-global-controls]'),budget:r('[data-budget-summary]'),heading:r('h1'),headingWeight:getComputedStyle(document.querySelector('h1')).fontWeight,purchasedBackground:purchased?getComputedStyle(purchased).backgroundColor:null};
  });
  await page.screenshot({path:`${out}/${width}x${height}-${id}.png`});
  manifest.captures.push({id,...m});
  check(`${width}/${id}: no overflow`,m.overflow===0,m.overflow);
  check(`${width}/${id}: global messages fit viewport`,m.panels.every(p=>p.x>=0&&p.right<=width&&p.y>=0&&p.bottom<=height&&p.scrollWidth<=p.clientWidth),m.panels);
  check(`${width}/${id}: single house/profile and no top header/context`,!m.horizontalHeader&&m.contextCount===0&&m.houseCount===1&&m.profileInSidebar,m);
  if(width>=768)check(`${width}/${id}: globals at sidebar bottom`,m.footer.y>height/2,m.footer);
  else check(`${width}/${id}: compact mobile header`,m.sidebar.height<=52,m.sidebar);
  return m;
}
try {
  for(const [width,height] of [[390,844],[768,1024],[992,768],[1440,900],[1920,1080]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
    await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());
    const page=await context.newPage();page.on('pageerror',e=>manifest.errors.push(e.message));
    for(const scenario of ['long','money-over','stress','empty-list','notice']) {
      if(page.url().startsWith('http'))await page.evaluate(()=>localStorage.clear());
      await page.goto(`http://127.0.0.1:4173/app?scenario=${scenario}`);
      await page.getByRole('heading',{name:'Compra ilustrativa da casa para o mês'}).waitFor();
      const m=await capture(page,scenario,width,height);
      if(scenario==='money-over')check(`${width}: purchased status has no square fill`,m.purchasedBackground==='rgba(0, 0, 0, 0)',m.purchasedBackground);
    }
    const notice=page.locator('details').filter({has:page.locator('summary[aria-label="Atualizações em andamento · ver detalhes"]')});
    await notice.locator('summary').click();
    await page.getByText('Reconectando atualizações em tempo real…',{exact:true}).waitFor();
    await capture(page,'notice-open',width,height);
    await notice.locator('summary').click();
    const profile=page.getByRole('button',{name:'Perfil de Pessoa de teste'});
    await profile.click();await page.getByRole('menuitem',{name:'Editar meu nome'}).click();
    await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
    check(`${width}: relocated profile restores focus`,await profile.evaluate(e=>e===document.activeElement));
    await page.getByRole('button',{name:/Casas e pessoas: Casa ilustrativa/}).click();
    await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
    check(`${width}: house switcher opens and closes`,true);
    if(width>=768)await page.getByRole('button',{name:'Finalizar compra',exact:true}).filter({visible:true}).click();
    else {await page.getByRole('button',{name:'Menu da compra'}).click();await page.getByRole('menuitem',{name:'Finalizar compra'}).click();}
    await page.getByRole('dialog').waitFor();check(`${width}: finish retains pending warning`,await page.getByText(/Ainda existem .* itens pendentes/).isVisible());
    await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
    // A local fixture response creates a real application confirmation, without production data.
    await page.getByRole('button',{name:'Editar meta da compra'}).click();
    await page.getByRole('button',{name:'Salvar meta'}).click();
    await page.getByRole('dialog').waitFor({state:'hidden'});
    await page.locator('summary[aria-label^="Aviso:"]').waitFor();
    await page.locator('summary[aria-label^="Aviso:"]').click();
    await page.getByRole('button',{name:'Dispensar aviso'}).waitFor();
    await capture(page,'confirmation-open',width,height);
    await page.getByRole('button',{name:'Dispensar aviso'}).click();
    check(`${width}: confirmation dismissal`,await page.locator('summary[aria-label^="Aviso:"]').count()===0);
    for(const destination of ['Casa','Histórico']){
      await page.getByRole('button',{name:destination,exact:true}).filter({visible:true}).click();
      await capture(page,destination,width,height);
    }
    await context.close();
  }
} finally {await browser.close();await writeFile(`${out}/manifest.json`,JSON.stringify(manifest,null,2));}
const failed=manifest.checks.filter(c=>!c.pass);
console.log(`${manifest.captures.length} captures; ${manifest.checks.length-failed.length}/${manifest.checks.length} checks; ${manifest.errors.length} page errors`);
if(failed.length||manifest.errors.length)throw new Error('Inspect fixture manifest for failed checks');
