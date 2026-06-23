"use client";

import { useMemo, useState } from "react";
import { computeVialUsage, type Frequency } from "@/lib/calculator";
import { formatDays, formatDraws, formatVials } from "./format";

/**
 * Draws-per-vial + "how long a vial lasts" planning panel. Ports the app's
 * VialUsagePanel: shows draws per vial (from the calculator's totalDoses) and,
 * for a chosen frequency, how long one vial lasts plus ~vials/month.
 *
 * Carries its own frequency state — the calculator inputs are protocol-
 * agnostic. Copy is outcome-free ("draws per vial," "lasts about"), never
 * "dose" and never benefit language.
 */

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "every-other-day", label: "Every other day" },
  { value: "weekly", label: "Weekly" },
  { value: "twice-weekly", label: "Twice weekly" },
];

export function VialUsage({ totalDoses }: { totalDoses: number }) {
  const [frequency, setFrequency] = useState<Frequency>("daily");

  const usage = useMemo(
    () => computeVialUsage({ totalDoses, frequency }),
    [totalDoses, frequency],
  );

  const days = formatDays(usage.daysPerVial);
  const vials = formatVials(usage.vialsPerMonth);

  return (
    <div className="rounded-3xl border border-espresso/[0.10] bg-bone p-6">
      <div className="flex items-baseline gap-2">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-graphite">
          Draws per vial
        </p>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[40px] font-medium leading-none tracking-tight text-amber-dark">
          {formatDraws(totalDoses)}
        </span>
        <span className="text-[15px] text-graphite">draws</span>
      </div>

      <p className="mt-5 text-[14px] text-graphite">
        At this frequency, one vial lasts:
      </p>

      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Frequency">
        {FREQUENCIES.map((opt) => {
          const selected = opt.value === frequency;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setFrequency(opt.value)}
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

      <div className="mt-5 border-t border-espresso/[0.08] pt-4">
        {days ? (
          <p className="text-[16px] text-espresso">
            Lasts about <strong className="font-medium">{days} days</strong>
            {vials ? (
              <span className="text-graphite">{`  ·  ≈ ${vials} vials/month`}</span>
            ) : null}
          </p>
        ) : (
          <p className="text-[15px] text-graphite">
            Enter an amount to estimate how long a vial lasts.
          </p>
        )}
      </div>
    </div>
  );
}
