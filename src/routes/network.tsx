import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, MessageSquare, Phone, Heart } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ConstellationCanvas } from "@/components/ConstellationCanvas";
import { DragSheet } from "@/components/DragSheet";
import { Avatar } from "@/components/Avatar";
import { friends } from "@/data/mock";
import { useApp } from "@/store/app";
import { useInteractions } from "@/components/InteractionContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Network — Orbit" },
      { name: "description", content: "Your campus relationships visualized as a constellation. Spot strained ties and reach out." },
    ],
  }),
  component: NetworkPage,
});

type Sort = "favorites" | "newest" | "oldest" | "most" | "least";

function NetworkPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("most");
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const { message, call } = useInteractions();

  const list = useMemo(() => {
    let arr = friends.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
    switch (sort) {
      case "favorites": arr = arr.filter((f) => favorites[f.id]); break;
      case "newest": arr = [...arr].sort((a, b) => a.lastTalked - b.lastTalked); break;
      case "oldest": arr = [...arr].sort((a, b) => b.lastTalked - a.lastTalked); break;
      case "most": arr = [...arr].sort((a, b) => b.mutuals - a.mutuals); break;
      case "least": arr = [...arr].sort((a, b) => a.mutuals - b.mutuals); break;
    }
    return arr;
  }, [q, sort, favorites]);

  return (
    <div className="relative h-[calc(100%+7rem)] -mb-28">
      <ScreenHeader title="Your Network" back="/" />
      <div className="absolute inset-0 top-14">
        <ConstellationCanvas />
        <DragSheet>
          <div className="flex items-center gap-2 pt-2 pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full bg-background border border-border px-4 py-2 text-sm font-semibold text-primary">
                <SlidersHorizontal size={14} /> Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => setSort("favorites")}>Favorites only</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("newest")}>Newest contact</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("oldest")}>Oldest contact</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("most")}>Most talked to</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("least")}>Least talked to</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex-1 flex items-center gap-2 rounded-full bg-background border border-border px-4 py-2 text-sm text-primary">
              <Search size={14} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search friends"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mt-3 mb-1 px-1">
            {sortLabel(sort)}
          </p>
          <div className="divide-y divide-border">
            {list.map((f) => {
              const fav = !!favorites[f.id];
              return (
                <div key={f.id} className="flex items-center gap-3 py-3">
                  <Avatar seed={f.name} size={42} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">{f.mutuals} mutuals | {f.lastTalked}d ago</p>
                  </div>
                  <div className="flex items-center gap-3 text-primary">
                    <button aria-label="Message" onClick={() => message(f.name)}><MessageSquare size={18} /></button>
                    <button aria-label="Call" onClick={() => call(f.name)}><Phone size={18} /></button>
                    <button
                      aria-label="Favorite"
                      onClick={() => toggleFavorite(f.id)}
                      className="transition-transform active:scale-125"
                    >
                      <Heart
                        size={18}
                        className={fav ? "fill-[oklch(0.65_0.22_15)] text-[oklch(0.65_0.22_15)]" : ""}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
            {list.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">No friends match.</p>
            )}
          </div>
        </DragSheet>
      </div>
    </div>
  );
}

function sortLabel(s: Sort) {
  return {
    favorites: "Favorites only",
    newest: "Most recent",
    oldest: "Longest gap",
    most: "Most talked to",
    least: "Least talked to",
  }[s];
}
