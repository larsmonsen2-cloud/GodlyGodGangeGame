import { CONFIG } from './config';
import type { Hero } from './progression';
export type EnemyVisual = { kind: 'slime' | 'wood' | 'armor' | 'flame' | 'shadow' | 'mage' | 'royal'; color: string; accent: string; size: number; crown?: boolean };
const define = <T extends string>(id:T, number:number, name:string, subtitle:string, description:string, health:number, damage:number, gold:number, bonus:number, visual:EnemyVisual) => ({id,number,name,subtitle,description,health,damage,gold,bonus,boss:bonus>0,interval:5000,visual});
export const ENEMIES = [
 define('goran',1,'Gøran','Den lettere fornærmede slimklumpen',CONFIG.enemy.description,80,6,25,0,{kind:'slime',color:'#a8bd68',accent:'#e2d694',size:1}),
 define('birger',2,'Birger','Pinnenes selvutnevnte konge','Har kronet seg selv. Pinner flest var ikke invitert.',110,7,36,0,{kind:'wood',color:'#94754c',accent:'#9abb74',size:.9}),
 define('knirk',3,'Knirk','Ridderen av den vaklende rustning','Du hører ham lenge før han vet hvor han skal.',145,8,50,0,{kind:'armor',color:'#8ba4aa',accent:'#cfb16b',size:1}),
 define('fres',4,'Fru Fres','Autorisert bråkmaker','Har fått skriftlig advarsel fra brannalarmen.',180,10,65,0,{kind:'flame',color:'#e68a46',accent:'#f9d376',size:1}),
 define('buldre',5,'Baron Buldre','Den uforholdsmessig viktige','Krever applaus før, under og etter kampen.',250,13,95,50,{kind:'royal',color:'#b57595',accent:'#efca75',size:1.23,crown:true}),
 define('snerk',6,'Snerk','Den nesten usynlige','Gjemmer seg helst bak sin egen kappe.',230,12,100,0,{kind:'shadow',color:'#6c718e',accent:'#b0ded2',size:.95}),
 define('kjepphoy',7,'Kaptein Kjepphøy','Mer pynt enn plan','Medaljene er kjøpt. Kvitteringen er hemmelig.',280,14,115,0,{kind:'armor',color:'#688bb3',accent:'#f1cc70',size:1.08,crown:true}),
 define('gneldra',8,'Gneldra','Den evig misfornøyde','Selv tryllestaven får dårlige tilbakemeldinger.',330,16,140,0,{kind:'mage',color:'#ae7bb5',accent:'#cae49b',size:1.07}),
 define('skrammel',9,'Sir Skrammel','Katastrofens nestkommanderende','Har rustning til alle anledninger. Også bading.',350,15,170,0,{kind:'armor',color:'#667a87',accent:'#dd9770',size:1.2}),
 define('klask',10,'Kong Klask','Hans Overveldende Majestet','Tronen er stor. Selvtilliten trengte et eget rom.',400,16,230,125,{kind:'royal',color:'#a25968',accent:'#f3d16f',size:1.35,crown:true}),
] as const;
export type Enemy = typeof ENEMIES[number];
export type EnemyId = Enemy['id'];
export const isEnemyId = (id:unknown): id is EnemyId => typeof id==='string' && ENEMIES.some(e=>e.id===id);
export const enemyById = (id:EnemyId):Enemy => ENEMIES.find(e=>e.id===id)!;
export const isUnlocked = (hero:Hero,id:unknown):id is EnemyId => isEnemyId(id) && (enemyById(id).number===1 || hero.defeatedEnemies.includes(ENEMIES[enemyById(id).number-2].id));
export const nextChallenge = (hero:Hero) => ENEMIES.find(e=>!hero.defeatedEnemies.includes(e.id));
export type ArenaReward = { regular:number; bonus:number; unlocked:EnemyId|null; completed:boolean };
export function awardVictory(hero:Hero,id:EnemyId): {hero:Hero;reward:ArenaReward} {
 const enemy=enemyById(id), first=!hero.defeatedEnemies.includes(id);
 const bonus=hero.claimedBossBonuses.includes(id)?0:enemy.bonus;
 const defeatedEnemies=first?[...hero.defeatedEnemies,id]:hero.defeatedEnemies;
 return {hero:{...hero,gold:hero.gold+enemy.gold+bonus,defeatedEnemies,claimedBossBonuses:bonus?[...hero.claimedBossBonuses,id]:hero.claimedBossBonuses},reward:{regular:enemy.gold,bonus,unlocked:first?(ENEMIES[enemy.number]?.id??null):null,completed:enemy.number===10 && defeatedEnemies.length===10}};
}
