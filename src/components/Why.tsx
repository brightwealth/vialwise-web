import Link from "next/link";

export function Why() {
  return (
    <section className="relative bg-forest text-bone">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:gap-20 md:px-10 md:py-32">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-bone/60">
            Why we exist
          </p>
          <h2 className="mt-4 text-[36px] font-medium leading-tight tracking-headline md:text-[48px]">
            The honest peptide app.
          </h2>
        </div>

        <div className="flex flex-col gap-6 text-[16px] leading-[1.7] text-bone/85 md:text-[17px]">
          <p>
            Most peptide apps were built by people who don&apos;t actually run peptides. So they ship glossy dashboards, push affiliate links to sketchy vendors, and dress up basic math with AI buzzwords.
          </p>
          <p>
            Vialwise is built by someone who runs them — and got tired of doing reconstitution math in a Notes app while squinting at a u-100 syringe at 6am.
          </p>
          <p>
            No vendor partnerships. No hidden upsells. No medical claims. Just a calculator that&apos;s right, tracking that&apos;s honest, and a price that doesn&apos;t insult you.
          </p>
          <Link
            href="/about"
            className="mt-2 inline-flex w-fit items-center gap-2 text-[15px] font-medium text-bone underline decoration-bone/30 underline-offset-4 transition hover:decoration-bone"
          >
            Read the founder story
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
