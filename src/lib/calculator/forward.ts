/**
 * Forward calculator: vial mg + BAC water mL + target amount mg → draw size.
 *
 * PORTED VERBATIM from the Vialwise iOS app (`src/calculator/forward.ts`).
 *
 * The user has a vial of known mg, has reconstituted it with a known mL
 * of bacteriostatic water, and wants to know how many syringe units to
 * draw for a specific amount.
 *
 * Composition:
 *   1. validateForwardInput  — rejects garbage, throws CalculatorValidationError
 *   2. raw math              — concentration, draw mL, draw units (U-100, U-40)
 *   3. rounding              — fixed-precision values for storage and display
 *   4. warning generation    — non-fatal flags about unusual conditions
 *
 * This is a pure function: same inputs always produce the same output,
 * no side effects, no I/O.
 */

import { ForwardInput, ForwardOutput } from "./types";
import { validateForwardInput } from "./validate";
import {
  roundMlPrecise,
  roundUnits,
  roundConcentrationDisplay,
  roundTo,
} from "./round";
import { generateForwardWarnings } from "./warnings";

export function forward(input: ForwardInput): ForwardOutput {
  // ── 1. Validate ──────────────────────────────────────────────────────────
  validateForwardInput(input);

  // ── 2. Raw math ──────────────────────────────────────────────────────────
  // Concentration is the milligrams of peptide per milliliter of solution.
  const concentrationRaw = input.vialMg / input.bacWaterMl;

  // Draw volume in mL is the amount divided by the concentration.
  const drawMlRaw = input.targetDoseMg / concentrationRaw;

  // Insulin syringes mark off in units. A U-100 syringe has 100 units per
  // mL, so 1 unit = 0.01 mL. A U-40 has 40 units per mL.
  const drawUnitsU100Raw = drawMlRaw * 100;
  const drawUnitsU40Raw = drawMlRaw * 40;

  // ── 3. Round ─────────────────────────────────────────────────────────────
  const concentrationMgPerMl = roundConcentrationDisplay(concentrationRaw);
  const drawMl = roundMlPrecise(drawMlRaw);
  const drawUnitsU100 = roundUnits(drawUnitsU100Raw);
  const drawUnitsU40 = roundUnits(drawUnitsU40Raw);

  // Draws available per vial at the chosen amount. Validation guarantees
  // targetDoseMg > 0, so this is always finite (no divide-by-zero here).
  const totalDoses = roundTo(input.vialMg / input.targetDoseMg, 2);

  // ── 4. Warnings ──────────────────────────────────────────────────────────
  const warnings = generateForwardWarnings({
    vialMg: input.vialMg,
    bacWaterMl: input.bacWaterMl,
    targetDoseMg: input.targetDoseMg,
    concentrationMgPerMl,
    drawUnitsU100,
  });

  return {
    concentrationMgPerMl,
    drawMl,
    drawUnitsU100,
    drawUnitsU100Exact: drawUnitsU100Raw,
    drawUnitsU40,
    totalDoses,
    warnings,
  };
}
