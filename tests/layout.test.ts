import { describe, it, expect } from "vitest";
import { buildRegions, masonryColumns } from "../src/lib/layout";

describe("buildRegions", () => {
  it("mobile: single stream region", () => {
    const r = buildRegions(390);
    expect(r).toEqual([{ shape: "masonry", count: 60, host: "stream" }]);
  });
  it("desktop: top strip + full-width masonry (no rails)", () => {
    const r = buildRegions(1280);
    expect(r.map((x) => x.host)).toEqual(["topstrip", "masonry"]);
    expect(r.find((x) => x.host === "topstrip")!.count).toBe(1);
    expect(r.find((x) => x.host === "topstrip")!.shape).toBe("strip");
    expect(r.find((x) => x.host === "masonry")!.count).toBe(60);
  });
});

describe("masonryColumns", () => {
  it("fills width dynamically and clamps 2..8", () => {
    expect(masonryColumns(390)).toBe(2); // clamped min (mobile width, unused)
    expect(masonryColumns(1280)).toBe(5);
    expect(masonryColumns(1440)).toBe(6);
    expect(masonryColumns(3000)).toBe(8); // clamped max
  });
});
