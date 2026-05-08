import type { Metadata } from "next";
import { NumericFeelDemo } from "./demo";

export const metadata: Metadata = {
  title: "Numeric feel preview",
  description:
    "Side-by-side: today vs. tabular nums + value fade-on-change.",
  robots: { index: false, follow: false },
};

export default function NumericFeelPreviewPage() {
  return (
    <main className="min-h-screen bg-bone py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-amber-dark">
            Internal preview · #4 — tabular nums + fade-on-change
          </p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
            Numeric feel.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
            Tap the buttons below to change the input values. Watch the result numbers on each side. The proposed version uses tabular figures (no horizontal jitter) and fades the new value up as the old one fades out.
          </p>
        </header>

        <NumericFeelDemo />

        <footer className="mx-auto mt-20 max-w-2xl text-center text-[13px] text-graphite/70">
          Reply with &ldquo;ship #4&rdquo; and I&rsquo;ll wire tabular nums and fade-on-change into the result panel.
        </footer>
      </div>
    </main>
  );
}
