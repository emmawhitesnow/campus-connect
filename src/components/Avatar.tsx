// Deterministic SVG avatar from a seed string — no external deps.
const PALETTE = [
  ["#FDE2C7", "#F5A623"],
  ["#E0E5FA", "#2B3A8C"],
  ["#D6F0E3", "#3B8C6E"],
  ["#F7D7E3", "#C24E7C"],
  ["#E6DCF7", "#7B4FCF"],
  ["#FFE6BF", "#D97706"],
];

function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({
  seed,
  size = 40,
  className = "",
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const h = hash(seed);
  const [bg, fg] = PALETTE[h % PALETTE.length];
  const initial = (seed[0] || "?").toUpperCase();
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold select-none shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      {initial}
    </div>
  );
}
