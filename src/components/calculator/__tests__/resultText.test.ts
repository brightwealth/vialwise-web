/**
 * Text the result views render: the vials/month line (shared by forward,
 * reverse and blend through VialUsage) and the forward/reverse footers.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { computeVialUsage, forward, reverse } from "@/lib/calculator";
import { deriveBlend, emptyBlendForm } from "../blendForm";
import { formatVialsPerMonth } from "../format";
import { FORWARD_FOOTER, forwardFooter, REVERSE_FOOTER } from "../resultCopy";

const daily = (totalDoses: number) =>
  formatVialsPerMonth(computeVialUsage({ totalDoses, frequency: "daily" }).vialsPerMonth);

test("vials/month is singular only when the displayed value is exactly 1", () => {
  assert.equal(formatVialsPerMonth(1), "1 vial/month");
  assert.equal(formatVialsPerMonth(1.0147), "1 vial/month"); // displays as 1
  assert.equal(formatVialsPerMonth(0.96), "1 vial/month"); // rounds up to 1
  assert.equal(formatVialsPerMonth(1.05), "1.1 vials/month");
  assert.equal(formatVialsPerMonth(0.94), "0.9 vials/month");
  assert.equal(formatVialsPerMonth(1.5), "1.5 vials/month");
  assert.equal(formatVialsPerMonth(2), "2 vials/month");
  assert.equal(formatVialsPerMonth(0.04), "0 vials/month");
  assert.equal(formatVialsPerMonth(null), null);
  assert.equal(formatVialsPerMonth(Number.NaN), null);
});

test("vials/month: forward, reverse and blend each reach '1 vial/month'", () => {
  // forward: 30 mg in 3 mL at 1 mg → 30 draws; daily ≈ 1.01 vials/month
  const f = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
  assert.equal(daily(f.totalDoses), "1 vial/month");

  // reverse: 30 mg / 1 mg / 10 units → 3 mL, 30 draws
  const r = reverse({ targetDoseMg: 1, vialMg: 30, desiredUnitsPerDrawU100: 10 });
  assert.equal(daily(r.totalDoses), "1 vial/month");

  // blend: 10 mg + 5 mg in 3 mL at a 10-unit draw → 30 draws
  const b = deriveBlend({
    ...emptyBlendForm(),
    componentMg: ["10", "5"],
    water: "3",
    anchorMode: "units",
    units: "10",
  });
  assert.equal(b.kind, "result");
  if (b.kind !== "result") return;
  assert.equal(daily(b.result.totalDoses), "1 vial/month");

  // and plural elsewhere: 10 mg + 1 mL + 0.5 mg → 20 draws → 1.5 vials/month
  assert.equal(daily(forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 0.5 }).totalDoses), "1.5 vials/month");
});

test("result footers make no claim about researchers", () => {
  assert.equal(FORWARD_FOOTER, "Calculated from the numbers you entered.");
  assert.equal(
    REVERSE_FOOTER,
    "The water volume that makes your target amount fit the draw size you chose.",
  );
  for (const text of [FORWARD_FOOTER, REVERSE_FOOTER]) {
    assert.doesNotMatch(text, /researcher|dose/i);
  }
});

test("forward footer is hidden when the draw rounds to 0 units", () => {
  const tiny = forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 0.04 }); // 0.4 units
  assert.equal(tiny.drawUnitsU100, 0);
  assert.equal(forwardFooter(tiny.drawUnitsU100), null);

  const half = forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 0.05 }); // 0.5 units → 1
  assert.equal(half.drawUnitsU100, 1);
  assert.equal(forwardFooter(half.drawUnitsU100), FORWARD_FOOTER);

  assert.equal(forwardFooter(5), FORWARD_FOOTER);
});
