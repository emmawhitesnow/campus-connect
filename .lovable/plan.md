
# Orbit — Functionality + Polish Pass

A big batch of changes. Everything is still frontend-only with mock data (no backend yet). State that needs to persist across screens (events you add, friends added, notifications dismissed, going/joined toggles) will live in a lightweight in-memory store (Zustand) so changes show up everywhere.

---

## 0. Global

- Add a small **"Orbit"** wordmark to the home header (top-left, next to/under the avatar, in the indigo display weight).
- Replace `·` separators with `|` everywhere (home event meta, discover stats, profile meta, etc.).
- All avatars use the same colorful deterministic `<Avatar seed=… />` — apply it to club/event "pfps" on Discover too (currently flat gray).
- Add a tiny global store `src/store/app.ts` (Zustand) for: events, friends, notifications, going/joined sets, favorites.
- Add reusable `Modal`, `ActionSheet` (iOS-style bottom prompt for Call/Message), and `Toast` primitives.

## 1. Home (`/`)

- **Sticky header**: avatar + "Orbit" wordmark + bell + hamburger stay pinned while scrolling (sticky inside the phone shell).
- **Bell** → routes to new `/notifications` screen; red dot disappears once all notifications are read/dismissed.
- **Hamburger** → opens a dropdown (Radix) with: Home preferences, Theme (light/dark toggle — visual only), Help, Sign out (visual only). If we don't want it, we drop it; default plan is to keep it with those four.
- **"See all"** next to Friend Activity → routes to `/activity` (full scrollable list, back button to `/`).
- **Send message** button on activity cards → opens an iMessage-style mini modal (To: name, text input, Send/Cancel).
- **Call** button → bottom action sheet "Call {name} at (xxx) xxx-xxxx?" with Call / Cancel.
- **Add event** CTA on family activity → opens the new Add Event flow (see §5).
- Remove the ✨ sparkle icon next to "Recommended for you".
- Recommendation "Plan it" / "View" → "Plan it" opens Add Event prefilled; "View" opens a small details modal.
- **Today's Event Lineup**:
  - Make it vertically scrollable; initial window shows ~10 AM–2 PM, user scrolls to earlier/later hours (6 AM – 11 PM range).
  - Event blobs become **rounded-rectangles** (radius ~10px, not pill).
  - Event titles centered inside the blob with proper padding + truncation so "Breakfast with Manya" / "Lacrosse tournament" sit cleanly inside.
  - New events created via Add Event appear here automatically.

## 2. FAB quick-actions

- **Add event** → `/event/new` (full screen, GCal-style):
  - Fields: Title, Type (chips: Hangout, Club event, Class, Workout, Other), Start/End time, Date, Location, Invite people (multi-select from friends), Description, Color.
  - Save → pushes into store → renders on Home's Today lineup (if same day) and Discover Events.
- **Add a friend** → `/friends/add` (replaces the redundant Network jump):
  - Search bar over mock contacts + "people on Orbit", Instagram-style rows with Add / Requested toggle, mutual count.
- **Remove "Find a friend"** from the FAB menu (the route stays reachable from Network if needed; we can also delete it — defaulting to keep route, remove from FAB).

## 3. Notifications (`/notifications`, new)

- Scrollable list of mock notifications grouped Today / This Week / Earlier.
- Each item: avatar, text, time, swipe-or-tap-to-dismiss, tap to "address" (marks read, can deep-link e.g. to a friend or event).
- "Mark all read" button. Unread count drives the bell dot on Home.

## 4. Network (`/network`)

