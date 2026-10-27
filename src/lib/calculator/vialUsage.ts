/**
 * Vial-usage planning math: given how many draws a vial yields (`totalDoses`,
 * from the calculator) and how often the researcher administers it, derive how
 * long a vial lasts and how many vials a month takes.
 *
 * PORTED from the Vialwise iOS app (`src/calculator/vialUsage.ts`). The only
 * change from the app version: the `Frequency` type is inlined here instead of
 * imported from the app's persistence layer (which the web build does not
 * carry). The arithmetic is identical.
 *
 * Pure functions — no side effects, no I/O. This is planning arithmetic
 * (division), NOT reconstitution math. Copy that renders these numbers stays
 * outcome-free: "draws per vial," "lasts about," never benefit language.
 */

/**
 * How often a protocol is administered. Inlined from the app's persistence
 * types so the calculator engine is self-contained on the web. The calculator
 * page only surfaces the four fixed frequencies; `custom` is kept for parity
 * with the app's `computeVialUsage` signature.
 */
export type Frequency =
  | "daily"
  | "every-other-day"
  | "weekly"
  | "twice-weekly"
  | "custom";

/**
 * Calendar constants. A month is not a clean number of days or weeks, so both
 * conversions use long-run averages:
 *   - 365.25 days / 12 months = 30.4375 ≈ 30.44 avg days per month
 *   - 30.4375 / 7              = 4.348   ≈ 4.35 avg weeks per month
 */
export const AVG_DAYS_PER_MONTH = 30.44;
export const AVG_WEEKS_PER_MONTH = 4.35;

/**
 * Average number of draws administered per month for a given frequency.
 *
 *   daily            → 30.44   (one per day)
 *   every-other-day  → 15.22   (30.44 / 2)
 *   weekly           → 4.35    (one per week)
 *   twice-weekly     → 8.70    (2 × 4.35)
 *   custom           → injectionDaysCount × 4.35   (N days/week × weeks/month)
 *
 * `injectionDaysCount` is only consulted for `custom`. Negative counts clamp to 0.
 */
export function dosesPerMonth(
  frequency: Frequency,
  injectionDaysCount = 0,
): number {
  switch (frequency) {
    case "daily":
      return AVG_DAYS_PER_MONTH;
    case "every-other-day":
      return AVG_DAYS_PER_MONTH / 2;
    case "weekly":
      return AVG_WEEKS_PER_MONTH;
    case "twice-weekly":
      return AVG_WEEKS_PER_MONTH * 2;
    case "custom":
      return Math.max(0, injectionDaysCount) * AVG_WEEKS_PER_MONTH;
  }
}

/**
 * Normalize a "people drawing from this vial" count (app Spec 10) to a whole
 * number ≥ 1. Absent / non-finite / < 1 ⇒ 1 (single-user). A fractional value
 * floors (2.5 people → 2). Pure; exported for tests + reuse.
 */
export function normalizeSharers(sharers: number | undefined): number {
  if (sharers === undefined || !Number.isFinite(sharers) || sharers < 1) {
    return 1;
  }
  return Math.floor(sharers);
}

export type VialUsage = {
  /**
   * Average draws ONE user administers per month at this frequency (per-user,
   * NOT scaled by `sharers`). Always ≥ 0. The `sharers` factor scales
   * consumption (`daysPerVial` / `vialsPerMonth`), not a single user's draws.
   */
  dosesPerMonth: number;
  /**
   * Vials consumed per month: `dosesPerMonth / totalDoses`. `null` when
   * `totalDoses` is not a positive finite number (divide-by-zero guard).
   */
  vialsPerMonth: number | null;
  /**
   * How long one vial lasts, in days: `totalDoses / (dosesPerMonth / 30.44)`.
   * `null` when `dosesPerMonth` is 0 (a vial never depletes → no finite answer)
   * or `totalDoses` is not a positive finite number.
   */
  daysPerVial: number | null;
};

export type VialUsageParams = {
  /** Draws per vial at the chosen amount (from ForwardOutput/ReverseOutput.totalDoses). */
  totalDoses: number;
  frequency: Frequency;
  /** Length of `injectionDays` — only used when `frequency === "custom"`. */
  injectionDaysCount?: number;
  /**
   * People drawing from this vial (app Spec 10). Default 1. Multiplies the
   * consumption rate so `daysPerVial` shortens and `vialsPerMonth` grows for a
   * shared vial. `dosesPerMonth` stays per-user. Absent / 1 ⇒ unchanged.
   */
  sharers?: number;
};

/**
 * Derive the full vial-usage picture from draws-per-vial + frequency.
 * Guards every division: returns `null` for any figure that would be
 * Infinity / NaN (zero or non-finite `totalDoses`, or zero `dosesPerMonth`).
 *
 * `sharers` scales the CONSUMPTION rate: with N people drawing, the vial
 * empties N× faster, so `daysPerVial` divides by N and `vialsPerMonth`
 * multiplies by N. `dosesPerMonth` is the per-user figure and is not scaled.
 */
export function computeVialUsage(params: VialUsageParams): VialUsage {
  const { totalDoses, frequency, injectionDaysCount = 0, sharers } = params;
  const perMonth = dosesPerMonth(frequency, injectionDaysCount);
  const effectivePerMonth = perMonth * normalizeSharers(sharers);
  const totalOk = Number.isFinite(totalDoses) && totalDoses > 0;

  return {
    dosesPerMonth: perMonth,
    vialsPerMonth: totalOk ? effectivePerMonth / totalDoses : null,
    daysPerVial:
      totalOk && effectivePerMonth > 0
        ? totalDoses / (effectivePerMonth / AVG_DAYS_PER_MONTH)
        : null,
  };
}
