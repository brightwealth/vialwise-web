/**
 * Reverse calculator: target amount mg + vial mg + desired draw size →
 * how much BAC water to add during reconstitution.
 *
 * PORTED VERBATIM from the Vialwise iOS app (`src/calculator/reverse.ts`).
 *
 * The user knows their vial size, knows what amount they want per draw,
 * and has a preferred number of units to draw on a U-100 insulin syringe
 * (often chosen for ease of measurement, e.g., "I want every draw to be
 * exactly 10 units"). This function tells them how much BAC water to add
 * during reconstitution to make that work.
 *
 * Math:
 *   desired_draw_mL = desired_units_per_draw_U100 / 100
 *   concentration   = target_amount_mg / desired_draw_mL
 *                   = (target_amount_mg × 100) / desired_units_per_draw_U100
 *   bac_water_mL    = vial_mg / concentration
 *
 * Composition mirrors forward.ts: validate → math → round → warnings.
 * Pure function — no side effects, no I/O.
 */

import { ReverseInput, ReverseOutput } from "./types";
import { validateReverseInput } from "./validate";
import { roundMlDisplay, roundConcentrationDisplay, roundTo } from "./round";
import { generateReverseWarnings } from "./warnings";

export function reverse(input: ReverseInput): ReverseOutput {
  // ── 1. Validate ──────────────────────────────────────────────────────────
  validateReverseInput(input);

  // ── 2. Raw math ──────────────────────────────────────────────────────────
  // The user wants each draw to be `desiredUnitsPerDrawU100` units. On a
  // U-100 syringe, 100 units = 1 mL, so 1 unit = 0.01 mL.
  const desiredDrawMl = input.desiredUnitsPerDrawU100 / 100;

  // For that draw volume to deliver exactly `targetDoseMg`, the
  // concentration must be amount ÷ draw_mL.
  const concentrationRaw = input.targetDoseMg / desiredDrawMl;

  // Total BAC water to add = total vial mg ÷ concentration.
  const bacWaterMlRaw = input.vialMg / concentrationRaw;

  // ── 3. Round ─────────────────────────────────────────────────────────────
  // BAC water output is rounded to 1 decimal place because real-world
  // measuring tools (syringes, graduated cylinders) work in 0.1 mL
  // increments — a "2.04 mL" reading is meaningless to a researcher.
  const concentrationMgPerMl = roundConcentrationDisplay(concentrationRaw);
  const bacWaterMlToAdd = roundMlDisplay(bacWaterMlRaw);

  // Draws available per vial at the chosen amount. Validation guarantees
  // targetDoseMg > 0, so this is always finite.
  const totalDoses = roundTo(input.vialMg / input.targetDoseMg, 2);

  // ── 4. Warnings ──────────────────────────────────────────────────────────
  const warnings = generateReverseWarnings({
    vialMg: input.vialMg,
    bacWaterMlToAdd,
    targetDoseMg: input.targetDoseMg,
    concentrationMgPerMl,
    desiredUnitsPerDrawU100: input.desiredUnitsPerDrawU100,
  });

  return {
    bacWaterMlToAdd,
    concentrationMgPerMl,
    totalDoses,
    warnings,
  };
}
