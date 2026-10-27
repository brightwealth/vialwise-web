// SYNCED from the VialWise app: src/calculator/__tests__/round.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Rounding helper tests — covers floating-point quirks, boundary rounding,
 * and Retatrutide-anchored real-world precision cases.
 *
 * If a test here fails, the calculator's display values may show users
 * a number that disagrees with the real underlying calculation.
 */

import {
  roundTo,
  roundMlPrecise,
  roundMlDisplay,
  roundUnits,
  roundConcentrationDisplay,
} from "../../round";

// ─────────────────────────────────────────────────────────────────────────────
// roundTo (generic helper)
// ─────────────────────────────────────────────────────────────────────────────

describe("roundTo", () => {
  describe("standard cases", () => {
    test("rounds 3.14159 to 2 decimals", () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
    });

    test("rounds 1/6 to 4 decimals (canonical 0.1666... case)", () => {
      expect(roundTo(1 / 6, 4)).toBe(0.1667);
    });

    test("rounds to integer when decimals = 0", () => {
      expect(roundTo(16.67, 0)).toBe(17);
    });

    test("returns 0 for 0", () => {
      expect(roundTo(0, 4)).toBe(0);
    });

    test("preserves whole numbers (no spurious decimal drift)", () => {
      expect(roundTo(10, 4)).toBe(10);
    });
  });

  describe("floating-point precision (the reason this module exists)", () => {
    test("handles 0.1 + 0.2 (raw === 0.30000000000000004 in JS)", () => {
      expect(roundTo(0.1 + 0.2, 4)).toBe(0.3);
    });

    test("handles exact division: 30 / 3 = 10", () => {
      expect(roundTo(30 / 3, 4)).toBe(10);
    });

    test("handles exact division: 12 / 2 = 6", () => {
      expect(roundTo(12 / 2, 4)).toBe(6);
    });
  });

  describe("edge cases", () => {
    test("preserves negative numbers", () => {
      expect(roundTo(-3.14159, 2)).toBe(-3.14);
    });

    test("rounds 0.5 to 1 (Math.round behavior, away from zero)", () => {
      expect(roundTo(0.5, 0)).toBe(1);
    });

    test("rounds very small numbers below precision threshold to 0", () => {
      expect(roundTo(0.00001, 4)).toBe(0);
    });

    test("passes through NaN unchanged", () => {
      expect(roundTo(NaN, 4)).toBeNaN();
    });

    test("passes through Infinity unchanged", () => {
      expect(roundTo(Infinity, 4)).toBe(Infinity);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// roundMlPrecise (4 decimal places, internal mL storage)
// ─────────────────────────────────────────────────────────────────────────────

describe("roundMlPrecise", () => {
  test("Retatrutide: 1mg ÷ 6 mg/mL = 0.1667 mL", () => {
    expect(roundMlPrecise(1 / 6)).toBe(0.1667);
  });

  test("0.1 mL passes through unchanged", () => {
    expect(roundMlPrecise(0.1)).toBe(0.1);
  });

  test("Retatrutide: 1mg ÷ 10 mg/mL = 0.1 mL exactly", () => {
    expect(roundMlPrecise(1 / 10)).toBe(0.1);
  });

  test("does not introduce floating-point cruft on simple ratios", () => {
    expect(roundMlPrecise(0.1 + 0.2)).toBe(0.3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// roundMlDisplay (1 decimal place, reverse-calc water output)
// ─────────────────────────────────────────────────────────────────────────────

describe("roundMlDisplay", () => {
  test("rounds 3.0 mL to 3", () => {
    expect(roundMlDisplay(3.0)).toBe(3);
  });

  test("rounds 1.5 mL to 1.5", () => {
    expect(roundMlDisplay(1.5)).toBe(1.5);
  });

  test("rounds 1.55 mL to 1.6 (boundary, away from zero)", () => {
    expect(roundMlDisplay(1.55)).toBe(1.6);
  });

  test("rounds 2.04 mL to 2", () => {
    expect(roundMlDisplay(2.04)).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// roundUnits (whole integer, syringe display)
// ─────────────────────────────────────────────────────────────────────────────

describe("roundUnits", () => {
  test("rounds 16.67 to 17", () => {
    expect(roundUnits(16.67)).toBe(17);
  });

  test("rounds 16.49 to 16", () => {
    expect(roundUnits(16.49)).toBe(16);
  });

  test("rounds 16.50 to 17 (Math.round: away from zero at .5)", () => {
    expect(roundUnits(16.5)).toBe(17);
  });

  test("preserves whole-integer values", () => {
    expect(roundUnits(10)).toBe(10);
    expect(roundUnits(40)).toBe(40);
    expect(roundUnits(100)).toBe(100);
  });

  test("zero stays zero", () => {
    expect(roundUnits(0)).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// roundConcentrationDisplay (2 decimal places)
// ─────────────────────────────────────────────────────────────────────────────

describe("roundConcentrationDisplay", () => {
  test("rounds 10.0 mg/mL to 10", () => {
    expect(roundConcentrationDisplay(10.0)).toBe(10);
  });

  test("rounds 6.6666 mg/mL to 6.67", () => {
    expect(roundConcentrationDisplay(6.6666)).toBe(6.67);
  });

  test("rounds 2.5 mg/mL to 2.5 (no spurious decimals)", () => {
    expect(roundConcentrationDisplay(2.5)).toBe(2.5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Retatrutide protocol cross-checks
//
// These exercise the helpers against the canonical numbers from Andrew's own
// reconstitution table. If these pass, the rounding stack handles his
// real-world protocol correctly.
// ─────────────────────────────────────────────────────────────────────────────

describe("Retatrutide protocol cross-checks", () => {
  test("30mg / 3mL = 10 mg/mL exactly (no FP drift)", () => {
    expect(roundConcentrationDisplay(30 / 3)).toBe(10);
  });

  test("12mg / 2mL = 6 mg/mL exactly", () => {
    expect(roundConcentrationDisplay(12 / 2)).toBe(6);
  });

  test("8mg / 2mL = 4 mg/mL exactly", () => {
    expect(roundConcentrationDisplay(8 / 2)).toBe(4);
  });

  test("5mg / 2mL = 2.5 mg/mL", () => {
    expect(roundConcentrationDisplay(5 / 2)).toBe(2.5);
  });

  test("1mg ÷ 6 mg/mL = 0.1667 mL precise = 16.67 units → rounds to 17", () => {
    const drawMl = roundMlPrecise(1 / 6);
    const units = roundUnits(drawMl * 100);
    expect(drawMl).toBe(0.1667);
    expect(units).toBe(17);
  });

  test("1mg ÷ 10 mg/mL = 0.1 mL = 10 units", () => {
    const drawMl = roundMlPrecise(1 / 10);
    const units = roundUnits(drawMl * 100);
    expect(drawMl).toBe(0.1);
    expect(units).toBe(10);
  });

  test("1mg ÷ 4 mg/mL = 0.25 mL = 25 units", () => {
    const drawMl = roundMlPrecise(1 / 4);
    const units = roundUnits(drawMl * 100);
    expect(drawMl).toBe(0.25);
    expect(units).toBe(25);
  });
});
