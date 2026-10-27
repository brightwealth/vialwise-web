"use client";

import { useMemo } from "react";
import type { BlendOutput } from "@/lib/calculator";
import {
  anchorAfterRemoval,
  BLEND_LABELS,
  blendAmountValue,
  deriveBlend,
  MAX_BLEND_COMPONENTS,
  MIN_BLEND_COMPONENTS,
  type AmountUnit,
  type AnchorMode,
  type BlendField,
  type BlendForm,
} from "./blendForm";
import { ChipGroup, NumberField, ResultPlaceholder, ResultShell, Stat, UnitToggle } from "./controls";
import { parseNumberInput } from "./format";
import { SyringePanel } from "./syringe/SyringePanel";
import { SyringeSizeSelector } from "./syringe/SyringeSizeSelector";
import { syringeOverflowWarning, syringeStateFor, type SyringeSize } from "./syringe/syringeState";
import { VialUsage } from "./VialUsage";
import { WarningList, type CalculatorNote } from "./WarningList";

/**
 * Blend calculator: 2–4 peptides in one vial, one shared water volume, one
 * shared draw. The user sets the draw by the amount of one peptide per draw or
 * by draw units; every peptide's amount in that draw follows by ratio
 * (`computeBlend`, ported from the app).
 *
 * Generic labels only (Peptide A–D). No compound names, no library seeding, no
 * suggested amounts — every field starts blank with no example number. The
 * form state lives in the parent so switching modes keeps it.
 */

const RESULT_ROWS = [
  { label: "Each peptide per draw", unit: "mg" },
  { label: "Shared draw on U-100", unit: "units" },
];

