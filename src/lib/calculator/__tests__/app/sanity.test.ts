// SYNCED from the VialWise app: src/calculator/__tests__/sanity.test.ts @ 938acad434bf (2026-10-27T17:56:34+00:00).
// Do not edit. Re-sync with `npm run parity:sync`; drift check: `npm run parity:check`.
// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).

/**
 * Sanity test — verifies the Jest test runner is wired up correctly.
 * If both tests pass, Phase 1.1 is complete and the test infrastructure
 * is ready for real calculator tests in Phase 1.2 onward.
 */

describe("test runner sanity", () => {
  test("Jest is running and basic math works", () => {
    expect(2 + 2).toBe(4);
  });

  test("TypeScript types are checked", () => {
    const vialMg: number = 30;
    const bacWaterMl: number = 3;
    const concentration = vialMg / bacWaterMl;

    // 30mg / 3mL = 10mg/mL — the canonical Retatrutide reconstitution
    expect(concentration).toBe(10);
  });
});
