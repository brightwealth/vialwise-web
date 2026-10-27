#!/usr/bin/env node
/**
 * Keeps the web calculator engine (`src/lib/calculator/`) in lockstep with the
 * VialWise app's engine (`src/calculator/` in the app repo).
 *
 *   npm run parity:sync   — copy the app's calculator + syringe-tick tests in,
 *                           and regenerate the golden vectors from the APP engine
 *   npm run parity:check  — change nothing; exit 1 if the app has moved on:
 *                           its tests differ from the synced copies, its engine
 *                           disagrees with the web engine, or the golden vectors
 *                           are stale
 *
 * Options: --app <path to the app repo> (default ../vialwise)
 *          --ref <git ref>              (default origin/main; run `git fetch` there first)
 *
 * The app source is read with `git archive <ref>`, so the app repo's working
 * tree, branches and index are never touched.
 *
 * Runs under tsx (it imports TypeScript from both repos): the npm scripts call
 * `tsx scripts/calculator-parity.mjs`.
 *
 * Vocabulary: the web says "amount" where the app says "dose" (user-facing
 * copy only — engine field names are shared). Every app → web wording
 * difference lives in VOCABULARY below, and nowhere else. Each entry must match
 * exactly where it is expected to, so an app wording change stops the sync
 * instead of slipping through untranslated.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const WEB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = join(WEB_ROOT, "src/lib/calculator/__tests__/parity-vectors.json");

/** App test files synced verbatim (apart from VOCABULARY and import depth). */
const SYNCED_TESTS = [
  ...["api", "blend", "forward", "reverse", "round", "sanity", "validate", "vialUsage", "warnings"].map(
    (name) => ({
      app: `src/calculator/__tests__/${name}.test.ts`,
      web: `src/lib/calculator/__tests__/app/${name}.test.ts`,
      // One directory deeper on the web: "../forward" → "../../forward".
      deeper: true,
    }),
  ),
  {
    app: "src/ui/components/VisualSyringe/__tests__/ticks.test.ts",
    web: "src/components/calculator/syringe/__tests__/ticks.test.ts",
    deeper: false,
  },
];

/** App wording → web wording. `inTests` names the synced files it must appear in. */
const VOCABULARY = [
  {
    app: "This dose is too small to measure on this syringe at this concentration.",
    web: "This amount is too small to measure on this syringe at this concentration.",
    inTests: ["src/calculator/__tests__/warnings.test.ts"],
  },
  {
    app: "the anchor draw rounds to 0 units — increase the dose or reduce the water",
    web: "the anchor draw rounds to 0 units — increase the amount or reduce the water",
    inTests: [],
  },
];

// ─── app source ───────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { mode: argv[0], app: resolve(WEB_ROOT, "../vialwise"), ref: "origin/main" };
  for (let i = 1; i < argv.length; i += 2) {
    if (argv[i] === "--app") args.app = resolve(argv[i + 1]);
    else if (argv[i] === "--ref") args.ref = argv[i + 1];
    else throw new Error(`unknown option ${argv[i]}`);
  }
  if (args.mode !== "sync" && args.mode !== "check") {
    throw new Error("usage: calculator-parity.mjs <sync|check> [--app <path>] [--ref <ref>]");
  }
  return args;
}

function extractApp({ app, ref }) {
  const git = (...a) => execFileSync("git", ["-C", app, ...a], { encoding: "utf8" }).trim();
  const sha = git("rev-parse", ref);
  const date = git("show", "-s", "--format=%cI", sha);
  const dir = mkdtempSync(join(tmpdir(), "vialwise-app-calc-"));
  const tar = execFileSync("git", [
    "-C", app, "archive", sha,
    "src/calculator",
    "src/ui/components/VisualSyringe/ticks.ts",
    "src/ui/components/VisualSyringe/__tests__/ticks.test.ts",
  ]);
  execFileSync("tar", ["-x", "-f", "-", "-C", dir], { input: tar });
  return { dir, sha, date };
}

// ─── tests ────────────────────────────────────────────────────────────────────

function toWebVocabulary(text) {
  return VOCABULARY.reduce((t, v) => t.split(v.app).join(v.web), text);
}

