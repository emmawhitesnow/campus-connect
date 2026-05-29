
## Name suggestion

**Orbit** — relationships circle around you like a constellation; ties directly to the Network screen metaphor. Alternates if you'd rather: **Tether**, **Commons**, **Circle**, **Halo**. I'll use **Orbit** unless you say otherwise.

## Scope

Mobile-first web app, max-width ~430px centered, with a subtle iPhone-style frame (rounded bezel, soft shadow) visible on desktop ≥768px. All data is mocked in-file — no backend, no auth, no Lovable Cloud. Pure presentation + interactive UI.

## Design tokens (added to `src/styles.css`)

- `--primary` deep indigo `#2B3A8C`
- `--accent` warm gold `#F5A623`
- `--card` light gray `#F2F3F7`
- `--background` white
- `--muted-foreground` cool gray for meta text
- Radius `--radius: 1.25rem` (generous), pills for search/buttons
- Font: Plus Jakarta Sans (clean friendly sans), loaded via Google Fonts in `__root.tsx`

## Routes (TanStack Start)

```
src/routes/
  __root.tsx          → phone-frame shell + bottom tab bar + FAB + <Outlet/>
  index.tsx           → Home
  network.tsx         → Constellation
  discover.tsx        → Discover hub (Clubs / Events / Advice tabs)
  find-friend.tsx     → Swipe-to-friend (reached via FAB or Network)
  profile.tsx         → Profile + stats
```

Bottom tabs: Home, Network, Discover, Profile. Center floating **+** opens a small action sheet → "Add event" / "Add friend" / "Find a friend".

## Screens

**1. Home (`/`)** — matches mockup
- Header: avatar (left), bell + menu (right)
- "Hello, Emma." + "What can we help you find?" + gold pill search
- **Friend Activity** card list with TLC prompts: "You haven't talked to Emile in 6 days" → Send a message; "Mom hasn't heard from you in 4 days" → Call; "Julia is going to HouseFest today" → Add to calendar
- **Today's Event Lineup** — timeline column 10AM–6PM with colored event blocks (gold/indigo/blue)
- **Recommended for you** (new): "3 friends free at 1pm → Schedule lunch" card, "Event matches your interests" card

**2. Network (`/network`)** — constellation
- SVG canvas: ~25 nodes (avatars) connected by lines; line opacity = closeness, dashed/red-tinted = strained
- Pinch/drag zoom via simple pan+wheel (touch via pointer events on transform group). Pinch is genuinely tricky in SSR-safe React — I'll implement two-finger pinch with the Pointer Events API; if it feels janky we can simplify to +/- buttons.
- "Me" node centered with avatar; tap any node → small popover ("28 days since you talked to Amy — Send a message")
- Bottom drag sheet (Life360-style) with handle: filter + search, scrollable friend list with message/call/favorite quick actions. Three snap points: peek / half / full.

**3. Discover (`/discover`)** — fleshed out from your sketch
- Title + "What are you looking for?" + 3 big cards: **Clubs**, **Events**, **Advice**
- Gold pill search below
- Sub-tab content (segmented control switches view, no separate routes):
  - **Clubs**: filter chips (Interest, Size, Time commitment), club cards with rating stars, "X of your friends are members", review count, Join button
  - **Events**: week calendar strip + event list; each event shows "3 friends free", "2 friends going", quick "Schedule with friends" CTA
  - **Advice**: forum-style thread list; tags (Academics, Housing, Greek life, Dining); upvotes, "Answered by '26"; floating "Ask a question" button

**4. Profile (`/profile`)** — matches mockup
- Header back + "Profile" + settings gear
- Avatar + name + pronouns + class year + "67 connections · 8 clubs"
- "This past week" — 3 circular stat rings (92% show-up rate, 42 people met, 7 clubs attended)
- **Badges row** (new, gentle gamification): "Social Butterfly", "Early Bird", "Club Hopper" — earned/locked states
- **Your closest friends** card list (message/call/favorite icons)
- **Your clubs** card list (calendar/leave/favorite icons)
- **Wins this week** (subtle, non-leaderboard): "Most time with: Emile", "Favorite spot: Novack", "Busiest day: Thursday"

**5. Find a Friend (`/find-friend`)** — matches mockup
- Header back + title + menu
- **People you might like** — large swipe card (photo, name, age/pronouns/major, bio, "You both like drawing" gold chip), X / heart action buttons, dots indicator. Swipe via pointer drag with rotation + opacity.
- Tap card → expanded profile sheet with "Schedule coffee chat" CTA
- **People in your circle** — second swipeable stack (mutuals-based, "You have 17 mutuals" chip)
- **New section idea**: "Icebreakers" — 3 conversation-starter prompt cards if you match

## Shared components

- `PhoneFrame` — desktop bezel wrapper in `__root.tsx`
- `BottomTabBar` + `Fab` with action-sheet menu
- `StatRing` (SVG circle progress)
- `ConstellationCanvas` (SVG + pan/zoom hook)
- `DragSheet` (3-snap bottom sheet)
- `SwipeCard` (pointer-drag with spring-back)
- All use semantic tokens — no hardcoded hex in components

## Mock data

`src/data/mock.ts` — friends, events, clubs, advice threads, find-a-friend candidates. Realistic Dartmouth-flavored names/clubs since mockups reference it.

## Out of scope (call out if you want them added)

- Real Google Calendar sync, location tracking, messaging, auth
- Backend persistence — swipes/favorites are session-only
- True multi-touch pinch tested on every device (best-effort)

Ready to build on approval.
