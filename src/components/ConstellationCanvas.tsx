import { useEffect, useMemo, useRef, useState } from "react";
import { friends } from "@/data/mock";
import { X, MessageSquare, Phone } from "lucide-react";
import { closenessColor, relationScore } from "@/lib/colors";
import { useInteractions } from "@/components/InteractionContext";

type Node = { id: string; name: string; x: number; y: number; closeness: number; lastTalked: number; score: number };
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
    { id: "me", name: "Me", x: W / 2, y: H / 2, closeness: 1, lastTalked: 0, score: 1 },
    ...friends.slice(0, 20).map((f) => ({
      id: f.id,
      name: f.name,
      x: 60 + rand() * (W - 120),
      y: 60 + rand() * (H - 120),
      closeness: f.closeness,
      lastTalked: f.lastTalked,
      score: relationScore(f.closeness, f.lastTalked),
    })),
  ];
  const edges: Edge[] = [];
  const sorted = [...nodes.slice(1)].sort((a, b) => b.closeness - a.closeness);
  sorted.slice(0, 10).forEach((n) => edges.push({ a: "me", b: n.id }));
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
  const [alertVisible, setAlertVisible] = useState(false);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDist = useRef<number | null>(null);
  const lastPan = useRef<{ x: number; y: number } | null>(null);
  const { message, call } = useInteractions();

  useEffect(() => {
    const t = setTimeout(() => setAlertVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) lastPan.current = { x: e.clientX, y: e.clientY };
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
  const selStrained = sel && sel.id !== "me" && sel.lastTalked > 20;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none select-none"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.97 0.012 270) 0%, oklch(0.92 0.02 270) 100%)" }}
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
        <defs>
          {nodes.map((n) => (
            <radialGradient key={`g-${n.id}`} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={closenessColor(n.score)} stopOpacity="0.55" />
              <stop offset="100%" stopColor={closenessColor(n.score)} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {edges.map((e, i) => {
          const a = nodeMap[e.a], b = nodeMap[e.b];
          if (!a || !b) return null;
          const s = Math.max(a.score, b.score);
          const col = closenessColor(s);
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={col}
              strokeOpacity={0.18 + s * 0.45}
              strokeWidth={s > 0.7 ? 1.5 : 1}
            />
          );
        })}
        {nodes.map((n) => {
          const isMe = n.id === "me";
          const r = isMe ? 26 : 12 + n.closeness * 10;
          const isSel = selected === n.id;
          const fill = isMe ? "var(--color-primary)" : closenessColor(n.score);
          return (
            <g
              key={n.id}
              onPointerDown={(e) => { e.stopPropagation(); setSelected(n.id); }}
              style={{ cursor: "pointer" }}
            >
              {/* glow halo */}
              <circle cx={n.x} cy={n.y} r={r * 2.4} fill={`url(#glow-${n.id})`} />
              <circle cx={n.x} cy={n.y} r={r + 5} fill="white" opacity="0.85" />
              <circle
                cx={n.x} cy={n.y} r={r}
                fill={fill}
                stroke={isSel ? "var(--color-accent)" : "white"}
                strokeWidth={isSel ? 3 : 2}
              />
              {isSel && !isMe && (
                <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="2">
                  <animate attributeName="r" from={r + 4} to={r + 14} dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.6" to="0" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              {isMe && (
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="800">M</text>
              )}
              {!isMe && (
                <text x={n.x} y={n.y + r + 12} textAnchor="middle" fill="var(--color-primary)" fontSize="9" fontWeight="600" opacity="0.7">
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {sel && sel.id !== "me" && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-[88%] max-w-[320px] rounded-2xl bg-background border-2 ${
            selStrained ? "border-[oklch(0.65_0.22_25)]" : "border-primary"
          } shadow-lg p-4 z-10 transition-all duration-500 ease-out`}
          style={{
            top: alertVisible ? 16 : -120,
            opacity: alertVisible ? 1 : 0,
          }}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-2 right-2 text-muted-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <p className={`text-xs font-bold ${selStrained ? "text-[oklch(0.55_0.22_25)]" : "text-primary"}`}>
            {selStrained ? "Maintenance Alert" : "Recent connection"}
          </p>
          <p className="text-sm text-primary mt-1">
            {selStrained ? (
              <>It's been <span className="font-bold">{sel.lastTalked} days</span> since you talked to {sel.name}.</>
            ) : (
              <>You talked to <span className="font-bold">{sel.name}</span> {sel.lastTalked} day{sel.lastTalked === 1 ? "" : "s"} ago.</>
            )}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => message(sel.name)}
              className="flex-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold py-2 inline-flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={14} /> Message
            </button>
            <button
              onClick={() => call(sel.name)}
              className="rounded-full bg-card text-primary border border-border text-xs font-semibold py-2 px-3 inline-flex items-center gap-1.5"
            >
              <Phone size={14} /> Call
            </button>
          </div>
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
          aria-label="Re-center"
        >⌖</button>
      </div>
    </div>
  );
}
