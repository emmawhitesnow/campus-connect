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

export type ClubDetail = {
  id: string;
  name: string;
  members: number;
  rank: number;
  rating: number;
  reviews: number;
  tag: string;
  tags: string[];
  friendsIn: number;
  commitment: "Light" | "Medium" | "Heavy";
  description: string;
  photos: string[]; // gradient seeds
  reviewList: { id: string; author: string; rating: number; text: string }[];
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
  { id: "a1", kind: "going", person: "Julia", text: "is going to HouseFest today!", meta: "Friday, May 22 | 4:00 PM | Green", cta: "add" },
  { id: "a2", kind: "stale", person: "Emile", text: "You haven't talked to Emile in 6 days.", cta: "message" },
  { id: "a3", kind: "family", person: "Mom", text: "Mom hasn't heard from you in 4 days.", cta: "call" },
  { id: "a4", kind: "stale", person: "Amy", text: "It's been 28 days since you talked to Amy.", cta: "message" },
  { id: "a5", kind: "stale", person: "Theo", text: "You haven't talked to Theo in 11 days.", cta: "message" },
  { id: "a6", kind: "going", person: "Marcus", text: "is going to Spring Formal Saturday.", meta: "Saturday, May 23 | 8:00 PM | Collis", cta: "add" },
  { id: "a7", kind: "family", person: "Dad", text: "Dad hasn't heard from you in 9 days.", cta: "call" },
  { id: "a8", kind: "stale", person: "Riya", text: "It's been 18 days since you talked to Riya.", cta: "message" },
];

export const recommendations = [
  { id: "r1", title: "3 friends are free at 1pm", subtitle: "Schedule lunch at Collis?", action: "Plan it" as const },
  { id: "r2", title: "Indie Film Night fits your taste", subtitle: "2 friends already going | Fri 7pm", action: "View" as const },
];

const NAMES = [
  "Emile","Stuart","Tate","Maya","Julia","Noelle","Manya","Amy","Thomas","Jordan",
  "Riya","Liam","Sofia","Wes","Priya","Marcus","Hana","Ben","Ivy","Theo",
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
  hoursTogether: [142, 97, 64][i],
}));

export const myClubs = [
  { id: "c1", name: "Spare Rib", members: 471, rank: 46, joinedMonthsAgo: 18 },
  { id: "c2", name: "Mini Crafts Club", members: 54, rank: 98, joinedMonthsAgo: 12 },
  { id: "c3", name: "Ballet Club", members: 28, rank: 104, joinedMonthsAgo: 3 },
];

export const discoverClubs: ClubDetail[] = [
  {
    id: "dc1", name: "Dartmouth Outing Club", members: 1240, rank: 1, rating: 4.8, reviews: 312,
    tag: "Outdoors", tags: ["Outdoors", "Hiking", "Community"], friendsIn: 6, commitment: "Medium",
    description: "The largest collegiate outing club in the US. Weekly trips into the White Mountains, intro skills clinics, and chill cabin nights.",
    photos: ["mountain", "lake", "fire", "trail"],
    reviewList: [
      { id: "r1", author: "Maya '26", rating: 5, text: "Made my closest friends here. Cabin trips are unreal." },
      { id: "r2", author: "Ben '27", rating: 5, text: "So welcoming to people with zero outdoor experience." },
      { id: "r3", author: "Ivy '25", rating: 4, text: "Can get cliquey at the upper levels, but trips are amazing." },
    ],
  },
  {
    id: "dc2", name: "Sheba Dance Troupe", members: 28, rank: 22, rating: 4.9, reviews: 41,
    tag: "Performance", tags: ["Performance", "Dance", "Hip-Hop"], friendsIn: 2, commitment: "Heavy",
    description: "All-female hip-hop troupe with two shows per term. Auditions in week 1.",
    photos: ["stage1", "stage2", "stage3"],
    reviewList: [
      { id: "r1", author: "Hana '27", rating: 5, text: "Best 6 hours of my week, every week." },
      { id: "r2", author: "Sofia '26", rating: 5, text: "Sisterhood is real here." },
    ],
  },
  {
    id: "dc3", name: "Cords A Cappella", members: 16, rank: 38, rating: 4.7, reviews: 28,
    tag: "Music", tags: ["Music", "A Cappella", "Performance"], friendsIn: 1, commitment: "Heavy",
    description: "Co-ed a cappella, founded in 1980. Tour every interim.",
    photos: ["mic", "stage1", "stage2"],
    reviewList: [{ id: "r1", author: "Theo '25", rating: 5, text: "Truly a second family." }],
  },
  {
    id: "dc4", name: "Quiz Bowl", members: 42, rank: 67, rating: 4.5, reviews: 19,
    tag: "Academic", tags: ["Academic", "Trivia"], friendsIn: 3, commitment: "Light",
    description: "Compete in college quiz tournaments. Practices Tuesdays.",
    photos: ["book", "trophy"],
    reviewList: [{ id: "r1", author: "Wes '26", rating: 4, text: "Smart, weird, lovely people." }],
  },
  {
    id: "dc5", name: "Sustainable Cooking", members: 88, rank: 51, rating: 4.6, reviews: 24,
    tag: "Food", tags: ["Food", "Sustainability"], friendsIn: 4, commitment: "Light",
    description: "Weekly cooks using local + seasonal ingredients. Beginner friendly.",
    photos: ["food1", "food2", "food3"],
    reviewList: [{ id: "r1", author: "Priya '28", rating: 5, text: "Free dinner + new friends. Top tier." }],
  },
  {
    id: "dc6", name: "Climbing Club", members: 156, rank: 18, rating: 4.7, reviews: 67,
    tag: "Outdoors", tags: ["Outdoors", "Climbing", "Fitness"], friendsIn: 2, commitment: "Medium",
    description: "Indoor + outdoor climbing. Free shoe rental for new members.",
    photos: ["climb1", "climb2"],
    reviewList: [{ id: "r1", author: "Liam '27", rating: 5, text: "Got me into bouldering!" }],
  },
];

