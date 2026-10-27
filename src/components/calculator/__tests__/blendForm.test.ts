/**
 * Blend form logic: raw field text → computeBlend → result or a message for
 * the right field. The blend math itself is covered by the app's own tests
 * (`src/lib/calculator/__tests__/app/blend.test.ts`) and the golden vectors.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  anchorAfterRemoval,
  BLEND_LABELS,
  deriveBlend,
  emptyBlendForm,
  formatBlendAmount,
  type BlendForm,
} from "../blendForm";

const form = (patch: Partial<BlendForm>): BlendForm => ({ ...emptyBlendForm(), ...patch });

test("labels are generic, A to D, and the form starts blank (nothing seeded)", () => {
  assert.deepEqual([...BLEND_LABELS], ["Peptide A", "Peptide B", "Peptide C", "Peptide D"]);
  const blank = emptyBlendForm();
  assert.deepEqual(blank.componentMg, ["", ""]);
  assert.equal(blank.water, "");
  assert.equal(blank.amount, "");
  assert.equal(blank.units, "");
  assert.deepEqual(deriveBlend(blank), { kind: "empty" });
});

test("incomplete input is empty, not an error", () => {
  assert.deepEqual(deriveBlend(form({ componentMg: ["10", ""], water: "2", units: "20", anchorMode: "units" })), {
    kind: "empty",
  });
  assert.deepEqual(deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorMode: "amount", units: "20" })), {
    kind: "empty",
  });
});

test("anchored by draw units: 10 mg + 5 mg in 2 mL at 20 units", () => {
  const s = deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorMode: "units", units: "20" }));
  assert.equal(s.kind, "result");
  if (s.kind !== "result") return;
  assert.equal(s.result.drawUnitsU100, 20);
  assert.deepEqual(
    s.result.components.map((c) => c.perDoseMg),
    [1, 0.5],
  );
  assert.equal(s.result.totalDoses, 10);
});

test("anchored by amount: 1 mg of Peptide A gives the same draw", () => {
  const s = deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorIndex: 0, amount: "1" }));
  assert.equal(s.kind, "result");
  if (s.kind !== "result") return;
  assert.equal(s.result.drawUnitsU100, 20);
  assert.equal(s.result.components[1].perDoseMg, 0.5);
});

test("anchored by amount on Peptide B, in mcg", () => {
  const s = deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorIndex: 1, amount: "500", amountUnit: "mcg" }));
  assert.equal(s.kind, "result");
  if (s.kind !== "result") return;
  assert.equal(s.result.drawUnitsU100, 20);
  assert.equal(s.result.components[0].perDoseMg, 1);
});

test("a units anchor ignores which peptide is selected for the amount anchor", () => {
  const a = deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorMode: "units", units: "20", anchorIndex: 0 }));
  const b = deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorMode: "units", units: "20", anchorIndex: 1 }));
  assert.deepEqual(a, b);
});

test("four components are supported", () => {
  const s = deriveBlend(form({ componentMg: ["5", "5", "5", "5"], water: "2", anchorMode: "units", units: "8" }));
  assert.equal(s.kind, "result");
  if (s.kind === "result") assert.equal(s.result.components.length, 4);
});

test("an amount under half a unit returns the engine's 0-unit warning", () => {
  // 10 mg in 1 mL = 10 mg/mL; 0.04 mg = 0.4 units → rounds to 0.
  const s = deriveBlend(form({ componentMg: ["10", "5"], water: "1", amount: "0.04" }));
  assert.equal(s.kind, "too-small");
  if (s.kind !== "too-small") return;
  assert.equal(s.warning.code, "DRAW_ROUNDS_TO_ZERO");
  assert.equal(s.warning.message, "This amount is too small to measure on this syringe at this concentration.");
});

test("a units anchor that rounds to 0 is a field error on units", () => {
  assert.deepEqual(deriveBlend(form({ componentMg: ["10", "5"], water: "2", anchorMode: "units", units: "0.4" })), {
    kind: "error",
    field: "units",
    message: "Rounds to 0 units. Enter at least 1 unit.",
  });
});

test("errors land on the field that caused them", () => {
  const base = { componentMg: ["10", "5"], water: "2", amount: "1" };
  assert.deepEqual(deriveBlend(form({ ...base, componentMg: ["10", "0"] })), {
    kind: "error",
    field: "component-1",
    message: "Enter a number greater than zero.",
  });
  assert.deepEqual(deriveBlend(form({ ...base, water: "abc" })), {
    kind: "error",
    field: "water",
    message: "Enter a valid number.",
  });
  assert.deepEqual(deriveBlend(form({ ...base, amount: "-1" })), {
    kind: "error",
    field: "amount",
    message: "Enter a number greater than zero.",
  });
  assert.deepEqual(deriveBlend(form({ ...base, amount: "20" })), {
    kind: "error",
    field: "amount",
    message: "Can’t exceed the amount of Peptide A in the vial.",
  });
  assert.deepEqual(deriveBlend(form({ ...base, anchorMode: "units", units: "x" })), {
    kind: "error",
    field: "units",
    message: "Enter a valid number.",
  });
});

test("no user-facing message says dose", () => {
  const cases: Partial<BlendForm>[] = [
    { componentMg: ["10", "0"], water: "2", amount: "1" },
    { componentMg: ["10", "5"], water: "0", amount: "1" },
    { componentMg: ["10", "5"], water: "1", amount: "0.04" },
    { componentMg: ["10", "5"], water: "2", amount: "20" },
    { componentMg: ["10", "5"], water: "2", anchorMode: "units", units: "0.4" },
    { componentMg: ["1", "1"], water: "12", anchorMode: "units", units: "120" },
    { componentMg: ["50", "50"], water: "1", anchorMode: "units", units: "1" },
  ];
  for (const c of cases) {
    const s = deriveBlend(form(c));
    const text =
      s.kind === "error" ? s.message : s.kind === "too-small" ? s.warning.message : s.kind === "result" ? s.result.warnings.join(" ") : "";
    assert.doesNotMatch(text, /dose/i, JSON.stringify(c));
  }
});

test("per-draw amounts format like the app's blend screen", () => {
  assert.equal(formatBlendAmount(1, "mg"), "1 mg");
  assert.equal(formatBlendAmount(0.5, "mg"), "0.5 mg");
  assert.equal(formatBlendAmount(0.12345, "mg"), "0.1235 mg");
  assert.equal(formatBlendAmount(0.2, "mcg"), "200 mcg");
  assert.equal(formatBlendAmount(0.0012345, "mcg"), "1.23 mcg");
});

test("removing a component keeps the anchor on the same peptide", () => {
  assert.equal(anchorAfterRemoval(2, 0), 1);
  assert.equal(anchorAfterRemoval(2, 2), 0);
  assert.equal(anchorAfterRemoval(1, 3), 1);
});
