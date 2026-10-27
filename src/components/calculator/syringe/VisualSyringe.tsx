"use client";

import { useId } from "react";
import { computeFillWidth, computePlungerX, computeTicks } from "./ticks";
import { useAnimatedNumber } from "./useAnimatedNumber";
import type { SyringeState } from "./syringeState";

/**
 * Visual U-100 insulin syringe — the web SVG port of the app's VisualSyringe.
 *
 * Same viewBox, barrel geometry, tick marks (one per unit; taller every 5;
 * labelled every 10), fill and stopper as the app, with the app's light-theme
 * colors. The tick and fill math is the app's own (`./ticks.ts`). Pure
 * presentational: the caller passes the draw and the state.
 *
 * The fill tracks the rounded draw the user would actually measure; the exact
 * value only appears in the below-precision note.
 */

type Props = {
  /** Units to draw (the calculator's rounded value). */
  drawUnitsU100: number;
  /** Unrounded draw, shown in the below-precision note. */
  drawUnitsExact?: number;
  /** Syringe capacity in units: 30, 50 or 100. */
  maxUnits: number;
  state: SyringeState;
};

// viewBox + anatomy constants — identical to the app.
const VB_WIDTH = 220;
const VB_HEIGHT = 96;
const CENTER_Y = 48;
const BARREL_X = 8;
const BARREL_W = 196;
const BARREL_H = 30;
const BARREL_Y = CENTER_Y - BARREL_H / 2;
const BARREL_R = 5;
const STOPPER_W = 3;
const STOPPER_INSET_Y = 2.5;
const STOPPER_H = BARREL_H - STOPPER_INSET_Y * 2;

// App light-theme syringe tokens (src/ui/theme.ts).
const COLORS = {
  barrelTrack: "#FFFEFB",
  barrelStroke: "#8F8880",
  fill: "#3B82F6",
  fillDanger: "#A33A2A",
  fillWarn: "#B8693A",
  tick: "#5C5650",
  plungerRod: "#5C5650",
  plungerHead: "#2D2620",
  sheen: "rgba(255, 255, 255, 0.55)",
  shade: "rgba(45, 38, 32, 0.10)",
  danger: "#A33A2A",
  warn: "#A65A30",
};

export function VisualSyringe({ drawUnitsU100, drawUnitsExact, maxUnits, state }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `syringe-fill-${uid}`;
  const clipId = `syringe-barrel-${uid}`;

  const animated = useAnimatedNumber(drawUnitsU100);
  const ticks = computeTicks({ barrelX: BARREL_X, barrelW: BARREL_W, maxUnits });
  const fillW = computeFillWidth({ drawUnits: animated, barrelW: BARREL_W, maxUnits });
  const plungerX = computePlungerX({
    drawUnits: animated,
    barrelX: BARREL_X,
    barrelW: BARREL_W,
    maxUnits,
  });

  const fillColor =
    state === "exceeds-syringe"
      ? COLORS.fillDanger
      : state === "below-precision"
        ? COLORS.fillWarn
        : COLORS.fill;
  const annotation = buildAnnotation(state, drawUnitsU100, drawUnitsExact, maxUnits);

  return (
    <svg
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`U-100 insulin syringe drawing ${drawUnitsU100} of ${maxUnits} units`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fillColor} stopOpacity="0.65" />
          <stop offset="0.5" stopColor={fillColor} stopOpacity="0.85" />
          <stop offset="1" stopColor={fillColor} stopOpacity="1" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={BARREL_X} y={BARREL_Y} width={BARREL_W} height={BARREL_H} rx={BARREL_R} />
        </clipPath>
      </defs>

      {/* Barrel body, top sheen, bottom shade */}
      <rect
        x={BARREL_X}
        y={BARREL_Y}
        width={BARREL_W}
        height={BARREL_H}
        rx={BARREL_R}
        fill={COLORS.barrelTrack}
        stroke={COLORS.barrelStroke}
        strokeWidth={0.8}
      />
      <rect x={BARREL_X + 1} y={BARREL_Y + 1} width={BARREL_W - 2} height={2.5} rx={1.5} fill={COLORS.sheen} />
      <rect
        x={BARREL_X + 1}
        y={BARREL_Y + BARREL_H - 3}
        width={BARREL_W - 2}
        height={2}
        rx={1}
        fill={COLORS.shade}
      />

      {/* Liquid fill + meniscus, clipped to the barrel */}
      <g clipPath={`url(#${clipId})`}>
        <rect x={BARREL_X} y={BARREL_Y} width={fillW} height={BARREL_H} fill={`url(#${gradientId})`} />
        {fillW > 1 ? (
          <rect
            x={BARREL_X + fillW - 1.5}
            y={BARREL_Y + 2}
            width={1.5}
            height={BARREL_H - 4}
            fill={COLORS.sheen}
          />
        ) : null}
      </g>

      {/* Tick lines inside the barrel, on top of the fill */}
      <g clipPath={`url(#${clipId})`}>
        {ticks.map((tick) => (
          <line
            key={tick.unit}
            x1={tick.x}
            y1={BARREL_Y}
            x2={tick.x}
            y2={BARREL_Y + (tick.size === "major" ? 18 : tick.size === "medium" ? 12 : 7)}
            stroke={COLORS.tick}
            strokeWidth={tick.size === "major" ? 1.2 : 0.7}
          />
        ))}
      </g>

      {/* Unit labels above the barrel, every 10 units */}
      <g>
        {ticks.map((tick) =>
          tick.label !== undefined ? (
            <text
              key={tick.unit}
              x={tick.x}
              y={BARREL_Y - 5}
              fontSize={8}
              fontWeight={600}
              fill={COLORS.tick}
              textAnchor="middle"
            >
              {tick.label}
            </text>
          ) : null,
        )}
      </g>

      {/* Rubber stopper at the end of the fill, with edge bevels */}
      <rect
        x={plungerX - STOPPER_W}
        y={BARREL_Y + STOPPER_INSET_Y}
        width={STOPPER_W}
        height={STOPPER_H}
        rx={1.2}
        fill={COLORS.plungerHead}
      />
      <rect
        x={plungerX - STOPPER_W + 0.4}
        y={BARREL_Y + STOPPER_INSET_Y + 0.5}
        width={STOPPER_W - 0.8}
        height={1}
        rx={0.5}
        fill={COLORS.plungerRod}
        opacity={0.85}
      />
      <rect
        x={plungerX - STOPPER_W + 0.4}
        y={BARREL_Y + STOPPER_INSET_Y + STOPPER_H - 1.5}
        width={STOPPER_W - 0.8}
        height={1}
        rx={0.5}
        fill={COLORS.plungerRod}
        opacity={0.85}
      />

      {annotation ? (
        <text
          x={BARREL_X + BARREL_W / 2}
          y={CENTER_Y + BARREL_H / 2 + 14}
          fontSize={9}
          fontWeight={700}
          fill={state === "exceeds-syringe" ? COLORS.danger : COLORS.warn}
          textAnchor="middle"
        >
          {annotation}
        </text>
      ) : null}
    </svg>
  );
}

/** Same wording as the app's syringe annotation. */
function buildAnnotation(
  state: SyringeState,
  drawUnits: number,
  drawUnitsExact: number | undefined,
  maxUnits: number,
): string | null {
  if (state === "exceeds-syringe") {
    const overflow = Math.max(0, drawUnits - maxUnits);
    return `+${Math.round(overflow)} units overflow — second draw required`;
  }
  if (state === "below-precision") {
    const exact = drawUnitsExact ?? drawUnits;
    return `${exact.toFixed(2)} units · below precision`;
  }
  return null;
}
