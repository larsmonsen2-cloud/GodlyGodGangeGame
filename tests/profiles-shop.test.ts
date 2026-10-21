import { afterEach, describe, expect, it, vi } from 'vitest';
import { GameStore } from '../src/store';
import { newHero, grantXp, spendPoint, damageFor } from '../src/progression';
import { BACKUP_KEY, SAVE_KEY, SAVE_VERSION, loadLibrary, saveLibrary, type HeroLibrary } from '../src/storage';
import { buyWeapon, nextWeapon, equipOwned, setGoal } from '../src/shop';
import { WEAPONS, type WeaponId } from '../src/weapons';
const memory=()=>{const map=new Map<string,string>();return {getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}}};
const seeded=()=>{const storage=memory();const a={...newHero('Samme navn','berry','wand'),gold:500};const b=newHero('Samme navn','sky','stick');saveLibrary(storage,{profiles:[{id:'a',hero:a},{id:'b',hero:b}],lastHeroId:'a',rejectedProfiles:[]});return {storage,game:new GameStore(()=>0,storage)};};
afterEach(()=>vi.useRealTimers());
describe('Separate heroes',()=>{
 it('starts at selector, remembers last ID, creates same names with distinct IDs and no inherited progress',()=>{
  const {storage,game}=seeded();expect(game.getSnapshot()).toMatchObject({screen:'heroes',activeHeroId:'a',combat:null});
  game.beginCreation();game.cancelCreation();expect(game.getSnapshot().profiles).toHaveLength(2);
  game.beginCreation();expect(game.createHero('Samme navn','forest','wand')).toBe(true);
  const state=game.getSnapshot();expect(state.profiles).toHaveLength(3);expect(new Set(state.profiles.map(p=>p.id)).size).toBe(3);
  expect(state.hero).toMatchObject({xp:0,gold:0,level:1,ownedWeapons:['wand'],defeatedEnemies:[],claimedBossBonuses:[],savingGoal:null});
  expect(state.hero).toBe(state.profiles[2].hero);
  const reload=new GameStore(()=>0,storage);expect(reload.getSnapshot()).toMatchObject({screen:'heroes',activeHeroId:state.activeHeroId,combat:null});game.dispose();reload.dispose();
 });
 it('isolates XP, stats, gold, weapons, goals and arena across switches and reload',()=>{
  vi.useFakeTimers();const {game,storage}=seeded();game.selectHero('a');const b=structuredClone(game.getSnapshot().profiles[1].hero);
  game.startTraining();for(let i=0;i<5;i++){game.digit('1');game.submit();vi.advanceTimersByTime(1200);}game.leaveTraining();game.spend('magic');
  game.openShop();const context=game.getShopContext();game.chooseGoal('iron_sword',context);game.buy('apprentice_staff',context);game.leaveTraining();
  game.openArena();game.selectEnemy('goran');game.startArena();for(let i=0;i<6;i++){game.digit('1');game.submit();vi.advanceTimersByTime(1200);}game.leaveTraining();
  const a=structuredClone(game.getSnapshot().hero);expect(a).toMatchObject({level:2,magic:7,gold:475,ownedWeapons:['wand','apprentice_staff'],savingGoal:'iron_sword',defeatedEnemies:['goran']});
  game.openHeroes();game.selectHero('b');expect(game.getSnapshot().hero).toEqual(b);game.openShop();game.chooseGoal('apprentice_staff',game.getShopContext());game.leaveTraining();game.openHeroes();game.selectHero('a');expect(game.getSnapshot().hero).toEqual(a);
  const reload=new GameStore(()=>0,storage);expect(reload.getSnapshot().screen).toBe('heroes');reload.selectHero('b');expect(reload.getSnapshot().hero).toEqual({...b,savingGoal:'apprentice_staff'});game.dispose();reload.dispose();
 });
 it('rejects switching in combat and discards delayed question, banner, draft and purchase state on switch',()=>{
  vi.useFakeTimers();const {game}=seeded();game.selectHero('a');game.startTraining();game.digit('1');game.submit();game.leaveTraining();game.openHeroes();game.selectHero('b');const b=structuredClone(game.getSnapshot().hero);vi.advanceTimersByTime(10000);expect(game.getSnapshot()).toMatchObject({hero:b,question:null,levelUp:null,input:''});
  game.openArena();game.selectEnemy('goran');game.startArena();game.openHeroes();expect(game.selectHero('a')).toBe(false);expect(game.getSnapshot().screen).toBe('arena');game.leaveTraining();game.openAppearance();game.editAppearance({...b!.appearance,hairStyle:'bald'});game.leaveTraining();game.openHeroes();game.selectHero('a');expect(game.getSnapshot()).toMatchObject({appearanceDraft:null,purchase:null,combat:null});game.dispose();
 });
 it('rejects stale purchase, equip and goal events across heroes and shop sessions',()=>{
  const {game}=seeded();game.selectHero('a');game.openShop();const old=game.getShopContext();game.leaveTraining();game.openHeroes();game.selectHero('b');game.openShop();const b=game.getSnapshot().hero;
  expect(game.buy('iron_sword',old)).toBe(false);game.chooseGoal('iron_sword',old);game.equip('wand',old);expect(game.getSnapshot().hero).toBe(b);
  game.leaveTraining();game.openHeroes();game.selectHero('a');game.openShop();expect(game.buy('iron_sword',old)).toBe(false);expect(game.buy('iron_sword',game.getShopContext())).toBe(true);game.dispose();
 });
 it('does not buy the newly revealed offer from a double tap',()=>{
  vi.useFakeTimers();const {game}=seeded();game.selectHero('a');game.openShop();const context=game.getShopContext();expect(game.buy('iron_sword',context)).toBe(true);expect(game.buy('great_cleaver',context)).toBe(false);game.finishShoppingCelebration(context);expect(game.buy('great_cleaver',context)).toBe(false);vi.advanceTimersByTime(500);expect(game.buy('iron_sword',context)).toBe(false);expect(game.buy('great_cleaver',context)).toBe(true);expect(game.getSnapshot().hero?.gold).toBe(325);game.dispose();
 });
});
describe('Safe library migration',()=>{
 it('backs up original v4 bytes and migrates once with complete progress and no historic notices',()=>{
  const storage=memory();let hero=grantXp(newHero('Kari','violet','wand'),120);hero=spendPoint(hero,'magic');hero={...hero,gold:200,ownedWeapons:['wand','storm_staff'],weapon:'storm_staff',savingGoal:'cosmic_staff',defeatedEnemies:['goran'],claimedBossBonuses:[]};
  const raw=JSON.stringify({version:4,hero});storage.setItem(SAVE_KEY,raw);storage.setItem('gangriket.sound','true');
  const first=loadLibrary(storage);expect(first.status).toBe('saved');expect(first.profiles).toHaveLength(1);expect(first.profiles[0].hero).toMatchObject({...hero,reputation:{highestTier:2,seenTier:2,seenBoss:'none'}});expect(storage.getItem(BACKUP_KEY)).toBe(raw);expect(storage.getItem('gangriket.sound')).toBe('true');
  const second=loadLibrary(storage);expect(second).toEqual(first);expect(storage.getItem(BACKUP_KEY)).toBe(raw);const game=new GameStore(()=>0,storage);game.selectHero(first.lastHeroId!);expect(game.getSnapshot().reputationNotice).toBeNull();game.dispose();
 });
 it.each(['backup','main'])('does not overwrite old save on %s failure, blocks play until successful retry',fail=>{
  const storage=memory();const raw=JSON.stringify({version:4,hero:newHero('Kari','forest')});storage.setItem(SAVE_KEY,raw);let failing=true;
  const guarded={getItem:storage.getItem,setItem(k:string,v:string){if(failing&&k===(fail==='backup'?BACKUP_KEY:SAVE_KEY))throw Error('quota');storage.setItem(k,v);}};
  const game=new GameStore(()=>0,guarded);expect(game.getSnapshot().screen).toBe('recovery');expect(storage.getItem(SAVE_KEY)).toBe(raw);expect(game.createHero('Knut','sky')).toBe(false);failing=false;game.retryStorage();expect(game.getSnapshot().screen).toBe('heroes');expect(game.getSnapshot().profiles).toHaveLength(1);expect(storage.getItem(BACKUP_KEY)).toBe(raw);game.dispose();
 });
 it('keeps valid profiles when another is corrupt and safely repairs last ID and duplicate IDs',()=>{
  const storage=memory();storage.setItem(SAVE_KEY,JSON.stringify({version:5,profiles:[{id:'a',hero:newHero('Kari','forest')},{id:'bad',hero:{name:'broken'}},{id:'a',hero:newHero('Knut','sky')}],lastHeroId:'missing'}));
  const saved=loadLibrary(storage);expect(saved.status).toBe('saved');expect(saved.profiles).toHaveLength(2);expect(saved.lastHeroId).toBe('a');expect(new Set(saved.profiles.map(p=>p.id)).size).toBe(2);expect(saved.rejectedProfiles).toHaveLength(1);expect(loadLibrary(storage).profiles).toEqual(saved.profiles);
 });
 it.each(['great_cleaver','iron_sword','unknown'] as const)('migrates goal %s without touching gold or skipped purchases',goal=>{
  const storage=memory(),hero={...newHero('Kari','forest'),gold:222,savingGoal:goal};storage.setItem(SAVE_KEY,JSON.stringify({version:4,hero}));const saved=loadLibrary(storage),p=saved.profiles[0];expect(p.hero.gold).toBe(222);expect(p.hero.ownedWeapons).toEqual(['stick']);expect(p.hero.savingGoal).toBe(goal==='iron_sword'?'iron_sword':null);expect(!!p.notice).toBe(goal==='great_cleaver');
  if(p.notice){const game=new GameStore(()=>0,storage);game.selectHero(p.id);game.dismissEquipmentNotice();expect(loadLibrary(storage).profiles[0].notice).toBeUndefined();game.dispose();}
 });
 it('preserves pending v5 milestones rather than marking them seen on reload',()=>{
  const storage=memory(),hero=grantXp(newHero('Kari','forest'),120);const library:HeroLibrary={profiles:[{id:'a',hero}],lastHeroId:'a',rejectedProfiles:[]};saveLibrary(storage,library);const game=new GameStore(()=>0,storage);expect(game.getSnapshot().reputationNotice).toBeNull();game.selectHero('a');expect(game.getSnapshot().reputationNotice).toBeTruthy();game.dispose();
 });
 it('keeps normal updates in memory with a session warning when writing fails',()=>{
  const {storage}=seeded();const game=new GameStore(()=>0,{getItem:storage.getItem,setItem(){throw Error('quota');}});game.selectHero('a');game.openShop();expect(game.buy('iron_sword',game.getShopContext())).toBe(true);expect(game.getSnapshot()).toMatchObject({storageStatus:'session',hero:{gold:450}});expect(loadLibrary(storage).profiles[0].hero.gold).toBe(500);game.dispose();
 });
});
describe('Next weapon per series',()=>{
 it('offers first paid weapons without granting the other starter',()=>{
  const hero=newHero('Kari','forest');expect(nextWeapon(hero,'melee')).toBe('iron_sword');expect(nextWeapon(hero,'magic')).toBe('apprentice_staff');expect(setGoal(hero,'storm_staff')).toBe(hero);expect(buyWeapon({...hero,gold:999},'wand')).toBeNull();
 });
 it('advances each series independently and never goes backwards on equipment changes',()=>{
  const hero={...newHero('Kari','forest'),gold:999};const bought=buyWeapon(hero,'iron_sword')!.hero;expect(nextWeapon(bought,'melee')).toBe('great_cleaver');expect(nextWeapon(bought,'magic')).toBe('apprentice_staff');expect(nextWeapon(equipOwned(bought,'stick'),'melee')).toBe('great_cleaver');expect(buyWeapon(bought,'inferno_blade')).toBeNull();
 });
 it('retains skipped legacy purchases and uses highest owned rank until completion',()=>{
  const hero={...newHero('Kari','forest'),gold:999,ownedWeapons:['stick','great_cleaver'] as WeaponId[]};expect(nextWeapon(hero,'melee')).toBe('inferno_blade');expect(buyWeapon(hero,'iron_sword')).toBeNull();const bought=buyWeapon(hero,'inferno_blade')!.hero;expect(bought.ownedWeapons).not.toContain('iron_sword');expect(nextWeapon(bought,'melee')).toBeNull();expect(nextWeapon({...bought,ownedWeapons:[...bought.ownedWeapons,'cosmic_staff']},'magic')).toBeNull();
 });
 it('rejects missing gold, owned or unknown offers and computes actual cross-stat damage',()=>{
  const hero={...newHero('Kari','forest','wand'),magic:45,gold:49};expect(buyWeapon(hero,'iron_sword')).toBeNull();expect(buyWeapon({...hero,gold:999},'missing' as WeaponId)).toBeNull();const bought=buyWeapon({...hero,gold:50},'iron_sword')!;expect(bought.purchase.newDamage).toBe(damageFor(hero,'iron_sword'));expect(bought.purchase.newDamage).toBeLessThan(bought.purchase.previousDamage);expect(buyWeapon(bought.hero,'iron_sword')).toBeNull();expect(WEAPONS.iron_sword.price).toBe(50);
 });
});
