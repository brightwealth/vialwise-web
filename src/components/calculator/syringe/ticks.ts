/**
 * Pure layout math for the VisualSyringe component.
 *
 * PORTED VERBATIM from the Vialwise app
 * (`src/ui/components/VisualSyringe/ticks.ts`), so the web syringe draws the
 * same tick marks and fill as the app. The app's own tests for this file run
 * here too (`__tests__/ticks.test.ts`, synced by `npm run parity:sync`).
 *
 * Split out from VisualSyringe.tsx so the geometry can be unit-tested without
 * mounting React. Every function here is pure: same inputs always
 * produce the same outputs, no side effects.
 */

export type TickSize = "minor" | "medium" | "major";

export type Tick = {
  /** The unit number this tick represents (0, 1, 2, …, maxUnits). */
  unit: number;
  /** X coordinate in the SVG viewBox. */
  x: number;
  /** Visual emphasis: minor (every 1u), medium (every 5u), major (every 10u). */
  size: TickSize;
  /** Numeric label, present only on major ticks (every 10u). */
  label?: string;
};

type ComputeTicksInput = {
  /** Left edge of the barrel in the SVG viewBox. */
  barrelX: number;
  /** Width of the barrel in the SVG viewBox. */
  barrelW: number;
  /** Maximum unit count on the syringe scale (100 for U-100, 40 for U-40). */
  maxUnits: number;
};

/**
 * Compute one tick per integer unit between 0 and maxUnits inclusive.
 * The component renders these into <Line> elements above the barrel.
 */
export function computeTicks(input: ComputeTicksInput): Tick[] {
  const { barrelX, barrelW, maxUnits } = input;
  const ticks: Tick[] = [];

  for (let unit = 0; unit <= maxUnits; unit++) {
    const x = barrelX + (unit / maxUnits) * barrelW;
    const size: TickSize =
      unit % 10 === 0 ? "major" : unit % 5 === 0 ? "medium" : "minor";
    const label = unit % 10 === 0 ? String(unit) : undefined;
    ticks.push({ unit, x, size, label });
  }

  return ticks;
}

type FillInput = {
  drawUnits: number;
  barrelW: number;
  maxUnits: number;
};

/**
 * Width of the liquid-fill rectangle inside the barrel, given a draw size.
 * Clamps to [0, barrelW] so an over-syringe draw still renders cleanly.
 */
export function computeFillWidth(input: FillInput): number {
  const { drawUnits, barrelW, maxUnits } = input;
  if (drawUnits <= 0) return 0;
  if (drawUnits >= maxUnits) return barrelW;
  return (drawUnits / maxUnits) * barrelW;
}

type PlungerInput = {
  drawUnits: number;
  barrelX: number;
  barrelW: number;
  maxUnits: number;
};

/**
 * X coordinate of the plunger head — sits at the right edge of the fill.
 */
export function computePlungerX(input: PlungerInput): number {
  const { drawUnits, barrelX, barrelW, maxUnits } = input;
  return barrelX + computeFillWidth({ drawUnits, barrelW, maxUnits });
}
