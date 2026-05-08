import type { Metadata } from "next";
import {
  VialCurrent,
  VialTallLyo,
  VialSquatMulti,
  VialAndSyringe,
  VialDroplet,
  VMonogram,
} from "./variants";

export const metadata: Metadata = {
  title: "Vial illustration variants",
  description:
    "Side-by-side comparison of empty-state vial illustrations for the Vialwise Home screen.",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    id: 1,
    name: "Current",
    tag: "Stocky vial · V-on-amber",
    note: "Today's baseline. Compact, brand-aligned, V monogram clearly visible. Good but a little generic.",
    Component: VialCurrent,
  },
  {
    id: 2,
    name: "Tall lyo vial",
    tag: "Realistic research-peptide vial",
    note: "Tall, slender profile with a visible lyophilized cake at the bottom and an amber-bordered label band. Reads as 'this is the actual thing in your fridge.' Most realistic of the bunch.",
    Component: VialTallLyo,
  },
  {
    id: 3,
    name: "Squat multidose",
    tag: "Wide compounding-pharmacy vial",
    note: "Shorter, wider profile — the multidose vial shape compounding pharmacies use. Amber liquid fills more of the body. Feels more 'pre-mixed and ready.'",
    Component: VialSquatMulti,
  },
  {
    id: 4,
    name: "Vial + syringe",
    tag: "Duo · ready to draw",
    note: "Vial on the left, U-100 syringe on the right with amber fluid drawn. Tells the story: vial → syringe → injection. Most action-oriented but visually busier.",
    Component: VialAndSyringe,
  },
  {
    id: 5,
    name: "Reconstitution moment",
    tag: "Open vial + water droplet",
    note: "Cap removed, BAC-water droplet about to fall in. Captures the specific moment Vialwise is about — the calculator's whole reason for existing. Most narrative.",
    Component: VialDroplet,
  },
  {
    id: 6,
    name: "V monogram",
    tag: "Minimal brand mark · no vial",
    note: "Just the V in a forest-outlined cream circle. Pure brand. Cleanest, most timeless, but loses the 'vial' specificity.",
    Component: VMonogram,
  },
] as const;

export default function VialsPreviewPage() {
  return (
    <main className="min-h-screen bg-bone py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-amber-dark">
            Internal preview · not linked from nav
          </p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
            Vial variations.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
            Six options for the Home empty-state illustration, all rendered in the actual context. Tell me which one (or which hybrid) and I&rsquo;ll port it into the app.
          </p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {VARIANTS.map((v) => (
            <section key={v.id} className="flex flex-col gap-5">
              <header className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-graphite/70">
                  Variant {v.id}
                </span>
                <h2 className="text-[22px] font-medium leading-snug tracking-tight text-espresso">
                  {v.name}
                </h2>
                <p className="text-[13px] font-medium text-amber-dark">
                  {v.tag}
                </p>
              </header>

              <div className="flex justify-center">
                <PhoneFrame>
                  <EmptyStateMock>
                    <v.Component size={104} />
                  </EmptyStateMock>
                </PhoneFrame>
              </div>

              <p className="text-[13.5px] leading-relaxed text-graphite">
                {v.note}
              </p>
            </section>
          ))}
        </div>

        <footer className="mx-auto mt-20 max-w-2xl text-center text-[13px] text-graphite/70">
          When you pick: tell me &ldquo;go with variant N&rdquo; (or &ldquo;mix 5&rsquo;s droplet with 2&rsquo;s tall body&rdquo;) and I&rsquo;ll wire it into the Expo app&rsquo;s ClosedVial component.
        </footer>
      </div>
    </main>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[44px] border border-espresso/15 bg-espresso shadow-[0_30px_70px_-20px_rgba(45,38,32,0.35)]"
      style={{ width: 300, height: 540, padding: 6 }}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-22 -translate-x-1/2 rounded-full bg-espresso" />
      <div
        className="relative h-full w-full overflow-hidden rounded-[38px] bg-bone"
        style={{ isolation: "isolate" }}
      >
        {children}
      </div>
    </div>
  );
}

function EmptyStateMock({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-amber-dark px-4 pt-5 pb-2 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-bone">
          Research and educational only · Start with the calculator below
        </p>
      </div>
      <div className="px-4 pt-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-graphite/70">
          Today
        </p>
        <h3 className="mt-1 text-[18px] font-medium tracking-tight text-espresso">
          Wednesday, May 6
        </h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-start pt-12">
        <div className="flex h-32 items-center justify-center">{children}</div>
        <h4 className="mt-5 text-[19px] font-medium tracking-tight text-espresso">
          Pour the first one.
        </h4>
        <p className="mt-1 text-[12px] text-graphite">
          Calculator → Protocol takes 30 seconds.
        </p>
        <div className="mt-5 inline-flex items-center justify-center rounded-full bg-forest px-5 py-2 text-[13px] font-medium text-bone">
          Open the calculator
        </div>
      </div>
      <div className="border-t border-espresso/[0.08] bg-bone py-2 text-center">
        <p className="text-[9px] uppercase tracking-[0.14em] text-graphite/60">
          Home · Protocols · Calculator · Library
        </p>
      </div>
    </div>
  );
}
