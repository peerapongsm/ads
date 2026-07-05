import { describe, it, expect } from "vitest";
import { BANNERS } from "../src/lib/bannerManifest";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const PHOTO_IDS = ["gambling", "predatory-loan", "lottery-popup", "crypto-moon", "sponsored-horoscope", "diet-miracle"];

describe("bannerManifest", () => {
  it("has a non-empty pool for every photo template", () => {
    for (const id of PHOTO_IDS) {
      expect(BANNERS[id]?.length, `pool for ${id}`).toBeGreaterThan(0);
    }
  });
  it("every listed file exists and is a /banners/*.webp path", () => {
    for (const [, files] of Object.entries(BANNERS)) {
      for (const f of files) {
        expect(f).toMatch(/^\/banners\/[\w-]+\.webp$/);
        expect(existsSync(join(PUBLIC, f)), `missing ${f}`).toBe(true);
      }
    }
  });
});
