// SYNCED from the VialWise app: src/calculator/__tests__/vialUsage.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

import {
  AVG_DAYS_PER_MONTH,
  AVG_WEEKS_PER_MONTH,
  computeVialUsage,
  dosesPerMonth,
  forward,
  normalizeSharers,
  reverse,
} from "../../index";

describe("dosesPerMonth", () => {
  it("daily → average days per month", () => {
    expect(dosesPerMonth("daily")).toBe(AVG_DAYS_PER_MONTH); // 30.44
  });

  it("every-other-day → half of average days per month", () => {
    expect(dosesPerMonth("every-other-day")).toBeCloseTo(15.22, 5); // 30.44 / 2
  });

  it("weekly → average weeks per month", () => {
    expect(dosesPerMonth("weekly")).toBe(AVG_WEEKS_PER_MONTH); // 4.35
  });

  it("twice-weekly → 2× average weeks per month", () => {
    expect(dosesPerMonth("twice-weekly")).toBeCloseTo(8.7, 5); // 4.35 × 2
  });

  it("custom → injection-days count × weeks per month", () => {
    expect(dosesPerMonth("custom", 3)).toBeCloseTo(13.05, 5); // 3 × 4.35
    expect(dosesPerMonth("custom", 1)).toBeCloseTo(4.35, 5);
  });

  it("custom with 0 days → 0 doses per month", () => {
    expect(dosesPerMonth("custom", 0)).toBe(0);
  });

  it("custom clamps a negative day count to 0", () => {
    expect(dosesPerMonth("custom", -2)).toBe(0);
  });

  it("custom defaults the day count to 0 when omitted", () => {
    expect(dosesPerMonth("custom")).toBe(0);
  });
});

describe("computeVialUsage", () => {
  it("daily: a 30-dose vial lasts ~30 days and ~1 vial/month", () => {
    const u = computeVialUsage({ totalDoses: 30, frequency: "daily" });
    expect(u.dosesPerMonth).toBe(AVG_DAYS_PER_MONTH);
    expect(u.daysPerVial).toBeCloseTo(30, 5); // 30 / (30.44/30.44)
    expect(u.vialsPerMonth).toBeCloseTo(30.44 / 30, 5);
  });

  it("weekly: a 30-dose vial lasts ~210 days (30 weeks)", () => {
    const u = computeVialUsage({ totalDoses: 30, frequency: "weekly" });
    expect(u.daysPerVial).toBeCloseTo(30 * 7.0, 0); // ~210 days
    expect(u.vialsPerMonth).toBeCloseTo(4.35 / 30, 5);
  });

  it("twice-weekly: an 8.7-dose vial lasts ~30 days", () => {
    const u = computeVialUsage({ totalDoses: 8.7, frequency: "twice-weekly" });
    expect(u.daysPerVial).toBeCloseTo(AVG_DAYS_PER_MONTH, 5);
  });

  it("custom with 2 injection days: a 20-dose vial lasts ~70 days", () => {
    const u = computeVialUsage({
      totalDoses: 20,
      frequency: "custom",
      injectionDaysCount: 2,
    });
    // 2/week → 8.7/month → 20 / (8.7/30.44) ≈ 70 days
    expect(u.daysPerVial).toBeCloseTo(20 / (8.7 / AVG_DAYS_PER_MONTH), 4);
    expect(u.vialsPerMonth).toBeCloseTo(8.7 / 20, 5);
  });

  // ── Divide-by-zero / non-finite guards ──────────────────────────────────

  it("guards totalDoses = 0 → vialsPerMonth and daysPerVial null", () => {
    const u = computeVialUsage({ totalDoses: 0, frequency: "daily" });
    expect(u.vialsPerMonth).toBeNull();
    expect(u.daysPerVial).toBeNull();
    expect(u.dosesPerMonth).toBe(AVG_DAYS_PER_MONTH); // still reported
  });

  it("guards negative totalDoses → null", () => {
    const u = computeVialUsage({ totalDoses: -5, frequency: "daily" });
    expect(u.vialsPerMonth).toBeNull();
    expect(u.daysPerVial).toBeNull();
  });

  it("guards Infinity totalDoses → null (no Infinity leaks out)", () => {
    const u = computeVialUsage({ totalDoses: Infinity, frequency: "daily" });
    expect(u.vialsPerMonth).toBeNull();
    expect(u.daysPerVial).toBeNull();
  });

  it("guards NaN totalDoses → null", () => {
    const u = computeVialUsage({ totalDoses: NaN, frequency: "daily" });
    expect(u.vialsPerMonth).toBeNull();
    expect(u.daysPerVial).toBeNull();
  });

  it("custom with 0 injection days: daysPerVial null (never depletes), vialsPerMonth 0", () => {
    const u = computeVialUsage({
      totalDoses: 30,
      frequency: "custom",
      injectionDaysCount: 0,
    });
    expect(u.dosesPerMonth).toBe(0);
    expect(u.daysPerVial).toBeNull(); // dividing by zero doses/day → guarded
    expect(u.vialsPerMonth).toBe(0); // 0 doses/month → 0 vials/month (finite, valid)
  });

  it("never returns a non-finite number for any computed field", () => {
    for (const totalDoses of [0, -1, Infinity, NaN, 0.001, 1e9]) {
      const u = computeVialUsage({ totalDoses, frequency: "daily" });
      for (const v of [u.dosesPerMonth, u.vialsPerMonth, u.daysPerVial]) {
        if (v !== null) expect(Number.isFinite(v)).toBe(true);
      }
    }
  });
});

