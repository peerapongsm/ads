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
  warning: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><path d="M50 8 L96 90 L4 90 Z" fill="#facc15" stroke="#7f1d1d" stroke-width="4" stroke-linejoin="round"/><rect x="45" y="38" width="10" height="28" rx="3" fill="#7f1d1d"/><circle cx="50" cy="78" r="6" fill="#7f1d1d"/></svg>`,
  cookie: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="#c98a3c" stroke="#7c4a1e" stroke-width="3"/><circle cx="38" cy="36" r="6" fill="#5a2f10"/><circle cx="62" cy="42" r="5" fill="#5a2f10"/><circle cx="45" cy="62" r="6" fill="#5a2f10"/><circle cx="66" cy="66" r="4" fill="#5a2f10"/><circle cx="30" cy="56" r="4" fill="#5a2f10"/></svg>`,
  envelope: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><rect x="12" y="26" width="76" height="52" rx="5" fill="#f8fafc" stroke="#334155" stroke-width="4"/><path d="M14 30 L50 58 L86 30" fill="none" stroke="#334155" stroke-width="4"/><circle cx="80" cy="30" r="12" fill="#ef4444"/><text x="80" y="35" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">1</text></svg>`,
  clock: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><circle cx="50" cy="52" r="38" fill="#111827" stroke="#f59e0b" stroke-width="5"/><line x1="50" y1="52" x2="50" y2="26" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="52" x2="70" y2="60" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/><rect x="42" y="4" width="16" height="8" rx="2" fill="#f59e0b"/></svg>`,
  thumbnails: `<svg viewBox="0 0 100 100" class="motif-svg" aria-hidden="true"><g fill="#e5e7eb" stroke="#111827" stroke-width="3"><rect x="10" y="14" width="34" height="26" rx="3"/><rect x="56" y="14" width="34" height="26" rx="3"/><rect x="10" y="60" width="34" height="26" rx="3"/><rect x="56" y="60" width="34" height="26" rx="3"/></g><g fill="#ef4444"><path d="M22 22 l14 5 l-14 5 Z"/><path d="M68 22 l14 5 l-14 5 Z"/><path d="M22 68 l14 5 l-14 5 Z"/><path d="M68 68 l14 5 l-14 5 Z"/></g></svg>`,
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
    // Unreachable defensive fallback: every fake ad's `template` comes from a real
    // TEMPLATES entry (generator.ts), so `find` always hits. If a future caller ever
    // passed an unknown template id, this synthetic Template has no imageQuery (→ motif
    // path) and its style would miss MOTIF_BY_STYLE → "none" → EMPTY motif, regressing
    // the procedural-motif guarantee. Keep template ids sourced from TEMPLATES.
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
