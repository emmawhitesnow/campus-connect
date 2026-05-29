import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, MessageSquare, Phone, Heart } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ConstellationCanvas } from "@/components/ConstellationCanvas";
import { DragSheet } from "@/components/DragSheet";
import { Avatar } from "@/components/Avatar";
import { friends } from "@/data/mock";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Network — Orbit" },
      { name: "description", content: "Your campus relationships visualized as a constellation. Spot strained ties and reach out." },
      { property: "og:title", content: "Network — Orbit" },
      { property: "og:description", content: "Pan and pinch your social constellation. Reconnect with one tap." },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  const sorted = [...friends].sort((a, b) => b.mutuals - a.mutuals).slice(0, 15);

  return (
    <div className="relative h-[calc(100dvh-7rem)] md:h-[calc(900px-7rem)] -mb-28">
      <ScreenHeader
        title="Your Network"
        back="/"
        right={<button className="text-primary"><Search size={22} /></button>}
      />
      <div className="absolute inset-0 top-14">
        <ConstellationCanvas />
        <DragSheet>
          <div className="flex items-center gap-2 pt-2 pb-3">
            <button className="flex items-center gap-1.5 rounded-full bg-background border border-border px-4 py-2 text-sm font-semibold text-primary">
              <SlidersHorizontal size={14} /> Filter
            </button>
            <div className="flex-1 flex items-center gap-2 rounded-full bg-background border border-border px-4 py-2 text-sm text-muted-foreground">
              <Search size={14} /> Search
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mt-3 mb-1 px-1">Most talked to</p>
          <div className="divide-y divide-border">
            {sorted.map((f) => (
              <div key={f.id} className="flex items-center gap-3 py-3">
                <Avatar seed={f.name} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">{f.mutuals} mutuals · {f.lastTalked}d ago</p>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <button aria-label="Message"><MessageSquare size={18} /></button>
                  <button aria-label="Call"><Phone size={18} /></button>
                  <button aria-label="Favorite"><Heart size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </DragSheet>
      </div>
    </div>
  );
}
