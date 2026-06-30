import { AppStoreBadge } from "./AppStoreBadge";

// Free tier — the full calculator and the cited library, plus tracking for a
// first protocol. Free forever, even after a Pro purchase. The only entitlement
// gate is saved-protocol count (see the app's src/entitlements/freeTier.ts —
// protocol count is the sole gated capability), so reminders and the half-life
// charts are free for everyone.
const FREE_FEATURES = [
  "Forward + reverse calculator",
  "69-peptide cited library",
  "Track your first protocol",
  "Scheduled dose reminders",
  "Half-life decay charts",
];

// Pro — the full tracking suite, live on the App Store as of the v2.0 launch.
// One-time purchase, no subscription. Everything listed here is shipped today.
// "Unlimited saved protocols" leads: free saves one protocol, Pro saves
// unlimited, so it is the headline Pro benefit.
const PRO_FEATURES = [
  "Unlimited saved protocols",
  "Everything in Free",
  "Dose log & history",
  "Body map & site rotation",
  "Weekly recap",
  "Vial inventory & days of supply",
  "BID / TID dosing",
  "Protocol PDF export",
];

// Genuinely unshipped — teased as "coming," never listed alongside the live Pro
// features above. No dates, no version numbers. Rendered in a visually distinct
// "Coming to Pro" sub-list (muted text + divider + plus icons) so nothing here
// reads as already available. The single-dose half-life chart is FREE today
// (see FREE_FEATURES); the multi-dose accumulation view is the unshipped item.
const PRO_COMING_SOON = [
  "Multi-dose half-life charts (steady-state view)",
  "Pro-only Discord community",
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-dark">
          Pricing
        </p>
        <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline text-espresso md:text-[48px]">
          Free for one peptide. Forever.
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
          Free saves one protocol. Pro saves unlimited and unlocks the full tracking suite. Everyone gets the calculator and the cited library. No trials that auto-bill, no surprise tier changes, no &quot;7-day money back&quot; runaround.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <PricingCard
          name="Free"
          price="$0"
          cadence="forever"
          summary="The full forward and reverse calculator, the 69-peptide cited library, and tracking for your first protocol."
          features={FREE_FEATURES}
          tone="cream"
          cta={<AppStoreBadge height={48} />}
        />
        <PricingCard
          name="Pro"
          price="$44.99"
          cadence="one-time"
          summary="Unlimited saved protocols, plus the full tracking suite: dose log, body map, weekly recap, vial inventory, BID/TID, and PDF export. One payment, no subscription."
          note="Founder price — locked in now. It goes up as more features ship."
          features={PRO_FEATURES}
          comingSoon={PRO_COMING_SOON}
          tone="forest"
          cta={<AppStoreBadge height={48} />}
        />
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-[13px] leading-relaxed text-graphite">
        Pro is a one-time purchase, unlocked inside the app. Everyone gets the full calculator and the peptide library, free, today.
      </p>
    </section>
  );
}

type PricingCardProps = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  note?: string;
  features: string[];
  comingSoon?: string[];
  tone: "cream" | "forest";
  badge?: string;
  cta: React.ReactNode;
};

function PricingCard({
  name,
  price,
  cadence,
  summary,
  note,
  features,
  comingSoon,
  tone,
  badge,
  cta,
}: PricingCardProps) {
  const isForest = tone === "forest";

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl p-8 md:p-10 ${
        isForest
          ? "bg-forest text-bone"
          : "border border-espresso/[0.08] bg-cream/40 text-espresso"
      }`}
    >
      {badge ? (
        <span className="absolute -top-3 right-6 rounded-full bg-amber-dark px-3 py-1 text-[11px] font-medium tracking-tight text-bone shadow-sm">
          {badge}
        </span>
      ) : null}

      <div className="flex items-baseline justify-between">
        <h3 className={`text-[20px] font-medium tracking-tight ${isForest ? "text-bone" : "text-espresso"}`}>
          {name}
        </h3>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[44px] font-medium leading-none tracking-display">
          {price}
        </span>
        <span className={`text-[14px] ${isForest ? "text-bone" : "text-graphite"}`}>
          {cadence}
        </span>
      </div>
      <p className={`mt-5 text-[15px] leading-relaxed ${isForest ? "text-bone/85" : "text-graphite"}`}>
        {summary}
      </p>

      {note ? (
        <p
          className={`mt-3 text-[12.5px] font-medium leading-relaxed ${
            isForest ? "text-bone" : "text-graphite"
          }`}
        >
          {note}
        </p>
      ) : null}

      <ul className="mt-7 flex flex-col gap-3">
        {features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-3 text-[14.5px] leading-relaxed ${
              isForest ? "text-bone/90" : "text-espresso"
            }`}
          >
            <CheckIcon
              className={isForest ? "text-amber-light" : "text-forest"}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Coming-to-Pro teaser — genuinely unshipped items only. Visually distinct
          from the live feature list above (divider + muted text + plus icons +
          "Coming to Pro" label) so nothing reads as already available. */}
      {comingSoon && comingSoon.length > 0 ? (
        <div className={`mt-6 border-t pt-5 ${isForest ? "border-bone/15" : "border-espresso/10"}`}>
          <p
            className={`text-[12px] font-medium uppercase tracking-[0.14em] ${
              isForest ? "text-bone/70" : "text-graphite"
            }`}
          >
            Coming to Pro
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {comingSoon.map((f) => (
              <li
                key={f}
                className={`flex items-start gap-3 text-[14px] leading-relaxed ${
                  isForest ? "text-bone/60" : "text-graphite"
                }`}
              >
                <PlusIcon className={isForest ? "text-bone/60" : "text-graphite"} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8">{cta}</div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`mt-0.5 shrink-0 ${className ?? ""}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`mt-0.5 shrink-0 ${className ?? ""}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
