import type { Metadata } from "next";
import {
  EarthyBlockMock,
  CardTintMock,
  HeroNumberMock,
  EditorialWarmthMock,
} from "./mocks";

export const metadata: Metadata = {
  title: "Theme variations preview",
  description: "Side-by-side mockups of four color directions for the Vialwise app.",
  robots: { index: false, follow: false },
};

const VARIATIONS = [
  {
    id: 1,
    name: "Earthy Block",
    tagline: "Saturated zones — recommended starting point",
    inspo: "AG1, Levels, Eight Sleep",
    description:
      "Three saturated zones per screen. Top strip in amber, result panel in forest, espresso CTA at the bottom. Eye lands on the result first because it's the largest color block.",
    Mock: EarthyBlockMock,
  },
  {
    id: 2,
    name: "Card Tint",
    tagline: "Lightest touch — App-Store-safe",
    inspo: "MyFitnessPal Premium, modern Apple Health",
    description:
      "Each card type gets a faint tint. Inputs cream, result sage, library soft amber. The answer number renders in forest. Very subtle — same warmth as today, just slightly more rooms.",
    Mock: CardTintMock,
  },
  {
    id: 3,
    name: "Hero Number",
    tagline: "Calculator-app classic — the answer is the design",
    inspo: "PepTracker, Whoop, dose calculators",
    description:
      "Result section dominates. Draw on U-100 number renders huge in amber. Inputs shrink, the visual syringe gets an amber border, and the eye is forced to the answer.",
    Mock: HeroNumberMock,
  },
  {
    id: 4,
    name: "Editorial Warmth",
    tagline: "Boldest — looks like a designer touched it",
    inspo: "Notion mobile, Linear iOS, NYT Cooking",
    description:
      "Forest header band on every screen, magazine-style. Borderless cards, big typography hierarchy, amber hairline dividers. Distinctive and brandable but the most opinionated.",
    Mock: EditorialWarmthMock,
  },
] as const;

export default function ThemesPreviewPage() {
  return (
    <main className="min-h-screen bg-bone py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-amber-dark">
            Internal preview · not linked from nav
          </p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
            Color variations.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
            Four directions for adding color to the Vialwise app, each anchored in how real peptide and health apps use color. Same calculator screen, four different personalities. Pick one and we&rsquo;ll wire it into the Expo app.
          </p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 xl:grid-cols-4 xl:gap-8">
          {VARIATIONS.map((v) => (
            <section key={v.id} className="flex flex-col gap-5">
              <header className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-graphite/70">
                  Variation {v.id}
                </span>
                <h2 className="text-[24px] font-medium leading-snug tracking-tight text-espresso">
                  {v.name}
                </h2>
                <p className="text-[13px] font-medium text-amber-dark">
                  {v.tagline}
                </p>
                <p className="text-[12px] text-graphite/80">
                  Inspired by {v.inspo}
                </p>
              </header>

              <div className="flex justify-center">
                <PhoneFrame>
                  <v.Mock />
                </PhoneFrame>
              </div>

              <p className="text-[13.5px] leading-relaxed text-graphite">
                {v.description}
              </p>
            </section>
          ))}
        </div>

        <footer className="mx-auto mt-20 max-w-2xl text-center text-[13px] text-graphite/70">
          When you pick one, tell me &ldquo;go with Variation N&rdquo; and I&rsquo;ll wire it into the Expo app. We can also mix elements — e.g. start with Variation 1 and layer in the Hero Number treatment from Variation 3.
        </footer>
      </div>
    </main>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[44px] border border-espresso/15 bg-espresso shadow-[0_30px_70px_-20px_rgba(45,38,32,0.35)]"
      style={{ width: 320, height: 660, padding: 6 }}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-espresso" />
      <div
        className="relative h-full w-full overflow-hidden rounded-[38px]"
        style={{ isolation: "isolate" }}
      >
        {children}
      </div>
    </div>
  );
}
