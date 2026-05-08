import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of Vialwise.",
};

const LAST_UPDATED = "May 3, 2026";

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service"
      intro="The legal terms governing your use of Vialwise. Plain English where possible."
    >
      <p className="text-[14px] text-graphite/70">Last updated: {LAST_UPDATED}</p>

      <h2>1. What Vialwise is</h2>
      <p>
        Vialwise is a software calculator and tracker for personal use. It performs reconstitution math and helps you organize information about peptides you have already independently chosen to use.
      </p>

      <h2>2. What Vialwise is not</h2>
      <p>
        Vialwise is <strong>not</strong> a medical device. It does not diagnose, treat, cure, or prevent any disease. It does not provide medical advice. It does not recommend specific peptides, doses, or protocols. Any information shown in the app is for organizational purposes only.
      </p>
      <p>
        Always consult a qualified healthcare provider before starting, modifying, or stopping any peptide use.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old to use Vialwise. By using the app, you represent that you are.
      </p>

      <h2>4. Your responsibilities</h2>
      <ul>
        <li>You are responsible for verifying any calculation result before using it.</li>
        <li>You are responsible for the legality of your peptide use in your jurisdiction.</li>
        <li>You are responsible for keeping your device and account secure.</li>
      </ul>

      <h2>5. Subscriptions (v2.0+)</h2>
      <p>
        Pro subscriptions are processed by Apple via App Store In-App Purchases. Pricing, billing, refunds, and cancellations are governed by Apple&rsquo;s standard terms. You can cancel any time from your Apple ID settings.
      </p>

      <h2>6. Acceptable use</h2>
      <p>
        Don&rsquo;t reverse-engineer the app, scrape it, abuse our infrastructure, or use Vialwise to harm others. We reserve the right to terminate access for misuse.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Vialwise and its operators are not liable for any indirect, incidental, or consequential damages arising from your use of the app, including but not limited to health outcomes resulting from peptide use.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these terms. If we do, we&rsquo;ll update the &ldquo;Last updated&rdquo; date and, for material changes, notify you in-app or by email.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:support@vialwise.com">support@vialwise.com</a>.
      </p>

      <hr />

      <p className="text-[13px] text-graphite/70">
        See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </PageShell>
  );
}
