// SYNCED from the VialWise app: src/calculator/__tests__/warnings.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Warning generator tests.
 *
 * Each individual check is tested at three points: clearly inside the
 * trigger zone, clearly outside, and at the exact boundary. The composite
 * generators are tested for stable ordering and for collecting multiple
 * warnings simultaneously.
 */

import {
  checkDrawExceedsSyringe,
  checkDrawBelowPrecision,
  checkDrawRoundsToZero,
  checkConcentrationHigh,
  checkConcentrationLow,
  checkVolumeLarge,
  checkDoseNearVialCapacity,
  generateForwardWarnings,
  generateReverseWarnings,
  WARNING_THRESHOLDS,
} from "../../warnings";

// ─────────────────────────────────────────────────────────────────────────────
// checkDrawExceedsSyringe (> 100 units)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkDrawExceedsSyringe", () => {
  test("triggers above 100 units (101)", () => {
    const w = checkDrawExceedsSyringe(101);
    expect(w).not.toBeNull();
    expect(w?.code).toBe("DRAW_EXCEEDS_SYRINGE");
    expect(w?.level).toBe("danger");
  });

  test("triggers strongly above (250)", () => {
    expect(checkDrawExceedsSyringe(250)).not.toBeNull();
  });

  test("does NOT trigger at exactly 100 (boundary)", () => {
    expect(checkDrawExceedsSyringe(100)).toBeNull();
  });

  test("does NOT trigger below 100", () => {
    expect(checkDrawExceedsSyringe(50)).toBeNull();
    expect(checkDrawExceedsSyringe(10)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkDrawRoundsToZero (the draw rounds to 0 units) — added 2026-10-02.
// checkDrawBelowPrecision requires > 0, so a draw under half a unit used to
// show "0 units" with no warning at all.
// ─────────────────────────────────────────────────────────────────────────────

describe("checkDrawRoundsToZero", () => {
  test("triggers when the draw rounds to 0 units", () => {
    expect(checkDrawRoundsToZero(0)).toEqual({
      level: "warning",
      code: "DRAW_ROUNDS_TO_ZERO",
      message: "This amount is too small to measure on this syringe at this concentration.",
    });
  });

  test.each([1, 2, 50])("does NOT trigger at %s units", (units) => {
    expect(checkDrawRoundsToZero(units)).toBeNull();
  });

  test("forward warnings include it for a 0-unit draw", () => {
    const warnings = generateForwardWarnings({
      vialMg: 10,
      bacWaterMl: 2,
      targetDoseMg: 0.01,
      concentrationMgPerMl: 5,
      drawUnitsU100: 0,
    });
    expect(warnings.map((w) => w.code)).toContain("DRAW_ROUNDS_TO_ZERO");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkDrawBelowPrecision (< 2 units, but > 0)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkDrawBelowPrecision", () => {
  test("triggers at 1 unit", () => {
    const w = checkDrawBelowPrecision(1);
    expect(w).not.toBeNull();
    expect(w?.code).toBe("DRAW_BELOW_PRECISION");
    expect(w?.level).toBe("warning");
  });

  test("does NOT trigger at exactly 2 (boundary)", () => {
    expect(checkDrawBelowPrecision(2)).toBeNull();
  });

  test("does NOT trigger above 2", () => {
    expect(checkDrawBelowPrecision(10)).toBeNull();
  });

  test("does NOT trigger at zero (handled elsewhere)", () => {
    expect(checkDrawBelowPrecision(0)).toBeNull();
  });

  test("uses singular 'unit' for value of 1", () => {
    const w = checkDrawBelowPrecision(1);
    expect(w?.message).toMatch(/1 unit /);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkConcentrationHigh (> 50 mg/mL)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkConcentrationHigh", () => {
  test("triggers at 51 mg/mL", () => {
    const w = checkConcentrationHigh(51);
    expect(w).not.toBeNull();
    expect(w?.code).toBe("CONCENTRATION_VERY_HIGH");
    expect(w?.level).toBe("warning");
  });

  test("does NOT trigger at exactly 50 mg/mL (boundary)", () => {
    expect(checkConcentrationHigh(50)).toBeNull();
  });

  test("does NOT trigger at common Retatrutide values (10 mg/mL, 20 mg/mL)", () => {
    expect(checkConcentrationHigh(10)).toBeNull();
    expect(checkConcentrationHigh(20)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkConcentrationLow (< 0.1 mg/mL)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkConcentrationLow", () => {
  test("triggers at 0.05 mg/mL", () => {
    const w = checkConcentrationLow(0.05);
    expect(w).not.toBeNull();
    expect(w?.code).toBe("CONCENTRATION_VERY_LOW");
    expect(w?.level).toBe("info");
  });

  test("does NOT trigger at exactly 0.1 mg/mL (boundary)", () => {
    expect(checkConcentrationLow(0.1)).toBeNull();
  });

  test("does NOT trigger at common Retatrutide values (2.5+ mg/mL)", () => {
    expect(checkConcentrationLow(2.5)).toBeNull();
    expect(checkConcentrationLow(10)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkVolumeLarge (> 10 mL)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkVolumeLarge", () => {
  test("triggers at 11 mL", () => {
    const w = checkVolumeLarge(11);
    expect(w).not.toBeNull();
    expect(w?.code).toBe("VOLUME_VERY_LARGE");
    expect(w?.level).toBe("warning");
  });

  test("does NOT trigger at exactly 10 mL (boundary)", () => {
    expect(checkVolumeLarge(10)).toBeNull();
  });

  test("does NOT trigger at common values (1.5, 2, 3 mL)", () => {
    expect(checkVolumeLarge(1.5)).toBeNull();
    expect(checkVolumeLarge(2)).toBeNull();
    expect(checkVolumeLarge(3)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkDoseNearVialCapacity (dose/vial >= 0.5)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkDoseNearVialCapacity", () => {
  test("triggers when dose is exactly half of vial (5mg dose / 10mg vial)", () => {
    const w = checkDoseNearVialCapacity(5, 10);
    expect(w).not.toBeNull();
    expect(w?.code).toBe("DOSE_NEAR_VIAL_CAPACITY");
    expect(w?.level).toBe("info");
  });

  test("triggers when dose is the whole vial (one-dose vial)", () => {
    const w = checkDoseNearVialCapacity(5, 5);
    expect(w).not.toBeNull();
    expect(w?.message).toMatch(/1 draw per vial/);
  });

  test("does NOT trigger at common Retatrutide ratios (1mg / 30mg = 0.033)", () => {
    expect(checkDoseNearVialCapacity(1, 30)).toBeNull();
  });

  test("does NOT trigger for 4mg / 12mg = 0.333", () => {
    expect(checkDoseNearVialCapacity(4, 12)).toBeNull();
  });

  test("returns null for invalid vialMg=0 (defensive)", () => {
    expect(checkDoseNearVialCapacity(1, 0)).toBeNull();
  });

  test("uses singular 'dose' for one-dose vials, plural otherwise", () => {
    expect(checkDoseNearVialCapacity(5, 5)?.message).toMatch(/1 draw per vial/);
    expect(checkDoseNearVialCapacity(5, 10)?.message).toMatch(/2 draws per vial/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateForwardWarnings (composite)
// ─────────────────────────────────────────────────────────────────────────────

describe("generateForwardWarnings", () => {
  test("returns empty array for clean Retatrutide protocol input", () => {
    const warnings = generateForwardWarnings({
      vialMg: 30,
      bacWaterMl: 3,
      targetDoseMg: 1,
      concentrationMgPerMl: 10,
      drawUnitsU100: 10,
    });
    expect(warnings).toEqual([]);
  });

  test("returns DRAW_EXCEEDS_SYRINGE when drawUnits > 100", () => {
    const warnings = generateForwardWarnings({
      vialMg: 100,
      bacWaterMl: 1,
      targetDoseMg: 50,
      concentrationMgPerMl: 100,
      drawUnitsU100: 150,
    });
    const codes = warnings.map((w) => w.code);
    expect(codes).toContain("DRAW_EXCEEDS_SYRINGE");
  });

  test("can stack multiple warnings (high concentration + dose-near-capacity)", () => {
    const warnings = generateForwardWarnings({
      vialMg: 10,
      bacWaterMl: 0.1,
      targetDoseMg: 5,
      concentrationMgPerMl: 100, // > 50 → CONCENTRATION_VERY_HIGH
      drawUnitsU100: 5,
    });
    const codes = warnings.map((w) => w.code);
    expect(codes).toContain("CONCENTRATION_VERY_HIGH");
    expect(codes).toContain("DOSE_NEAR_VIAL_CAPACITY"); // 5/10 = 0.5
  });

  test("preserves stable warning order (DRAW_EXCEEDS first, then precision, etc.)", () => {
    const warnings = generateForwardWarnings({
      vialMg: 100,
      bacWaterMl: 15,           // > 10 → VOLUME_VERY_LARGE
      targetDoseMg: 60,         // 60/100 = 0.6 → DOSE_NEAR_VIAL_CAPACITY
      concentrationMgPerMl: 60, // > 50 → CONCENTRATION_VERY_HIGH
      drawUnitsU100: 110,       // > 100 → DRAW_EXCEEDS_SYRINGE
    });
    const codes = warnings.map((w) => w.code);
    expect(codes[0]).toBe("DRAW_EXCEEDS_SYRINGE");
    expect(codes).toContain("CONCENTRATION_VERY_HIGH");
    expect(codes).toContain("VOLUME_VERY_LARGE");
    expect(codes).toContain("DOSE_NEAR_VIAL_CAPACITY");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateReverseWarnings (composite)
// ─────────────────────────────────────────────────────────────────────────────

describe("generateReverseWarnings", () => {
  test("returns empty array for clean Retatrutide reverse-calc input", () => {
    const warnings = generateReverseWarnings({
      vialMg: 30,
      bacWaterMlToAdd: 3,
      targetDoseMg: 1,
      concentrationMgPerMl: 10,
      desiredUnitsPerDrawU100: 10,
    });
    expect(warnings).toEqual([]);
  });

  test("triggers DRAW_BELOW_PRECISION at 1 desired unit", () => {
    const warnings = generateReverseWarnings({
      vialMg: 30,
      bacWaterMlToAdd: 0.5,
      targetDoseMg: 0.1,
      concentrationMgPerMl: 60,
      desiredUnitsPerDrawU100: 1,
    });
    const codes = warnings.map((w) => w.code);
    expect(codes).toContain("DRAW_BELOW_PRECISION");
    expect(codes).toContain("CONCENTRATION_VERY_HIGH"); // 60 > 50
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Threshold sanity (values match the architecture document)
// ─────────────────────────────────────────────────────────────────────────────

describe("WARNING_THRESHOLDS", () => {
  test("matches the architecture document", () => {
    expect(WARNING_THRESHOLDS.DRAW_UPPER_UNITS_U100).toBe(100);
    expect(WARNING_THRESHOLDS.DRAW_LOWER_UNITS_U100).toBe(2);
    expect(WARNING_THRESHOLDS.CONCENTRATION_HIGH_MG_PER_ML).toBe(50);
    expect(WARNING_THRESHOLDS.CONCENTRATION_LOW_MG_PER_ML).toBe(0.1);
    expect(WARNING_THRESHOLDS.VOLUME_LARGE_ML).toBe(10);
    expect(WARNING_THRESHOLDS.DOSE_TO_VIAL_RATIO).toBe(0.5);
  });
});
