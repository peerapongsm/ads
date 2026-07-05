import { describe, it, expect } from "vitest";
import { renderCard, flipCard, enforceCap } from "../src/lib/dom";
import type { FeedItem } from "../src/lib/feed";

const fake: FeedItem = { kind: "fake", ad: {
  id: "f1", template: "gambling", style: "s-casino",
  headline: "สมัครรับ 100 ทันที!", subtext: "เว็บตรง", cta: "สมัครเลย",
  reveal: { patternTh: "โฆษณาพนันผิดกฎหมาย", patternEn: "Illegal Gambling Ad", explainer: "ล่อด้วยเงินฟรี" },
}};
const real: FeedItem = { kind: "real", card: {
  id: "af-mug", title: "แก้วเก็บความเย็น", priceText: "฿189", network: "lazada", url: "#TODO", available: false,
}};

describe("renderCard", () => {
  it("renders a fake card whose back names the dark pattern", () => {
    const el = renderCard(fake);
    expect(el.classList.contains("tile")).toBe(true);
    expect(el.querySelector(".face-front")?.textContent).toContain("สมัครรับ 100");
    const back = el.querySelector(".face-back")?.textContent ?? "";
    expect(back).toContain("Illegal Gambling Ad");
    expect(back).toContain("โฆษณาพนันผิดกฎหมาย");
    expect(el.dataset.realId).toBeUndefined();
  });
  it("renders a real card with data-real-id and an affiliate label", () => {
    const el = renderCard(real);
    expect(el.dataset.realId).toBe("af-mug");
    expect(el.querySelector(".face-back")?.textContent).toContain("affiliate link");
  });
  it("disables the shop button when the card is unavailable", () => {
    const el = renderCard(real);
    const btn = el.querySelector<HTMLButtonElement>(".buy-btn");
    expect(btn?.disabled).toBe(true);
    expect(btn?.textContent).toContain("เร็วๆ นี้");
  });
  it("enables the shop button and sets data-url when the card is available", () => {
    const available: FeedItem = { kind: "real", card: {
      id: "af-live", title: "สินค้าจริง", priceText: "฿100",
      network: "shopee", url: "https://example.com/x", available: true,
    }};
    const el = renderCard(available);
    const btn = el.querySelector<HTMLButtonElement>(".buy-btn");
    expect(btn?.disabled).toBe(false);
    expect(btn?.textContent).toContain("ช้อปเลย");
    expect(btn?.dataset.url).toBe("https://example.com/x");
  });
});

describe("flipCard", () => {
  it("toggles the flipped class and returns the new state", () => {
    const el = renderCard(fake);
    expect(flipCard(el)).toBe(true);
    expect(el.classList.contains("flipped")).toBe(true);
    expect(flipCard(el)).toBe(false);
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
    expect(box.firstElementChild?.textContent).toBe("4"); // 0..3 dropped
  });
  it("does nothing when under the cap", () => {
    const box = document.createElement("div");
    box.appendChild(document.createElement("div"));
    enforceCap(box, 6);
    expect(box.childElementCount).toBe(1);
  });
});
