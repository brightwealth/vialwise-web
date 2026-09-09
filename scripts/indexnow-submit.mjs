/**
 * IndexNow submission. One ping reaches Bing, Yandex, Naver and Seznam.
 *
 * Google does NOT participate in IndexNow — it is not a substitute for Search
 * Console, and the sitemap remains how Google is told. This covers the rest.
 *
 * The key file at public/15f3d1f0619a4074bc0aa596113107e1.txt must stay deployed: the endpoint fetches it
 * to prove we control the host, and a submission from a host that cannot serve
 * its key is rejected. Do not delete or rename it.
 *
 * USAGE
 *     node scripts/indexnow-submit.mjs                 # all library URLs + core pages
 *     node scripts/indexnow-submit.mjs /library/bpc-157  # specific paths
 */
import { readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const HOST = "www.getvialwise.com";
const KEY = "15f3d1f0619a4074bc0aa596113107e1";

function allUrls() {
  const data = JSON.parse(readFileSync(resolve(HERE, "..", "src", "data", "library.json"), "utf8"));
  return [
    `https://${HOST}/`,
    `https://${HOST}/library`,
    `https://${HOST}/calculator`,
    ...data.entries.map((e) => `https://${HOST}/library/${e.slug}`),
  ];
}

const args = process.argv.slice(2);
const urlList = args.length ? args.map((p) => `https://${HOST}${p.startsWith("/") ? p : "/" + p}`) : allUrls();

// IndexNow caps a batch at 10,000; we are far under, but chunk anyway so this
// keeps working when the library grows.
const CHUNK = 1000;
let submitted = 0;
for (let i = 0; i < urlList.length; i += CHUNK) {
  const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urlList.slice(i, i + CHUNK) };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  // 200 accepted, 202 accepted-pending-key-validation. Both are successes.
  console.log(`  chunk ${i / CHUNK + 1}: HTTP ${res.status} for ${body.urlList.length} URLs`);
  if (res.status !== 200 && res.status !== 202) {
    console.log("  body:", (await res.text()).slice(0, 300));
    process.exit(1);
  }
  submitted += body.urlList.length;
}
console.log(`submitted ${submitted} URLs to IndexNow (Bing, Yandex, Naver, Seznam — not Google)`);
