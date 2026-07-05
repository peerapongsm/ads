import { describe, it, expect } from "vitest";
import { pickBanner, WORDMARKS } from "../src/lib/banner";
import type { Template } from "../src/lib/templates";

const photoT: Template = { id: "gambling", style: "s-casino", weight: 9, headlines: ["h"], subtexts: ["s"], ctas: ["c"], reveal: { patternTh: "", patternEn: "", explainer: "" }, imageQuery: ["casino chips"] };
const procT: Template = { ...photoT, id: "cookie-wall", style: "s-consent", imageQuery: undefined };
const banks = { gambling: ["/banners/gambling-0.webp", "/banners/gambling-1.webp"] };
const seq = (xs: number[]) => { let i = 0; return () => xs[i++ % xs.length]!; };

describe("pickBanner", () => {
  it("returns a pooled photo for a photo template", () => {
    const b = pickBanner(photoT, seq([0.0, 0.0]), "masonry", banks);
    expect(b.photo).toBe("/banners/gambling-0.webp");
    expect(b.motif).toBe("chips");
    expect(b.shape).toBe("masonry");
    expect(WORDMARKS).toContain(b.wordmark);
  });
  it("returns null photo (procedural) when template has no imageQuery", () => {
    const b = pickBanner(procT, seq([0.5]), "strip", banks);
    expect(b.photo).toBeNull();
  });
  it("returns null photo when pool is empty even for a photo template", () => {
    const b = pickBanner(photoT, seq([0.5]), "tall", {});
    expect(b.photo).toBeNull();
    expect(b.motif).toBe("chips");
  });
  it("is deterministic given rng", () => {
    const a = pickBanner(photoT, seq([0.9, 0.1]), "masonry", banks);
    const c = pickBanner(photoT, seq([0.9, 0.1]), "masonry", banks);
    expect(a).toEqual(c);
  });
});
