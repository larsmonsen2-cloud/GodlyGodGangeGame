import { CONFIG, type HeroColor } from './config';
export const SKINS = [
 {id:'pearl',name:'Lys porselen',value:'#f6d9c0'}, {id:'sand',name:'Varm sand',value:'#f4c897'},
 {id:'honey',name:'Gylden honning',value:'#dca572'}, {id:'copper',name:'Varm kobber',value:'#b77c55'},
 {id:'chestnut',name:'Dyp kastanje',value:'#8d583e'}, {id:'umber',name:'Mørk umbra',value:'#603d31'},
] as const;
export const HAIR_COLORS = [
 {id:'brown',name:'Kastanjebrunt',value:'#553e32'}, {id:'black',name:'Nattesvart',value:'#262b31'},
 {id:'blond',name:'Gullblondt',value:'#e2bc68'}, {id:'red',name:'Kobberrødt',value:'#ae583b'},
 {id:'silver',name:'Grått / hvitt',value:'#d9dfdc'}, {id:'dark_brown',name:'Mørkebrunt',value:'#382c27'}, {id:'pink',name:'Rosa',value:'#e697b5'}, {id:'blue',name:'Blått',value:'#6b9ed0'}, {id:'green',name:'Grønt',value:'#62a88a'}, {id:'purple',name:'Eventyrlilla',value:'#9367b5'},
] as const;
export const HAIR_STYLES = [{id:'tousled',name:'Bustete'},{id:'short',name:'Kort og ryddig'},{id:'curls',name:'Korte krøller'},{id:'long',name:'Langt og rett'},{id:'afro',name:'Afro'},{id:'waves',name:'Lange bølger'},{id:'long_curls',name:'Lange krøller'},{id:'bob',name:'Kort bob'},{id:'braid',name:'Én lang flette'},{id:'braids',name:'To fletter'},{id:'ponytail',name:'Høy hestehale'},{id:'bun',name:'Knute'},{id:'mohawk',name:'Hanekam'},{id:'shaved',name:'Barbert'},{id:'bald',name:'Skallet'}] as const;
export const EXPRESSIONS = [{id:'happy',name:'Blid'},{id:'serious',name:'Alvorlig'},{id:'stern',name:'Barsk'},{id:'sly',name:'Lur'},{id:'proud',name:'Overlegen'},{id:'worried',name:'Lettere bekymret'}] as const;
export const DETAILS = [{id:'none',name:'Ingen'},{id:'freckles',name:'Fregner'},{id:'scar',name:'Arr'},{id:'glasses',name:'Briller'},{id:'paint',name:'Ansiktsmaling'}] as const;
export const BEARDS=[{id:'none',name:'Ingen'},{id:'moustache',name:'Bart'},{id:'short_beard',name:'Kort skjegg'},{id:'long_beard',name:'Langt skjegg'}] as const;
export const OUTFITS=[
 {id:'adventurer',name:'Eventyrtunika',style:'Eventyrer'},{id:'adventure_dress',name:'Eventyrkjole',style:'Eventyrer'},
 {id:'warrior',name:'Polstret vest',style:'Kriger'},{id:'armor_dress',name:'Rustningsskjørt',style:'Kriger'},
 {id:'mage',name:'Vid magikerkappe',style:'Magiker'},{id:'mage_dress',name:'Stjernekjole',style:'Magiker'},
 {id:'wild',name:'Villmarksklær',style:'Villmarking'},{id:'wild_dress',name:'Lagdelt skogskjole',style:'Villmarking'},
 {id:'noble',name:'Hoffjakke',style:'Adelig'},{id:'noble_dress',name:'Praktfull hoffkjole',style:'Adelig'},
 {id:'rogue',name:'Lappet røverjakke',style:'Røver'},{id:'rogue_dress',name:'Røverskjørt',style:'Røver'},
] as const;
export const HEADWEAR=[{id:'none',name:'Ingen'},{id:'hood',name:'Hette'},{id:'helmet',name:'Enkel hjelm'},{id:'wizard',name:'Trollmannshatt'},{id:'band',name:'Pannebånd'},{id:'flowers',name:'Blomsterkrans'},{id:'tiara',name:'Liten tiara'}] as const;
export const CAPES=[{id:'none',name:'Ingen'},{id:'short',name:'Kort kappe'},{id:'long',name:'Lang kappe'}] as const;
export type Appearance = {skin:typeof SKINS[number]['id'];hairStyle:typeof HAIR_STYLES[number]['id'];hairColor:typeof HAIR_COLORS[number]['id'];expression:typeof EXPRESSIONS[number]['id'];detail:typeof DETAILS[number]['id'];clothes:HeroColor;accent:HeroColor;beard:typeof BEARDS[number]['id'];outfit:typeof OUTFITS[number]['id'];headwear:typeof HEADWEAR[number]['id'];cape:typeof CAPES[number]['id']};
export const DEFAULT_APPEARANCE:Appearance={skin:'sand',hairStyle:'tousled',hairColor:'brown',expression:'sly',detail:'none',clothes:'forest',accent:'sun',beard:'none',outfit:'adventurer',headwear:'none',cape:'short'};
export const APPEARANCE_OPTIONS={skin:SKINS,hairStyle:HAIR_STYLES,hairColor:HAIR_COLORS,expression:EXPRESSIONS,detail:DETAILS,clothes:CONFIG.colors,beard:BEARDS,outfit:OUTFITS,accent:CONFIG.colors,headwear:HEADWEAR,cape:CAPES};
export function validAppearance(value:unknown):value is Appearance {
 if(!value||typeof value!=='object')return false;
 return Object.entries(APPEARANCE_OPTIONS).every(([key,options])=>options.some(option=>option.id===(value as Record<string,unknown>)[key]));
}
export function normalizeAppearance(value:unknown,clothes:unknown='forest'):Appearance {
 const source=(value&&typeof value==='object'?value:{}) as Record<string,unknown>;
 const result={...DEFAULT_APPEARANCE,clothes:CONFIG.colors.some(c=>c.id===clothes)?clothes:'forest'} as Appearance;
 for(const [key,options] of Object.entries(APPEARANCE_OPTIONS)) if(options.some(o=>o.id===source[key])) Object.assign(result,{[key]:source[key]});
 if(source.detail==='beard'||source.detail==='moustache'){result.detail='none';result.beard=source.detail==='beard'?'long_beard':'moustache';}
 return result;
}
export function randomAppearance(random:()=>number=Math.random):Appearance {
 const result={...DEFAULT_APPEARANCE};
 for(const [key,options] of Object.entries(APPEARANCE_OPTIONS)) {const draw=random();const index=Number.isFinite(draw)?Math.max(0,Math.min(options.length-1,Math.floor(draw*options.length))):0;Object.assign(result,{[key]:options[index].id});}
 return result;
}

