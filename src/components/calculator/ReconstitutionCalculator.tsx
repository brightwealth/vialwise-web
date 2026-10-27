"use client";

import { useEffect, useMemo, useState } from "react";
import {
  forward,
  reverse,
  CalculatorValidationError,
  type ForwardOutput,
  type ReverseOutput,
} from "@/lib/calculator";
import { parseNumberInput } from "./format";
import { WarningList } from "./WarningList";
import { VialUsage } from "./VialUsage";
import { BlendCalculator } from "./BlendCalculator";
import { emptyBlendForm, type AmountUnit, type BlendForm } from "./blendForm";
import { NumberField, ResultPlaceholder, ResultShell, Stat, UnitToggle } from "./controls";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { SyringePanel } from "./syringe/SyringePanel";
import { SyringeSizeSelector } from "./syringe/SyringeSizeSelector";
import {
  DEFAULT_SYRINGE_SIZE,
  syringeStateFor,
  withSyringeOverflow,
  type SyringeSize,
} from "./syringe/syringeState";

/**
 * The free web reconstitution calculator. A client island that wraps the
 * ported pure engine (`@/lib/calculator`) — forward, reverse and blend modes,
 * an mg/mcg amount toggle, the app's syringe sizes and visual syringe, live
 * results, the app's warnings, and the draws-per-vial planning panel.
 *
 * Vocabulary matches the app: "amount" and "draw", never "dose". The engine
 * field names (targetDoseMg, totalDoses) stay internal; nothing user-facing
 * says "dose".
 *
 * `/calculator#blend` opens the blend mode.
 */

type Mode = "forward" | "reverse" | "blend";

type Computed =
  | { kind: "empty" }
  | { kind: "error"; error: CalculatorValidationError }
  | { kind: "forward"; result: ForwardOutput }
  | { kind: "reverse"; result: ReverseOutput; desiredUnits: number };

/** amount as entered + its unit → milligrams for the engine (mcg ÷ 1000). */
function toMg(raw: string, unit: AmountUnit): number {
  const n = parseNumberInput(raw);
  if (!Number.isFinite(n)) return NaN;
  return unit === "mcg" ? n / 1000 : n;
}

function humanizeError(error: CalculatorValidationError): string {
  const r = error.reason;
  if (r.includes("cannot exceed vial total")) return "Can’t exceed the vial total.";
  if (r.includes("whole integer")) return "Enter a whole number of units.";
  if (r.includes("positive")) return "Enter a number greater than zero.";
  if (r.includes("finite") || r.includes("must be a number"))
    return "Enter a valid number.";
  return r;
}

const BLEND_HASH = "#blend";

