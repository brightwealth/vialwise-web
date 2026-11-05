import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise Support",
  },
  description: "How to reach VialWise with a question, a bug, or a wrong citation.",
  ...pageMetadata("https://www.getvialwise.com/support"),
};

export default function SupportPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Support"
      intro="Questions, bugs, or a wrong citation: email support@vialwise.app."
    >
      <p>
        Email <a href="mailto:support@vialwise.app">support@vialwise.app</a>. We usually reply within a few business days.
      </p>
      <p>
        Privacy questions: <a href="mailto:privacy@vialwise.app">privacy@vialwise.app</a>.
      </p>
      <hr />
      <p className="text-[13px] text-graphite">
        See also our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms</Link>.
      </p>
    </PageShell>
  );
}
