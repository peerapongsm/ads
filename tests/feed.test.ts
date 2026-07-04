import { describe, it, expect } from "vitest";
import { makeShuffleBag, makeFeed } from "../src/lib/feed";
import type { FeedItem } from "../src/lib/feed";

function seqRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length]!;
}

describe("makeShuffleBag", () => {
  it("returns undefined for an empty pool", () => {
    expect(makeShuffleBag([], Math.random)()).toBeUndefined();
  });
  it("exhausts the whole pool before repeating any item within a pass", () => {
    const items = ["a", "b", "c", "d"];
    const draw = makeShuffleBag(items, Math.random);
    const first = [draw(), draw(), draw(), draw()];
    expect(new Set(first).size).toBe(4); // all distinct in one pass
  });
  it("produces a deterministic draw order under a stubbed RNG", () => {
    const draw = makeShuffleBag(["a", "b", "c"], seqRng([0]));
    expect([draw(), draw(), draw()]).toEqual(["a", "c", "b"]);
  });
});

describe("makeFeed", () => {
  it("inserts a real card within every 8–12 items", () => {
    const next = makeFeed({ rng: Math.random });
    let sinceReal = 0;
    let maxGap = 0;
    for (let i = 0; i < 400; i++) {
      const item: FeedItem = next();
      if (item.kind === "real") { maxGap = Math.max(maxGap, sinceReal); sinceReal = 0; }
      else sinceReal++;
    }
    expect(maxGap).toBeLessThanOrEqual(12);
  });
  it("yields fakes between real cards", () => {
    const next = makeFeed({ rng: Math.random });
    let reals = 0, fakes = 0;
    for (let i = 0; i < 100; i++) { const it = next(); it.kind === "real" ? reals++ : fakes++; }
    expect(reals).toBeGreaterThan(0);
    expect(fakes).toBeGreaterThan(reals);
  });
});
