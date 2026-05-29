import { useEffect, useRef, useState } from "react";

export function StatRing({
  value,
  unit,
  label,
  percent,
  delay = 0,
}: {
  value: string | number;
  unit?: string;
  label: string;
  percent: number; // 0..100
  delay?: number;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const [animPct, setAnimPct] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setAnimPct(0);
    const t = setTimeout(() => {
      raf.current = requestAnimationFrame(() => setAnimPct(percent));
    }, delay);
    return () => { clearTimeout(t); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [percent, delay]);

  const offset = c - (animPct / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-24">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke="var(--color-primary)" strokeWidth="4"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-extrabold text-primary leading-none">
            {value}{unit && <span className="text-sm">{unit}</span>}
          </p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1 text-center leading-tight px-1">{label}</p>
    </div>
  );
}
