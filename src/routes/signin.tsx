import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OrbitLogo } from "@/components/OrbitLogo";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — Orbit" }] }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try { localStorage.setItem("orbit:onboarded", "1"); } catch {}
    navigate({ to: "/" });
  }

  return (
    <div className="absolute inset-0 overflow-hidden text-white flex flex-col"
      style={{ background: "radial-gradient(ellipse at 50% 20%, #3b4ea8 0%, #1a2455 60%, #0a0f2c 100%)" }}
    >
      <div className="px-6 pt-12 pb-6 text-center">
        <div className="text-accent mx-auto"><OrbitLogo size={48} className="mx-auto" /></div>
        <h1 className="mt-3 text-3xl font-extrabold">orbit</h1>
        <p className="mt-1 text-xs text-white/70">A few quick things to get you started.</p>
      </div>

      <form onSubmit={submit} className="flex-1 px-6 pb-8 flex flex-col gap-3">
        <Field label="Your name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Emma Hwang"
            required
            className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-base outline-none placeholder:text-white/40"
          />
        </Field>
        <Field label="School">
          <input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Dartmouth College"
            required
            className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-base outline-none placeholder:text-white/40"
          />
        </Field>
        <Field label="School email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="emma.hwang.28@dartmouth.edu"
            required
            className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-base outline-none placeholder:text-white/40"
          />
        </Field>

        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-accent text-accent-foreground py-3.5 text-sm font-bold shadow-lg active:scale-[0.99] transition-transform"
        >
          Enter Orbit
        </button>

        <button
          type="button"
          onClick={() => { try { localStorage.setItem("orbit:onboarded", "1"); } catch {}; navigate({ to: "/" }); }}
          className="mt-1 text-xs text-white/60 underline-offset-4 hover:underline"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-white/60 ml-1">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
