import { describe, it, expect } from "vitest";
import { makeGenerator, pickWeighted } from "../src/lib/generator";
import { TEMPLATES } from "../src/lib/templates";

// deterministic RNG cycling through a fixed sequence
function seqRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length]!;
}

describe("pickWeighted", () => {
  it("never returns the excluded template when others exist", () => {
    for (let r = 0; r < 100; r++) {
      const t = pickWeighted(TEMPLATES, () => r / 100, "gambling");
      expect(t.id).not.toBe("gambling");
    }
  });
  it("returns the only template even if it is excluded", () => {
    const one = [TEMPLATES[0]!];
    const t = pickWeighted(one, () => 0.5, one[0]!.id);
    expect(t.id).toBe(one[0]!.id);
  });
});

describe("makeGenerator", () => {
  it("fills every slot from the chosen template's pools", () => {
    const next = makeGenerator(seqRng([0.0, 0.0, 0.0, 0.0]));
    const ad = next();
    const t = TEMPLATES.find((x) => x.id === ad.template)!;
    expect(t.headlines).toContain(ad.headline);
    expect(t.subtexts).toContain(ad.subtext);
    expect(t.ctas).toContain(ad.cta);
    expect(ad.reveal).toEqual(t.reveal);
    expect(ad.style).toBe(t.style);
  });
  it("never repeats the same template back-to-back over a long run", () => {
    const next = makeGenerator(Math.random);
    let prev = "";
    for (let i = 0; i < 500; i++) {
      const ad = next();
      expect(ad.template).not.toBe(prev);
      prev = ad.template;
    }
  });
  it("produces unique ids", () => {
    const next = makeGenerator(Math.random);
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) ids.add(next().id);
    expect(ids.size).toBe(50);
  });
});
