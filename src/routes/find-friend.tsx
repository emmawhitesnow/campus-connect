import { createFileRoute } from "@tanstack/react-router";
import { Menu, Coffee, Sparkles } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SwipeStack } from "@/components/SwipeCard";
import { findFriendCandidates, circleCandidates } from "@/data/mock";

export const Route = createFileRoute("/find-friend")({
  head: () => ({
    meta: [
      { title: "Find a Friend — Orbit" },
      { name: "description", content: "Swipe through students with shared interests and mutual friends. Schedule a coffee chat in one tap." },
      { property: "og:title", content: "Find a Friend — Orbit" },
      { property: "og:description", content: "Discover students you'd actually want to know." },
    ],
  }),
  component: FindFriendPage,
});

const ICEBREAKERS = [
  "What's your most controversial Foco take?",
  "If you weren't your major, what would you be?",
  "Best study spot nobody knows about?",
];

function FindFriendPage() {
  return (
    <div>
      <ScreenHeader
        title="Find a Friend"
        back="/"
        right={<button className="text-primary"><Menu size={22} /></button>}
      />
      <div className="px-5 space-y-8 pb-10">
        <section>
          <h2 className="text-sm font-semibold text-primary mb-3">People you might like</h2>
          <SwipeStack candidates={findFriendCandidates} />
        </section>

        <section className="pt-4">
          <h2 className="text-sm font-semibold text-primary mb-3">People in your circle</h2>
          <SwipeStack candidates={circleCandidates} />
        </section>

        <section className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-accent" />
            <h2 className="text-sm font-semibold text-primary">Icebreakers for your next match</h2>
          </div>
          <div className="space-y-2">
            {ICEBREAKERS.map((q) => (
              <div key={q} className="rounded-2xl bg-card p-3.5 text-sm text-primary">
                "{q}"
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-primary text-primary-foreground p-4 flex items-center gap-3">
          <div className="size-11 rounded-full bg-accent/30 grid place-items-center">
            <Coffee size={20} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">3 pending coffee chats</p>
            <p className="text-[11px] opacity-80">Tap to confirm times with new friends.</p>
          </div>
          <button className="rounded-full bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5">View</button>
        </section>
      </div>
    </div>
  );
}
