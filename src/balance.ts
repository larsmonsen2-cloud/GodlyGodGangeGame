import { ENEMIES, type Enemy } from './enemies';
import { CONFIG } from './config';
export function estimateFight(enemy:Enemy,damage:number,health:number,answerSeconds:number) {
 const answers=Math.ceil(enemy.health/damage);
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
 const lines=['# Arenabalanse – fase 6','', 'Faste fiender. Alle angriper hvert 5. sekund. XP, heltestats, våpenskade og butikkpriser er uendret.','', '| Kamp | Motstander | Liv | Skade | Gull hver seier | Første bonus |','|---|---|---:|---:|---:|---:|',...ENEMIES.map(e=>`| ${e.number} | ${e.name}${e.boss?' (boss)':''} | ${e.health} | ${e.damage} | ${e.gold} | ${e.bonus} |`),'','## Deterministiske anslag','','Svarintervall er aktiv tenketid per oppgave (2, 5 eller 8 s), i tillegg til 1,2 s automatisk svarfeedback. Fiendeklokken står stille under feedback. Eksakt samtidig fiendeangrep skjer før spillerens svar. Bare riktige svar, ingen manuelle pauser, butikk-/navigasjonstid eller feil er modellert. Gull/min inkluderer sluttfeedback og vanlig belønning, men ikke engangsbonus. Tallene er beregninger, ikke spillertestet balanse.',''];
 for(const hero of BALANCE_HEROES){lines.push(`## ${hero.name}: ${hero.damage} skade, ${hero.health} liv`,hero.details,'','| Kamp | Svar | Tåler treff | 2 s: vinner / gull per min | 5 s: vinner / gull per min | 8 s: vinner / gull per min |','|---|---:|---:|---|---|---|');for(const enemy of ENEMIES){const results=[2,5,8].map(t=>estimateFight(enemy,hero.damage,hero.health,t));lines.push(`| ${enemy.number} | ${results[0].answers} | ${results[0].attacksSurvived} | ${results.map(r=>r.won?`Ja / ${r.goldPerMinute/10}`:'Nei / 0').join(' | ')} |`);}lines.push('');}
 lines.push('## Tolkning','','Første jernsverd ved uendrede 5 styrke reduserer Gøran fra 10 til 7 riktige svar (12 skade). Med ett styrkepoeng blir det 6 svar. Mot Baron Buldre gir 13 styrke + første våpen 7 totalt 20 skade / 13 svar; kløyver 13 gir 26 skade / 10 svar. Mot Kong Klask gir 25 styrke + kløyver 13 totalt 38 skade / 11 svar; infernoklinge 22 gir 47 skade / 9 svar.','', 'Kamp 6 har litt lavere liv og skade enn boss 5, men høyere vanlig gull per nødvendig svar. Belønning per fiendeliv stiger fra 25/80 til 230/400, slik at Gøran ikke blir best for sterke helter. Avrunding til hele svar kan gi mindre lokale forskjeller. Omkamper er en legitim gullkilde.','', 'Starthelten kan vinne Gøran ved 2 s aktiv tenketid, men trenger mer styrke eller helse ved 5–8 s. En langsom spiller med 14 skade og 80 liv tåler Gørans 9 treff før sjette svar ved 8 s. Sluttprofilen vinner Kong Klask ved 5 s, men trenger 230 liv (fem ekstra helsepoeng) for 8 s: 9 svar, 14 fiendetreff × 16 = 224 skade. Ingen tempoavhengig skalering eller tidsgrense.','', 'De siste kampene er satt til 350/15 og 400/16 liv/skade for at siste våpen med investerte helsepoeng skal gi en rimelig seier ved 5 s, og ekstra helsetrening skal kunne kompensere ved 8 s. Videre tuning bør følge faktisk spilling.');
 return lines.join('\n')+'\n';
}
