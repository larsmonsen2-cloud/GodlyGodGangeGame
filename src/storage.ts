import { CONFIG } from './config';
import { WEAPONS, xpNeeded, type Hero } from './progression';

export const SAVE_KEY = 'gangriket.save';
export const SAVE_VERSION = 1;
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type StorageStatus = 'saved' | 'session' | 'invalid';
export function validHero(value: unknown): value is Hero {
  if (!value || typeof value !== 'object') return false;
  const h = value as Hero;
  if (typeof h.name !== 'string' || h.name !== h.name.trim() || !h.name || Array.from(h.name).length > CONFIG.maxNameLength ||
      !CONFIG.colors.some(c => c.id === h.color) || !Object.hasOwn(WEAPONS, h.weapon)) return false;
  if (![h.level, h.xp, h.strength, h.magic, h.maxHealth, h.points, h.gold].every(n => Number.isSafeInteger(n) && n >= 0)) return false;
  const { initial, increase } = CONFIG.progression;
  if (h.level < 1 || !Number.isSafeInteger(xpNeeded(h.level)) || h.xp >= xpNeeded(h.level) || h.strength < initial.strength || h.magic < initial.magic || h.maxHealth < initial.maxHealth) return false;
  const spent = [(h.strength - initial.strength) / increase.strength, (h.magic - initial.magic) / increase.magic, (h.maxHealth - initial.maxHealth) / increase.maxHealth];
  return spent.every(Number.isInteger) && spent.reduce((a, b) => a + b, h.points) === h.level - 1;
}
export function loadHero(storage: SaveStorage | null): { hero: Hero | null; status: StorageStatus } {
  if (!storage) return { hero: null, status: 'session' };
  let raw: string | null;
  try { raw = storage.getItem(SAVE_KEY); }
  catch { return { hero: null, status: 'session' }; }
  try {
    if (raw === null) return { hero: null, status: 'saved' };
    const save = JSON.parse(raw);
    if (save?.version !== SAVE_VERSION || !validHero(save.hero)) return { hero: null, status: 'invalid' };
    return { hero: save.hero, status: 'saved' };
  } catch { return { hero: null, status: 'invalid' }; }
}
export function saveHero(storage: SaveStorage | null, hero: Hero): StorageStatus {
  try {
    if (!storage) return 'session';
    storage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, hero }));
    return 'saved';
  } catch { return 'session'; }
}
export function browserStorage(): SaveStorage | null {
  try { return window.localStorage; } catch { return null; }
}
