"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tween a number toward `target` with an ease-out cubic — the web port of the
 * app's `useAnimatedNumber`. Drives the syringe fill so it glides to the new
 * draw instead of jumping, which shows the user what changed.
 *
 * Respects `prefers-reduced-motion`: with it on, the value updates at once.
 */

const DEFAULT_DURATION_MS = 600;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useAnimatedNumber(target: number, durationMs = DEFAULT_DURATION_MS): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;
    if (from === target) return;

    if (prefersReducedMotion()) {
      valueRef.current = target;
      setValue(target);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const next = from + (target - from) * easeOutCubic(t);
      valueRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
