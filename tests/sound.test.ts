import { describe, it, expect, beforeEach } from "vitest";
import { loadSoundPref, saveSoundPref } from "../src/lib/sound";

describe("sound pref", () => {
  beforeEach(() => localStorage.clear());
  it("defaults to off", () => { expect(loadSoundPref()).toBe(false); });
  it("round-trips true", () => { saveSoundPref(true); expect(loadSoundPref()).toBe(true); });
  it("round-trips false", () => { saveSoundPref(false); expect(loadSoundPref()).toBe(false); });
});
