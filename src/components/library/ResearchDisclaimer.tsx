/**
 * The research-and-educational disclaimer band.
 *
 * Rendered by src/app/library/layout.tsx, which wraps EVERY /library route.
 * It lives in the layout deliberately: a per-page disclaimer is a per-page
 * thing to forget, and this one is not allowed to be missing from any page.
 *
 * Posture (founder decision, 2026-09-07): prominent and persistent, but NOT a
 * click-through interstitial. Google demotes intrusive interstitials on mobile
 * and crawlers can end up indexing the gate instead of the entry — which would
 * defeat the reason these pages exist at all.
 */
export function ResearchDisclaimer() {
  return (
    <div className="border-b border-amber-deep/20 bg-amber/[0.07]">
      <div className="mx-auto max-w-3xl px-6 py-3 md:px-10">
        <p className="text-[13px] leading-relaxed text-espresso">
          <strong className="font-medium">
            Research and educational purposes only.
          </strong>{" "}
          This library summarises published research and regulatory status. It
          is not medical advice, not a recommendation to use any compound, and
          not a substitute for a licensed professional. Intended for adults.
        </p>
      </div>
    </div>
  );
}
