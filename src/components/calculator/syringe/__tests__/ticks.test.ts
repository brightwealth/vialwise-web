// SYNCED from the VialWise app: src/ui/components/VisualSyringe/__tests__/ticks.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

import { computeTicks, computeFillWidth, computePlungerX } from "../ticks";

describe("computeTicks", () => {
  const barrelX = 30;
  const barrelW = 240;
  const maxUnits = 100;

  it("returns 101 ticks for a 0–100 U-100 syringe (one per unit)", () => {
    const ticks = computeTicks({ barrelX, barrelW, maxUnits });
    expect(ticks).toHaveLength(101);
  });

  it("classifies tick sizes correctly", () => {
    const ticks = computeTicks({ barrelX, barrelW, maxUnits });
    expect(ticks[0].size).toBe("major");   // 0
    expect(ticks[1].size).toBe("minor");   // 1
    expect(ticks[5].size).toBe("medium");  // 5
    expect(ticks[10].size).toBe("major");  // 10
    expect(ticks[50].size).toBe("major");  // 50
    expect(ticks[100].size).toBe("major"); // 100
  });

  it("assigns labels to multiples of 10 only", () => {
    const ticks = computeTicks({ barrelX, barrelW, maxUnits });
    expect(ticks[0].label).toBe("0");
    expect(ticks[10].label).toBe("10");
    expect(ticks[50].label).toBe("50");
    expect(ticks[100].label).toBe("100");
    expect(ticks[1].label).toBeUndefined();
    expect(ticks[5].label).toBeUndefined();
    expect(ticks[7].label).toBeUndefined();
  });

  it("places ticks linearly across the barrel", () => {
    const ticks = computeTicks({ barrelX, barrelW, maxUnits });
    expect(ticks[0].x).toBe(barrelX);
    expect(ticks[100].x).toBe(barrelX + barrelW);
    expect(ticks[50].x).toBe(barrelX + barrelW / 2);
    expect(ticks[10].x).toBeCloseTo(barrelX + barrelW / 10, 6);
  });

  it("handles a U-40 syringe (41 ticks)", () => {
    const ticks = computeTicks({ barrelX, barrelW, maxUnits: 40 });
    expect(ticks).toHaveLength(41);
    expect(ticks[40].x).toBe(barrelX + barrelW);
    expect(ticks[40].label).toBe("40");
  });
});

describe("computeFillWidth", () => {
  const barrelW = 240;
  const maxUnits = 100;

  it("returns 0 for a draw of 0", () => {
    expect(computeFillWidth({ drawUnits: 0, barrelW, maxUnits })).toBe(0);
  });

  it("returns full barrel width for a draw of maxUnits", () => {
    expect(computeFillWidth({ drawUnits: 100, barrelW, maxUnits })).toBe(barrelW);
  });

  it("scales linearly between 0 and maxUnits", () => {
    expect(computeFillWidth({ drawUnits: 50, barrelW, maxUnits })).toBe(120);
    expect(computeFillWidth({ drawUnits: 25, barrelW, maxUnits })).toBe(60);
  });

  it("clamps to barrel width when draw exceeds maxUnits", () => {
    expect(computeFillWidth({ drawUnits: 150, barrelW, maxUnits })).toBe(barrelW);
    expect(computeFillWidth({ drawUnits: 1000, barrelW, maxUnits })).toBe(barrelW);
  });

  it("clamps to 0 when draw is negative", () => {
    expect(computeFillWidth({ drawUnits: -5, barrelW, maxUnits })).toBe(0);
  });

  it("handles fractional draw units", () => {
    expect(computeFillWidth({ drawUnits: 16.67, barrelW, maxUnits })).toBeCloseTo(40.008, 3);
  });
});

describe("computePlungerX", () => {
  it("places the plunger at barrelX when draw is 0", () => {
    expect(computePlungerX({ drawUnits: 0, barrelX: 30, barrelW: 240, maxUnits: 100 })).toBe(30);
  });

  it("places the plunger at the end of the fill", () => {
    expect(computePlungerX({ drawUnits: 50, barrelX: 30, barrelW: 240, maxUnits: 100 })).toBe(150);
  });

  it("clamps to the barrel end when draw exceeds maxUnits", () => {
    expect(computePlungerX({ drawUnits: 200, barrelX: 30, barrelW: 240, maxUnits: 100 })).toBe(270);
  });
});
