import type { FeedItem } from "./feed";

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderCard(item: FeedItem): HTMLElement {
  const card = el("div", "ad-card");
  const front = el("div", "ad-front");
  const back = el("div", "ad-back");

  if (item.kind === "fake") {
    const a = item.ad;
    card.classList.add(a.style);
    front.append(
      el("div", "ad-headline", a.headline),
      el("div", "ad-subtext", a.subtext),
      el("button", "ad-cta", a.cta),
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
      el("div", "ad-headline", c.title),
      el("div", "ad-price", c.priceText),
      el("button", "ad-cta", "ดูสินค้า"),
    );
    const shop = document.createElement("button");
    shop.className = "shop-btn";
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
  front.querySelectorAll("button.ad-cta").forEach((b) => ((b as HTMLButtonElement).tabIndex = -1));

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
