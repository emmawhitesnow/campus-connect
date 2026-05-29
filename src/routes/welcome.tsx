import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OrbitLogo } from "@/components/OrbitLogo";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — Orbit" }] }),
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 80);
    const t2 = setTimeout(() => navigate({ to: "/signin" }), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [navigate]);

  return (
    <div className="absolute inset-0 overflow-hidden text-white"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #3b4ea8 0%, #1a2455 55%, #0a0f2c 100%)" }}
    >
      {/* twinkling stars */}
      {Array.from({ length: 28 }).map((_, i) => {
        const top = (i * 37) % 100;
        const left = (i * 53) % 100;
        const size = 1 + (i % 3);
        const delay = (i % 7) * 0.25;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              opacity: 0.4 + (i % 5) * 0.1,
              animationDelay: `${delay}s`,
              animationDuration: "2.4s",
            }}
          />
        );
      })}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"}`}
        >
          <div className="text-accent mx-auto">
            <OrbitLogo size={88} className="mx-auto drop-shadow-[0_0_24px_rgba(245,166,35,0.4)]" />
          </div>
          <h1 className="mt-6 text-6xl font-extrabold tracking-tight">orbit</h1>
          <p className="mt-3 text-sm text-white/70">Stay close on campus.</p>
        </div>

        <button
          onClick={() => navigate({ to: "/signin" })}
          className={`absolute bottom-16 text-xs uppercase tracking-[0.3em] text-white/60 transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
        >
          tap to continue
        </button>
      </div>
    </div>
  );
}
