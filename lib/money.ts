export type MoneyInput = { ok: true; value: number | undefined } | { ok: false };

/** BRL input, two decimal places, bounded by the existing numeric(12,2) columns. */
export function parseMoney(input: string): MoneyInput {
  const raw = input.trim();
  if (!raw) return { ok: true, value: undefined };
  let canonical: string;
  if (/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(raw)) {
    canonical = raw.replaceAll(".", "").replace(",", ".");
  } else if (/^\d+\.\d{1,2}$/.test(raw)) {
    // Retain the ungrouped decimal-dot input accepted by the existing editors.
    canonical = raw;
  } else return { ok: false };
  const [whole, fraction = ""] = canonical.split(".");
  const normalizedWhole = whole.replace(/^0+(?=\d)/, "");
  if (normalizedWhole.length > 10) return { ok: false };
  const cents = Number(normalizedWhole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents > 999_999_999_999) return { ok: false };
  return { ok: true, value: cents / 100 };
}

export function moneyInput(value: number | undefined): string {
  return value === undefined ? "" : value.toFixed(2).replace(".", ",");
}
