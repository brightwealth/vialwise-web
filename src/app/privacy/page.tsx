import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise Privacy Policy — No Data Sold, Ever",
  },
  description:
    "VialWise does not sell your data, share protocols, or store personal health information. Your research stays on your device. Full privacy policy here.",
  alternates: {
    canonical: "https://www.getvialwise.com/privacy",
  },
};

const LAST_UPDATED = "May 3, 2026";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      intro="Short version: your peptide and health data stays on your device. We don't sell it. We don't share it. This page explains the details."
    >
      <p className="text-[14px] text-graphite/70">Last updated: {LAST_UPDATED}</p>

      <h2>What we collect</h2>
      <p>
        Vialwise is designed to collect as little data as possible. Here is everything we touch:
      </p>
      <ul>
        <li>
          <strong>Email address</strong> — only if you join the launch waitlist on this website. Used solely to email you when v1 launches and for occasional product updates. You can unsubscribe at any time.
        </li>
        <li>
          <strong>Peptide and dose data inside the app</strong> — stored locally on your device only in v1. Vialwise does not transmit this data to any server.
        </li>
        <li>
          <strong>Apple Health data (v2.5+)</strong> — when enabled, weight and body-composition data is read from HealthKit on your device. Raw HealthKit data never leaves your phone.
        </li>
        <li>
          <strong>Subscription status (v2.0+)</strong> — managed by Apple via App Store In-App Purchases. We see whether your account is Free or Pro, not your payment details.
        </li>
      </ul>

      <h2>What we don&rsquo;t collect</h2>
      <ul>
        <li>We do not sell, rent, or share your data with advertisers or insurers.</li>
        <li>We do not partner with peptide vendors and do not share user lists with anyone.</li>
        <li>We do not collect biometric identifiers, real-name identity, or government IDs.</li>
        <li>We do not use third-party analytics providers inside the Vialwise iOS app. (This marketing website uses privacy-hardened, consent-gated analytics &mdash; see &ldquo;Website analytics&rdquo; below.)</li>
        <li>We do not transmit raw Apple Health data off your device, ever.</li>
      </ul>

      <h2>Website analytics (getvialwise.com)</h2>
      <p>
        This marketing website uses two privacy-hardened analytics tools, and only after you accept them on the cookie banner:
      </p>
      <ul>
        <li>
          <strong>Google Analytics 4</strong> &mdash; aggregate, measurement-only traffic statistics. We disable Google Signals and ad personalization, so there is no cross-site advertising profile and no signed-in-account integration.
        </li>
        <li>
          <strong>Microsoft Clarity</strong> &mdash; anonymized, aggregate usage insights (for example, which pages get read).
        </li>
      </ul>
      <p>
        Neither one runs until you choose &ldquo;Accept&rdquo; (or opt in via &ldquo;Customize&rdquo;) on the cookie banner. Choose &ldquo;Reject&rdquo; and no analytics cookies are set and nothing is sent. You can reopen the banner any time from the footer to change your choice. These tools apply to this website only &mdash; they are not part of the iOS app, which keeps your peptide and dose data on your device.
      </p>

      <h2>How long we keep things</h2>
      <ul>
        <li>
          <strong>Email waitlist:</strong> until you unsubscribe, or until 12 months after launch with no activity, whichever comes first.
        </li>
        <li>
          <strong>In-app data:</strong> stored on your device until you delete the app. Cloud-synced data (v2+) is deleted within 30 days of account deletion.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Regardless of where you live, you can email{" "}
        <a href="mailto:privacy@vialwise.app">privacy@vialwise.app</a> to:
      </p>
      <ul>
        <li>Request a copy of any data tied to your email address.</li>
        <li>Request deletion of your data.</li>
        <li>Opt out of all marketing email.</li>
      </ul>
      <p>
        We honor GDPR, CCPA, and similar requests within 30 days regardless of your jurisdiction.
      </p>

      <h2>Children</h2>
      <p>
        Vialwise is for adults. We do not knowingly collect data from anyone under 18. If you believe a minor has submitted information, contact us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we make material changes, we will update the &ldquo;Last updated&rdquo; date at the top of this page and, if you&rsquo;re on the waitlist, email you a summary of what changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:privacy@vialwise.app">privacy@vialwise.app</a>. We answer.
      </p>

      <hr />

      <p className="text-[13px] text-graphite/70">
        Vialwise is a software calculator and tracker. It is not a medical device, does not diagnose or treat any condition, and does not provide medical advice. See our{" "}
        <Link href="/terms">Terms</Link> for full details.
      </p>
    </PageShell>
  );
}
