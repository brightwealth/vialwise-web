/**
 * Blend / multi-peptide vial calculator.
 *
 * PORTED from the Vialwise iOS app (`src/calculator/blend.ts`). The math is
 * identical and checked against the app's own vectors (`__tests__/app/` and
 * `parity-vectors.json`). The only difference is wording: comments and the
 * one error reason say "amount" where the app says "dose" (see VOCABULARY in
 * `scripts/calculator-parity.mjs`). Engine field names (`targetDoseMg`,
 * `perDoseMg`, `totalDoses`) are shared with the app and stay internal.
 *
 * A single vial holding 2–4 peptides reconstituted in one shared volume of
 * bacteriostatic water. Each component has its own concentration
 * (`conc_i = mg_i / bacWaterMl`), but they share ONE draw. The user anchors the
 * draw on one component (by its target amount OR by draw units), which fixes
 * the shared draw `U`; every component's per-draw amount then follows by ratio.
 *
 * This is the existing forward/reverse arithmetic applied per component over a
 * shared water volume and shared draw — no new model, no suggested amounts
 * (the user enters their own target; the calculator only computes). Pure:
 * same inputs → same output, no I/O. Divide-by-zero / garbage input throws
 * `CalculatorValidationError`, exactly like the single-compound engine.
 *
 * Invariant (asserted in tests): draws-per-vial is IDENTICAL across components,
 * because it equals `bacWaterMl / drawMl` — independent of any single component.
 */

import { forward } from "./forward";
import { roundConcentrationDisplay, roundTo, roundUnits } from "./round";
import { CalculatorValidationError } from "./types";
import {
  checkConcentrationHigh,
  checkConcentrationLow,
  checkDrawBelowPrecision,
  checkDrawExceedsSyringe,
  checkVolumeLarge,
} from "./warnings";

/** One component of a blend vial. `peptide` is an optional label (unused on the web). */
export type BlendComponent = { peptide?: string; mg: number };

/** The anchor drives the shared draw: by a target amount, or by draw units. */
export type BlendAnchor =
  | { targetDoseMg: number }
  | { drawUnitsU100: number };

export type BlendInput = {
  /** 2–4 components sharing one vial + one water volume. */
  components: BlendComponent[];
  /** Shared bacteriostatic water volume, in mL. */
  bacWaterMl: number;
  /** Index (0-based) of the component whose amount/units drives the draw. */
  anchorIndex: number;
  /** How the anchor fixes the draw. */
  anchor: BlendAnchor;
};

export type BlendComponentResult = {
  peptide?: string;
  /** This component's concentration, mg/mL (2-dp display rounding). */
  concentrationMgPerMl: number;
  /** mg of THIS component delivered in the shared draw. */
  perDoseMg: number;
  /** Draws this component's mass yields — equal across components. */
  totalDoses: number;
};

export type BlendOutput = {
  /** The shared draw, in whole U-100 units. */
  drawUnitsU100: number;
  components: BlendComponentResult[];
  /** Shared draws-per-vial (equal to every component's totalDoses). */
  totalDoses: number;
  /** Non-fatal warning messages (reuses the single-compound thresholds). */
  warnings: string[];
};

/** Blends hold 2–4 components (1 → use the normal calculator; >4 unsupported). */
const MIN_COMPONENTS = 2;
const MAX_COMPONENTS = 4;