/** The web copy of one app test file. Throws if an expected wording is missing. */
function transformTest(spec, source, appMeta) {
  for (const v of VOCABULARY) {
    if (v.inTests.includes(spec.app) && !source.includes(v.app)) {
      throw new Error(
        `${spec.app} no longer contains "${v.app}". The app's wording changed: update VOCABULARY (and the web engine) before syncing.`,
      );
    }
  }
  let body = toWebVocabulary(source);
  if (spec.deeper) {
    const relative = /from\s+"\.\.(\/|")/g;
    const count = (body.match(relative) ?? []).length;
    body = body.replace(/(from\s+")\.\.\//g, "$1../../").replace(/(from\s+")\.\."/g, '$1../.."');
    const rerooted = (body.match(/from\s+"\.\.\/\.\.(\/|")/g) ?? []).length;
    if (rerooted !== count) {
      throw new Error(`${spec.app}: re-rooted ${rerooted} of ${count} relative imports`);
    }
  }
  const header =
    `// SYNCED from the VialWise app: ${spec.app} @ ${appMeta.sha.slice(0, 12)} (${appMeta.date}).\n` +
    `// Do not edit. Re-sync with \`npm run parity:sync\`; drift check: \`npm run parity:check\`.\n` +
    `// Only changes: app → web vocabulary and import depth (scripts/calculator-parity.mjs).\n\n`;
  return header + body;
}

/** Same as transformTest, minus the header line that carries the commit. */
function stripHeader(text) {
  return text.split("\n").slice(4).join("\n");
}

// ─── golden vectors ───────────────────────────────────────────────────────────

const FREQUENCIES = ["daily", "every-other-day", "weekly", "twice-weekly"];

/** Deterministic input grid. Includes clean cases, every warning, and errors. */
function buildCases() {
  const forward = [];
  for (const vialMg of [1, 5, 10, 12, 30, 100]) {
    for (const bacWaterMl of [0.5, 1, 2, 3, 12]) {
      for (const targetDoseMg of [0.001, 0.04, 0.05, 0.25, 1, 2.5, 60]) {
        forward.push({ vialMg, bacWaterMl, targetDoseMg });
      }
    }
  }
  forward.push({ vialMg: 0, bacWaterMl: 1, targetDoseMg: 1 }, { vialMg: 10, bacWaterMl: -1, targetDoseMg: 1 });

  const reverse = [];
  for (const targetDoseMg of [0.1, 0.5, 1, 5]) {
    for (const vialMg of [1, 10, 30]) {
      for (const desiredUnitsPerDrawU100 of [1, 2, 10, 17, 100, 120]) {
        reverse.push({ targetDoseMg, vialMg, desiredUnitsPerDrawU100 });
      }
    }
  }
  reverse.push({ targetDoseMg: 1, vialMg: 10, desiredUnitsPerDrawU100: 10.5 });

  const blend = [];
  const sets = [[5, 5], [10, 5], [10, 5, 2], [5, 5, 5, 5], [1, 1], [2, 10]];
  const anchors = [
    { anchorIndex: 0, anchor: { targetDoseMg: 0.001 } },
    { anchorIndex: 0, anchor: { targetDoseMg: 0.2 } },
    { anchorIndex: 1, anchor: { targetDoseMg: 0.5 } },
    { anchorIndex: 0, anchor: { targetDoseMg: 1 } },
    { anchorIndex: 0, anchor: { targetDoseMg: 20 } },
    { anchorIndex: 0, anchor: { drawUnitsU100: 1 } },
    { anchorIndex: 0, anchor: { drawUnitsU100: 8 } },
    { anchorIndex: 0, anchor: { drawUnitsU100: 20 } },
    { anchorIndex: 0, anchor: { drawUnitsU100: 12.5 } },
    { anchorIndex: 0, anchor: { drawUnitsU100: 0.4 } },
    { anchorIndex: 0, anchor: { drawUnitsU100: 120 } },
  ];
  for (const mgs of sets) {
    for (const bacWaterMl of [2, 3, 12]) {
      for (const a of anchors) {
        blend.push({ components: mgs.map((mg) => ({ mg })), bacWaterMl, ...a });
      }
    }
  }
  blend.push(
    { components: [{ mg: 5 }], bacWaterMl: 2, anchorIndex: 0, anchor: { drawUnitsU100: 8 } },
    { components: [{ mg: 5 }, { mg: 5 }], bacWaterMl: 2, anchorIndex: 2, anchor: { drawUnitsU100: 8 } },
  );

  const vialUsage = [];
  for (const totalDoses of [0, 2.5, 20, 30.44]) {
    for (const frequency of FREQUENCIES) {
      for (const sharers of [undefined, 2, 2.5, 0]) {
        vialUsage.push({ totalDoses, frequency, ...(sharers === undefined ? {} : { sharers }) });
      }
    }
    vialUsage.push({ totalDoses, frequency: "custom", injectionDaysCount: 3 });
  }

  return { forward, reverse, blend, vialUsage };
}

