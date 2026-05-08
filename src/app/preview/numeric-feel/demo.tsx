"use client";

import { useState, useEffect, useRef } from "react";

type Inputs = { vialMg: number; bacMl: number; doseMg: number };

const PRESETS: { label: string; inputs: Inputs }[] = [
  { label: "Reta — 30 mg / 3 mL / 1 mg", inputs: { vialMg: 30, bacMl: 3, doseMg: 1 } },
  { label: "Sema — 5 mg / 2 mL / 0.25 mg", inputs: { vialMg: 5, bacMl: 2, doseMg: 0.25 } },
  { label: "Tirz — 15 mg / 3 mL / 2.5 mg", inputs: { vialMg: 15, bacMl: 3, doseMg: 2.5 } },
  { label: "BPC — 10 mg / 5 mL / 0.5 mg", inputs: { vialMg: 10, bacMl: 5, doseMg: 0.5 } },
];

function computeResult(i: Inputs) {
  const concentration = i.vialMg / i.bacMl;
  const drawMl = i.doseMg / concentration;
  const drawUnits = Math.round(drawMl * 100);
  return {
    concentration: concentration.toFixed(2),
    drawMl: drawMl.toFixed(4),
    drawUnits,
  };
}

export function NumericFeelDemo() {
  const [presetIdx, setPresetIdx] = useState(0);
  const inputs = PRESETS[presetIdx].inputs;
  const result = computeResult(inputs);

  return (
    <>
      {/* Preset switcher */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setPresetIdx(i)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
              i === presetIdx
                ? "border-amber-dark bg-amber-dark text-bone"
                : "border-espresso/15 bg-bone text-espresso hover:border-espresso/30"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Side-by-side panels */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Panel label="Today" tone="static">
          <ResultPanel result={result} animated={false} />
        </Panel>
        <Panel label="Proposed" tone="animated">
          <ResultPanel result={result} animated />
        </Panel>
      </div>

      {/* Try-it inputs */}
      <div className="mt-12 rounded-3xl border border-espresso/10 bg-cream/40 p-6 md:p-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-graphite">
          Or change individual values
        </p>
        <p className="mt-1 text-[13.5px] text-graphite">
          Click any number to bump it. Watch the result panels above react.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <ValueBumper
            label="Vial size (mg)"
            value={inputs.vialMg}
            onChange={(next) =>
              setPresetIdx((i) => {
                PRESETS[i].inputs = { ...PRESETS[i].inputs, vialMg: next };
                return i;
              })
            }
            options={[5, 10, 15, 30, 50]}
          />
          <ValueBumper
            label="BAC water (mL)"
            value={inputs.bacMl}
            onChange={(next) =>
              setPresetIdx((i) => {
                PRESETS[i].inputs = { ...PRESETS[i].inputs, bacMl: next };
                return i;
              })
            }
            options={[1, 2, 3, 4, 5]}
          />
          <ValueBumper
            label="Dose (mg)"
            value={inputs.doseMg}
            onChange={(next) =>
              setPresetIdx((i) => {
                PRESETS[i].inputs = { ...PRESETS[i].inputs, doseMg: next };
                return i;
              })
            }
            options={[0.1, 0.25, 0.5, 1, 2.5]}
          />
        </div>
      </div>
    </>
  );
}

function Panel({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "static" | "animated";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-medium tracking-tight text-espresso">
          {label}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${
            tone === "animated"
              ? "bg-forest/[0.10] text-forest"
              : "bg-graphite/[0.10] text-graphite"
          }`}
        >
          {tone === "animated" ? "Tabular + fade" : "Plain"}
        </span>
      </div>
      <div className="rounded-3xl bg-forest p-6 md:p-7">{children}</div>
    </div>
  );
}

function ResultPanel({
  result,
  animated,
}: {
  result: { concentration: string; drawMl: string; drawUnits: number };
  animated: boolean;
}) {
  return (
    <div className="space-y-1">
      <Row
        label="Concentration"
        value={result.concentration}
        unit="mg/mL"
        animated={animated}
      />
      <Divider />
      <Row label="Draw volume" value={result.drawMl} unit="mL" animated={animated} />
      <Divider />
      <Row
        label="Draw on U-100"
        value={`${result.drawUnits}`}
        unit="units"
        animated={animated}
        accent
      />
    </div>
  );
}

function Row({
  label,
  value,
  unit,
  animated,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  animated: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-3">
      <span className="text-[12px] uppercase tracking-[0.12em] text-bone/65">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`tracking-tight ${accent ? "text-amber-light" : "text-bone"}`}
          style={{
            // Today panel renders in the system font (what the calculator
            // showed before any of this work). Proposed panel keeps brand
            // Outfit + tabular figures + cross-fade. The font swap makes
            // the comparison legible — both panels in Outfit looked
            // visually identical at this size.
            fontFamily: animated
              ? "var(--font-outfit), Outfit, sans-serif"
              : "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            fontFeatureSettings: animated ? '"tnum" 1, "lnum" 1' : undefined,
            fontVariantNumeric: animated ? "tabular-nums lining-nums" : undefined,
            fontWeight: 500,
            fontSize: accent ? 28 : 22,
            lineHeight: 1,
          }}
        >
          {animated ? <FadeNumber value={value} /> : value}
        </span>
        <span className="text-[12px] text-bone/65">{unit}</span>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-bone/15" />;
}

/**
 * Cross-fade between the previous and next value. New digit appears at 30%
 * opacity then ramps to full while the old fades out. ~150ms.
 */
function FadeNumber({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const [opacity, setOpacity] = useState(1);
  const lastValue = useRef(value);

  useEffect(() => {
    if (value === lastValue.current) return;
    lastValue.current = value;
    setOpacity(0.3);
    const t1 = setTimeout(() => setShown(value), 75);
    const t2 = setTimeout(() => setOpacity(1), 90);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [value]);

  return (
    <span
      style={{
        opacity,
        transition: "opacity 150ms ease-out",
        display: "inline-block",
      }}
    >
      {shown}
    </span>
  );
}

function ValueBumper({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  options: number[];
}) {
  return (
    <div className="rounded-2xl border border-espresso/10 bg-bone p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-graphite/80">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1 text-[12.5px] font-medium ${
              opt === value
                ? "bg-espresso text-bone"
                : "bg-cream/60 text-espresso hover:bg-cream"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
