import manifest from '../public/assets/hero-pack-v1/manifest.json';
export {manifest};
export type PackSelection={hair:'short'|'braid';outfit:'tunic'|'dress';weapon:'sword'|'staff'};
export const DEFAULT_PACK:PackSelection={hair:'short',outfit:'tunic',weapon:'sword'};
export const PACK_ROOT='/assets/hero-pack-v1/';
export const PACK_UNIT=.39;
export const PACK_ANCHOR={x:270,y:560};
export const PACK_HEIGHT=230;
export function validPack(value:unknown):value is PackSelection{
 const s=value as PackSelection;
 return !!s&&Object.hasOwn(manifest.choices.hair,s.hair)&&Object.hasOwn(manifest.choices.outfit,s.outfit)&&Object.hasOwn(manifest.choices.weapon,s.weapon);
}
export function packLayers(selection:PackSelection){
 if(!validPack(selection))throw Error('Ukjent bildevalg');
 const keys=[manifest.choices.outfit[selection.outfit],'head',manifest.choices.hair[selection.hair],manifest.choices.weapon[selection.weapon]] as (keyof typeof manifest.assets)[];
 return keys.map(key=>({key,...manifest.assets[key]}));
}
export const packKey=(s:PackSelection)=>`${s.hair}-${s.outfit}-${s.weapon}`;
export const ALL_PACKS:PackSelection[]=(['short','braid'] as const).flatMap(hair=>(['tunic','dress'] as const).flatMap(outfit=>(['sword','staff'] as const).map(weapon=>({hair,outfit,weapon}))));
/** Extend the existing camera bounds for the complete, mirrored illustration.
 * Includes transparent registration rectangles and the existing ±8° hit tilt.
 */
export function fitPackFrame<T extends {left:number;top:number;width:number;height:number;heroScale:number}>(frame:T):T{
 const points:number[][]=[];
 for(const asset of Object.values(manifest.assets)){
  const r=asset.destination;
  for(const x of [r.x,r.x+r.width])for(const y of [r.y,r.y+r.height])for(const angle of [-8,0,8])for(const rootX of [155,340]){
   const dx=-(x-PACK_ANCHOR.x)*PACK_UNIT,dy=(y-PACK_ANCHOR.y)*PACK_UNIT,a=angle*Math.PI/180;
   points.push([rootX+frame.heroScale*(dx*Math.cos(a)-dy*Math.sin(a)),350+frame.heroScale*(dx*Math.sin(a)+dy*Math.cos(a))]);
  }
 }
 const left=Math.min(frame.left,...points.map(p=>p[0]-8)),top=Math.min(frame.top,...points.map(p=>p[1]-8));
 const right=Math.max(frame.left+frame.width,...points.map(p=>p[0]+8)),bottom=Math.max(frame.top+frame.height,...points.map(p=>p[1]+8));
 return {...frame,left,top,width:right-left,height:bottom-top};
}