describe("normalizeSharers (Spec 10)", () => {
  it("defaults to 1 for absent / invalid / < 1", () => {
    expect(normalizeSharers(undefined)).toBe(1);
    expect(normalizeSharers(0)).toBe(1);
    expect(normalizeSharers(-3)).toBe(1);
    expect(normalizeSharers(NaN)).toBe(1);
    expect(normalizeSharers(Infinity)).toBe(1);
  });

  it("passes a whole count ≥ 1 through and floors a fraction", () => {
    expect(normalizeSharers(1)).toBe(1);
    expect(normalizeSharers(2)).toBe(2);
    expect(normalizeSharers(2.9)).toBe(2);
  });
});

describe("computeVialUsage with sharers (Spec 10)", () => {
  it("is identical to today when sharers is absent or 1 (migration-safe)", () => {
    const base = computeVialUsage({ totalDoses: 30, frequency: "daily" });
    const one = computeVialUsage({ totalDoses: 30, frequency: "daily", sharers: 1 });
    expect(one).toEqual(base);
  });

  it("halves days-per-vial and doubles vials/month at 2 sharers", () => {
    const solo = computeVialUsage({ totalDoses: 30, frequency: "daily" });
    const duo = computeVialUsage({ totalDoses: 30, frequency: "daily", sharers: 2 });
    expect(duo.daysPerVial).toBeCloseTo((solo.daysPerVial as number) / 2, 6);
    expect(duo.vialsPerMonth).toBeCloseTo((solo.vialsPerMonth as number) * 2, 6);
    // Per-user dosesPerMonth is NOT scaled (cost math depends on it).
    expect(duo.dosesPerMonth).toBe(solo.dosesPerMonth);
  });

  it("thirds days-per-vial at 3 sharers", () => {
    const solo = computeVialUsage({ totalDoses: 30, frequency: "daily" });
    const trio = computeVialUsage({ totalDoses: 30, frequency: "daily", sharers: 3 });
    expect(trio.daysPerVial).toBeCloseTo((solo.daysPerVial as number) / 3, 6);
  });

  it("composes with a custom frequency's injection-days count", () => {
    const solo = computeVialUsage({
      totalDoses: 20,
      frequency: "custom",
      injectionDaysCount: 2,
    });
    const duo = computeVialUsage({
      totalDoses: 20,
      frequency: "custom",
      injectionDaysCount: 2,
      sharers: 2,
    });
    expect(duo.daysPerVial).toBeCloseTo((solo.daysPerVial as number) / 2, 6);
  });

  it("clamps an invalid sharers to 1 (no NaN / Infinity leaks)", () => {
    const bad = computeVialUsage({ totalDoses: 30, frequency: "daily", sharers: 0 });
    const solo = computeVialUsage({ totalDoses: 30, frequency: "daily" });
    expect(bad).toEqual(solo);
  });

  it("keeps the divide-by-zero guards under sharers", () => {
    const u = computeVialUsage({ totalDoses: 0, frequency: "daily", sharers: 3 });
    expect(u.daysPerVial).toBeNull();
    expect(u.vialsPerMonth).toBeNull();
  });
});

describe("totalDoses on the calculator output", () => {
  it("forward: 30 mg vial / 1 mg dose → 30 doses", () => {
    expect(forward({ vialMg: 30, bacWaterMl: 3, targetDoseMg: 1 }).totalDoses).toBe(30);
  });

  it("forward: 10 mg vial / 2.5 mg dose → 4 doses", () => {
    expect(forward({ vialMg: 10, bacWaterMl: 2, targetDoseMg: 2.5 }).totalDoses).toBe(4);
  });

  it("forward: rounds a fractional dose count to 2 decimals (10 / 3 → 3.33)", () => {
    expect(forward({ vialMg: 10, bacWaterMl: 1, targetDoseMg: 3 }).totalDoses).toBe(3.33);
  });

  it("reverse: 30 mg vial / 1 mg dose → 30 doses", () => {
    expect(
      reverse({ targetDoseMg: 1, vialMg: 30, desiredUnitsPerDrawU100: 10 }).totalDoses,
    ).toBe(30);
  });

  it("totalDoses is always finite for a valid calculation", () => {
    const r = forward({ vialMg: 5, bacWaterMl: 2, targetDoseMg: 0.25 });
    expect(Number.isFinite(r.totalDoses)).toBe(true);
    expect(r.totalDoses).toBe(20);
  });
});
