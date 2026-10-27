/**
 * Minimal Jest-compatible globals — `describe`, `it`, `test`, `test.each`,
 * `expect` — on top of Node's built-in test runner.
 *
 * Why: the app's calculator tests are written for Jest. The web runs Node's
 * test runner through tsx (no Jest dependency). With these globals the app's
 * test files run here UNMODIFIED (see `__tests__/app/`), so the web engine is
 * checked against the exact vectors the app ships with.
 *
 * Loaded before every test file via `tsx --import` (the `test` script in
 * package.json). Only the matchers those files use are implemented. An unknown
 * matcher is a TypeError at runtime and a type error at build time, so a newly
 * synced test that needs one fails loudly instead of passing vacuously.
 */

import { describe as nodeDescribe, it as nodeIt } from "node:test";
import { format, inspect } from "node:util";

type TestFn = () => void | Promise<void>;
type ThrowExpectation = (new (...args: never[]) => unknown) | RegExp | string | Error;

type Matchers = {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeCloseTo(expected: number, numDigits?: number): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeNaN(): void;
  toBeInstanceOf(cls: new (...args: never[]) => unknown): void;
  toBeGreaterThan(n: number): void;
  toBeGreaterThanOrEqual(n: number): void;
  toBeLessThan(n: number): void;
  toBeLessThanOrEqual(n: number): void;
  toContain(item: unknown): void;
  toHaveLength(n: number): void;
  toHaveProperty(path: string, value?: unknown): void;
  toMatch(pattern: RegExp | string): void;
  toThrow(expected?: ThrowExpectation): void;
};

type Expectation = Matchers & { not: Matchers };

type EachFn = <T>(
  table: readonly T[],
) => (name: string, fn: (...args: T extends readonly unknown[] ? T : [T]) => void | Promise<void>) => void;

type TestApi = ((name: string, fn: TestFn) => void) & { each: EachFn };

declare global {
  var describe: (name: string, fn: () => void) => void;
  var it: TestApi;
  var test: TestApi;
  var expect: (actual: unknown) => Expectation;
}

const show = (v: unknown) => inspect(v, { depth: 6 });

/**
 * Jest `toEqual` semantics: recursive, `Object.is` on primitives, and a
 * property whose value is `undefined` counts the same as an absent one.
 */
function equals(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => equals(v, b[i]));
  }
  const ra = a as Record<string, unknown>;
  const rb = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(ra), ...Object.keys(rb)]);
  for (const k of keys) {
    if (!equals(ra[k], rb[k])) return false;
  }
  return true;
}

function matchesThrow(err: unknown, expected: ThrowExpectation | undefined): boolean {
  if (expected === undefined) return true;
  const message = err instanceof Error ? err.message : String(err);
  if (expected instanceof RegExp) return expected.test(message);
  if (typeof expected === "string") return message.includes(expected);
  if (expected instanceof Error) return message === expected.message;
  return err instanceof expected;
}

function makeMatchers(actual: unknown, negate: boolean): Matchers {
  const check = (pass: boolean, describeFailure: () => string) => {
    if (pass === negate) {
      throw new Error(`expect(${show(actual)})${negate ? ".not" : ""}: ${describeFailure()}`);
    }
  };
  const num = () => actual as number;

  return {
    toBe: (expected) =>
      check(Object.is(actual, expected), () => `toBe ${show(expected)}`),
    toEqual: (expected) =>
      check(equals(actual, expected), () => `toEqual ${show(expected)}`),
    toBeCloseTo: (expected, numDigits = 2) =>
      check(
        Math.abs(expected - num()) < Math.pow(10, -numDigits) / 2,
        () => `toBeCloseTo ${expected} (${numDigits} digits)`,
      ),
    toBeNull: () => check(actual === null, () => "toBeNull"),
    toBeUndefined: () => check(actual === undefined, () => "toBeUndefined"),
    toBeDefined: () => check(actual !== undefined, () => "toBeDefined"),
    toBeNaN: () => check(Number.isNaN(actual), () => "toBeNaN"),
    toBeInstanceOf: (cls) =>
      check(actual instanceof cls, () => `toBeInstanceOf ${cls.name}`),
    toBeGreaterThan: (n) => check(num() > n, () => `toBeGreaterThan ${n}`),
    toBeGreaterThanOrEqual: (n) =>
      check(num() >= n, () => `toBeGreaterThanOrEqual ${n}`),
    toBeLessThan: (n) => check(num() < n, () => `toBeLessThan ${n}`),
    toBeLessThanOrEqual: (n) => check(num() <= n, () => `toBeLessThanOrEqual ${n}`),
    toContain: (item) =>
      check(
        typeof actual === "string"
          ? actual.includes(String(item))
          : Array.isArray(actual) && actual.includes(item),
        () => `toContain ${show(item)}`,
      ),
    toHaveLength: (n) =>
      check((actual as { length?: unknown })?.length === n, () => `toHaveLength ${n}`),
    toHaveProperty: (path, ...value) => {
      let cur: unknown = actual;
      let found = true;
      for (const key of path.split(".")) {
        if (cur === null || cur === undefined || !(key in Object(cur))) {
          found = false;
          break;
        }
        cur = (cur as Record<string, unknown>)[key];
      }
      check(
        found && (value.length === 0 || equals(cur, value[0])),
        () => `toHaveProperty ${path}${value.length ? ` = ${show(value[0])}` : ""}`,
      );
    },
    toMatch: (pattern) =>
      check(
        typeof actual === "string" &&
          (typeof pattern === "string" ? actual.includes(pattern) : pattern.test(actual)),
        () => `toMatch ${String(pattern)}`,
      ),
    toThrow: (expected) => {
      if (typeof actual !== "function") {
        throw new TypeError("toThrow needs a function");
      }
      let threw = false;
      let err: unknown;
      try {
        (actual as () => unknown)();
      } catch (e) {
        threw = true;
        err = e;
      }
      check(
        threw && matchesThrow(err, expected),
        () =>
          `toThrow ${expected === undefined ? "" : show(expected)} — ${
            threw ? `threw ${show(err)}` : "did not throw"
          }`,
      );
    },
  };
}

function makeTestApi(): TestApi {
  const run = (name: string, fn: TestFn) => {
    nodeIt(name, fn);
  };
  const each: EachFn = (table) => (name, fn) => {
    table.forEach((row) => {
      const args = (Array.isArray(row) ? row : [row]) as unknown[];
      run(format(name.replace(/%p/g, "%j"), ...args), () =>
        (fn as (...a: unknown[]) => void | Promise<void>)(...args),
      );
    });
  };
  return Object.assign(run, { each });
}

globalThis.describe = (name, fn) => {
  nodeDescribe(name, fn);
};
globalThis.it = makeTestApi();
globalThis.test = globalThis.it;
globalThis.expect = (actual) =>
  Object.assign(makeMatchers(actual, false), { not: makeMatchers(actual, true) });

export {};
