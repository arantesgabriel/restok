/* global console, document, innerWidth, innerHeight */
import {readFile,readdir,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {chromium} from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const root=path.resolve('docs/restok-visual-refactor'),ev=path.join(root,'evidence'),errors=[],links=[];
for(const file of (await readdir(root)).filter(x=>x.endsWith('.md'))){
 const source=await readFile(path.join(root,file),'utf8');
 for(const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const target=match[1];if(/^(https?:|#)/.test(target))continue;
  const resolved=path.resolve(root,target.replace(/:\d+$/,'').split('#')[0]);try{await stat(resolved);links.push({file,target});}catch{errors.push({file,target});}
 }
}
const integrity=JSON.parse(await readFile(path.join(ev,'source-integrity.json'),'utf8'));let sourcesVerified=0;
for(const item of integrity.sourceFiles){const hash=createHash('sha256').update(await readFile(item.file)).digest('hex');if(hash!==item.sha256)errors.push({sourceChanged:item.file});else sourcesVerified++;}
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const gallery=[];
try{for(const [width,height]of [[390,844],[1440,900]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto('file:///'+path.join(ev,'comparison.html').replaceAll('\\','/'));await page.locator('img').evaluateAll(es=>es.forEach(e=>{e.loading='eager';}));await page.waitForFunction(()=>[...document.images].every(e=>e.complete));
 const result=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,brokenImages:[...document.images].filter(e=>!e.naturalWidth).map(e=>e.getAttribute('src'))}));gallery.push(result);if(result.overflow||result.brokenImages.length)errors.push(result);
 await page.screenshot({path:path.join(ev,'gallery-'+width+'.png')});await page.close();
}}finally{await browser.close();}
const result={at:new Date().toISOString(),documents:(await readdir(root)).filter(x=>/^\d\d-.*\.md$/.test(x)).length,localLinksVerified:links.length,sourcesVerified,gallery,errors};await writeFile(path.join(ev,'report-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(errors.length)throw new Error('Audit artifact verification failed');
