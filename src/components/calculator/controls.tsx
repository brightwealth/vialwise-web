"use client";

import type { AmountUnit } from "./blendForm";

/**
 * Form controls and result chrome shared by the forward, reverse and blend
 * calculators. Moved out of ReconstitutionCalculator unchanged so the three
 * modes look and behave the same.
 */

export function NumberField({
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

export function UnitToggle({
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

/** Radio chips (same look as the vial-usage frequency picker). */
export function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
              selected
                ? "border-forest bg-forest text-bone"
                : "border-espresso/15 bg-bone text-espresso hover:border-espresso/30"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ResultShell({
  children,
  syringe,
  warnings,
  footer,
}: {
  children: React.ReactNode;
  syringe?: React.ReactNode;
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
      {syringe}
      {warnings}
    </div>
  );
}

export function Stat({
  label,
  caption,
  value,
  unit,
  accent,
}: {
  label: string;
  /** Optional second line under the label (e.g. a blend component's mix). */
  caption?: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-bone/15 py-2.5 last:border-b-0">
      <dt className="flex flex-col">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-bone/70">
          {label}
        </span>
        {caption ? <span className="mt-1 text-[12.5px] text-bone/65">{caption}</span> : null}
      </dt>
      <dd className="flex shrink-0 items-baseline gap-1">
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

/** Dashed empty-state panel with the result rows the user will get. */
export function ResultPlaceholder({
  rows,
  message,
}: {
  rows: { label: string; unit: string }[];
  message: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-espresso/15 bg-bone/60 p-6">
      <dl className="flex flex-col">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between border-b border-espresso/[0.07] py-2.5 last:border-b-0"
          >
            <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-graphite">
              {r.label}
            </dt>
            <dd className="flex items-baseline gap-1 text-graphite">
              <span className="text-[22px] font-medium leading-none">—</span>
              <span className="text-[13px]">{r.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-center text-[13px] text-graphite">{message}</p>
    </div>
  );
}
