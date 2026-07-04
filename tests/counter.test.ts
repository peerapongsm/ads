import { describe, it, expect, beforeEach } from "vitest";
import { emptyCounter, loadCounter, saveCounter, markPassed, markRevealed, distinctRealCount } from "../src/lib/counter";

const KEY = "ads:counter";

describe("counter", () => {
  beforeEach(() => localStorage.clear());

  it("markPassed increments total, immutably", () => {
    const a = emptyCounter();
    const b = markPassed(a);
    expect(b.passed).toBe(1);
    expect(a.passed).toBe(0);
  });

  it("markRevealed dedupes repeated ids", () => {
    let s = emptyCounter();
    s = markRevealed(s, "af-mug");
    s = markRevealed(s, "af-mug");
    s = markRevealed(s, "af-lamp");
    expect(distinctRealCount(s)).toBe(2);
  });

  it("round-trips through storage", () => {
    let s = markRevealed(markPassed(markPassed(emptyCounter())), "af-mug");
    saveCounter(s);
    const loaded = loadCounter();
    expect(loaded.passed).toBe(2);
    expect(distinctRealCount(loaded)).toBe(1);
  });

  it("returns an empty counter on corrupt storage", () => {
    localStorage.setItem(KEY, "{not json");
    expect(loadCounter()).toEqual(emptyCounter());
  });

  it("returns an empty counter when key is absent", () => {
    expect(loadCounter()).toEqual(emptyCounter());
  });
});
