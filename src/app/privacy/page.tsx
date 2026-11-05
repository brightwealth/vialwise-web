import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "VialWise Privacy Policy — No Data Sold, Ever",
  },
  description:
    "VialWise does not sell your data. Your protocols, log, and journal stay on your device or in your own private iCloud. Full privacy policy here.",
  ...pageMetadata("https://www.getvialwise.com/privacy"),
};

const LAST_UPDATED = "November 4, 2026";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      intro="Short version: your protocols, log, and journal stay on your device, or in your own private iCloud if you turn on sync. We can't see them. We don't sell your data. This page explains the details."
    >
      <p className="text-[14px] text-graphite">Last updated: {LAST_UPDATED}</p>

      <h2>What we collect</h2>
      <p>
        VialWise is designed to collect as little data as possible. Here is everything we touch:
      </p>
      <ul>
        <li>
          <strong>Protocol, log, and journal data inside the app</strong> — stored on your device. On iPhone and iPad, if you turn on iCloud sync, it also syncs through your own private iCloud. Your device&rsquo;s own backup may also include it. We have no server that receives it and we cannot see it.
        </li>
        <li>
          <strong>Health data</strong> — if you turn on export, the app writes the weight you enter in the journal to your device&rsquo;s health service, such as Apple Health. It does not read your health data.
        </li>
        <li>
          <strong>Purchase status</strong> — VialWise Pro is a one-time in-app purchase handled by the app store you bought from. We use RevenueCat, a purchase-management service, to confirm it. RevenueCat receives your purchase history, an anonymous ID it creates for your install, and device details: make and model, operating system version, app version, language, and store country. On iPhone and iPad it also receives Apple&rsquo;s identifier for vendors. We can see whether an install is Free or Pro, never your payment details.
        </li>
        <li>
          <strong>App updates</strong> — VialWise checks for content and bug-fix updates through Expo, our update provider. Each check sends a random install ID, your platform, and your app&rsquo;s version details. If the app crashed on its last launch, the check also sends the error message, up to about 1,000 characters. We don&rsquo;t use this for advertising.
        </li>
        <li>
          <strong>Label scanning</strong> — other versions of VialWise can read a vial label with your camera. The iPhone and iPad app does not include this. The image is processed on your device and we never receive it. The text-recognition library&rsquo;s maker receives diagnostic and usage data, as its own policy describes: device model, operating system version, app package name and version, a per-install identifier, performance measurements, and library configuration.
        </li>
      </ul>

      <h2>What we don&rsquo;t collect</h2>
      <ul>
        <li>We do not sell, rent, or share your data with advertisers or insurers.</li>
        <li>We do not partner with peptide vendors and do not share user lists with anyone.</li>
        <li>We do not collect biometric identifiers, real-name identity, or government IDs.</li>
        <li>We do not use advertising SDKs inside the VialWise apps, and we added no analytics SDK of our own. Apart from the company that runs your device&rsquo;s platform and app store, RevenueCat and Expo are the only third-party services the apps send data to, plus Google&rsquo;s ML Kit in the Android app&rsquo;s label scanner (see Label scanning above). (This marketing website uses privacy-hardened, consent-gated analytics &mdash; see &ldquo;Website analytics&rdquo; below.)</li>
        <li>We do not read data from your device&rsquo;s health service, and we never send it off your device.</li>
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
        Neither one runs until you choose &ldquo;Accept&rdquo; (or opt in via &ldquo;Customize&rdquo;) on the cookie banner. Choose &ldquo;Reject&rdquo; and no analytics cookies are set and nothing is sent. You can reopen the banner any time from the footer to change your choice. These tools apply to this website only &mdash; they are not part of the VialWise apps.
      </p>

      <h2>How long we keep things</h2>
      <ul>
        <li>
          <strong>In-app data:</strong> stored on your device until you delete the app. iCloud data stays in your own iCloud until you delete it there.
        </li>
        <li>
          <strong>Purchase, update, and scanner diagnostic records:</strong> kept by those services under their own privacy policies.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Regardless of where you live, you can email{" "}
        <a href="mailto:privacy@vialwise.app">privacy@vialwise.app</a> to:
      </p>
      <ul>
        <li>Request a copy of any data we hold about you.</li>
        <li>Request deletion of your data.</li>
      </ul>
      <p>
        We honor GDPR, CCPA, and similar requests within 30 days regardless of your jurisdiction.
      </p>

      <h2>Children</h2>
      <p>
        VialWise is for adults. We do not knowingly collect data from anyone under 18. If you believe a minor has submitted information, contact us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we make material changes, we will update the &ldquo;Last updated&rdquo; date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href="mailto:privacy@vialwise.app">privacy@vialwise.app</a>. We answer.
      </p>

      <hr />

      <p className="text-[13px] text-graphite">
        VialWise is personal tracking and reference software. It is not a medical device, does not diagnose or treat any condition, and does not provide medical advice. See our{" "}
        <Link href="/terms">Terms</Link> for full details.
      </p>
    </PageShell>
  );
}
