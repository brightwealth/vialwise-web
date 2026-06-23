import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="border-b border-espresso/[0.06] bg-cream/40">
          <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
            {eyebrow ? (
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-deep">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[56px]">
              {title}
            </h1>
            {intro ? (
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-graphite md:text-[18px]">
                {intro}
              </p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-16 md:px-10 md:py-24">
          <div className="prose-vialwise">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
