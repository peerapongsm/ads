import type { FeedItem } from "./feed";

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderCard(item: FeedItem): HTMLElement {
  const card = el("div", "tile");
  const front = el("div", "face-front");
  const back = el("div", "face-back");

  if (item.kind === "fake") {
    const a = item.ad;
    card.classList.add(a.style);
    front.append(
      el("div", "tile-title", a.headline),
      el("div", "tile-sub", a.subtext),
      el("button", "tile-cta", a.cta),
    );
    back.append(
      el("div", "reveal-tag", "เสียดสี"),
      el("div", "reveal-th", a.reveal.patternTh),
      el("div", "reveal-en", `(${a.reveal.patternEn})`),
      el("div", "reveal-explainer", a.reveal.explainer),
    );
  } else {
    const c = item.card;
    card.classList.add("s-real");
    card.dataset.realId = c.id;
    front.append(
      el("div", "tile-title", c.title),
      el("div", "tile-price", c.priceText),
      el("button", "tile-cta", "ดูสินค้า"),
    );
    const shop = document.createElement("button");
    shop.className = "buy-btn";
    if (c.available) {
      shop.textContent = "ช้อปเลย →";
      shop.dataset.url = c.url;
    } else {
      shop.textContent = "เร็วๆ นี้";
      shop.disabled = true;
    }
    back.append(
      el("div", "reveal-tag reveal-real", "ของจริง · affiliate link"),
      el("div", "reveal-explainer", `${c.title} — ${c.network === "shopee" ? "Shopee" : "Lazada"}`),
      shop,
    );
  }

  // decorative front CTAs must not steal the flip/tap
  front.querySelectorAll("button.tile-cta").forEach((b) => ((b as HTMLButtonElement).tabIndex = -1));

  card.append(front, back);
  return card;
}

export function flipCard(card: HTMLElement): boolean {
  card.classList.toggle("flipped");
  return card.classList.contains("flipped");
}

export function enforceCap(container: HTMLElement, cap: number): void {
  while (container.childElementCount > cap && container.firstElementChild) {
    container.firstElementChild.remove();
  }
}
