import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Search, MessageSquare, Phone, CalendarPlus, X, MapPin, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { activities, recommendations, me, discoverEvents } from "@/data/mock";
import { useApp, type StoredEvent } from "@/store/app";
import { useInteractions } from "@/components/InteractionContext";
import { OrbitLogo } from "./signin";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Orbit" },
      { name: "description", content: "Your daily friendship check-in: who needs a message, who's free, what's happening on campus." },
      { property: "og:title", content: "Home — Orbit" },
      { property: "og:description", content: "Friend activity, today's events, and gentle nudges to stay close." },
    ],
  }),
  component: HomePage,
});

const HOUR_START = 6;
const HOUR_END = 23;
const HOUR_PX = 56; // pixels per hour
const INITIAL_SCROLL_HOUR = 10;

function HomePage() {
  const navigate = useNavigate();
  const { call, message } = useInteractions();
  const events = useApp((s) => s.events);
  const userName = useApp((s) => s.userName);
  const displayName = userName || me.firstName;
  const unread = useApp((s) => s.notifications.filter((n) => !n.read).length);
  const todays = events.filter((e) => e.date === new Date().toISOString().slice(0, 10));

  // State for pre-filled event popup
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planSubtitle, setPlanSubtitle] = useState("");

  function handlePlanIt(title: string, subtitle: string) {
    // Pre-fill with recommendation info
    if (title.includes("friends are free")) {
      setPlanTitle("Collis lunch w/ friends");
      setPlanSubtitle("Collis");
    } else {
      setPlanTitle(title);
      setPlanSubtitle("");
    }
    setShowPlanPopup(true);
  }

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur px-5 pt-5 pb-3 border-b border-transparent">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar seed={displayName} size={44} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-none">orbit</p>
              <p className="text-sm font-bold text-primary leading-tight">{displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to="/notifications" className="relative p-2" aria-label="Notifications">
              <Bell size={22} />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />}
            </Link>
            <Link to="/profile" className="p-2" aria-label="Profile">
              <OrbitLogo size={28} />
            </Link>
          </div>
        </header>
      </div>

      <div className="px-5 pt-4">
        <h2 className="text-3xl font-extrabold text-primary leading-tight">
          Hello, {displayName}.
        </h2>
        <p className="mt-1 text-primary/80 text-sm">What can we help you find?</p>

        <button
          className="mt-5 w-full flex items-center justify-between rounded-full bg-accent text-accent-foreground px-5 py-3.5 shadow-sm"
          aria-label="Search"
        >
          <span className="text-sm font-medium opacity-90">Search friends, events, clubs…</span>
          <Search size={20} />
        </button>

        <section className="mt-7">
          <div className="flex items-center justify-between">
            <h3 className="text-primary font-semibold">Friend Activity</h3>
            <Link to="/activity" className="text-xs text-muted-foreground hover:text-primary">See all</Link>
          </div>

          <div className="mt-3 rounded-3xl bg-card p-2 divide-y divide-border">
            {activities.slice(0, 4).map((a) => (
              <div key={a.id} className="flex gap-3 p-3 items-start">
                <Avatar seed={a.person} size={44} />
                <div className="flex-1 min-w-0">
                  {a.kind === "going" ? (
                    <>
                      <p className="text-sm text-primary leading-snug">
                        <span className="font-bold">{a.person}</span> {a.text}
                      </p>
                      {a.meta && <p className="text-[11px] text-muted-foreground mt-0.5">{a.meta}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-primary leading-snug">
                      {a.kind === "family" ? (
                        <><span className="font-bold">{a.person}</span> hasn't heard from you in <span className="font-bold">{a.text.match(/\d+/)?.[0]} days</span>.</>
                      ) : (
                        <>You haven't talked to <span className="font-bold">{a.person}</span> in <span className="font-bold">{a.text.match(/\d+/)?.[0]} days</span>.</>
                      )}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {a.cta === "add" && (
                      <CtaBtn icon={CalendarPlus} label="Add Event" onClick={() => navigate({ to: "/event/new" })} />
                    )}
                    {a.cta === "message" && (
                      <CtaBtn icon={MessageSquare} label="Send a message" onClick={() => message(a.person)} />
                    )}
                    {a.cta === "call" && (
                      <CtaBtn icon={Phone} label="Call" onClick={() => call(a.person)} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h3 className="text-primary font-semibold">Recommended for you</h3>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {recommendations.map((r) => (
              <div key={r.id} className="min-w-[78%] rounded-2xl bg-primary text-primary-foreground p-4 shadow-sm">
                <p className="text-sm font-bold">{r.title}</p>
                <p className="text-xs opacity-80 mt-1">{r.subtitle}</p>
                <button
                  onClick={() =>
                    r.action === "Plan it"
                      ? handlePlanIt(r.title, r.subtitle)
                      : r.title.includes("Film Night")
                        ? navigate({ to: "/discover", search: { eventId: "ev1" } })
                        : navigate({ to: "/discover" })
                  }
                  className="mt-3 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5"
                >
                  {r.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 mb-6">
          <h3 className="text-primary font-semibold">Today&apos;s Event Lineup</h3>
          <DayTimeline events={todays} />
        </section>
      </div>

      {/* Pre-filled Plan Popup */}
      {showPlanPopup && (
        <PlanEventPopup
          defaultTitle={planTitle}
          defaultLocation={planSubtitle}
          onClose={() => setShowPlanPopup(false)}
        />
      )}
    </div>
  );
}

function DayTimeline({
  events,
}: {
  events: StoredEvent[];
}) {
  const [scrollRef] = useState(() => ({ done: false }));
  const [selectedEvent, setSelectedEvent] = useState<StoredEvent | null>(null);
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  return (
    <>
      <div
        ref={(el) => {
          if (el && !scrollRef.done) {
            el.scrollTop = (INITIAL_SCROLL_HOUR - HOUR_START) * HOUR_PX - 8;
            scrollRef.done = true;
          }
        }}
        className="mt-3 rounded-3xl bg-card p-4 overflow-y-auto no-scrollbar"
        style={{ maxHeight: 260 }}
      >
        <div className="relative" style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_PX }}>
          {hours.map((h, i) => (
            <div
              key={h}
              className="absolute left-0 right-0 flex items-center gap-2"
              style={{ top: i * HOUR_PX }}
            >
              <span className="text-[10px] text-muted-foreground w-10 shrink-0">{fmtHour(h)}</span>
              <span className="flex-1 h-px bg-border" />
            </div>
          ))}
          {events.map((e, idx) => {
            const top = (e.startHour - HOUR_START) * HOUR_PX + 4;
            const height = Math.max(28, (e.endHour - e.startHour) * HOUR_PX - 6);
            const colors: Record<string, string> = {
              gold: "bg-accent text-accent-foreground",
              indigo: "bg-primary text-primary-foreground",
              blue: "bg-primary/70 text-primary-foreground",
              green: "bg-[oklch(0.65_0.16_150)] text-white",
              pink: "bg-[oklch(0.7_0.16_350)] text-white",
            };
            // Stagger overlapping events left/right
            const left = idx % 2 === 0 ? "14%" : "52%";
            return (
              <button
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className={`absolute rounded-xl px-3 py-1.5 text-[11px] font-semibold shadow-sm flex items-center justify-center text-center cursor-pointer hover:opacity-90 transition-opacity ${colors[e.color] ?? colors.indigo}`}
                style={{ top, height, left, width: "34%" }}
              >
                <span className="truncate">{e.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      {selectedEvent && (
        <EventDetailPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}

function CtaBtn({ icon: Icon, label, onClick }: { icon: typeof Bell; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1.5">
      <Icon size={13} />
      {label}
    </button>
  );
}

function fmtHour(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh} ${period}`;
}

function PlanEventPopup({
  defaultTitle,
  defaultLocation,
  onClose,
}: {
  defaultTitle: string;
  defaultLocation: string;
  onClose: () => void;
}) {
  const addEvent = useApp((s) => s.addEvent);
  const [title, setTitle] = useState(defaultTitle);
  const [location, setLocation] = useState(defaultLocation);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("13:00");
  const [endTime, setEndTime] = useState("14:00");

  function toHour(s: string) {
    const [h, m] = s.split(":").map(Number);
    return h + (m || 0) / 60;
  }

  function handleSave() {
    if (!title.trim()) return;
    addEvent({
      id: `u${Date.now()}`,
      title: title.trim(),
      date,
      startHour: toHour(startTime),
      endHour: toHour(endTime),
      color: "gold",
      location: location.trim() || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" />
      <div
        className="relative w-full bg-background rounded-t-3xl p-5 animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Plan Event</h3>
          <button onClick={onClose} className="text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-card px-3 py-2.5 text-sm text-primary outline-none mb-3"
        />

        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-muted-foreground" />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 rounded-xl bg-card px-3 py-2.5 text-sm text-primary outline-none"
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} className="text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-24 rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-24 rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold disabled:opacity-50"
        >
          Save Event
        </button>
      </div>
    </div>
  );
}

function EventDetailPopup({
  event,
  onClose,
}: {
  event: StoredEvent;
  onClose: () => void;
}) {
  const updateEvent = useApp((s) => s.updateEvent);
  const deleteEvent = useApp((s) => s.deleteEvent);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location || "");

  function formatTime(hour: number) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? "PM" : "AM";
    const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
  }

  function handleSave() {
    updateEvent({ ...event, title: title.trim(), location: location.trim() || undefined });
    setIsEditing(false);
  }

  function handleDelete() {
    deleteEvent(event.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" />
      <div
        className="relative w-full bg-background rounded-t-3xl p-5 animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">
            {isEditing ? "Edit Event" : "Event Details"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {isEditing ? (
          <>
            <input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-card px-3 py-2.5 text-sm text-primary outline-none mb-3"
            />
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-muted-foreground" />
              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 rounded-xl bg-card px-3 py-2.5 text-sm text-primary outline-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold disabled:opacity-50"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-xl font-bold text-primary">{event.title}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>{formatTime(event.startHour)} - {formatTime(event.endHour)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full bg-card text-[oklch(0.6_0.2_25)] p-3"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
