// Read emitted files; do not execute generated manifests or equate this with network/CWV.
import { readFile, readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import process from "node:process";
import console from "node:console";
async function walk(dir) {
  return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]))).flat();
}
async function measure(paths) {
  const files=[];
  for(const path of [...new Set(paths)].sort()) {
    const bytes=await readFile(path);
    files.push({path:path.replaceAll("\\","/"),rawBytes:bytes.length,gzipBytes:gzipSync(bytes).length});
  }
  return {files,rawBytes:files.reduce((sum,file)=>sum+file.rawBytes,0),gzipBytes:files.reduce((sum,file)=>sum+file.gzipBytes,0)};
}
const routes={"/":"page","/app":"app/page","/login":"login/page","/reset-password":"reset-password/page"};
const perRoute={};
for(const [route,path] of Object.entries(routes)) {
  const text=await readFile(`.next/server/app/${path}_client-reference-manifest.js`,"utf8");
  const match=text.match(/\]\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if(!match)throw new Error(`Unrecognized manifest for ${route}`);
  const manifest=JSON.stringify(JSON.parse(match[1]));
  const refs=[...manifest.matchAll(/static\/(?:chunks|css)\/[^"\\]+\.(?:js|css)/g)].map(match=>`.next/${match[0]}`);
  perRoute[route]=await measure(refs);
}
const all=(await walk(".next/static")).filter(path=>/\.(?:js|css)$/.test(path));
const result={method:"Unique JS/CSS references in each emitted client-reference manifest; dependency graph, not observed first-load requests. Gzip per file. Fonts served from public measured separately.",buildId:(await readFile(".next/BUILD_ID","utf8")).trim(),perRoute,allEmitted:await measure(all),fonts:await Promise.all((await walk("public/fonts/manrope")).filter(path=>path.endsWith(".woff2")).map(async path=>({path,bytes:(await stat(path)).size})))};
await writeFile(process.argv[2],JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({routes:Object.fromEntries(Object.entries(perRoute).map(([route,entry])=>[route,{rawBytes:entry.rawBytes,gzipBytes:entry.gzipBytes}])),allEmitted:{rawBytes:result.allEmitted.rawBytes,gzipBytes:result.allEmitted.gzipBytes}}));
