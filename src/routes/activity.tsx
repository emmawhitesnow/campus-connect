import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { activities } from "@/data/mock";
import { MessageSquare, Phone, CalendarPlus, Bell } from "lucide-react";
import { useInteractions } from "@/components/InteractionContext";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Friend Activity — Orbit" }] }),
  component: ActivityPage,
});

function ActivityPage() {
  const { call, message } = useInteractions();
  return (
    <div>
      <ScreenHeader title="Friend Activity" back="/" />
      <div className="px-5 pb-10">
        <div className="rounded-3xl bg-card p-2 divide-y divide-border">
          {activities.map((a) => (
            <div key={a.id} className="flex gap-3 p-3 items-start">
              <Avatar seed={a.person} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary leading-snug">
                  {a.kind === "going" ? (
                    <><span className="font-bold">{a.person}</span> {a.text}</>
                  ) : (
                    <>You haven't talked to <span className="font-bold">{a.person}</span> recently.</>
                  )}
                </p>
                {a.meta && <p className="text-[11px] text-muted-foreground mt-0.5">{a.meta}</p>}
                <div className="mt-2 flex items-center gap-2">
                  {a.cta === "add" && <Btn icon={CalendarPlus} label="Add Event" />}
                  {a.cta === "message" && <Btn icon={MessageSquare} label="Message" onClick={() => message(a.person)} />}
                  {a.cta === "call" && <Btn icon={Phone} label="Call" onClick={() => call(a.person)} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Btn({ icon: Icon, label, onClick }: { icon: typeof Bell; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1.5">
      <Icon size={13} /> {label}
    </button>
  );
}
