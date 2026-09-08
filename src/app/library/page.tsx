import type { Metadata } from "next";
import Link from "next/link";
import { getAllEntries } from "@/lib/library";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "Peptide Library — what each compound does, with citations",
  },
  description:
    "Plain-language entries on peptides and related compounds: what each one is, what the research actually shows, regulatory status, and safety — every claim cited to primary sources.",
  ...pageMetadata("https://www.getvialwise.com/library"),
};

export default function LibraryIndexPage() {
  const entries = getAllEntries();

  return (
    <>
      <section className="border-b border-espresso/[0.06] bg-cream/40">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-deep">
            Library
          </p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
            The peptide library.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-graphite md:text-[18px]">
            What each compound is, what the research actually found, where it
            stands with regulators, and what the safety picture looks like. Every
            entry is written from primary sources and says plainly where the
            evidence runs out.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <ul className="space-y-4 list-none pl-0">
          {entries.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/library/${e.slug}`}
                className="block rounded-lg border border-espresso/10 p-5 no-underline transition-colors hover:border-amber-deep/40 hover:bg-cream/40"
              >
                <span className="block text-[19px] font-medium text-espresso">
                  {e.name}
                </span>
                <span className="mt-1 block text-[14px] text-amber-deep">
                  {e.category}
                </span>
                <span className="mt-2 block text-[15px] leading-relaxed text-graphite">
                  {e.web.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
