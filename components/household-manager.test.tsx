/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HouseholdManager } from "@/components/household-manager";

const data = vi.hoisted(() => ({
  members: vi.fn(),
  invites: vi.fn(),
  changeRole: vi.fn(),
  createHousehold: vi.fn(),
  createInvite: vi.fn(),
  leaveHousehold: vi.fn(),
  removeMember: vi.fn(),
  revokeInvite: vi.fn(),
  transferOwnership: vi.fn(),
}));

vi.mock("@/lib/supabase/data", () => ({
  changeHouseholdMemberRole: data.changeRole,
  createHousehold: data.createHousehold,
  createHouseholdInvite: data.createInvite,
  leaveHousehold: data.leaveHousehold,
  loadHouseholdInvites: data.invites,
  loadHouseholdMembers: data.members,
  removeHouseholdMember: data.removeMember,
  revokeHouseholdInvite: data.revokeInvite,
  transferHouseholdOwnership: data.transferOwnership,
}));

const household = { id: "house-1", name: "Casa", role: "owner" as const, createdAt: "2026-01-01T00:00:00.000Z" };
const memberId = "fd65f4a8-21d9-4cd3-a9ef-454554344425";

function renderManager() {
  return render(<HouseholdManager
    households={[household]}
    activeHousehold={household}
    enabled
    onClose={vi.fn()}
    onSelect={vi.fn(async () => true)}
    onCreated={vi.fn(async () => true)}
    onMembershipChanged={vi.fn(async () => {})}
    notify={vi.fn()}
  />);
}

describe("household member display and recovery", () => {
  beforeEach(() => {
    data.members.mockReset();
    data.invites.mockReset();
    data.invites.mockResolvedValue([]);
  });

  afterEach(() => cleanup());

  it("uses available household context without exposing user ID fragments", async () => {
    data.members.mockResolvedValue([
      { userId: "self-user-id", role: "owner", joinedAt: "2026-09-01T00:00:00.000Z", isSelf: true },
      { userId: memberId, displayName: "Ana Souza", role: "member", joinedAt: "2026-09-29T00:00:00.000Z", isSelf: false },
    ]);
    renderManager();

    expect(await screen.findByText("Ana Souza")).toBeTruthy();
    expect(screen.getByText("Você")).toBeTruthy();
    expect(screen.getByText(/Membro · desde/)).toBeTruthy();
    expect(document.body.textContent).not.toContain(memberId);
    expect(document.body.textContent).not.toContain("fd65f4a8");
  });

  it("does not expose IDs or offer sensitive actions for unidentified members", async () => {
    data.members.mockResolvedValue([
      { userId: "11111111-0000-0000-0000-000000000001", displayName: null, role: "member", joinedAt: "2026-09-29T00:00:00.000Z", isSelf: false },
      { userId: "22222222-0000-0000-0000-000000000002", displayName: null, role: "member", joinedAt: "2026-09-29T00:00:00.000Z", isSelf: false },
    ]);
    renderManager();

    expect(await screen.findAllByText("Nome não informado")).toHaveLength(2);
    expect(document.body.textContent).not.toContain("00000001");
    expect(screen.queryByRole("button", { name: /^Remover / })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Transferir propriedade/ })).toBeNull();
  });

  it("shows a recoverable error and retries the member and invite loads", async () => {
    data.members.mockRejectedValueOnce(new Error("offline"));
    data.members.mockResolvedValueOnce([]);
    renderManager();

    expect(await screen.findByText("Não foi possível carregar as pessoas e convites.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Nenhum convite encontrado.")).toBeTruthy();
    expect(data.members).toHaveBeenCalledTimes(2);
    expect(data.invites).toHaveBeenCalledTimes(2);
  });
});