export const STYLE_PRESETS:readonly {name:string;look:Appearance}[]=[
 {name:'Barsk sverdhelt',look:{...DEFAULT_APPEARANCE,outfit:'warrior',expression:'stern',headwear:'helmet',clothes:'slate'}},
 {name:'Langhåret eventyrhelt',look:{...DEFAULT_APPEARANCE,hairStyle:'braid',outfit:'adventure_dress',expression:'happy',clothes:'berry',cape:'none'}},
 {name:'Mystisk magiker',look:{...DEFAULT_APPEARANCE,hairStyle:'long',outfit:'mage',headwear:'hood',clothes:'navy',hairColor:'silver',expression:'serious'}},
 {name:'Praktfull kjolemagiker',look:{...DEFAULT_APPEARANCE,hairStyle:'waves',outfit:'mage_dress',headwear:'wizard',clothes:'violet',accent:'cream',hairColor:'pink'}},
 {name:'Vill skogsvandrer',look:{...DEFAULT_APPEARANCE,hairStyle:'braids',outfit:'wild_dress',clothes:'forest',detail:'freckles',cape:'long'}},
 {name:'Uforskammet elegant',look:{...DEFAULT_APPEARANCE,hairStyle:'bun',outfit:'noble_dress',headwear:'tiara',expression:'proud',clothes:'navy',accent:'berry'}},
];
// Ensure successive rolls change a major silhouette, even with a repeated draw.
export function rerollAppearance(previous:Appearance,random:()=>number=Math.random):Appearance{
 const next=randomAppearance(random);
 if(next.hairStyle===previous.hairStyle)next.hairStyle=HAIR_STYLES[(HAIR_STYLES.findIndex(x=>x.id===previous.hairStyle)+1)%HAIR_STYLES.length].id;
 if(next.outfit===previous.outfit)next.outfit=OUTFITS[(OUTFITS.findIndex(x=>x.id===previous.outfit)+1)%OUTFITS.length].id;
 return next;
}
