export type Friend = {
  id: string;
  name: string;
  pronouns?: string;
  year?: string;
  major?: string;
  bio?: string;
  avatarSeed: string;
  mutuals: number;
  lastTalked: number; // days ago
  closeness: number; // 0..1
  sharedInterests?: string[];
};

export type EventItem = {
  id: string;
  title: string;
  startHour: number;
  endHour: number;
  color: "gold" | "indigo" | "blue";
  location?: string;
  friendsGoing?: number;
};

export type Club = {
  id: string;
  name: string;
  members: number;
  rank: number;
  rating: number;
  reviews: number;
  tag: string;
  friendsIn: number;
  commitment: "Light" | "Medium" | "Heavy";
};

export type AdviceThread = {
  id: string;
  title: string;
  tag: "Academics" | "Housing" | "Greek life" | "Dining" | "Wellness";
  upvotes: number;
  answers: number;
  answeredBy: string;
};

export type Activity = {
  id: string;
  kind: "going" | "stale" | "family";
  person: string;
  text: string;
  meta?: string;
  cta: "add" | "message" | "call";
};

export const me = {
  name: "Emma Hwang",
  firstName: "Emma",
  pronouns: "she/her",
  year: "'28",
  connections: 67,
  clubs: 8,
};

export const activities: Activity[] = [
  {
    id: "a1",
    kind: "going",
    person: "Julia",
    text: "is going to HouseFest today!",
    meta: "Friday, May 22 · 4:00 PM · Green",
    cta: "add",
  },
  {
    id: "a2",
    kind: "stale",
    person: "Emile",
    text: "You haven't talked to Emile in 6 days.",
    cta: "message",
  },
  {
    id: "a3",
    kind: "family",
    person: "Mom",
    text: "Mom hasn't heard from you in 4 days.",
    cta: "call",
  },
  {
    id: "a4",
    kind: "stale",
    person: "Amy",
    text: "It's been 28 days since you talked to Amy.",
    cta: "message",
  },
];

export const todayEvents: EventItem[] = [
  { id: "e1", title: "Breakfast with Manya", startHour: 10, endHour: 11.5, color: "gold", location: "Foco" },
  { id: "e2", title: "Lacrosse Tournament", startHour: 10.5, endHour: 12, color: "indigo", location: "Scully-Fahey" },
  { id: "e3", title: "Noelle's Recital @ Faulkner", startHour: 13.5, endHour: 15, color: "blue", location: "Faulkner" },
];

export const recommendations = [
  { id: "r1", title: "3 friends are free at 1pm", subtitle: "Schedule lunch at Collis?", action: "Plan it" },
  { id: "r2", title: "Indie Film Night fits your taste", subtitle: "2 friends already going · Fri 7pm", action: "View" },
];

const NAMES = [
  "Emile","Stuart","Tate","Maya","Julia","Noelle","Manya","Amy","Thomas","Jordan",
  "Riya","Liam","Sofia","Wes","Priya","Marcus","Hana","Ben","Ivy","Theo",
  "Zoe","Owen","Sana","Kai","Lila","Niko","Vera","Asha","Felix","Mira",
];

export const friends: Friend[] = NAMES.map((n, i) => ({
  id: `f${i}`,
  name: n,
  avatarSeed: n,
  mutuals: 8 + ((i * 13) % 70),
  lastTalked: (i * 7) % 35,
  closeness: 0.3 + ((i * 17) % 70) / 100,
}));

export const closestFriends = friends.slice(0, 3).map((f, i) => ({
  ...f,
  connectedYears: [2, 2, 1][i],
}));

export const myClubs = [
  { id: "c1", name: "Spare Rib", members: 471, rank: 46, joinedMonthsAgo: 18 },
  { id: "c2", name: "Mini Crafts Club", members: 54, rank: 98, joinedMonthsAgo: 12 },
  { id: "c3", name: "Ballet Club", members: 28, rank: 104, joinedMonthsAgo: 3 },
];

export const discoverClubs: Club[] = [
  { id: "dc1", name: "Dartmouth Outing Club", members: 1240, rank: 1, rating: 4.8, reviews: 312, tag: "Outdoors", friendsIn: 6, commitment: "Medium" },
  { id: "dc2", name: "Sheba Dance Troupe", members: 28, rank: 22, rating: 4.9, reviews: 41, tag: "Performance", friendsIn: 2, commitment: "Heavy" },
  { id: "dc3", name: "Cords A Cappella", members: 16, rank: 38, rating: 4.7, reviews: 28, tag: "Music", friendsIn: 1, commitment: "Heavy" },
  { id: "dc4", name: "Quiz Bowl", members: 42, rank: 67, rating: 4.5, reviews: 19, tag: "Academic", friendsIn: 3, commitment: "Light" },
  { id: "dc5", name: "Sustainable Cooking", members: 88, rank: 51, rating: 4.6, reviews: 24, tag: "Food", friendsIn: 4, commitment: "Light" },
];

