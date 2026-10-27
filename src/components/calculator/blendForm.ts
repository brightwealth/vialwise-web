import {
  CalculatorValidationError,
  computeBlend,
  forward,
  type BlendOutput,
  type CalculatorWarning,
} from "@/lib/calculator";
import { parseNumberInput } from "./format";

/**
 * Form logic for the web blend calculator: raw field text in, a blend result
 * (or a field-specific message) out. Pure — no React — so it is tested
 * directly. The arithmetic is entirely `computeBlend` from the ported engine.
 *
 * Components are labelled generically (Peptide A–D). No compound names, no
 * library seeding, no suggested amounts: the user enters every number.
 */

export const BLEND_LABELS = ["Peptide A", "Peptide B", "Peptide C", "Peptide D"] as const;
export const MIN_BLEND_COMPONENTS = 2;
export const MAX_BLEND_COMPONENTS = BLEND_LABELS.length;

export type AmountUnit = "mg" | "mcg";
export type AnchorMode = "amount" | "units";

export type BlendForm = {
  /** Each component's amount in the vial, in mg, as typed. 2–4 entries. */
  componentMg: string[];
  /** Shared bacteriostatic water, mL, as typed. */
  water: string;
  /** Which component the amount anchor refers to. */
  anchorIndex: number;
  anchorMode: AnchorMode;
  /** Amount of the anchor component per draw, as typed, in `amountUnit`. */
  amount: string;
  amountUnit: AmountUnit;
  /** Shared draw on a U-100 syringe, as typed. */
  units: string;
};

/** Where a message belongs. `component-<i>` is that component's amount field. */
export type BlendField = "water" | "amount" | "units" | `component-${number}`;

export type BlendState =
  | { kind: "empty" }
  | { kind: "error"; field: BlendField; message: string }
  /** The anchor amount rounds to a 0-unit draw: the engine's own warning. */
  | { kind: "too-small"; warning: CalculatorWarning }
  | { kind: "result"; result: BlendOutput };

export function emptyBlendForm(): BlendForm {
  return {
    componentMg: ["", ""],
    water: "",
    anchorIndex: 0,
    anchorMode: "amount",
    amount: "",
    amountUnit: "mg",
    units: "",
  };
}

export function deriveBlend(form: BlendForm): BlendState {
  const blank = (s: string) => s.trim() === "";
  const anchorText = form.anchorMode === "amount" ? form.amount : form.units;
  if (form.componentMg.some(blank) || blank(form.water) || blank(anchorText)) {
    return { kind: "empty" };
  }

  const mgs = form.componentMg.map(parseNumberInput);
  const water = parseNumberInput(form.water);
  const anchorValue = parseNumberInput(anchorText);
  const amountMg = form.amountUnit === "mcg" ? anchorValue / 1000 : anchorValue;
  // When the draw is set in units, no component is the anchor; the engine still
  // wants a valid index, and ignores it for a units anchor.
  const anchorIndex = form.anchorMode === "amount" ? form.anchorIndex : 0;

  try {
    const result = computeBlend({
      components: mgs.map((mg) => ({ mg })),
      bacWaterMl: water,
      anchorIndex,
      anchor:
        form.anchorMode === "amount" ? { targetDoseMg: amountMg } : { drawUnitsU100: anchorValue },
    });
    return { kind: "result", result };
  } catch (e) {
    if (!(e instanceof CalculatorValidationError)) throw e;
    return explainError(e, form, mgs[anchorIndex], water, amountMg);
  }
}

function explainError(
  e: CalculatorValidationError,
  form: BlendForm,
  anchorMg: number,
  water: number,
  amountMg: number,
): BlendState {
  const component = /^components\[(\d+)\]\.mg$/.exec(e.field);
  if (component) {
    return { kind: "error", field: `component-${Number(component[1])}`, message: numberMessage(e.reason) };
  }
  if (e.field === "bacWaterMl") {
    return { kind: "error", field: "water", message: numberMessage(e.reason) };
  }
  if (e.field === "anchor") {
    // The shared draw rounds to 0 units.
    if (form.anchorMode === "units") {
      return { kind: "error", field: "units", message: "Rounds to 0 units. Enter at least 1 unit." };
    }
    // Same inputs through forward(): its DRAW_ROUNDS_TO_ZERO warning is the
    // message the single-peptide calculator shows for this case.
    const warning = forward({ vialMg: anchorMg, bacWaterMl: water, targetDoseMg: amountMg }).warnings.find(
      (w) => w.code === "DRAW_ROUNDS_TO_ZERO",
    );
    if (warning) return { kind: "too-small", warning };
  }
  if (e.field === "anchor.drawUnitsU100") {
    return { kind: "error", field: "units", message: numberMessage(e.reason) };
  }
  if (e.field === "targetDoseMg" && e.reason.includes("cannot exceed vial total")) {
    return {
      kind: "error",
      field: "amount",
      message: `Can’t exceed the amount of ${BLEND_LABELS[form.anchorIndex]} in the vial.`,
    };
  }
  if (e.field === "targetDoseMg") {
    return { kind: "error", field: "amount", message: numberMessage(e.reason) };
  }
  return { kind: "error", field: form.anchorMode, message: e.reason };
}

function numberMessage(reason: string): string {
  if (reason.includes("positive")) return "Enter a number greater than zero.";
  return "Enter a valid number.";
}

/**
 * A per-draw amount (given in mg) as a number in the display unit, rounded as
 * the app's blend screen rounds it: mcg to 2 decimals, mg to 4.
 */
export function blendAmountValue(mg: number, unit: AmountUnit): string {
  if (unit === "mcg") return `${Math.round(mg * 1000 * 100) / 100}`;
  return `${Math.round(mg * 10000) / 10000}`;
}

/** `blendAmountValue` with its unit, e.g. "0.5 mg". */
export function formatBlendAmount(mg: number, unit: AmountUnit): string {
  return `${blendAmountValue(mg, unit)} ${unit}`;
}

/** Keep the anchor on the same component after one is removed (as the app does). */
export function anchorAfterRemoval(anchorIndex: number, removedIndex: number): number {
  if (removedIndex < anchorIndex) return anchorIndex - 1;
  if (removedIndex === anchorIndex) return 0;
  return anchorIndex;
}
