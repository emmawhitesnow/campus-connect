import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useApp } from "@/store/app";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Welcome to Orbit" },
      { name: "description", content: "Sign in to stay connected with your campus community." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const setSignedIn = useApp((s) => s.setSignedIn);
  const [step, setStep] = useState<"splash" | "form">("splash");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("'28");

  // Auto-advance from splash to form after animation
  useEffect(() => {
    const timer = setTimeout(() => setStep("form"), 2800);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit() {
    if (!name.trim()) return;
    setSignedIn(true, name.trim());
    navigate({ to: "/" });
  }

  if (step === "splash") {
    return <SplashScreen />;
  }

  return (
    <div className="fixed inset-0 bg-[oklch(0.22_0.08_260)] flex flex-col items-center justify-center px-6">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.3,
              animationDelay: Math.random() * 2 + "s",
              animationDuration: Math.random() * 2 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative mb-8">
        <OrbitLogo size={80} />
      </div>

      <h1 className="text-2xl font-extrabold text-white mb-2">Welcome to Orbit</h1>
      <p className="text-white/70 text-sm text-center mb-8">Stay close to the people who matter</p>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-accent"
        />
        <input
          type="email"
          placeholder="College email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-accent"
        />
        <div className="flex gap-2">
          {["'25", "'26", "'27", "'28"].map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`flex-1 rounded-2xl py-2.5 text-sm font-semibold transition-colors ${
                year === y
                  ? "bg-accent text-accent-foreground"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full mt-4 rounded-full bg-accent text-accent-foreground py-3.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-[oklch(0.22_0.08_260)] flex flex-col items-center justify-center">
      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: 0,
              animation: `fadeIn 0.5s ease-out ${Math.random() * 2}s forwards, twinkle ${Math.random() * 2 + 2}s ease-in-out ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Logo with orbit animation */}
      <div className="relative animate-in zoom-in duration-700">
        <OrbitLogo size={120} animated />
      </div>

      {/* Name animation */}
      <h1 
        className="mt-8 text-4xl font-extrabold text-white tracking-wide"
        style={{
          animation: "fadeSlideUp 0.8s ease-out 0.5s both",
        }}
      >
        Orbit
      </h1>
      <p 
        className="mt-2 text-white/60 text-sm"
        style={{
          animation: "fadeSlideUp 0.8s ease-out 0.8s both",
        }}
      >
        Stay close on campus
      </p>

      <style>{`
        @keyframes fadeIn {
          to { opacity: 0.7; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbitPath {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}

export function OrbitLogo({ size = 40, animated = false }: { size?: number; animated?: boolean }) {
  const planetSize = size * 0.5;
  const starSize = size * 0.08;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Central planet */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-accent to-[oklch(0.65_0.2_50)]"
        style={{
          width: planetSize,
          height: planetSize,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 20px oklch(0.7 0.2 70 / 0.4)",
        }}
      />
      
      {/* Orbit ring */}
      <div
        className="absolute border border-white/30 rounded-full"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotateX(60deg)",
        }}
      />
      
      {/* Orbiting dot */}
      {animated && (
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            top: "50%",
            left: "50%",
            marginTop: -size * 0.04,
            marginLeft: -size * 0.04,
            animation: "orbitPath 3s linear infinite",
          }}
        />
      )}
      
      {/* Stars */}
      <div
        className="absolute bg-white rounded-full"
        style={{
          width: starSize,
          height: starSize,
          top: "10%",
          right: "15%",
        }}
      />
      <div
        className="absolute bg-white rounded-full"
        style={{
          width: starSize * 0.7,
          height: starSize * 0.7,
          bottom: "20%",
          left: "10%",
        }}
      />
      <div
        className="absolute bg-white rounded-full"
        style={{
          width: starSize * 0.5,
          height: starSize * 0.5,
          top: "25%",
          left: "5%",
        }}
      />
    </div>
  );
}
