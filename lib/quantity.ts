export const isValidQuantity = (value: number) => Number.isSafeInteger(value) && value >= 1;
export function parseQuantity(raw: string): number {
  const value = /^\d+$/.test(raw) ? Number(raw) : NaN;
  return isValidQuantity(value) ? value : NaN;
}
