// SYNCED from the VialWise app: src/calculator/__tests__/reverse.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Reverse calculator tests.
 *
 * The four canonical reverse-direction cases come from the architecture
 * document. The round-trip section proves that forward() and reverse()
 * are mathematically consistent with each other — if you take the BAC
 * water amount that reverse() produced and feed it through forward(),
 * you get back the units you originally asked for.
 */

import { reverse } from "../../reverse";
import { forward } from "../../forward";
import { CalculatorValidationError } from "../../types";

// ─────────────────────────────────────────────────────────────────────────────
// The four canonical reverse cases from the architecture doc
// ─────────────────────────────────────────────────────────────────────────────

describe("reverse calculator — Retatrutide protocol cases", () => {
  test("1mg dose, 30mg vial, 10 units desired → 3.0 mL BAC water", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    });
    expect(r.bacWaterMlToAdd).toBe(3);
    expect(r.concentrationMgPerMl).toBe(10);
    expect(r.warnings).toEqual([]);
  });

  test("1mg dose, 30mg vial, 5 units desired → 1.5 mL BAC water", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 5,
    });
    expect(r.bacWaterMlToAdd).toBe(1.5);
    expect(r.concentrationMgPerMl).toBe(20);
    expect(r.warnings).toEqual([]);
  });

  test("2mg dose, 30mg vial, 20 units desired → 3.0 mL BAC water", () => {
    const r = reverse({
      targetDoseMg: 2,
      vialMg: 30,
      desiredUnitsPerDrawU100: 20,
    });
    expect(r.bacWaterMlToAdd).toBe(3);
    expect(r.concentrationMgPerMl).toBe(10);
    expect(r.warnings).toEqual([]);
  });

  test("1mg dose, 8mg vial, 25 units desired → 2.0 mL BAC water", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 8,
      desiredUnitsPerDrawU100: 25,
    });
    expect(r.bacWaterMlToAdd).toBe(2);
    expect(r.concentrationMgPerMl).toBe(4);
    expect(r.warnings).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation pass-through
// ─────────────────────────────────────────────────────────────────────────────

describe("reverse calculator — validation pass-through", () => {
  test("throws for fractional desired units (no silent rounding)", () => {
    expect(() =>
      reverse({
        targetDoseMg: 1,
        vialMg: 30,
        desiredUnitsPerDrawU100: 10.5,
      })
    ).toThrow(/whole integer/);
  });

  test("throws for negative dose", () => {
    expect(() =>
      reverse({
        targetDoseMg: -1,
        vialMg: 30,
        desiredUnitsPerDrawU100: 10,
      })
    ).toThrow(/positive/);
  });

  test("throws when dose exceeds vial total", () => {
    expect(() =>
      reverse({
        targetDoseMg: 50,
        vialMg: 30,
        desiredUnitsPerDrawU100: 10,
      })
    ).toThrow(/cannot exceed vial total/);
  });

  test("throws for zero desired units", () => {
    expect(() =>
      reverse({
        targetDoseMg: 1,
        vialMg: 30,
        desiredUnitsPerDrawU100: 0,
      })
    ).toThrow(/positive/);
  });

  test("throws CalculatorValidationError type (not a generic Error)", () => {
    expect(() =>
      reverse({
        targetDoseMg: 1,
        vialMg: 30,
        desiredUnitsPerDrawU100: -10,
      })
    ).toThrow(CalculatorValidationError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Warnings
// ─────────────────────────────────────────────────────────────────────────────

describe("reverse calculator — warnings", () => {
  test("emits DRAW_EXCEEDS_SYRINGE when desired > 100 units", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 150,
    });
    const codes = r.warnings.map((w) => w.code);
    expect(codes).toContain("DRAW_EXCEEDS_SYRINGE");
  });

  test("emits DRAW_BELOW_PRECISION at 1 desired unit", () => {
    const r = reverse({
      targetDoseMg: 0.05,
      vialMg: 30,
      desiredUnitsPerDrawU100: 1,
    });
    const codes = r.warnings.map((w) => w.code);
    expect(codes).toContain("DRAW_BELOW_PRECISION");
  });

  test("clean Retatrutide reverse-calc input produces no warnings", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    });
    expect(r.warnings).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Output shape
// ─────────────────────────────────────────────────────────────────────────────

describe("reverse calculator — output shape", () => {
  test("returns ReverseOutput with all expected fields", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    });
    expect(r).toHaveProperty("bacWaterMlToAdd");
    expect(r).toHaveProperty("concentrationMgPerMl");
    expect(r).toHaveProperty("warnings");
    expect(Array.isArray(r.warnings)).toBe(true);
  });

  test("is a pure function — same input always produces same output", () => {
    const a = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    });
    const b = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    });
    expect(a).toEqual(b);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Round-trip: reverse() output, fed into forward(), gives back the original units.
//
// This is the strongest correctness signal: the two calculators are
// mathematically consistent with each other. If a future change breaks
// either one, this test will fail loudly.
// ─────────────────────────────────────────────────────────────────────────────

describe("forward ↔ reverse round-trip", () => {
  test("reverse produces water that forward computes back to original units (10 units)", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    });
    expect(r.bacWaterMlToAdd).toBe(3);

    const f = forward({
      vialMg: 30,
      bacWaterMl: r.bacWaterMlToAdd,
      targetDoseMg: 1,
    });
    expect(f.drawUnitsU100).toBe(10);
  });

  test("round-trip 5 units (1mg, 30mg vial)", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 5,
    });
    const f = forward({
      vialMg: 30,
      bacWaterMl: r.bacWaterMlToAdd,
      targetDoseMg: 1,
    });
    expect(f.drawUnitsU100).toBe(5);
  });

  test("round-trip 25 units (1mg, 8mg vial)", () => {
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 8,
      desiredUnitsPerDrawU100: 25,
    });
    const f = forward({
      vialMg: 8,
      bacWaterMl: r.bacWaterMlToAdd,
      targetDoseMg: 1,
    });
    expect(f.drawUnitsU100).toBe(25);
  });

  test("round-trip with display-rounding of bacWater is within 1-unit tolerance", () => {
    // Some inputs produce non-clean BAC water values (e.g., 2.04 mL → rounds
    // to 2.0). After display rounding, the forward result may shift by 1
    // unit. This is acceptable because users measure water in 0.1 mL
    // increments anyway.
    const r = reverse({
      targetDoseMg: 1,
      vialMg: 12,
      desiredUnitsPerDrawU100: 17,
    });
    const f = forward({
      vialMg: 12,
      bacWaterMl: r.bacWaterMlToAdd,
      targetDoseMg: 1,
    });
    expect(Math.abs(f.drawUnitsU100 - 17)).toBeLessThanOrEqual(1);
  });
});
