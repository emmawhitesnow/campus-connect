import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useApp, type StoredEvent } from "@/store/app";
import { friends } from "@/data/mock";
import { Check, MapPin, AlignLeft, Users as UsersIcon, Tag, Clock } from "lucide-react";

type Search = {
  id?: string;
  title?: string;
  location?: string;
  date?: string;
  start?: string;
  end?: string;
  color?: StoredEvent["color"];
  type?: (typeof TYPES)[number];
};

export const Route = createFileRoute("/event/new")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    id: typeof raw.id === "string" ? raw.id : undefined,
    title: typeof raw.title === "string" ? raw.title : undefined,
    location: typeof raw.location === "string" ? raw.location : undefined,
    date: typeof raw.date === "string" ? raw.date : undefined,
    start: typeof raw.start === "string" ? raw.start : undefined,
    end: typeof raw.end === "string" ? raw.end : undefined,
    color: raw.color as StoredEvent["color"] | undefined,
    type: raw.type as (typeof TYPES)[number] | undefined,
  }),
  head: () => ({ meta: [{ title: "New Event — Orbit" }] }),
  component: NewEventPage,
});

const TYPES = ["Hangout", "Club event", "Class", "Workout", "Other"] as const;
const COLORS = [
  { id: "indigo", label: "Indigo", className: "bg-primary" },
  { id: "gold", label: "Gold", className: "bg-accent" },
  { id: "green", label: "Green", className: "bg-[oklch(0.65_0.16_150)]" },
  { id: "blue", label: "Blue", className: "bg-[oklch(0.7_0.13_240)]" },
  { id: "pink", label: "Pink", className: "bg-[oklch(0.7_0.16_350)]" },
] as const;

function toHourFromTime(s: string) {
  const [h, m] = s.split(":").map(Number);
  return h + (m || 0) / 60;
}
function toTimeFromHour(h: number) {
  const hh = Math.floor(h).toString().padStart(2, "0");
  const mm = Math.round((h - Math.floor(h)) * 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function NewEventPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const addEvent = useApp((s) => s.addEvent);
  const updateEvent = useApp((s) => s.updateEvent);
  const existing = useApp((s) => (search.id ? s.events.find((e) => e.id === search.id) : undefined));
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState(existing?.title ?? search.title ?? "");
  const [type, setType] = useState<(typeof TYPES)[number]>(existing?.type ?? search.type ?? "Hangout");
  const [date, setDate] = useState(existing?.date ?? search.date ?? today);
  const [start, setStart] = useState(
    existing ? toTimeFromHour(existing.startHour) : search.start ?? "12:00",
  );
  const [end, setEnd] = useState(
    existing ? toTimeFromHour(existing.endHour) : search.end ?? "13:00",
  );
  const [location, setLocation] = useState(existing?.location ?? search.location ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [invitees, setInvitees] = useState<string[]>(existing?.invitees ?? []);
  const [color, setColor] = useState<StoredEvent["color"]>(existing?.color ?? search.color ?? "indigo");

  // Reload if existing arrives async
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setLocation(existing.location ?? "");
      setDescription(existing.description ?? "");
      setInvitees(existing.invitees ?? []);
    }
  }, [existing?.id]);

  const isEdit = !!existing;

  function save() {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      type,
      date,
      startHour: toHourFromTime(start),
      endHour: toHourFromTime(end),
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      invitees,
      color,
    };
    if (isEdit && existing) {
      updateEvent(existing.id, payload);
      navigate({ to: "/event/$eventId", params: { eventId: existing.id } });
    } else {
      addEvent({ id: `u${Date.now()}`, ...payload });
      navigate({ to: "/" });
    }
  }

  return (
    <div>
      <ScreenHeader
        title={isEdit ? "Edit event" : "New event"}
        back="/"
        right={
          <button onClick={save} className="text-accent font-bold text-sm" disabled={!title.trim()}>
            Save
          </button>
        }
      />
      <div className="px-5 pb-10 space-y-5">
        <input
          placeholder="Add title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold text-primary placeholder:text-muted-foreground bg-transparent outline-none border-b border-border pb-2"
        />

        <Field icon={Tag} label="Type">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                  type === t ? "bg-primary text-primary-foreground border-primary" : "bg-card text-primary border-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field icon={Clock} label="When">
          <div className="space-y-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
            />
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="flex-1 rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
              />
              <span className="text-muted-foreground">→</span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="flex-1 rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
              />
            </div>
          </div>
        </Field>

        <Field icon={MapPin} label="Location">
          <input
            placeholder="Add location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none"
          />
        </Field>

        <Field icon={UsersIcon} label="Invite people">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {friends.slice(0, 12).map((f) => {
              const sel = invitees.includes(f.name);
              return (
                <button
                  key={f.id}
                  onClick={() =>
                    setInvitees((s) => (sel ? s.filter((n) => n !== f.name) : [...s, f.name]))
                  }
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border inline-flex items-center gap-1 ${
                    sel ? "bg-primary text-primary-foreground border-primary" : "bg-card text-primary border-border"
                  }`}
                >
                  {sel && <Check size={12} />} {f.name}
                </button>
              );
            })}
          </div>
        </Field>

        <Field icon={AlignLeft} label="Description">
          <textarea
            placeholder="Add notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-card px-3 py-2 text-sm text-primary outline-none resize-none"
          />
        </Field>

        <Field label="Color">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id as StoredEvent["color"])}
                className={`size-8 rounded-full ${c.className} ring-offset-2 ${
                  color === c.id ? "ring-2 ring-primary" : ""
                }`}
                aria-label={c.label}
              />
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, children,
}: { icon?: typeof Tag; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
        {Icon && <Icon size={13} />}
        {label}
      </div>
      {children}
    </div>
  );
}
