/**
 * Post-build check: does any published page PRINT markdown instead of
 * rendering it?
 *
 * THE BUG THIS EXISTS FOR
 * -----------------------
 * The library's prose is authored in markdown and the emitter deliberately
 * leaves inline emphasis intact. EntryProse learned to render it on
 * 2026-09-08 — and the page still printed asterisks, because sideEffects,
 * citations, key terms and related-link reasons render as raw `{value}` and
 * never pass through EntryProse at all. One render path was fixed and six
 * were not.
 *
 * Checking the COMPONENTS would have missed that, which is the point: this
 * reads the prerendered HTML, so it sees what a reader sees no matter which
 * component produced it. A new section added tomorrow with a raw `{value}` is
 * caught without anyone remembering this rule exists.
 *
 * Run after `next build`. Exits non-zero on any finding.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGES = resolve(HERE, "..", ".next", "server", "app", "library");

/** Strip tags and scripts so we see the text a reader sees. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

const RULES = [
  // *emphasis* — the run must not span a sentence, or footnote markers and
  // multiplication signs produce noise.
  ["asterisk-emphasis", /(?<!\*)\*(?!\s)[^*\n]{1,80}?(?<!\s)\*(?!\*)/g],
  ["double-asterisk", /\*\*[^*\n]{1,120}?\*\*/g],
  ["backtick-code", /`[^`\n]{1,120}?`/g],
];

/**
 * Controls. A zero has to be earned: if visibleText or the rules silently stop
 * matching, every page reads clean and the run looks like good news.
 */
function selfCheck() {
  const fails = [];
  const positive = [
    ["<p>a documented *sequence*, not a stack</p>", "asterisk-emphasis"],
    ["<td>SPL `09beda19-56d6` v39</td>", "backtick-code"],
    ["<li>**Boxed warning** applies</li>", "double-asterisk"],
  ];
  for (const [html, expect] of positive) {
    const text = visibleText(html);
    const hit = RULES.some(([name, re]) => name === expect && new RegExp(re.source, "g").test(text));
    if (!hit) fails.push(`positive control did not fire (${expect}): ${html}`);
  }
  const negative = [
    "<p>Hypercalcemia in 3.4% versus 6.4%, P = .006.</p>",
    "<p>Dosed at 2 mg weekly; see Dosing Protocol.</p>",
    "<p><em>rendered emphasis</em> and <strong>rendered strong</strong></p>",
  ];
  for (const html of negative) {
    const text = visibleText(html);
    for (const [name, re] of RULES) {
      if (new RegExp(re.source, "g").test(text)) {
        fails.push(`negative control wrongly flagged ${name}: ${html}`);
      }
    }
  }
  return fails;
}

const fails = selfCheck();
if (fails.length) {
  console.log("INCONCLUSIVE — controls failed:");
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(2);
}

let files;
try {
  files = readdirSync(PAGES).filter((f) => f.endsWith(".html"));
} catch {
  console.log(`No prerendered pages at ${PAGES}. Run \`next build\` first.`);
  process.exit(2);
}

const findings = [];
for (const f of files) {
  const text = visibleText(readFileSync(join(PAGES, f), "utf8"));
  for (const [name, re] of RULES) {
    for (const m of text.matchAll(new RegExp(re.source, "g"))) {
      findings.push({ page: f.replace(/\.html$/, ""), rule: name, frag: m[0].slice(0, 70) });
    }
  }
}

console.log("RENDERED-MARKDOWN CHECK");
console.log("=".repeat(64));
console.log(`controls OK · ${files.length} prerendered pages scanned`);
if (!findings.length) {
  console.log("✓ no page prints markdown instead of rendering it");
  process.exit(0);
}

const byRule = new Map();
for (const f of findings) byRule.set(f.rule, (byRule.get(f.rule) || 0) + 1);
console.log(`\n${findings.length} finding(s):`);
for (const [r, n] of byRule) console.log(`  ${String(n).padStart(4)}  ${r}`);
console.log();
for (const f of findings.slice(0, 20)) {
  console.log(`  [${f.rule}] ${f.page}: ${f.frag}`);
}
if (findings.length > 20) console.log(`\n… ${findings.length - 20} more`);
process.exit(1);
