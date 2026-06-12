/**
 * Display formatters for the web reconstitution calculator. Mirrors the
 * number formatting in the app's VialUsagePanel + ResultPanel so the two
 * surfaces read identically. Pure functions — no side effects.
 */

/** Parse a numeric input string, tolerating a European decimal comma. Empty → NaN. */
export function parseNumberInput(raw: string): number {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return NaN;
  return Number(trimmed);
}

/** Draw count: 1 decimal, trailing ".0" dropped (30 → "30", 3.33 → "3.3"). */
export function formatDraws(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? `${r}` : r.toFixed(1);
}

/** Whole days, or null when not computable. */
export function formatDays(n: number | null): string | null {
  if (n === null || !Number.isFinite(n)) return null;
  return `${Math.round(n)}`;
}

/** Vials/month: 1 decimal, trailing ".0" dropped, or null when not computable. */
export function formatVials(n: number | null): string | null {
  if (n === null || !Number.isFinite(n)) return null;
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? `${r}` : r.toFixed(1);
}
