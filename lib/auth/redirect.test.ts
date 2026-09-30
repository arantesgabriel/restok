import { describe, expect, it } from "vitest";
import { safeInternalPath, signupDestination } from "@/lib/auth/redirect";

const invite = "a".repeat(36);

describe("safeInternalPath", () => {
  it("keeps known in-app routes and drops everything else", () => {
    expect(safeInternalPath(null)).toBe("/app");
    expect(safeInternalPath("")).toBe("/app");
    expect(safeInternalPath("/app")).toBe("/app");
    expect(safeInternalPath("/login")).toBe("/login");
    expect(safeInternalPath("/reset-password")).toBe("/reset-password");
    expect(safeInternalPath("/")).toBe("/");
    expect(safeInternalPath("https://evil.test")).toBe("/app");
    expect(safeInternalPath("//evil.test")).toBe("/app");
    expect(safeInternalPath("/\\evil.test")).toBe("/app");
    expect(safeInternalPath("/%2fapp")).toBe("/app");
    expect(safeInternalPath("/app\n")).toBe("/app");
    expect(safeInternalPath("/unknown")).toBe("/app");
  });

  it("rebuilds only the query values the app understands", () => {
    expect(safeInternalPath(`/app?invite=${invite}&flow=onboarding&next=/admin`)).toBe(
      `/app?invite=${invite}&flow=onboarding`,
    );
    expect(safeInternalPath("/app?invite=not-a-token&flow=other")).toBe("/app");
    expect(safeInternalPath("/login?auth=unavailable&next=/admin")).toBe("/login?auth=unavailable");
    expect(safeInternalPath("/login?flow=recovery")).toBe("/login?flow=recovery");
    expect(safeInternalPath("/login?auth=nope")).toBe("/login");
    expect(safeInternalPath("/reset-password?next=/admin")).toBe("/reset-password");
  });
});

describe("signupDestination", () => {
  it("sends a new account into onboarding unless a safe app path was requested", () => {
    expect(signupDestination(null)).toBe("/app?flow=onboarding");
    expect(signupDestination("/login")).toBe("/app?flow=onboarding");
    expect(signupDestination("/")).toBe("/app?flow=onboarding");
    expect(signupDestination("/reset-password")).toBe("/app?flow=onboarding");
    expect(signupDestination("https://evil.test")).toBe("/app?flow=onboarding");
    expect(signupDestination("/app")).toBe("/app");
    expect(signupDestination(`/app?invite=${invite}`)).toBe(`/app?invite=${invite}`);
  });
});
