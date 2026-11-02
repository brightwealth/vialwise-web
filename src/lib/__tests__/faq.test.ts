/**
 * The FAQ list feeds both the visible FAQ and the FAQPage JSON-LD, so this
 * checks the copy itself: while IOS_STORE_LIVE is false no answer claims the
 * iPhone app is on the App Store.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { FAQS } from "@/lib/faq";
import { IOS_STORE_LIVE } from "@/lib/storeLinks";

describe("FAQ copy and the iOS switch", () => {
  it("claims no App Store availability while the switch is off", () => {
    if (IOS_STORE_LIVE) return;
    for (const { a } of FAQS) {
      assert.doesNotMatch(a, /on the App Store for iPhone|and on the App Store/);
    }
  });

  it("keeps every question and the Google Play link", () => {
    assert.equal(FAQS.length, 8);
    assert.ok(FAQS.some((f) => f.link?.href.startsWith("https://play.google.com/")));
  });
});
