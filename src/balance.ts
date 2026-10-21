import { ENEMIES, type Enemy } from './enemies';
import { CONFIG } from './config';
export function estimateFight(enemy:Enemy,damage:number,health:number,answerSeconds:number) {
 let answers=0,remaining=enemy.health;
 while(remaining>0){answers++;remaining-=damage*(answers%CONFIG.special.threshold===0?CONFIG.special.multiplier:1);}
 // Time here means active thinking/input, excluding the automatic 1.2 s feedback.
 // Enemy wins exact deadline ties, as in GameStore.submit -> EnemyClock.flush.
 const attacksToLose=Math.ceil(health/enemy.damage);
 const incoming=Math.floor(answers*answerSeconds*1000/enemy.interval);
 const won=incoming<attacksToLose;
 const elapsed=won?answers*(answerSeconds+CONFIG.timing.correct/1000):attacksToLose*enemy.interval/1000+Math.min(answers-1,Math.ceil((attacksToLose*enemy.interval/1000)/answerSeconds)-1)*CONFIG.timing.correct/1000;
 return {answers,attacksSurvived:attacksToLose-1,incoming,won,seconds:Math.round(elapsed*10)/10,goldPerMinute:won?Math.round(enemy.gold/elapsed*600):0};
}
export const BALANCE_HEROES=[
 {name:'Starthelt',damage:8,health:40,details:'5 styrke + startvåpen 3; nivå 1'},
 {name:'Første kjøp',damage:14,health:60,details:'7 styrke + jernsverd 7; 1 styrke- og 2 helsepoeng; nivå 4'},
 {name:'Mellomste våpen',damage:26,health:100,details:'13 styrke + kløyver 13; 4 styrke- og 6 helsepoeng; nivå 11'},
 {name:'Sterkeste våpen',damage:47,health:180,details:'25 styrke + infernoklinge 22; 10 styrke- og 14 helsepoeng; nivå 25'},
] as const;
export function balanceMarkdown(){
 const lines=['# Arenabalanse – fase 9','', 'Faste fiender. Alle angriper hvert 5. sekund. XP, heltestats, våpenskade og butikkpriser er uendret.','', '| Kamp | Motstander | Liv | Skade | Gull hver seier | Første bonus |','|---|---|---:|---:|---:|---:|',...ENEMIES.map(e=>`| ${e.number} | ${e.name}${e.boss?' (boss)':''} | ${e.health} | ${e.damage} | ${e.gold} | ${e.bonus} |`),'','## Deterministiske anslag','','Svarintervall er aktiv tenketid per oppgave (2, 5 eller 8 s), i tillegg til 1,2 s automatisk svarfeedback. Fiendeklokken står stille under feedback. Eksakt samtidig fiendeangrep skjer før spillerens svar. Bare riktige svar: hvert femte gir dobbel skade. Ingen manuelle pauser, butikk-/navigasjonstid eller feil er modellert. Gull/min inkluderer sluttfeedback og vanlig belønning, men ikke engangsbonus. Tallene er beregninger, ikke spillertestet balanse.',''];
 for(const hero of BALANCE_HEROES){lines.push(`## ${hero.name}: ${hero.damage} skade, ${hero.health} liv`,hero.details,'','| Kamp | Svar | Tåler treff | 2 s: vinner / gull per min | 5 s: vinner / gull per min | 8 s: vinner / gull per min |','|---|---:|---:|---|---|---|');for(const enemy of ENEMIES){const results=[2,5,8].map(t=>estimateFight(enemy,hero.damage,hero.health,t));lines.push(`| ${enemy.number} | ${results[0].answers} | ${results[0].attacksSurvived} | ${results.map(r=>r.won?`Ja / ${r.goldPerMinute/10}`:'Nei / 0').join(' | ')} |`);}lines.push('');}
 lines.push('## Tolkning','','Spesialangrepet gir 20 % mer skade over en ubrutt rekke på fem svar, uten ekstra XP eller gull per seier. Feil bryter rekken. Gøran med startskade 8 krever nå 9 riktige svar i stedet for 10; første jernsverd med 12 skade krever 6 i stedet for 7. Kong Klask med 47 skade krever 8 i stedet for 9. Kortere kamper kan gi høyere gull per minutt, men ingen fiendeverdier eller belønninger er justert.','','Modellen antar perfekte svarrekker og kan derfor være optimistisk for spillere som gjør feil. Helse og våpen har fortsatt betydning ved langsom regning. Videre justering må bygge på faktisk spilling; denne fasen innfører ingen kompenserende balansering.');
 return lines.join('\n')+'\n';
}
