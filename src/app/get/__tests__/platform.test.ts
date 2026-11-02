/**
 * /get — the social bio-link redirect. page.tsx redirects to whatever
 * mobileDestination returns, so this pins the destination per device and per
 * state of IOS_STORE_LIVE. (The status code, 307 from Next's redirect(), and the
 * no-store header are checked end to end against a running build.)
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { HOME_URL, IOS_STORE_LIVE } from "@/lib/storeLinks";

import {
  appStoreUrl,
  iosFallbackUrl,
  mobileDestination,
  serverPlatformFromUserAgent,
} from "../platform";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";

describe("/get destinations", () => {
  it("reads the platform from the User-Agent", () => {
    assert.equal(serverPlatformFromUserAgent(IPHONE), "ios");
    assert.equal(serverPlatformFromUserAgent(ANDROID), "android");
    assert.equal(serverPlatformFromUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)"), "unknown");
  });

  it("sends an iPhone to the homepage, tagged with the src, while the switch is off", () => {
    const expected = IOS_STORE_LIVE
      ? "https://apps.apple.com/app/apple-store/id6774017323?pt=128963457&ct=ig-bio&mt=8"
      : `${HOME_URL}?utm_source=ig-bio&utm_medium=social&utm_campaign=ig-bio`;
    assert.equal(mobileDestination("ios", "ig-bio"), expected);
  });

  it("restores the tagged App Store URL when the switch is on", () => {
    assert.equal(
      mobileDestination("ios", "ig-bio", true),
      "https://apps.apple.com/app/apple-store/id6774017323?pt=128963457&ct=ig-bio&mt=8",
    );
  });

  it("sends Android to Google Play with the src in the referrer", () => {
    const location = mobileDestination("android", "ig-bio") ?? "";
    assert.match(location, /^https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.vialwise\.app&referrer=/);
    assert.match(decodeURIComponent(location), /utm_source=ig-bio&utm_medium=social&utm_campaign=ig-bio/);
  });

  it("renders the card for anything else", () => {
    assert.equal(mobileDestination("unknown", "ig-bio"), null);
  });

  it("never builds an App Store URL while the switch is off (the iPad card path)", () => {
    if (IOS_STORE_LIVE) return;
    assert.equal(appStoreUrl("ig-bio"), iosFallbackUrl("ig-bio"));
  });
});
