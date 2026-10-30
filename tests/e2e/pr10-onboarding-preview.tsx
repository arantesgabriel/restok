"use client";
// Read-only visual composition, mounted temporarily on the authenticated dev server.
// The browser QA does not submit these forms. This is not a zero-membership session.
import { HouseholdOnboarding } from "@/components/households/household-onboarding";
export default function OnboardingPreview({ failed }: { failed: boolean }) {
  return <HouseholdOnboarding profileName="Participante fictício do QA PR10" email={null} inviteToken="" inviteFailed={failed} onActivate={async () => false} />;
}