export const discoverEvents = [
  { id: "ev1", day: "Today", time: "7:00 PM", title: "Indie Film Night", location: "Black Family Visual Arts", friendsFree: 3, friendsGoing: 2 },
  { id: "ev2", day: "Today", time: "9:00 PM", title: "Late Night Foco", location: "Class of '53 Commons", friendsFree: 5, friendsGoing: 4 },
  { id: "ev3", day: "Tomorrow", time: "12:00 PM", title: "Farmers Market", location: "The Green", friendsFree: 4, friendsGoing: 1 },
  { id: "ev4", day: "Sat", time: "8:00 PM", title: "Spring Formal", location: "Collis Common Ground", friendsFree: 7, friendsGoing: 6 },
  { id: "ev5", day: "Sun", time: "10:00 AM", title: "Sunrise Hike", location: "Mt. Moosilauke", friendsFree: 2, friendsGoing: 3 },
  { id: "ev6", day: "Mon", time: "6:00 PM", title: "Open Mic", location: "One Wheelock", friendsFree: 6, friendsGoing: 1 },
];

export const adviceThreads: AdviceThread[] = [
  { id: "ad1", title: "Best off-campus housing for '27s?", tag: "Housing", upvotes: 34, answers: 12, answeredBy: "'26" },
  { id: "ad2", title: "How do you balance D-Plan + internships?", tag: "Academics", upvotes: 58, answers: 21, answeredBy: "'25" },
  { id: "ad3", title: "Worth rushing in winter vs spring?", tag: "Greek life", upvotes: 27, answers: 9, answeredBy: "'26" },
  { id: "ad4", title: "Foco hacks every freshman should know", tag: "Dining", upvotes: 102, answers: 33, answeredBy: "'25" },
  { id: "ad5", title: "Therapy / counseling at Dick's House?", tag: "Wellness", upvotes: 19, answers: 7, answeredBy: "'25" },
];

export const badges = [
  { id: "b1", name: "Social Butterfly", desc: "Met 30+ people this term", earned: true, icon: "butterfly" as const },
  { id: "b2", name: "Early Bird", desc: "5 mornings before 8am", earned: true, icon: "sunrise" as const },
  { id: "b3", name: "Club Hopper", desc: "Joined 5+ clubs", earned: true, icon: "compass" as const },
  { id: "b4", name: "Deep Talks", desc: "10+ hours with one friend", earned: false, icon: "heart" as const },
  { id: "b5", name: "Stargazer", desc: "Use Network 7 days in a row", earned: false, icon: "star" as const },
  { id: "b6", name: "Bookworm", desc: "Study 20+ hrs in a week", earned: false, icon: "book" as const },
];

export const wins = [
  { label: "Most time with", value: "Emile" },
  { label: "Favorite spot", value: "Novack Café" },
  { label: "Busiest day", value: "Thursday" },
];

export const addableContacts = [
  { id: "ac1", name: "Aisha Khan", year: "'27", mutuals: 14, onOrbit: true },
  { id: "ac2", name: "Jin Park", year: "'28", mutuals: 9, onOrbit: true },
  { id: "ac3", name: "Lena Hart", year: "'26", mutuals: 22, onOrbit: true },
  { id: "ac4", name: "Diego Romero", year: "'27", mutuals: 6, onOrbit: false },
  { id: "ac5", name: "Sara Kim", year: "'28", mutuals: 17, onOrbit: true },
  { id: "ac6", name: "Owen Wallace", year: "'25", mutuals: 4, onOrbit: false },
  { id: "ac7", name: "Mira Joseph", year: "'27", mutuals: 11, onOrbit: true },
  { id: "ac8", name: "Felix Yang", year: "'28", mutuals: 8, onOrbit: true },
];
