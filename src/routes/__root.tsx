import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { BottomTabBar } from "@/components/BottomTabBar";
import { InteractionProvider } from "@/components/InteractionContext";

function NotFoundComponent() {
  return (
    <div className="phone-shell flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-3 text-muted-foreground">This page drifted out of orbit.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="phone-shell flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-xl font-bold text-primary">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-5 flex gap-2 justify-center">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#2B3A8C" },
      { title: "Orbit — Stay close on campus" },
      { name: "description", content: "Orbit helps college students maintain friendships, discover clubs and events, and find belonging on campus." },
      { property: "og:title", content: "Orbit — Stay close on campus" },
      { property: "og:description", content: "Maintain friendships, discover events, find your people." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loc = useLocation();
  const isOnboarding = loc.pathname === "/welcome" || loc.pathname === "/signin";
  return (
    <QueryClientProvider client={queryClient}>
      <InteractionProvider>
        <div className="phone-shell flex flex-col">
          <main className={`flex-1 overflow-y-auto no-scrollbar ${isOnboarding ? "" : "pb-28"}`}>
            <Outlet />
          </main>
          {!isOnboarding && <BottomTabBar />}
        </div>
      </InteractionProvider>
    </QueryClientProvider>
  );
}
