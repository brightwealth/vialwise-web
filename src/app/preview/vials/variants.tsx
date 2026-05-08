/**
 * Six SVG vial-illustration variants for the Home empty-state. All use
 * the locked brand palette only:
 *
 *   amber       #B8693A
 *   amberLight  #CB7B4F
 *   amberDark   #A65A30
 *   forest      #2F5234
 *   cream       #F0E8DC
 *   bone        #FBF7F0
 *   espresso    #2D2620
 *   graphite    #5C5650
 *
 * Pure SVG, no external assets. Each renders inside an 88×88 box so it's
 * directly swappable with the current ClosedVial component.
 */

import * as React from "react";

const AMBER = "#B8693A";
const AMBER_LIGHT = "#CB7B4F";
const AMBER_DARK = "#A65A30";
const FOREST = "#2F5234";
const CREAM = "#F0E8DC";
const BONE = "#FBF7F0";
const GRAPHITE = "#5C5650";

type Props = { size?: number };

// ─── 1. CURRENT — V-on-amber stocky vial (baseline) ────────────────────────

export function VialCurrent({ size = 88 }: Props) {
  const w = size * 0.8;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 64 80" fill="none">
      <defs>
        <linearGradient id="curr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.5" stopColor={BONE} stopOpacity="1" />
          <stop offset="1" stopColor={CREAM} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="curr-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AMBER_DARK} stopOpacity="0.30" />
          <stop offset="1" stopColor={AMBER_DARK} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <circle cx={32} cy={40} r={38} fill={AMBER_DARK} opacity={0.07} />
      <rect x={22} y={6} width={20} height={6} rx={2} fill={AMBER_DARK} />
      <rect x={20} y={11} width={24} height={4} fill={AMBER_LIGHT} />
      <rect x={26} y={14} width={12} height={4} fill={GRAPHITE} opacity={0.25} />
      <rect x={18} y={17} width={28} height={50} rx={4} fill="url(#curr-glass)" stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={1} />
      <rect x={20} y={40} width={24} height={25} rx={2} fill="url(#curr-liquid)" />
      <g transform="translate(32 47)">
        <path d="M-7 -6 L0 6 L7 -6" stroke={FOREST} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <ellipse cx={32} cy={72} rx={14} ry={2} fill={GRAPHITE} opacity={0.10} />
    </svg>
  );
}

// ─── 2. TALL SLENDER LYO VIAL — looks like a real research-peptide vial ────

