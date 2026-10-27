/**
 * Prominent research/educational disclaimer — the same line the app shows on
 * every dose-related view. Amber strip so it reads as a first-class part of the
 * page, not fine print. Shared by the /calculator hero and every calculator
 * mode (forward, reverse, blend); the wording is fixed.
 */
export function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={`rounded-2xl border border-amber-dark/30 bg-amber-dark/[0.07] px-5 py-4 ${className ?? ""}`}
    >
      <p className="text-[14px] leading-relaxed text-espresso">
        <span className="font-medium text-amber-deep">
          For research and educational purposes only.
        </span>{" "}
        Not for medical use. This tool does not provide medical advice.
      </p>
    </div>
  );
}