- **Color spectrum**: edges + node fills interpolate across a 5-stop gradient from red (strained / >30d) → orange → yellow → light blue → deep indigo (very close / recent). Same scale used for the node ring.
- Re-center button (third button) actually resets pan to center *and* scale to 1 (not scrolls to top).
- "Maintenance Alert" card animates in from the top (translate + fade) ~400ms after the page mounts.
- Node visuals: soft outer glow (radial gradient halo) sized by closeness, subtle pulse on the selected node, thin connecting lines with gradient stroke. Goal: more "wow", still readable.
- **Send message / Call** on the alert + bottom-sheet rows → same modals as Home.
- **Filter** button → dropdown: Favorites only, Newest, Oldest, Most talked to, Least talked to (re-sorts the bottom list).
- **Search** (top-right + sheet input) → focuses an input; live-filters ~20 mock friends by name.
- **Heart** button → toggles favorite with a quick scale+fill animation (gray → coral, pop).
- Top-right search icon also opens the same search input (focus the sheet's search bar).

## 5. Discover (`/discover`)

### Clubs
- Each club row is clickable → `/clubs/$clubId` profile page: hero image, description, tags, member count, rating + reviews list, photo strip, Join/Leave button.
- Filter chips (Outdoors / Performance / Music / etc.) are toggle-able and filter the visible list.
- Search bar live-filters clubs.
- Color avatars for club tiles.

### Events
- Week strip is horizontally swipeable (snap to day).
- "Going" button states:
  - Going → **green pill, filled, checkmark** ("Going ✓").
  - Not going → indigo outline pill labeled **"Plan it"** (toggleable).
- Events the user is "Going" to are **pinned to the top** with a subtle "Pinned" tag; others below.
- Keep "2 friends going" / "3 friends free" as a **non-clickable tag** — drop the "→ schedule" affordance.
- Search bar live-filters events.

### Advice
- Search bar live-filters posts.
- "Ask" FAB → opens "New post" modal: Title, Tags (chips, multi), Body, Post button. New post prepends to the feed (store).

## 6. Profile (`/profile`)

- **StatRing animation**: ring stroke animates from 0 → target % over ~600ms on mount (CSS transition on `strokeDashoffset` after a `requestAnimationFrame`).
- **Badge icons**: distinct lucide icons per badge (e.g. Social Butterfly → butterfly-ish glyph using `Sparkles`/custom SVG, Early Bird → `Sunrise`, Bookworm → `BookOpen`, Streak → `Flame`, Explorer → `Compass`, etc.). Locked badges stay gray.
- **Closest friends**: each row gets a small "97 hrs together" meta line.
- Fix spacing: `Connected · 247` (with proper gap) — currently renders as "Connected247".
- **Settings** icon → slide-in-from-right panel (Sheet) with grouped rows: Notifications, Privacy, Account, About, Help, Log out. Visual only.

## 7. Cross-screen interactions (recap)

- Call/Message popups, Add Event modal, Add Friend search, and Notifications list are shared and live in the store, so toggling state on one screen reflects on the others (e.g., adding an event shows on Home + Discover Events; joining a club updates the Clubs list).

---

## Technical notes

```text
src/
  store/app.ts                 # zustand: events, friends, notifications, going, joined, favorites, settings
  components/
    Modal.tsx                  # base modal
    ActionSheet.tsx            # iOS-style bottom prompt (call confirm)
    MessageModal.tsx           # iMessage mini-composer
    HeaderBar.tsx              # sticky home header (avatar | Orbit | bell | menu)
    NotificationItem.tsx
    EventBlock.tsx             # rounded-rect calendar block, centered text
    ScrollableDayTimeline.tsx  # 6AM-11PM, initial scroll to 10AM
    ClubCard.tsx / EventCard.tsx / AdviceCard.tsx
    FilterChip.tsx
    SlidingPanel.tsx           # right-side settings drawer
  routes/
    notifications.tsx          # new
    activity.tsx               # "See all" friend activity
    event.new.tsx              # GCal-style create
    friends.add.tsx            # search + add
    clubs.$clubId.tsx          # club profile
  data/mock.ts                 # add: notifications[], 20 friends w/ phone#s, club detail content, event types/colors
```

- Network coloring helper `closenessColor(score: 0..1)` returns interpolated oklch on the red→orange→yellow→sky→indigo ramp; used for ring + edge.
- Hamburger uses existing `dropdown-menu`; Settings panel uses `sheet`; Modals use `dialog`.
- Persistence: in-memory only this pass (no localStorage / backend). State resets on full reload — acceptable for a demo.

## Out of scope (this pass)

- Real messaging / telephony, real calendar sync, real auth, backend persistence, real friend graph updates from the server.
- Dark mode beyond the toggle stub.
- True multi-touch animations beyond what we already have on Network.

If you want anything trimmed, swapped, or split into a second pass, say the word — otherwise I'll build the whole list.
