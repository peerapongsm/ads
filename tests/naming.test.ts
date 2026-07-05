import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TRIGGER = /(?:^|[-_ ])(ads?|sponsor|banner|promo|advert|popup|leaderboard|skyscraper|billboard|mpu|adslot|adunit|dfp)(?:$|[-_ ])/i;

// Pull every class/id token a browser (or ad-blocker) would see: HTML
// attributes, CSS selector heads, and the DOM-API call sites that build or
// query them. A trigger token reintroduced via ANY of these vectors is caught.
function tokens(src: string, rel: string): string[] {
  const out: string[] = [];

  // class="a b" / id="x"
  for (const m of src.matchAll(/(?:class|id)\s*=\s*["'`]([^"'`]+)["'`]/g)) {
    out.push(...m[1]!.split(/\s+/));
  }
  // classList.add("x") / getElementById("x") / querySelector[All]("a.b#c")
  // Capture the whole selector then split so "button.ad-cta" -> button, ad-cta.
  for (const m of src.matchAll(
    /(?:classList\.add|getElementById|querySelector(?:All)?)(?:<[^>]*>)?\(\s*["'`#.]*([\w.#-]+)/g,
  )) {
    out.push(...m[1]!.split(/[.#]/));
  }
  // el("div", "tile") builder helper -> second argument
  for (const m of src.matchAll(/el\(\s*["'`][^"'`]+["'`]\s*,\s*["'`]([\w-]+)/g)) {
    out.push(m[1]!);
  }
  // target.closest(".tile") / .closest<HTMLElement>(".tile")
  for (const m of src.matchAll(/\.closest(?:<[^>]*>)?\(\s*["'`#.]*([\w-]+)/g)) {
    out.push(m[1]!);
  }
  // Raw CSS selector heads (.foo / #bar). CSS files only: over TS this would
  // capture member access like `item.ad` and misfire on legitimate code.
  if (rel.endsWith(".css")) {
    for (const m of src.matchAll(/[.#]([\w-]+)/g)) {
      out.push(m[1]!);
    }
  }
  // TS object-literal `key: "value"` string literals (layout.ts / templates.ts
  // use plain colon syntax, not the HTML `key="value"` syntax matched above).
  // Scoped to keys whose values actually reach the DOM as a class/dataset/id
  // (style, shape, host) — quoted-string literals only, so this never touches
  // unquoted member access like `item.ad`. `id:` in templates.ts is a purely
  // internal template identifier (never rendered), so it's deliberately not
  // scanned here — only `.style` from that same object reaches the DOM.
  if (rel.endsWith(".ts")) {
    for (const m of src.matchAll(/\b(?:style|shape|host)\s*:\s*["'`]([^"'`]+)["'`]/g)) {
      out.push(...m[1]!.split(/[.#-]/));
    }
  }

  return out.filter(Boolean);
}

describe("adblock-safe naming", () => {
  for (const rel of [
    "index.html",
    "src/style.css",
    "src/lib/dom.ts",
    "src/main.ts",
    "src/lib/templates.ts",
    "src/lib/layout.ts",
  ]) {
    it(`${rel} has no ad-trigger tokens`, () => {
      const src = readFileSync(join(root, rel), "utf8");
      const bad = tokens(src, rel).filter((t) => TRIGGER.test(t));
      expect(bad, `trigger tokens in ${rel}: ${bad.join(", ")}`).toEqual([]);
    });
  }
});
