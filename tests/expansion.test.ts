import {buyWeapon,nextWeapon,equipOwned} from '../src/shop';
import {afterEach,describe,it,expect,vi} from 'vitest';
import {dummyFor,freshTraining,trainHit,TRAINING,validTraining} from '../src/training';
import {grantXp,newHero,xpNeeded,damageFor} from '../src/progression';
import {ENEMIES,awardVictory,isUnlocked} from '../src/enemies';
import {CATALOG} from '../src/weapons';
import {ARENAS} from '../src/arenas';
import {weaponShapes} from '../src/weaponVisuals';
import {enemyShapes} from '../src/enemyVisuals';
import {GameStore} from '../src/store';
import {SAVE_KEY,loadLibrary,saveLibrary} from '../src/storage';
const memory=()=>{const map=new Map<string,string>();return {getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};};
afterEach(()=>vi.useRealTimers());
describe('Training journey',()=>{
 it('takes eight ordinary starter hits and conserves overkill',()=>{
  let t=freshTraining();for(let i=0;i<7;i++){const r=trainHit(t,8);expect(r.bonus).toBe(0);t=r.training;}
  const r=trainHit(t,20);expect(r).toMatchObject({count:1,bonus:8,training:{hp:52,position:1,broken:1}});
 });
 it('awards health-proportional bonus through exams and rank changes',()=>{
  const r=trainHit(freshTraining(),64*11+17);expect(r).toMatchObject({count:10,bonus:88,training:{rank:1,position:0,hp:111,medals:[0]}});
 });
 it('aggregates a huge attack without an unbounded per-dummy loop',()=>{
  const r=trainHit(freshTraining(),1_000_000_000_000);expect(validTraining(r.training)).toBe(true);expect(r.training.rank).toBe(9);expect(r.training.medals).toHaveLength(10);expect(r.count).toBeGreaterThan(100_000_000);
  // Bonuses cover full max HP of destroyed dummies; the rest is damage on the last one.
  expect(r.bonus*8+dummyFor(r.training).maxHp-r.training.hp).toBe(1_000_000_000_000);
 });
 it('matches partitioned attacks over all content and repeats',()=>{
  const single=trainHit(freshTraining(),900_000);let t=freshTraining(),bonus=0;
  for(let i=0;i<3000;i++){const r=trainHit(t,300);t=r.training;bonus+=r.bonus;}
  expect({...t,bestHit:0}).toEqual({...single.training,bestHit:0});expect(bonus).toBe(single.bonus);
 });
 it.each([0,4,9])('keeps damage valuable at rank %s',rank=>{
  const start={...freshTraining(),rank,hp:TRAINING[rank].health};
  const weak=trainHit(start,8*60000),strong=trainHit(start,12*60000);
  expect(strong.bonus).toBeGreaterThan(weak.bonus);expect(strong.count).toBeGreaterThan(weak.count);
  expect(strong.bonus/60000).toBeGreaterThan(1);
 });
 it('handles many levels and preserves exact XP and skill points',()=>{
  for(const amount of [0,49,50,120,10000,1_000_000_000_000]){
   const r=grantXp(newHero('Test','sky'),amount),n=r.level-1;
   expect(n*50+10*n*(n-1)+r.xp).toBe(amount);expect(r.points).toBe(n);expect(r.xp).toBeLessThan(xpNeeded(r.level));
  }
 });
 it('persists damage immediately, keeps heroes separate, and errors/reveals do nothing',()=>{
  vi.useFakeTimers();const storage=memory(),hero=newHero('A','sky');saveLibrary(storage,{profiles:[{id:'a',hero},{id:'b',hero:newHero('B','berry')}],lastHeroId:'a',rejectedProfiles:[]});
  const g=new GameStore(()=>0,storage);g.selectHero('a');g.startTraining();g.digit('1');g.submit();g.submit();expect(g.getSnapshot().hero!.training.hp).toBe(56);g.leaveTraining();g.openHeroes();g.selectHero('b');expect(g.getSnapshot().hero!.training.hp).toBe(64);vi.advanceTimersByTime(5000);g.openHeroes();g.selectHero('a');g.startTraining();const before=g.getSnapshot().hero;
  for(let i=0;i<2;i++){g.digit('2');g.submit();vi.advanceTimersByTime(350);}g.next();expect(g.getSnapshot().hero).toBe(before);g.dispose();
  const restored=new GameStore(()=>0,storage);restored.selectHero('a');expect(restored.getSnapshot().hero!.training.hp).toBe(56);expect(restored.getSnapshot().streak).toBe(0);restored.dispose();
 });
 it('grants multi-break bonus and multiple levels once even before animation completes',()=>{
  vi.useFakeTimers();const storage=memory(),hero={...newHero('A','sky'),xp:49,weapon:'melee_19' as const,ownedWeapons:['melee_19' as const]};saveLibrary(storage,{profiles:[{id:'a',hero}],lastHeroId:'a',rejectedProfiles:[]});const g=new GameStore(()=>0,storage);g.selectHero('a');g.startTraining();g.digit('1');g.submit();g.submit();const r=g.getSnapshot();expect(r.trainingReward).toEqual({count:9,bonus:72});expect(r.hero).toMatchObject({level:3,xp:11,points:2,gold:0});expect(r.hero!.training.hp).toBe(91);g.dispose();
 });
 it('backs up v6 exactly, migrates once and retains old unlocks/equipment/bonus claims',()=>{
  const storage=memory();const {training,...old}=newHero('Old','sky');void training;
  const hero={...old,weapon:'inferno_blade',ownedWeapons:['stick','inferno_blade'],defeatedEnemies:ENEMIES.slice(0,10).map(e=>e.id),claimedBossBonuses:['buldre','klask'],gold:123,reputation:{highestTier:5,seenTier:5,seenBoss:'klask'}};
  const raw=JSON.stringify({version:6,profiles:[{id:'old',hero,seenLevel:1}],lastHeroId:'old',rejectedProfiles:[]});storage.setItem(SAVE_KEY,raw);const first=loadLibrary(storage);expect(first.status).toBe('saved');expect(first.profiles[0].hero).toMatchObject({...hero,training:freshTraining()});expect(storage.getItem('gangriket.save.before-v7')).toBe(raw);expect(loadLibrary(storage)).toEqual(first);expect(awardVictory(first.profiles[0].hero,'klask').reward.bonus).toBe(0);expect(isUnlocked(first.profiles[0].hero,ENEMIES[10].id)).toBe(true);
 });
});
describe('Expanded content integrity',()=>{
 it('buys every tier, equips automatically, keeps series independent and ends honestly',()=>{
  let hero={...newHero('T','sky'),gold:1_000_000};
  for(const kind of ['melee','magic'] as const){for(let i=1;i<20;i++){const id=nextWeapon(hero,kind)!;const before=hero.gold;const purchase=buyWeapon(hero,id)!;expect(purchase).not.toBeNull();hero=purchase.hero;expect(hero.weapon).toBe(id);expect(hero.gold).toBe(before-CATALOG.find(w=>w.id===id)!.price);expect(buyWeapon(hero,id)).toBeNull();hero=equipOwned(hero,'stick');}expect(nextWeapon(hero,kind)).toBeNull();}
  expect(hero.ownedWeapons).toHaveLength(39);
 });
 it('does not overwrite a v6 save if its new backup cannot be written',()=>{
  const storage=memory(),raw=JSON.stringify({version:6,profiles:[{id:'a',hero:newHero('T','sky'),seenLevel:1}],lastHeroId:'a',rejectedProfiles:[]});storage.setItem(SAVE_KEY,raw);
  const broken={getItem:storage.getItem,setItem(k:string,v:string){if(k==='gangriket.save.before-v7')throw Error('quota');storage.setItem(k,v);}};
  expect(loadLibrary(broken).status).toBe('blocked');expect(storage.getItem(SAVE_KEY)).toBe(raw);
 });

 it('contains ten coherent arenas and exactly twenty bosses',()=>{
  expect(ARENAS).toHaveLength(10);expect(ENEMIES).toHaveLength(100);expect(new Set(ENEMIES.map(e=>e.id)).size).toBe(100);
  ENEMIES.forEach((e,i)=>{expect(e.number).toBe(i+1);expect(e.boss).toBe(i%10===4||i%10===9);expect(e.health).toBeGreaterThan(0);expect(e.gold).toBeGreaterThan(0);expect(e.interval).toBe(5000);expect(enemyShapes(e.id).length).toBeGreaterThan(4);});
 });
 it('unlocks all arenas sequentially and first bonuses remain one-time',()=>{
  let hero=newHero('T','sky');for(let i=0;i<100;i++){expect(isUnlocked(hero,ENEMIES[i].id)).toBe(true);if(i<99)expect(isUnlocked(hero,ENEMIES[i+1].id)).toBe(false);const r=awardVictory(hero,ENEMIES[i].id);hero=r.hero;expect(r.reward.completed).toBe(i===99);expect(awardVictory(hero,ENEMIES[i].id).reward.bonus).toBe(0);}expect(hero.claimedBossBonuses).toHaveLength(20);
 });
 it('has twenty strictly improving weapons per style with unique visible geometry',()=>{
  expect(CATALOG).toHaveLength(40);for(const kind of ['melee','magic']){const items=CATALOG.filter(w=>w.kind===kind).sort((a,b)=>a.tier-b.tier);expect(items).toHaveLength(20);expect(new Set(items.map(w=>JSON.stringify(weaponShapes(w.id)))).size).toBe(20);items.forEach((w,i)=>{expect(w.tier).toBe(i);if(i){expect(w.damage).toBeGreaterThan(items[i-1].damage);expect(w.price).toBeGreaterThan(items[i-1].price);}expect(damageFor(newHero('T','sky'),w.id)).toBe(5+w.damage);});}
 });
});
