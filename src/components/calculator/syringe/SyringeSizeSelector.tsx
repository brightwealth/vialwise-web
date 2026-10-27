"use client";

import { SYRINGE_SIZES, type SyringeSize } from "./syringeState";

/**
 * Syringe-size picker — the web port of the app's SyringeSizeSelector: the
 * same three U-100 sizes, amber selected segment (amber-dark here, for
 * 4.5:1 text contrast). Changes only the syringe
 * drawing and the overflow note, never the math. The caller owns the state.
 */
export function SyringeSizeSelector({
  value,
  onChange,
}: {
  value: SyringeSize;
  onChange: (next: SyringeSize) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p id="syringe-size-label" className="text-[13px] font-medium text-espresso">
        Syringe size
      </p>
      <div
        role="radiogroup"
        aria-labelledby="syringe-size-label"
        className="flex gap-1 rounded-2xl border border-espresso/[0.08] bg-bone p-1"
      >
        {SYRINGE_SIZES.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`flex flex-1 flex-col items-center rounded-xl px-2 py-2 transition ${
                active ? "bg-amber-dark text-bone shadow-sm" : "text-graphite hover:bg-cream/60"
              }`}
            >
              <span className="text-[14px] font-medium">{opt.label}</span>
              <span className={`mt-0.5 text-[11px] ${active ? "text-bone" : "text-graphite"}`}>
                {opt.helper}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
