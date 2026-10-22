import {describe,it,expect} from 'vitest';
import {ENEMIES} from '../src/enemies';
import {simulateJourney} from '../src/paceBalance';

describe('Enemy personality and sustained progression',()=>{
 it('gives every enemy an individual title and description',()=>{
  expect(new Set(ENEMIES.map(e=>e.subtitle)).size).toBe(100);
  expect(new Set(ENEMIES.map(e=>e.description)).size).toBe(100);
  for(const e of ENEMIES){expect(e.subtitle).not.toMatch(/selvutnevnte vokteren|høyst ærede herskeren/);expect(e.description.length).toBeGreaterThan(25);}
 });
 it('never resets difficulty after the first arena or a later boss',()=>{
  for(let i=10;i<ENEMIES.length;i++){
   expect(ENEMIES[i].health).toBeGreaterThan(ENEMIES[i-1].health);
   expect(ENEMIES[i].damage).toBeGreaterThanOrEqual(ENEMIES[i-1].damage);
  }
  expect(ENEMIES[0]).toMatchObject({id:'goran',health:80,damage:6,gold:25,interval:5000});
 });
 it.each([2,3,5,8])('requires training throughout a complete journey at %s seconds per answer, even with purchases',seconds=>{
  const result=simulateJourney(seconds);
  expect(result.rows).toHaveLength(100);
  expect(result.hero.defeatedEnemies).toHaveLength(100);
  expect(result.trainingStops).toBeGreaterThanOrEqual(40);
  expect(result.longestRun).toBeLessThanOrEqual(6);
  expect(result.purchases).toBeGreaterThanOrEqual(18);
  for(let i=0;i<10;i++)expect(result.rows.slice(i*10,i*10+10).filter(r=>r.trainingAnswers>0).length).toBeGreaterThanOrEqual(2);
  expect(result.rows.every(r=>r.remainingHealth>0)).toBe(true);
  expect(result.trainingAnswers).toBeLessThan(20_000);
 });
 it('gives melee and magic the same progression opportunities',()=>{
  const melee=simulateJourney(5),magic=simulateJourney(5,'magic');
  expect(magic.trainingAnswers).toBe(melee.trainingAnswers);
  expect(magic.trainingStops).toBe(melee.trainingStops);
  expect(magic.hero.level).toBe(melee.hero.level);
 });
 it.each([1,4])('remains reachable with %s health points per attack point',ratio=>{
  const result=simulateJourney(5,'melee',ratio);
  expect(result.rows).toHaveLength(100);
  expect(result.rows.every(r=>r.remainingHealth>0)).toBe(true);
  expect(result.trainingStops).toBeGreaterThan(30);
 });
});
