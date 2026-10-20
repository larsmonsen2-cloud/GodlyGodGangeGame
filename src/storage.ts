import { normalizeAppearance, validAppearance } from './appearance';
import { normalizeReputation } from './reputation';
import { ENEMIES, isEnemyId } from './enemies';
import { CONFIG } from './config';
import { WEAPONS, xpNeeded, type Hero } from './progression';

import { isWeaponId, isStarterId } from './weapons';

export const SAVE_KEY = 'gangriket.save';
export const SAVE_VERSION = 4;
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type StorageStatus = 'saved' | 'session' | 'invalid';
function validCore(value: unknown): value is Hero {
  if (!value || typeof value !== 'object') return false;
  const h = value as Hero;
  if (typeof h.name !== 'string' || h.name !== h.name.trim() || !h.name || Array.from(h.name).length > CONFIG.maxNameLength) return false;
  if (![h.level, h.xp, h.strength, h.magic, h.maxHealth, h.points, h.gold].every(n => Number.isSafeInteger(n) && n >= 0)) return false;
  const { initial, increase } = CONFIG.progression;
  if (h.level < 1 || !Number.isSafeInteger(xpNeeded(h.level)) || h.xp >= xpNeeded(h.level) || h.strength < initial.strength || h.magic < initial.magic || h.maxHealth < initial.maxHealth) return false;
  const spent = [(h.strength - initial.strength) / increase.strength, (h.magic - initial.magic) / increase.magic, (h.maxHealth - initial.maxHealth) / increase.maxHealth];
  return spent.every(Number.isInteger) && spent.reduce((a, b) => a + b, h.points) === h.level - 1;
}
function validEquipment(value: unknown): value is Hero {
  if (!validCore(value)) return false;
  const h = value;
  return isWeaponId(h.weapon) && Array.isArray(h.ownedWeapons) && h.ownedWeapons.length > 0 &&
    h.ownedWeapons.every(isWeaponId) && new Set(h.ownedWeapons).size === h.ownedWeapons.length && h.ownedWeapons.includes(h.weapon) &&
    (h.savingGoal === null || (isWeaponId(h.savingGoal) && WEAPONS[h.savingGoal].tier > 0 && !h.ownedWeapons.includes(h.savingGoal)));
}
function restoreArena(h: Hero, version: number): Hero {
  // Versions 1–2 never recorded victories. Gold is not evidence of a win.
  const raw = version < 3 ? [] : (Array.isArray(h.defeatedEnemies) ? h.defeatedEnemies : []);
  const defeatedEnemies: Hero['defeatedEnemies'] = [];
  for (const enemy of ENEMIES) { if (!raw.includes(enemy.id)) break; defeatedEnemies.push(enemy.id); }
  // Retain known paid bonuses even when repairing an inconsistent progression.
  const claimedBossBonuses = version < 3 ? [] : [...new Set(Array.isArray(h.claimedBossBonuses) ? h.claimedBossBonuses.filter(id => isEnemyId(id) && ENEMIES.some(e=>e.id===id && e.boss)) : [])];
  return {...h,defeatedEnemies,claimedBossBonuses};
}
function validPreviousHero(value: unknown): value is Hero {
  if (!validEquipment(value)) return false;
  const clean=restoreArena(value,3);
  return JSON.stringify(value.defeatedEnemies)===JSON.stringify(clean.defeatedEnemies) && JSON.stringify(value.claimedBossBonuses)===JSON.stringify(clean.claimedBossBonuses);
}
export function validHero(value: unknown): value is Hero {
  if (!validPreviousHero(value)) return false;
  return validAppearance(value.appearance) && value.color===value.appearance.clothes && JSON.stringify(value.reputation)===JSON.stringify(normalizeReputation(value));
}
function restoreEquipment(h: Hero, version: number): Hero {
  if (version === 1) {
    const weapon = isStarterId(h.weapon) ? h.weapon : 'stick';
    return { ...h, weapon, ownedWeapons: [weapon], savingGoal: null };
  }
  const ownedWeapons = [...new Set(Array.isArray(h.ownedWeapons) ? h.ownedWeapons.filter(isWeaponId) : [])];
  if (!ownedWeapons.length) ownedWeapons.push(isStarterId(h.weapon) ? h.weapon : 'stick');
  const weapon = isWeaponId(h.weapon) && ownedWeapons.includes(h.weapon) ? h.weapon : ownedWeapons[0];
  const savingGoal = isWeaponId(h.savingGoal) && WEAPONS[h.savingGoal].tier > 0 && !ownedWeapons.includes(h.savingGoal) ? h.savingGoal : null;
  return { ...h, weapon, ownedWeapons, savingGoal };
}
export function loadHero(storage: SaveStorage | null): { hero: Hero | null; status: StorageStatus; notice?: string } {
  if (!storage) return { hero: null, status: 'session' };
  let raw: string | null;
  try { raw = storage.getItem(SAVE_KEY); }
  catch { return { hero: null, status: 'session' }; }
  try {
    if (raw === null) return { hero: null, status: 'saved' };
    const save = JSON.parse(raw);
    if (![1,2,3,SAVE_VERSION].includes(save?.version) || !validCore(save.hero)) return { hero: null, status: 'invalid' };
    const restored = restoreArena(restoreEquipment(save.hero, save.version), save.version);
    const appearance = normalizeAppearance(save.version < 4 ? null : restored.appearance, restored.color);
    const hero = {...restored, appearance, color: appearance.clothes, reputation: normalizeReputation(restored,save.version<4)};
    const repaired = save.version === 1 ? !isStarterId(save.hero.weapon) : save.version === 2 ? !validEquipment(save.hero) : save.version === 3 ? !validPreviousHero(save.hero) : !validHero(save.hero);
    const changed = save.version !== SAVE_VERSION || repaired;
    return { hero, status: changed ? saveHero(storage, hero) : 'saved',
      ...(repaired ? { notice: 'Ukjente eller ugyldige heltedata ble reparert. Øvrig fremgang er beholdt.' } : {}) };
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
