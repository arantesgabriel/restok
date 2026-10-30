/* global process, console, localStorage, window */
// Requires fresh human authorization. Does not run seed/migrations or the hosted-refusing integration suite.
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL, URL } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

if (process.env.RESTOK_DEV_CONTEXT_TEST !== "authorized") throw new Error("Current authorization marker required");
const frontend = process.env.RESTOK_FRONTEND_URL ?? "http://localhost:3000";
if (!["http://localhost:3000", "http://127.0.0.1:3001"].includes(frontend)) throw new Error("Unexpected frontend");
const env = Object.fromEntries((await readFile(".env", "utf8")).split(/\r?\n/).filter((line) => /^[A-Z_]+=/.test(line)).map((line) => { const at = line.indexOf("="); return [line.slice(0, at), line.slice(at + 1).trim().replace(/^['"]|['"]$/g, "")]; }));
if (new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname !== "gweynnnjcqafkhpynmrx.supabase.co") throw new Error("Unexpected backend; ask for authorization again");
const sql = await readFile("supabase/seed.sql", "utf8");
const credentials = [...sql.matchAll(/where lower\(email\)\s*=\s*'([^']+)'[\s\S]*?crypt\('([^']+)'/g)].map((match) => ({ email: match[1], password: match[2] }));
if (credentials.length !== 2) throw new Error("Expected two seed accounts; never execute the seed automatically");
const report = [];
const sessions = [];
for (const [index, credential] of credentials.entries()) {
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.signInWithPassword(credential);
  if (error || !data.user) throw new Error(`Seed account ${index + 1} could not authenticate`);
  const { data: memberships, error: membershipError } = await client.from("household_members").select("household_id,role,created_at").eq("user_id", data.user.id).order("created_at").order("household_id");
  if (membershipError) throw new Error(`Membership read failed for account ${index + 1}`);
  report.push({ account: index + 1, memberships: memberships.length, roles: memberships.map((row) => row.role) });
  sessions.push({ client, memberships });
}
console.log(JSON.stringify(report));

if (process.argv[2] === "inspect") process.exit(0);
const { chromium } = await import(pathToFileURL(process.env.RESTOK_PLAYWRIGHT_MODULE).href);
const browser = await chromium.launch({ executablePath: process.env.RESTOK_CHROMIUM_EXECUTABLE });
const out = path.resolve("docs/restok-refactor-plan/evidence/pr02", process.argv[2] ?? "before");
await mkdir(out, { recursive: true });
const results = { kind: "INTEGRADO-RESTOK-DEV", frontend, buildLabel: process.env.RESTOK_BUILD_LABEL ?? "current development source", capturedAt: new Date().toISOString(), engine: browser.version(), viewport: { width: 1280, height: 800 }, accounts: report, captures: [], errors: [] };
results.commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
results.sourceEvidenceSha256 = createHash("sha256").update(process.argv[2] === "before" ? await readFile("docs/restok-refactor-plan/evidence/pr01/PR01.patch") : execFileSync("git", ["diff", "--binary"])).digest("hex");
try {
  for (const [index, credential] of credentials.entries()) {
    const login = await browser.newContext();
    const loginPage = await login.newPage();
    await loginPage.goto(`${frontend}/login`);
    await loginPage.locator("#email").fill(credential.email);
    await loginPage.locator("#password").fill(credential.password);
    await loginPage.getByRole("button", { name: "Entrar", exact: true }).click();
    await loginPage.waitForURL("**/app**");
    await loginPage.getByRole("button", { name: /^Perfil de/ }).waitFor();
    const storageState = await login.storageState();
    await login.close();
    const context = await browser.newContext({ storageState, viewport: results.viewport, deviceScaleFactor: 1, reducedMotion: "no-preference", recordVideo: { dir: out, size: results.viewport } });
    const page = await context.newPage();
    page.on("pageerror", (error) => results.errors.push(error.message));
    await page.goto(`${frontend}/app#home`);
    await page.getByRole("button", { name: "Casas e pessoas", exact: true }).click();
    const select = page.getByRole("combobox").first();
    const options = await select.locator("option").evaluateAll((nodes) => nodes.map((node) => ({ value: node.value, text: node.textContent })));
    if (options.length < 2) throw new Error(`Account ${index + 1} needs two existing authorized households`);
    await select.selectOption(options[1].value);
    await page.waitForFunction((selectedId) => Object.entries(localStorage).some(([key, value]) => key.startsWith("restok-active-household:") && value === selectedId), options[1].value);
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Casas e pessoas", exact: true }).click();
    if (await page.locator("#active-household").inputValue() !== options[1].value) throw new Error("Household switch not reflected in UI");
    const selected = await page.evaluate(() => Object.entries(localStorage).filter(([key]) => key.startsWith("restok-active-household:"))[0]?.[1]);
    const beforeFile = `account-${index + 1}-selected.png`;
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(out, beforeFile) });
    await page.reload();
    await page.getByRole("button", { name: "Casas e pessoas", exact: true }).click();
    const after = await page.getByRole("combobox").first().inputValue();
    const afterFile = `account-${index + 1}-reload.png`;
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(out, afterFile) });
    const result = { account: index + 1, selectedSecond: selected === options[1].value, preservedAfterReload: after === options[1].value, beforeFile, afterFile, scenarios: [] };
    results.captures.push(result);
    if (process.argv[2] === "after") {
      if (!result.preservedAfterReload) throw new Error("UI-013 remains after correction");
      async function selectedHousehold() {
        await page.getByRole("button", { name: "Casas e pessoas", exact: true }).click();
        return page.locator("#active-household").inputValue();
      }
      for (const invite of ["malformed", "0".repeat(36)]) {
        await page.goto(`${frontend}/app?invite=${invite}#home`);
        await page.getByText("Este convite é inválido, expirou, já foi usado ou foi revogado.").waitFor();
        if (await selectedHousehold() !== options[1].value) throw new Error("Invalid invite lost saved selection");
        result.scenarios.push({ id: invite === "malformed" ? "malformed-invite" : "invalid-invite", passed: true });
      }
      // Existing membership only: consume fresh invitations without adding/removing people.
      const inviter = sessions.find((session) => session.memberships.some((row) => row.household_id === options[0].value && ["owner", "admin"].includes(row.role)));
      if (!inviter) throw new Error("No authorized inviter for existing test household");
      const invitation = await inviter.client.rpc("create_household_invite", { target_household: options[0].value });
      if (invitation.error || typeof invitation.data !== "string") throw new Error("Could not create authorized test invite");
      await page.goto(`${frontend}/app?invite=${invitation.data}#home`);
      await page.getByText("Convite aceito. Esta casa está selecionada.").waitFor();
      if (await selectedHousehold() !== options[0].value) throw new Error("Accepted invitation did not take precedence");
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(out, `account-${index + 1}-accepted-invite.png`) });
      await page.goto(`${frontend}/app?invite=${invitation.data}#home`);
      await page.getByText("Este convite é inválido, expirou, já foi usado ou foi revogado.").waitFor();
      if (await selectedHousehold() !== options[0].value) throw new Error("Used invitation lost saved selection");
      result.scenarios.push({ id: "valid-and-used-invite", passed: true, newMemberships: 0, createdAndConsumedInvites: 1 });
      await page.route("**/rest/v1/products?**", (route) => route.abort());
      await page.reload();
      await page.getByText("Sem conexão com o servidor. Exibindo o cache salvo desta casa.").waitFor();
      if (await selectedHousehold() !== options[0].value) throw new Error("Snapshot failure changed household");
      result.scenarios.push({ id: "snapshot-failure-with-cache", passed: true });
      await page.unroute("**/rest/v1/products?**");
      await page.evaluate(() => {
        const key = Object.keys(localStorage).find((key) => key.startsWith("restok-active-household:"));
        localStorage.setItem(key, "00000000-0000-0000-0000-000000000000");
      });
      await page.reload();
      await page.getByText(/A casa selecionada não está mais disponível/).waitFor();
      if (await selectedHousehold() !== options[0].value) throw new Error("Invalid preference fallback incorrect");
      result.scenarios.push({ id: "unauthorized-saved-id", passed: true, membershipRevokedInDatabase: false });
      const noStorage = await browser.newContext({ storageState });
      await noStorage.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("storage denied by test"); } }));
      const isolated = await noStorage.newPage();
      await isolated.goto(`${frontend}/app#home`);
      await isolated.getByRole("button", { name: "Casas e pessoas", exact: true }).click();
      if (await isolated.locator("#active-household").inputValue() !== options[0].value) throw new Error("Blocked storage prevents authorized fallback");
      await noStorage.close();
      result.scenarios.push({ id: "storage-getter-denied", passed: true });
    }
    const video = page.video();
    await context.close();
    await video.saveAs(path.join(out, `account-${index + 1}.webm`));
    await video.delete();
  }
} finally {
  await browser.close();
  await writeFile(path.join(out, "result.json"), JSON.stringify(results, null, 2));
}
