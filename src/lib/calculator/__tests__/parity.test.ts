/**
 * Golden-vector parity: the web engine must reproduce the APP engine's output
 * exactly — every number, every warning code and message, every validation
 * error — for the fixed input grid in `parity-vectors.json`.
 *
 * The vectors are generated from the app's engine (not the web's) by
 * `npm run parity:sync`, with the app's wording mapped to the web's ("dose" →
 * "amount" in user-facing messages). So this test fails the moment the web
 * math drifts from the app snapshot. `npm run parity:check` covers the other
 * direction: it fails when the app has changed since that snapshot.
 *
 * Comparison is on the JSON form, which is exact for finite doubles.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { forward } from "../forward";
import { reverse } from "../reverse";
import { computeBlend, type BlendInput } from "../blend";
import { computeVialUsage, type VialUsageParams } from "../vialUsage";
import type { ForwardInput, ReverseInput } from "../types";

type Row<I> = {
  input: I;
  out?: unknown;
  error?: { name: string; field: string; reason: string };
};

type Vectors = {
  meta: { appRef: string; appSha: string; appCommitDate: string };
  forward: Row<ForwardInput>[];
  reverse: Row<ReverseInput>[];
  blend: Row<BlendInput>[];
  vialUsage: Row<VialUsageParams>[];
};

const vectors: Vectors = JSON.parse(
  readFileSync(join(__dirname, "parity-vectors.json"), "utf8"),
);

/** Run the web engine and shape the result exactly as the generator does. */
function run(fn: () => unknown): Omit<Row<unknown>, "input"> {
  try {
    return { out: JSON.parse(JSON.stringify(fn())) };
  } catch (e) {
    const err = e as { name: string; field: string; reason: string };
    if (!("field" in err) || !("reason" in err)) throw e;
    return { error: { name: err.name, field: err.field, reason: err.reason } };
  }
}

function check<I>(kind: string, rows: Row<I>[], engine: (input: I) => unknown) {
  test(`${kind}: ${rows.length} vectors match the app (${vectors.meta.appSha.slice(0, 12)})`, () => {
    assert.ok(rows.length > 0, "no vectors — regenerate with npm run parity:sync");
    for (const row of rows) {
      const { input, ...expected } = row;
      assert.deepEqual(run(() => engine(input)), expected, `${kind} ${JSON.stringify(input)}`);
    }
  });
}

check("forward", vectors.forward, forward);
check("reverse", vectors.reverse, reverse);
check("blend", vectors.blend, computeBlend);
check("vialUsage", vectors.vialUsage, computeVialUsage);

test("the vectors exercise every warning and both blend anchors", () => {
  const codes = new Set(
    vectors.forward.flatMap((r) =>
      ((r.out as { warnings?: { code: string }[] })?.warnings ?? []).map((w) => w.code),
    ),
  );
  for (const code of [
    "DRAW_EXCEEDS_SYRINGE",
    "DRAW_ROUNDS_TO_ZERO",
    "DRAW_BELOW_PRECISION",
    "CONCENTRATION_VERY_HIGH",
    "CONCENTRATION_VERY_LOW",
    "VOLUME_VERY_LARGE",
    "DOSE_NEAR_VIAL_CAPACITY",
  ]) {
    assert.ok(codes.has(code), `no forward vector raises ${code}`);
  }
  assert.ok(vectors.blend.some((r) => r.out && "targetDoseMg" in r.input.anchor));
  assert.ok(vectors.blend.some((r) => r.out && "drawUnitsU100" in r.input.anchor));
  assert.ok(vectors.vialUsage.some((r) => r.input.sharers === 2));
});
