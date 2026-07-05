import type { Template } from "./templates";
import type { RNG } from "./generator";
import type { SlotShape } from "./layout";
import { BANNERS } from "./bannerManifest";

export type Motif =
  | "coins" | "chips" | "sunburst" | "stars" | "chart"
  | "warning" | "cookie" | "envelope" | "clock" | "thumbnails"
  | "none";

export type BannerSpec = {
  photo: string | null; // path under /banners, or null => procedural
  wordmark: string;
  motif: Motif;
  shape: SlotShape;
};

// Obviously-fake wordmarks — no real brand collisions.
export const WORDMARKS = ["VIP888", "UFA∞", "LUCKY999", "฿OOM888", "MOONX", "โชคดี88", "รวย365", "888PLUS"];

const MOTIF_BY_STYLE: Record<string, Motif> = {
  // photo templates (motif is the fallback if a pool is ever empty)
  "s-casino": "chips",
  "s-cash": "coins",
  "s-neon": "sunburst",
  "s-crypto": "chart",
  "s-horoscope": "stars",
  "s-before-after": "warning",
  // procedural templates (no photo → motif is the hero graphic)
  "s-system": "warning",
  "s-consent": "cookie",
  "s-modal": "envelope",
  "s-countdown": "clock",
  "s-chumbox": "thumbnails",
};

export function pickBanner(
  t: Template,
  rng: RNG,
  shape: SlotShape,
  banners: Record<string, string[]> = BANNERS,
): BannerSpec {
  const pool = t.imageQuery ? (banners[t.id] ?? []) : [];
  const photo = pool.length ? pool[Math.floor(rng() * pool.length)]! : null;
  const wordmark = WORDMARKS[Math.floor(rng() * WORDMARKS.length)]!;
  const motif = MOTIF_BY_STYLE[t.style] ?? "none";
  return { photo, wordmark, motif, shape };
}
