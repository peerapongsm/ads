import { describe, it, expect, beforeEach } from "vitest";
import { renderTile, flipCard, enforceCap } from "../src/lib/dom";
import { TEMPLATES } from "../src/lib/templates";
import type { FeedItem } from "../src/lib/feed";

const seq = (xs: number[]) => { let i = 0; return () => xs[i++ % xs.length]!; };

// Photo template (has imageQuery + a baked pool via bannerManifest) → should render .tile-photo.
const fakePhoto: FeedItem = { kind: "fake", ad: {
  id: "f0", template: "gambling", style: "s-casino",
  headline: "H", subtext: "S", cta: "C",
  reveal: { patternTh: "TH", patternEn: "EN", explainer: "X" },
}};

// Procedural template (no imageQuery) → should always render .tile-motif.
const fakeProcedural: FeedItem = { kind: "fake", ad: {
  id: "f1", template: "cookie-wall", style: "s-consent",
  headline: "H2", subtext: "S2", cta: "C2",
  reveal: { patternTh: "TH2", patternEn: "EN2", explainer: "X2" },
}};

const real: FeedItem = { kind: "real", card: {
  id: "af-mug", title: "แก้วเก็บความเย็น", priceText: "฿189", network: "lazada", url: "#TODO", available: false,
}};

beforeEach(() => { document.body.innerHTML = ""; });

