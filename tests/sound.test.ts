import { afterEach, describe, expect, it, vi } from 'vitest';
import { SoundEngine, bindSound } from '../src/sound';
import { GameStore } from '../src/store';
import { CONFIG } from '../src/config';

afterEach(() => vi.useRealTimers());
function fakeAudio() {
  const voices: { stop: ReturnType<typeof vi.fn> }[] = [];
  const context = {
    state: 'running', currentTime: 0, destination: {}, resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn(() => {
      const oscillator = { frequency: { setValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
      voices.push(oscillator); return oscillator;
    }),
    createGain: vi.fn(() => ({ gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() })),
  };
  return { context, voices, factory: vi.fn(() => context as unknown as AudioContext) };
}
describe('Optional sound', () => {
  it('starts silent without creating an audio context, and never queues sounds', () => {
    const { factory, context } = fakeAudio();
    const audio = new SoundEngine(factory, null);
    audio.play('victory');
    expect(audio.getSnapshot()).toBe(false); expect(factory).not.toHaveBeenCalled();
    audio.setEnabled(true);
    expect(context.createOscillator).not.toHaveBeenCalled();
    audio.play('magic'); expect(context.createOscillator).toHaveBeenCalledTimes(3);
    audio.stop();
  });
  it('stops all scheduled tones on mute and remembers the setting', () => {
    const { factory, voices } = fakeAudio();
    let value: string | null = null;
    const storage = { getItem: () => value, setItem: (_key: string, v: string) => { value = v; } };
    const audio = new SoundEngine(factory, storage);
    audio.setEnabled(true); audio.play('victory');
    audio.setEnabled(false);
    for (const voice of voices) expect(voice.stop).toHaveBeenCalledTimes(2); // scheduled end, then immediate mute
    expect(new SoundEngine(factory, storage).getSnapshot()).toBe(false);
    audio.setEnabled(true);
    expect(new SoundEngine(factory, storage).getSnapshot()).toBe(true);
  });
  it('tolerates unavailable audio and inaccessible preference storage', async () => {
    const audio = new SoundEngine(() => { throw Error('unsupported'); }, {
      getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); },
    });
    expect(() => audio.setEnabled(true)).not.toThrow();
    await expect(audio.unlock()).resolves.toBeUndefined();
    expect(() => audio.play('hit')).not.toThrow();
  });
  it('handles rejected autoplay resume without affecting gameplay', async () => {
    const { factory, context } = fakeAudio();
    context.state = 'suspended'; context.resume.mockRejectedValue(Error('autoplay'));
    const audio = new SoundEngine(factory, null); audio.setEnabled(true);
    await expect(audio.unlock()).resolves.toBeUndefined();
    audio.play('hit'); expect(context.createOscillator).not.toHaveBeenCalled();
    const game = new GameStore(() => 0); game.createHero('Sol', 'forest'); game.startTraining();
    game.digit('1'); game.submit(); expect(game.getSnapshot().hero?.xp).toBe(10); game.dispose();
  });
  it('celebrates each level and victory once after the answer finishes, and cleans up', () => {
    vi.useFakeTimers();
    const game = new GameStore(() => 0);
    const audio = { play: vi.fn(), stop: vi.fn() };
    const unbind = bindSound(game, audio);
    game.createHero('Sol', 'sky'); game.startTraining();
    for (let i = 0; i < 5; i++) { game.digit('1'); game.submit(); vi.advanceTimersByTime(CONFIG.timing.correct); }
    expect(audio.play.mock.calls).toEqual([['level']]);
    game.leaveTraining(); game.openArena(); game.startArena();
    for (let i = 0; i < 10; i++) { game.digit('1'); game.submit(); vi.advanceTimersByTime(CONFIG.timing.correct); }
    expect(audio.play.mock.calls).toEqual([['level'], ['victory']]);
    game.submit(); game.digit('1'); expect(audio.play).toHaveBeenCalledTimes(2);
    unbind(); audio.stop.mockClear(); game.leaveTraining(); expect(audio.stop).not.toHaveBeenCalled();
    game.dispose();
  });
});
