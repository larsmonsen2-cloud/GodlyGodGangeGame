import { normalizeReputation } from '../src/reputation';
import { describe,it,expect,vi,afterEach } from 'vitest';
import { ENEMIES,isUnlocked,enemyById,type EnemyId } from '../src/enemies';
import { GameStore } from '../src/store';
import { newHero, type Hero } from '../src/progression';
import { loadHero,saveHero,SAVE_KEY,SAVE_VERSION,validHero } from '../src/storage';
const memory=()=>{const m=new Map<string,string>();return{getItem:(k:string)=>m.get(k)??null,setItem:(k:string,v:string)=>{m.set(k,v);}}};
const strong=():Hero=>({...newHero('Test','sky'),level:101,strength:205,points:0});
function setup(hero=newHero('Test','forest')) {vi.useFakeTimers();const storage=memory();saveHero(storage,hero);const game=new GameStore(()=>0,storage);game.openArena();return{game,storage};}
function answer(game:GameStore){game.digit('1');game.submit();vi.advanceTimersByTime(1200);}
function win(game:GameStore){for(let i=0;i<100&&game.getSnapshot().combat?.outcome==='active';i++)answer(game);}
afterEach(()=>vi.useRealTimers());
describe('Ten encounter progression',()=>{
 it('opens only fight one and requires selection then explicit Start',()=>{
  const {game}=setup();expect(game.getSnapshot().screen).toBe('arena-select');game.startArena();expect(game.getSnapshot().combat).toBeNull();
  expect(ENEMIES.filter(e=>isUnlocked(game.getSnapshot().hero!,e.id)).map(e=>e.id)).toEqual(['goran']);
  expect(game.selectEnemy('klask')).toBe(false);expect(game.selectEnemy('unknown' as EnemyId)).toBe(false);
  expect(game.selectEnemy('goran')).toBe(true);vi.advanceTimersByTime(60000);expect(game.getSnapshot().combat).toBeNull();game.startArena();expect(game.getSnapshot().combat?.enemyId).toBe('goran');game.dispose();
 });
 it('unlocks exactly the next fight with atomic gold and progress, never twice',()=>{
  const {game,storage}=setup(strong());game.selectEnemy('goran');game.startArena();game.digit('1');game.submit();game.submit();
  expect(game.getSnapshot().hero).toMatchObject({gold:25,defeatedEnemies:['goran'],xp:0});
  expect(game.getSnapshot().combat).toMatchObject({resultReady:false,reward:{regular:25,bonus:0,unlocked:'birger'}});
  expect(loadHero(storage).hero).toEqual(game.getSnapshot().hero);vi.advanceTimersByTime(1200);game.submit();
  expect(ENEMIES.filter(e=>isUnlocked(game.getSnapshot().hero!,e.id))).toHaveLength(2);
  game.selectEnemy('birger');expect(game.getSnapshot().screen).toBe('arena-intro');expect(game.getSnapshot().combat).toBeNull();game.dispose();
 });
 it('uses selected enemy values and defeat preserves all progress',()=>{
  const hero={...newHero('Test','sky'),defeatedEnemies:['goran'] as EnemyId[],gold:25};const {game}=setup(hero);game.selectEnemy('birger');game.startArena();
  expect(game.getSnapshot().combat?.enemyHp).toBe(110);vi.advanceTimersByTime(5000);expect(game.getSnapshot().combat?.hp).toBe(33);
  vi.advanceTimersByTime(30000);expect(game.getSnapshot().combat?.outcome).toBe('lost');expect(game.getSnapshot().hero).toEqual({...hero,reputation:normalizeReputation(hero,true)});game.openArena();expect(game.selectEnemy('birger')).toBe(true);game.dispose();
 });
 it('pays boss bonus once across duplicate input, replay and reload',()=>{
  const hero={...strong(),defeatedEnemies:ENEMIES.slice(0,4).map(e=>e.id)};const {game,storage}=setup(hero);game.selectEnemy('buldre');game.startArena();win(game);
  expect(game.getSnapshot().hero).toMatchObject({gold:145,claimedBossBonuses:['buldre']});expect(game.getSnapshot().combat?.reward).toMatchObject({regular:95,bonus:50,unlocked:'snerk'});
  game.submit();game.startArena();game.startArena();win(game);expect(game.getSnapshot().hero?.gold).toBe(240);expect(game.getSnapshot().combat?.reward?.bonus).toBe(0);game.dispose();
  const reload=new GameStore(()=>0,storage);expect(reload.getSnapshot().combat).toBeNull();reload.openArena();reload.selectEnemy('buldre');reload.startArena();win(reload);expect(reload.getSnapshot().hero?.gold).toBe(335);reload.dispose();
 });
 it('finishes all ten with no nonexistent next fight and retains replay rewards',()=>{
  const {game}=setup(strong());for(const enemy of ENEMIES){expect(game.selectEnemy(enemy.id)).toBe(true);game.startArena();win(game);expect(game.getSnapshot().combat?.enemyId).toBe(enemy.id);game.openArena();}
  expect(game.getSnapshot().hero?.defeatedEnemies).toHaveLength(10);game.selectEnemy('klask');game.startArena();win(game);
  expect(game.getSnapshot().combat?.reward).toEqual({regular:230,bonus:0,unlocked:null,completed:true});game.openArena();expect(game.selectEnemy('goran')).toBe(true);game.dispose();
 });
 it('cancels old feedback and enemy clocks and uses newly equipped weapon on next encounter',()=>{
  const {game}=setup({...strong(),gold:50});game.selectEnemy('goran');game.startArena();const old=game.getSnapshot().combat!.id;game.digit('1');game.submit();
  game.leaveTraining();game.openShop();game.buy('iron_sword');game.leaveTraining();game.openArena();game.selectEnemy('birger');game.startArena();
  expect(game.getSnapshot().combat!.id).not.toBe(old);vi.advanceTimersByTime(1200);expect(game.getSnapshot().combat).toMatchObject({enemyHp:110,resultReady:false,hp:40});vi.advanceTimersByTime(3800);expect(game.getSnapshot().combat?.hp).toBe(33);answer(game);expect(game.getSnapshot().combat?.outcome).toBe('won');game.dispose();
 });
 it.each([1,2])('migrates version %s without inferring victories from gold or level',version=>{
  const storage=memory();const hero={...strong(),gold:999};storage.setItem(SAVE_KEY,JSON.stringify({version,hero}));const loaded=loadHero(storage);expect(loaded.hero).toEqual({...hero,reputation:normalizeReputation(hero,true)});expect(loaded.hero?.defeatedEnemies).toEqual([]);expect(JSON.parse(storage.getItem(SAVE_KEY)!).version).toBe(SAVE_VERSION);
 });
 it('repairs unknown ids while preserving known wins, purchases and paid bonus',()=>{
  const storage=memory();const hero={...strong(),gold:77,weapon:'iron_sword',ownedWeapons:['stick','iron_sword'],defeatedEnemies:['goran','unknown','birger'],claimedBossBonuses:['buldre','unknown']};storage.setItem(SAVE_KEY,JSON.stringify({version:3,hero}));const loaded=loadHero(storage);expect(loaded.notice).toBeTruthy();expect(loaded.hero).toMatchObject({gold:77,weapon:'iron_sword',defeatedEnemies:['goran','birger'],claimedBossBonuses:['buldre']});expect(validHero(loaded.hero)).toBe(true);
 });
 it('persists reward before result so reload grants nothing extra',()=>{
  const {game,storage}=setup(strong());game.selectEnemy('goran');game.startArena();game.digit('1');game.submit();const reload=new GameStore(()=>0,storage);expect(reload.getSnapshot()).toMatchObject({screen:'hero',combat:null,hero:{gold:25,defeatedEnemies:['goran']}});game.dispose();reload.dispose();
 });
 it('keeps enemy values fixed and every interval at five seconds',()=>{expect(ENEMIES).toHaveLength(10);expect(ENEMIES.filter(e=>e.boss).map(e=>e.number)).toEqual([5,10]);expect(ENEMIES.every(e=>e.interval===5000)).toBe(true);expect(enemyById('goran')).toMatchObject({health:80,damage:6,gold:25});});
});