export function BlendCalculator({
  form,
  onChange,
  syringeMax,
  onSyringeMaxChange,
}: {
  form: BlendForm;
  onChange: (next: BlendForm) => void;
  syringeMax: SyringeSize;
  onSyringeMaxChange: (next: SyringeSize) => void;
}) {
  const state = useMemo(() => deriveBlend(form), [form]);
  const errorFor = (field: BlendField) =>
    state.kind === "error" && state.field === field ? state.message : undefined;

  const set = (patch: Partial<BlendForm>) => onChange({ ...form, ...patch });

  const setComponent = (index: number, value: string) =>
    set({ componentMg: form.componentMg.map((v, i) => (i === index ? value : v)) });

  const addComponent = () => {
    if (form.componentMg.length < MAX_BLEND_COMPONENTS) {
      set({ componentMg: [...form.componentMg, ""] });
    }
  };

  const removeComponent = (index: number) => {
    if (form.componentMg.length <= MIN_BLEND_COMPONENTS) return;
    set({
      componentMg: form.componentMg.filter((_, i) => i !== index),
      anchorIndex: anchorAfterRemoval(form.anchorIndex, index),
    });
  };

  // Switching mg ↔ mcg clears the amount: "1" means something different in
  // each, and silently reinterpreting it is what the toggle exists to prevent.
  const setAmountUnit = (unit: AmountUnit) => {
    if (unit !== form.amountUnit) set({ amountUnit: unit, amount: "" });
  };

  const anchorLabel = BLEND_LABELS[form.anchorIndex];
  const canRemove = form.componentMg.length > MIN_BLEND_COMPONENTS;

  return (
    <>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* ── Inputs ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed text-graphite">
            One vial, one water volume, one draw. Enter how much of each peptide
            is in the vial.
          </p>

          {form.componentMg.map((value, i) => (
            <NumberField
              key={i}
              id={`blend-component-${i}`}
              label={`${BLEND_LABELS[i]} in the vial`}
              suffix="mg"
              value={value}
              onChange={(v) => setComponent(i, v)}
              error={errorFor(`component-${i}`)}
              accessory={
                canRemove ? (
                  <button
                    type="button"
                    onClick={() => removeComponent(i)}
                    className="rounded-full px-2 py-1 text-[12px] font-medium text-graphite transition hover:text-espresso"
                    aria-label={`Remove ${BLEND_LABELS[i]}`}
                  >
                    Remove
                  </button>
                ) : null
              }
            />
          ))}

          {form.componentMg.length < MAX_BLEND_COMPONENTS ? (
            <button
              type="button"
              onClick={addComponent}
              className="rounded-2xl border border-dashed border-espresso/20 px-4 py-3 text-[14px] font-medium text-espresso transition hover:border-espresso/40 hover:bg-bone/60"
            >
              {`Add ${BLEND_LABELS[form.componentMg.length]}`}
            </button>
          ) : null}

          <NumberField
            id="blend-water"
            label="Bacteriostatic water (shared)"
            suffix="mL"
            value={form.water}
            onChange={(v) => set({ water: v })}
            error={errorFor("water")}
          />

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-medium text-espresso">Set the shared draw by</p>
            <ChipGroup<AnchorMode>
              label="Set the shared draw by"
              options={[
                { value: "amount", label: "Amount of one peptide" },
                { value: "units", label: "Draw units" },
              ]}
              value={form.anchorMode}
              onChange={(m) => set({ anchorMode: m })}
            />
          </div>

          {form.anchorMode === "amount" ? (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-medium text-espresso">Which peptide</p>
                <ChipGroup<number>
                  label="Which peptide sets the draw"
                  options={form.componentMg.map((_, i) => ({ value: i, label: BLEND_LABELS[i] }))}
                  value={form.anchorIndex}
                  onChange={(i) => set({ anchorIndex: i })}
                />
              </div>
              <NumberField
                id="blend-amount"
                label={`Amount of ${anchorLabel} per draw`}
                suffix={form.amountUnit}
                value={form.amount}
                onChange={(v) => set({ amount: v })}
                error={errorFor("amount")}
                accessory={<UnitToggle unit={form.amountUnit} onChange={setAmountUnit} />}
              />
            </>
          ) : (
            <NumberField
              id="blend-units"
              label="Shared draw on U-100"
              suffix="units"
              value={form.units}
              onChange={(v) => set({ units: v })}
              error={errorFor("units")}
            />
          )}

          <SyringeSizeSelector value={syringeMax} onChange={onSyringeMaxChange} />

          <p className="text-[13px] leading-relaxed text-graphite">
            Every peptide in the vial is drawn together. Set the amount of one
            peptide per draw, or the draw size, and the calculator shows how
            much of each peptide that same draw contains.
          </p>
        </div>

        {/* ── Result ─────────────────────────────────────────────────── */}
        <div>
          {state.kind === "result" ? (
            <BlendResult result={state.result} form={form} syringeMax={syringeMax} />
          ) : state.kind === "too-small" ? (
            <div className="flex flex-col gap-4">
              <ResultPlaceholder rows={RESULT_ROWS} message="No measurable draw at these numbers." />
              <WarningList warnings={[state.warning]} />
            </div>
          ) : (
            <ResultPlaceholder
              rows={RESULT_ROWS}
              message={
                state.kind === "error"
                  ? "Check the highlighted field."
                  : "Fill in the fields to see what one draw contains."
              }
            />
          )}
        </div>
      </div>

      {/* ── Draws per vial + how long a vial lasts ───────────────────── */}
      {state.kind === "result" ? (
        <div className="mt-5">
          <VialUsage totalDoses={state.result.totalDoses} />
        </div>
      ) : null}
    </>
  );
}

function BlendResult({
  result,
  form,
  syringeMax,
}: {
  result: BlendOutput;
  form: BlendForm;
  syringeMax: number;
}) {
  const water = parseNumberInput(form.water);
  // The blend engine returns plain messages; show them as "Heads up" notes,
  // after the syringe-size overflow note when the draw won't fit.
  const overflow = syringeOverflowWarning(result.drawUnitsU100, syringeMax);
  const notes: CalculatorNote[] = [
    ...(overflow ? [overflow] : []),
    ...result.warnings.map((message) => ({ level: "warning" as const, message })),
  ];

  return (
    <ResultShell
      footer="Every peptide in the vial is drawn together, so one draw contains each amount above."
      syringe={
        <SyringePanel
          drawUnitsU100={result.drawUnitsU100}
          syringeMax={syringeMax}
          state={syringeStateFor(result.drawUnitsU100, syringeMax)}
        />
      }
      warnings={<WarningList warnings={notes} />}
    >
      {result.components.map((c, i) => (
        <Stat
          key={i}
          label={`${BLEND_LABELS[i]} per draw`}
          caption={`${parseNumberInput(form.componentMg[i])} mg in ${water} mL · ${c.concentrationMgPerMl} mg/mL`}
          value={blendAmountValue(c.perDoseMg, form.amountUnit)}
          unit={form.amountUnit}
          accent
        />
      ))}
      <Stat label="Shared draw on U-100" value={`${result.drawUnitsU100}`} unit="units" />
    </ResultShell>
  );
}
