import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ItemStatus } from "@/lib/types";

type ItemRow = { id: string; quantity: number; unit_price: number | null; status: ItemStatus; name: string; category_id: string | null };

export type ItemRealtimePayload = RealtimePostgresChangesPayload<ItemRow>;

export function subscribeToShoppingList(listId: string, onChange: (payload: ItemRealtimePayload) => void) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return () => undefined;
  const channel = supabase.channel(`shopping-list:${listId}`).on("postgres_changes", { event: "*", schema: "public", table: "shopping_list_items", filter: `shopping_list_id=eq.${listId}` }, onChange).subscribe();
  return () => { void supabase.removeChannel(channel); };
}
