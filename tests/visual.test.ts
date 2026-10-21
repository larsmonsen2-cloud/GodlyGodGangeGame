import {describe,it,expect} from 'vitest';
import {battleFrame,shapePoints} from '../src/sceneLayout';
import {WEAPONS} from '../src/weapons';
import {ENEMIES} from '../src/enemies';
import {enemyShapes} from '../src/enemyVisuals';
import {dummyBonus,freshTraining,trainHit,TRAINING,dummyFor} from '../src/training';

describe('visual framing and truthful reward',()=>{
 it('keeps every opponent silhouette inside the camera at every weapon tier',()=>{
  for(const enemy of ENEMIES)for(const weapon of Object.values(WEAPONS)){
   const shapes=enemyShapes(enemy.id),f=battleFrame(weapon.id,shapes,240,enemy.boss);
   expect(f.width).toBeGreaterThan(0);expect(f.height).toBeGreaterThan(0);
   for(const [x,y] of shapePoints(shapes)){
    expect(535+x*f.targetScale).toBeGreaterThanOrEqual(f.left);
    expect(535+x*f.targetScale).toBeLessThanOrEqual(f.left+f.width);
    expect(350+y*f.targetScale).toBeGreaterThanOrEqual(f.top);
    expect(350+y*f.targetScale).toBeLessThanOrEqual(f.top+f.height);
   }
  }
 });
 it('shows precisely the bonus awarded for every normal and exam dummy',()=>{
  for(let rank=0;rank<TRAINING.length;rank++)for(const position of [0,9]){
   const t={...freshTraining(),rank,position,hp:1};
   expect(trainHit(t,1).bonus).toBe(dummyBonus(t));
   expect(dummyBonus(t)).toBe(dummyFor(t).maxHp/8);
  }
 });
});
