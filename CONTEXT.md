# ads — โฆษณานรก (Ad Hellscape)

Endless-scroll satire of internet advertising. Every "ad" is a procedurally
generated parody of a real dark pattern; a few real disclosed affiliate cards
are hidden among them.

## Ubiquitous language
- **FakeAd** — a procedurally generated satirical ad (see `lib/generator.ts`).
- **AffiliateCard** — a real, disclosed affiliate item (`lib/affiliates.ts`).
- **FeedItem** — union of the two kinds emitted by `lib/feed.ts`.
- **template = dark pattern** — one of the 11 parody categories (`lib/templates.ts`).
- **Reveal payload** — the educational back-of-card: `patternTh`, `patternEn`, `explainer`.
- **flip** — tap a card to show its back.
- **node cap** — bounded-DOM scroll: append at bottom, drop oldest past ~60.
- **shuffle-bag** — affiliate insertion order; repetition is on-theme retargeting.
- **counter** — `เจอของจริง` (distinct real cards revealed) · `เลื่อนผ่าน` (total passed).
- **chrome-as-ads** — real affordances (disclosure/about/sound/counter) disguised as ad furniture.

## Invariants
- No display ad networks (policy-barred). Real money = affiliate only, art-first.
- Guardrails: no real brands/marks; fakes non-functional; gambling/loan/adult are visual parody with no real links.
