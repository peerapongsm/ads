export type SlotShape = "leaderboard" | "skyscraper" | "masonry";

export function isDesktop(width: number): boolean {
  return width >= 721;
}

export function masonryColumns(width: number): number {
  // Fill the viewport width: ~220px per column, clamped 2..8 (≈5–6 at common widths).
  return Math.max(2, Math.min(8, Math.floor(width / 220)));
}

export type Region = { shape: SlotShape; count: number; host: string };

// Desktop hosts avoid ad-unit-slot words ("leaderboard") in ids/classes — those are
// themselves cosmetic-filter targets. The SlotShape *type value* stays "leaderboard"
// (a logic identifier consumed by banner.ts's pickBanner + the aspect-ratio CSS
// selector on data-shape); only the container host name is neutral.
export function buildRegions(width: number): Region[] {
  if (!isDesktop(width)) {
    return [{ shape: "masonry", count: 60, host: "stream" }];
  }
  return [
    { shape: "leaderboard", count: 1, host: "topstrip" },
    { shape: "masonry", count: 60, host: "masonry" },
  ];
}
