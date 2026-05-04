type AppIconProps = {
  size?: number;
  className?: string;
  withHalo?: boolean;
};

export function AppIcon({ size = 130, className, withHalo = true }: AppIconProps) {
  const haloSize = Math.round(size * 1.6);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: haloSize, height: haloSize }}
    >
      {withHalo ? (
        <div
          aria-hidden
          className="amber-halo absolute inset-0 rounded-full"
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Vialwise app icon"
        className="float-slow drop-shadow-[0_18px_40px_rgba(166,90,48,0.25)]"
      >
        <defs>
          <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CB7B4F" />
            <stop offset="100%" stopColor="#A65A30" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1024" height="1024" rx="226" fill="url(#amberGrad)" />
        <path
          d="M187 290 L512 785 L837 290"
          stroke="#2F5234"
          strokeWidth="125"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M187 290 L512 785 L837 290"
          stroke="#FBF7F0"
          strokeWidth="91"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function VMark({
  size = 24,
  className,
  color = "currentColor",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vialwise V mark"
      className={className}
    >
      <path
        d="M18 28 L50 76 L82 28"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
