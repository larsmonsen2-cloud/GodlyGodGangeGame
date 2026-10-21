import {afterEach,describe,expect,it,vi} from 'vitest';
import {GameStore,type Attack} from '../src/store';
import {newHero,damageFor,type Hero} from '../src/progression';
import {loadLibrary,saveLibrary,SAVE_KEY} from '../src/storage';
import {emblemTier,LevelEmblem} from '../src/LevelEmblem';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {CONFIG} from '../src/config';
const memory=()=>{const data=new Map<string,string>();return{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};};
function setup(hero:Hero=newHero('Sol','sky'),seenLevel=hero.level){vi.useFakeTimers();const storage=memory();saveLibrary(storage,{profiles:[{id:'a',hero,seenLevel},{id:'b',hero:newHero('Måne','berry'),seenLevel:1}],lastHeroId:'a',rejectedProfiles:[]});const game=new GameStore(()=>0,storage);game.selectHero('a');return{game,storage};}
const answer=(game:GameStore,correct=true)=>{game.digit(correct?'1':'2');game.submit();};
const correct=(game:GameStore,n=1)=>{for(let i=0;i<n;i++){answer(game);vi.advanceTimersByTime(CONFIG.timing.correct);}};
afterEach(()=>vi.useRealTimers());
describe('Consecutive correct answers',()=>{
 it.each(['stick','wand','inferno_blade','cosmic_staff'] as const)('uses the active %s and correct stat once, gives normal XP and resets after five',weapon=>{
  const hero={...newHero('Sol','sky'),level:5,points:1,strength:7,magic:9,weapon,ownedWeapons:[weapon]};const {game,storage}=setup(hero);const attacks:Attack[]=[];game.onAttack(e=>attacks.push(e));game.startTraining();
  correct(game,4);expect(game.getSnapshot().streak).toBe(4);answer(game);for(let i=0;i<8;i++)game.submit();
  expect(attacks.map(e=>e.damage)).toEqual([1,1,1,1,2].map(n=>n*damageFor(hero)));expect(attacks.map(e=>e.special)).toEqual([false,false,false,false,true]);expect(attacks[4]).toMatchObject({heroId:'a',sessionId:game.getSnapshot().sessionId,questionId:game.getSnapshot().question?.id});
  expect(game.getSnapshot()).toMatchObject({streak:0,specialFlash:true,hero:{xp:50,gold:0}});expect(storage.getItem(SAVE_KEY)).not.toContain('streak');vi.advanceTimersByTime(1200);expect(game.getSnapshot().specialFlash).toBe(false);correct(game);expect(game.getSnapshot().streak).toBe(1);game.dispose();
 });
 it('immediately breaks on first error, resumes at one on correction, and gives no charge on reveal/Next',()=>{
  const {game}=setup();game.startTraining();correct(game,4);answer(game,false);expect(game.getSnapshot()).toMatchObject({streak:0,brokenFrom:4,feedback:'first-error'});vi.advanceTimersByTime(350);expect(game.getSnapshot().brokenFrom).toBe(0);correct(game);expect(game.getSnapshot().streak).toBe(1);answer(game,false);vi.advanceTimersByTime(350);answer(game,false);expect(game.getSnapshot()).toMatchObject({streak:0,brokenFrom:0});vi.advanceTimersByTime(350);expect(game.getSnapshot().feedback).toBe('reveal');game.next();expect(game.getSnapshot().streak).toBe(0);game.dispose();
 });
 it('ignores empty submission and editing and has no time requirement',()=>{
  const {game}=setup();game.startTraining();correct(game,4);game.submit();game.digit('3');game.backspace();vi.advanceTimersByTime(600000);expect(game.getSnapshot().streak).toBe(4);answer(game);expect(game.getSnapshot().specialFlash).toBe(true);game.dispose();
 });
 it('keeps the streak through level graphics and pause, but resets at session and hero boundaries',()=>{
  const {game,storage}=setup({...newHero('Sol','sky'),xp:40});game.startTraining();correct(game,2);expect(game.getSnapshot()).toMatchObject({streak:2,hero:{level:2}});game.leaveTraining();expect(game.getSnapshot().streak).toBe(0);game.openArena();game.selectEnemy('goran');game.startArena();correct(game,2);game.pauseArena();vi.advanceTimersByTime(60000);expect(game.getSnapshot().streak).toBe(2);game.resumeArena();expect(game.getSnapshot().streak).toBe(2);
  game.leaveTraining();game.startTraining();correct(game,4);answer(game);game.leaveTraining();game.openHeroes();game.selectHero('b');game.startTraining();const current=game.getSnapshot().question;vi.advanceTimersByTime(10000);expect(game.getSnapshot()).toMatchObject({streak:0,specialFlash:false,hero:{name:'Måne',xp:0},question:current});
  const reload=new GameStore(()=>0,storage);expect(reload.getSnapshot()).toMatchObject({screen:'heroes',streak:0,specialFlash:false,question:null});game.dispose();reload.dispose();
 });
 it('kills with one special hit, awards once and starts rematch empty',()=>{
  const {game}=setup({...newHero('Sol','sky'),level:4,points:1,strength:9,weapon:'iron_sword',ownedWeapons:['stick','iron_sword']});game.openArena();game.selectEnemy('goran');game.startArena();const attacks:Attack[]=[];game.onAttack(e=>attacks.push(e));correct(game,4);expect(game.getSnapshot().combat?.enemyHp).toBe(16);answer(game);game.submit();expect(game.getSnapshot()).toMatchObject({streak:0,specialFlash:true,combat:{outcome:'won',enemyHp:0,resultReady:false},hero:{gold:25,xp:0}});expect(attacks).toHaveLength(5);expect(attacks[4].damage).toBe(32);vi.advanceTimersByTime(1199);expect(game.getSnapshot().combat?.resultReady).toBe(false);vi.advanceTimersByTime(1);game.startArena();expect(game.getSnapshot()).toMatchObject({streak:0,specialFlash:false,combat:{enemyHp:80},hero:{gold:25}});game.dispose();
 });
});
describe('Level emblem and once-only celebration',()=>{
 it.each([[1,0],[4,0],[5,1],[9,1],[10,2],[19,2],[20,3],[39,3],[40,4],[999,4]])('level %s uses tier %s',(level,tier)=>expect(emblemTier(level)).toBe(tier));
 it('renders the entire level including many digits without truncation',()=>{for(const level of [1,99,100,999999,123456789012]){const html=renderToStaticMarkup(createElement(LevelEmblem,{level}));expect(html).toContain(`<strong>${level}</strong>`);expect(html).toContain(`Nivå ${level}`);}});
 it('celebrates only the last unseen level on returning, independently per hero and across reload',()=>{
  const {game,storage}=setup();game.startTraining();correct(game,12);expect(game.getSnapshot().hero?.level).toBe(3);expect(game.getSnapshot().levelCelebration).toBeNull();game.leaveTraining();expect(game.getSnapshot().levelCelebration).toBe(3);expect(loadLibrary(storage).profiles[0].seenLevel).toBe(3);game.spend('magic');expect(game.getSnapshot().levelCelebration).toBe(3);game.openShop();game.leaveTraining();expect(game.getSnapshot().levelCelebration).toBeNull();game.openHeroes();game.selectHero('b');expect(game.getSnapshot().levelCelebration).toBeNull();game.startTraining();correct(game,5);game.leaveTraining();expect(game.getSnapshot().levelCelebration).toBe(2);game.openHeroes();game.selectHero('a');expect(game.getSnapshot().levelCelebration).toBeNull();const reload=new GameStore(()=>0,storage);reload.selectHero('b');expect(reload.getSnapshot().levelCelebration).toBeNull();game.dispose();reload.dispose();
 });
 it('preserves a pending level celebration in v6 after reload during training',()=>{
  const {game,storage}=setup();game.startTraining();correct(game,5);const reload=new GameStore(()=>0,storage);expect(reload.getSnapshot().levelCelebration).toBeNull();reload.selectHero('a');expect(reload.getSnapshot().levelCelebration).toBe(2);game.dispose();reload.dispose();
 });
 it('migrates v5 per-hero seen levels without losing progress or replaying past celebrations',()=>{
  const storage=memory();const hero={...newHero('Sol','violet'),level:40,points:39,reputation:{highestTier:5,seenTier:5,seenBoss:'none' as const},gold:333,weapon:'cosmic_staff' as const,ownedWeapons:['wand','cosmic_staff'] as const};storage.setItem(SAVE_KEY,JSON.stringify({version:5,profiles:[{id:'stable',hero}],lastHeroId:'stable',rejectedProfiles:[]}));const game=new GameStore(()=>0,storage);game.selectHero('stable');expect(game.getSnapshot().hero).toMatchObject(hero);expect(game.getSnapshot().levelCelebration).toBeNull();expect(loadLibrary(storage).profiles[0]).toMatchObject({id:'stable',seenLevel:40});game.dispose();
 });
 it('boss/arena prestige alone never changes emblem tier',()=>{const hero=newHero('Sol','sky');expect(emblemTier({...hero,defeatedEnemies:['buldre']}.level)).toBe(0);});
});
