/* global process, console */
import { cp, copyFile, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

// Isolate build output from the user's .next/dev lock. No .env or backend copied.
const root=await realpath(".");
const temporary=await mkdtemp(path.join(root,".qa-phase23-build-"));
async function cleanOwnedBuildDirectory() {
  const resolved=await realpath(temporary),relative=path.relative(root,resolved);
  if(relative.startsWith("..")||path.isAbsolute(relative)||!path.basename(resolved).startsWith(".qa-phase23-build-")) throw new Error("Refusing cleanup outside the created QA directory");
  await rm(resolved,{recursive:true,force:true});
}
let result;
try {
  for(const dir of ["app","components","lib","styles","public"]) await cp(path.join(root,dir),path.join(temporary,dir),{recursive:true,filter:file=>! /\.test\.tsx?$/.test(file)});
  for(const file of ["package.json","package-lock.json","next.config.ts","tsconfig.json","next-env.d.ts","postcss.config.mjs","tailwind.config.ts","tailwind.raiz.config.ts","middleware.ts"]) await copyFile(path.join(root,file),path.join(temporary,file));
  const started=Date.now();
  try {
    const output=await promisify(execFile)(process.execPath,[path.join(root,"node_modules/next/dist/bin/next"),"build","--webpack"],{cwd:temporary,env:{...process.env,NEXT_TELEMETRY_DISABLED:"1",NEXT_PUBLIC_SUPABASE_URL:"",NEXT_PUBLIC_SUPABASE_ANON_KEY:""},maxBuffer:8*1024*1024});
    result={ok:true,elapsedMs:Date.now()-started,kind:"Isolated Next production build, no backend configured"};
    await writeFile(path.join(root,"docs/restok-phase23/evidence/build.log"),output.stdout+output.stderr);
  } catch(error) {
    result={ok:false,elapsedMs:Date.now()-started,kind:"Isolated Next production build",message:error.message};
    await writeFile(path.join(root,"docs/restok-phase23/evidence/build.log"),(error.stdout??"")+(error.stderr??""));
  }
} finally {
  await cleanOwnedBuildDirectory();
}
await writeFile("docs/restok-phase23/evidence/build.json",JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
if(!result?.ok)process.exitCode=1;
