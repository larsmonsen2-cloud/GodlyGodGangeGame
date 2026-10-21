import { CONFIG } from './config';

const BASE_WEAPONS = {
  stick: { id: 'stick', ...CONFIG.weapon, price: 0, stat: 'strength', kind: 'melee', tier: 0, visual: 'stick', label: 'Pinne · nærkamp' },
  wand: { id: 'wand', ...CONFIG.magicWeapon, price: 0, stat: 'magic', kind: 'magic', tier: 0, visual: 'wand', label: 'Kvist · magi' },
  iron_sword: { id: 'iron_sword', name: 'Det urimelig selvsikre jernsverdet', description: 'Har vunnet alle diskusjoner med smørkniver.', ...CONFIG.shop.tier1, stat: 'strength', kind: 'melee', tier: 1, visual: 'iron', label: 'Jernsverd · nærkamp' },
  great_cleaver: { id: 'great_cleaver', name: 'Den fullstendig unødvendige kjempekløyveren', description: 'For deg som mener at presisjon er en unødvendig begrensning.', ...CONFIG.shop.tier2, stat: 'strength', kind: 'melee', tier: 2, visual: 'cleaver', label: 'Kjempekløyver · nærkamp' },
  inferno_blade: { id: 'inferno_blade', name: 'Den katastrofalt overlegne infernoklingen', description: 'Smidd i en døende stjerne. Egner seg også til toast.', ...CONFIG.shop.tier3, stat: 'strength', kind: 'melee', tier: 3, visual: 'inferno', label: 'Infernoklinge · nærkamp' },
  apprentice_staff: { id: 'apprentice_staff', name: 'Den overraskende kompetente lærlingstaven', description: 'Har lest nesten hele bruksanvisningen.', ...CONFIG.shop.tier1, stat: 'magic', kind: 'magic', tier: 1, visual: 'apprentice', label: 'Lærlingstav · magi' },
  storm_staff: { id: 'storm_staff', name: 'Den høyst selvhøytidelige stormstaven', description: 'Krever å bli tiltalt som Deres Elektriske Høyhet.', ...CONFIG.shop.tier2, stat: 'magic', kind: 'magic', tier: 2, visual: 'storm', label: 'Stormstav · magi' },
  cosmic_staff: { id: 'cosmic_staff', name: 'Den ultimate kosmiske katastrofekvisten', description: 'Universet har bedt den om å roe seg ned.', ...CONFIG.shop.tier3, stat: 'magic', kind: 'magic', tier: 3, visual: 'cosmic', label: 'Katastrofekvist · magi' },
} as const;
export const WEAPONS={...BASE_WEAPONS,
  melee_4: {id:'melee_4',name:"Den overkvalifiserte postkasseøksa",description:"Godkjent av seg selv, med imponerende stempel.",damage:30,price:400,stat:'strength',kind:'melee',tier:4,visual:'inferno',label:"Den overkvalifiserte postkasseøksa"},
  melee_5: {id:'melee_5',name:"Fogdens ubestridelige klubbe",description:"Krever egen stol ved høytidelige anledninger.",damage:40,price:650,stat:'strength',kind:'melee',tier:5,visual:'inferno',label:"Fogdens ubestridelige klubbe"},
  melee_6: {id:'melee_6',name:"Det høytidelige dobbeltbladet",description:"Har levert klage på tyngdekraften.",damage:52,price:950,stat:'strength',kind:'melee',tier:6,visual:'inferno',label:"Det høytidelige dobbeltbladet"},
  melee_7: {id:'melee_7',name:"Frostgrevens isbryter",description:"Gjør selv stillheten litt nervøs.",damage:68,price:1400,stat:'strength',kind:'melee',tier:7,visual:'inferno',label:"Frostgrevens isbryter"},
  melee_8: {id:'melee_8',name:"Sjøkongens tørre anker",description:"Godkjent av seg selv, med imponerende stempel.",damage:86,price:1900,stat:'strength',kind:'melee',tier:8,visual:'inferno',label:"Sjøkongens tørre anker"},
  melee_9: {id:'melee_9',name:"Tordendommerens møtehammer",description:"Krever egen stol ved høytidelige anledninger.",damage:108,price:2500,stat:'strength',kind:'melee',tier:9,visual:'inferno',label:"Tordendommerens møtehammer"},
  melee_10: {id:'melee_10',name:"Krystallskjæreren med fagbrev",description:"Har levert klage på tyngdekraften.",damage:134,price:3200,stat:'strength',kind:'melee',tier:10,visual:'inferno',label:"Krystallskjæreren med fagbrev"},
  melee_11: {id:'melee_11',name:"Den diplomatiske beleiringsøksa",description:"Gjør selv stillheten litt nervøs.",damage:164,price:4000,stat:'strength',kind:'melee',tier:11,visual:'inferno',label:"Den diplomatiske beleiringsøksa"},
  melee_12: {id:'melee_12',name:"Solkeiserens frokostsverd",description:"Godkjent av seg selv, med imponerende stempel.",damage:200,price:5000,stat:'strength',kind:'melee',tier:12,visual:'inferno',label:"Solkeiserens frokostsverd"},
  melee_13: {id:'melee_13',name:"Månebaronens enorme sigd",description:"Krever egen stol ved høytidelige anledninger.",damage:240,price:6200,stat:'strength',kind:'melee',tier:13,visual:'inferno',label:"Månebaronens enorme sigd"},
  melee_14: {id:'melee_14',name:"Stjernenes regnskapskløyver",description:"Har levert klage på tyngdekraften.",damage:286,price:7600,stat:'strength',kind:'melee',tier:14,visual:'inferno',label:"Stjernenes regnskapskløyver"},
  melee_15: {id:'melee_15',name:"Kometens siste advarsel",description:"Gjør selv stillheten litt nervøs.",damage:338,price:9200,stat:'strength',kind:'melee',tier:15,visual:'inferno',label:"Kometens siste advarsel"},
  melee_16: {id:'melee_16',name:"Galaksegrevens papirkniv",description:"Godkjent av seg selv, med imponerende stempel.",damage:396,price:11000,stat:'strength',kind:'melee',tier:16,visual:'inferno',label:"Galaksegrevens papirkniv"},
  melee_17: {id:'melee_17',name:"Den tverrdimensjonale døråpneren",description:"Krever egen stol ved høytidelige anledninger.",damage:460,price:13000,stat:'strength',kind:'melee',tier:17,visual:'inferno',label:"Den tverrdimensjonale døråpneren"},
  melee_18: {id:'melee_18',name:"Universets usedvanlig store pekefinger",description:"Har levert klage på tyngdekraften.",damage:530,price:15000,stat:'strength',kind:'melee',tier:18,visual:'inferno',label:"Universets usedvanlig store pekefinger"},
  melee_19: {id:'melee_19',name:"Sluttargumentet med livstidsgaranti",description:"Gjør selv stillheten litt nervøs.",damage:608,price:18000,stat:'strength',kind:'melee',tier:19,visual:'inferno',label:"Sluttargumentet med livstidsgaranti"},
  magic_4: {id:'magic_4',name:"Arkivarens lysende bokstav",description:"Godkjent av seg selv, med imponerende stempel.",damage:30,price:400,stat:'magic',kind:'magic',tier:4,visual:'cosmic',label:"Arkivarens lysende bokstav"},
  magic_5: {id:'magic_5',name:"Myrrådets høytflygende soppscepter",description:"Krever egen stol ved høytidelige anledninger.",damage:40,price:650,stat:'magic',kind:'magic',tier:5,visual:'cosmic',label:"Myrrådets høytflygende soppscepter"},
  magic_6: {id:'magic_6',name:"Frostministerens kuldekvist",description:"Har levert klage på tyngdekraften.",damage:52,price:950,stat:'magic',kind:'magic',tier:6,visual:'cosmic',label:"Frostministerens kuldekvist"},
  magic_7: {id:'magic_7',name:"Tidevannets administrative trefork",description:"Gjør selv stillheten litt nervøs.",damage:68,price:1400,stat:'magic',kind:'magic',tier:7,visual:'cosmic',label:"Tidevannets administrative trefork"},
  magic_8: {id:'magic_8',name:"Tordensjefens lynantenne",description:"Godkjent av seg selv, med imponerende stempel.",damage:86,price:1900,stat:'magic',kind:'magic',tier:8,visual:'cosmic',label:"Tordensjefens lynantenne"},
  magic_9: {id:'magic_9',name:"Krystallrådets ufeilbarlige prisme",description:"Krever egen stol ved høytidelige anledninger.",damage:108,price:2500,stat:'magic',kind:'magic',tier:9,visual:'cosmic',label:"Krystallrådets ufeilbarlige prisme"},
  magic_10: {id:'magic_10',name:"Vulkandirektørens glødestav",description:"Har levert klage på tyngdekraften.",damage:134,price:3200,stat:'magic',kind:'magic',tier:10,visual:'cosmic',label:"Vulkandirektørens glødestav"},
  magic_11: {id:'magic_11',name:"Solsekretærens overtidssol",description:"Gjør selv stillheten litt nervøs.",damage:164,price:4000,stat:'magic',kind:'magic',tier:11,visual:'cosmic',label:"Solsekretærens overtidssol"},
  magic_12: {id:'magic_12',name:"Månens autoriserte dirigentpinne",description:"Godkjent av seg selv, med imponerende stempel.",damage:200,price:5000,stat:'magic',kind:'magic',tier:12,visual:'cosmic',label:"Månens autoriserte dirigentpinne"},
  magic_13: {id:'magic_13',name:"Stjernerevisorens talltårn",description:"Krever egen stol ved høytidelige anledninger.",damage:240,price:6200,stat:'magic',kind:'magic',tier:13,visual:'cosmic',label:"Stjernerevisorens talltårn"},
  magic_14: {id:'magic_14',name:"Kometkanslerens svansepenn",description:"Har levert klage på tyngdekraften.",damage:286,price:7600,stat:'magic',kind:'magic',tier:14,visual:'cosmic',label:"Kometkanslerens svansepenn"},
  magic_15: {id:'magic_15',name:"Galakseinspektørens lommelykt",description:"Gjør selv stillheten litt nervøs.",damage:338,price:9200,stat:'magic',kind:'magic',tier:15,visual:'cosmic',label:"Galakseinspektørens lommelykt"},
  magic_16: {id:'magic_16',name:"Den interstellare paragrafstaven",description:"Godkjent av seg selv, med imponerende stempel.",damage:396,price:11000,stat:'magic',kind:'magic',tier:16,visual:'cosmic',label:"Den interstellare paragrafstaven"},
  magic_17: {id:'magic_17',name:"Virkelighetens gigantiske viskelær",description:"Krever egen stol ved høytidelige anledninger.",damage:460,price:13000,stat:'magic',kind:'magic',tier:17,visual:'cosmic',label:"Virkelighetens gigantiske viskelær"},
  magic_18: {id:'magic_18',name:"Uendelighetens altfor store nøkkel",description:"Har levert klage på tyngdekraften.",damage:530,price:15000,stat:'magic',kind:'magic',tier:18,visual:'cosmic',label:"Uendelighetens altfor store nøkkel"},
  magic_19: {id:'magic_19',name:"Den endelige kvisten over alle kvister",description:"Gjør selv stillheten litt nervøs.",damage:608,price:18000,stat:'magic',kind:'magic',tier:19,visual:'cosmic',label:"Den endelige kvisten over alle kvister"}
} as const;
export type WeaponId = keyof typeof WEAPONS;
export type StarterId = 'stick' | 'wand';
export const isWeaponId = (id: unknown): id is WeaponId => typeof id === 'string' && Object.hasOwn(WEAPONS, id);
export const isStarterId = (id: unknown): id is StarterId => id === 'stick' || id === 'wand';
export const CATALOG = Object.values(WEAPONS);
