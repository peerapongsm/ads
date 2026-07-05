import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TRIGGER = /(?:^|[-_ ])(ads?|sponsor|banner|promo|advert|popup)(?:$|[-_ ])/i;

// Pull every class="..." and id="..." token from a source string.
function tokens(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/(?:class|id)\s*=\s*["'`]([^"'`]+)["'`]/g)) {
    out.push(...m[1]!.split(/\s+/));
  }
  // classList.add("x") / className = "x" / getElementById("x")
  for (const m of src.matchAll(/(?:classList\.add|getElementById|querySelector(?:All)?)\(\s*["'`#.]?([\w-]+)/g)) {
    out.push(m[1]!);
  }
  return out.filter(Boolean);
}

describe("adblock-safe naming", () => {
  for (const rel of ["index.html", "src/style.css", "src/lib/dom.ts", "src/main.ts"]) {
    it(`${rel} has no ad-trigger tokens`, () => {
      const src = readFileSync(join(root, rel), "utf8");
      const bad = tokens(src).filter((t) => TRIGGER.test(t));
      expect(bad, `trigger tokens in ${rel}: ${bad.join(", ")}`).toEqual([]);
    });
  }
});
