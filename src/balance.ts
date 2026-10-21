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
export {journeyBalanceMarkdown as balanceMarkdown} from './journeyBalance';
