import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ server: vi.fn(), getUser: vi.fn(), redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseServerClient: auth.server }));
vi.mock("next/navigation", () => ({ redirect: auth.redirect }));
vi.mock("@/components/restok-app", () => ({ default: () => null }));
import AppPage from "@/app/app/page";

describe("authenticated application entry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.redirect.mockImplementation((url: string) => { throw new Error(url); });
  });
  it("does not offer local sample data when the server is unavailable", async () => {
    auth.server.mockResolvedValue(null);
    await expect(AppPage({ searchParams: Promise.resolve({}) })).rejects.toThrow("/login?auth=unavailable");
  });
  it("requires a session even for a legacy query flag", async () => {
    auth.server.mockResolvedValue({ auth: { getUser: auth.getUser } });
    auth.getUser.mockResolvedValue({ data: { user: null } });
    await expect(AppPage({ searchParams: Promise.resolve({ invite: undefined, demo: "1" }) })).rejects.toThrow("/login?next=%2Fapp");
    expect(auth.getUser).toHaveBeenCalledOnce();
  });
});
