import { afterEach, describe, expect, it, vi } from 'vitest';
import { APPEARANCE_OPTIONS, DEFAULT_APPEARANCE, normalizeAppearance, randomAppearance, validAppearance } from '../src/appearance';
import { heroChronicle, heroProfile, earnedTier, normalizeReputation } from '../src/reputation';
import { newHero, grantXp, spendPoint, damageFor, type Hero } from '../src/progression';
import { GameStore } from '../src/store';
import { loadHero, saveHero, SAVE_KEY } from '../src/storage';
import { ENEMIES } from '../src/enemies';
const memory=()=>{const map=new Map<string,string>();return {getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}}};
function setup(hero=newHero('Sol','sky')) {const storage=memory();saveHero(storage,hero);return {storage,game:selectLast(new GameStore(()=>0,storage))};}
const settled=(hero:Hero):Hero=>({...hero,reputation:normalizeReputation(hero,true)});
afterEach(()=>vi.useRealTimers());
describe('Appearance and character editing',()=>{
 it('supports every option and safely replaces unknown cosmetic ids',()=>{
  expect(Object.values(APPEARANCE_OPTIONS).map(o=>o.length)).toEqual([6,5,6,4,4,6]);
  for(const [key,options] of Object.entries(APPEARANCE_OPTIONS))for(const option of options)expect(validAppearance({...DEFAULT_APPEARANCE,[key]:option.id})).toBe(true);
  expect(validAppearance({...DEFAULT_APPEARANCE,hairStyle:'unknown'})).toBe(false);
  expect(normalizeAppearance({skin:'unknown',hairColor:'silver'},'berry')).toMatchObject({skin:'sand',hairColor:'silver',clothes:'berry'});
 });
 it('creates only selected starter with appearance and rejects invalid creation',()=>{
  const storage=memory(),game=selectLast(new GameStore(()=>0,storage));const appearance={...DEFAULT_APPEARANCE,clothes:'violet' as const,detail:'beard' as const};
  expect(game.createHero('Sol','violet','wand',{...appearance,skin:'unknown'} as never)).toBe(false);
  expect(game.createHero('Sol','violet','wand',appearance)).toBe(true);
  expect(loadHero(storage).hero).toMatchObject({name:'Sol',weapon:'wand',ownedWeapons:['wand'],appearance,strength:5,magic:5,maxHealth:40});game.dispose();
 });
 it('randomizes valid cosmetics without changing saved identity, weapon or stats',()=>{
  const {game,storage}=setup();const before=game.getSnapshot().hero,raw=storage.getItem(SAVE_KEY);game.openAppearance();
  for(const draw of [0,.2,.5,.99,1,NaN]){const appearance=randomAppearance(()=>draw);expect(validAppearance(appearance)).toBe(true);game.editAppearance(appearance);expect(game.getSnapshot().hero).toEqual(before);expect(storage.getItem(SAVE_KEY)).toBe(raw);}
  game.leaveTraining();expect(game.getSnapshot().appearanceDraft).toBeNull();expect(game.getSnapshot().hero).toEqual(before);game.dispose();
 });
 it('saves only cosmetics, preserves purchased equipment, progress and damage, and keeps bald hair color',()=>{
  const hero=settled({...grantXp(newHero('Sol','sky'),120),gold:99,weapon:'inferno_blade',ownedWeapons:['stick','inferno_blade'],savingGoal:'apprentice_staff',defeatedEnemies:['goran']});
  const {game,storage}=setup(hero);game.openAppearance();const appearance={...hero.appearance,hairStyle:'bald' as const,hairColor:'red' as const,clothes:'ember' as const};game.editAppearance(appearance);expect(game.saveAppearance()).toBe(true);
  const after=game.getSnapshot().hero!;expect(after).toEqual({...hero,appearance,color:'ember'});expect(damageFor(after)).toBe(damageFor(hero));expect(loadHero(storage).hero).toEqual(after);
  game.openAppearance();game.editAppearance({...appearance,hairStyle:'long'});expect(game.getSnapshot().appearanceDraft?.hairColor).toBe('red');game.leaveTraining();game.startTraining();game.openAppearance();expect(game.getSnapshot().screen).toBe('training');expect(game.saveAppearance()).toBe(false);game.dispose();
 });
});
describe('Deterministic hero chronicles',()=>{
 it('counts invested points instead of raw stats, with balanced for ties or no points',()=>{
  let h=grantXp(newHero('Sol','forest'),120);expect(heroProfile(h)).toBe('balanced');h=spendPoint(h,'strength');expect(heroProfile(h)).toBe('strength');h=spendPoint(h,'maxHealth');expect(heroProfile(h)).toBe('balanced');
  expect(heroProfile({...h,magic:7})).toBe('balanced');expect(heroProfile({...h,maxHealth:60})).toBe('health');expect(heroProfile({...h,magic:9})).toBe('magic');expect(heroProfile({...h,strength:6})).toBe('balanced');
 });
 it.each([[1,1],[2,1],[3,2],[5,2],[6,3],[9,3],[10,4],[14,4],[15,5],[100,5]])('level %s gives tier %s',(level,tier)=>{expect(earnedTier({...newHero('Sol','sky'),level})).toBe(tier);});
 it('raises tiers for actual milestones and never drops a previously reached tier',()=>{
  const hero=newHero('Sol','sky');expect(earnedTier({...hero,defeatedEnemies:['goran']})).toBe(2);expect(earnedTier({...hero,defeatedEnemies:['buldre']})).toBe(4);expect(earnedTier({...hero,defeatedEnemies:['klask']})).toBe(5);
  expect(normalizeReputation({...hero,reputation:{highestTier:5,seenTier:5,seenBoss:'none'}}).highestTier).toBe(5);
 });
 it('has twenty complete templates and never invents unrecorded victories',()=>{
  for(const level of [1,3,6,10,15])for(const stats of [{},{strength:7},{magic:7},{maxHealth:50}]){const h={...newHero('Sol','forest'),level,...stats};const text=heroChronicle(h);expect(text.title.length).toBeGreaterThan(5);expect(text.story).not.toMatch(/Gøran|Buldre|Klask/);expect(text.story.split(/[.!?](?:\s|$)/).filter(Boolean).length).toBeLessThanOrEqual(3);}
  const hero={...newHero('Sol','sky'),defeatedEnemies:ENEMIES.map(e=>e.id)};expect(heroChronicle(hero).story).toContain('Kong Klask');expect(heroChronicle(hero).story).not.toMatch(/Gøran|Buldre/);
 });
 it('is stable across weapon, appearance, replay and reload changes',()=>{
  const hero=settled({...newHero('Sol','sky'),defeatedEnemies:['goran']});const text=heroChronicle(hero);
  expect(heroChronicle({...hero,weapon:'wand',appearance:randomAppearance(),gold:500})).toEqual(text);
  const storage=memory();saveHero(storage,hero);expect(heroChronicle(loadHero(storage).hero!)).toEqual(text);
 });
 it('defers training reputation until hero screen, then acknowledges it once',()=>{
  vi.useFakeTimers();const h=settled({...newHero('Sol','sky'),level:2,xp:60,points:1});const {game,storage}=setup(h);game.startTraining();game.digit('1');game.submit();
  expect(game.getSnapshot().hero?.level).toBe(3);expect(game.getSnapshot().reputationNotice).toBeNull();vi.advanceTimersByTime(1200);expect(game.getSnapshot().screen).toBe('training');expect(game.getSnapshot().feedback).toBe('answering');expect(game.getSnapshot().reputationNotice).toBeNull();
  game.leaveTraining();expect(game.getSnapshot().reputationNotice).toBeTruthy();game.dismissReputation();game.startTraining();game.leaveTraining();expect(game.getSnapshot().reputationNotice).toBeNull();const reload=selectLast(new GameStore(()=>0,storage));expect(reload.getSnapshot().reputationNotice).toBeNull();game.dispose();reload.dispose();
 });
 it('shows one final boss update only after feedback, even when already tier five',()=>{
  vi.useFakeTimers();const hero=settled({...newHero('Sol','sky'),level:101,strength:205,defeatedEnemies:ENEMIES.slice(0,4).map(e=>e.id)});const {game,storage}=setup(hero);game.openArena();game.selectEnemy('buldre');game.startArena();game.digit('1');game.submit();vi.advanceTimersByTime(1200);game.digit('1');game.submit();expect(game.getSnapshot().reputationNotice).toBeNull();vi.advanceTimersByTime(1200);expect(game.getSnapshot().reputationNotice).toContain('Baronvelteren');
  game.startArena();for(let i=0;i<2;i++){game.digit('1');game.submit();vi.advanceTimersByTime(1200);}expect(game.getSnapshot().reputationNotice).toBeNull();const reload=selectLast(new GameStore(()=>0,storage));expect(reload.getSnapshot().reputationNotice).toBeNull();game.dispose();reload.dispose();
 });
 it('updates profile silently while allocating points',()=>{
  const {game}=setup(settled(grantXp(newHero('Sol','sky'),50)));game.spend('magic');expect(heroProfile(game.getSnapshot().hero!)).toBe('magic');expect(game.getSnapshot().reputationNotice).toBeNull();game.dispose();
 });
});
describe('Version four migration',()=>{
 it('preserves v3 purchases, arena, goals, settings and clothing without replaying old milestones',()=>{
  const storage=memory();const h={...grantXp(newHero('Sol','berry'),1000),gold:175,weapon:'storm_staff',ownedWeapons:['stick','storm_staff'],savingGoal:'inferno_blade',defeatedEnemies:ENEMIES.slice(0,10).map(e=>e.id),claimedBossBonuses:['buldre','klask']};const {appearance,reputation,...old}=h;
  storage.setItem(SAVE_KEY,JSON.stringify({version:3,hero:old}));storage.setItem('gangriket.sound','true');const hero=loadHero(storage).hero!;expect(hero).toMatchObject({...old,savingGoal:null});expect(hero.appearance.clothes).toBe('berry');expect(hero.reputation).toEqual({highestTier:5,seenTier:5,seenBoss:'klask'});const game=selectLast(new GameStore(()=>0,storage));expect(game.getSnapshot().reputationNotice).toBeNull();expect(storage.getItem('gangriket.sound')).toBe('true');game.dispose();
 });
 it('repairs missing visual variants without deleting progress',()=>{
  const storage=memory();const hero={...newHero('Sol','sky'),gold:250,appearance:{skin:'missing',hairStyle:'long',hairColor:'red',expression:'proud',detail:'paint',clothes:'missing'}};storage.setItem(SAVE_KEY,JSON.stringify({version:4,hero}));const result=loadHero(storage);expect(result.hero).toMatchObject({gold:250,name:'Sol',appearance:{skin:'sand',clothes:'sky',hairStyle:'long',detail:'paint'}});expect(result.notice).toBeTruthy();
 });
});

// Existing gameplay tests explicitly choose the last profile after the new startup selector.
function selectLast(g:GameStore){if(g.getSnapshot().screen==='heroes')g.selectHero(g.getSnapshot().activeHeroId!);return g;}
