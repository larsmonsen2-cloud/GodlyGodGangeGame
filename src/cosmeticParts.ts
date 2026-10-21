import {CONFIG} from './config';
import {HAIR_COLORS,type Appearance} from './appearance';
import type {WeaponShape} from './weaponVisuals';
const ink='#263b35';
const p=(fill:string,points:number[][]):WeaponShape=>({type:'polygon',fill,points});
const e=(fill:string,x:number,y:number,width:number,height:number):WeaponShape=>({type:'ellipse',fill,x,y,width,height});
const r=(fill:string,x:number,y:number,width:number,height:number):WeaponShape=>({type:'rect',fill,x,y,width,height});
const shade=(hex:string,factor:number)=>'#'+hex.slice(1).match(/../g)!.map(s=>Math.min(255,Math.round(parseInt(s,16)*factor)).toString(16).padStart(2,'0')).join('');
export const cosmeticHeight=(a:Appearance)=>a.headwear==='wizard'?258:a.hairStyle==='afro'||a.hairStyle==='mohawk'||a.hairStyle==='bun'?230:212;
export function hairParts(a:Appearance){
 const c=HAIR_COLORS.find(x=>x.id===a.hairColor)!.value,d=shade(c,.72),light=shade(c,1.3),back:WeaponShape[]=[],front:WeaponShape[]=[];
 const covered=['hood','helmet','wizard'].includes(a.headwear),style=a.hairStyle;
 const locks=(side:number,curly=false)=>{for(let i=0;i<6;i++){
  const x=side*(44+(curly?Math.sin(i*2)*5:Math.sin(i)*7)),y=(covered?-153:-175)+i*19;
  back.push(e(d,x,y,curly?33:32,curly?30:41),e(c,x-side*3,y-3,curly?25:24,curly?24:35));
 }};
 const braid=(side:number,single=false)=>{for(let i=0;i<7;i++){
  const x=side*(48+i*(single?3:1.8)),y=-154+i*17;
  back.push(e(d,x,y,23,25),e(c,x+(i%2?4:-4),y-2,15,20));
 }back.push(r('#d9b776',side*(single?66:59)-7,-42,14,6),p(c,[[side*(single?52:38),-37],[side*(single?52:38)-10,-20],[side*(single?52:38)+8,-18]]));};
 if(style==='long'){back.push(p(d,[[-42,-178],[42,-178],[53,-44],[31,-60],[0,-66],[-53,-42]]),p(c,[[-38,-177],[37,-177],[45,-57],[30,-65],[0,-70],[-45,-54]]));}
 if(style==='waves'||style==='long_curls'){locks(-1,style==='long_curls');locks(1,style==='long_curls');}
 if(style==='braid')braid(-1,true);
 if(style==='braids'){braid(-1);braid(1);}
 if(style==='ponytail'){back.push(p(d,[[18,-181],[55,covered?-181:-210],[75,-177],[60,-119],[40,-70],[42,-135],[34,-158]]),p(c,[[25,-179],[54,covered?-178:-202],[65,-176],[48,-112],[49,-156]]),e('#d9b776',34,-175,14,13));}
 if(style==='bob')back.push(e(d,0,-158,83,84),r(d,-39,-160,78,43),r(c,-35,-154,10,34),r(c,27,-154,9,34));
 if(style==='afro'&&covered){back.push(e(d,-35,-157,30,36),e(c,-37,-159,22,28),e(d,35,-157,30,36),e(c,37,-159,22,28));}
 if(style==='afro'&&!covered)for(let i=0;i<11;i++){const angle=Math.PI+i*Math.PI/10;back.push(e(d,Math.cos(angle)*33,-167+Math.sin(angle)*32,33,34),e(c,Math.cos(angle)*33-2,-170+Math.sin(angle)*32,26,27));}
 if(style==='bun'&&!covered)back.push(e(d,10,-207,43,40),e(c,7,-210,34,30),p(light,[[-6,-213],[18,-221],[23,-217],[0,-209]]));
 if(style==='bald')return {back,front};
 if(style==='shaved'){front.push(e(d,0,-173,63,28));for(let i=0;i<9;i++)front.push(r(light,-24+i*6,-178+(i%2)*4,2,3));return {back,front};}
 // Covered styles keep their side locks; crowns/flowers leave the silhouette intact.
 if(covered){front.push(p(c,[[-31,-173],[-24,-173],[-28,-148],[-34,-145]]),p(c,[[24,-173],[31,-173],[34,-145],[27,-150]]));return {back,front};}
 if(style==='tousled')front.push(p(d,[[-36,-159],[-36,-181],[-17,-189],[-7,-207],[6,-190],[30,-188],[36,-160],[22,-168],[8,-156],[-3,-171],[-18,-155]]),p(c,[[-31,-170],[-25,-180],[-8,-185],[-4,-198],[6,-181],[26,-181],[28,-165],[13,-173],[6,-165],[-6,-177],[-20,-166]]));
 else if(style==='curls'||style==='long_curls'||style==='afro')for(let i=0;i<5;i++){const x=-28+i*14;front.push(e(d,x,-175-Math.sin(i*Math.PI/4)*13,24,26),e(c,x-2,-178-Math.sin(i*Math.PI/4)*13,19,20));}
 else if(style==='mohawk')front.push(p(d,[[-13,-160],[-15,-195],[-7,-226],[1,-213],[9,-228],[15,-195],[12,-160]]),p(c,[[-5,-170],[-7,-197],[-3,-214],[1,-203],[7,-214],[8,-172]]));
 else {front.push(e(d,0,-172,68,35),p(c,[[-32,-169],[-26,-183],[0,-188],[28,-179],[32,-163],[16,-168],[5,-158],[-3,-174],[-23,-165]]));if(style==='short')front.push(r(d,-32,-170,7,24),r(d,26,-170,7,24));}
 front.push(p(light,[[-22,-181],[-7,-186],[-5,-182],[-20,-177]]));
 return {back,front};
}
export function outfitParts(a:Appearance):WeaponShape[]{
 const main=CONFIG.colors.find(c=>c.id===a.clothes)!,accent=CONFIG.colors.find(c=>c.id===a.accent)!.value;
 const c=main.value,d=main.dark,o=a.outfit,out:WeaponShape[]=[];
 const skirt=o.endsWith('_dress'),long=o==='mage'||o==='mage_dress'||o==='noble_dress';
 if(skirt||long){
  const wide=o==='noble_dress'?57:long?46:43,bottom=long?-10:-30;
  out.push(p(ink,[[-27,-106],[27,-106],[wide+3,bottom],[0,bottom+5],[-wide-3,bottom]]),p(c,[[-25,-104],[25,-104],[wide,bottom-3],[0,bottom+1],[-wide,bottom-3]]),p(d,[[-8,-83],[-17,bottom],[0,bottom+1],[7,-85]]),p(d,[[20,-89],[wide,bottom-3],[31,bottom-3]]),r(accent,-wide+5,bottom-6,wide*2-10,4));
 }
 out.push(p(ink,[[-32,-123],[32,-123],[38,-55],[-37,-55]]),p(c,[[-29,-120],[29,-120],[32,-59],[-31,-59]]),p(d,[[18,-116],[29,-116],[32,-59],[19,-59]]),p(shade(c,1.12),[[-25,-112],[-9,-117],[-21,-76]]));
 if(o==='adventurer'||o==='adventure_dress')out.push(p(accent,[[-16,-120],[0,-104],[16,-120]]),r('#765039',-33,-62,66,11),r('#e6bb68',-6,-64,14,15),r('#765039',-2,-60,6,7));
 if(o==='warrior'||o==='armor_dress'){
  out.push(p('#a7bab8',[[-25,-118],[25,-118],[24,-73],[0,-65],[-24,-73]]),p('#dee6d4',[[-20,-113],[-5,-114],[-10,-79],[-19,-84]]),p('#718c8a',[[6,-114],[24,-115],[23,-76],[7,-73]]),p(ink,[[-35,-126],[-51,-114],[-47,-91],[-27,-94]]),p(accent,[[-36,-122],[-47,-112],[-44,-96],[-29,-98]]),p(ink,[[31,-126],[49,-114],[47,-93],[28,-94]]),p(accent,[[33,-122],[45,-112],[43,-97],[31,-98]]),r(accent,-30,-68,60,8));
  if(skirt)for(let i=0;i<5;i++)out.push(p(i%2?'#718c8a':'#b6c4be',[[-30+i*13,-57],[-20+i*13,-57],[-17+i*13,-32],[-32+i*13,-32]]));
 }else if(o==='mage'||o==='mage_dress'){
  out.push(p(d,[[-31,-118],[-54,-104],[-59,-62],[-31,-73]]),p(c,[[28,-117],[47,-103],[53,-62],[30,-74]]),p(accent,[[-9,-121],[0,-102],[9,-121],[4,-72],[-4,-72]]),r(accent,-33,-67,66,6));
  for(const [x,y] of [[0,-91],[-20,-33],[20,-48]])out.push(p(accent,[[x,y-8],[x+3,y-2],[x+8,y],[x+3,y+2],[x,y+8],[x-3,y+2],[x-8,y],[x-3,y-2]]));
  if(o==='mage')out.push(p(d,[[-30,-122],[-63,-106],[-70,-57],[-46,-65],[-31,-91]]),p(c,[[30,-122],[60,-107],[67,-58],[43,-67],[31,-91]]),p(accent,[[-7,-107],[-9,-15],[-3,-15],[0,-85],[4,-15],[10,-15],[7,-107]]));
  else out.push(e(accent,-37,-109,27,25),e(accent,36,-109,26,25),p(d,[[-27,-101],[-16,-70],[16,-70],[26,-101],[0,-91]]),p(accent,[[0,-90],[9,-80],[0,-70],[-9,-80]]),p(accent,[[-37,-27],[0,-16],[37,-27],[0,-11]]));
 }else if(o==='wild'||o==='wild_dress'){
  out.push(p('#8a6950',[[-35,-119],[-46,-108],[-27,-101],[-17,-107],[0,-97],[18,-107],[30,-101],[46,-109],[33,-120],[0,-112]]),p('#ddc6a1',[[-33,-124],[-42,-112],[-24,-108],[-15,-114],[0,-105],[16,-114],[29,-109],[40,-114],[31,-124],[0,-118]]),r('#694b36',-35,-65,70,12),r(accent,-9,-67,18,16));
  if(skirt)out.push(p(d,[[-28,-57],[33,-55],[47,-26],[17,-40],[-9,-28],[-39,-37]]),p(c,[[-31,-73],[30,-73],[39,-47],[8,-53],[-19,-42],[-39,-50]]));
 }else if(o==='noble'||o==='noble_dress'){
  out.push(p(d,[[-33,-128],[-19,-130],[-10,-109],[0,-115],[10,-109],[19,-130],[34,-128],[27,-101],[-27,-101]]),p(accent,[[-22,-123],[-11,-107],[0,-115],[11,-107],[22,-123],[17,-99],[-17,-99]]));
  for(let i=0;i<4;i++)out.push(e(accent,0,-94+i*9,5,5));
  if(skirt)out.push(e(accent,-37,-108,27,29),e(accent,37,-108,27,29),p(accent,[[-27,-70],[0,-57],[27,-70],[0,-47]]));
 }else if(o==='rogue'||o==='rogue_dress'){
  out.push(p(accent,[[-31,-121],[28,-121],[30,-108],[-24,-102],[-35,-110]]),p(accent,[[-22,-108],[-30,-69],[-16,-76],[-10,-111]]),r('#bba780',12,-87,15,19),r('#765039',-33,-61,66,9),r('#eee1b6',14,-84,2,13),r('#eee1b6',23,-84,2,13));
 }
 return out;
}
export function headwearParts(a:Appearance):WeaponShape[]{
 const c=CONFIG.colors.find(x=>x.id===a.clothes)!.dark,d=CONFIG.colors.find(x=>x.id===a.accent)!.value;
 switch(a.headwear){
  case 'hood':return [p(ink,[[-44,-143],[-45,-183],[0,-213],[45,-183],[44,-143],[30,-128],[29,-172],[0,-186],[-29,-172],[-30,-128]]),p(c,[[-39,-146],[-40,-182],[0,-207],[40,-182],[39,-146],[33,-139],[32,-176],[0,-191],[-32,-176],[-33,-139]])];
  case 'helmet':return [e(ink,0,-178,82,68),e('#a6babd',0,-180,73,58),r('#344d51',-36,-177,72,17),r('#dce3ce',-4,-207,8,43),p(d,[[-42,-166],[-31,-170],[-31,-140],[-40,-146]]),p(d,[[42,-166],[31,-170],[31,-140],[40,-146]])];
  case 'wizard':return [p(ink,[[-51,-175],[-23,-201],[2,-254],[30,-219],[32,-190],[54,-175]]),p(c,[[-42,-179],[-19,-201],[3,-246],[24,-218],[28,-187],[44,-179]]),e(ink,0,-177,111,18),e(c,0,-180,104,12),p(d,[[-23,-194],[27,-194],[29,-184],[-28,-184]]),p(d,[[4,-231],[8,-222],[17,-219],[8,-216],[4,-207],[0,-216],[-9,-219],[0,-222]])];
  case 'band':return [r(d,-35,-169,70,9),p(d,[[31,-169],[50,-163],[37,-152],[29,-162]])];
  case 'flowers':return Array.from({length:7},(_,i)=>{const x=-33+i*11,y=-174-Math.sin(i*Math.PI/6)*7;return [e(i%2?d:'#f0dbcc',x,y,15,15),e('#e5b85e',x,y,5,5)];}).flat();
  case 'tiara':return [p('#ead293',[[-32,-169],[-34,-186],[-17,-179],[0,-199],[17,-179],[34,-186],[32,-169]]),p(d,[[0,-192],[6,-182],[0,-173],[-6,-182]])];
  default:return [];
 }
}
