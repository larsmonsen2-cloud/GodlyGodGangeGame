import { CONFIG } from './config';

export const WEAPONS = {
  stick: { id: 'stick', ...CONFIG.weapon, price: 0, stat: 'strength', kind: 'melee', tier: 0, visual: 'stick', label: 'Pinne · nærkamp' },
  wand: { id: 'wand', ...CONFIG.magicWeapon, price: 0, stat: 'magic', kind: 'magic', tier: 0, visual: 'wand', label: 'Kvist · magi' },
  iron_sword: { id: 'iron_sword', name: 'Det urimelig selvsikre jernsverdet', description: 'Har vunnet alle diskusjoner med smørkniver.', ...CONFIG.shop.tier1, stat: 'strength', kind: 'melee', tier: 1, visual: 'iron', label: 'Jernsverd · nærkamp' },
  great_cleaver: { id: 'great_cleaver', name: 'Den fullstendig unødvendige kjempekløyveren', description: 'For deg som mener at presisjon er en unødvendig begrensning.', ...CONFIG.shop.tier2, stat: 'strength', kind: 'melee', tier: 2, visual: 'cleaver', label: 'Kjempekløyver · nærkamp' },
  inferno_blade: { id: 'inferno_blade', name: 'Den katastrofalt overlegne infernoklingen', description: 'Smidd i en døende stjerne. Egner seg også til toast.', ...CONFIG.shop.tier3, stat: 'strength', kind: 'melee', tier: 3, visual: 'inferno', label: 'Infernoklinge · nærkamp' },
  apprentice_staff: { id: 'apprentice_staff', name: 'Den overraskende kompetente lærlingstaven', description: 'Har lest nesten hele bruksanvisningen.', ...CONFIG.shop.tier1, stat: 'magic', kind: 'magic', tier: 1, visual: 'apprentice', label: 'Lærlingstav · magi' },
  storm_staff: { id: 'storm_staff', name: 'Den høyst selvhøytidelige stormstaven', description: 'Krever å bli tiltalt som Deres Elektriske Høyhet.', ...CONFIG.shop.tier2, stat: 'magic', kind: 'magic', tier: 2, visual: 'storm', label: 'Stormstav · magi' },
  cosmic_staff: { id: 'cosmic_staff', name: 'Den ultimate kosmiske katastrofekvisten', description: 'Universet har bedt den om å roe seg ned.', ...CONFIG.shop.tier3, stat: 'magic', kind: 'magic', tier: 3, visual: 'cosmic', label: 'Katastrofekvist · magi' },
} as const;
export type WeaponId = keyof typeof WEAPONS;
export type StarterId = 'stick' | 'wand';
export const isWeaponId = (id: unknown): id is WeaponId => typeof id === 'string' && Object.hasOwn(WEAPONS, id);
export const isStarterId = (id: unknown): id is StarterId => id === 'stick' || id === 'wand';
export const CATALOG = Object.values(WEAPONS);
