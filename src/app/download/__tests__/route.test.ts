/**
 * /download — the printed-QR redirect. Follows IOS_STORE_LIVE: while the iPhone
 * app is off the App Store, iOS goes to the homepage; Android always goes to
 * Google Play. Written against the switch, so flipping it needs no test edit.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

import { HOME_URL, IOS_STORE_LIVE } from "@/lib/storeLinks";

import { GET } from "../route";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";

function hit(userAgent: string, query = "") {
  return GET(
    new NextRequest(`https://www.getvialwise.com/download${query}`, {
      headers: { "user-agent": userAgent },
    }),
  );
}

describe("/download", () => {
  it("sends an iPhone to the homepage while the switch is off (302, no-store)", () => {
    const res = hit(IPHONE);
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("cache-control"), "no-store");
    const location = res.headers.get("location") ?? "";
    if (IOS_STORE_LIVE) {
      assert.match(location, /^https:\/\/apps\.apple\.com\/app\/apple-store\/id6774017323\?/);
    } else {
      assert.equal(location, HOME_URL);
    }
  });

  it("keeps the QR's utm tags on the iPhone homepage hop and drops src", () => {
    const location = hit(IPHONE, "?src=qr&utm_source=qr&utm_medium=offline").headers.get("location") ?? "";
    if (IOS_STORE_LIVE) return;
    assert.equal(location, `${HOME_URL}?utm_source=qr&utm_medium=offline`);
  });

  it("sends Android to Google Play with the src campaign (302, no-store)", () => {
    const res = hit(ANDROID, "?src=qr");
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("cache-control"), "no-store");
    const location = res.headers.get("location") ?? "";
    assert.match(location, /^https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.vialwise\.app&referrer=/);
    assert.match(decodeURIComponent(location), /utm_campaign=qr/);
  });

  it("never points at the App Store while the switch is off", () => {
    if (IOS_STORE_LIVE) return;
    for (const ua of [IPHONE, ANDROID, "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)", ""]) {
      assert.doesNotMatch(hit(ua, "?src=qr").headers.get("location") ?? "", /apps\.apple\.com/);
    }
  });
});
