import { damageFor, type Hero } from './progression';
import { isWeaponId, WEAPONS, type WeaponId } from './weapons';

export type Purchase = { weapon: WeaponId; previousDamage: number; newDamage: number };
export function buyWeapon(hero: Hero, id: WeaponId): { hero: Hero; purchase: Purchase } | null {
  if (!isWeaponId(id) || WEAPONS[id].tier === 0 || hero.ownedWeapons.includes(id) || hero.gold < WEAPONS[id].price) return null;
  const next = { ...hero, gold: hero.gold - WEAPONS[id].price, weapon: id,
    ownedWeapons: [...hero.ownedWeapons, id], savingGoal: hero.savingGoal === id ? null : hero.savingGoal };
  return { hero: next, purchase: { weapon: id, previousDamage: damageFor(hero), newDamage: damageFor(next) } };
}
export function equipOwned(hero: Hero, id: WeaponId): Hero {
  if (!isWeaponId(id) || !hero.ownedWeapons.includes(id) || hero.weapon === id) return hero;
  return { ...hero, weapon: id };
}
export function setGoal(hero: Hero, id: WeaponId | null): Hero {
  if (id !== null && (!isWeaponId(id) || WEAPONS[id].tier === 0 || hero.ownedWeapons.includes(id))) return hero;
  return { ...hero, savingGoal: id };
}
