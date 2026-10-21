import {weaponShapes,type WeaponShape} from './weaponVisuals';
import type {WeaponId} from './progression';

export function shapePoints(shapes:WeaponShape[]):number[][] {
 return shapes.flatMap(s=>s.type==='polygon'?s.points:s.type==='ellipse'
  ?[[s.x-s.width/2,s.y-s.height/2],[s.x+s.width/2,s.y+s.height/2]]
  :[[s.x,s.y],[s.x+s.width,s.y+s.height]]);
}
// Include the whole weapon sweep, not only its resting pose. Camera framing is
// independent of gameplay, and stays fixed throughout each answer animation.
export function battleFrame(weapon:WeaponId,enemy:WeaponShape[]|null,dummyHeight=240,boss=false,heroHeight=212){
 const heroScale=1.2;
 const enemyPoints=enemy?shapePoints(enemy):[];
 const enemyHeight=enemy?Math.max(...enemyPoints.map(p=>p[1]))-Math.min(...enemyPoints.map(p=>p[1])):1;
 const enemyWidth=enemy?Math.max(...enemyPoints.map(p=>p[0]))-Math.min(...enemyPoints.map(p=>p[0])):1;
 const targetScale=enemy?Math.min((boss?300:235)/enemyHeight,(boss?275:240)/enemyWidth):1.18;
 const points:number[][]=[[65,350],[245,350],[155,350-heroScale*heroHeight]];
 for(let angle=-40;angle<=100;angle+=5){
  const r=angle*Math.PI/180;
  for(const [x,y] of shapePoints(weaponShapes(weapon))){
   for(const rootX of [155,340]) points.push([rootX+heroScale*(38+x*Math.cos(r)-y*Math.sin(r)),350+heroScale*(-84+x*Math.sin(r)+y*Math.cos(r))]);
  }
 }
 const target=enemy?shapePoints(enemy):[[-113,-dummyHeight],[113,0]];
 for(const [x,y] of target)points.push([535+x*targetScale,350+y*targetScale]);
 const left=Math.min(...points.map(p=>p[0]))-16,right=Math.max(...points.map(p=>p[0]))+16;
 const top=Math.min(...points.map(p=>p[1]))-20,bottom=370;
 return {left,top,width:right-left,height:bottom-top,heroScale,targetScale};
}
