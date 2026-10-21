import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameStore } from '../src/store';
import { makeQuestion } from '../src/questions';
import { CONFIG } from '../src/config';
import { makeKeyboardController } from '../src/keyboard';

describe('Phase 1 rules', () => {
  let game: GameStore;
  beforeEach(() => {
    vi.useFakeTimers();
    game = selectLast(new GameStore(() => .999999)); // 10 × 10, intentionally repeated.
    game.createHero('  Sol  ', 'forest');
    game.startTraining();
  });
  afterEach(() => { game.dispose(); vi.useRealTimers(); });
  const enter = (value: string) => { for (const digit of value) game.digit(digit); game.submit(); };

  it('draws both factors independently, as integers from 1 through 10', () => {
    const rng = vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(.999999);
    expect(makeQuestion(1, rng)).toEqual({ id: 1, a: 1, b: 10 });
    expect(rng).toHaveBeenCalledTimes(2);
    for (let i = 0; i < 1000; i++) {
      const { a, b } = makeQuestion(i);
      for (const n of [a, b]) {
        expect(Number.isInteger(n)).toBe(true);
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(10);
      }
    }
  });
  it('allows identical consecutive questions, but assigns a fresh ID', () => {
    const previous = game.getSnapshot().question!;
    enter('100');
    vi.advanceTimersByTime(CONFIG.timing.correct);
    const next = game.getSnapshot().question!;
    expect([next.a, next.b]).toEqual([previous.a, previous.b]);
    expect(next.id).not.toBe(previous.id);
  });
  it('grants exactly one 8-damage attack for 10 × 10 = 100, even with repeated input', () => {
    const attack = vi.fn();
    game.onAttack(attack);
    enter('100');
    for (let i = 0; i < 20; i++) { game.submit(); game.digit('1'); game.next(); game.backspace(); }
    expect(attack).toHaveBeenCalledTimes(1);
    expect(attack).toHaveBeenCalledWith({ questionId: game.getSnapshot().question!.id, damage: 8, kind: 'melee' });
    expect(game.getSnapshot().input).toBe('100');
    expect(game.getSnapshot().feedback).toBe('correct');
    vi.advanceTimersByTime(CONFIG.timing.correct - 1);
    expect(game.getSnapshot().feedback).toBe('correct');
    vi.advanceTimersByTime(1);
    expect(game.getSnapshot().input).toBe('');
    expect(attack).toHaveBeenCalledTimes(1);
  });
  it('keeps the same question after the first error and clears only the answer', () => {
    const question = game.getSnapshot().question;
    enter('12');
    expect(game.getSnapshot()).toMatchObject({ feedback: 'first-error', input: '12', mistakes: 1 });
    game.submit();
    game.digit('5');
    vi.advanceTimersByTime(CONFIG.timing.wrong);
    expect(game.getSnapshot()).toMatchObject({ feedback: 'answering', input: '', mistakes: 1, question });
  });
  it('reveals after a second error, never attacks, waits indefinitely, and resets on Next', () => {
    const attack = vi.fn();
    game.onAttack(attack);
    const oldId = game.getSnapshot().question!.id;
    enter('1');
    vi.advanceTimersByTime(CONFIG.timing.wrong);
    enter('2');
    expect(game.getSnapshot().feedback).toBe('second-error');
    game.next(); // The submit that caused the error cannot also dismiss it.
    expect(game.getSnapshot().question!.id).toBe(oldId);
    vi.advanceTimersByTime(CONFIG.timing.wrong);
    expect(game.getSnapshot()).toMatchObject({ feedback: 'reveal', input: '', mistakes: 2 });
    vi.advanceTimersByTime(100000);
    game.digit('8'); game.submit();
    expect(game.getSnapshot().feedback).toBe('reveal');
    expect(attack).not.toHaveBeenCalled();
    game.next();
    expect(game.getSnapshot()).toMatchObject({ feedback: 'answering', input: '', mistakes: 0 });
    expect(game.getSnapshot().question!.id).not.toBe(oldId);
  });
  it('ignores empty submissions and limits input to three digits with deletion', () => {
    game.submit();
    expect(game.getSnapshot().mistakes).toBe(0);
    ['1', '2', '3', '4', '-'].forEach(d => game.digit(d));
    expect(game.getSnapshot().input).toBe('123');
    game.backspace();
    expect(game.getSnapshot().input).toBe('12');
  });
  it('normalizes leading zeroes as integers', () => {
    const other = selectLast(new GameStore(() => 0));
    other.createHero('A', 'sky'); other.startTraining();
    ['0', '0', '1'].forEach(d => other.digit(d));
    other.submit();
    expect(other.getSnapshot().feedback).toBe('correct');
    other.dispose();
  });
  it('invalidates old feedback timers when navigating out and back', () => {
    enter('100');
    vi.advanceTimersByTime(100);
    game.leaveTraining();
    game.startTraining();
    const question = game.getSnapshot().question;
    game.digit('7');
    vi.advanceTimersByTime(2000);
    expect(game.getSnapshot()).toMatchObject({ question, input: '7', feedback: 'answering', hero: { name: 'Sol', color: 'forest' } });
  });
  it('removes scene attack listeners and cancels pending timers on disposal', () => {
    const removed = vi.fn();
    const active = vi.fn();
    const off = game.onAttack(removed);
    off();
    game.onAttack(active);
    enter('100');
    expect(removed).not.toHaveBeenCalled();
    expect(active).toHaveBeenCalledTimes(1);
    const state = game.getSnapshot();
    game.dispose();
    vi.runAllTimers();
    expect(game.getSnapshot()).toBe(state);
  });
  it('validates trimmed names and keeps the hero only in memory', () => {
    const other = selectLast(new GameStore());
    expect(other.createHero(' ', 'forest')).toBe(false);
    expect(other.createHero('a'.repeat(21), 'forest')).toBe(false);
    expect(other.createHero('  ' + 'a'.repeat(20) + ' ', 'berry')).toBe(true);
    expect(other.getSnapshot().hero?.name).toHaveLength(20);
    expect(selectLast(new GameStore()).getSnapshot().hero).toBeNull();
    other.dispose();
  });
  it('requires releasing Enter before a second-error reveal can be dismissed', () => {
    const keys = makeKeyboardController(game);
    const enterKey = { key: 'Enter', code: 'Enter', repeat: false, ctrlKey: false, metaKey: false, altKey: false, preventDefault: vi.fn() };
    enter('1'); vi.advanceTimersByTime(CONFIG.timing.wrong);
    game.digit('2');
    keys.down(enterKey);
    vi.advanceTimersByTime(CONFIG.timing.wrong);
    const id = game.getSnapshot().question!.id;
    keys.down({ ...enterKey, repeat: true });
    keys.down(enterKey);
    expect(game.getSnapshot()).toMatchObject({ feedback: 'reveal', question: { id } });
    keys.up(enterKey); keys.down(enterKey);
    expect(game.getSnapshot().feedback).toBe('answering');
    expect(game.getSnapshot().question!.id).not.toBe(id);
  });
  it('does not carry a held digit from feedback into the next question', () => {
    const keys = makeKeyboardController(game);
    const key = { key: '7', code: 'Digit7', repeat: false, ctrlKey: false, metaKey: false, altKey: false, preventDefault: vi.fn() };
    enter('100');
    keys.down(key);
    vi.advanceTimersByTime(CONFIG.timing.correct);
    keys.down({ ...key, repeat: true });
    keys.down(key);
    expect(game.getSnapshot().input).toBe('');
    keys.up(key); keys.down(key);
    expect(game.getSnapshot().input).toBe('7');
  });
});

// Existing gameplay tests explicitly choose the last profile after the new startup selector.
function selectLast(g:GameStore){if(g.getSnapshot().screen==='heroes')g.selectHero(g.getSnapshot().activeHeroId!);return g;}
