import { CONFIG, type HeroColor } from './config';
import { WEAPONS, type WeaponId, type StarterId } from './weapons';
export { WEAPONS, type WeaponId } from './weapons';
export type Attribute = 'strength' | 'magic' | 'maxHealth';
export type Hero = {
  name: string; color: HeroColor; level: number; xp: number;
  strength: number; magic: number; maxHealth: number; points: number;
  weapon: WeaponId; gold: number;
  ownedWeapons: WeaponId[];
  savingGoal: WeaponId | null;
};
export const xpNeeded = (level: number) => CONFIG.progression.baseXp + CONFIG.progression.xpStep * (level - 1);
export const damageFor = (hero: Hero, weapon: WeaponId = hero.weapon) => hero[WEAPONS[weapon].stat] + WEAPONS[weapon].damage;
export const answersToLevel = (hero: Hero) => Math.ceil((xpNeeded(hero.level) - hero.xp) / CONFIG.progression.xpPerAnswer);
export const newHero = (name: string, color: HeroColor, weapon: StarterId = 'stick'): Hero => ({ name, color, ...CONFIG.progression.initial, weapon, ownedWeapons: [weapon], savingGoal: null });
export function grantXp(hero: Hero, amount: number): Hero {
  if (!Number.isSafeInteger(amount) || amount < 0) return hero;
  let { level, xp, points } = hero;
  xp += amount;
  while (xp >= xpNeeded(level)) { xp -= xpNeeded(level); level++; points++; }
  return { ...hero, level, xp, points };
}
export function spendPoint(hero: Hero, attribute: Attribute): Hero {
  if (hero.points < 1 || !Object.hasOwn(CONFIG.progression.increase, attribute)) return hero;
  return { ...hero, points: hero.points - 1, [attribute]: hero[attribute] + CONFIG.progression.increase[attribute] };
}
