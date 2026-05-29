import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Users, Compass, User, Plus, X, Calendar, UserPlus } from "lucide-react";
import { useState } from "react";

type Tab = { to: string; label: string; icon: typeof Home; exact?: boolean };
const TABS: Tab[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/network", label: "Network", icon: Users },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomTabBar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <>
      {fabOpen && (
        <div
          className="absolute inset-0 z-30 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setFabOpen(false)}
        />
      )}

      {fabOpen && (
        <div className="absolute bottom-28 left-1/2 z-40 -translate-x-1/2 flex flex-col gap-2 items-stretch w-56 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {[
            { icon: Calendar, label: "Add event", onClick: () => { setFabOpen(false); navigate({ to: "/event/new" }); } },
            { icon: UserPlus, label: "Add a friend", onClick: () => { setFabOpen(false); navigate({ to: "/friends/add" }); } },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="flex items-center gap-3 rounded-full bg-background px-4 py-3 text-primary shadow-lg border border-border text-sm font-semibold"
            >
              <a.icon size={18} />
              {a.label}
            </button>
          ))}
        </div>
      )}

      <nav className="absolute bottom-0 left-0 right-0 z-20 bg-background border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="relative flex items-stretch justify-around px-4 pt-2 pb-3">
          {TABS.slice(0, 2).map((t) => (
            <TabLink key={t.to} {...t} active={isActive(loc.pathname, t.to, t.exact)} />
          ))}

          <div className="w-16 relative">
            <button
              onClick={() => setFabOpen((s) => !s)}
              aria-label="Quick add"
              className="absolute left-1/2 -top-7 -translate-x-1/2 size-14 rounded-full bg-primary text-primary-foreground shadow-xl grid place-items-center transition-transform active:scale-95"
              style={{ boxShadow: "0 12px 28px -6px oklch(0.36 0.15 270 / 0.45)" }}
            >
              {fabOpen ? <X size={24} /> : <Plus size={26} />}
            </button>
          </div>

          {TABS.slice(2).map((t) => (
            <TabLink key={t.to} {...t} active={isActive(loc.pathname, t.to, t.exact)} />
          ))}
        </div>
      </nav>
    </>
  );
}

function isActive(path: string, to: string, exact?: boolean) {
  if (exact) return path === to;
  return path === to || path.startsWith(to + "/");
}

function TabLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center gap-0.5 text-xs font-medium ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px]">{label}</span>
    </Link>
  );
}