export function ReconstitutionCalculator() {
  const [mode, setMode] = useState<Mode>("forward");
  const [unit, setUnit] = useState<AmountUnit>("mg");
  const [syringeMax, setSyringeMax] = useState<SyringeSize>(DEFAULT_SYRINGE_SIZE);

  const [vial, setVial] = useState("");
  const [water, setWater] = useState("");
  const [amount, setAmount] = useState("");
  const [desiredUnits, setDesiredUnits] = useState("");
  const [blendForm, setBlendForm] = useState<BlendForm>(emptyBlendForm);

  // Deep link: /calculator#blend opens the blend mode. Read after mount so the
  // server-rendered HTML (forward mode) hydrates cleanly.
  useEffect(() => {
    if (window.location.hash === BLEND_HASH) setMode("blend");
  }, []);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}${next === "blend" ? BLEND_HASH : ""}`);
  };

  const computed = useMemo<Computed>(() => {
    const vialMg = parseNumberInput(vial);
    const amountMg = toMg(amount, unit);

    if (mode === "forward") {
      const bacWaterMl = parseNumberInput(water);
      if (vial === "" || water === "" || amount === "") return { kind: "empty" };
      try {
        return { kind: "forward", result: forward({ vialMg, bacWaterMl, targetDoseMg: amountMg }) };
      } catch (e) {
        if (e instanceof CalculatorValidationError) return { kind: "error", error: e };
        throw e;
      }
    }

    if (mode === "reverse") {
      const units = parseNumberInput(desiredUnits);
      if (vial === "" || amount === "" || desiredUnits === "") return { kind: "empty" };
      try {
        return {
          kind: "reverse",
          result: reverse({ targetDoseMg: amountMg, vialMg, desiredUnitsPerDrawU100: units }),
          desiredUnits: units,
        };
      } catch (e) {
        if (e instanceof CalculatorValidationError) return { kind: "error", error: e };
        throw e;
      }
    }

    return { kind: "empty" };
  }, [mode, unit, vial, water, amount, desiredUnits]);

  const errorFor = (field: string): string | undefined =>
    computed.kind === "error" && computed.error.field === field
      ? humanizeError(computed.error)
      : undefined;

  // Switching amount unit clears the amount: "1" means something different in
  // mg vs mcg, and silently reinterpreting it is the failure mode the toggle
  // exists to prevent (mirrors the app).
  const handleUnitChange = (next: AmountUnit) => {
    if (next === unit) return;
    setUnit(next);
    setAmount("");
  };

  return (
    <div className="rounded-[32px] border border-espresso/[0.08] bg-cream/40 p-5 sm:p-7">
      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "blend" ? (
        <BlendCalculator
          form={blendForm}
          onChange={setBlendForm}
          syringeMax={syringeMax}
          onSyringeMaxChange={setSyringeMax}
        />
      ) : (
        <>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* ── Inputs ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <NumberField
                id="vial"
                label="Vial size"
                suffix="mg"
                placeholder="e.g. 30"
                value={vial}
                onChange={setVial}
                error={errorFor("vialMg")}
              />

              {mode === "forward" ? (
                <NumberField
                  id="water"
                  label="Bacteriostatic water"
                  suffix="mL"
                  placeholder="e.g. 3.0"
                  value={water}
                  onChange={setWater}
                  error={errorFor("bacWaterMl")}
                />
              ) : null}

              <NumberField
                id="amount"
                label="Target amount per draw"
                suffix={unit}
                placeholder={unit === "mcg" ? "e.g. 500" : "e.g. 1"}
                value={amount}
                onChange={setAmount}
                error={errorFor("targetDoseMg")}
                accessory={<UnitToggle unit={unit} onChange={handleUnitChange} />}
              />

              {mode === "reverse" ? (
                <NumberField
                  id="desiredUnits"
                  label="Desired draw on U-100"
                  suffix="units"
                  placeholder="e.g. 10"
                  value={desiredUnits}
                  onChange={setDesiredUnits}
                  error={errorFor("desiredUnitsPerDrawU100")}
                />
              ) : null}

              <SyringeSizeSelector value={syringeMax} onChange={setSyringeMax} />

              <p className="text-[13px] leading-relaxed text-graphite">
                {mode === "forward"
                  ? "Enter your vial size, the bacteriostatic water you added, and the amount you want per draw."
                  : "Enter your vial size, the amount you want per draw, and the draw size you’d like to measure on a U-100 syringe."}
              </p>
            </div>

            {/* ── Result ─────────────────────────────────────────────── */}
            <div>
              {computed.kind === "forward" ? (
                <ForwardResult result={computed.result} syringeMax={syringeMax} />
              ) : computed.kind === "reverse" ? (
                <ReverseResult
                  result={computed.result}
                  desiredUnits={computed.desiredUnits}
                  syringeMax={syringeMax}
                />
              ) : (
                <ResultPlaceholder
                  rows={mode === "forward" ? FORWARD_ROWS : REVERSE_ROWS}
                  message={
                    computed.kind === "error"
                      ? "Check the highlighted field above."
                      : "Fill in the fields to see your result."
                  }
                />
              )}
            </div>
          </div>

          {/* ── Draws per vial + how long a vial lasts ─────────────────── */}
          {computed.kind === "forward" || computed.kind === "reverse" ? (
            <div className="mt-5">
              <VialUsage totalDoses={computed.result.totalDoses} />
            </div>
          ) : null}
        </>
      )}

      <DisclaimerBanner className="mt-5" />
    </div>
  );
}

const FORWARD_ROWS = [
  { label: "Concentration", unit: "mg/mL" },
  { label: "Draw volume", unit: "mL" },
  { label: "Draw on U-100", unit: "units" },
];

const REVERSE_ROWS = [
  { label: "BAC water to add", unit: "mL" },
  { label: "Concentration", unit: "mg/mL" },
  { label: "Draw on U-100", unit: "units" },
];

// ─── Result panels ───────────────────────────────────────────────────────────

function ForwardResult({ result, syringeMax }: { result: ForwardOutput; syringeMax: number }) {
  // Show the unrounded draw only when rounding moved it by more than half a
  // unit — otherwise it's noise (mirrors the app's ResultPanel).
  const showExact =
    Math.abs(result.drawUnitsU100Exact - result.drawUnitsU100) > 0.05;

  return (
    <ResultShell
      footer="Researchers have observed this draw size at this concentration."
      syringe={
        <SyringePanel
          drawUnitsU100={result.drawUnitsU100}
          drawUnitsExact={result.drawUnitsU100Exact}
          syringeMax={syringeMax}
          state={syringeStateFor(result.drawUnitsU100, syringeMax)}
        />
      }
      warnings={
        <WarningList warnings={withSyringeOverflow(result.warnings, result.drawUnitsU100, syringeMax)} />
      }
    >
      <Stat label="Concentration" value={result.concentrationMgPerMl.toFixed(2)} unit="mg/mL" />
      <Stat label="Draw volume" value={result.drawMl.toFixed(4)} unit="mL" />
      <Stat
        label="Draw on U-100"
        value={`${result.drawUnitsU100}`}
        unit={showExact ? `units (≈ ${result.drawUnitsU100Exact.toFixed(2)})` : "units"}
        accent
      />
    </ResultShell>
  );
}

function ReverseResult({
  result,
  desiredUnits,
  syringeMax,
}: {
  result: ReverseOutput;
  desiredUnits: number;
  syringeMax: number;
}) {
  return (
    <ResultShell
      footer="Researchers add this volume of bacteriostatic water to achieve the target draw size."
      syringe={
        <SyringePanel
          drawUnitsU100={desiredUnits}
          syringeMax={syringeMax}
          state={syringeStateFor(desiredUnits, syringeMax)}
        />
      }
      warnings={<WarningList warnings={withSyringeOverflow(result.warnings, desiredUnits, syringeMax)} />}
    >
      <Stat label="BAC water to add" value={result.bacWaterMlToAdd.toFixed(1)} unit="mL" accent />
      <Stat label="Concentration" value={result.concentrationMgPerMl.toFixed(2)} unit="mg/mL" />
      <Stat label="Draw on U-100" value={`${desiredUnits}`} unit="units" />
    </ResultShell>
  );
}

// ─── Mode toggle ─────────────────────────────────────────────────────────────

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const segments: { value: Mode; label: string; helper: string }[] = [
    { value: "forward", label: "Forward", helper: "Vial → draw" },
    { value: "reverse", label: "Reverse", helper: "Draw → water" },
    { value: "blend", label: "Blend", helper: "2–4 in a vial" },
  ];
  return (
    <div
      className="flex gap-1 rounded-2xl border border-espresso/[0.08] bg-bone p-1"
      role="tablist"
      aria-label="Calculator mode"
    >
      {segments.map((s) => {
        const active = s.value === mode;
        return (
          <button
            key={s.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.value)}
            className={`flex flex-1 flex-col items-center rounded-xl px-1.5 py-2.5 transition sm:px-4 ${
              active ? "bg-cream shadow-sm" : "hover:bg-cream/50"
            }`}
          >
            <span
              className={`text-[15px] font-medium ${active ? "text-espresso" : "text-graphite"}`}
            >
              {s.label}
            </span>
            <span
              className={`mt-0.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.08em] sm:tracking-[0.12em] ${
                active ? "text-amber-deep" : "text-graphite"
              }`}
            >
              {s.helper}
            </span>
          </button>
        );
      })}
    </div>
  );
}
