import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ItemStatus } from "@/lib/types";

type ItemRow = { id: string; shopping_list_id: string; product_id: string | null; quantity: number; unit_price: number | null; status: ItemStatus; name: string; category_id: string | null };

export type ItemRealtimePayload = RealtimePostgresChangesPayload<ItemRow>;
export type RealtimeConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected";
export type RealtimeCallbacks = {
  onItemChange: (payload: ItemRealtimePayload) => void;
  onDomainChange: () => void;
  onStatus: (status: RealtimeConnectionStatus) => void;
};

export function subscribeToShoppingList(listId: string | undefined, householdId: string, callbacks: RealtimeCallbacks) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    callbacks.onStatus("disconnected");
    return () => undefined;
  }

  let channel = supabase.channel(`shopping-household:${householdId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "shopping_lists", filter: `household_id=eq.${householdId}` }, callbacks.onDomainChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `household_id=eq.${householdId}` }, callbacks.onDomainChange)
  if (listId) channel = channel.on("postgres_changes", { event: "*", schema: "public", table: "shopping_list_items", filter: `shopping_list_id=eq.${listId}` }, callbacks.onItemChange);
  channel.subscribe((status) => {
      if (status === "SUBSCRIBED") callbacks.onStatus("connected");
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") callbacks.onStatus("reconnecting");
      else if (status === "CLOSED") callbacks.onStatus("disconnected");
      else callbacks.onStatus("connecting");
    });

  return () => { void supabase.removeChannel(channel); };
}
