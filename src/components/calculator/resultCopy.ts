/**
 * Footers under the forward and reverse result cards. They say where the
 * numbers come from — the user's own inputs — and make no claim about what
 * anyone has done with them.
 */

export const FORWARD_FOOTER = "Calculated from the numbers you entered.";

export const REVERSE_FOOTER =
  "The water volume that makes your target amount fit the draw size you chose.";

/**
 * The forward footer, or null when the draw rounds to 0 units: there is no
 * measurable draw to describe, and the DRAW_ROUNDS_TO_ZERO warning says why.
 */
export function forwardFooter(drawUnitsU100: number): string | null {
  return drawUnitsU100 === 0 ? null : FORWARD_FOOTER;
}
