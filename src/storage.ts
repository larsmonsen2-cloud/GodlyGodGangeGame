import {freshTraining,validTraining} from './training';
import { isNextOffer } from './shop';
import { normalizeAppearance, validAppearance } from './appearance';
import { normalizeReputation } from './reputation';
import { ENEMIES, isEnemyId } from './enemies';
import { CONFIG } from './config';
import { WEAPONS, xpNeeded, type Hero } from './progression';

import { isWeaponId, isStarterId } from './weapons';

export const SAVE_KEY = 'gangriket.save';
export const SAVE_VERSION = 7;
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type StorageStatus = 'saved' | 'session' | 'invalid' | 'blocked';
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
  if(version<7)for(const id of defeatedEnemies)if(ENEMIES.some(e=>e.id===id&&e.boss)&&!claimedBossBonuses.includes(id))claimedBossBonuses.push(id);
  return {...h,defeatedEnemies,claimedBossBonuses};
}
function validPreviousHero(value: unknown): value is Hero {
  if (!validEquipment(value)) return false;
  const clean=restoreArena(value,7);
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

export type HeroProfile = { id: string; hero: Hero; notice?: string; seenLevel?: number };
export type HeroLibrary = { profiles: HeroProfile[]; lastHeroId: string | null; rejectedProfiles: unknown[] };
export const BACKUP_KEY = 'gangriket.save.before-profiles';
export const newProfileId = () => crypto.randomUUID();
const emptyLibrary = (): HeroLibrary => ({ profiles: [], lastHeroId: null, rejectedProfiles: [] });
const goalMessage = 'Butikken viser nå neste oppgradering. Det gamle sparemålet er fjernet; velg gjerne et nytt.';
function restoreHero(value: unknown, version: number): Hero | null {
  if (!validCore(value)) return null;
  const restored = restoreArena(restoreEquipment(value, version), version);
  const appearance = normalizeAppearance(version < 4 ? null : restored.appearance, restored.color);
  return {...restored, training:version<7?freshTraining():validTraining(restored.training)?restored.training:freshTraining(), appearance, color: appearance.clothes, reputation: normalizeReputation(restored, version < 5)};
}
function restoreProfile(hero: Hero, id: string, notice?: string): HeroProfile {
  if (hero.savingGoal && !isNextOffer(hero, hero.savingGoal)) return {id, hero:{...hero,savingGoal:null}, notice:goalMessage};
  return {id,hero,...(notice ? {notice} : {})};
}
export function saveLibrary(storage: SaveStorage | null, library: HeroLibrary): StorageStatus {
  try {
    if (!storage) return 'session';
    storage.setItem(SAVE_KEY, JSON.stringify({version:SAVE_VERSION,...library,profiles:library.profiles.map(p=>({...p,seenLevel:p.seenLevel??p.hero.level}))}));
    return 'saved';
  } catch { return 'session'; }
}
export function loadLibrary(storage: SaveStorage | null): HeroLibrary & { status: StorageStatus; notice?: string } {
  const empty=emptyLibrary();
  if (!storage) return {...empty,status:'session'};
  let raw: string | null;
  try {raw=storage.getItem(SAVE_KEY);} catch {return {...empty,status:'session'};}
  if (raw===null) return {...empty,status:'saved'};
  try {
    const save=JSON.parse(raw);
    let library:HeroLibrary;
    let repaired=false;
    if ([1,2,3,4].includes(save?.version)) {
      const hero=restoreHero(save.hero,save.version);
      if (!hero) return {...empty,status:'blocked'};
      const id=newProfileId();
      const profile={...restoreProfile(hero,id),seenLevel:hero.level};
      repaired=save.version>=4 ? !validHero(save.hero) : save.version===3 ? !validPreviousHero(save.hero) : save.version===2 ? !validEquipment(save.hero) : !isStarterId(save.hero.weapon);
      library={profiles:[profile],lastHeroId:id,rejectedProfiles:[]};
    } else if ([5,6,SAVE_VERSION].includes(save?.version) && Array.isArray(save.profiles)) {
      const profiles:HeroProfile[]=[], rejectedProfiles:unknown[]=Array.isArray(save.rejectedProfiles)?save.rejectedProfiles:[];
      const ids=new Set<string>();
      for (const value of save.profiles) {
        const hero=restoreHero(value?.hero,save.version);
        if (!hero) {rejectedProfiles.push(value);repaired=true;continue;}
        let id=value.id;
        if(typeof id!=='string'||!id||ids.has(id)){id=newProfileId();repaired=true;}
        ids.add(id);
        const seenLevel=save.version<6 || !Number.isSafeInteger(value.seenLevel) || value.seenLevel<1 || value.seenLevel>hero.level ? hero.level : value.seenLevel;
        profiles.push({...restoreProfile(hero,id,typeof value.notice==='string'?value.notice:undefined),seenLevel});
        if (!validHero(value.hero)||(save.version>=7&&!validTraining(value.hero.training))) repaired=true;
      }
      if (!profiles.length && rejectedProfiles.length) return {...empty,status:'blocked'};
      library={profiles,lastHeroId:profiles.some(p=>p.id===save.lastHeroId)?save.lastHeroId:profiles[0]?.id??null,rejectedProfiles};
    } else return {...empty,status:'blocked'};
    const changed=JSON.stringify({version:SAVE_VERSION,...library})!==raw;
    if(changed) {
      // Backup must succeed BEFORE replacing any old data. No overwriting on failed migration.
      if(save.version<SAVE_VERSION&&storage.getItem('gangriket.save.before-v7')===null)storage.setItem('gangriket.save.before-v7',raw);
      if(storage.getItem(BACKUP_KEY)===null)storage.setItem(BACKUP_KEY,raw);
      if(saveLibrary(storage,library)!=='saved')return {...empty,status:'blocked'};
    }
    return {...library,status:'saved',...(repaired?{notice:'Noen lagrede data ble reparert. Gyldige helter og fremgang er beholdt.'}:{})};
  } catch {return {...empty,status:'blocked'};}
}
// Compatibility helpers for focused rule tests and single-profile fixtures.
// Runtime always writes the full authoritative library via saveLibrary.
export function loadHero(storage: SaveStorage | null): {hero:Hero|null;status:StorageStatus;notice?:string} {
 const saved=loadLibrary(storage);const profile=saved.profiles.find(p=>p.id===saved.lastHeroId);
 return {hero:profile?.hero??null,status:saved.status,notice:profile?.notice??saved.notice};
}
export function saveHero(storage: SaveStorage | null, hero: Hero): StorageStatus {
 const saved=loadLibrary(storage);if(saved.status==='blocked')return 'blocked';
 const id=saved.lastHeroId??newProfileId();
 const profiles=saved.profiles.length?saved.profiles.map(p=>p.id===id?{...p,hero}:p):[{id,hero,seenLevel:hero.level}];
 return saveLibrary(storage,{profiles,lastHeroId:id,rejectedProfiles:saved.rejectedProfiles});
}
export function browserStorage(): SaveStorage | null {
  try { return window.localStorage; } catch { return null; }
}
