/**
 * Input validation for the Vialwise calculator engine.
 *
 * PORTED VERBATIM from the Vialwise iOS app (`src/calculator/validate.ts`).
 *
 * Validation runs at the boundary, BEFORE any math. Every invalid input
 * throws a typed CalculatorValidationError. Valid input passes through unchanged.
 *
 * The math modules (forward.ts, reverse.ts) trust that validation has already
 * run — they don't re-check inputs. So this is the only place that gates
 * garbage input.
 */

import {
  ForwardInput,
  ReverseInput,
  CalculatorValidationError,
} from "./types";

/**
 * Asserts that `value` is a positive, finite number. Throws otherwise.
 */
function assertPositiveFinite(
  value: unknown,
  fieldName: string,
): asserts value is number {
  if (typeof value !== "number") {
    throw new CalculatorValidationError(fieldName, "must be a number", value);
  }
  if (!Number.isFinite(value)) {
    throw new CalculatorValidationError(
      fieldName,
      "must be a finite number (received NaN or Infinity)",
      value,
    );
  }
  if (value <= 0) {
    throw new CalculatorValidationError(
      fieldName,
      "must be a positive number",
      value,
    );
  }
}

/**
 * Asserts that `value` is a positive whole integer. Throws otherwise.
 * Fractional values are explicitly rejected (not silently rounded) so users
 * notice and correct the input rather than getting a silently-rounded answer.
 */
function assertPositiveInteger(
  value: unknown,
  fieldName: string,
): asserts value is number {
  assertPositiveFinite(value, fieldName);
  if (!Number.isInteger(value)) {
    throw new CalculatorValidationError(
      fieldName,
      "must be a whole integer (received a fractional number)",
      value,
    );
  }
}

/**
 * Validates a ForwardInput. Throws CalculatorValidationError on the first
 * detected problem.
 *
 * Order of checks:
 *   1. vialMg positive & finite
 *   2. bacWaterMl positive & finite
 *   3. targetDoseMg positive & finite
 *   4. Cross-field: targetDoseMg ≤ vialMg
 */
export function validateForwardInput(input: ForwardInput): void {
  assertPositiveFinite(input.vialMg, "vialMg");
  assertPositiveFinite(input.bacWaterMl, "bacWaterMl");
  assertPositiveFinite(input.targetDoseMg, "targetDoseMg");

  if (input.targetDoseMg > input.vialMg) {
    throw new CalculatorValidationError(
      "targetDoseMg",
      `cannot exceed vial total (vialMg=${input.vialMg})`,
      input.targetDoseMg,
    );
  }
}

/**
 * Validates a ReverseInput. Throws CalculatorValidationError on the first
 * detected problem.
 *
 * Order of checks:
 *   1. targetDoseMg positive & finite
 *   2. vialMg positive & finite
 *   3. desiredUnitsPerDrawU100 positive whole integer
 *   4. Cross-field: targetDoseMg ≤ vialMg
 */
export function validateReverseInput(input: ReverseInput): void {
  assertPositiveFinite(input.targetDoseMg, "targetDoseMg");
  assertPositiveFinite(input.vialMg, "vialMg");
  assertPositiveInteger(
    input.desiredUnitsPerDrawU100,
    "desiredUnitsPerDrawU100",
  );

  if (input.targetDoseMg > input.vialMg) {
    throw new CalculatorValidationError(
      "targetDoseMg",
      `cannot exceed vial total (vialMg=${input.vialMg})`,
      input.targetDoseMg,
    );
  }
}
