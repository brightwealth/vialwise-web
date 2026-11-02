"use client";

import { FAQS } from "@/lib/faq";

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <div className="text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-dark">
          Questions
        </p>
        <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline text-espresso md:text-[44px]">
          Honest answers.
        </h2>
      </div>

      <div className="mt-12 divide-y divide-espresso/[0.08] border-y border-espresso/[0.08]">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
              <h3 className="text-[16.5px] font-medium leading-snug tracking-tight text-espresso md:text-[18px]">
                {item.q}
              </h3>
              <span
                aria-hidden
                className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-espresso/15 text-espresso transition group-open:rotate-45"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 pr-10 text-[15px] leading-relaxed text-graphite md:text-[15.5px]">
              {item.a}
            </p>
            {item.link ? (
              <a
                href={item.link.href}
                target="_blank"
                rel="noopener"
                className="mt-2 inline-flex items-center gap-1 text-[15px] font-medium text-forest underline-offset-4 hover:underline"
              >
                {item.link.label}
                <span aria-hidden>→</span>
              </a>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}
