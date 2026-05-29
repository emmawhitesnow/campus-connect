import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { discoverEvents, friends } from "@/data/mock";
import { useApp } from "@/store/app";
import { MapPin, Clock, Users, Check, Calendar } from "lucide-react";

export const Route = createFileRoute("/events/$eventId")({
  head: () => ({ meta: [{ title: "Event — Orbit" }] }),
  component: EventPage,
});

function EventPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const event = discoverEvents.find((e) => e.id === eventId);
  const going = useApp((s) => s.goingEvents);
  const toggleGoing = useApp((s) => s.toggleGoing);

  if (!event) {
    return (
      <div>
        <ScreenHeader title="Event" back="/discover" />
        <p className="px-5 text-sm text-muted-foreground">
          Event not found. <Link to="/discover" className="text-primary underline">Back to Discover</Link>
        </p>
      </div>
    );
  }

  const isGoing = !!going[event.id];
  const friendsGoingList = friends.slice(0, event.friendsGoing);
  const friendsFreeList = friends.slice(event.friendsGoing, event.friendsGoing + event.friendsFree);

  const gradients = [
    "linear-gradient(135deg, #2B3A8C, #F5A623)",
    "linear-gradient(135deg, #C24E7C, #7B4FCF)",
    "linear-gradient(135deg, #3B8C6E, #2B3A8C)",
  ];

  return (
    <div>
      <ScreenHeader title="Event" back="/discover" />
      <div className="px-5 pb-10">
        {/* Hero image placeholder */}
        <div
          className="rounded-3xl h-40 grid place-items-center text-white"
          style={{ background: gradients[0] }}
        >
          <Calendar size={48} className="opacity-60" />
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-primary">{event.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>{event.day} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          </div>
          <button
            onClick={() => toggleGoing(event.id)}
            className={`text-xs font-semibold rounded-full px-4 py-2 inline-flex items-center gap-1 ${
              isGoing
                ? "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.14_150)]"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {isGoing ? <><Check size={12} /> Going</> : "Plan it"}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-card p-3 text-center">
            <Users size={14} className="mx-auto text-muted-foreground" />
            <p className="text-sm font-bold text-primary mt-1">{event.friendsGoing}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Friends going</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center">
            <Users size={14} className="mx-auto text-muted-foreground" />
            <p className="text-sm font-bold text-primary mt-1">{event.friendsFree}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Friends free</p>
          </div>
        </div>

        {/* Friends Going */}
        {friendsGoingList.length > 0 && (
          <>
            <h3 className="mt-6 text-primary font-semibold text-sm">Friends going</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
              {friendsGoingList.map((f) => (
                <div key={f.id} className="shrink-0 flex flex-col items-center">
                  <Avatar seed={f.name} size={48} />
                  <p className="text-xs text-primary mt-1 font-medium">{f.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Friends Free */}
        {friendsFreeList.length > 0 && (
          <>
            <h3 className="mt-6 text-primary font-semibold text-sm">Friends free at this time</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
              {friendsFreeList.map((f) => (
                <div key={f.id} className="shrink-0 flex flex-col items-center">
                  <Avatar seed={f.name} size={48} />
                  <p className="text-xs text-primary mt-1 font-medium">{f.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Description placeholder */}
        <h3 className="mt-6 text-primary font-semibold text-sm">About</h3>
        <p className="mt-2 text-sm text-primary/80 leading-relaxed">
          Join us for {event.title.toLowerCase()} at {event.location}. 
          This is a great opportunity to connect with friends and meet new people on campus.
        </p>
      </div>
    </div>
  );
}
