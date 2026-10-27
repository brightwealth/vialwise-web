// SYNCED from the VialWise app: src/calculator/__tests__/forward.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Forward calculator tests.
 *
 * The seven Retatrutide-anchored cases come straight from the architecture
 * doc. They mirror the reconstitution table in the Retatrutide content
 * entry — same numbers Andrew has been using for his own protocol. If
 * these pass, the engine handles real-world reconstitution math correctly.
 *
 * Beyond the canonical cases: validation pass-through, U-40 syringe units,
 * warning emission for unusual inputs, and output-shape assertions.
 */

import { forward } from "../../forward";
import { CalculatorValidationError } from "../../types";

// ─────────────────────────────────────────────────────────────────────────────
// The seven canonical Retatrutide protocol cases from the architecture doc
// ─────────────────────────────────────────────────────────────────────────────

describe("forward — a draw that rounds to 0 units (2026-10-02)", () => {
  test("10 mg / 2 mL / 0.01 mg: 0 units, and now a warning instead of silence", () => {
    const out = forward({ vialMg: 10, bacWaterMl: 2, targetDoseMg: 0.01 });
    expect(out.drawUnitsU100).toBe(0);
    expect(out.warnings.map((w) => w.code)).toEqual(["DRAW_ROUNDS_TO_ZERO"]);
  });
});

