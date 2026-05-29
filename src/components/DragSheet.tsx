import { useRef, useState, type ReactNode } from "react";

// Three snap points as fractions of container height from top: 0 = full, 0.5 = half, 0.85 = peek
const SNAPS = [0.12, 0.5, 0.85];

export function DragSheet({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState(1); // index into SNAPS — start half
  const dragStart = useRef<{ y: number; snap: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = { y: e.clientY, snap };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragStart.current) return;
    setDragOffset(e.clientY - dragStart.current.y);
  }
  function onPointerUp() {
    if (!dragStart.current) return;
    const containerH = window.innerHeight;
    const currentTop = SNAPS[dragStart.current.snap] * containerH + dragOffset;
    const currentFrac = currentTop / containerH;
    // pick closest snap
    let best = 0;
    let bestDist = Infinity;
    SNAPS.forEach((s, i) => {
      const d = Math.abs(s - currentFrac);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setSnap(best);
    setDragOffset(0);
    dragStart.current = null;
  }

  const topPct = `${SNAPS[snap] * 100}%`;
  const transform = dragStart.current ? `translateY(${dragOffset}px)` : undefined;

  return (
    <div
      className="absolute left-0 right-0 bottom-0 z-10 bg-card rounded-t-3xl shadow-[0_-8px_30px_-10px_rgba(43,58,140,0.2)] flex flex-col"
      style={{
        top: topPct,
        transform,
        transition: dragStart.current ? "none" : "top 0.25s ease",
      }}
    >
      <div
        className="pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">{children}</div>
    </div>
  );
}
