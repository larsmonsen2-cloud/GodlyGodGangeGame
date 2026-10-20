import { CONFIG } from './config';
import type { Hero } from './progression';
export type Profile='strength'|'magic'|'health'|'balanced';
export type Feat='none'|'goran'|'buldre'|'klask';
export type Reputation={highestTier:number;seenTier:number;seenBoss:'none'|'buldre'|'klask'};
export function heroProfile(hero:Hero):Profile {
 const keys=['strength','magic','maxHealth'] as const;
 const values=keys.map(key=>(hero[key]-CONFIG.progression.initial[key])/CONFIG.progression.increase[key]);
 if(values.some(n=>!Number.isSafeInteger(n)||n<0))return 'balanced';
 const max=Math.max(...values);
 if(max===0||values.filter(n=>n===max).length!==1)return 'balanced';
 return (['strength','magic','health'] as const)[values.indexOf(max)];
}
export function heroFeat(hero:Hero):Feat {return hero.defeatedEnemies.includes('klask')?'klask':hero.defeatedEnemies.includes('buldre')?'buldre':hero.defeatedEnemies.includes('goran')?'goran':'none';}
export function earnedTier(hero:Hero) {
 const fromLevel=CONFIG.reputation.levelThresholds.filter(level=>hero.level>=level).length;
 const feat=heroFeat(hero);
 return Math.max(1,fromLevel,feat==='klask'?5:feat==='buldre'?4:hero.defeatedEnemies.length?2:1);
}
export function normalizeReputation(hero:Hero,migrating=false):Reputation {
 const old=hero.reputation;
 const validTier=(v:unknown)=>Number.isInteger(v)&&Number(v)>=1&&Number(v)<=5;
 const highestTier=Math.max(earnedTier(hero),validTier(old?.highestTier)?old.highestTier:1);
 const feat=heroFeat(hero),boss=feat==='buldre'||feat==='klask'?feat:'none';
 return {highestTier,seenTier:migrating?highestTier:validTier(old?.seenTier)?Math.min(old.seenTier,highestTier):highestTier,seenBoss:migrating?boss:['none','buldre','klask'].includes(old?.seenBoss)?old.seenBoss:boss};
}
export function pendingReputation(hero:Hero) {
 const feat=heroFeat(hero),r=hero.reputation;
 return r.highestTier>r.seenTier||(feat==='klask'&&r.seenBoss!=='klask')||(feat==='buldre'&&r.seenBoss==='none');
}
export function acknowledgeReputation(hero:Hero):Hero {
 const feat=heroFeat(hero);
 return {...hero,reputation:{...hero.reputation,seenTier:hero.reputation.highestTier,seenBoss:feat==='klask'?'klask':feat==='buldre'&&hero.reputation.seenBoss!=='klask'?'buldre':hero.reputation.seenBoss}};
}
type Entry={title:string;story:string};
export const CHRONICLES:Record<Profile,readonly Entry[]>={
 balanced:[
 {title:'Den lokale storoptimisten',story:'Har pakket mot og en foreløpig plan. Planen hevder den snart er klar.'},
 {title:'Bygdas usedvanlig allsidige håp',story:'Kan litt av hvert og snakker gjerne om alt. Har reservert den beste stolen til fremtidige medaljer.'},
 {title:'Den høyt kvalifiserte eventyrmyndigheten',story:'Har begynt å godkjenne egne bragder skriftlig. Stemplene er svært imponerende.'},
 {title:'Deres Mangfoldige Prakt',story:'Helterådet består foreløpig av helten selv. Alle forslag vedtas med stående applaus.'},
 {title:'Øverste Samordner av Universets Store Saker',story:'Universet har fått et nytt kontor for heltesaker. Åpningstiden er etter middag.'}],
 strength:[
 {title:'Den lovende døråpneren',story:'Åpner dører med stor selvtillit. Øver fortsatt på å bruke håndtaket først.'},
 {title:'Den kommunalt anerkjente knuseren',story:'Småstein flytter seg høflig til siden. Helten regner dette som en offisiell æresbevisning.'},
 {title:'Den urimelig fryktede kløyveren',story:'Treningsdukker skjelver ved heltens ankomst. Helten har bedt om at dette føres i referatet.'},
 {title:'Deres Slagkraftige Høyhet',story:'Fjellene vurderer å flytte. Helten tilbyr hjelp mot at innsatsen nevnes på et stort skilt.'},
 {title:'Øverste Myndighet over Alt som Kan Slås',story:'Kontinentene har sendt en høflig forespørsel om å få ligge i ro. Helten vurderer saken etter kveldsmaten.'}],
 magic:[
 {title:'Den håpefulle gnistansvarlige',story:'Har store planer for en ganske liten gnist. Gnisten har bedt om bedre arbeidsvilkår.'},
 {title:'Den lokale stormkalleren',story:'Skyene er innkalt til et kort møte. Foreløpig har bare en tåkemorgen svart.'},
 {title:'Erkemagikeren med utvidet fullmakt',story:'Har sendt naturlover til gjennomlesning. Tyngdekraften ønsker å beholde originalen.'},
 {title:'Deres Uforklarlige Høyhet',story:'Virkeligheten må nå bestille time. Helten tar imot mellom to svært viktige tryllepauser.'},
 {title:'Kosmisk Overforvalter av Det Fullstendig Umulige',story:'Stjernene har fått nye instrukser. Månen ber om en enklere bruksanvisning.'}],
 health:[
 {title:'Den lovende ståendefiguren',story:'Står støtt og ser ganske fornøyd ut med det. Har bestilt diplom for oppreist innsats.'},
 {title:'Den påfallende vanskelige å velte',story:'Vinden har prøvd å diskutere saken. Helten står fortsatt på sitt.'},
 {title:'Standhaftighetens selvutnevnte søyle',story:'Har blitt brukt som veimerke av forbipasserende. Helten krever nå en liten plakett.'},
 {title:'Deres Urokkelige Høyhet',story:'Jordskjelv må melde fra på forhånd. Helten har et møte med gulvet og blir stående.'},
 {title:'Universets Offisielle Faste Holdepunkt',story:'Planetene bruker helten som referansepunkt. Rommet må likevel ryddes.'}],
};
export function heroChronicle(hero:Hero) {
 const tier=Math.max(earnedTier(hero),hero.reputation.highestTier),profile=heroProfile(hero),feat=heroFeat(hero);
 const base=CHRONICLES[profile][tier-1];
 const fact=feat==='klask'?'Kong Klask er beseiret, og krønikeskriverne ber om overtidsbetaling.':feat==='buldre'?'Baron Buldre er beseiret; helten har bestilt et lengre navneskilt.':feat==='goran'?'Gøran er beseiret, og helten kaller det allerede slaget.':'';
 const suffix=feat==='klask'?'Klaskvelteren':feat==='buldre'?'Baronvelteren':feat==='goran'?'Slimets skrekk':'';
 return {tier,profile,feat,title:suffix?`${base.title}, ${suffix}`:base.title,story:fact?`${fact} ${base.story}`:base.story};
}
