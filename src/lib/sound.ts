const KEY = "ads:sound";

export function loadSoundPref(store: Storage = localStorage): boolean {
  try { return store.getItem(KEY) === "1"; } catch { return false; }
}

export function saveSoundPref(on: boolean, store: Storage = localStorage): void {
  try { store.setItem(KEY, on ? "1" : "0"); } catch { /* ignore */ }
}

type Ctor = typeof AudioContext;

export class SoundEngine {
  enabled = false;
  private ctx: AudioContext | null = null;

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const C: Ctor | undefined =
      (globalThis as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor }).AudioContext ??
      (globalThis as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!C) return null;
    this.ctx = new C();
    return this.ctx;
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (on) this.resumeOnGesture();
  }

  resumeOnGesture(): void {
    const ctx = this.ensure();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  /** Obnoxious two-blip "ad jingle". No-op if disabled or no audio. */
  jingle(): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    for (const [i, freq] of [880, 1320].entries()) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.12 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.12);
    }
  }
}
