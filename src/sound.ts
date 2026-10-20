import { CONFIG } from './config';
import type { GameStore } from './store';

export type Sound = 'hit' | 'magic' | 'hurt' | 'level' | 'victory';
type PreferenceStore = Pick<Storage, 'getItem' | 'setItem'>;
const KEY = 'gangriket.sound';
const notes: Record<Sound, readonly number[]> = {
  hit: [160, 90], magic: [440, 660, 880], hurt: [110, 70],
  level: [523, 659, 784], victory: [523, 659, 784, 1047],
};

// Audio is optional presentation: browser restrictions never block gameplay.
export class SoundEngine {
  private enabled = false;
  private context: AudioContext | null = null;
  private voices = new Set<OscillatorNode>();
  private listeners = new Set<() => void>();
  constructor(private factory: () => AudioContext, private storage: PreferenceStore | null) {
    try { this.enabled = storage?.getItem(KEY) === 'on'; } catch { /* session preference */ }
  }
  getSnapshot = () => this.enabled;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try { this.storage?.setItem(KEY, enabled ? 'on' : 'off'); } catch { /* session preference */ }
    this.stop();
    this.listeners.forEach(listener => listener());
    if (enabled) void this.unlock();
  }
  async unlock() {
    if (!this.enabled) return;
    try {
      this.context ??= this.factory();
      if (this.context.state === 'suspended') await this.context.resume();
    } catch { /* Playback is best-effort, never a rejected game action. */ }
  }
  play(sound: Sound) {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (!this.enabled || !this.context || this.context.state !== 'running') return;
    try {
      const context = this.context;
      notes[sound].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + index * CONFIG.audio.noteGap;
        oscillator.type = sound === 'hit' || sound === 'hurt' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(CONFIG.audio.volume, start + .008);
        gain.gain.exponentialRampToValueAtTime(.001, start + CONFIG.audio.noteLength);
        oscillator.connect(gain); gain.connect(context.destination);
        this.voices.add(oscillator);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); this.voices.delete(oscillator); };
        oscillator.start(start); oscillator.stop(start + CONFIG.audio.noteLength + .02);
      });
    } catch { this.stop(); }
  }
  stop() {
    this.voices.forEach(voice => { try { voice.stop(); } catch { /* already stopped */ } });
    this.voices.clear();
  }
}

function preferenceStorage() { try { return window.localStorage; } catch { return null; } }
export const sound = new SoundEngine(() => new AudioContext(), preferenceStorage());

export function bindSound(store: GameStore, audio: Pick<SoundEngine, 'play' | 'stop'>) {
  let previous = store.getSnapshot();
  return store.subscribe(() => {
    const state = store.getSnapshot();
    if (state.screen !== previous.screen || (state.combat?.paused && !previous.combat?.paused)) audio.stop();
    if (state.levelUp && state.levelUp !== previous.levelUp) audio.play('level');
    if (state.combat?.outcome === 'won' && state.combat.resultReady && !previous.combat?.resultReady) audio.play('victory');
    previous = state;
  });
}
