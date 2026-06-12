/**
 * Type definitions and error class for the Vialwise calculator engine.
 *
 * PORTED VERBATIM from the Vialwise iOS app (`src/calculator/types.ts`). The
 * web calculator must produce byte-identical results to the app, so this file
 * is kept in sync deliberately — do not diverge the math or field names here
 * without making the same change in the app and re-running the parity tests in
 * `__tests__/calculator.test.ts`.
 *
 * These types form the public API surface — UI code, validation, and tests
 * all depend on them. Keep field names stable; downstream code reads them
 * directly without remapping.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Forward calculator: vial + BAC water + amount → concentration + draw
// ─────────────────────────────────────────────────────────────────────────────

export type ForwardInput = {
  /** Total milligrams of peptide in the vial. Must be positive and finite. */
  vialMg: number;
  /** Volume of bacteriostatic water added during reconstitution, in milliliters. Must be positive and finite. */
  bacWaterMl: number;
  /** Target amount per draw, in milligrams. Must be positive, finite, and ≤ vialMg. */
  targetDoseMg: number;
};

export type ForwardOutput = {
  /** Resulting concentration after reconstitution, in mg/mL. */
  concentrationMgPerMl: number;
  /** Volume to draw for one draw, in mL. */
  drawMl: number;
  /** Volume to draw expressed as units on a U-100 insulin syringe (100 units = 1 mL). Rounded to nearest whole unit. */
  drawUnitsU100: number;
  /**
   * Unrounded U-100 draw size — the value before rounding to whole units.
   * Surfaced so the UI can render the "16.67 → rounded to 17" disclosure
   * when the rounded display value differs meaningfully from the math.
   */
  drawUnitsU100Exact: number;
  /** Volume to draw expressed as units on a U-40 insulin syringe (40 units = 1 mL). Rounded to nearest whole unit. */
  drawUnitsU40: number;
  /**
   * How many draws this vial yields at the chosen amount: `vialMg / targetDoseMg`.
   * Rounded to 2 decimals. Always finite — validation guarantees
   * `targetDoseMg > 0`. Pairs with the vial-usage helpers (see vialUsage.ts) to
   * derive "this vial lasts ~X days" once a frequency is chosen.
   */
  totalDoses: number;
  /** Non-fatal warnings about the result (e.g., draw exceeds syringe, concentration is unusually high/low). */
  warnings: CalculatorWarning[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Reverse calculator: amount + vial + desired draw size → BAC water needed
// ─────────────────────────────────────────────────────────────────────────────

export type ReverseInput = {
  /** Target amount per draw, in milligrams. Must be positive, finite, and ≤ vialMg. */
  targetDoseMg: number;
  /** Total milligrams of peptide in the vial. Must be positive and finite. */
  vialMg: number;
  /** Desired draw size in U-100 syringe units (100 units = 1 mL). Must be a positive whole integer. */
  desiredUnitsPerDrawU100: number;
};

export type ReverseOutput = {
  /** Volume of bacteriostatic water to add during reconstitution, in mL. */
  bacWaterMlToAdd: number;
  /** Resulting concentration after reconstitution, in mg/mL. */
  concentrationMgPerMl: number;
  /**
   * How many draws this vial yields at the chosen amount: `vialMg / targetDoseMg`.
   * Rounded to 2 decimals. Always finite — validation guarantees
   * `targetDoseMg > 0`. Same field/semantics as on ForwardOutput.
   */
  totalDoses: number;
  /** Non-fatal warnings about the result. */
  warnings: CalculatorWarning[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Warnings (non-fatal — calculation still produces a valid result)
// ─────────────────────────────────────────────────────────────────────────────

export type CalculatorWarning = {
  /** Severity level — affects how the UI surfaces the warning. */
  level: WarningLevel;
  /** Stable identifier. UI uses this to render localized text or to filter on severity. */
  code: WarningCode;
  /** Human-readable English message. UI may display directly or look up a translation. */
  message: string;
};

export type WarningLevel = "info" | "warning" | "danger";

export type WarningCode =
  | "DRAW_EXCEEDS_SYRINGE" // draw > 100 units on U-100; would require multiple draws
  | "DRAW_BELOW_PRECISION" // draw < 2 units; hard to measure accurately on a standard syringe
  | "CONCENTRATION_VERY_HIGH" // > 50 mg/mL; tiny draws prone to error
  | "CONCENTRATION_VERY_LOW" // < 0.1 mg/mL; wasted vial space
  | "VOLUME_VERY_LARGE" // > 10 mL BAC water; unusual for peptide vials
  | "DOSE_NEAR_VIAL_CAPACITY"; // amount close to total vial mg; few draws per vial

// ─────────────────────────────────────────────────────────────────────────────
// Validation error
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Thrown by validate.ts when calculator input fails validation.
 * Always includes the field name, the reason, and the received value
 * so UI can surface a precise error to the user.
 */
export class CalculatorValidationError extends Error {
  public readonly field: string;
  public readonly reason: string;
  public readonly received: unknown;

  constructor(field: string, reason: string, received: unknown) {
    super(`Invalid ${field}: ${reason} (received: ${JSON.stringify(received)})`);
    this.name = "CalculatorValidationError";
    this.field = field;
    this.reason = reason;
    this.received = received;
    // Restore prototype chain for `instanceof` checks across compile targets.
    Object.setPrototypeOf(this, CalculatorValidationError.prototype);
  }
}
