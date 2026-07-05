import { makeFeed, type FeedItem } from "./lib/feed";
import { renderTile, flipCard, enforceCap } from "./lib/dom";
import {
  loadCounter, saveCounter, markPassed, markRevealed, distinctRealCount,
  type CounterState,
} from "./lib/counter";
import { SoundEngine, loadSoundPref, saveSoundPref } from "./lib/sound";

const NODE_CAP = 60;
const BATCH = 6;

const feedEl = document.getElementById("stream")!;
const sentinel = document.getElementById("sentinel")!;
const counterBadge = document.getElementById("stat-chip")!;

const next = makeFeed();
const sound = new SoundEngine();
let counter: CounterState = loadCounter();

sound.setEnabled(loadSoundPref());

function paintCounter(): void {
  counterBadge.textContent = `เจอของจริง ${distinctRealCount(counter)} · เลื่อนผ่าน ${counter.passed} ชิ้น`;
}

function appendBatch(n: number): void {
  for (let i = 0; i < n; i++) {
    const item: FeedItem = next();
    feedEl.appendChild(renderTile(item, Math.random, "masonry"));
    counter = markPassed(counter);
  }
  enforceCap(feedEl, NODE_CAP);
  saveCounter(counter);
  paintCounter();
}

// Flip on tap (delegated). Real "ช้อปเลย" navigates only via its button.
feedEl.addEventListener("click", (e) => {
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

// Endless append when the sentinel scrolls into view.
const io = new IntersectionObserver((entries) => {
  if (entries.some((en) => en.isIntersecting)) appendBatch(BATCH);
}, { rootMargin: "600px" });
io.observe(sentinel);

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

// First fill (enough to overflow the viewport so the sentinel can retrigger).
appendBatch(NODE_CAP);
