import { useEffect, useMemo, useRef, useState } from "react";
import { friends } from "@/data/mock";
import { Avatar } from "@/components/Avatar";
import { MessageSquare, X } from "lucide-react";

type Node = { id: string; name: string; x: number; y: number; closeness: number; lastTalked: number };
type Edge = { a: string; b: string };

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const rand = seededRand(7);
  const W = 600, H = 600;
  const nodes: Node[] = [
    { id: "me", name: "Me", x: W / 2, y: H / 2, closeness: 1, lastTalked: 0 },
    ...friends.slice(0, 22).map((f) => ({
      id: f.id,
      name: f.name,
      x: 60 + rand() * (W - 120),
      y: 60 + rand() * (H - 120),
      closeness: f.closeness,
      lastTalked: f.lastTalked,
    })),
  ];
  const edges: Edge[] = [];
  // connect "me" to closest 8
  const sorted = [...nodes.slice(1)].sort((a, b) => b.closeness - a.closeness);
  sorted.slice(0, 10).forEach((n) => edges.push({ a: "me", b: n.id }));
  // random extra edges among friends
  for (let i = 1; i < nodes.length; i++) {
    const k = Math.floor(rand() * 3);
    for (let j = 0; j < k; j++) {
      const other = nodes[1 + Math.floor(rand() * (nodes.length - 1))];
      if (other.id !== nodes[i].id) edges.push({ a: nodes[i].id, b: other.id });
    }
  }
  return { nodes, edges };
}

export function ConstellationCanvas() {
  const { nodes, edges } = useMemo(buildGraph, []);
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [selected, setSelected] = useState<string | null>("f3");
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDist = useRef<number | null>(null);
  const lastPan = useRef<{ x: number; y: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      lastPan.current = { x: e.clientX, y: e.clientY };
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [p1, p2] = Array.from(pointers.current.values());
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (lastPinchDist.current != null) {
        const delta = dist / lastPinchDist.current;
        setTransform((t) => ({ ...t, k: Math.max(0.5, Math.min(2.5, t.k * delta)) }));
      }
      lastPinchDist.current = dist;
      lastPan.current = null;
    } else if (pointers.current.size === 1 && lastPan.current) {
      const dx = e.clientX - lastPan.current.x;
      const dy = e.clientY - lastPan.current.y;
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
      lastPan.current = { x: e.clientX, y: e.clientY };
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinchDist.current = null;
    if (pointers.current.size === 0) lastPan.current = null;
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setTransform((t) => ({ ...t, k: Math.max(0.5, Math.min(2.5, t.k * (1 - e.deltaY * 0.002))) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const sel = selected ? nodeMap[selected] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none select-none bg-gradient-to-b from-background to-card"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
          transformOrigin: "center center",
          transition: pointers.current.size ? "none" : "transform 0.15s ease",
        }}
      >
        {edges.map((e, i) => {
          const a = nodeMap[e.a], b = nodeMap[e.b];
          if (!a || !b) return null;
          const strained = Math.max(a.lastTalked, b.lastTalked) > 20;
          const close = Math.max(a.closeness, b.closeness);
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={strained ? "#C24E7C" : "#2B3A8C"}
              strokeOpacity={strained ? 0.6 : 0.15 + close * 0.35}
              strokeWidth={strained ? 1.5 : 1}
              strokeDasharray={strained ? "4 3" : undefined}
            />
          );
        })}
        {nodes.map((n) => {
          const isMe = n.id === "me";
          const strained = n.lastTalked > 20;
          const r = isMe ? 28 : 14 + n.closeness * 8;
          return (
            <g
              key={n.id}
              onPointerDown={(e) => { e.stopPropagation(); setSelected(n.id); }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={n.x} cy={n.y} r={r + 4} fill="white" />
              <circle
                cx={n.x} cy={n.y} r={r}
                fill={isMe ? "#2B3A8C" : strained ? "#E8D0DC" : "#E0E5FA"}
                stroke={selected === n.id ? "#F5A623" : strained ? "#C24E7C" : "#2B3A8C"}
                strokeWidth={selected === n.id ? 3 : isMe ? 2 : 1}
                strokeOpacity={isMe ? 1 : 0.5}
              />
              {isMe && (
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">M</text>
              )}
              {strained && !isMe && (
                <circle cx={n.x + r * 0.7} cy={n.y - r * 0.7} r={5} fill="#C24E7C" />
              )}
            </g>
          );
        })}
      </svg>

      {sel && sel.id !== "me" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[88%] max-w-[320px] rounded-2xl bg-background border-2 border-primary shadow-lg p-4 z-10">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-2 right-2 text-muted-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <p className="text-xs font-bold text-primary">Maintenance Alert</p>
          <p className="text-sm text-primary mt-1">
            It's been <span className="font-bold">{sel.lastTalked} days</span> since you talked to {sel.name}.
          </p>
          <button className="mt-3 w-full rounded-full bg-primary text-primary-foreground text-xs font-semibold py-2 inline-flex items-center justify-center gap-1.5">
            <MessageSquare size={14} /> Send a message
          </button>
        </div>
      )}

      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        <button
          onClick={() => setTransform((t) => ({ ...t, k: Math.min(2.5, t.k * 1.2) }))}
          className="size-9 rounded-full bg-background border border-border shadow-sm text-primary font-bold"
        >+</button>
        <button
          onClick={() => setTransform((t) => ({ ...t, k: Math.max(0.5, t.k * 0.83) }))}
          className="size-9 rounded-full bg-background border border-border shadow-sm text-primary font-bold"
        >−</button>
        <button
          onClick={() => setTransform({ x: 0, y: 0, k: 1 })}
          className="size-9 rounded-full bg-background border border-border shadow-sm text-primary text-[10px] font-bold"
        >⌖</button>
      </div>
    </div>
  );
}

export { Avatar };
