import { WEAPONS, type WeaponId } from './weapons';

type Base = { fill: string; opacity?: number };
export type WeaponShape = Base & (
  { type: 'polygon'; points: number[][] } |
  { type: 'ellipse'; x: number; y: number; width: number; height: number } |
  { type: 'rect'; x: number; y: number; width: number; height: number }
);
const polygon = (fill: string, points: number[][], opacity = 1): WeaponShape => ({ type: 'polygon', fill, points, opacity });
const rect = (fill: string, x: number, y: number, width: number, height: number): WeaponShape => ({ type: 'rect', fill, x, y, width, height });
const ellipse = (fill: string, x: number, y: number, width: number, height: number, opacity = 1): WeaponShape => ({ type: 'ellipse', fill, x, y, width, height, opacity });
const crystal = (fill: string, y: number, width: number, height: number): WeaponShape[] => [
  polygon(fill, [[0, y - height / 2], [-width / 2, y], [0, y + height / 2], [width / 2, y]]),
  polygon('#f1e6ff', [[0, y - height / 2 + 5], [-width / 2 + 4, y], [0, y + height / 2 - 5]], .8),
];
const branch = [polygon('#674a31', [[-6, 21], [-3, -76], [6, -78], [5, 21]]), rect('#b28a53', -2, -70, 4, 87), polygon('#88613b', [[0, -47], [17, -64], [20, -60], [3, -42]]), ellipse('#9db36c', 17, -65, 16, 8)];
const handle = [rect('#765039', -6, -14, 12, 35), rect('#d5ac63', -8, 16, 16, 6), rect('#d5ac63', -22, -21, 44, 9)];

