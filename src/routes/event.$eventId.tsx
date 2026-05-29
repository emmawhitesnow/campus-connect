import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useApp } from "@/store/app";
import { discoverEvents } from "@/data/mock";
import { MapPin, Clock, Users, Pencil, Trash2, Check } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export const Route = createFileRoute("/event/$eventId")({
  head: () => ({ meta: [{ title: "Event — Orbit" }] }),
  component: EventDetailPage,
});

function EventDetailPage() {
  const { eventId } = useParams({ from: "/event/$eventId" });
  const navigate = useNavigate();
  const storeEvent = useApp((s) => s.events.find((e) => e.id === eventId));
  const removeEvent = useApp((s) => s.removeEvent);
  const goingMap = useApp((s) => s.goingEvents);
  const toggleGoing = useApp((s) => s.toggleGoing);

  const mockEvent = discoverEvents.find((e) => e.id === eventId);
  const going = !!goingMap[eventId];

  if (!storeEvent && !mockEvent) {
    return (
      <div>
        <ScreenHeader title="Event" back="/" />
        <p className="px-5 text-sm text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const title = storeEvent?.title ?? mockEvent!.title;
  const location = storeEvent?.location ?? mockEvent!.location;
  const time = storeEvent
    ? `${fmtH(storeEvent.startHour)} – ${fmtH(storeEvent.endHour)}`
    : mockEvent!.time;
  const dayLabel = storeEvent?.date ?? mockEvent!.day;
  const invitees = storeEvent?.invitees ?? [];
  const friendsGoing = mockEvent?.friendsGoing;

  function handleDelete() {
    if (storeEvent) removeEvent(storeEvent.id);
    navigate({ to: "/" });
  }

  return (
    <div>
      <ScreenHeader
        title="Event"
        back="/"
        right={
          storeEvent ? (
            <button
              aria-label="Edit"
              onClick={() => navigate({ to: "/event/new", search: { id: storeEvent.id } as any })}
              className="text-primary"
            >
              <Pencil size={18} />
            </button>
          ) : undefined
        }
      />
      <div className="px-5 pb-10">
        <div
          className="rounded-3xl h-32 grid place-items-center text-white"
          style={{ background: "linear-gradient(135deg, #2B3A8C, #7B4FCF)" }}
        >
          <p className="text-3xl font-extrabold drop-shadow">{title}</p>
        </div>

        <div className="mt-5 space-y-3">
          <Row icon={Clock} label={`${dayLabel} | ${time}`} />
          {location && <Row icon={MapPin} label={location} />}
          {friendsGoing != null && <Row icon={Users} label={`${friendsGoing} friends going`} />}
        </div>

        {storeEvent?.description && (
          <>
            <h3 className="mt-6 text-primary font-semibold text-sm">Description</h3>
            <p className="mt-2 text-sm text-primary/90 leading-relaxed">{storeEvent.description}</p>
          </>
        )}

        {invitees.length > 0 && (
          <>
            <h3 className="mt-6 text-primary font-semibold text-sm">Invited</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
              {invitees.map((n) => (
                <div key={n} className="flex flex-col items-center gap-1 w-14 shrink-0">
                  <Avatar seed={n} size={44} />
                  <span className="text-[10px] text-primary truncate w-full text-center">{n}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-7 flex gap-2">
          {mockEvent && (
            <button
              onClick={() => toggleGoing(eventId)}
              className={`flex-1 rounded-full py-3 text-sm font-bold inline-flex items-center justify-center gap-1.5 ${
                going
                  ? "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.14_150)]"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {going ? <><Check size={14} /> Going</> : "Plan it"}
            </button>
          )}
          {storeEvent && (
            <button
              onClick={handleDelete}
              className="flex-1 rounded-full bg-destructive/10 text-destructive py-3 text-sm font-bold inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label }: { icon: typeof Clock; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3">
      <Icon size={16} className="text-muted-foreground" />
      <span className="text-sm text-primary">{label}</span>
    </div>
  );
}

function fmtH(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const period = hh >= 12 ? "PM" : "AM";
  const display = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${display}:${mm.toString().padStart(2, "0")} ${period}`;
}
