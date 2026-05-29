import { useRef, useState } from "react";
import { MessageSquare, Share, Heart, X } from "lucide-react";

export type Candidate = {
  id: string;
  name: string;
  age: string;
  pronouns: string;
  major: string;
  bio: string;
  chip: string;
  photoSeed: string;
};

const GRADIENTS = [
  "linear-gradient(135deg, #FDE2C7 0%, #F5A623 100%)",
  "linear-gradient(135deg, #E0E5FA 0%, #2B3A8C 100%)",
  "linear-gradient(135deg, #F7D7E3 0%, #C24E7C 100%)",
  "linear-gradient(135deg, #E6DCF7 0%, #7B4FCF 100%)",
];

function gradFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export function SwipeStack({ candidates }: { candidates: Candidate[] }) {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const visible = candidates.slice(idx, idx + 3);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    start.current = e.clientX;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (start.current == null) return;
    setDrag(e.clientX - start.current);
  }
  function onPointerUp() {
    if (Math.abs(drag) > 100) {
      setIdx((i) => (i + 1) % candidates.length);
    }
    setDrag(0);
    start.current = null;
  }
  function swipe(dir: -1 | 1) {
    setDrag(dir * 200);
    setTimeout(() => {
      setIdx((i) => (i + 1) % candidates.length);
      setDrag(0);
    }, 220);
  }

  return (
    <div className="relative h-[440px] select-none">
      {visible.map((c, i) => {
        const isTop = i === 0;
        const offset = i * 6;
        const rot = isTop ? drag * 0.06 : 0;
        const tx = isTop ? drag : 0;
        const op = isTop ? 1 : 1 - i * 0.1;
        const scale = isTop ? 1 : 1 - i * 0.04;
        return (
          <div
            key={c.id + i}
            className="absolute inset-x-0 top-0 rounded-3xl overflow-hidden shadow-md bg-card touch-none"
            style={{
              transform: `translate(${tx}px, ${offset}px) rotate(${rot}deg) scale(${scale})`,
              transition: start.current ? "none" : "transform 0.22s ease, opacity 0.22s ease",
              opacity: op,
              zIndex: visible.length - i,
            }}
            onPointerDown={isTop ? onPointerDown : undefined}
            onPointerMove={isTop ? onPointerMove : undefined}
            onPointerUp={isTop ? onPointerUp : undefined}
            onPointerCancel={isTop ? onPointerUp : undefined}
          >
            <div
              className="h-56 relative"
              style={{ background: gradFor(c.photoSeed) }}
            >
              <div className="absolute inset-0 grid place-items-center text-6xl font-extrabold text-white/80">
                {c.name[0]}
              </div>
              {isTop && drag > 40 && (
                <div className="absolute top-4 left-4 rounded-md border-2 border-success px-2 py-1 text-success font-extrabold rotate-[-8deg]">CONNECT</div>
              )}
              {isTop && drag < -40 && (
                <div className="absolute top-4 right-4 rounded-md border-2 border-destructive px-2 py-1 text-destructive font-extrabold rotate-[8deg]">PASS</div>
              )}
            </div>
            <div className="bg-primary text-primary-foreground p-4 relative">
              <span className="absolute -top-3 right-4 rounded-full bg-accent text-accent-foreground text-[11px] font-bold px-3 py-1.5 shadow">
                {c.chip}
              </span>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xl font-extrabold leading-tight">{c.name}</p>
                  <p className="text-[12px] opacity-80">{c.age} | {c.pronouns}</p>
                  <p className="text-[12px] opacity-80">{c.major}</p>
                </div>
                <div className="flex items-center gap-3 opacity-90">
                  <button aria-label="Message"><MessageSquare size={18} /></button>
                  <button aria-label="Share"><Share size={18} /></button>
                  <button aria-label="Favorite"><Heart size={18} /></button>
                </div>
              </div>
              <p className="text-[12px] mt-2 opacity-90 leading-snug">{c.bio}</p>
            </div>
          </div>
        );
      })}

      <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center gap-6 z-20">
        <button
          onClick={() => swipe(-1)}
          className="size-12 rounded-full bg-primary/90 text-primary-foreground grid place-items-center shadow-lg"
          aria-label="Pass"
        >
          <X size={22} />
        </button>
        <div className="flex items-center gap-1">
          {candidates.slice(0, 5).map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${i === idx % 5 ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <button
          onClick={() => swipe(1)}
          className="size-12 rounded-full bg-success text-primary-foreground grid place-items-center shadow-lg"
          aria-label="Connect"
        >
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
}