// Shared hand-space geometry rendered by both Phaser Graphics and React SVG.
const ART: Record<typeof WEAPONS[WeaponId]['visual'], WeaponShape[]> = {
  stick: branch,
  wand: [...branch, ellipse('#aaa0ff', 2, -79, 46, 46, .18), ...crystal('#aaa0ff', -80, 25, 40)],
  iron: [...handle, polygon('#9eafb6', [[-10, -21], [-10, -102], [0, -123], [10, -102], [10, -21]]), polygon('#edf0db', [[0, -119], [0, -23], [7, -25], [7, -101]]), rect('#596e77', -6, -92, 3, 63)],
  cleaver: [...handle, polygon('#8f9da0', [[-23, -21], [-28, -115], [19, -126], [32, -102], [28, -21]]), polygon('#d7e2d7', [[19, -122], [28, -101], [24, -25], [16, -25]]), rect('#586a6b', -17, -99, 7, 63), ellipse('#4c6261', 5, -106, 12, 12), rect('#d5ac63', -27, -24, 57, 9)],
  inferno: [ellipse('#f98b42', 0, -79, 81, 143, .12), ...handle,
    polygon('#fa8a39', [[-16, -20], [-28, -65], [-19, -57], [-25, -106], [-8, -92], [1, -144], [17, -111], [28, -93], [20, -57], [24, -65], [15, -20]], .8),
    polygon('#393c48', [[-14, -20], [-20, -102], [0, -132], [20, -102], [14, -20]]),
    polygon('#ffca69', [[1, -126], [-6, -91], [3, -84], [-4, -55], [4, -65], [1, -25], [10, -81], [3, -92]]),
    polygon('#b78250', [[-30, -28], [-18, -17], [18, -17], [30, -28], [25, -11], [-25, -11]])],
  apprentice: [rect('#72513a', -6, -103, 12, 128), rect('#b58c58', -2, -97, 4, 118), rect('#d3b173', -12, -98, 24, 8), ...crystal('#74c6bd', -112, 24, 38)],
  storm: [rect('#425b6e', -7, -105, 14, 130), rect('#8fc5db', -2, -97, 4, 118), rect('#dbba75', -10, -38, 20, 8), polygon('#c2ac78', [[-24, -117], [-12, -89], [12, -89], [24, -117], [17, -93], [10, -82], [-10, -82], [-22, -98]]), ...crystal('#64b4f1', -117, 36, 48), polygon('#d9f4ff', [[32, -131], [22, -117], [29, -116], [20, -99], [39, -120], [30, -122]])],
  cosmic: [ellipse('#b597ff', 0, -113, 88, 83, .16), ellipse('#d5b5ff', 0, -113, 64, 64, .14), rect('#594774', -8, -103, 16, 128), rect('#c7a764', -3, -99, 6, 120),
    polygon('#d7b471', [[-31, -115], [-23, -87], [-10, -78], [10, -78], [23, -87], [31, -115], [25, -112], [14, -93], [-14, -93], [-25, -112]]),
    ...crystal('#b08aed', -118, 44, 58), rect('#d7b471', -13, -53, 26, 7), rect('#d7b471', -11, -13, 22, 6),
    polygon('#eadcff', [[-41, -133], [-38, -125], [-30, -122], [-38, -119], [-41, -111], [-44, -119], [-52, -122], [-44, -125]]), ellipse('#eadcff', 40, -90, 6, 6)],
};
export const weaponShapes = (id: WeaponId):WeaponShape[] => {
 const w=WEAPONS[id];if(w.tier<4)return ART[w.visual];
 const tier=w.tier, length=100+tier*2, breadth=16+tier*1.3;
 const metal=['#b6ccd1','#dab978','#b7a7df','#86caca'][tier%4], glow=tier>13?.25:.12;
 const shapes:WeaponShape[]=[...handle];
 if(w.kind==='melee') {
  const silhouette=/øks|kløyver|sigd/.test(w.name)?2:/hammer|klubbe|anker/.test(w.name)?0:1;
  if(silhouette===0)shapes.push(rect(metal,-breadth,-length,breadth*2,42),polygon('#eef2e5',[[-breadth,-length],[-breadth-12,-length+28],[-breadth,-length+42]]),rect('#6e7784',-6,-length,12,length-20));
  else if(silhouette===1)shapes.push(polygon(metal,[[-9,-20],[-10,-length],[0,-length-18],[10,-length],[9,-20]]),polygon('#edf1df',[[0,-length-12],[3,-25],[7,-length]]));
  else shapes.push(rect('#74808f',-6,-length,12,length-20),polygon(metal,[[-4,-length],[breadth+15,-length-12],[breadth+24,-length+36],[-4,-length+54]]));
 } else {
  shapes.push(rect('#65527a',-6,-length,12,length+24),ellipse(metal,0,-length,60+tier,46+tier,glow));
  if(tier%3===0)shapes.push(ellipse(metal,0,-length,50,50),ellipse('#283b50',0,-length,32,32),...crystal('#edf1ff',-length,15,26));
  else if(tier%3===1)shapes.push(...crystal(metal,-length,32+tier,42+tier),polygon(metal,[[-32,-length+12],[-26,-length-29],[-19,-length+14],[19,-length+14],[26,-length-29],[32,-length+12],[0,-length+36]]));
  else shapes.push(rect(metal,-32,-length-19,64,40),rect('#eee4c9',-24,-length-13,48,28),rect('#65527a',-2,-length-16,4,34));
 }
 for(let i=0;i<Math.floor(tier/4);i++)shapes.push(ellipse('#fff0b6',i%2?-22:22,-40-i*22,7,9));
 if(tier>=12)shapes.push(polygon(metal,[[-16,-30],[-44,-57],[-36,-23],[0,-10],[36,-23],[44,-57],[16,-30]]));
 if(tier>=17)shapes.push(ellipse(metal,-43,-length+15,16,16),ellipse(metal,43,-length+15,16,16),polygon('#eadfff',[[0,-length-38],[-9,-length-24],[0,-length-10],[9,-length-24]]));
 return shapes;
};
export const weaponEffectColor = (id: WeaponId) => {
  const visual = WEAPONS[id].visual;
  return visual === 'inferno' ? 0xffae55 : visual === 'storm' ? 0x85d7ff : visual === 'apprentice' ? 0x91e4c9 : WEAPONS[id].kind === 'magic' ? 0xc6b5ff : 0xffdf8b;
};
