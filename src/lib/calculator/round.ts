/**
 * Rounding and precision helpers for the Vialwise calculator.
 *
 * PORTED VERBATIM from the Vialwise iOS app (`src/calculator/round.ts`). Keep
 * in sync — the precision rules below are what make the web output match the
 * app output exactly.
 *
 * Precision rules (from the app's docs/calculator-architecture.md):
 *
 *   roundMlPrecise            → 4 decimal places (for internal mL storage)
 *   roundMlDisplay            → 1 decimal place (for reverse-calc water output)
 *   roundUnits                → nearest whole integer (for syringe display)
 *   roundConcentrationDisplay → 2 decimal places (for displayed mg/mL)
 *
 * NaN and Infinity pass through unchanged so the caller can decide how to
 * handle them — the validation layer rejects those before they reach math.
 */

/**
 * Round a number to N decimal places. Returns a number (not a string).
 *
 * Uses `(value + Number.EPSILON) * factor` to mitigate the IEEE 754 quirk
 * where, e.g., `0.1 + 0.2` is stored slightly above 0.3 and would otherwise
 * round to 0.31 at higher precision settings.
 *
 * NaN and Infinity pass through unchanged.
 */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Round a milliliter value to 4 decimal places.
 * Used for internal storage of draw volumes — 0.0001 mL = 1/10,000th of a mL,
 * far smaller than any physical measurement precision.
 */
export function roundMlPrecise(mL: number): number {
  return roundTo(mL, 4);
}

/**
 * Round a milliliter value to 1 decimal place for display.
 * Used for the reverse-calculator's BAC water output, since real-world
 * measuring tools (syringes, graduated cylinders) work in 0.1 mL increments.
 */
export function roundMlDisplay(mL: number): number {
  return roundTo(mL, 1);
}

/**
 * Round a syringe-unit value to the nearest whole integer.
 * U-100 and U-40 syringes have whole-integer markings; you cannot draw
 * "16.67 units" — you draw 17 (or 16, depending on the rounding boundary).
 */
export function roundUnits(units: number): number {
  if (!Number.isFinite(units)) return units;
  return Math.round(units);
}

/**
 * Round a concentration value (mg/mL) to 2 decimal places for display.
 * Used in Quick Reference tables and confirmation screens.
 */
export function roundConcentrationDisplay(mgPerMl: number): number {
  return roundTo(mgPerMl, 2);
}