/** Run one engine over the grid. Errors are recorded, not thrown. */
async function runEngine(calcDir) {
  const load = (f) => import(pathToFileURL(join(calcDir, f)).href);
  const { forward } = await load("forward.ts");
  const { reverse } = await load("reverse.ts");
  const { computeBlend } = await load("blend.ts");
  const { computeVialUsage } = await load("vialUsage.ts");
  const attempt = (fn) => {
    try {
      return { out: fn() };
    } catch (e) {
      if (e && typeof e === "object" && "field" in e && "reason" in e) {
        return { error: { name: e.name, field: e.field, reason: e.reason } };
      }
      throw e;
    }
  };
  const cases = buildCases();
  return {
    forward: cases.forward.map((input) => ({ input, ...attempt(() => forward(input)) })),
    reverse: cases.reverse.map((input) => ({ input, ...attempt(() => reverse(input)) })),
    blend: cases.blend.map((input) => ({ input, ...attempt(() => computeBlend(input)) })),
    vialUsage: cases.vialUsage.map((input) => ({ input, ...attempt(() => computeVialUsage(input)) })),
  };
}

/** One case per line: reviewable diffs, a fraction of the size of pretty JSON. */
function serializeFixture({ meta, ...groups }) {
  const blocks = Object.entries(groups).map(
    ([kind, rows]) => `${JSON.stringify(kind)}: [\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(",\n")}\n]`,
  );
  return `{\n"meta": ${JSON.stringify(meta, null, 1)},\n${blocks.join(",\n")}\n}\n`;
}

/** JSON round-trip with the app's wording mapped to the web's. */
function normalize(results) {
  return JSON.parse(toWebVocabulary(JSON.stringify(results)));
}

function diffResults(a, b, label, limit = 5) {
  const problems = [];
  for (const kind of Object.keys(a)) {
    a[kind].forEach((row, i) => {
      if (JSON.stringify(row) !== JSON.stringify(b[kind][i])) {
        problems.push(`${label} ${kind}[${i}] ${JSON.stringify(row.input)}\n    app: ${JSON.stringify(row)}\n    web: ${JSON.stringify(b[kind][i])}`);
      }
    });
  }
  return { count: problems.length, sample: problems.slice(0, limit) };
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const appMeta = extractApp(args);
  try {
    const appResults = normalize(await runEngine(join(appMeta.dir, "src/calculator")));
    const fixture = {
      meta: {
        about: "Golden vectors: the APP engine's output for a fixed input grid, in web vocabulary. Generated by scripts/calculator-parity.mjs; do not edit.",
        appRef: args.ref,
        appSha: appMeta.sha,
        appCommitDate: appMeta.date,
      },
      ...appResults,
    };

    if (args.mode === "sync") {
      for (const spec of SYNCED_TESTS) {
        const source = readFileSync(join(appMeta.dir, spec.app), "utf8");
        const out = join(WEB_ROOT, spec.web);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, transformTest(spec, source, appMeta));
      }
      writeFileSync(FIXTURE, serializeFixture(fixture));
      const n = Object.values(appResults).reduce((s, rows) => s + rows.length, 0);
      console.log(`synced ${SYNCED_TESTS.length} test files and ${n} golden vectors from ${args.ref} @ ${appMeta.sha.slice(0, 12)}`);
      return;
    }

    // check
    let failed = false;
    for (const spec of SYNCED_TESTS) {
      const source = readFileSync(join(appMeta.dir, spec.app), "utf8");
      let current = "";
      try {
        current = readFileSync(join(WEB_ROOT, spec.web), "utf8");
      } catch {
        // missing file reads as a difference below
      }
      if (stripHeader(transformTest(spec, source, appMeta)) !== stripHeader(current)) {
        failed = true;
        console.log(`DRIFT  ${spec.app} changed in the app since the last sync`);
      }
    }
    const webResults = normalize(await runEngine(join(WEB_ROOT, "src/lib/calculator")));
    const live = diffResults(appResults, webResults, "engine");
    if (live.count > 0) {
      failed = true;
      console.log(`DRIFT  ${live.count} grid cases differ between the app and web engines:\n  ${live.sample.join("\n  ")}`);
    }
    let stored = null;
    try {
      stored = JSON.parse(readFileSync(FIXTURE, "utf8"));
    } catch {
      // missing fixture reads as stale below
    }
    const { meta: _meta, ...storedResults } = stored ?? { meta: null };
    if (!stored || JSON.stringify(storedResults) !== JSON.stringify(appResults)) {
      failed = true;
      console.log("DRIFT  parity-vectors.json is stale (run npm run parity:sync)");
    }
    console.log(
      failed
        ? `parity check FAILED against ${args.ref} @ ${appMeta.sha.slice(0, 12)}`
        : `parity OK: web engine matches ${args.ref} @ ${appMeta.sha.slice(0, 12)} (tests, engine and golden vectors)`,
    );
    process.exitCode = failed ? 1 : 0;
  } finally {
    rmSync(appMeta.dir, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
