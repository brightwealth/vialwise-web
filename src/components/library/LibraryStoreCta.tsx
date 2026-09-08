/**
 * App-install CTA for library pages, carrying the `web-library` campaign token.
 *
 * ⚠️ ATTRIBUTION IS THE POINT — do not swap this for the shared <StoreBadges />.
 * Those render bare store URLs with no campaign token, so installs from them
 * are indistinguishable from organic App Store Search. Ninety days of Instagram
 * already produced campaign data we cannot read; a second unmeasurable channel
 * is not worth shipping.
 *
 * Tokens are registered in docs/marketing/campaign-links.md (`web-library`).
 * Apple suppresses a campaign until 5 distinct Apple Accounts install through
 * it, so expect a blank Campaigns page before the traffic exists — that is
 * suppression, not zero.
 */
const APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6774017323?pt=128963457&ct=web-library&mt=8";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.vialwise.app" +
  "&referrer=utm_source%3Dgetvialwise%26utm_medium%3Dreferral%26utm_campaign%3Dweb-library";

export function LibraryStoreCta({ peptideName }: { peptideName: string }) {
  return (
    <aside className="mt-16 rounded-lg border border-espresso/10 bg-cream/50 p-6">
      <p className="text-[15px] leading-relaxed text-espresso">
        The full {peptideName} entry — with the reconstitution calculator, dose
        logging and every citation — is in the VialWise app.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={APP_STORE_URL}
          className="rounded-md bg-espresso px-4 py-2 text-[14px] font-medium text-bone no-underline transition-colors hover:bg-amber-deep"
        >
          Download on the App Store
        </a>
        <a
          href={GOOGLE_PLAY_URL}
          className="rounded-md border border-espresso/20 px-4 py-2 text-[14px] font-medium text-espresso no-underline transition-colors hover:border-amber-deep hover:text-amber-deep"
        >
          Get it on Google Play
        </a>
      </div>
    </aside>
  );
}
