import { describe, it, expect } from "vitest";
import { TEMPLATES } from "../src/lib/templates";

describe("TEMPLATES", () => {
  it("has all 11 dark-pattern templates with unique ids", () => {
    expect(TEMPLATES).toHaveLength(11);
    const ids = new Set(TEMPLATES.map((t) => t.id));
    expect(ids.size).toBe(11);
    expect(ids).toContain("lottery-popup");
    expect(ids).toContain("gambling");
    expect(ids).toContain("sponsored-horoscope");
  });

  it("every template has non-empty pools, a positive weight, and a full reveal", () => {
    for (const t of TEMPLATES) {
      expect(t.headlines.length, t.id).toBeGreaterThan(0);
      expect(t.subtexts.length, t.id).toBeGreaterThan(0);
      expect(t.ctas.length, t.id).toBeGreaterThan(0);
      expect(t.weight, t.id).toBeGreaterThan(0);
      expect(t.style.length, t.id).toBeGreaterThan(0);
      expect(t.reveal.patternTh.length, t.id).toBeGreaterThan(0);
      expect(t.reveal.patternEn.length, t.id).toBeGreaterThan(0);
      expect(t.reveal.explainer.length, t.id).toBeGreaterThan(0);
    }
  });
});
