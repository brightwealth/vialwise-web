"use client";

import { useMemo, useState } from "react";
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

/**
 * The free web reconstitution calculator. A client island that wraps the
 * ported pure engine (`@/lib/calculator`) — forward and reverse modes, an
 * mg/mcg amount toggle, live results, the app's warnings, and the draws-per-
 * vial planning panel.
 *
 * Vocabulary matches the app: "amount" and "draw", never "dose". The engine
 * field names (targetDoseMg, totalDoses) stay internal; nothing user-facing
 * says "dose".
 */

type Mode = "forward" | "reverse";
type AmountUnit = "mg" | "mcg";

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

export function ReconstitutionCalculator() {
  const [mode, setMode] = useState<Mode>("forward");
  const [unit, setUnit] = useState<AmountUnit>("mg");

  const [vial, setVial] = useState("");
  const [water, setWater] = useState("");
  const [amount, setAmount] = useState("");
  const [desiredUnits, setDesiredUnits] = useState("");

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

    // reverse
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
      <ModeToggle mode={mode} onChange={setMode} />

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* ── Inputs ─────────────────────────────────────────────────── */}
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

          <p className="text-[13px] leading-relaxed text-graphite">
            {mode === "forward"
              ? "Enter your vial size, the bacteriostatic water you added, and the amount you want per draw."
              : "Enter your vial size, the amount you want per draw, and the draw size you’d like to measure on a U-100 syringe."}
          </p>
        </div>

        {/* ── Result ─────────────────────────────────────────────────── */}
        <div>
          {computed.kind === "forward" ? (
            <ForwardResult result={computed.result} />
          ) : computed.kind === "reverse" ? (
            <ReverseResult result={computed.result} desiredUnits={computed.desiredUnits} />
          ) : (
            <ResultPlaceholder mode={mode} message={computed.kind === "error" ? "Check the highlighted field above." : undefined} />
          )}
        </div>
      </div>

      {/* ── Draws per vial + how long a vial lasts ───────────────────── */}
      {computed.kind === "forward" || computed.kind === "reverse" ? (
        <div className="mt-5">
          <VialUsage totalDoses={computed.result.totalDoses} />
        </div>
      ) : null}
    </div>
  );
}

// ─── Result panels ───────────────────────────────────────────────────────────

function ForwardResult({ result }: { result: ForwardOutput }) {
  // Show the unrounded draw only when rounding moved it by more than half a
  // unit — otherwise it's noise (mirrors the app's ResultPanel).
  const showExact =
    Math.abs(result.drawUnitsU100Exact - result.drawUnitsU100) > 0.05;

  return (
    <ResultShell
      footer="Researchers have observed this draw size at this concentration."
      warnings={<WarningList warnings={result.warnings} />}
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
}: {
  result: ReverseOutput;
  desiredUnits: number;
}) {
  return (
    <ResultShell
      footer="Researchers add this volume of bacteriostatic water to achieve the target draw size."
      warnings={<WarningList warnings={result.warnings} />}
    >
      <Stat label="BAC water to add" value={result.bacWaterMlToAdd.toFixed(1)} unit="mL" accent />
      <Stat label="Concentration" value={result.concentrationMgPerMl.toFixed(2)} unit="mg/mL" />
      <Stat label="Draw on U-100" value={`${desiredUnits}`} unit="units" />
    </ResultShell>
  );
}

function ResultShell({
  children,
  warnings,
  footer,
}: {
  children: React.ReactNode;
  warnings: React.ReactNode;
  footer: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-forest p-6">
        <dl className="flex flex-col">{children}</dl>
        <p className="mt-4 text-center text-[12.5px] italic leading-relaxed text-bone/75">
          {footer}
        </p>
      </div>
      {warnings}
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-bone/15 py-2.5 last:border-b-0">
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-bone/70">
        {label}
      </dt>
      <dd className="flex items-baseline gap-1">
        <span
          className={`font-medium leading-none ${
            accent ? "text-[26px] text-amber-light" : "text-[22px] text-bone"
          }`}
        >
          {value}
        </span>
        <span className="text-[13px] text-bone/65">{unit}</span>
      </dd>
    </div>
  );
}

function ResultPlaceholder({ mode, message }: { mode: Mode; message?: string }) {
  const rows =
    mode === "forward"
      ? [
          { label: "Concentration", unit: "mg/mL" },
          { label: "Draw volume", unit: "mL" },
          { label: "Draw on U-100", unit: "units" },
        ]
      : [
          { label: "BAC water to add", unit: "mL" },
          { label: "Concentration", unit: "mg/mL" },
          { label: "Draw on U-100", unit: "units" },
        ];

  return (
    <div className="rounded-3xl border border-dashed border-espresso/15 bg-bone/60 p-6">
      <dl className="flex flex-col">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between border-b border-espresso/[0.07] py-2.5 last:border-b-0"
          >
            <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-graphite/70">
              {r.label}
            </dt>
            <dd className="flex items-baseline gap-1 text-graphite/50">
              <span className="text-[22px] font-medium leading-none">—</span>
              <span className="text-[13px]">{r.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-center text-[13px] text-graphite">
        {message ?? "Fill in the fields to see your result."}
      </p>
    </div>
  );
}

// ─── Controls ────────────────────────────────────────────────────────────────

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const segments: { value: Mode; label: string; helper: string }[] = [
    { value: "forward", label: "Forward", helper: "Vial → draw" },
    { value: "reverse", label: "Reverse", helper: "Draw → water" },
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
            className={`flex flex-1 flex-col items-center rounded-xl px-4 py-2.5 transition ${
              active ? "bg-cream shadow-sm" : "hover:bg-cream/50"
            }`}
          >
            <span
              className={`text-[15px] font-medium ${active ? "text-espresso" : "text-graphite"}`}
            >
              {s.label}
            </span>
            <span
              className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                active ? "text-amber-dark" : "text-graphite/60"
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

function UnitToggle({
  unit,
  onChange,
}: {
  unit: AmountUnit;
  onChange: (u: AmountUnit) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-full border border-espresso/15 bg-bone p-0.5" role="group" aria-label="Amount unit">
      {(["mg", "mcg"] as const).map((u) => {
        const active = u === unit;
        return (
          <button
            key={u}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(u)}
            className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition ${
              active ? "bg-espresso text-bone" : "text-graphite hover:text-espresso"
            }`}
          >
            {u}
          </button>
        );
      })}
    </div>
  );
}

function NumberField({
  id,
  label,
  suffix,
  placeholder,
  value,
  onChange,
  error,
  accessory,
}: {
  id: string;
  label: string;
  suffix: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  accessory?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-espresso">
          {label}
        </label>
        {accessory}
      </div>
      <div
        className={`flex items-center rounded-2xl border bg-bone px-4 transition focus-within:ring-2 ${
          error
            ? "border-amber-dark/60 focus-within:border-amber-dark focus-within:ring-amber-dark/15"
            : "border-espresso/15 focus-within:border-forest focus-within:ring-forest/15"
        }`}
      >
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent py-3 text-[16px] text-espresso outline-none placeholder:text-graphite/50"
        />
        <span className="ml-2 shrink-0 text-[13px] font-medium text-graphite">{suffix}</span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-[12.5px] text-amber-dark" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
