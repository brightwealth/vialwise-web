/**
 * Public API surface of the Vialwise calculator engine (web copy).
 *
 * Ported from the Vialwise iOS app's `src/calculator/index.ts` (the parts the
 * web uses: forward, reverse, vial usage, blend). UI code should
 * import from this index file — never reach into individual implementation
 * files — so internals (validation, rounding, warning checks) can be refactored
 * without breaking call sites.
 *
 * Usage:
 *
 *   import { forward, reverse, CalculatorValidationError } from "@/lib/calculator";
 *   import type { ForwardInput, ForwardOutput, CalculatorWarning } from "@/lib/calculator";
 */

// ── Calculators (the pure functions UI code calls) ──────────────────────────
export { forward } from "./forward";
export { reverse } from "./reverse";

// ── Types (input shapes, output shapes, warnings) ───────────────────────────
export type {
  ForwardInput,
  ForwardOutput,
  ReverseInput,
  ReverseOutput,
  CalculatorWarning,
  WarningLevel,
  WarningCode,
} from "./types";

// ── Validation error (UI uses for `instanceof` checks) ──────────────────────
export { CalculatorValidationError } from "./types";

// ── Warning thresholds (exposed so UI can render them in help text) ─────────
export { WARNING_THRESHOLDS } from "./warnings";

// ── Display rounding (so consumers render the SAME value the calculator does) ─
export { roundConcentrationDisplay } from "./round";

// ── Vial-usage planning (draws per vial → vials/month, days/vial) ───────────
export {
  computeVialUsage,
  dosesPerMonth,
  normalizeSharers,
  AVG_DAYS_PER_MONTH,
  AVG_WEEKS_PER_MONTH,
} from "./vialUsage";
export type { VialUsage, VialUsageParams, Frequency } from "./vialUsage";

// ── Blend / multi-peptide calculator (2–4 components, one shared draw) ───────
export { computeBlend } from "./blend";
export type {
  BlendComponent,
  BlendAnchor,
  BlendInput,
  BlendComponentResult,
  BlendOutput,
} from "./blend";
