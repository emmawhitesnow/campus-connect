import { create } from "zustand";

export type StoredEvent = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  startHour: number; // 0..24 (decimal)
  endHour: number;
  color: "gold" | "indigo" | "blue" | "green" | "pink";
  type?: "Hangout" | "Club event" | "Class" | "Workout" | "Other";
  location?: string;
  description?: string;
  invitees?: string[]; // friend names
};

export type StoredNotification = {
  id: string;
  text: string;
  person?: string;
  bucket: "Today" | "This Week" | "Earlier";
  time: string;
  read: boolean;
};

export type AdvicePost = {
  id: string;
  title: string;
  tag: string;
  body: string;
  upvotes: number;
  answers: number;
  answeredBy: string;
};

type AppState = {
  events: StoredEvent[];
  notifications: StoredNotification[];
  goingEvents: Record<string, boolean>;
  joinedClubs: Record<string, boolean>;
  favorites: Record<string, boolean>;
  addedFriends: Record<string, boolean>;
  advicePosts: AdvicePost[];

  addEvent: (e: StoredEvent) => void;
  updateEvent: (id: string, patch: Partial<StoredEvent>) => void;
  removeEvent: (id: string) => void;
  toggleGoing: (id: string) => void;
  toggleJoined: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleAddedFriend: (id: string) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  markAllRead: () => void;
  addAdvicePost: (p: AdvicePost) => void;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export const useApp = create<AppState>((set) => ({
  events: [
    { id: "e1", title: "Breakfast with Manya", date: todayISO(), startHour: 10, endHour: 11.5, color: "gold", location: "Foco" },
    { id: "e2", title: "Lacrosse Tournament", date: todayISO(), startHour: 10.5, endHour: 12, color: "indigo", location: "Scully-Fahey" },
    { id: "e3", title: "Noelle's Recital", date: todayISO(), startHour: 13.5, endHour: 15, color: "blue", location: "Faulkner" },
  ],
  notifications: [
    { id: "n1", text: "Julia tagged you in HouseFest", person: "Julia", bucket: "Today", time: "12m ago", read: false },
    { id: "n2", text: "Mom hasn't heard from you in 4 days", person: "Mom", bucket: "Today", time: "2h ago", read: false },
    { id: "n3", text: "Sheba Dance Troupe accepted your request", person: "Sheba", bucket: "Today", time: "5h ago", read: false },
    { id: "n4", text: "Emile shared a study spot with you", person: "Emile", bucket: "This Week", time: "Tue", read: true },
    { id: "n5", text: "Indie Film Night is tomorrow night", person: "Orbit", bucket: "This Week", time: "Mon", read: true },
    { id: "n6", text: "You earned the Social Butterfly badge", person: "Orbit", bucket: "Earlier", time: "Apr 28", read: true },
  ],
  goingEvents: { ev1: true, ev4: true },
  joinedClubs: {},
  favorites: {},
  addedFriends: {},
  advicePosts: [],

  addEvent: (e) => set((s) => ({ events: [...s.events, e] })),
  updateEvent: (id, patch) =>
    set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
  removeEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
  toggleGoing: (id) => set((s) => ({ goingEvents: { ...s.goingEvents, [id]: !s.goingEvents[id] } })),
  toggleJoined: (id) => set((s) => ({ joinedClubs: { ...s.joinedClubs, [id]: !s.joinedClubs[id] } })),
  toggleFavorite: (id) => set((s) => ({ favorites: { ...s.favorites, [id]: !s.favorites[id] } })),
  toggleAddedFriend: (id) => set((s) => ({ addedFriends: { ...s.addedFriends, [id]: !s.addedFriends[id] } })),
  markNotificationRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  addAdvicePost: (p) => set((s) => ({ advicePosts: [p, ...s.advicePosts] })),
}));
