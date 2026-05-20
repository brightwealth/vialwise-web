import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { VMark } from "./AppIcon";
import { CookiePreferencesLink } from "./CookiePreferencesLink";

export function Footer() {
  return (
    <footer className="border-t border-espresso/[0.08] bg-cream/30">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <VMark size={22} color="#2F5234" />
              <Wordmark size={22} className="text-espresso" />
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-graphite">
              The honest peptide app. Built by someone who actually runs peptides.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Beta", href: "#beta" },
            ]}
          />
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-graphite/80">
              Company
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/about"
                  className="text-[14px] text-espresso transition hover:text-amber-dark"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[14px] text-espresso transition hover:text-amber-dark"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[14px] text-espresso transition hover:text-amber-dark"
                >
                  Terms
                </Link>
              </li>
              <li>
                <CookiePreferencesLink className="text-left text-[14px] text-espresso transition hover:text-amber-dark" />
              </li>
            </ul>
          </div>
          <FooterColumn
            title="Contact"
            links={[
              { label: "support@vialwise.app", href: "mailto:support@vialwise.app" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-espresso/[0.08] pt-6 text-[12.5px] text-graphite/80 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Vialwise. All rights reserved.</p>
          <p className="max-w-xl md:text-right">
            Vialwise is not a medical device, does not diagnose or treat any condition, and does not provide medical advice. Talk to a qualified healthcare provider before making decisions about peptide use.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-graphite/80">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[14px] text-espresso transition hover:text-amber-dark"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
