import { TEMPLATES, type Template, type Reveal } from "./templates";

export type RNG = () => number;

export type FakeAd = {
  id: string;
  template: string;
  style: string;
  headline: string;
  subtext: string;
  cta: string;
  reveal: Reveal;
};

export function pickWeighted(templates: Template[], rng: RNG, excludeId?: string): Template {
  const pool = templates.filter((t) => t.id !== excludeId);
  const usable = pool.length > 0 ? pool : templates;
  const total = usable.reduce((s, t) => s + t.weight, 0);
  let roll = rng() * total;
  for (const t of usable) {
    roll -= t.weight;
    if (roll < 0) return t;
  }
  return usable[usable.length - 1]!;
}

export function makeGenerator(rng: RNG = Math.random): () => FakeAd {
  let lastId: string | undefined;
  let seq = 0;
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]!;
  return function next(): FakeAd {
    const t = pickWeighted(TEMPLATES, rng, lastId);
    lastId = t.id;
    return {
      id: `f${seq++}`,
      template: t.id,
      style: t.style,
      headline: pick(t.headlines),
      subtext: pick(t.subtexts),
      cta: pick(t.ctas),
      reveal: t.reveal,
    };
  };
}
