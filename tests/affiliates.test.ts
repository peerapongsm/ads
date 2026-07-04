import { describe, it, expect } from "vitest";
import { AFFILIATES } from "../src/lib/affiliates";

describe("AFFILIATES", () => {
  it("has several cards with unique ids", () => {
    expect(AFFILIATES.length).toBeGreaterThanOrEqual(4);
    expect(new Set(AFFILIATES.map((c) => c.id)).size).toBe(AFFILIATES.length);
  });
  it("every card has a valid network and non-empty title/price", () => {
    for (const c of AFFILIATES) {
      expect(["shopee", "lazada"]).toContain(c.network);
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.priceText.length).toBeGreaterThan(0);
    }
  });
  it("placeholder cards (no real url) are marked unavailable", () => {
    for (const c of AFFILIATES) {
      if (c.url.startsWith("#TODO")) expect(c.available).toBe(false);
    }
  });
});
