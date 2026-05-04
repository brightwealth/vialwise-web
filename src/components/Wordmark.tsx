type WordmarkProps = {
  className?: string;
  size?: number;
};

export function Wordmark({ className, size = 28 }: WordmarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-outfit), 'Cabinet Grotesk', Inter, system-ui, sans-serif",
        fontWeight: 500,
        fontSize: `${size}px`,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: "currentColor",
      }}
    >
      vialwise
    </span>
  );
}
