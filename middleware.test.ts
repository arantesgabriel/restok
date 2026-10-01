import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const remote = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({ createServerClient: remote.createServerClient }));
vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: true,
  supabaseUrl: "https://example.supabase.co",
  supabaseAnonKey: "test-anon-key",
}));

import { middleware } from "@/middleware";

describe("middleware authentication", () => {
  beforeEach(() => {
    remote.getUser.mockReset();
    remote.createServerClient.mockReset();
    remote.getUser.mockResolvedValue({ data: { user: null }, error: null });
    remote.createServerClient.mockReturnValue({ auth: { getUser: remote.getUser } });
  });

  it("validates the session even when a legacy query flag is supplied", async () => {
    await middleware(new NextRequest("http://localhost/app?demo=1"));

    expect(remote.createServerClient).toHaveBeenCalledOnce();
    expect(remote.getUser).toHaveBeenCalledOnce();
  });

  it("continues to validate sessions on the connected app route", async () => {
    await middleware(new NextRequest("http://localhost/app"));

    expect(remote.createServerClient).toHaveBeenCalledOnce();
    expect(remote.getUser).toHaveBeenCalledOnce();
  });
});
