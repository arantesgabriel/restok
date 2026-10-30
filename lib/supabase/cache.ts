export const LEGACY_REMOTE_STATE_KEY = "restok-state-v2";

// Browser persistence is optional. A denied getter, private mode or quota failure
// must not prevent an authorized remote context from loading or signing out.
export const browserStorage = {
  get length() { try { return window.localStorage.length; } catch { return 0; } },
  key(index: number) { try { return window.localStorage.key(index); } catch { return null; } },
  getItem(key: string) { try { return window.localStorage.getItem(key); } catch { return null; } },
  setItem(key: string, value: string) { try { window.localStorage.setItem(key, value); } catch { /* remote state remains usable without cache */ } },
  removeItem(key: string) { try { window.localStorage.removeItem(key); } catch { /* storage may be unavailable */ } },
};

export function remoteStateStoragePrefix(userId: string) {
  return `restok-state-v3:${encodeURIComponent(userId)}:`;
}

export function remoteStateStorageKey(userId: string, householdId: string) {
  return `${remoteStateStoragePrefix(userId)}${encodeURIComponent(householdId)}`;
}

export function clearRemoteStateCaches(
  storage: Pick<Storage, "length" | "key" | "removeItem">,
  userId: string,
) {
  const prefix = remoteStateStoragePrefix(userId);
  const keys: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(prefix)) keys.push(key);
  }

  keys.forEach((key) => storage.removeItem(key));
}
