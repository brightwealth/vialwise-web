// SYNCED from the VialWise app: src/calculator/__tests__/api.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Public API surface tests.
 *
 * Verifies that everything UI code needs is exported from src/calculator/
 * (the index.ts), with the right names and shapes. If any of these tests
 * fail, the API surface is incomplete and downstream UI work would break.
 */

import {
  forward,
  reverse,
  CalculatorValidationError,
  WARNING_THRESHOLDS,
} from "../../";
import type {
  ForwardInput,
  ForwardOutput,
  ReverseInput,
  ReverseOutput,
  CalculatorWarning,
  WarningLevel,
  WarningCode,
} from "../../";

describe("public API exports", () => {
  test("forward is exported as a function", () => {
    expect(typeof forward).toBe("function");
  });

  test("reverse is exported as a function", () => {
    expect(typeof reverse).toBe("function");
  });

  test("CalculatorValidationError is exported and usable for instanceof", () => {
    try {
      forward({ vialMg: -5, bacWaterMl: 3, targetDoseMg: 1 });
      throw new Error("expected forward() to throw");
    } catch (e) {
      expect(e).toBeInstanceOf(CalculatorValidationError);
    }
  });

  test("WARNING_THRESHOLDS is exported with expected values", () => {
    expect(WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100).toBe(100);
    expect(WARNING_THRESHOLDS.DRAW_LOWER_UNITS_U100).toBe(2);
    expect(WARNING_THRESHOLDS.CONCENTRATION_HIGH_MG_PER_ML).toBe(50);
  });
});

describe("public API end-to-end smoke", () => {
  test("forward via public API produces canonical Retatrutide result", () => {
    const input: ForwardInput = { vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 };
    const result: ForwardOutput = forward(input);
    expect(result.concentrationMgPerMl).toBe(10);
    expect(result.drawMl).toBe(0.1);
    expect(result.drawUnitsU100).toBe(10);
    expect(result.drawUnitsU40).toBe(4);
    expect(result.warnings).toEqual([]);
  });

  test("reverse via public API produces canonical Retatrutide result", () => {
    const input: ReverseInput = {
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    };
    const result: ReverseOutput = reverse(input);
    expect(result.bacWaterMlToAdd).toBe(3);
    expect(result.concentrationMgPerMl).toBe(10);
    expect(result.warnings).toEqual([]);
  });
});

describe("type exports are usable as type annotations", () => {
  // These tests don't have runtime assertions — they're TypeScript compile-time
  // proofs that the type names exist and can be used. If any of these
  // annotations fail to typecheck, the test file won't compile and Jest will
  // fail to run.

  test("ForwardInput type is usable", () => {
    const input: ForwardInput = {
      vialMg: 30,
      bacWaterMl: 3,
      targetDoseMg: 1,
    };
    expect(input.vialMg).toBe(30);
  });

  test("ForwardOutput type is usable", () => {
    const out: ForwardOutput = forward({
      vialMg: 30,
      bacWaterMl: 3,
      targetDoseMg: 1,
    });
    expect(out.concentrationMgPerMl).toBeGreaterThan(0);
  });

  test("ReverseInput type is usable", () => {
    const input: ReverseInput = {
      targetDoseMg: 1,
      vialMg: 30,
      desiredUnitsPerDrawU100: 10,
    };
    expect(input.desiredUnitsPerDrawU100).toBe(10);
  });

  test("CalculatorWarning, WarningLevel, WarningCode types are usable", () => {
    // Force a warning: tightly concentrated reconstitution (100 mg/mL > 50)
    const result = forward({ vialMg: 100, bacWaterMl: 1, targetDoseMg: 1 });
    if (result.warnings.length > 0) {
      const w: CalculatorWarning = result.warnings[0];
      const validLevels: WarningLevel[] = ["info", "warning", "danger"];
      const validCodes: WarningCode[] = [
        "DRAW_EXCEEDS_SYRINGE",
        "DRAW_BELOW_PRECISION",
        "DRAW_ROUNDS_TO_ZERO",
        "CONCENTRATION_VERY_HIGH",
        "CONCENTRATION_VERY_LOW",
        "VOLUME_VERY_LARGE",
        "DOSE_NEAR_VIAL_CAPACITY",
      ];
      expect(validLevels).toContain(w.level);
      expect(validCodes).toContain(w.code);
    } else {
      // High-concentration case should always emit at least one warning
      throw new Error(
        "expected at least one warning for 100 mg/mL concentration"
      );
    }
  });
});
