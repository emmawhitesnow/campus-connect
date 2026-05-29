import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { discoverClubs } from "@/data/mock";
import { useApp } from "@/store/app";
import { Star, Check, Users, Tag } from "lucide-react";

export const Route = createFileRoute("/clubs/$clubId")({
  head: () => ({ meta: [{ title: "Club — Orbit" }] }),
  component: ClubPage,
});

function ClubPage() {
  const { clubId } = useParams({ from: "/clubs/$clubId" });
  const club = discoverClubs.find((c) => c.id === clubId);
  const joined = useApp((s) => s.joinedClubs[clubId ?? ""]);
  const toggle = useApp((s) => s.toggleJoined);

  if (!club) {
    return (
      <div>
        <ScreenHeader title="Club" back="/discover" />
        <p className="px-5 text-sm text-muted-foreground">Club not found. <Link to="/discover" className="text-primary underline">Back to Discover</Link></p>
      </div>
    );
  }

  const gradients = [
    "linear-gradient(135deg, #2B3A8C, #F5A623)",
    "linear-gradient(135deg, #C24E7C, #7B4FCF)",
    "linear-gradient(135deg, #3B8C6E, #2B3A8C)",
    "linear-gradient(135deg, #F5A623, #D97706)",
  ];

  return (
    <div>
      <ScreenHeader title="Club" back="/discover" />
      <div className="px-5 pb-10">
        <div
          className="rounded-3xl h-40 grid place-items-center text-white font-extrabold text-3xl"
          style={{ background: gradients[0] }}
        >
          {club.name[0]}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-primary">{club.name}</h1>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Star size={12} className="fill-accent text-accent" />
              <span className="font-semibold text-primary">{club.rating}</span>
              <span>| {club.reviews} reviews | #{club.rank} on campus</span>
            </div>
          </div>
          <button
            onClick={() => toggle(club.id)}
            className={`text-xs font-semibold rounded-full px-4 py-2 inline-flex items-center gap-1 ${
              joined ? "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.14_150)]" : "bg-primary text-primary-foreground"
            }`}
          >
            {joined ? <><Check size={12} /> Joined</> : "Join"}
          </button>
        </div>

        <p className="mt-3 text-sm text-primary/90 leading-relaxed">{club.description}</p>

        <div className="mt-4 flex gap-2 flex-wrap">
          {club.tags.map((t) => (
            <span key={t} className="text-[11px] rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold inline-flex items-center gap-1">
              <Tag size={10} /> {t}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Members" value={String(club.members)} icon={Users} />
          <Stat label="Friends in" value={String(club.friendsIn)} icon={Users} />
          <Stat label="Commitment" value={club.commitment} icon={Tag} />
        </div>

        <h3 className="mt-6 text-primary font-semibold text-sm">Photos</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
          {club.photos.map((p, i) => (
            <div
              key={p}
              className="shrink-0 w-32 h-32 rounded-2xl"
              style={{ background: gradients[i % gradients.length] }}
            />
          ))}
        </div>

        <h3 className="mt-6 text-primary font-semibold text-sm">Reviews</h3>
        <div className="mt-3 space-y-2">
          {club.reviewList.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-primary">{r.author}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={10} className="fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-primary mt-1.5">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Star }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center">
      <Icon size={14} className="mx-auto text-muted-foreground" />
      <p className="text-sm font-bold text-primary mt-1">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
    </div>
  );
}
