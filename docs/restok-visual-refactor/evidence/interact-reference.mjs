/* global process, console, document */
import {chromium} from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const origin='https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site',out=path.resolve('docs/restok-visual-refactor/evidence/reference-interactions');await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});const report={captures:[],checks:[],errors:[]};
try{for(const [width,height] of [[390,844],[1440,900]]){
 const context=await browser.newContext({viewport:{width,height}});await context.route(origin+'/**',r=>r.continue({headers:{...r.request().headers(),'OAI-Sites-Authorization':`Bearer ${process.env.AUDIT_SITE_TOKEN}`}}));const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 const open=async flow=>{await page.goto(origin+'/');await page.locator('#app .budget').waitFor();await page.locator(`[data-device="${width===390?'390':'1440'}"]`).click();await page.locator(`.r2-navbtn[data-nav="${flow}"]`).click();await page.locator('#r25Focus').click();await page.evaluate(()=>document.fonts.ready);};
 const capture=async id=>{await page.waitForTimeout(400);const file=`${width}-${height}-${id}.png`;await page.screenshot({path:path.join(out,file)});report.captures.push({width,height,id,file,text:await page.locator('#app').innerText()});console.log(file);};
 await open('compra');await page.getByRole('button',{name:'Marcar como comprado: Café em pó',exact:true}).click();await capture('purchase-feedback');await page.getByRole('button',{name:'Pendentes',exact:true}).click();await capture('purchase-filter');await page.getByLabel('Buscar na compra',{exact:true}).fill('não-corresponde');await capture('purchase-search-empty');await open('compra');await page.locator('#app button:visible').filter({hasText:/^Adicionar item$/}).first().click();await capture('purchase-add-sheet');
 await open('compra');await page.getByRole('button',{name:'Editar meta',exact:true}).click();await capture('budget-editor');
 await open('casa');await page.getByLabel('Buscar no catálogo',{exact:true}).fill('café');await capture('catalog-search');await open('casa');await page.getByRole('button',{name:'Adicionar Café em pó à compra',exact:true}).click();await capture('catalog-add');
 await open('historico');await page.getByRole('button',{name:'Setembro',exact:true}).click();await capture('history-filter');await page.locator('#app .r2-history-entry').first().click();await capture('history-detail');
 await open('pessoas');await page.locator('#app button:visible').filter({hasText:/^Criar convite$/}).first().click();await capture('people-invite');await open('pessoas');await page.getByRole('button',{name:'Transferir',exact:true}).click();await capture('people-transfer');
 await context.close();
}
 const page=await browser.newPage();const response=await page.request.get(origin+'/handoff/PROMPT_AGENTE_AUDITORIA_ROADMAP.md',{headers:{'OAI-Sites-Authorization':`Bearer ${process.env.AUDIT_SITE_TOKEN}`}});await writeFile('docs/restok-visual-refactor/evidence/handoff-original-prompt.md',await response.text());report.checks.push({id:'handoff-original-prompt',status:response.status()});
}finally{await browser.close();await writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2));}
