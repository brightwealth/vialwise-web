import type { CalculatorWarning, WarningLevel } from "@/lib/calculator";

/**
 * Renders the calculator's non-fatal warnings (syringe overflow, draw below
 * precision, concentration high/low, large volume, near-capacity). Same
 * messages and severities the app surfaces — the engine owns the copy; this
 * component only styles by level. Brand palette only (amber + forest, no
 * neon "alert" colors).
 */

const LEVEL_STYLES: Record<
  WarningLevel,
  { wrap: string; tag: string; label: string }
> = {
  danger: {
    wrap: "border-amber-dark/40 bg-amber-dark/[0.07]",
    tag: "text-amber-dark",
    label: "Check this",
  },
  warning: {
    wrap: "border-amber/35 bg-amber/[0.06]",
    tag: "text-amber-dark",
    label: "Heads up",
  },
  info: {
    wrap: "border-forest/25 bg-forest/[0.05]",
    tag: "text-forest",
    label: "Note",
  },
};

// danger first, then warning, then info — same ordering as the app's panels.
const SEVERITY_RANK: Record<WarningLevel, number> = {
  danger: 0,
  warning: 1,
  info: 2,
};

export function WarningList({ warnings }: { warnings: CalculatorWarning[] }) {
  if (warnings.length === 0) return null;

  const sorted = [...warnings].sort(
    (a, b) => SEVERITY_RANK[a.level] - SEVERITY_RANK[b.level],
  );

  return (
    <ul className="flex flex-col gap-2" aria-label="Calculation notes">
      {sorted.map((w) => {
        const s = LEVEL_STYLES[w.level];
        return (
          <li
            key={w.code}
            className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 ${s.wrap}`}
          >
            <span
              className={`text-[11px] font-medium uppercase tracking-[0.14em] ${s.tag}`}
            >
              {s.label}
            </span>
            <span className="text-[14px] leading-relaxed text-espresso">
              {w.message}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
