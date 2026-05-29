import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, Calendar, MessageCircle, Search, Star, Filter, Plus, ArrowUp, Check, X } from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { discoverClubs, discoverEvents, adviceThreads } from "@/data/mock";
import { useApp } from "@/store/app";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Orbit" },
      { name: "description", content: "Find clubs that fit, events your friends are free for, and advice from upperclassmen." },
    ],
  }),
  component: DiscoverPage,
});

type Tab = "clubs" | "events" | "advice";

function DiscoverPage() {
  const [tab, setTab] = useState<Tab>("clubs");
  const [q, setQ] = useState("");

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

        <div className="mt-5 flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-3 shadow-sm">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${tab}…`}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-accent-foreground/70"
          />
        </div>

        <div className="mt-6 pb-6">
          {tab === "clubs" && <ClubsList q={q} />}
          {tab === "events" && <EventsList q={q} />}
          {tab === "advice" && <AdviceList q={q} />}
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

const CLUB_FILTERS = ["All", "Outdoors", "Performance", "Music", "Academic", "Food"];

function ClubsList({ q }: { q: string }) {
  const navigate = useNavigate();
  const joined = useApp((s) => s.joinedClubs);
  const toggleJoined = useApp((s) => s.toggleJoined);
  const [filter, setFilter] = useState("All");

  const list = useMemo(() => {
    return discoverClubs.filter((c) =>
      (filter === "All" || c.tags.includes(filter)) &&
      c.name.toLowerCase().includes(q.toLowerCase()),
    );
  }, [filter, q]);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {CLUB_FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
              filter === c ? "bg-primary text-primary-foreground border-primary" : "bg-background text-primary border-border"
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
        {list.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate({ to: "/clubs/$clubId", params: { clubId: c.id } })}
            className="rounded-2xl bg-card p-4 flex items-start gap-3 cursor-pointer hover:bg-card/80 transition-colors"
          >
            <Avatar seed={c.name} size={48} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-primary truncate">{c.name}</p>
                <span className="text-[10px] rounded-full bg-primary/10 text-primary px-1.5 py-0.5 font-semibold">{c.tag}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                <Star size={11} className="fill-accent text-accent" />
                <span className="font-semibold text-primary">{c.rating}</span>
                <span>| {c.reviews} reviews | #{c.rank} on campus</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {c.friendsIn} friends are members | {c.commitment} commitment
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleJoined(c.id); }}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 inline-flex items-center gap-1 ${
                joined[c.id]
                  ? "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.14_150)]"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {joined[c.id] ? <><Check size={12} /> Joined</> : "Join"}
            </button>
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">No clubs match.</p>}
      </div>
    </>
  );
}

function EventsList({ q }: { q: string }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDays = [
    ...days.map((d, i) => ({ d, date: 20 + i })),
    ...days.map((d, i) => ({ d, date: 27 + i })),
  ];
  const [today, setToday] = useState(4);
  const going = useApp((s) => s.goingEvents);
  const toggleGoing = useApp((s) => s.toggleGoing);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => discoverEvents.filter((e) => e.title.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  
  // Sort: going events at top, no "pinned" label
  const sortedEvents = useMemo(() => {
    const goingEvents = filtered.filter((e) => going[e.id]);
    const notGoingEvents = filtered.filter((e) => !going[e.id]);
    return [...goingEvents, ...notGoingEvents];
  }, [filtered, going]);

  function handleToggleGoing(id: string) {
    // If removing from "going", animate it
    if (going[id]) {
      setAnimatingId(id);
      setTimeout(() => {
        toggleGoing(id);
        setAnimatingId(null);
      }, 300);
    } else {
      toggleGoing(id);
    }
  }

  return (
    <>
      {/* Show partial edge days - add padding to reveal half of first/last item */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-3 snap-x snap-mandatory">
        {fullDays.map((d, i) => (
          <button
            key={i}
            onClick={() => setToday(i)}
            className={`snap-start shrink-0 w-12 rounded-2xl py-2 flex flex-col items-center gap-0.5 ${
              i === today ? "bg-primary text-primary-foreground" : "bg-card text-primary"
            }`}
          >
            <span className="text-[10px] font-medium opacity-80">{d.d}</span>
            <span className="text-sm font-bold">{d.date}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {sortedEvents.map((e) => (
          <EventCard 
            key={e.id} 
            e={e} 
            going={!!going[e.id]} 
            onToggle={() => handleToggleGoing(e.id)} 
            isAnimating={animatingId === e.id}
          />
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">No events match.</p>}
      </div>
    </>
  );
}

function EventCard({
  e, going, onToggle, isAnimating,
}: {
  e: typeof discoverEvents[number];
  going: boolean;
  onToggle: () => void;
  isAnimating?: boolean;
}) {
  return (
    <Link 
      to="/events/$eventId"
      params={{ eventId: e.id }}
      className={`block rounded-2xl bg-card p-4 transition-all duration-300 hover:bg-card/80 ${
        isAnimating ? "opacity-50 translate-y-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary">{e.title}</p>
          <p className="text-[11px] font-semibold text-accent mt-0.5">{e.day} | {e.time}</p>
          <p className="text-[11px] text-muted-foreground">{e.location}</p>
        </div>
        <button
          onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); onToggle(); }}
          className={`text-xs font-semibold rounded-full px-3 py-1.5 inline-flex items-center gap-1 ${
            going
              ? "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.14_150)]"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {going ? <><Check size={12} /> Going</> : "Plan it"}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px]">
        <span className="text-primary"><b>{e.friendsGoing}</b> friends going</span>
        <span className="rounded-full bg-accent/15 text-primary px-2 py-1 font-semibold">
          {e.friendsFree} friends free
        </span>
      </div>
    </Link>
  );
}

const ADVICE_TAGS = ["All", "Academics", "Housing", "Greek life", "Dining", "Wellness"];

function AdviceList({ q }: { q: string }) {
  const posts = useApp((s) => s.advicePosts);
  const all = useMemo(
    () => [...posts.map((p) => ({ ...p, isNew: true } as any)), ...adviceThreads],
    [posts],
  );
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    return all.filter((t) =>
      (tag === "All" || t.tag === tag) &&
      t.title.toLowerCase().includes(q.toLowerCase()),
    );
  }, [all, tag, q]);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
        {ADVICE_TAGS.map((c) => (
          <button
            key={c}
            onClick={() => setTag(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
              tag === c ? "bg-primary text-primary-foreground border-primary" : "bg-background text-primary border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.map((t) => (
          <Link 
            key={t.id}
            to="/advice/$threadId"
            params={{ threadId: t.id }}
            className="block rounded-2xl bg-card p-4 hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5 font-semibold">{t.tag}</span>
              <span className="text-[10px] text-muted-foreground">answered by {t.answeredBy}</span>
            </div>
            <p className="text-sm font-bold text-primary mt-2">{t.title}</p>
            <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ArrowUp size={12} /> {t.upvotes}</span>
              <span>{t.answers} answers</span>
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-30 rounded-full bg-accent text-accent-foreground px-4 py-3 text-sm font-bold shadow-lg inline-flex items-center gap-2"
      >
        <Plus size={16} /> Ask
      </button>
      <AskModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function AskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const add = useApp((s) => s.addAdvicePost);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("Academics");

  if (!open) return null;
  function submit() {
    if (!title.trim()) return;
    add({
      id: `p${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      tag,
      upvotes: 0,
      answers: 0,
      answeredBy: "you",
    });
    setTitle(""); setBody("");
    onClose();
  }
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" />
      <div
        className="relative w-full bg-background rounded-t-3xl p-5 animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Ask the community</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>
        <input
          placeholder="Question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none mb-3"
        />
        <div className="flex gap-2 flex-wrap mb-3">
          {ADVICE_TAGS.slice(1).map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                tag === t ? "bg-primary text-primary-foreground border-primary" : "bg-card text-primary border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          rows={4}
          placeholder="Details (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none resize-none mb-4"
        />
        <button
          onClick={submit}
          disabled={!title.trim()}
          className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
