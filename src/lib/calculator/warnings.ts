/**
 * Non-fatal warning generators for the Vialwise calculator.
 *
 * PORTED VERBATIM from the Vialwise iOS app (`src/calculator/warnings.ts`).
 * The messages here are user-facing and already "draw"-framed (never "dose") —
 * keep them in sync with the app.
 *
 * Warnings ride along with successful calculator results. They surface
 * conditions that aren't math errors but that a researcher should be aware
 * of — draws too small to measure precisely, concentrations unusually
 * high or low, vials with very few draws left, etc.
 *
 * Severity levels:
 *   "info"    — contextual, not a problem
 *   "warning" — worth noting, math is fine
 *   "danger"  — researcher should likely reconsider
 */

import { CalculatorWarning } from "./types";

/**
 * Thresholds that trigger warnings. Centralized here so tuning is one-file
 * — never inline a magic number in a check function.
 */
export const WARNING_THRESHOLDS = {
  /** Draws above this exceed a single U-100 insulin syringe. */
  DRAW_UPPER_UNITS_U100: 100,
  /** Draws below this are too small to measure accurately. */
  DRAW_LOWER_UNITS_U100: 2,
  /** Concentrations above this make tiny draws prone to error. */
  CONCENTRATION_HIGH_MG_PER_ML: 50,
  /** Concentrations below this waste vial space. */
  CONCENTRATION_LOW_MG_PER_ML: 0.1,
  /** BAC water volumes above this are unusual for peptide vials. */
  VOLUME_LARGE_ML: 10,
  /** amount/vial ratios at or above this mean ≤ 2 draws per vial. */
  DOSE_TO_VIAL_RATIO: 0.5,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Individual check functions
//
// Each takes the relevant inputs and returns a CalculatorWarning or null.
// Pure functions — no side effects, no I/O.
// ─────────────────────────────────────────────────────────────────────────────

export function checkDrawExceedsSyringe(
  unitsU100: number,
): CalculatorWarning | null {
  if (unitsU100 > WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100) {
    return {
      level: "danger",
      code: "DRAW_EXCEEDS_SYRINGE",
      message: `Draw of ${unitsU100} units exceeds a single U-100 syringe (max 100 units). Would require multiple draws — consider a higher concentration.`,
    };
  }
  return null;
}

export function checkDrawBelowPrecision(
  unitsU100: number,
): CalculatorWarning | null {
  if (unitsU100 > 0 && unitsU100 < WARNING_THRESHOLDS.DRAW_LOWER_UNITS_U100) {
    return {
      level: "warning",
      code: "DRAW_BELOW_PRECISION",
      message: `Draw of ${unitsU100} unit${unitsU100 === 1 ? "" : "s"} is very small — hard to measure accurately on a standard syringe. Consider a less concentrated reconstitution.`,
    };
  }
  return null;
}

export function checkConcentrationHigh(
  concentrationMgPerMl: number,
): CalculatorWarning | null {
  if (concentrationMgPerMl > WARNING_THRESHOLDS.CONCENTRATION_HIGH_MG_PER_ML) {
    return {
      level: "warning",
      code: "CONCENTRATION_VERY_HIGH",
      message: `Concentration of ${concentrationMgPerMl} mg/mL is very high — tiny draws are prone to measurement error.`,
    };
  }
  return null;
}

export function checkConcentrationLow(
  concentrationMgPerMl: number,
): CalculatorWarning | null {
  if (concentrationMgPerMl < WARNING_THRESHOLDS.CONCENTRATION_LOW_MG_PER_ML) {
    return {
      level: "info",
      code: "CONCENTRATION_VERY_LOW",
      message: `Concentration of ${concentrationMgPerMl} mg/mL is very low — vial space may be wasted.`,
    };
  }
  return null;
}

export function checkVolumeLarge(
  bacWaterMl: number,
): CalculatorWarning | null {
  if (bacWaterMl > WARNING_THRESHOLDS.VOLUME_LARGE_ML) {
    return {
      level: "warning",
      code: "VOLUME_VERY_LARGE",
      message: `BAC water volume of ${bacWaterMl} mL is unusually large for a peptide vial.`,
    };
  }
  return null;
}

export function checkDoseNearVialCapacity(
  targetDoseMg: number,
  vialMg: number,
): CalculatorWarning | null {
  if (vialMg <= 0) return null; // defensive — validation should have caught this
  const ratio = targetDoseMg / vialMg;
  if (ratio >= WARNING_THRESHOLDS.DOSE_TO_VIAL_RATIO) {
    const dosesPerVial = Math.floor(vialMg / targetDoseMg);
    return {
      level: "info",
      code: "DOSE_NEAR_VIAL_CAPACITY",
      message: `Each draw uses a large fraction of the vial — approximately ${dosesPerVial} draw${dosesPerVial === 1 ? "" : "s"} per vial.`,
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Composite generators
//
// These run every applicable check and collect the resulting warnings into
// a single array, in a stable order. Forward and reverse calculators each
// call their respective composite generator after computing the result.
// ─────────────────────────────────────────────────────────────────────────────

export function generateForwardWarnings(args: {
  vialMg: number;
  bacWaterMl: number;
  targetDoseMg: number;
  concentrationMgPerMl: number;
  drawUnitsU100: number;
}): CalculatorWarning[] {
  const candidates = [
    checkDrawExceedsSyringe(args.drawUnitsU100),
    checkDrawBelowPrecision(args.drawUnitsU100),
    checkConcentrationHigh(args.concentrationMgPerMl),
    checkConcentrationLow(args.concentrationMgPerMl),
    checkVolumeLarge(args.bacWaterMl),
    checkDoseNearVialCapacity(args.targetDoseMg, args.vialMg),
  ];
  return candidates.filter((w): w is CalculatorWarning => w !== null);
}

export function generateReverseWarnings(args: {
  vialMg: number;
  bacWaterMlToAdd: number;
  targetDoseMg: number;
  concentrationMgPerMl: number;
  desiredUnitsPerDrawU100: number;
}): CalculatorWarning[] {
  const candidates = [
    checkDrawExceedsSyringe(args.desiredUnitsPerDrawU100),
    checkDrawBelowPrecision(args.desiredUnitsPerDrawU100),
    checkConcentrationHigh(args.concentrationMgPerMl),
    checkConcentrationLow(args.concentrationMgPerMl),
    checkVolumeLarge(args.bacWaterMlToAdd),
    checkDoseNearVialCapacity(args.targetDoseMg, args.vialMg),
  ];
  return candidates.filter((w): w is CalculatorWarning => w !== null);
}
