import { redirect } from "next/navigation";
import RestokApp from "@/components/restok-app";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { invite } = await searchParams;
      const next = invite ? `/app?invite=${encodeURIComponent(invite)}` : "/app";
      redirect(`/login?next=${encodeURIComponent(next)}`);
    }
  }
  return <RestokApp />;
}
