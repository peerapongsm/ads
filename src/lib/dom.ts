import type { FeedItem } from "./feed";
import type { RNG } from "./generator";
import type { SlotShape } from "./layout";
import { TEMPLATES } from "./templates";
import { pickBanner, type Motif } from "./banner";

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

const MOTIF_SVG: Record<Motif, string> = {
  coins: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><circle cx="35" cy="55" r="28" fill="#f4c430" stroke="#a6790a" stroke-width="3"/><circle cx="65" cy="42" r="28" fill="#ffe066" stroke="#a6790a" stroke-width="3"/></svg>`,
  chips: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><circle cx="50" cy="50" r="34" fill="#c1121f" stroke="#fff" stroke-width="4" stroke-dasharray="8 6"/><circle cx="50" cy="50" r="14" fill="#fff"/></svg>`,
  sunburst: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><g stroke="#ff00cc" stroke-width="5"><line x1="50" y1="50" x2="50" y2="4"/><line x1="50" y1="50" x2="90" y2="18"/><line x1="50" y1="50" x2="96" y2="50"/><line x1="50" y1="50" x2="90" y2="82"/><line x1="50" y1="50" x2="50" y2="96"/><line x1="50" y1="50" x2="10" y2="82"/><line x1="50" y1="50" x2="4" y2="50"/><line x1="50" y1="50" x2="10" y2="18"/></g><circle cx="50" cy="50" r="16" fill="#3333ff"/></svg>`,
  stars: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><path d="M50 6 L61 38 L95 38 L67 58 L78 90 L50 70 L22 90 L33 58 L5 38 L39 38 Z" fill="#fde68a" stroke="#7c3aed" stroke-width="2"/></svg>`,
  chart: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><polyline points="4,80 28,55 48,66 72,20 96,34" fill="none" stroke="#0f0" stroke-width="5"/><circle cx="96" cy="34" r="5" fill="#0f0"/></svg>`,
  none: ``,
};

export function motifSvg(motif: Motif): string {
  return MOTIF_SVG[motif];
}

export function renderTile(item: FeedItem, rng: RNG, shape: SlotShape): HTMLElement {
  const card = el("div", "tile");
  const front = el("div", "face-front");
  const back = el("div", "face-back");
  card.dataset.shape = shape;

  if (item.kind === "fake") {
    const a = item.ad;
    const template = TEMPLATES.find((t) => t.id === a.template);
    const spec = pickBanner(
      template ?? { id: a.template, style: a.style, weight: 0, headlines: [], subtexts: [], ctas: [], reveal: a.reveal },
      rng,
      shape,
    );
    card.classList.add(a.style);
    card.dataset.style = a.style;

    if (spec.photo) {
      const photo = el("div", "tile-photo");
      photo.style.backgroundImage = `url("${spec.photo}")`;
      front.append(photo);
    } else {
      const motif = el("div", "tile-motif");
      motif.innerHTML = motifSvg(spec.motif);
      front.append(motif);
    }

    front.append(
      el("div", "tile-scrim"),
      el("div", "wordmark", spec.wordmark),
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
    card.dataset.style = "s-real";
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
