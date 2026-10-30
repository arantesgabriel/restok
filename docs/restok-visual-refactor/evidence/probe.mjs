/* global console, process, URL */
import { chromium } from 'file:///C:/Users/Gabriel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('./', import.meta.url);
await mkdir(out, {recursive:true});
const browser = await chromium.launch({executablePath:process.env.AUDIT_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 if(process.env.AUDIT_SITE_TOKEN) await page.route('https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/**',route=>route.continue({headers:{...route.request().headers(),'OAI-Sites-Authorization':`Bearer ${process.env.AUDIT_SITE_TOKEN}`}}));
 for(const url of ['https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/','http://localhost:3000/app']) {
  try {const response=await page.goto(url,{waitUntil:'networkidle',timeout:60000}); await page.screenshot({path:new URL(url.includes('localhost')?'local-probe.png':'reference-probe.png',out).pathname.replace(/^\/([A-Za-z]:)/,'$1')}); report.push({url,status:response.status(),final:page.url(),text:(await page.locator('body').innerText()).slice(0,18000)});}catch(error){report.push({url,error:error.message});}
 }
 for (const suffix of ['handoff/','handoff/RESTOK_DESIGN_SYSTEM_V1.md','handoff/tokens.v1.json']) {
  try {const response=await page.request.get('https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/'+suffix,{timeout:30000,headers:process.env.AUDIT_SITE_TOKEN?{'OAI-Sites-Authorization':`Bearer ${process.env.AUDIT_SITE_TOKEN}`}:{}}); const body=await response.text(); report.push({url:response.url(),status:response.status(),body:body.slice(0,40000)}); await writeFile(new URL(suffix.endsWith('.json')?'handoff-tokens.json':suffix.endsWith('.md')?'handoff-design-system.md':'handoff-index.html',out),body);}catch(error){report.push({suffix,error:error.message});}
 }
} finally {await browser.close();await writeFile(new URL('probe.json',out),JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
