import { describe, expect, it, vi, afterEach } from 'vitest';
import { newHero, damageFor, grantXp, spendPoint } from '../src/progression';
import { buyWeapon, equipOwned, setGoal } from '../src/shop';
import { GameStore } from '../src/store';
import { loadHero, saveHero, SAVE_KEY, SAVE_VERSION, validHero } from '../src/storage';
import { WEAPONS, type WeaponId } from '../src/weapons';
const memory = () => { const data = new Map<string,string>(); return { getItem:(k:string)=>data.get(k)??null, setItem:(k:string,v:string)=>{data.set(k,v);} }; };
const funded = (gold=50) => ({...newHero('Sol','sky','wand'),gold});
afterEach(()=>vi.useRealTimers());
describe('Shop rules and persistence',()=>{
 it('owns only the selected starter and never buys the other starter',()=>{
  expect(funded().ownedWeapons).toEqual(['wand']);
  expect(buyWeapon(funded(),'stick')).toBeNull();
  expect(equipOwned(funded(),'stick').weapon).toBe('wand');
 });
 it('charges exact price, equips, retains old weapon and clears purchased goal',()=>{
  const before=setGoal(funded(),'iron_sword');
  const result=buyWeapon(before,'iron_sword')!;
  expect(result.hero).toMatchObject({gold:0,weapon:'iron_sword',ownedWeapons:['wand','iron_sword'],savingGoal:null});
  expect(result.purchase).toMatchObject({previousDamage:8,newDamage:12});
  expect(before.gold).toBe(50);
  expect(buyWeapon(result.hero,'iron_sword')).toBeNull();
 });
 it('rejects insufficient funds and invalid ids without mutations',()=>{
  const hero=funded(49),copy=structuredClone(hero);
  expect(buyWeapon(hero,'iron_sword')).toBeNull();
  expect(buyWeapon(hero,'bogus' as WeaponId)).toBeNull();
  expect(hero).toEqual(copy);
 });
 it('uses the correct attribute including a negative damage change',()=>{
  let hero=grantXp(funded(500),1000);
  while(hero.points) hero=spendPoint(hero,'magic');
  const bought=buyWeapon(hero,'iron_sword')!;
  expect(bought.purchase.newDamage).toBeLessThan(bought.purchase.previousDamage);
  expect(damageFor(bought.hero)).toBe(hero.strength+7);
  const restored=equipOwned(bought.hero,'wand');
  expect(damageFor(restored)).toBe(hero.magic+3);
  expect(restored.gold).toBe(450);
 });
 it('stores one goal, replaces or removes it and preserves unrelated goals on purchase',()=>{
  let hero=setGoal(funded(500),'apprentice_staff');
  hero=setGoal(hero,'iron_sword');
  expect(hero.savingGoal).toBe('iron_sword');
  hero=buyWeapon(hero,'apprentice_staff')!.hero;
  expect(hero.savingGoal).toBe('iron_sword');
  expect(setGoal(hero,'apprentice_staff')).toBe(hero);
  expect(setGoal(hero,'stick')).toBe(hero);
  expect(setGoal(hero,null).savingGoal).toBeNull();
 });
 it('guards double clicks at store level and restores all equipment after reload',()=>{
  const storage=memory();saveHero(storage,funded(125));
  const game=selectLast(new GameStore(()=>0,storage));game.openShop();game.chooseGoal('apprentice_staff',game.getShopContext());
  expect(game.buy('iron_sword',game.getShopContext())).toBe(true);expect(game.buy('apprentice_staff',game.getShopContext())).toBe(false);
  game.finishShoppingCelebration(game.getShopContext());expect(game.buy('iron_sword',game.getShopContext())).toBe(false);
  game.equip('wand',game.getShopContext());
  const reload=selectLast(new GameStore(()=>0,storage));
  expect(reload.getSnapshot().hero).toMatchObject({gold:75,weapon:'wand',ownedWeapons:['wand','iron_sword'],savingGoal:'apprentice_staff'});
  expect(reload.getSnapshot().purchase).toBeNull();
  game.dispose();reload.dispose();
 });
 it('uses purchased weapons in training and arena and blocks shopping during combat',()=>{
  vi.useFakeTimers();const storage=memory();saveHero(storage,funded());
  const game=selectLast(new GameStore(()=>0,storage));game.openShop();game.buy('iron_sword',game.getShopContext());
  const attack=vi.fn();game.onAttack(attack);game.startTraining();game.digit('1');game.submit();
  expect(attack).toHaveBeenCalledWith(expect.objectContaining({damage:12,kind:'melee'}));
  expect(game.getSnapshot().hero?.gold).toBe(0);
  game.leaveTraining();game.openArena(); game.selectEnemy('goran');game.startArena();game.openShop();game.equip('wand',game.getShopContext());
  expect(game.getSnapshot().screen).toBe('arena');game.digit('1');game.submit();
  expect(game.getSnapshot().combat?.enemyHp).toBe(68);expect(game.getSnapshot().hero?.weapon).toBe('iron_sword');game.dispose();
 });
 it.each(['stick','wand'] as const)('migrates v1 %s preserving progress and only selected starter',weapon=>{
  const storage=memory();const hero={...spendPoint(grantXp(newHero('Sol','sky',weapon),50),'magic'),gold:75};
  const {ownedWeapons,savingGoal,...legacy}=hero;
  storage.setItem(SAVE_KEY,JSON.stringify({version:1,hero:legacy}));
  storage.setItem('gangriket.sound','true');
  expect(loadHero(storage).hero).toEqual(hero);
  expect(JSON.parse(storage.getItem(SAVE_KEY)!).version).toBe(SAVE_VERSION);
  expect(storage.getItem('gangriket.sound')).toBe('true');
 });
 it('repairs unknown equipment without discarding progression or valid purchases',()=>{
  const storage=memory();storage.setItem(SAVE_KEY,JSON.stringify({version:2,hero:{...funded(99),weapon:'unknown',ownedWeapons:['wand','unknown','iron_sword','wand'],savingGoal:'unknown'}}));
  const result=loadHero(storage);
  expect(result.notice).toBeTruthy();expect(result.hero).toMatchObject({gold:99,weapon:'wand',ownedWeapons:['wand','iron_sword'],savingGoal:null});
  expect(validHero(result.hero)).toBe(true);
 });
 it('keeps an atomic purchase in session when writing storage fails',()=>{
  const storage=memory();saveHero(storage,funded());
  const game=selectLast(new GameStore(()=>0,{getItem:storage.getItem,setItem(){throw Error('quota');}}));
  game.openShop();game.buy('iron_sword',game.getShopContext());
  expect(game.getSnapshot()).toMatchObject({storageStatus:'session',hero:{gold:0,weapon:'iron_sword',ownedWeapons:['wand','iron_sword']}});game.dispose();
 });
 it('has six paid weapons with stable prices and damage tiers',()=>{
  expect(Object.values(WEAPONS).filter(w=>w.tier>0&&w.tier<=3).map(w=>[w.price,w.damage])).toEqual([[50,7],[125,13],[250,22],[50,7],[125,13],[250,22]]);
 });
});

// Existing gameplay tests explicitly choose the last profile after the new startup selector.
function selectLast(g:GameStore){if(g.getSnapshot().screen==='heroes')g.selectHero(g.getSnapshot().activeHeroId!);return g;}
