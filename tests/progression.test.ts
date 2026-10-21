import { acknowledgeReputation } from '../src/reputation';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONFIG } from '../src/config';
import { answersToLevel, damageFor, grantXp, newHero, spendPoint, xpNeeded } from '../src/progression';
import { loadHero, saveHero, SAVE_KEY, SAVE_VERSION, validHero, type SaveStorage } from '../src/storage';
import { GameStore } from '../src/store';

const memory = (): SaveStorage => {
  const data = new Map<string, string>();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); } };
};
const hero = () => newHero('Sol', 'sky');
afterEach(() => vi.useRealTimers());
describe('Progression and damage', () => {
  it('preserves overflow across several levels and grants only points', () => {
    const result = grantXp(hero(), 225); // 50 + 70 + 90, with 15 left.
    expect(result).toMatchObject({ level: 4, xp: 15, points: 3, strength: 5, magic: 5, maxHealth: 40, gold: 0 });
    expect(xpNeeded(4)).toBe(110);
    expect(answersToLevel(result)).toBe(10);
    expect(damageFor(result)).toBe(8);
  });
  it('spends each point once with independent weapon scaling and health', () => {
    let h = grantXp(hero(), 210);
    h = spendPoint(h, 'strength');
    expect(damageFor(h, 'stick')).toBe(10);
    expect(damageFor(h, 'wand')).toBe(8);
    h = spendPoint(h, 'magic');
    h = spendPoint(h, 'maxHealth');
    expect(h).toMatchObject({ strength: 7, magic: 7, maxHealth: 50, points: 0 });
    expect(damageFor(h, 'wand')).toBe(10);
    expect(spendPoint(h, 'strength')).toBe(h);
  });
  it('awards XP exactly once and continues answering while the level graphic is visible', () => {
    vi.useFakeTimers();
    const store = selectLast(new GameStore(() => 0, memory()));
    store.createHero('Sol', 'forest', 'wand'); store.startTraining();
    const hit = vi.fn(); store.onAttack(hit);
    for (let i = 0; i < 5; i++) {
      store.digit('1'); store.submit(); store.submit();
      expect(store.getSnapshot().levelUp).toBeNull();
      vi.advanceTimersByTime(CONFIG.timing.correct - 1);
      expect(store.getSnapshot().levelUp).toBeNull();
      vi.advanceTimersByTime(1);
    }
    expect(hit).toHaveBeenCalledTimes(5);
    expect(store.getSnapshot()).toMatchObject({ levelUp: 2, feedback: 'answering', hero: { level: 2, xp: 0, points: 1 } });
    store.digit('1'); store.submit();
    expect(store.getSnapshot().hero?.xp).toBe(10);
    expect(store.getSnapshot().levelUp).toBe(2);
    vi.advanceTimersByTime(CONFIG.timing.correct);
    expect(store.getSnapshot().feedback).toBe('answering');
    vi.advanceTimersByTime(CONFIG.timing.levelBanner);
    expect(store.getSnapshot().levelUp).toBeNull();
    store.leaveTraining(); store.spend('magic'); store.spend('magic');
    store.startTraining(); store.spend('strength');
    store.digit('1'); store.submit();
    expect(hit).toHaveBeenLastCalledWith(expect.objectContaining({ kind: 'magic', damage: 10 }));
    store.dispose();
  });
  it('gives no XP for errors or revealed answers, but rewards a corrected first error', () => {
    vi.useFakeTimers();
    const store = selectLast(new GameStore(() => 0));
    store.createHero('Sol', 'sky'); store.startTraining();
    for (let i = 0; i < 2; i++) { store.digit('2'); store.submit(); vi.advanceTimersByTime(CONFIG.timing.wrong); }
    store.next();
    expect(store.getSnapshot().hero?.xp).toBe(0);
    store.digit('2'); store.submit(); vi.advanceTimersByTime(CONFIG.timing.wrong);
    store.digit('1'); store.submit();
    expect(store.getSnapshot().hero?.xp).toBe(10);
    store.leaveTraining(); vi.runAllTimers();
    expect(store.getSnapshot()).toMatchObject({ screen: 'hero', levelUp: null, hero: { xp: 10 } });
    store.dispose();
  });
});

describe('Versioned local saves', () => {
  it('saves the weapon chosen during creation and rejects invalid choices', () => {
    const storage = memory();
    const store = selectLast(new GameStore(Math.random, storage));
    expect(store.createHero('Sol', 'sky', 'unknown' as 'wand')).toBe(false);
    expect(store.createHero('Sol', 'sky', 'wand')).toBe(true);
    expect(store.createHero('Sol', 'sky', 'stick')).toBe(false);
    const restored = selectLast(new GameStore(Math.random, storage));
    expect(restored.getSnapshot().hero?.weapon).toBe('wand');
    store.dispose(); restored.dispose();
  });

  it('restores all progress on the hero screen, never a pending question', () => {
    vi.useFakeTimers();
    const storage = memory();
    const trained = { ...spendPoint(grantXp(hero(), 125), 'magic'), weapon: 'wand' as const, ownedWeapons: ['wand' as const], gold: 25 };
    expect(saveHero(storage, trained)).toBe('saved');
    const store = selectLast(new GameStore(() => 0, storage));
    expect(store.getSnapshot()).toMatchObject({ screen: 'hero', question: null, hero: acknowledgeReputation(trained) });
    store.spend('maxHealth'); store.startTraining(); store.digit('1'); store.submit();
    const reloaded = selectLast(new GameStore(Math.random, storage));
    expect(reloaded.getSnapshot()).toMatchObject({ screen: 'hero', feedback: 'answering', levelUp: null, hero: { xp: 15, level: 3, points: 0, maxHealth: 50, magic: 7, weapon: 'wand', gold: 25 } });
    store.dispose(); reloaded.dispose();
  });
  it('rejects corrupt, incompatible and impossible saves without crashing', () => {
    const storage = memory();
    for (const raw of ['{', 'null', JSON.stringify({ version: 99, hero: hero() }), JSON.stringify({ version: SAVE_VERSION, hero: { ...hero(), points: 10 } })]) {
      storage.setItem(SAVE_KEY, raw);
      expect(loadHero(storage)).toEqual({ hero: null, status: 'blocked' });
    }
    for (const patch of [{ xp: 50 }, { strength: 6 }, { gold: -1 }, { level: Infinity }, { weapon: 'unknown' }, { name: 'x'.repeat(21) }, { magic: NaN }, { color: 'orange' }]) {
      expect(validHero({ ...hero(), ...patch })).toBe(false);
    }
  });
  it('keeps play working and warns when storage throws on reading or writing', () => {
    const storage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } };
    expect(loadHero(storage)).toEqual({ hero: null, status: 'session' });
    const store = selectLast(new GameStore(Math.random, storage));
    expect(store.createHero('Sol', 'forest')).toBe(true);
    expect(store.getSnapshot()).toMatchObject({ screen: 'hero', storageStatus: 'session', hero: { name: 'Sol' } });
    store.dispose();
  });
});


// Existing gameplay tests explicitly choose the last profile after the new startup selector.
function selectLast(g:GameStore){if(g.getSnapshot().screen==='heroes')g.selectHero(g.getSnapshot().activeHeroId!);return g;}
