import { makeFeed, type FeedItem } from "./lib/feed";
import { renderTile, flipCard, enforceCap } from "./lib/dom";
import { buildRegions, isDesktop, masonryColumns } from "./lib/layout";
import {
  loadCounter, saveCounter, markPassed, markRevealed, distinctRealCount,
  type CounterState,
} from "./lib/counter";
import { SoundEngine, loadSoundPref, saveSoundPref } from "./lib/sound";

const NODE_CAP = 60;
const BATCH = 6;

const counterBadge = document.getElementById("stat-chip")!;
const masonryEl = document.getElementById("masonry")!;

let next = makeFeed();
const sound = new SoundEngine();
let counter: CounterState = loadCounter();
let desktop = isDesktop(window.innerWidth);
let io: IntersectionObserver | null = null;

sound.setEnabled(loadSoundPref());

function paintCounter(): void {
  counterBadge.textContent = `เจอของจริง ${distinctRealCount(counter)} · เลื่อนผ่าน ${counter.passed} ชิ้น`;
}

// The infinite host is the one that grows on scroll: #masonry on desktop, #stream on mobile.
function infiniteHost(): HTMLElement {
  return document.getElementById(desktop ? "masonry" : "stream")!;
}

function sentinelEl(): HTMLElement {
  return document.getElementById(desktop ? "sentinel-masonry" : "sentinel-stream")!;
}

// Renders tiles only — no counter side effects. Used for the initial fill
// (first paint and breakpoint-crossing rebuilds), which the user hasn't
// scrolled past yet and so must not count toward "เลื่อนผ่าน".
function appendTiles(host: HTMLElement, shape: Parameters<typeof renderTile>[2], n: number): void {
  for (let i = 0; i < n; i++) {
    const item: FeedItem = next();
    host.appendChild(renderTile(item, Math.random, shape));
  }
}

// Genuine infinite-scroll append (sentinel-triggered): these tiles were
// actually scrolled past, so they count.
function appendBatch(host: HTMLElement, shape: Parameters<typeof renderTile>[2], n: number): void {
  appendTiles(host, shape, n);
  for (let i = 0; i < n; i++) counter = markPassed(counter);
  saveCounter(counter);
  paintCounter();
}

function fillRegions(): void {
  for (const region of buildRegions(window.innerWidth)) {
    const host = document.getElementById(region.host)!;
    appendTiles(host, region.shape, region.count);
    enforceCap(host, NODE_CAP);
  }
}

function startObserving(): void {
  io?.disconnect();
  io = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting)) {
      const host = infiniteHost();
      appendBatch(host, "masonry", BATCH);
      enforceCap(host, NODE_CAP);
    }
  }, { rootMargin: "600px" });
  io.observe(sentinelEl());
}

// Flip on tap (delegated to a common ancestor covering every host).
document.body.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const shop = target.closest<HTMLButtonElement>(".buy-btn");
  if (shop && !shop.disabled && shop.dataset.url) {
    window.open(shop.dataset.url, "_blank", "noopener");
    return;
  }
  const card = target.closest<HTMLElement>(".tile");
  if (!card) return;
  const flipped = flipCard(card);
  sound.jingle();
  if (flipped && card.dataset.realId) {
    counter = markRevealed(counter, card.dataset.realId);
    saveCounter(counter);
    paintCounter();
  }
});

// Chrome: sound toggle, about modal.
const soundBtn = document.getElementById("sound-toggle") as HTMLButtonElement;
function paintSound(): void {
  soundBtn.textContent = sound.enabled ? "🔊 ปิดเสียงโฆษณา" : "🔇 เปิดเสียงโฆษณา";
}
paintSound();
soundBtn.addEventListener("click", () => {
  sound.setEnabled(!sound.enabled);
  saveSoundPref(sound.enabled);
  paintSound();
});

const aboutModal = document.getElementById("about-modal") as HTMLDialogElement;
document.getElementById("about-btn")!.addEventListener("click", () => aboutModal.showModal());
document.getElementById("about-close")!.addEventListener("click", () => aboutModal.close());

// Debounced resize: rebuild from scratch only when crossing the mobile/desktop
// breakpoint (counter persists); otherwise on desktop just re-fill the width.
let resizeTimer: ReturnType<typeof setTimeout> | undefined;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const width = window.innerWidth;
    masonryEl.style.setProperty("--cols", String(masonryColumns(width)));
    const nowDesktop = isDesktop(width);
    if (nowDesktop !== desktop) {
      desktop = nowDesktop;
      next = makeFeed();
      for (const id of ["topstrip", "masonry", "stream"]) {
        document.getElementById(id)!.innerHTML = "";
      }
      fillRegions();
      paintCounter();
      startObserving();
    }
  }, 200);
});

// First fill + initial column count + sentinel wiring.
masonryEl.style.setProperty("--cols", String(masonryColumns(window.innerWidth)));
fillRegions();
paintCounter();
startObserving();
