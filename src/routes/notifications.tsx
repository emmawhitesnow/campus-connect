import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/store/app";
import { CheckCheck, X } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Orbit" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const navigate = useNavigate();
  const notifications = useApp((s) => s.notifications);
  const markAllRead = useApp((s) => s.markAllRead);
  const markRead = useApp((s) => s.markNotificationRead);
  const dismiss = useApp((s) => s.dismissNotification);

  const buckets = ["Today", "This Week", "Earlier"] as const;

  return (
    <div>
      <ScreenHeader
        title="Notifications"
        back="/"
        right={
          <button onClick={markAllRead} className="text-primary" aria-label="Mark all read">
            <CheckCheck size={20} />
          </button>
        }
      />
      <div className="px-5 pb-10">
        {notifications.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-10">All caught up.</p>
        )}
        {buckets.map((b) => {
          const items = notifications.filter((n) => n.bucket === b);
          if (items.length === 0) return null;
          return (
            <section key={b} className="mt-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">{b}</p>
              <div className="rounded-3xl bg-card divide-y divide-border overflow-hidden">
                {items.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => { markRead(n.id); navigate({ to: "/" }); }}
                    className={`flex items-center gap-3 p-3 cursor-pointer ${n.read ? "opacity-60" : ""}`}
                  >
                    <Avatar seed={n.person ?? "Orbit"} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary leading-snug">{n.text}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="size-2 rounded-full bg-accent shrink-0" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                      className="text-muted-foreground p-1"
                      aria-label="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