describe("renderTile", () => {
  it("renders a photo layer + wordmark for a photo template (real baked manifest)", () => {
    const t = renderTile(fakePhoto, seq([0, 0, 0]), "masonry");
    expect(t.classList.contains("tile")).toBe(true);
    expect(t.dataset.shape).toBe("masonry");
    expect(t.dataset.style).toBe("s-casino");
    expect(t.classList.contains("s-casino")).toBe(true);
    expect(t.querySelector(".tile-title")?.textContent).toBe("H");
    expect(t.querySelector(".tile-sub")?.textContent).toBe("S");
    const wordmark = t.querySelector(".wordmark");
    expect(wordmark).not.toBeNull();
    expect(wordmark?.textContent).toBeTruthy();
    const photo = t.querySelector<HTMLElement>(".tile-photo");
    expect(photo).not.toBeNull();
    expect(photo!.style.backgroundImage).toContain("/banners/");
    expect(t.querySelector(".tile-motif")).toBeNull();
    const cta = t.querySelector<HTMLButtonElement>("button.tile-cta");
    expect(cta?.tabIndex).toBe(-1);
    expect(cta?.textContent).toBe("C");
  });

  it("renders a procedural motif (no photo) for a template with no imageQuery", () => {
    const t = renderTile(fakeProcedural, seq([0, 0, 0]), "leaderboard");
    expect(t.dataset.style).toBe("s-consent");
    expect(t.querySelector(".tile-photo")).toBeNull();
    expect(t.querySelector(".tile-motif")).not.toBeNull();
    expect(t.querySelector(".wordmark")).not.toBeNull();
    expect(t.querySelector(".tile-title")?.textContent).toBe("H2");
    const cta = t.querySelector<HTMLButtonElement>("button.tile-cta");
    expect(cta?.tabIndex).toBe(-1);
  });

  it("front order is photo/motif, scrim, wordmark, title, sub, cta", () => {
    const t = renderTile(fakePhoto, seq([0, 0, 0]), "masonry");
    const front = t.querySelector(".face-front")!;
    const kids = Array.from(front.children).map((c) => c.className.split(" ")[0]);
    expect(kids).toEqual(["tile-photo", "tile-scrim", "wordmark", "tile-title", "tile-sub", "tile-cta"]);
  });

  it("every procedural template (no imageQuery) yields a NON-EMPTY motif", () => {
    const procedural = TEMPLATES.filter((t) => !t.imageQuery);
    expect(procedural.length).toBeGreaterThan(0);
    for (const t of procedural) {
      const item: FeedItem = { kind: "fake", ad: {
        id: `f-${t.id}`, template: t.id, style: t.style,
        headline: t.headlines[0]!, subtext: t.subtexts[0]!, cta: t.ctas[0]!, reveal: t.reveal,
      }};
      const tile = renderTile(item, () => 0, "masonry");
      const motif = tile.querySelector<HTMLElement>(".tile-motif");
      expect(motif, `motif element for ${t.id}`).not.toBeNull();
      expect(tile.querySelector(".tile-photo"), `no photo for ${t.id}`).toBeNull();
      expect(motif!.innerHTML.trim(), `non-empty motif svg for ${t.id}`).not.toBe("");
      expect(motif!.querySelector("svg"), `<svg> present for ${t.id}`).not.toBeNull();
    }
  });

  it("renders the fake reveal text on the back (patternTh/En + explainer)", () => {
    const item: FeedItem = { kind: "fake", ad: {
      id: "f9", template: "gambling", style: "s-casino",
      headline: "สมัครรับ 100 ทันที!", subtext: "เว็บตรง", cta: "สมัครเลย",
      reveal: { patternTh: "โฆษณาพนันผิดกฎหมาย", patternEn: "Illegal Gambling Ad", explainer: "ล่อด้วยเงินฟรี" },
    }};
    const t = renderTile(item, seq([0, 0, 0]), "masonry");
    const back = t.querySelector(".face-back")?.textContent ?? "";
    expect(back).toContain("โฆษณาพนันผิดกฎหมาย");
    expect(back).toContain("Illegal Gambling Ad");
    expect(back).toContain("ล่อด้วยเงินฟรี");
  });

  it("a fake tile has NO data-real-id", () => {
    const t = renderTile(fakePhoto, seq([0, 0, 0]), "masonry");
    expect(t.dataset.realId).toBeUndefined();
  });

  it("still renders a real card correctly (unchanged back, no photo/motif)", () => {
    const t = renderTile(real, Math.random, "masonry");
    expect(t.dataset.style).toBe("s-real");
    expect(t.dataset.realId).toBe("af-mug");
    expect(t.querySelector(".tile-photo")).toBeNull();
    expect(t.querySelector(".tile-motif")).toBeNull();
    expect(t.querySelector(".face-back")?.textContent).toContain("affiliate link");
    const shop = t.querySelector<HTMLButtonElement>(".buy-btn");
    expect(shop?.disabled).toBe(true);
    expect(shop?.textContent).toContain("เร็วๆ นี้");
  });

  it("enables the shop button and sets data-url when the real card is available", () => {
    const available: FeedItem = { kind: "real", card: {
      id: "af-live", title: "สินค้าจริง", priceText: "฿100",
      network: "shopee", url: "https://example.com/x", available: true,
    }};
    const t = renderTile(available, Math.random, "masonry");
    const shop = t.querySelector<HTMLButtonElement>(".buy-btn");
    expect(shop?.disabled).toBe(false);
    expect(shop?.textContent).toBe("ช้อปเลย →");
    expect(shop?.dataset.url).toBe("https://example.com/x");
  });
});

describe("flipCard", () => {
  it("toggles the flipped class and returns the new state", () => {
    const t = renderTile(fakePhoto, seq([0, 0, 0]), "masonry");
    expect(flipCard(t)).toBe(true);
    expect(t.classList.contains("flipped")).toBe(true);
    expect(flipCard(t)).toBe(false);
  });
});

describe("enforceCap", () => {
  it("removes oldest children until at or below the cap", () => {
    const box = document.createElement("div");
    for (let i = 0; i < 10; i++) {
      const c = document.createElement("div");
      c.textContent = String(i);
      box.appendChild(c);
    }
    enforceCap(box, 6);
    expect(box.childElementCount).toBe(6);
    expect(box.firstElementChild?.textContent).toBe("4");
  });

  it("does nothing when the container is under the cap", () => {
    const box = document.createElement("div");
    for (let i = 0; i < 3; i++) box.appendChild(document.createElement("div"));
    enforceCap(box, 6);
    expect(box.childElementCount).toBe(3);
  });
});
