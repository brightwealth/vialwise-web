// SYNCED from the VialWise app: src/calculator/__tests__/validate.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Validation tests — every rejection path covered, plus happy paths.
 *
 * If a test here fails, the engine is at risk of accepting invalid input
 * and producing a meaningless number. These tests are deliberately
 * paranoid because the calculator is the highest-stakes code in the app.
 */

import {
  validateForwardInput,
  validateReverseInput,
} from "../../validate";
import { CalculatorValidationError } from "../../types";

// ─────────────────────────────────────────────────────────────────────────────
// validateForwardInput
// ─────────────────────────────────────────────────────────────────────────────

describe("validateForwardInput", () => {
  describe("happy paths (must NOT throw)", () => {
    test("accepts canonical Retatrutide reconstitution (30mg, 3mL, 1mg dose)", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 })
      ).not.toThrow();
    });

    test("accepts dose equal to vial total (one-dose vial)", () => {
      expect(() =>
        validateForwardInput({ vialMg: 5, bacWaterMl: 2, targetDoseMg: 5 })
      ).not.toThrow();
    });

    test("accepts decimal doses below 1mg", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 0.5 })
      ).not.toThrow();
    });

    test("accepts very small vials and very small doses", () => {
      expect(() =>
        validateForwardInput({
          vialMg: 0.001,
          bacWaterMl: 0.001,
          targetDoseMg: 0.001,
        })
      ).not.toThrow();
    });
  });

  describe("vialMg rejection paths", () => {
    test("rejects zero", () => {
      expect(() =>
        validateForwardInput({ vialMg: 0, bacWaterMl: 3, targetDoseMg: 1 })
      ).toThrow(CalculatorValidationError);
    });

    test("rejects negative", () => {
      expect(() =>
        validateForwardInput({ vialMg: -5, bacWaterMl: 3, targetDoseMg: 1 })
      ).toThrow(/positive/);
    });

    test("rejects NaN", () => {
      expect(() =>
        validateForwardInput({ vialMg: NaN, bacWaterMl: 3, targetDoseMg: 1 })
      ).toThrow(/finite/);
    });

    test("rejects Infinity", () => {
      expect(() =>
        validateForwardInput({
          vialMg: Infinity,
          bacWaterMl: 3,
          targetDoseMg: 1,
        })
      ).toThrow(/finite/);
    });

    test("rejects -Infinity", () => {
      expect(() =>
        validateForwardInput({
          vialMg: -Infinity,
          bacWaterMl: 3,
          targetDoseMg: 1,
        })
      ).toThrow(/finite/);
    });

    test("error captures field name and received value", () => {
      try {
        validateForwardInput({ vialMg: -5, bacWaterMl: 3, targetDoseMg: 1 });
        throw new Error("expected validateForwardInput to throw");
      } catch (e) {
        expect(e).toBeInstanceOf(CalculatorValidationError);
        const err = e as CalculatorValidationError;
        expect(err.field).toBe("vialMg");
        expect(err.received).toBe(-5);
        expect(err.name).toBe("CalculatorValidationError");
      }
    });
  });

  describe("bacWaterMl rejection paths", () => {
    test("rejects zero", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: 0, targetDoseMg: 1 })
      ).toThrow(/positive/);
    });

    test("rejects negative", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: -1, targetDoseMg: 1 })
      ).toThrow(/positive/);
    });

    test("rejects NaN", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: NaN, targetDoseMg: 1 })
      ).toThrow(/finite/);
    });
  });

  describe("targetDoseMg rejection paths", () => {
    test("rejects zero", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 0 })
      ).toThrow(/positive/);
    });

    test("rejects dose exceeding vial total", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 50 })
      ).toThrow(/cannot exceed vial total/);
    });

    test("rejects NaN", () => {
      expect(() =>
        validateForwardInput({ vialMg: 30, bacWaterMl: 3, targetDoseMg: NaN })
      ).toThrow(/finite/);
    });

    test("dose-exceeds-vial error names the targetDoseMg field", () => {
      try {
        validateForwardInput({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 50 });
        throw new Error("expected throw");
      } catch (e) {
        const err = e as CalculatorValidationError;
        expect(err.field).toBe("targetDoseMg");
        expect(err.received).toBe(50);
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateReverseInput
// ─────────────────────────────────────────────────────────────────────────────

describe("validateReverseInput", () => {
  describe("happy paths (must NOT throw)", () => {
    test("accepts canonical Retatrutide reverse-calc input (1mg dose, 30mg vial, 10 units)", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 1,
          vialMg: 30,
          desiredUnitsPerDrawU100: 10,
        })
      ).not.toThrow();
    });

    test("accepts 1-unit minimum draw", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 0.1,
          vialMg: 30,
          desiredUnitsPerDrawU100: 1,
        })
      ).not.toThrow();
    });
  });

  describe("desiredUnitsPerDrawU100 rejection paths", () => {
    test("rejects zero", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 1,
          vialMg: 30,
          desiredUnitsPerDrawU100: 0,
        })
      ).toThrow(/positive/);
    });

    test("rejects negative", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 1,
          vialMg: 30,
          desiredUnitsPerDrawU100: -10,
        })
      ).toThrow(/positive/);
    });

    test("rejects fractional units (must be whole integer, no silent rounding)", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 1,
          vialMg: 30,
          desiredUnitsPerDrawU100: 10.5,
        })
      ).toThrow(/whole integer/);
    });

    test("rejects NaN", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 1,
          vialMg: 30,
          desiredUnitsPerDrawU100: NaN,
        })
      ).toThrow(/finite/);
    });
  });

  describe("cross-field validation", () => {
    test("rejects dose exceeding vial total", () => {
      expect(() =>
        validateReverseInput({
          targetDoseMg: 50,
          vialMg: 30,
          desiredUnitsPerDrawU100: 10,
        })
      ).toThrow(/cannot exceed vial total/);
    });
  });
});
