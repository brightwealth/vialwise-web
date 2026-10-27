import { WARNING_THRESHOLDS, type CalculatorWarning } from "@/lib/calculator";

/**
 * Syringe-size policy for the web calculator — the web counterpart of the
 * app's SyringeSizeSelector options plus the screen-level helpers in the
 * app's Forward/Reverse calculator screens (`deriveSyringeState`,
 * `augmentWithSyringeOverflow`). Pure functions, no React.
 *
 * All three sizes are U-100 calibrated (1 unit = 0.01 mL). The choice never
 * changes the calculator math; it changes the syringe's tick scale and
 * capacity, and adds an overflow note when the draw won't fit.
 */

export type SyringeSize = 30 | 50 | 100;

/** Same sizes, labels and order as the app. */
export const SYRINGE_SIZES: { value: SyringeSize; label: string; helper: string }[] = [
  { value: 30, label: "30 IU", helper: "0.3 mL" },
  { value: 50, label: "50 IU", helper: "0.5 mL" },
  { value: 100, label: "100 IU", helper: "1.0 mL" },
];

export const DEFAULT_SYRINGE_SIZE: SyringeSize = 100;

export type SyringeState = "ok" | "below-precision" | "exceeds-syringe";

/**
 * Visual state for a draw on the chosen syringe. Equivalent to the app's
 * warnings-based derivation: the engine flags over-capacity above
 * DRAW_UPPER_UNITS_U100 (and the overflow note below covers smaller syringes),
 * and flags draws below DRAW_LOWER_UNITS_U100, including a draw that rounds to
 * 0. Taking the draw directly lets the blend calculator — whose engine returns
 * plain messages — use the same rule.
 */
export function syringeStateFor(drawUnitsU100: number, syringeMax: number): SyringeState {
  if (drawUnitsU100 > Math.min(syringeMax, WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100)) {
    return "exceeds-syringe";
  }
  if (drawUnitsU100 < WARNING_THRESHOLDS.DRAW_LOWER_UNITS_U100) return "below-precision";
  return "ok";
}

/**
 * The app's screen-level overflow warning for a 30 or 50 IU syringe. The
 * engine only knows the absolute 100-unit limit, so a draw that fits a 100 IU
 * syringe but not the chosen one gets this note. Null when the draw fits, or
 * when the engine already flagged it (over 100 units).
 */
export function syringeOverflowWarning(
  drawUnitsU100: number,
  syringeMax: number,
): CalculatorWarning | null {
  if (syringeMax >= WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100) return null;
  if (drawUnitsU100 <= syringeMax) return null;
  if (drawUnitsU100 > WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100) return null;
  const overflow = drawUnitsU100 - syringeMax;
  return {
    level: "danger",
    code: "DRAW_EXCEEDS_SYRINGE",
    message: `Draw is ${drawUnitsU100} units — exceeds your ${syringeMax} IU syringe by ${overflow} units. Use a larger syringe or split into multiple draws.`,
  };
}

/** Engine warnings with the syringe overflow note first, when there is one. */
export function withSyringeOverflow(
  warnings: CalculatorWarning[],
  drawUnitsU100: number,
  syringeMax: number,
): CalculatorWarning[] {
  const overflow = syringeOverflowWarning(drawUnitsU100, syringeMax);
  return overflow ? [overflow, ...warnings] : warnings;
}
