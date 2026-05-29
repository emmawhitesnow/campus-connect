import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings, Pencil, MessageSquare, Phone, Heart, Calendar, LogOut, Lock,
  Sparkles, Sunrise, Compass, BookOpen, Star, ChevronRight,
} from "lucide-react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { StatRing } from "@/components/StatRing";
import { me, closestFriends, myClubs, badges, wins } from "@/data/mock";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useInteractions } from "@/components/InteractionContext";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Orbit" },
      { name: "description", content: "Your friendship stats, badges, closest friends, and clubs." },
    ],
  }),
  component: ProfilePage,
});

const BADGE_ICON: Record<string, typeof Star> = {
  butterfly: Sparkles,
  sunrise: Sunrise,
  compass: Compass,
  heart: Heart,
  star: Star,
  book: BookOpen,
};

function ProfilePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { message, call } = useInteractions();

  return (
    <div>
      <ScreenHeader
        title="Profile"
        back="/"
        right={
          <button className="text-primary" aria-label="Settings" onClick={() => setSettingsOpen(true)}>
            <Settings size={22} />
          </button>
        }
      />
      <div className="px-5">
        <div className="flex items-center gap-4 mt-2">
          <Avatar seed={me.firstName} size={88} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xl font-extrabold text-primary truncate">{me.name}</p>
              <button className="text-primary"><Pencil size={14} /></button>
            </div>
            <p className="text-xs text-muted-foreground">{me.pronouns} | {me.year}</p>
            <div className="mt-2 flex gap-4 text-sm">
              <span className="text-primary">
                <span className="text-muted-foreground font-normal">Connected </span>
                <b>{me.connections}</b>
              </span>
              <span className="text-primary">
                <span className="text-muted-foreground font-normal">Clubs </span>
                <b>{me.clubs}</b>
              </span>
            </div>
          </div>
        </div>

        <h3 className="mt-6 text-primary font-semibold">This past week</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <StatRing value={92} unit="%" label="show up rate" percent={92} delay={100} />
          <StatRing value={42} label="people met" percent={68} delay={250} />
          <StatRing value={7} label="clubs attended" percent={87} delay={400} />
        </div>

        <h3 className="mt-7 text-primary font-semibold">Badges</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {badges.map((b) => {
            const Icon = BADGE_ICON[b.icon] ?? Star;
            return (
              <div
                key={b.id}
                className={`shrink-0 w-28 rounded-2xl p-3 text-center ${
                  b.earned ? "bg-accent/15" : "bg-card opacity-60"
                }`}
              >
                <div className={`mx-auto size-12 rounded-full grid place-items-center ${
                  b.earned ? "bg-accent text-accent-foreground" : "bg-border text-muted-foreground"
                }`}>
                  {b.earned ? <Icon size={20} /> : <Lock size={16} />}
                </div>
                <p className="mt-2 text-[11px] font-bold text-primary leading-tight">{b.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{b.desc}</p>
              </div>
            );
          })}
        </div>

        <h3 className="mt-7 text-primary font-semibold">Wins this week</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {wins.map((w) => (
            <div key={w.label} className="rounded-2xl bg-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-tight">{w.label}</p>
              <p className="text-sm font-bold text-primary mt-1">{w.value}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-7 text-primary font-semibold">Your closest friends</h3>
        <div className="mt-3 rounded-3xl bg-card p-2 divide-y divide-border">
          {closestFriends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3">
              <Avatar seed={f.name} size={48} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">{f.name}</p>
                <p className="text-[11px] text-muted-foreground">{f.mutuals} mutuals | {f.hoursTogether} hrs together</p>
                <p className="text-[11px] text-muted-foreground">Connected {f.connectedYears} year{f.connectedYears > 1 ? "s" : ""} ago</p>
              </div>
              <div className="flex items-center gap-3 text-primary">
                <button aria-label="Message" onClick={() => message(f.name)}><MessageSquare size={18} /></button>
                <button aria-label="Call" onClick={() => call(f.name)}><Phone size={18} /></button>
                <button aria-label="Favorite"><Heart size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-7 text-primary font-semibold">Your clubs</h3>
        <div className="mt-3 rounded-3xl bg-card p-2 divide-y divide-border mb-6">
          {myClubs.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3">
              <Avatar seed={c.name} size={48} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.members} members | #{c.rank} in size</p>
                <p className="text-[11px] text-muted-foreground">Joined {Math.round(c.joinedMonthsAgo / 12 * 10) / 10} years ago</p>
              </div>
              <div className="flex items-center gap-3 text-primary">
                <button aria-label="Schedule"><Calendar size={18} /></button>
                <button aria-label="Leave"><LogOut size={18} /></button>
                <button aria-label="Favorite"><Heart size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="w-[88%] max-w-[380px] p-0">
          <SheetHeader className="px-5 pt-5">
            <SheetTitle className="text-primary text-xl font-extrabold text-left">Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-4 divide-y divide-border">
            {[
              "Notifications",
              "Privacy",
              "Account",
              "Connected calendars",
              "Appearance",
              "About",
              "Help",
              "Log out",
            ].map((row) => (
              <button
                key={row}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm text-primary hover:bg-card"
              >
                {row}
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
