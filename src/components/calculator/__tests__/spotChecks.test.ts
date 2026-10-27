/**
 * The release spot checks for web calculator v2, through the same functions
 * the page renders from.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { computeVialUsage, forward } from "@/lib/calculator";
import { deriveBlend, emptyBlendForm, formatBlendAmount } from "../blendForm";
import { formatDraws } from "../format";
import { syringeStateFor } from "../syringe/syringeState";

test("forward: 10 mg vial + 1 mL water + 0.5 mg → 10 mg/mL, 5 units, 20 draws per vial", () => {
  const r = forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 0.5 });
  assert.equal(r.concentrationMgPerMl, 10);
  assert.equal(r.drawUnitsU100, 5);
  assert.equal(formatDraws(r.totalDoses), "20");
  assert.equal(syringeStateFor(r.drawUnitsU100, 100), "ok");
  assert.deepEqual(r.warnings, []);
});

test("blend: 10 mg + 5 mg in 2 mL at a 20-unit draw → 1 mg and 0.5 mg, 10 draws per vial", () => {
  const s = deriveBlend({
    ...emptyBlendForm(),
    componentMg: ["10", "5"],
    water: "2",
    anchorMode: "units",
    units: "20",
  });
  assert.equal(s.kind, "result");
  if (s.kind !== "result") return;
  assert.deepEqual(
    s.result.components.map((c) => formatBlendAmount(c.perDoseMg, "mg")),
    ["1 mg", "0.5 mg"],
  );
  assert.equal(formatDraws(s.result.totalDoses), "10");
  assert.equal(computeVialUsage({ totalDoses: s.result.totalDoses, frequency: "daily" }).daysPerVial, 10);
});

test("an amount under half a unit shows the new warning", () => {
  const r = forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 0.04 }); // 0.4 units
  assert.equal(r.drawUnitsU100, 0);
  const w = r.warnings.find((x) => x.code === "DRAW_ROUNDS_TO_ZERO");
  assert.ok(w, "DRAW_ROUNDS_TO_ZERO missing");
  assert.equal(w.message, "This amount is too small to measure on this syringe at this concentration.");
  assert.equal(syringeStateFor(r.drawUnitsU100, 100), "below-precision");
});
