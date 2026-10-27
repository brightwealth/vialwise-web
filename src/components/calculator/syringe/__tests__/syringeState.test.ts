/**
 * Syringe-size policy. `syringeStateFor` must agree with the app's rule, which
 * derives the state from the engine's warnings (plus the screen's overflow
 * note for 30 / 50 IU syringes) — checked here across a grid.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { forward, type CalculatorWarning } from "@/lib/calculator";
import {
  DEFAULT_SYRINGE_SIZE,
  SYRINGE_SIZES,
  syringeOverflowWarning,
  syringeStateFor,
  withSyringeOverflow,
} from "../syringeState";

/** The app's deriveSyringeState (ForwardCalculatorScreen), verbatim logic. */
function appDeriveSyringeState(warnings: readonly CalculatorWarning[]) {
  if (warnings.some((w) => w.code === "DRAW_EXCEEDS_SYRINGE")) return "exceeds-syringe";
  if (warnings.some((w) => w.code === "DRAW_BELOW_PRECISION" || w.code === "DRAW_ROUNDS_TO_ZERO")) {
    return "below-precision";
  }
  return "ok";
}

test("same sizes, labels and default as the app", () => {
  assert.deepEqual(
    SYRINGE_SIZES.map((s) => [s.value, s.label, s.helper]),
    [
      [30, "30 IU", "0.3 mL"],
      [50, "50 IU", "0.5 mL"],
      [100, "100 IU", "1.0 mL"],
    ],
  );
  assert.equal(DEFAULT_SYRINGE_SIZE, 100);
});

test("syringeStateFor matches the app's warnings-based state on every size", () => {
  let checked = 0;
  for (const vialMg of [1, 5, 10, 30, 100]) {
    for (const bacWaterMl of [0.5, 1, 2, 3, 12]) {
      for (const targetDoseMg of [0.001, 0.04, 0.1, 0.25, 0.5, 1, 2.5]) {
        if (targetDoseMg > vialMg) continue;
        const r = forward({ vialMg, bacWaterMl, targetDoseMg });
        for (const { value: max } of SYRINGE_SIZES) {
          const expected = appDeriveSyringeState(withSyringeOverflow(r.warnings, r.drawUnitsU100, max));
          assert.equal(syringeStateFor(r.drawUnitsU100, max), expected, `${vialMg}/${bacWaterMl}/${targetDoseMg} on ${max}`);
          checked++;
        }
      }
    }
  }
  assert.ok(checked > 300);
});

test("overflow note: only when the draw fits 100 IU but not the chosen syringe", () => {
  assert.equal(syringeOverflowWarning(40, 100), null);
  assert.equal(syringeOverflowWarning(30, 30), null);
  assert.equal(syringeOverflowWarning(120, 30), null); // engine already flags > 100
  assert.deepEqual(syringeOverflowWarning(40, 30), {
    level: "danger",
    code: "DRAW_EXCEEDS_SYRINGE",
    message: "Draw is 40 units — exceeds your 30 IU syringe by 10 units. Use a larger syringe or split into multiple draws.",
  });
});

test("withSyringeOverflow puts the note first and leaves fitting draws alone", () => {
  const engine: CalculatorWarning[] = [
    { level: "info", code: "DOSE_NEAR_VIAL_CAPACITY", message: "x" },
  ];
  assert.equal(withSyringeOverflow(engine, 20, 30), engine);
  const out = withSyringeOverflow(engine, 40, 30);
  assert.equal(out.length, 2);
  assert.equal(out[0].code, "DRAW_EXCEEDS_SYRINGE");
});
