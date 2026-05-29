// Map a "closeness" score (0..1) to a perceptual gradient: red → orange → yellow → sky → indigo.
// Higher = closer/more recent.
const STOPS = [
  { t: 0.0, c: [220, 90, 100] },   // red-ish (strained)
  { t: 0.25, c: [255, 140, 60] },  // orange
  { t: 0.5, c: [245, 210, 80] },   // yellow
  { t: 0.75, c: [120, 180, 230] }, // sky blue
  { t: 1.0, c: [43, 58, 140] },    // indigo (primary)
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function closenessColor(score: number, alpha = 1): string {
  const t = Math.max(0, Math.min(1, score));
  let lo = STOPS[0], hi = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i].t && t <= STOPS[i + 1].t) { lo = STOPS[i]; hi = STOPS[i + 1]; break; }
  }
  const span = hi.t - lo.t || 1;
  const k = (t - lo.t) / span;
  const r = Math.round(lerp(lo.c[0], hi.c[0], k));
  const g = Math.round(lerp(lo.c[1], hi.c[1], k));
  const b = Math.round(lerp(lo.c[2], hi.c[2], k));
  return alpha === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}

// score = 1 - lastTalked/30, clamped, multiplied by closeness emphasis
export function relationScore(closeness: number, lastTalked: number) {
  const recency = Math.max(0, Math.min(1, 1 - lastTalked / 30));
  return Math.max(0, Math.min(1, 0.4 * recency + 0.6 * closeness));
}
