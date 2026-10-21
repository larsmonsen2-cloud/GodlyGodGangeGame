import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameStore } from '../src/store';
import { CONFIG } from '../src/config';
import { EnemyClock } from '../src/combat';
import { saveHero, type SaveStorage } from '../src/storage';
import { newHero, grantXp, spendPoint } from '../src/progression';

describe('Arena combat', () => {
  let game: GameStore;
  let storage: SaveStorage;
  beforeEach(() => {
    vi.useFakeTimers();
    const values = new Map<string, string>();
    storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
    game = selectLast(new GameStore(() => 0, storage));
    game.createHero('Sol', 'forest');
    game.openArena(); game.selectEnemy('goran');
  });
  afterEach(() => { game.dispose(); vi.useRealTimers(); });
  const answer = (text = '1') => { for (const digit of text) game.digit(digit); game.submit(); };
  const win = () => { for (let i = 0; i < 10; i++) { answer(); vi.advanceTimersByTime(CONFIG.timing.correct); } };

  it('waits for Start and gives the first enemy attack one full interval', () => {
    vi.advanceTimersByTime(60000);
    expect(game.getSnapshot()).toMatchObject({ screen: 'arena-intro', combat: null });
    game.startArena();
    vi.advanceTimersByTime(4999);
    expect(game.getSnapshot().combat?.hp).toBe(40);
    vi.advanceTimersByTime(1);
    expect(game.getSnapshot().combat?.hp).toBe(34);
    expect(game.enemyRemaining()).toBe(5000);
  });
  it('preserves exact remaining time through correct, wrong and revealed feedback', () => {
    game.startArena(); vi.advanceTimersByTime(2000);
    answer();
    expect(game.getSnapshot().combat?.enemyHp).toBe(72);
    vi.advanceTimersByTime(1200);
    expect(game.enemyRemaining()).toBe(3000);
    answer('2'); vi.advanceTimersByTime(350);
    expect(game.enemyRemaining()).toBe(3000);
    answer('2'); vi.advanceTimersByTime(350);
    expect(game.getSnapshot().feedback).toBe('reveal');
    vi.advanceTimersByTime(60000);
    expect(game.enemyRemaining()).toBe(3000);
    game.next(); vi.advanceTimersByTime(2999);
    expect(game.getSnapshot().combat?.hp).toBe(40);
    vi.advanceTimersByTime(1);
    expect(game.getSnapshot().combat?.hp).toBe(34);
  });
  it('keeps manual or visibility pause when a feedback timer completes', () => {
    game.startArena(); vi.advanceTimersByTime(1000);
    answer(); game.pauseArena();
    vi.advanceTimersByTime(10000);
    expect(game.getSnapshot()).toMatchObject({ feedback: 'answering', combat: { paused: true, hp: 40 } });
    answer(); expect(game.getSnapshot().input).toBe('');
    expect(game.enemyRemaining()).toBe(4000);
    game.resumeArena(); vi.advanceTimersByTime(3999);
    expect(game.getSnapshot().combat?.hp).toBe(40);
    vi.advanceTimersByTime(1); expect(game.getSnapshot().combat?.hp).toBe(34);
  });
  it('can resume manual pause during reveal without restarting the enemy clock', () => {
    game.startArena(); vi.advanceTimersByTime(2200);
    answer('2'); vi.advanceTimersByTime(350); answer('2'); vi.advanceTimersByTime(350);
    game.pauseArena(); game.next(); game.resumeArena();
    vi.advanceTimersByTime(30000);
    expect(game.getSnapshot().feedback).toBe('reveal');
    expect(game.enemyRemaining()).toBe(2800);
    game.next(); vi.advanceTimersByTime(2800);
    expect(game.getSnapshot().combat?.hp).toBe(34);
  });
  it('wins once, waits for the final equation, grants gold but no XP, and resets for a rematch', () => {
    game.startArena(); const firstId = game.getSnapshot().combat!.id;
    for (let i = 0; i < 9; i++) { answer(); vi.advanceTimersByTime(1200); }
    answer(); game.submit(); game.next(); game.startArena();
    expect(game.getSnapshot()).toMatchObject({ combat: { outcome: 'won', enemyHp: 0, resultReady: false }, hero: { gold: 25, xp: 0, level: 1 } });
    vi.advanceTimersByTime(1199); expect(game.getSnapshot().combat?.resultReady).toBe(false);
    vi.advanceTimersByTime(1); expect(game.getSnapshot().combat?.resultReady).toBe(true);
    vi.advanceTimersByTime(50000); answer();
    expect(game.getSnapshot().hero?.gold).toBe(25);
    game.startArena();
    expect(game.getSnapshot()).toMatchObject({ feedback: 'answering', mistakes: 0, input: '', combat: { hp: 40, enemyHp: 80, resultReady: false, paused: false } });
    expect(game.getSnapshot().combat!.id).not.toBe(firstId);
    expect(game.enemyRemaining()).toBe(5000);
    win(); expect(game.getSnapshot().hero?.gold).toBe(50);
  });
  it('loses without removing progress and ignores attacks after defeat', () => {
    game.startArena(); vi.advanceTimersByTime(35000);
    expect(game.getSnapshot().combat).toMatchObject({ hp: 0, outcome: 'lost', resultReady: true });
    const hero = game.getSnapshot().hero;
    answer(); vi.advanceTimersByTime(100000);
    expect(game.getSnapshot().hero).toEqual(hero);
    expect(game.getSnapshot().combat?.enemyHp).toBe(80);
    game.startTraining(); answer();
    expect(game.getSnapshot()).toMatchObject({ screen: 'training', combat: null, hero: { xp: 10 } });
  });
  it('prioritizes an already-due enemy hit over a simultaneous submitted answer', () => {
    game.startArena(); vi.advanceTimersByTime(30000);
    expect(game.getSnapshot().combat?.hp).toBe(4);
    game.digit('1'); vi.setSystemTime(Date.now() + 5000); game.submit();
    expect(game.getSnapshot().combat).toMatchObject({ hp: 0, enemyHp: 80, outcome: 'lost' });
  });
  it('restores the hero but never restores a fight or grants a reload reward', () => {
    game.startArena(); answer();
    const reload = selectLast(new GameStore(() => 0, storage));
    expect(reload.getSnapshot()).toMatchObject({ screen: 'hero', combat: null, question: null, hero: { gold: 0, xp: 0 } });
    reload.dispose();
    game.leaveTraining(); game.openArena(); game.selectEnemy('goran'); game.startArena();
    vi.advanceTimersByTime(1200); expect(game.getSnapshot().combat?.enemyHp).toBe(80);
    game.leaveTraining(); vi.advanceTimersByTime(50000);
    expect(game.getSnapshot()).toMatchObject({ screen: 'hero', combat: null });
  });
  it('uses trained magic and health without scaling the enemy or spending mid-fight', () => {
    game.dispose();
    let hero = grantXp(newHero('Sol', 'sky', 'wand'), 120);
    hero = spendPoint(spendPoint(hero, 'magic'), 'maxHealth');
    saveHero(storage, { ...hero, weapon: 'wand' });
    game = selectLast(new GameStore(() => 0, storage)); game.openArena(); game.selectEnemy('goran'); game.startArena();
    const attack = vi.fn(); game.onAttack(attack); game.spend('strength'); answer();
    expect(game.getSnapshot().combat).toMatchObject({ hp: 50, enemyHp: 70 });
    expect(attack).toHaveBeenCalledWith(expect.objectContaining({ kind: 'magic', damage: 10 }));
  });
  it('does not replay a burst of attacks after a delayed timer', () => {
    const attack = vi.fn();
    const clock = new EnemyClock(5000, () => { attack(); clock.resume(); });
    clock.resume(); vi.setSystemTime(Date.now() + 60000); clock.flush();
    expect(attack).toHaveBeenCalledTimes(1);
    expect(clock.getRemaining()).toBe(5000);
    clock.reset();
  });
});


// Existing gameplay tests explicitly choose the last profile after the new startup selector.
function selectLast(g:GameStore){if(g.getSnapshot().screen==='heroes')g.selectHero(g.getSnapshot().activeHeroId!);return g;}
