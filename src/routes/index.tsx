import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Search, MessageSquare, Phone, CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { OrbitLogo } from "@/components/OrbitLogo";
import { activities, recommendations, me } from "@/data/mock";
import { useApp } from "@/store/app";
import { useInteractions } from "@/components/InteractionContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
const HOUR_PX = 56;
const INITIAL_SCROLL_HOUR = 10;

function HomePage() {
  const navigate = useNavigate();
  const { call, message } = useInteractions();
  const events = useApp((s) => s.events);
  const unread = useApp((s) => s.notifications.filter((n) => !n.read).length);
  const todays = events.filter((e) => e.date === new Date().toISOString().slice(0, 10));

  // First-visit onboarding gate
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem("orbit:onboarded")) {
        navigate({ to: "/welcome" });
      }
    } catch {}
  }, [navigate]);

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur px-5 pt-5 pb-3 border-b border-transparent">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar seed={me.firstName} size={44} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-none">orbit</p>
              <p className="text-sm font-bold text-primary leading-tight">{me.firstName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Link to="/notifications" className="relative p-2" aria-label="Notifications">
              <Bell size={22} />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="p-1.5 rounded-full text-primary hover:bg-primary/5 transition-colors"
                aria-label="Orbit menu"
              >
                <OrbitLogo size={30} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate({ to: "/profile" })}>Home preferences</DropdownMenuItem>
                <DropdownMenuItem>Theme</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    try { localStorage.removeItem("orbit:onboarded"); } catch {}
                    navigate({ to: "/welcome" });
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>

      <div className="px-5 pt-4">
        <h2 className="text-3xl font-extrabold text-primary leading-tight">
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
                  onClick={() => {
                    if (r.action === "Plan it" && "prefill" in r && r.prefill) {
                      navigate({ to: "/event/new", search: r.prefill as any });
                    } else if (r.action === "View" && "eventId" in r && r.eventId) {
                      navigate({ to: "/event/$eventId", params: { eventId: r.eventId } });
                    } else {
                      navigate({ to: "/discover" });
                    }
                  }}
                  className="mt-3 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5"
                >
                  {r.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 mb-6">
          <h3 className="text-primary font-semibold">Today's Event Lineup</h3>
          <DayTimeline
            events={todays}
            onTap={(id) => navigate({ to: "/event/$eventId", params: { eventId: id } })}
          />
        </section>
      </div>
    </div>
  );
}

function DayTimeline({
  events,
  onTap,
}: {
  events: { id: string; title: string; startHour: number; endHour: number; color: string }[];
  onTap: (id: string) => void;
}) {
  const [scrollRef] = useState(() => ({ done: false }));
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  return (
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
          const left = idx % 2 === 0 ? "14%" : "52%";
          return (
            <button
              key={e.id}
              onClick={() => onTap(e.id)}
              className={`absolute rounded-xl px-3 py-1.5 text-[11px] font-semibold shadow-sm flex items-center justify-center text-center transition-transform active:scale-95 ${colors[e.color] ?? colors.indigo}`}
              style={{ top, height, left, width: "34%" }}
            >
              <span className="truncate">{e.title}</span>
            </button>
          );
        })}
      </div>
    </div>
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
