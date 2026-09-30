export const LEGACY_REMOTE_STATE_KEY = "restok-state-v2";
export const DEMO_STATE_KEY = "restok-demo-state-v1";

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
