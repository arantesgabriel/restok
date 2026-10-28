// Intentionally has no Supabase SDK import. Auth submissions fail locally.
export const isSupabaseConfigured = true;
export const supabaseUrl = "http://127.0.0.1:4173";
export const supabaseAnonKey = "fixture-only";
export const subscribeToShoppingList = (_listId: string | undefined, _householdId: string, callbacks: { onStatus: (status: "connected" | "reconnecting") => void }) => {
  callbacks.onStatus(new URLSearchParams(window.location.search).get("scenario") === "notice" ? "reconnecting" : "connected");
  return () => {};
};
export const getSupabaseBrowserClient = () => ({
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { session: null }, error: { message: "Fixture" } }),
    signUp: async () => ({ data: { session: null }, error: { message: "Fixture" } }),
    resetPasswordForEmail: async () => ({ error: { message: "Fixture" } }),
    updateUser: async () => ({ error: { message: "Fixture" } }),
  },
});
