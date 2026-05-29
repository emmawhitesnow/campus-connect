import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { addableContacts } from "@/data/mock";
import { useApp } from "@/store/app";
import { Search, Check, UserPlus } from "lucide-react";

export const Route = createFileRoute("/friends/add")({
  head: () => ({ meta: [{ title: "Add a friend — Orbit" }] }),
  component: AddFriendPage,
});

function AddFriendPage() {
  const [q, setQ] = useState("");
  const added = useApp((s) => s.addedFriends);
  const toggle = useApp((s) => s.toggleAddedFriend);
  const list = useMemo(
    () => addableContacts.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <div>
      <ScreenHeader title="Add a friend" back="/" />
      <div className="px-5 pb-10">
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-primary">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or @username"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            autoFocus
          />
        </div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mt-5 mb-2">Suggested</p>
        <div className="rounded-3xl bg-card divide-y divide-border overflow-hidden">
          {list.map((c) => {
            const isAdded = !!added[c.id];
            return (
              <div key={c.id} className="flex items-center gap-3 p-3">
                <Avatar seed={c.name} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.year} | {c.mutuals} mutuals {c.onOrbit && "| on Orbit"}
                  </p>
                </div>
                <button
                  onClick={() => toggle(c.id)}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 inline-flex items-center gap-1 ${
                    isAdded
                      ? "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.14_150)]"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isAdded ? <><Check size={12} /> Requested</> : <><UserPlus size={12} /> Add</>}
                </button>
              </div>
            );
          })}
          {list.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No matches.</p>
          )}
        </div>
      </div>
    </div>
  );
}
