import {readFileSync,readdirSync} from "node:fs";
import {join} from "node:path";
import {expect,it} from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import config from "../../tailwind.config";
const read=(path:string)=>readFileSync(new URL(`../../${path}`,import.meta.url),"utf8");
it("resolves all public-page CSS variables from the shared tokens or local layout roles",()=>{
  const css=read("components/landing/site.module.css")+read("components/landing/demos.module.css");
  const definitions=new Set(Array.from((read("styles/tokens.css")+css).matchAll(/--([\w-]+)\s*:/g),match=>match[1]));
  const references=Array.from(css.matchAll(/var\(--([\w-]+)/g),match=>match[1]);
  expect(references.filter(name=>!definitions.has(name))).toEqual([]);
  expect(css).not.toMatch(/var\(--(?:primary|sage|soft|canvas|ink|surface|line|muted)\)/);
});
it("emits semantic utilities with real bold weight and no old palette aliases",async()=>{
  const result=await postcss([tailwindcss({...config,content:[{raw:"bg-action/50 text-ink border-line font-bold text-primary bg-sage"}]})]).process("@tailwind utilities;",{from:undefined});
  expect(result.css).toContain("rgb(var(--color-action-rgb) / 0.5)");
  expect(result.css).toContain("font-weight: 700");
  expect(result.css).not.toContain(".text-primary");expect(result.css).not.toContain(".bg-sage");
});
it("keeps historical CSS out of every production source import",()=>{
  function sources(directory:string):string[]{return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?sources(join(directory,entry.name)):/\.(?:tsx?|css)$/.test(entry.name)?[join(directory,entry.name)]:[]);}
  const files=[...sources("app"),...sources("components"),...sources("styles")];
  const forbidden=files.filter(file=>/(?:import|@import)[^;\n]*(?:legacy\/|app\/ui\.css|\.\/ui\.css)/.test(readFileSync(file,"utf8")));
  expect(forbidden).toEqual([]);
  expect(read("app/layout.tsx")).toContain('className="restok-theme"');
});
