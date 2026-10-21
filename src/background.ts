import type {Hero} from './progression';
import {WEAPONS} from './weapons';

export const ORIGINS=[
 {id:'yard',name:'I en bakgård der ingen tok deg alvorlig.',early:'Eventyret begynte i en bakgård der ingen tok helteplanene alvorlig.',later:'Bakgården som lo av helteplanene, får nå svært høytidelige reisebrev.'},
 {id:'academy',name:'På et magiakademi som helst ikke vil kommentere saken.',early:'Forlot et magiakademi som helst ikke vil kommentere saken.',later:'Magiakademiet nekter fortsatt å kommentere, men har begynt å ta notater.'},
 {id:'farm',name:'På en gård der hønene ble for mektige.',early:'Forlot gården da hønene begynte å stille krav.',later:'En gang jaget fra gården av kravstore høner; nå skrives reisebrevene på meget offisielt papir.'},
 {id:'castle',name:'På et slott der du egentlig bare skulle levere en pakke.',early:'Skulle bare levere en pakke på slottet, men tok en omvei inn i helteyrket.',later:'Pakken på slottet er fortsatt en sak for arkivet; omveien har fått sin egen krønike.'},
 {id:'forest',name:'I en skog der du gikk deg bort med imponerende selvtillit.',early:'Gikk seg bort i skogen med imponerende selvtillit.',later:'Skogen omtales nå som starten på en svært målrettet ekspedisjon; kartet protesterer.'},
 {id:'secret',name:'Det er hemmelig. Også for deg.',early:'Opprinnelsen er hemmelig, også for helten selv.',later:'Opprinnelsen er fortsatt hemmelig; helten har opprettet en komité for å huske den.'},
] as const;
export const GOALS=[
 {id:'power',name:'Bli verdens mektigste helt.',story:'Drømmer om å bli verdens mektigste helt; søknaden er foreløpig til egen behandling.'},
 {id:'statue',name:'Få en statue som faktisk ligner.',story:'Ønsker seg en statue som faktisk ligner, og øver allerede på posituren.'},
 {id:'weapon',name:'Skaffe et våpen som krever egen parkeringsplass.',story:'Sparer på drømmen om et våpen som krever egen parkeringsplass.'},
 {id:'family',name:'Bevise at familien tok fullstendig feil.',story:'Planlegger en svært grundig presentasjon av hvorfor familien tok feil.'},
 {id:'hen',name:'Få respekt fra en bestemt høne.',story:'Håper fortsatt på respekt fra én bestemt høne, som foreløpig holder kortene tett til fjærene.'},
 {id:'money',name:'Finne ut hvorfor alle monstrene har så mye penger.',story:'Vil undersøke hvorfor monstrene har så mye penger; regnskapet virker mistenkelig.'},
] as const;
export type Background={origin:typeof ORIGINS[number]['id']|null;goal:typeof GOALS[number]['id']|null};
export const emptyBackground=():Background=>({origin:null,goal:null});
export function validBackground(v:unknown):v is Background {
 const b=v as Background;return !!b&&(b.origin===null||ORIGINS.some(o=>o.id===b.origin))&&(b.goal===null||GOALS.some(g=>g.id===b.goal));
}
export function normalizeBackground(v:unknown):Background {
 const b=v as Background|undefined;return {origin:ORIGINS.some(o=>o.id===b?.origin)?b!.origin:null,goal:GOALS.some(g=>g.id===b?.goal)?b!.goal:null};
}
export function backgroundPreview(b:Background){return [ORIGINS.find(o=>o.id===b.origin)?.early,GOALS.find(g=>g.id===b.goal)?.story].filter(Boolean).join(' ')||'Historien er ikke skrevet ennå. Eventyret kan begynne likevel.';}
export function personalStory(hero:Hero,fallback:string,fact:string){
 const b=hero.background;if(!b?.origin&&!b?.goal)return fact?`${fact} ${fallback}`:fallback;
 const origin=ORIGINS.find(o=>o.id===b.origin),goal=GOALS.find(g=>g.id===b.goal);
 const beginning=origin?(hero.level>=10?origin.later:origin.early):null;
 // This is a claim about equipped size, never an assertion that a goal is won.
 const ambition=goal?.id==='weapon'&&WEAPONS[hero.weapon].tier>=12
  ?'Det store våpenet gjør drømmen om egen parkeringsplass mer aktuell; byggesøknaden er ikke sendt.'
  :goal?.story;
 const progress=fact||fallback.split(/(?<=[.!?])\s/)[0];
 return [beginning,ambition,progress].filter(Boolean).join(' ');
}
