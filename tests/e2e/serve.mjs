import { createServer } from "vite";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../..", import.meta.url));
const fixture = (name) => path.join(root, "tests/e2e", name);
const server = await createServer({
  configFile: false,
  envDir: false,
  root: fixture(""),
  publicDir: path.join(root, "public"),
  cacheDir: path.join(root, "node_modules/.vite-restok-evidence"),
  css: { postcss: root },
  resolve: { alias: [
    { find: "@/lib/supabase/data", replacement: fixture("data-fixture.ts") },
    ...["client", "config", "realtime"].map((name) => ({ find: `@/lib/supabase/${name}`, replacement: fixture("client-fixture.ts") })),
    { find: "next/image", replacement: fixture("next-fixture.tsx") },
    { find: "next/link", replacement: fixture("link-fixture.tsx") },
    { find: "next/navigation", replacement: fixture("next-fixture.tsx") },
    { find: "@", replacement: root },
  ] },
  server: { host: "127.0.0.1", port: 4173, strictPort: true, fs: { allow: [root] } },
});
await server.listen();
server.printUrls();
