import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getEntry, type LibraryEntry } from "@/lib/library";
import { pageMetadata } from "@/lib/metadata";
import { EntryProse, Inline } from "@/components/library/EntryProse";
import { LibraryStoreCta } from "@/components/library/LibraryStoreCta";

const SITE = "https://www.getvialwise.com";

/** Fully static: every entry is prerendered at build, no client fetch. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};

  return {
    // `absolute` so the root layout's "%s — Vialwise" template does not append
    // to an already-complete, search-shaped title.
    title: { absolute: entry.web.title },
    description: entry.web.description,
    keywords: [entry.name, ...(entry.aliases ?? [])],
    ...pageMetadata(entry.web.url),
  };
}

/**
 * JSON-LD for an entry.
 *
 * DELIBERATELY NOT `Drug` OR `MedicalEntity`. schema.org defines `Drug` as
 * "a chemical or biologic substance, used as a medical therapy" — asserting
 * that for a compound with no approved therapeutic use (BPC-157, retatrutide)
 * would be factually false, and would state in machine-readable form the exact
 * positioning the research-and-educational framing denies. `MedicalWebPage` is
 * milder but still declares medical content and earns no rich result, so it
 * buys nothing in exchange for the same representation problem.
 *
 * `Article` + a plain `Thing` is accurate: this page IS an article about a
 * compound. `isAccessibleForFree` and the `about.alternateName` list are the
 * parts search engines actually use.
 */
function structuredData(entry: LibraryEntry) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${entry.web.url}#article`,
        headline: entry.web.title,
        description: entry.web.description,
        url: entry.web.url,
        dateModified: entry.lastUpdated,
        inLanguage: "en",
        isAccessibleForFree: true,
        author: { "@type": "Organization", name: "VialWise" },
        publisher: {
          "@type": "Organization",
          name: "VialWise",
          url: SITE,
        },
        about: {
          "@type": "Thing",
          name: entry.name,
          alternateName: entry.aliases ?? [],
          description: entry.category,
        },
        citation: (entry.citations ?? []).map((c) => ({
          "@type": "CreativeWork",
          name: c.reference,
          ...(c.primaryUrl ? { url: c.primaryUrl } : {}),
          ...(c.identifierLabel ? { identifier: c.identifierLabel } : {}),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Library", item: `${SITE}/library` },
          { "@type": "ListItem", position: 2, name: entry.name, item: entry.web.url },
        ],
      },
    ],
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-[24px] font-medium tracking-display text-espresso">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function PeptideEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const b = entry.beginner;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(entry)) }}
      />

      <section className="border-b border-espresso/[0.06] bg-cream/40">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-amber-deep">
            <Link href="/library" className="no-underline hover:underline">
              Library
            </Link>
          </p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.05] tracking-display text-espresso md:text-[52px]">
            {entry.name}
          </h1>
          <p className="mt-4 text-[16px] text-graphite">{entry.category}</p>
          {entry.aliases?.length ? (
            <p className="mt-2 text-[14px] text-graphite">
              Also known as: {entry.aliases.join(", ")}
            </p>
          ) : null}
          {b?.evidenceLevel ? (
            <p className="mt-4 inline-block rounded-full border border-espresso/15 px-3 py-1 text-[13px] text-espresso">
              Evidence level: <Inline text={b.evidenceLevel} />
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <div className="prose-vialwise">
          {b?.summary ? (
            <Section title="What it is">
              <EntryProse text={b.summary} />
            </Section>
          ) : null}

          {b?.researchFindings ? (
            <Section title="What the research found">
              <EntryProse text={b.researchFindings} />
            </Section>
          ) : null}

          {/* Status carries the approval SCOPE and per-formulation qualifiers.
              Rendered in full — a summarised approval scope is a wrong one. */}
          <Section title="Status and regulatory position">
            <EntryProse text={entry.status} />
          </Section>

          {b?.safetyBasics ? (
            <Section title="Safety">
              <EntryProse text={b.safetyBasics} />
            </Section>
          ) : null}

          {entry.disclosures?.length ? (
            <Section title="Disclosures">
              {entry.disclosures.map((d, i) => (
                <EntryProse key={i} text={d} />
              ))}
            </Section>
          ) : null}

          {entry.quickReference?.length ? (
            <Section title="Quick reference">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[15px]">
                  <tbody>
                    {entry.quickReference.map((row, i) => (
                      <tr key={i} className="border-b border-espresso/10 align-top">
                        <th className="py-2 pr-4 text-left font-medium text-espresso">
                          <Inline text={row.label} />
                        </th>
                        <td className="py-2 text-graphite"><Inline text={row.value} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          ) : null}

          {entry.about?.length ? (
            <Section title="In depth">
              {entry.about.map((p, i) => (
                <EntryProse key={i} text={p} />
              ))}
            </Section>
          ) : null}

          {entry.sideEffects?.common?.length || entry.sideEffects?.serious?.length ? (
            <Section title="Reported side effects">
              {entry.sideEffects?.common?.length ? (
                <>
                  <h3>Commonly reported</h3>
                  <ul>
                    {entry.sideEffects.common.map((s, i) => (
                      <li key={i}><Inline text={s} /></li>
                    ))}
                  </ul>
                </>
              ) : null}
              {entry.sideEffects?.serious?.length ? (
                <>
                  <h3>Serious</h3>
                  <ul>
                    {entry.sideEffects.serious.map((s, i) => (
                      <li key={i}><Inline text={s} /></li>
                    ))}
                  </ul>
                </>
              ) : null}
            </Section>
          ) : null}

          {entry.contraindications?.length ? (
            <Section title="Contraindications and warnings">
              {entry.contraindications.map((c, i) => (
                <EntryProse key={i} text={c} />
              ))}
            </Section>
          ) : null}

          {b?.keyTerms?.length ? (
            <Section title="Key terms">
              <dl>
                {b.keyTerms.map((t, i) => (
                  <div key={i} className="mt-3">
                    <dt className="font-medium text-espresso"><Inline text={t.term} /></dt>
                    <dd className="mt-1 text-graphite"><Inline text={t.definition} /></dd>
                  </div>
                ))}
              </dl>
            </Section>
          ) : null}

          {entry.citations?.length ? (
            <Section title="Sources">
              <ol className="text-[15px]">
                {entry.citations.map((c) => (
                  <li key={c.index} className="mt-3 text-graphite">
                    {c.primaryUrl ? (
                      <a href={c.primaryUrl} rel="nofollow noopener">
                        <Inline text={c.reference} />
                      </a>
                    ) : (
                      c.reference
                    )}
                    {c.identifierLabel ? (
                      <span className="ml-1 text-espresso/70">
                        ({c.identifierLabel})
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {entry.web.related.length ? (
            <Section title="Related entries">
              <ul className="list-none pl-0">
                {entry.web.related.map((r) => (
                  <li key={r.slug} className="mt-2">
                    <Link href={`/library/${r.slug}`}>{r.name}</Link>
                    <span className="text-graphite"> — <Inline text={r.reason} /></span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <p className="mt-12 text-[13px] text-graphite">
            Entry last updated {entry.lastUpdated}. Sourced from published
            literature and regulatory labelling; see Sources above.
          </p>
        </div>

        <LibraryStoreCta peptideName={entry.name} />
      </div>
    </>
  );
}