export function VialTallLyo({ size = 88 }: Props) {
  const w = size * 0.55;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 44 80" fill="none">
      <defs>
        <linearGradient id="lyo-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
      </defs>
      <ellipse cx={22} cy={75} rx={14} ry={2.5} fill={GRAPHITE} opacity={0.12} />
      {/* Crimp cap */}
      <rect x={12} y={4} width={20} height={3} rx={1} fill={AMBER_DARK} />
      <rect x={10} y={6} width={24} height={6} rx={1.5} fill={AMBER_LIGHT} />
      {/* Rubber stopper visible thru cap aperture */}
      <rect x={17} y={3} width={10} height={2.5} rx={0.5} fill={GRAPHITE} opacity={0.50} />
      {/* Neck */}
      <rect x={15} y={11} width={14} height={2} fill={GRAPHITE} opacity={0.20} />
      <path d="M14 13 L30 13 L32 18 L12 18 Z" fill="url(#lyo-glass)" stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={1} />
      {/* Body */}
      <rect x={11} y={18} width={22} height={50} rx={2} fill="url(#lyo-glass)" stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={1} />
      {/* Lyophilized cake — small white-ish disc at the bottom */}
      <rect x={13} y={59} width={18} height={7} rx={1} fill={CREAM} stroke={GRAPHITE} strokeOpacity={0.20} strokeWidth={0.6} />
      {/* Label band */}
      <rect x={10} y={32} width={24} height={18} rx={1.5} fill={BONE} stroke={AMBER_DARK} strokeOpacity={0.4} strokeWidth={0.8} />
      <g transform="translate(22 41)">
        <path d="M-5 -4 L0 4 L5 -4" stroke={FOREST} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

// ─── 3. SQUAT MULTIDOSE VIAL — shorter, wider, like a 5-10mL multidose ─────

export function VialSquatMulti({ size = 88 }: Props) {
  const w = size;
  const h = size * 0.85;
  return (
    <svg width={w} height={h} viewBox="0 0 80 68" fill="none">
      <defs>
        <linearGradient id="sq-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
        <linearGradient id="sq-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AMBER_DARK} stopOpacity="0.28" />
          <stop offset="1" stopColor={AMBER_DARK} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <ellipse cx={40} cy={62} rx={26} ry={3} fill={GRAPHITE} opacity={0.12} />
      {/* Cap */}
      <rect x={28} y={4} width={24} height={4} rx={1} fill={AMBER_DARK} />
      <rect x={24} y={7} width={32} height={5} rx={1.5} fill={AMBER_LIGHT} />
      {/* Neck */}
      <rect x={30} y={12} width={20} height={3} fill={GRAPHITE} opacity={0.22} />
      <path d="M28 15 L52 15 L56 21 L24 21 Z" fill="url(#sq-glass)" stroke={GRAPHITE} strokeOpacity={0.28} strokeWidth={1} />
      {/* Body — squat, wide */}
      <rect x={20} y={21} width={40} height={36} rx={3} fill="url(#sq-glass)" stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={1} />
      {/* Liquid fills most of body */}
      <rect x={22} y={32} width={36} height={23} rx={2} fill="url(#sq-liquid)" />
      {/* Label */}
      <rect x={18} y={32} width={44} height={14} rx={1.5} fill={BONE} opacity={0.92} stroke={AMBER_DARK} strokeOpacity={0.4} strokeWidth={0.8} />
      <g transform="translate(40 39)">
        <path d="M-5 -3 L0 3 L5 -3" stroke={FOREST} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

// ─── 4. VIAL + SYRINGE — realistic lyo-vial body alongside a U-100 ─────────

export function VialAndSyringe({ size = 88 }: Props) {
  const w = size * 1.4;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 112 80" fill="none">
      <defs>
        <linearGradient id="vs-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor={BONE} />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
        <linearGradient id="vs-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AMBER_DARK} stopOpacity="0.32" />
          <stop offset="1" stopColor={AMBER_DARK} stopOpacity="0.60" />
        </linearGradient>
      </defs>

      {/* Combined ground shadow under both items */}
      <ellipse cx={56} cy={75} rx={48} ry={2.5} fill={GRAPHITE} opacity={0.10} />

      {/* ─── Vial — tall slim lyophilized profile ─── */}
      <g transform="translate(0 0)">
        {/* Aluminum crimp top — small flat disc covering the rubber stopper */}
        <rect x={16} y={6} width={20} height={3} rx={1} fill={AMBER_DARK} />
        {/* Crimp band — slightly wider, lighter amber */}
        <rect x={14} y={8} width={24} height={6} rx={1.5} fill={AMBER_LIGHT} />
        {/* Subtle highlight on the crimp band */}
        <rect x={15} y={9} width={22} height={1} rx={0.5} fill="#FFFFFF" opacity={0.30} />
        {/* Rubber stopper visible through the crimp aperture */}
        <rect x={21} y={5} width={10} height={2.5} rx={0.5} fill={GRAPHITE} opacity={0.55} />
        {/* Glass neck — narrowest point */}
        <rect x={19} y={13} width={14} height={2.5} fill={GRAPHITE} opacity={0.18} />
        {/* Tapered shoulder from neck to body */}
        <path
          d="M18 15.5 L34 15.5 L37 21 L15 21 Z"
          fill="url(#vs-glass)"
          stroke={GRAPHITE}
          strokeOpacity={0.30}
          strokeWidth={0.8}
        />
        {/* Cylindrical body */}
        <rect
          x={14}
          y={21}
          width={24}
          height={47}
          rx={2}
          fill="url(#vs-glass)"
          stroke={GRAPHITE}
          strokeOpacity={0.30}
          strokeWidth={0.8}
        />
        {/* Reflective glass highlight (left edge) */}
        <rect x={16} y={23} width={1.5} height={42} rx={0.75} fill="#FFFFFF" opacity={0.40} />
        {/* Liquid (post-reconstitution) fills lower ~55% of body */}
        <rect x={15.5} y={42} width={21} height={25} rx={1.5} fill="url(#vs-liquid)" />
        {/* Subtle meniscus line where liquid meets air */}
        <line x1={15.5} y1={42} x2={36.5} y2={42} stroke={AMBER_DARK} strokeOpacity={0.45} strokeWidth={0.6} />
        {/* Label band — bone background with amber border, V monogram */}
        <rect
          x={13}
          y={32}
          width={26}
          height={16}
          rx={1.5}
          fill={BONE}
          stroke={AMBER_DARK}
          strokeOpacity={0.45}
          strokeWidth={0.8}
        />
        {/* Tiny "tick" lines on the label suggesting product info */}
        <line x1={16} y1={36} x2={26} y2={36} stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={0.5} />
        <line x1={16} y1={45} x2={22} y2={45} stroke={GRAPHITE} strokeOpacity={0.25} strokeWidth={0.5} />
        {/* V monogram on the label */}
        <g transform="translate(31 41)">
          <path
            d="M-4 -3 L0 3 L4 -3"
            stroke={FOREST}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      {/* ─── Syringe — horizontal, drawing from vial direction ─── */}
      <g transform="translate(54 24) rotate(20)">
        {/* Barrel */}
        <rect
          x={0}
          y={0}
          width={42}
          height={10}
          rx={1.5}
          fill={BONE}
          stroke={GRAPHITE}
          strokeOpacity={0.32}
          strokeWidth={0.9}
        />
        {/* Liquid fill in barrel */}
        <rect x={2} y={2} width={14} height={6} rx={1} fill={AMBER_DARK} opacity={0.58} />
        {/* Tick marks */}
        <line x1={20} y1={2} x2={20} y2={4} stroke={GRAPHITE} strokeOpacity={0.45} strokeWidth={0.8} />
        <line x1={26} y1={2} x2={26} y2={4} stroke={GRAPHITE} strokeOpacity={0.45} strokeWidth={0.8} />
        <line x1={32} y1={2} x2={32} y2={4} stroke={GRAPHITE} strokeOpacity={0.45} strokeWidth={0.8} />
        {/* Needle hub */}
        <rect x={-3} y={3} width={3} height={4} fill={GRAPHITE} opacity={0.55} />
        {/* Needle */}
        <rect x={-13} y={4} width={10} height={2} fill={GRAPHITE} opacity={0.45} />
        {/* Plunger shaft */}
        <rect x={42} y={3.5} width={10} height={3} fill={GRAPHITE} opacity={0.30} />
        {/* Plunger thumb */}
        <rect x={50} y={0} width={4} height={10} rx={1} fill={AMBER_DARK} />
      </g>
    </svg>
  );
}

// ─── 5. OPEN VIAL WITH WATER DROPLET — "the moment of reconstitution" ──────

export function VialDroplet({ size = 88 }: Props) {
  const w = size * 0.82;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 66 80" fill="none">
      <defs>
        <linearGradient id="drop-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
        <linearGradient id="drop-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AMBER_DARK} stopOpacity="0.30" />
          <stop offset="1" stopColor={AMBER_DARK} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <ellipse cx={33} cy={75} rx={16} ry={2.5} fill={GRAPHITE} opacity={0.10} />
      {/* Water droplet falling above the vial */}
      <path
        d="M33 8 C30 11, 28 14, 28 17 C28 20, 30 22, 33 22 C36 22, 38 20, 38 17 C38 14, 36 11, 33 8 Z"
        fill={FOREST}
        opacity={0.55}
      />
      {/* Vial with cap removed — open mouth */}
      <rect x={20} y={26} width={26} height={4} fill={AMBER_LIGHT} opacity={0.35} />
      <ellipse cx={33} cy={26} rx={13} ry={2} fill={BONE} stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={1} />
      {/* Body */}
      <rect x={20} y={26} width={26} height={42} rx={3} fill="url(#drop-glass)" stroke={GRAPHITE} strokeOpacity={0.30} strokeWidth={1} />
      {/* Liquid in lower portion */}
      <rect x={22} y={48} width={22} height={18} rx={2} fill="url(#drop-liquid)" />
      {/* V mark on label */}
      <g transform="translate(33 56)">
        <path d="M-5 -4 L0 4 L5 -4" stroke={FOREST} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

// ─── 6. V-MONOGRAM IN FOREST CIRCLE — minimal brand mark ───────────────────

export function VMonogram({ size = 88 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" fill="none">
      <circle cx={44} cy={44} r={42} fill={CREAM} stroke={FOREST} strokeOpacity={0.30} strokeWidth={1.5} />
      <g transform="translate(44 50)">
        <path
          d="M-18 -14 L0 16 L18 -14"
          stroke={FOREST}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M-18 -14 L0 16 L18 -14"
          stroke={AMBER_DARK}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
