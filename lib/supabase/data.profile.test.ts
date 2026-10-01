import { beforeEach, expect, it, vi } from "vitest";
const remote = vi.hoisted(() => ({ getUser: vi.fn(), upsert: vi.fn(), from: vi.fn() }));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: () => ({ auth: { getUser: remote.getUser }, from: remote.from }) }));
import { persistProfileName } from "@/lib/supabase/data";
beforeEach(() => {
  vi.clearAllMocks();
  remote.getUser.mockResolvedValue({ data: { user: { id: "signed-in-user" } }, error: null });
  remote.from.mockReturnValue({ upsert: remote.upsert });
  remote.upsert.mockResolvedValue({ error: null });
});
it("updates only the signed-in person's trimmed display name", async () => {
  expect(await persistProfileName("  Ana Souza  ")).toBe(true);
  expect(remote.upsert).toHaveBeenCalledWith({ id: "signed-in-user", display_name: "Ana Souza" }, { onConflict: "id" });
});
it("does not write an empty name or a profile without authentication", async () => {
  expect(await persistProfileName("  ")).toBe(false);
  remote.getUser.mockResolvedValue({ data: { user: null }, error: null });
  expect(await persistProfileName("Ana")).toBe(false);
  expect(remote.upsert).not.toHaveBeenCalled();
});
