import {describe,it,expect,vi} from 'vitest';
import {balanceMarkdown,estimateFight,BALANCE_HEROES} from '../src/balance';
import {ENEMIES} from '../src/enemies';
import {GameStore} from '../src/store';
import {newHero,type Hero} from '../src/progression';
import {saveHero} from '../src/storage';
import {WEAPONS,type WeaponId} from '../src/weapons';
describe('Balance estimates match actual combat timing',()=>{
 it('matches all 120 combinations of hero, enemy and active answer interval',()=>{
  vi.useFakeTimers();
  try { for(const [i,profile] of BALANCE_HEROES.entries()) for(const enemy of ENEMIES) for(const seconds of [2,5,8]) {
   const weapon=(['stick','iron_sword','great_cleaver','inferno_blade'] as WeaponId[])[i];
   const strength=profile.damage-WEAPONS[weapon].damage;
   const hero:Hero={...newHero('Balance','forest'),strength,maxHealth:profile.health,level:1+(strength-5)/2+(profile.health-40)/10,weapon,ownedWeapons:weapon==='stick'?['stick']:['stick',weapon],defeatedEnemies:ENEMIES.slice(0,enemy.number-1).map(e=>e.id)};
   let raw:string|null=null;const storage={getItem:()=>raw,setItem:(_k:string,v:string)=>{raw=v;}};saveHero(storage,hero);
   const game=selectLast(new GameStore(()=>0,storage));game.openArena();game.selectEnemy(enemy.id);game.startArena();
   let answers=0;while(game.getSnapshot().combat?.outcome==='active'&&answers<100){vi.advanceTimersByTime(seconds*1000);game.digit('1');game.submit();answers++;vi.advanceTimersByTime(1200);}
   const estimated=estimateFight(enemy,profile.damage,profile.health,seconds);
   expect(game.getSnapshot().combat?.outcome,`${profile.name}/${enemy.id}/${seconds}`).toBe(estimated.won?'won':'lost');
   if(estimated.won){expect(answers).toBe(estimated.answers);expect(game.getSnapshot().combat?.hp).toBe(profile.health-estimated.incoming*enemy.damage);}
   game.dispose();
  }} finally {vi.useRealTimers();}
 });
 it('generates the reproducible balance report',()=>{const report=balanceMarkdown();expect(report).toContain('Kong Klask');expect(report).toContain("Starthelt");});
});

// Existing gameplay tests explicitly choose the last profile after the new startup selector.
function selectLast(g:GameStore){if(g.getSnapshot().screen==='heroes')g.selectHero(g.getSnapshot().activeHeroId!);return g;}
