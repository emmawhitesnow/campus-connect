import { createFileRoute } from "@tanstack/react-router";
import { Bell, Menu, Search, MessageSquare, Phone, CalendarPlus, Sparkles } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { activities, todayEvents, recommendations, me } from "@/data/mock";

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

const HOURS = [10, 12, 14, 16, 18];
const HOUR_START = 10;
const HOUR_END = 18;
const ROW_PX = 56;

function HomePage() {
  return (
    <div className="px-5 pt-6">
      <header className="flex items-center justify-between">
        <Avatar seed={me.firstName} size={48} />
        <div className="flex items-center gap-3 text-muted-foreground">
          <button aria-label="Notifications" className="relative">
            <Bell size={24} />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-accent" />
          </button>
          <button aria-label="Menu"><Menu size={24} /></button>
        </div>
      </header>

      <h2 className="mt-4 text-3xl font-extrabold text-primary leading-tight">
        Hello, {me.firstName}.
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
          <button className="text-xs text-muted-foreground">See all</button>
        </div>

        <div className="mt-3 rounded-3xl bg-card p-2 divide-y divide-border">
          {activities.map((a) => (
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
                  {a.cta === "add" && <CtaBtn icon={CalendarPlus} label="Add Event" />}
                  {a.cta === "message" && <CtaBtn icon={MessageSquare} label="Send a message" />}
                  {a.cta === "call" && <CtaBtn icon={Phone} label="Call" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-center gap-2">
          <h3 className="text-primary font-semibold">Recommended for you</h3>
          <Sparkles size={14} className="text-accent" />
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
          {recommendations.map((r) => (
            <div key={r.id} className="min-w-[78%] rounded-2xl bg-primary text-primary-foreground p-4 shadow-sm">
              <p className="text-sm font-bold">{r.title}</p>
              <p className="text-xs opacity-80 mt-1">{r.subtitle}</p>
              <button className="mt-3 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5">
                {r.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 mb-6">
        <h3 className="text-primary font-semibold">Today's Event Lineup</h3>
        <div className="mt-3 rounded-3xl bg-card p-4">
          <div className="relative" style={{ height: (HOUR_END - HOUR_START) * ROW_PX / 2 + ROW_PX / 2 }}>
            {HOURS.map((h, i) => (
              <div
                key={h}
                className="absolute left-0 right-0 flex items-center gap-2"
                style={{ top: i * ROW_PX }}
              >
                <span className="text-[10px] text-muted-foreground w-10">{fmtHour(h)}</span>
                <span className="flex-1 h-px bg-border" />
              </div>
            ))}
            {todayEvents.map((e) => {
              const top = (e.startHour - HOUR_START) * (ROW_PX / 2) + 6;
              const height = (e.endHour - e.startHour) * (ROW_PX / 2) - 6;
              const colors: Record<string, string> = {
                gold: "bg-accent text-accent-foreground",
                indigo: "bg-primary text-primary-foreground",
                blue: "bg-primary/80 text-primary-foreground",
              };
              const leftPct = e.id === "e2" ? "50%" : "12.5%";
              const widthPct = e.id === "e3" ? "75%" : "37.5%";
              return (
                <div
                  key={e.id}
                  className={`absolute rounded-xl px-3 py-2 text-[11px] font-semibold shadow-sm ${colors[e.color]}`}
                  style={{ top, height, left: leftPct, width: widthPct }}
                >
                  {e.title}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function CtaBtn({ icon: Icon, label }: { icon: typeof Bell; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1.5">
      <Icon size={13} />
      {label}
    </button>
  );
}

function fmtHour(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const hh = h > 12 ? h - 12 : h;
  return `${hh} ${period}`;
}
