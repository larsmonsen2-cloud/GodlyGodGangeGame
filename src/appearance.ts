import { CONFIG, type HeroColor } from './config';
export const SKINS = [
 {id:'pearl',name:'Lys porselen',value:'#f6d9c0'}, {id:'sand',name:'Varm sand',value:'#f4c897'},
 {id:'honey',name:'Gylden honning',value:'#dca572'}, {id:'copper',name:'Varm kobber',value:'#b77c55'},
 {id:'chestnut',name:'Dyp kastanje',value:'#8d583e'}, {id:'umber',name:'Mørk umbra',value:'#603d31'},
] as const;
export const HAIR_COLORS = [
 {id:'brown',name:'Kastanjebrunt',value:'#553e32'}, {id:'black',name:'Nattesvart',value:'#262b31'},
 {id:'blond',name:'Gullblondt',value:'#e2bc68'}, {id:'red',name:'Kobberrødt',value:'#ae583b'},
 {id:'silver',name:'Sølvgrått',value:'#d9dfdc'}, {id:'purple',name:'Eventyrlilla',value:'#9367b5'},
] as const;
export const HAIR_STYLES = [{id:'tousled',name:'Bustete'},{id:'short',name:'Kort'},{id:'curls',name:'Krøller'},{id:'long',name:'Langt'},{id:'bald',name:'Skallet'}] as const;
export const EXPRESSIONS = [{id:'stern',name:'Barsk'},{id:'sly',name:'Lur'},{id:'proud',name:'Overlegen'},{id:'worried',name:'Lettere bekymret'}] as const;
export const DETAILS = [{id:'none',name:'Ingen'},{id:'beard',name:'Skjegg'},{id:'moustache',name:'Bart'},{id:'paint',name:'Ansiktsmaling'}] as const;
export type Appearance = {skin:typeof SKINS[number]['id'];hairStyle:typeof HAIR_STYLES[number]['id'];hairColor:typeof HAIR_COLORS[number]['id'];expression:typeof EXPRESSIONS[number]['id'];detail:typeof DETAILS[number]['id'];clothes:HeroColor};
export const DEFAULT_APPEARANCE:Appearance={skin:'sand',hairStyle:'tousled',hairColor:'brown',expression:'sly',detail:'none',clothes:'forest'};
export const APPEARANCE_OPTIONS={skin:SKINS,hairStyle:HAIR_STYLES,hairColor:HAIR_COLORS,expression:EXPRESSIONS,detail:DETAILS,clothes:CONFIG.colors};
export function validAppearance(value:unknown):value is Appearance {
 if(!value||typeof value!=='object')return false;
 return Object.entries(APPEARANCE_OPTIONS).every(([key,options])=>options.some(option=>option.id===(value as Record<string,unknown>)[key]));
}
export function normalizeAppearance(value:unknown,clothes:unknown='forest'):Appearance {
 const source=(value&&typeof value==='object'?value:{}) as Record<string,unknown>;
 const result={...DEFAULT_APPEARANCE,clothes:CONFIG.colors.some(c=>c.id===clothes)?clothes:'forest'} as Appearance;
 for(const [key,options] of Object.entries(APPEARANCE_OPTIONS)) if(options.some(o=>o.id===source[key])) Object.assign(result,{[key]:source[key]});
 return result;
}
export function randomAppearance(random:()=>number=Math.random):Appearance {
 const result={...DEFAULT_APPEARANCE};
 for(const [key,options] of Object.entries(APPEARANCE_OPTIONS)) {const draw=random();const index=Number.isFinite(draw)?Math.max(0,Math.min(options.length-1,Math.floor(draw*options.length))):0;Object.assign(result,{[key]:options[index].id});}
 return result;
}