export const discoverEvents = [
  { id: "ev1", day: "Today", time: "7:00 PM", title: "Indie Film Night", location: "Black Family Visual Arts", friendsFree: 3, friendsGoing: 2 },
  { id: "ev2", day: "Today", time: "9:00 PM", title: "Late Night Foco", location: "Class of '53 Commons", friendsFree: 5, friendsGoing: 4 },
  { id: "ev3", day: "Tomorrow", time: "12:00 PM", title: "Farmers Market", location: "The Green", friendsFree: 4, friendsGoing: 1 },
  { id: "ev4", day: "Sat", time: "8:00 PM", title: "Spring Formal", location: "Collis Common Ground", friendsFree: 7, friendsGoing: 6 },
];

export const adviceThreads: AdviceThread[] = [
  { id: "ad1", title: "Best off-campus housing for '27s?", tag: "Housing", upvotes: 34, answers: 12, answeredBy: "'26" },
  { id: "ad2", title: "How do you balance D-Plan + internships?", tag: "Academics", upvotes: 58, answers: 21, answeredBy: "'25" },
  { id: "ad3", title: "Worth rushing in winter vs spring?", tag: "Greek life", upvotes: 27, answers: 9, answeredBy: "'26" },
  { id: "ad4", title: "Foco hacks every freshman should know", tag: "Dining", upvotes: 102, answers: 33, answeredBy: "'25" },
  { id: "ad5", title: "Therapy / counseling at Dick's House?", tag: "Wellness", upvotes: 19, answers: 7, answeredBy: "'25" },
];

export const findFriendCandidates = [
  {
    id: "ff1",
    name: "Elaine Mitchel",
    age: "'27",
    pronouns: "she/her",
    major: "Quantum Mechanics",
    bio: "Hi! I'm Elaine. Always down for a late-night Novack run or a bad movie marathon.",
    chip: "You both like drawing",
    photoSeed: "elaine",
  },
  {
    id: "ff2",
    name: "Marcus Chen",
    age: "'26",
    pronouns: "he/him",
    major: "Government",
    bio: "Debate kid trying to learn how to relax. Recommend me a coffee shop.",
    chip: "You both love debate",
    photoSeed: "marcus",
  },
  {
    id: "ff3",
    name: "Priya Patel",
    age: "'28",
    pronouns: "she/her",
    major: "Engineering",
    bio: "Robotics, rom-coms, and ridiculously long walks around Occom.",
    chip: "3 shared interests",
    photoSeed: "priya",
  },
  {
    id: "ff4",
    name: "Theo Brooks",
    age: "'27",
    pronouns: "they/them",
    major: "Studio Art",
    bio: "Painting and protest. Looking for thoughtful humans.",
    chip: "You both paint",
    photoSeed: "theo",
  },
];

export const circleCandidates = [
  {
    id: "cc1",
    name: "John Doe",
    age: "'26",
    pronouns: "he/him",
    major: "Undeclared",
    bio: "Hi! I'm John Doe. No wait, Doe John. Uhhh.",
    chip: "You have 17 mutuals",
    photoSeed: "john",
  },
  {
    id: "cc2",
    name: "Sana Park",
    age: "'27",
    pronouns: "she/her",
    major: "Cognitive Science",
    bio: "Coffee, cog sci, and overanalyzing TV. Friend of Emile and Maya.",
    chip: "You have 12 mutuals",
    photoSeed: "sana",
  },
];

export const badges = [
  { id: "b1", name: "Social Butterfly", desc: "Met 30+ people this term", earned: true },
  { id: "b2", name: "Early Bird", desc: "5 mornings before 8am", earned: true },
  { id: "b3", name: "Club Hopper", desc: "Joined 5+ clubs", earned: true },
  { id: "b4", name: "Deep Talks", desc: "10+ hours with one friend", earned: false },
  { id: "b5", name: "Stargazer", desc: "Use Network 7 days in a row", earned: false },
];

export const wins = [
  { label: "Most time with", value: "Emile" },
  { label: "Favorite spot", value: "Novack Café" },
  { label: "Busiest day", value: "Thursday" },
];
