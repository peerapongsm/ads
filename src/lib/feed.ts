import { makeGenerator, type FakeAd, type RNG } from "./generator";
import { AFFILIATES, type AffiliateCard } from "./affiliates";

export type FeedItem =
  | { kind: "fake"; ad: FakeAd }
  | { kind: "real"; card: AffiliateCard };

function shuffle<T>(arr: T[], rng: RNG): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export function makeShuffleBag<T>(items: T[], rng: RNG): () => T | undefined {
  let bag: T[] = [];
  return function draw(): T | undefined {
    if (items.length === 0) return undefined;
    if (bag.length === 0) bag = shuffle(items.slice(), rng);
    return bag.pop();
  };
}

function randGap(rng: RNG): number {
  return 8 + Math.floor(rng() * 5); // 8..12 inclusive
}

export function makeFeed(opts?: { rng?: RNG; cards?: AffiliateCard[] }): () => FeedItem {
  const rng = opts?.rng ?? Math.random;
  const cards = opts?.cards ?? AFFILIATES;
  const gen = makeGenerator(rng);
  const bag = makeShuffleBag(cards, rng);
  let sinceReal = 0;
  let gap = randGap(rng);
  return function next(): FeedItem {
    if (sinceReal >= gap) {
      const card = bag();
      if (card) { sinceReal = 0; gap = randGap(rng); return { kind: "real", card }; }
    }
    sinceReal++;
    return { kind: "fake", ad: gen() };
  };
}
