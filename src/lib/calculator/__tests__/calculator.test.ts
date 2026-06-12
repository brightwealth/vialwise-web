/**
 * Parity tests for the web calculator engine.
 *
 * These cases are ported from the Vialwise iOS app's calculator test suite
 * (`src/calculator/__tests__/{forward,reverse,warnings,vialUsage}.test.ts`) —
 * the seven Retatrutide-anchored forward cases and four reverse cases are the
 * project's ground-truth reconstitution numbers. If the web engine produces
 * the same outputs for these inputs, it is byte-identical to the app.
 *
 * Runner: Node's built-in test runner via tsx (`npm test`) — no Jest. tsx
 * resolves the engine's extensionless TS imports the same way the Next/webpack
 * build does, so the test exercises exactly the code that ships.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { forward } from "../forward";
import { reverse } from "../reverse";
import { CalculatorValidationError } from "../types";
import { computeVialUsage } from "../vialUsage";
import { WARNING_THRESHOLDS } from "../warnings";

// ── 7 canonical Retatrutide forward cases (from app forward.test.ts) ──────────
const FORWARD_CASES = [
  { in: { vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 }, conc: 10, drawMl: 0.1, u100: 10 },
  { in: { vialMg: 30, bacWaterMl: 3, targetDoseMg: 2 }, conc: 10, drawMl: 0.2, u100: 20 },
  { in: { vialMg: 30, bacWaterMl: 1.5, targetDoseMg: 1 }, conc: 20, drawMl: 0.05, u100: 5 },
  { in: { vialMg: 12, bacWaterMl: 2, targetDoseMg: 1 }, conc: 6, drawMl: 0.1667, u100: 17 },
  { in: { vialMg: 8, bacWaterMl: 2, targetDoseMg: 1 }, conc: 4, drawMl: 0.25, u100: 25 },
  { in: { vialMg: 5, bacWaterMl: 2, targetDoseMg: 1 }, conc: 2.5, drawMl: 0.4, u100: 40 },
  { in: { vialMg: 20, bacWaterMl: 2, targetDoseMg: 1 }, conc: 10, drawMl: 0.1, u100: 10 },
];

for (const c of FORWARD_CASES) {
  test(`forward ${JSON.stringify(c.in)} → ${c.conc} mg/mL, ${c.u100}u`, () => {
    const r = forward(c.in);
    assert.equal(r.concentrationMgPerMl, c.conc, "concentration");
    assert.equal(r.drawMl, c.drawMl, "drawMl");
    assert.equal(r.drawUnitsU100, c.u100, "drawUnitsU100");
    assert.deepEqual(r.warnings, [], "no warnings on clean inputs");
  });
}

test("forward U-40 units: 30/3/1 → 4 units U-40, fewer than U-100", () => {
  const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
  assert.equal(r.drawUnitsU40, 4);
  assert.ok(r.drawUnitsU40 < r.drawUnitsU100);
});

// ── 4 canonical reverse cases (from app reverse.test.ts) ──────────────────────
const REVERSE_CASES = [
  { in: { targetDoseMg: 1, vialMg: 30, desiredUnitsPerDrawU100: 10 }, water: 3, conc: 10 },
  { in: { targetDoseMg: 1, vialMg: 30, desiredUnitsPerDrawU100: 5 }, water: 1.5, conc: 20 },
  { in: { targetDoseMg: 2, vialMg: 30, desiredUnitsPerDrawU100: 20 }, water: 3, conc: 10 },
  { in: { targetDoseMg: 1, vialMg: 8, desiredUnitsPerDrawU100: 25 }, water: 2, conc: 4 },
];

for (const c of REVERSE_CASES) {
  test(`reverse ${JSON.stringify(c.in)} → ${c.water} mL water`, () => {
    const r = reverse(c.in);
    assert.equal(r.bacWaterMlToAdd, c.water, "bac water to add");
    assert.equal(r.concentrationMgPerMl, c.conc, "concentration");
    assert.deepEqual(r.warnings, [], "no warnings on clean inputs");
  });
}

test("round-trip: reverse → forward returns the requested units", () => {
  const rev = reverse({ targetDoseMg: 1, vialMg: 30, desiredUnitsPerDrawU100: 10 });
  const fwd = forward({ vialMg: 30, bacWaterMl: rev.bacWaterMlToAdd, targetDoseMg: 1 });
  assert.equal(fwd.drawUnitsU100, 10);
});

// ── Validation pass-through (engine throws CalculatorValidationError) ─────────
test("forward throws on negative vial size", () => {
  assert.throws(
    () => forward({ vialMg: -5, bacWaterMl: 3, targetDoseMg: 1 }),
    CalculatorValidationError,
  );
});

test("forward throws when amount exceeds the vial total", () => {
  assert.throws(
    () => forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 50 }),
    /cannot exceed vial total/,
  );
});

test("reverse throws on a fractional desired draw (no silent rounding)", () => {
  assert.throws(
    () => reverse({ targetDoseMg: 1, vialMg: 30, desiredUnitsPerDrawU100: 10.5 }),
    /whole integer/,
  );
});

// ── Warnings: syringe-overflow + below-precision + near-capacity ──────────────
test("forward flags DRAW_EXCEEDS_SYRINGE when the draw is over 100 units", () => {
  const r = forward({ vialMg: 10, bacWaterMl: 10, targetDoseMg: 2 }); // conc 1, 200u
  assert.ok(
    r.warnings.some((w) => w.code === "DRAW_EXCEEDS_SYRINGE" && w.level === "danger"),
  );
});

test("forward flags DRAW_BELOW_PRECISION + CONCENTRATION_VERY_HIGH at 1u / 100 mg·mL⁻¹", () => {
  const r = forward({ vialMg: 100, bacWaterMl: 1, targetDoseMg: 1 }); // conc 100, 1u
  const codes = r.warnings.map((w) => w.code);
  assert.ok(codes.includes("DRAW_BELOW_PRECISION"));
  assert.ok(codes.includes("CONCENTRATION_VERY_HIGH"));
});

test("forward flags DOSE_NEAR_VIAL_CAPACITY at an amount/vial ratio of 0.5", () => {
  const r = forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 5 });
  assert.ok(r.warnings.some((w) => w.code === "DOSE_NEAR_VIAL_CAPACITY"));
  assert.equal(r.totalDoses, 2);
});

test("WARNING_THRESHOLDS match the app", () => {
  assert.equal(WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100, 100);
  assert.equal(WARNING_THRESHOLDS.DRAW_LOWER_UNITS_U100, 2);
  assert.equal(WARNING_THRESHOLDS.CONCENTRATION_HIGH_MG_PER_ML, 50);
  assert.equal(WARNING_THRESHOLDS.CONCENTRATION_LOW_MG_PER_ML, 0.1);
  assert.equal(WARNING_THRESHOLDS.VOLUME_LARGE_ML, 10);
  assert.equal(WARNING_THRESHOLDS.DOSE_TO_VIAL_RATIO, 0.5);
});

// ── Vial usage: draws-per-vial → days/vial + vials/month ──────────────────────
test("computeVialUsage daily, 30 draws → 30 days/vial, ~1.01 vials/month", () => {
  const u = computeVialUsage({ totalDoses: 30, frequency: "daily" });
  assert.equal(u.daysPerVial, 30);
  assert.ok(u.vialsPerMonth !== null && Math.abs(u.vialsPerMonth - 1.0147) < 0.001);
});

test("computeVialUsage guards zero draws → null (no divide-by-zero)", () => {
  const u = computeVialUsage({ totalDoses: 0, frequency: "daily" });
  assert.equal(u.vialsPerMonth, null);
  assert.equal(u.daysPerVial, null);
});
