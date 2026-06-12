/**
 * Public API surface of the Vialwise calculator engine (web copy).
 *
 * Ported from the Vialwise iOS app's `src/calculator/index.ts`. UI code should
 * import from this index file — never reach into individual implementation
 * files — so internals (validation, rounding, warning checks) can be refactored
 * without breaking call sites.
 *
 * Usage:
 *
 *   import { forward, reverse, CalculatorValidationError } from "@/lib/calculator";
 *   import type { ForwardInput, ForwardOutput, CalculatorWarning } from "@/lib/calculator";
 */

// ── Calculators (the two pure functions UI code calls) ──────────────────────
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

// ── Vial-usage planning (draws per vial → vials/month, days/vial) ───────────
export {
  computeVialUsage,
  dosesPerMonth,
  AVG_DAYS_PER_MONTH,
  AVG_WEEKS_PER_MONTH,
} from "./vialUsage";
export type { VialUsage, VialUsageParams, Frequency } from "./vialUsage";
