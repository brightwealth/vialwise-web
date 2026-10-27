// SYNCED from the VialWise app: src/calculator/__tests__/blend.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

import { computeBlend } from "../../blend";
import { forward } from "../../forward";
import { CalculatorValidationError } from "../../types";

/**
 * Unit tests for the blend calculator. Pure arithmetic — the existing engine
 * applied per component over a shared water volume and shared draw.
 */

describe("computeBlend", () => {
  it("solves the canonical CJC/Ipamorelin case (5/5 mg, 2 mL, 200 mcg anchor)", () => {
    // conc = 5/2 = 2.5 mg/mL; 0.2 mg dose → 0.08 mL → 8 units; each component
    // delivers 0.2 mg (200 mcg); 25 doses per vial.
    const out = computeBlend({
      components: [
        { peptide: "cjc-1295", mg: 5 },
        { peptide: "ipamorelin", mg: 5 },
      ],
      bacWaterMl: 2,
      anchorIndex: 0,
      anchor: { targetDoseMg: 0.2 },
    });
    expect(out.drawUnitsU100).toBe(8);
    expect(out.components[0].concentrationMgPerMl).toBe(2.5);
    expect(out.components[0].perDoseMg).toBeCloseTo(0.2, 6);
    expect(out.components[1].perDoseMg).toBeCloseTo(0.2, 6);
    expect(out.totalDoses).toBe(25);
  });

  it("keeps doses-per-vial IDENTICAL across components (shared volume invariant)", () => {
    const out = computeBlend({
      components: [
        { mg: 10 },
        { mg: 5 },
        { mg: 2 },
      ],
      bacWaterMl: 3,
      anchorIndex: 0,
      anchor: { targetDoseMg: 1 },
    });
    const dosesSet = new Set(out.components.map((c) => c.totalDoses));
    expect(dosesSet.size).toBe(1); // all equal
    expect(out.components.every((c) => c.totalDoses === out.totalDoses)).toBe(
      true,
    );
  });

  it("scales unequal components by ratio at the shared draw", () => {
    // 10 mg + 5 mg in 2 mL. Anchor comp 0 at 1 mg → conc 5 mg/mL → 0.2 mL →
    // 20 units. Comp 1 conc = 2.5 mg/mL → perDose = 2.5 * 0.2 = 0.5 mg.
    const out = computeBlend({
      components: [{ mg: 10 }, { mg: 5 }],
      bacWaterMl: 2,
      anchorIndex: 0,
      anchor: { targetDoseMg: 1 },
    });
    expect(out.drawUnitsU100).toBe(20);
    expect(out.components[0].perDoseMg).toBeCloseTo(1, 6);
    expect(out.components[1].perDoseMg).toBeCloseTo(0.5, 6);
  });

  it("supports anchoring by draw units directly", () => {
    // 5/5 mg, 2 mL, draw 8 units → each delivers 0.2 mg.
    const out = computeBlend({
      components: [{ mg: 5 }, { mg: 5 }],
      bacWaterMl: 2,
      anchorIndex: 0,
      anchor: { drawUnitsU100: 8 },
    });
    expect(out.drawUnitsU100).toBe(8);
    expect(out.components[0].perDoseMg).toBeCloseTo(0.2, 6);
    expect(out.components[1].perDoseMg).toBeCloseTo(0.2, 6);
    expect(out.totalDoses).toBe(25);
  });

  it("handles a 3-component blend", () => {
    const out = computeBlend({
      components: [{ mg: 5 }, { mg: 5 }, { mg: 5 }],
      bacWaterMl: 2,
      anchorIndex: 0,
      anchor: { drawUnitsU100: 8 },
    });
    expect(out.components).toHaveLength(3);
    expect(out.components.map((c) => c.perDoseMg)).toEqual([
      out.components[0].perDoseMg,
      out.components[0].perDoseMg,
      out.components[0].perDoseMg,
    ]);
  });

  it("handles a 4-component blend", () => {
    const out = computeBlend({
      components: [{ mg: 5 }, { mg: 5 }, { mg: 5 }, { mg: 5 }],
      bacWaterMl: 2,
      anchorIndex: 0,
      anchor: { drawUnitsU100: 8 },
    });
    expect(out.components).toHaveLength(4);
    // Shared volume ⇒ identical doses-per-vial across all four components.
    expect(new Set(out.components.map((c) => c.totalDoses)).size).toBe(1);
    expect(
      out.components.every((c) => c.perDoseMg === out.components[0].perDoseMg),
    ).toBe(true);
  });

  it("matches forward() rounding for the anchor component (draw + concentration)", () => {
    const fwd = forward({ vialMg: 10, bacWaterMl: 3, targetDoseMg: 1 });
    const out = computeBlend({
      components: [{ mg: 10 }, { mg: 6 }],
      bacWaterMl: 3,
      anchorIndex: 0,
      anchor: { targetDoseMg: 1 },
    });
    expect(out.drawUnitsU100).toBe(fwd.drawUnitsU100);
    expect(out.components[0].concentrationMgPerMl).toBe(
      fwd.concentrationMgPerMl,
    );
  });

  it("surfaces the tiny-draw precision warning for a very small anchor draw", () => {
    // 1 mg in 5 mL → conc 0.2 mg/mL; 0.002 mg dose → 0.01 mL → 1 unit (< 2).
    const out = computeBlend({
      components: [{ mg: 1 }, { mg: 1 }],
      bacWaterMl: 5,
      anchorIndex: 0,
      anchor: { drawUnitsU100: 1 },
    });
    expect(out.warnings.join(" ")).toMatch(/very small|hard to measure/i);
  });

  it("surfaces the exceeds-syringe warning for a > 100-unit draw", () => {
    const out = computeBlend({
      components: [{ mg: 5 }, { mg: 5 }],
      bacWaterMl: 2,
      anchorIndex: 0,
      anchor: { drawUnitsU100: 120 },
    });
    expect(out.warnings.join(" ")).toMatch(/exceeds a single U-100/i);
  });

  it("throws on zero / negative water (divide-by-zero guard)", () => {
    expect(() =>
      computeBlend({
        components: [{ mg: 5 }, { mg: 5 }],
        bacWaterMl: 0,
        anchorIndex: 0,
        anchor: { drawUnitsU100: 8 },
      }),
    ).toThrow(CalculatorValidationError);
  });

  it("throws on a zero-mg component", () => {
    expect(() =>
      computeBlend({
        components: [{ mg: 0 }, { mg: 5 }],
        bacWaterMl: 2,
        anchorIndex: 1,
        anchor: { drawUnitsU100: 8 },
      }),
    ).toThrow(CalculatorValidationError);
  });

  it("throws when there are fewer than 2 or more than 4 components", () => {
    expect(() =>
      computeBlend({
        components: [{ mg: 5 }],
        bacWaterMl: 2,
        anchorIndex: 0,
        anchor: { drawUnitsU100: 8 },
      }),
    ).toThrow(CalculatorValidationError);
    expect(() =>
      computeBlend({
        components: [{ mg: 1 }, { mg: 1 }, { mg: 1 }, { mg: 1 }, { mg: 1 }],
        bacWaterMl: 2,
        anchorIndex: 0,
        anchor: { drawUnitsU100: 8 },
      }),
    ).toThrow(CalculatorValidationError);
  });

  it("throws when the anchor index is out of range", () => {
    expect(() =>
      computeBlend({
        components: [{ mg: 5 }, { mg: 5 }],
        bacWaterMl: 2,
        anchorIndex: 5,
        anchor: { drawUnitsU100: 8 },
      }),
    ).toThrow(CalculatorValidationError);
  });

  it("throws when the anchor dose exceeds the anchor component's mass", () => {
    expect(() =>
      computeBlend({
        components: [{ mg: 5 }, { mg: 5 }],
        bacWaterMl: 2,
        anchorIndex: 0,
        anchor: { targetDoseMg: 10 }, // > 5 mg
      }),
    ).toThrow(CalculatorValidationError);
  });
});
