import { beforeEach, describe, expect, it, vi } from "vitest";

const remote = vi.hoisted(() => ({
  client: { rpc: vi.fn(), from: vi.fn() },
  profileQuery: { select: vi.fn(), in: vi.fn() },
}));

vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: () => remote.client }));

import { loadHouseholdMembers } from "@/lib/supabase/data";

describe("loadHouseholdMembers", () => {
  beforeEach(() => {
    remote.client.rpc.mockReset();
    remote.client.from.mockReset();
    remote.profileQuery.select.mockReset();
    remote.profileQuery.in.mockReset();
    remote.client.rpc.mockResolvedValueOnce({
      data: [
        { user_id: "member-1", role: "member", joined_at: "2026-09-29T00:00:00.000Z", is_self: false },
        { user_id: "member-2", role: "member", joined_at: "2026-09-29T00:00:00.000Z", is_self: false },
      ],
      error: null,
    });
    remote.client.rpc.mockResolvedValue({ data: [{ user_id: "member-1", display_name: "Ana Souza" }], error: null });
  });

  it("enriches member records with their existing display names without changing the RPC contract", async () => {
    await expect(loadHouseholdMembers("house-1")).resolves.toEqual([
      { userId: "member-1", displayName: "Ana Souza", role: "member", joinedAt: "2026-09-29T00:00:00.000Z", isSelf: false },
      { userId: "member-2", displayName: null, role: "member", joinedAt: "2026-09-29T00:00:00.000Z", isSelf: false },
    ]);
    expect(remote.client.rpc).toHaveBeenCalledWith("get_household_members", { target_household: "house-1" });
    expect(remote.client.rpc).toHaveBeenCalledWith("get_household_member_names", { target_household: "house-1" });
    expect(remote.client.from).not.toHaveBeenCalled();
  });

  it("keeps the member list usable when profile names cannot be loaded", async () => {
    remote.client.rpc.mockResolvedValue({ data: null, error: { message: "offline" } });

    const members = await loadHouseholdMembers("house-1");

    expect(members?.map((member) => member.displayName)).toEqual([null, null]);
  });
});
