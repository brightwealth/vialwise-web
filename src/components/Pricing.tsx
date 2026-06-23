import { AppStoreBadge } from "./AppStoreBadge";

const ALL_FEATURES = [
  "Reconstitution & dose calculator",
  "Track 1 peptide",
  "Reconstitution date tracking",
  "Half-life chart preview",
  "All future calc improvements",
];

// Live, shipped-today Pro features. Pro (v1.6) is a one-time purchase whose
// only entitlement gate is unlimited saved protocols (see the app's
// src/entitlements/freeTier.ts — protocol count is the sole gated capability).
// Scheduled reminders shipped in v1.1. Half-life charts are FREE for everyone,
// so they are not listed here as a Pro upsell.
const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited peptides & protocols",
  "Scheduled reminders",
];

// Not yet shipped — folds into the same one-time Pro unlock at v2.0. Shown as a
// clearly-labeled "coming to Pro" sub-list with NO dates, so the card never
// claims an unbuilt feature is available today.
const PRO_COMING_SOON = [
  "Inventory & vial tracking",
  "Protocol PDF export",
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
          Pro unlocks unlimited protocols. Everyone gets full access to the library. No trials that auto-bill, no surprise tier changes, no &quot;7-day money back&quot; runaround.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <PricingCard
          name="Free"
          price="$0"
          cadence="forever"
          summary="The calculator, plus tracking for your first peptide."
          features={ALL_FEATURES}
          tone="cream"
          cta={<AppStoreBadge height={48} />}
        />
        <PricingCard
          name="Pro"
          price="$44.99"
          cadence="one-time"
          summary="Unlimited peptides and protocols, plus scheduled reminders. One payment, no subscription."
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
        <span className={`text-[14px] ${isForest ? "text-bone/70" : "text-graphite"}`}>
          {cadence}
        </span>
      </div>
      <p className={`mt-5 text-[15px] leading-relaxed ${isForest ? "text-bone/85" : "text-graphite"}`}>
        {summary}
      </p>

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

      {comingSoon && comingSoon.length > 0 ? (
        <div className="mt-6">
          <p
            className={`text-[12px] font-medium uppercase tracking-[0.14em] ${
              isForest ? "text-bone/80" : "text-graphite"
            }`}
          >
            Coming to Pro
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {comingSoon.map((f) => (
              <li
                key={f}
                className={`flex items-start gap-3 text-[14px] leading-relaxed ${
                  isForest ? "text-bone/80" : "text-graphite"
                }`}
              >
                <PlusIcon className={isForest ? "text-bone/80" : "text-graphite"} />
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