describe("forward calculator — Retatrutide protocol cases", () => {
  test("30mg vial, 3.0 mL BAC, 1mg dose → 10 mg/mL, 10 units U-100", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(r.concentrationMgPerMl).toBe(10);
    expect(r.drawMl).toBe(0.1);
    expect(r.drawUnitsU100).toBe(10);
    expect(r.warnings).toEqual([]);
  });

  test("30mg vial, 3.0 mL BAC, 2mg dose → 10 mg/mL, 20 units U-100", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 2 });
    expect(r.concentrationMgPerMl).toBe(10);
    expect(r.drawMl).toBe(0.2);
    expect(r.drawUnitsU100).toBe(20);
    expect(r.warnings).toEqual([]);
  });

  test("30mg vial, 1.5 mL BAC, 1mg dose → 20 mg/mL, 5 units U-100", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 1.5, targetDoseMg: 1 });
    expect(r.concentrationMgPerMl).toBe(20);
    expect(r.drawMl).toBe(0.05);
    expect(r.drawUnitsU100).toBe(5);
    // Note: 5 units is just at the precision edge, but DRAW_BELOW_PRECISION
    // triggers below 2. 5 units is clean.
    expect(r.warnings).toEqual([]);
  });

  test("12mg vial, 2.0 mL BAC, 1mg dose → 6 mg/mL, 17 units U-100", () => {
    const r = forward({ vialMg: 12, bacWaterMl: 2, targetDoseMg: 1 });
    expect(r.concentrationMgPerMl).toBe(6);
    expect(r.drawMl).toBe(0.1667);
    expect(r.drawUnitsU100).toBe(17);
    expect(r.warnings).toEqual([]);
  });

  test("8mg vial, 2.0 mL BAC, 1mg dose → 4 mg/mL, 25 units U-100", () => {
    const r = forward({ vialMg: 8, bacWaterMl: 2, targetDoseMg: 1 });
    expect(r.concentrationMgPerMl).toBe(4);
    expect(r.drawMl).toBe(0.25);
    expect(r.drawUnitsU100).toBe(25);
    expect(r.warnings).toEqual([]);
  });

  test("5mg vial, 2.0 mL BAC, 1mg dose → 2.5 mg/mL, 40 units U-100", () => {
    const r = forward({ vialMg: 5, bacWaterMl: 2, targetDoseMg: 1 });
    expect(r.concentrationMgPerMl).toBe(2.5);
    expect(r.drawMl).toBe(0.4);
    expect(r.drawUnitsU100).toBe(40);
    expect(r.warnings).toEqual([]);
  });

  test("20mg vial, 2.0 mL BAC, 1mg dose → 10 mg/mL, 10 units U-100", () => {
    const r = forward({ vialMg: 20, bacWaterMl: 2, targetDoseMg: 1 });
    expect(r.concentrationMgPerMl).toBe(10);
    expect(r.drawMl).toBe(0.1);
    expect(r.drawUnitsU100).toBe(10);
    expect(r.warnings).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// U-40 syringe units (legacy/animal contexts)
// ─────────────────────────────────────────────────────────────────────────────

describe("forward calculator — U-40 syringe units", () => {
  test("30mg vial, 3.0 mL BAC, 1mg dose → 4 units U-40", () => {
    // 0.1 mL × 40 units/mL = 4 units
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(r.drawUnitsU40).toBe(4);
  });

  test("U-40 always produces smaller unit count than U-100 for same draw", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(r.drawUnitsU40).toBeLessThan(r.drawUnitsU100);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation pass-through — forward() throws via validateForwardInput
// ─────────────────────────────────────────────────────────────────────────────

describe("forward calculator — validation pass-through", () => {
  test("throws CalculatorValidationError for negative vialMg", () => {
    expect(() =>
      forward({ vialMg: -5, bacWaterMl: 3, targetDoseMg: 1 })
    ).toThrow(CalculatorValidationError);
  });

  test("throws when dose exceeds vial total", () => {
    expect(() =>
      forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 50 })
    ).toThrow(/cannot exceed vial total/);
  });

  test("throws for NaN vialMg", () => {
    expect(() =>
      forward({ vialMg: NaN, bacWaterMl: 3, targetDoseMg: 1 })
    ).toThrow(CalculatorValidationError);
  });

  test("throws for zero bacWaterMl (would divide by zero)", () => {
    expect(() =>
      forward({ vialMg: 30, bacWaterMl: 0, targetDoseMg: 1 })
    ).toThrow(/positive/);
  });

  test("throws for Infinity targetDoseMg", () => {
    expect(() =>
      forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: Infinity })
    ).toThrow(/finite/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Warnings — emitted alongside successful results
// ─────────────────────────────────────────────────────────────────────────────

describe("forward calculator — warnings", () => {
  test("emits DRAW_EXCEEDS_SYRINGE when draw > 100 units", () => {
    // 10mg vial / 10mL BAC = 1 mg/mL; 10mg dose = 10 mL = 1000 units
    const r = forward({ vialMg: 10, bacWaterMl: 10, targetDoseMg: 10 });
    const codes = r.warnings.map((w) => w.code);
    expect(codes).toContain("DRAW_EXCEEDS_SYRINGE");
  });

  test("emits CONCENTRATION_VERY_HIGH for tightly concentrated reconstitution", () => {
    // 100mg vial / 1mL BAC = 100 mg/mL > 50 → CONCENTRATION_VERY_HIGH
    const r = forward({ vialMg: 100, bacWaterMl: 1, targetDoseMg: 1 });
    const codes = r.warnings.map((w) => w.code);
    expect(codes).toContain("CONCENTRATION_VERY_HIGH");
  });

  test("emits DOSE_NEAR_VIAL_CAPACITY for one-dose vials", () => {
    const r = forward({ vialMg: 5, bacWaterMl: 2, targetDoseMg: 5 });
    const codes = r.warnings.map((w) => w.code);
    expect(codes).toContain("DOSE_NEAR_VIAL_CAPACITY");
  });

  test("clean Retatrutide protocol produces zero warnings", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(r.warnings).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Output-shape assertions — make sure the public API contract is intact
// ─────────────────────────────────────────────────────────────────────────────

describe("forward calculator — output shape", () => {
  test("returns ForwardOutput with all expected fields", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(r).toHaveProperty("concentrationMgPerMl");
    expect(r).toHaveProperty("drawMl");
    expect(r).toHaveProperty("drawUnitsU100");
    expect(r).toHaveProperty("drawUnitsU40");
    expect(r).toHaveProperty("warnings");
    expect(Array.isArray(r.warnings)).toBe(true);
  });

  test("all numeric fields are finite numbers", () => {
    const r = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(Number.isFinite(r.concentrationMgPerMl)).toBe(true);
    expect(Number.isFinite(r.drawMl)).toBe(true);
    expect(Number.isFinite(r.drawUnitsU100)).toBe(true);
    expect(Number.isFinite(r.drawUnitsU40)).toBe(true);
  });

  test("is a pure function — same input always produces same output", () => {
    const a = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    const b = forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 });
    expect(a).toEqual(b);
  });
});
