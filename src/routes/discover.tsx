import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Calendar, MessageCircle, Search, Star, Filter, Plus, ArrowUp, Check } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { discoverClubs, discoverEvents, adviceThreads } from "@/data/mock";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Orbit" },
      { name: "description", content: "Find clubs that fit, events your friends are free for, and advice from upperclassmen." },
      { property: "og:title", content: "Discover — Orbit" },
      { property: "og:description", content: "Clubs, events, and crowdsourced advice from your campus." },
    ],
  }),
  component: DiscoverPage,
});

type Tab = "clubs" | "events" | "advice";

function DiscoverPage() {
  const [tab, setTab] = useState<Tab>("clubs");

  return (
    <div>
      <ScreenHeader title="Discover" back="/" />
      <div className="px-5">
        <p className="text-center text-primary/80 mt-2">What are you looking for?</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <CategoryCard active={tab === "clubs"} onClick={() => setTab("clubs")} icon={Users} label="Clubs" />
          <CategoryCard active={tab === "events"} onClick={() => setTab("events")} icon={Calendar} label="Events" />
          <CategoryCard active={tab === "advice"} onClick={() => setTab("advice")} icon={MessageCircle} label="Advice" />
        </div>

        <button className="mt-5 w-full flex items-center justify-between rounded-full bg-accent text-accent-foreground px-5 py-3.5 shadow-sm">
          <span className="text-sm font-medium opacity-90">Start typing…</span>
          <Search size={20} />
        </button>

        <div className="mt-6 pb-6">
          {tab === "clubs" && <ClubsList />}
          {tab === "events" && <EventsList />}
          {tab === "advice" && <AdviceList />}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  active, onClick, icon: Icon, label,
}: { active: boolean; onClick: () => void; icon: typeof Users; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-card text-primary"
      }`}
    >
      <Icon size={28} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function ClubsList() {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {["All", "Outdoors", "Performance", "Music", "Academic", "Food"].map((c, i) => (
          <button
            key={c}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
              i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-background text-primary border-border"
            }`}
          >
            {c}
          </button>
        ))}
        <button className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border border-border bg-background text-primary inline-flex items-center gap-1">
          <Filter size={12} /> Filter
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {discoverClubs.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card p-4 flex items-start gap-3">
            <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-primary truncate">{c.name}</p>
                <span className="text-[10px] rounded-full bg-primary/10 text-primary px-1.5 py-0.5 font-semibold">{c.tag}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                <Star size={11} className="fill-accent text-accent" />
                <span className="font-semibold text-primary">{c.rating}</span>
                <span>· {c.reviews} reviews · #{c.rank} on campus</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {c.friendsIn} friends are members · {c.commitment} commitment
              </p>
            </div>
            <button
              onClick={() => setJoined((j) => ({ ...j, [c.id]: !j[c.id] }))}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 inline-flex items-center gap-1 ${
                joined[c.id] ? "bg-success/15 text-primary" : "bg-primary text-primary-foreground"
              }`}
            >
              {joined[c.id] ? <><Check size={12} /> Joined</> : "Join"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function EventsList() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = 4;
  return (
    <>
      <div className="flex gap-2 justify-between">
        {days.map((d, i) => (
          <button
            key={d}
            className={`flex-1 rounded-2xl py-2 flex flex-col items-center gap-0.5 ${
              i === today ? "bg-primary text-primary-foreground" : "bg-card text-primary"
            }`}
          >
            <span className="text-[10px] font-medium opacity-80">{d}</span>
            <span className="text-sm font-bold">{20 + i}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {discoverEvents.map((e) => (
          <div key={e.id} className="rounded-2xl bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-accent">{e.day} · {e.time}</p>
                <p className="text-sm font-bold text-primary mt-0.5">{e.title}</p>
                <p className="text-[11px] text-muted-foreground">{e.location}</p>
              </div>
              <button className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-3 py-1.5">
                Going
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-primary"><b>{e.friendsGoing}</b> friends going</span>
              <span className="rounded-full bg-accent/15 text-primary px-2 py-1 font-semibold">
                {e.friendsFree} friends free → Schedule
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdviceList() {
  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {["All", "Academics", "Housing", "Greek life", "Dining", "Wellness"].map((c, i) => (
          <button
            key={c}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
              i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-background text-primary border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {adviceThreads.map((t) => (
          <div key={t.id} className="rounded-2xl bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5 font-semibold">{t.tag}</span>
              <span className="text-[10px] text-muted-foreground">answered by {t.answeredBy}</span>
            </div>
            <p className="text-sm font-bold text-primary mt-2">{t.title}</p>
            <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ArrowUp size={12} /> {t.upvotes}</span>
              <span>{t.answers} answers</span>
            </div>
          </div>
        ))}
      </div>
      <button className="fixed bottom-28 right-6 z-10 rounded-full bg-accent text-accent-foreground px-4 py-3 text-sm font-bold shadow-lg inline-flex items-center gap-2"
        style={{ position: "absolute" }}>
        <Plus size={16} /> Ask
      </button>
    </>
  );
}
