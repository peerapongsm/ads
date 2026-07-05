export type SlotShape = "leaderboard" | "skyscraper" | "masonry";

export function isDesktop(width: number): boolean {
  return width >= 721;
}

export function masonryColumns(width: number): number {
  // Fill the viewport width: ~220px per column, clamped 2..8 (≈5–6 at common widths).
  return Math.max(2, Math.min(8, Math.floor(width / 220)));
}
