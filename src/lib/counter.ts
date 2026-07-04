const KEY = "ads:counter";

export type CounterState = { revealed: string[]; passed: number };

export function emptyCounter(): CounterState {
  return { revealed: [], passed: 0 };
}

export function loadCounter(store: Storage = localStorage): CounterState {
  try {
    const raw = store.getItem(KEY);
    if (!raw) return emptyCounter();
    const parsed = JSON.parse(raw) as Partial<CounterState>;
    const revealed = Array.isArray(parsed.revealed) ? parsed.revealed.filter((x) => typeof x === "string") : [];
    const passed = typeof parsed.passed === "number" && parsed.passed >= 0 ? parsed.passed : 0;
    return { revealed, passed };
  } catch {
    return emptyCounter();
  }
}

export function saveCounter(s: CounterState, store: Storage = localStorage): void {
  try { store.setItem(KEY, JSON.stringify(s)); } catch { /* quota/full — ignore */ }
}

export function markPassed(s: CounterState): CounterState {
  return { ...s, passed: s.passed + 1 };
}

export function markRevealed(s: CounterState, id: string): CounterState {
  return s.revealed.includes(id) ? s : { ...s, revealed: [...s.revealed, id] };
}

export function distinctRealCount(s: CounterState): number {
  return s.revealed.length;
}