export function computeBlend(input: BlendInput): BlendOutput {
  // ── 1. Validate structure ──────────────────────────────────────────────────
  if (
    !Array.isArray(input.components) ||
    input.components.length < MIN_COMPONENTS ||
    input.components.length > MAX_COMPONENTS
  ) {
    throw new CalculatorValidationError(
      "components",
      `a blend needs ${MIN_COMPONENTS}–${MAX_COMPONENTS} components`,
      input.components,
    );
  }
  assertPositiveFinite(input.bacWaterMl, "bacWaterMl");
  input.components.forEach((c, i) => {
    assertPositiveFinite(c.mg, `components[${i}].mg`);
  });
  if (
    !Number.isInteger(input.anchorIndex) ||
    input.anchorIndex < 0 ||
    input.anchorIndex >= input.components.length
  ) {
    throw new CalculatorValidationError(
      "anchorIndex",
      "must index one of the components",
      input.anchorIndex,
    );
  }

  const anchorComponent = input.components[input.anchorIndex];

  // ── 2. Resolve the shared draw (whole U-100 units) ─────────────────────────
  const drawUnitsU100 = resolveSharedDraw(
    input.anchor,
    anchorComponent,
    input.bacWaterMl,
  );
  if (drawUnitsU100 <= 0) {
    // An amount so small it rounds to a 0-unit draw is unusable — surface it
    // rather than divide by zero downstream.
    throw new CalculatorValidationError(
      "anchor",
      "the anchor draw rounds to 0 units — increase the amount or reduce the water",
      input.anchor,
    );
  }
  const drawMl = drawUnitsU100 / 100;

  // ── 3. Apply the shared draw to every component ────────────────────────────
  // Draws-per-vial is the same for every component (bacWaterMl / drawMl), so it
  // is computed once from the shared volume and reused — guaranteeing equality.
  const totalDoses = roundTo(input.bacWaterMl / drawMl, 2);

  const components: BlendComponentResult[] = input.components.map((c) => {
    const concentrationRaw = c.mg / input.bacWaterMl;
    const perDoseRaw = concentrationRaw * drawMl;
    return {
      peptide: c.peptide,
      concentrationMgPerMl: roundConcentrationDisplay(concentrationRaw),
      perDoseMg: roundTo(perDoseRaw, 4),
      totalDoses,
    };
  });

  // ── 4. Warnings — reuse the single-compound thresholds ─────────────────────
  // Draw-based checks run once on the shared draw. Concentration checks run on
  // the TOTAL solution concentration (all peptide mass over the shared water),
  // which is what governs the physical solution.
  const totalMg = input.components.reduce((sum, c) => sum + c.mg, 0);
  const totalConcentration = roundConcentrationDisplay(
    totalMg / input.bacWaterMl,
  );
  const warnings = [
    checkDrawExceedsSyringe(drawUnitsU100),
    checkDrawBelowPrecision(drawUnitsU100),
    checkConcentrationHigh(totalConcentration),
    checkConcentrationLow(totalConcentration),
    checkVolumeLarge(input.bacWaterMl),
  ]
    .filter((w): w is NonNullable<typeof w> => w !== null)
    .map((w) => w.message);

  return { drawUnitsU100, components, totalDoses, warnings };
}

// ─── helpers ──────────────────────────────────────────────────────────────

/**
 * Resolve the shared draw in whole U-100 units. Anchor-by-amount delegates to
 * `forward()` (which validates amount ≤ mg, positivity, etc. and returns the
 * rounded whole-unit draw); anchor-by-units validates + rounds the given value.
 */
function resolveSharedDraw(
  anchor: BlendAnchor,
  anchorComponent: BlendComponent,
  bacWaterMl: number,
): number {
  if ("targetDoseMg" in anchor) {
    // forward() throws CalculatorValidationError on a bad amount (≤ 0, > mg, etc.).
    const result = forward({
      vialMg: anchorComponent.mg,
      bacWaterMl,
      targetDoseMg: anchor.targetDoseMg,
    });
    return result.drawUnitsU100;
  }
  assertPositiveFinite(anchor.drawUnitsU100, "anchor.drawUnitsU100");
  return roundUnits(anchor.drawUnitsU100);
}

/** Asserts a positive, finite number; throws CalculatorValidationError otherwise. */
function assertPositiveFinite(value: unknown, field: string): asserts value is number {
  if (typeof value !== "number") {
    throw new CalculatorValidationError(field, "must be a number", value);
  }
  if (!Number.isFinite(value)) {
    throw new CalculatorValidationError(
      field,
      "must be a finite number (received NaN or Infinity)",
      value,
    );
  }
  if (value <= 0) {
    throw new CalculatorValidationError(field, "must be a positive number", value);
  }
}
