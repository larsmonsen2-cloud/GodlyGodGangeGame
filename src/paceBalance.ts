import {ENEMIES,awardVictory} from './enemies';
import {estimateFight} from './balance';
import {damageFor,grantXp,newHero,spendPoint,type Hero} from './progression';
import {nextWeapon,buyWeapon,type WeaponKind} from './shop';
import {trainHit} from './training';
import {CONFIG} from './config';

/** Reproducible ideal play: correct answers, automatic point allocation and affordable purchases.
 * Training is the only XP source. Enemy values never depend on this model or the live hero.
 */
export function simulateJourney(answerSeconds:number,kind:WeaponKind='melee',healthPointsPerAttack=2){
 let hero=newHero('Balanse','sky',kind==='melee'?'stick':'wand');
 let trainingStops=0,trainingAnswers=0,longestRun=0,run=0,purchases=0;
 const rows=[];
 for(const enemy of ENEMIES){
  let offer=nextWeapon(hero,kind);
  while(offer){const purchase=buyWeapon(hero,offer);if(!purchase)break;hero=purchase.hero;purchases++;offer=nextWeapon(hero,kind);}
  let answers=0;
  while(!estimateFight(enemy,damageFor(hero),hero.maxHealth,answerSeconds).won){
   if(answers>=100_000)throw Error(`Unreachable fight ${enemy.number}`);
   answers++;
   const hit=damageFor(hero)*(answers%CONFIG.special.threshold===0?CONFIG.special.multiplier:1);
   const trained=trainHit(hero.training,hit);
   hero=grantXp({...hero,training:trained.training},CONFIG.progression.xpPerAnswer+trained.bonus);
   while(hero.points){
    const allocated=hero.level-1-hero.points;
    hero=spendPoint(hero,allocated%(healthPointsPerAttack+1)===0?(kind==='melee'?'strength':'magic'):'maxHealth');
   }
  }
  if(answers){trainingStops++;longestRun=Math.max(longestRun,run);run=0;}
  run++;trainingAnswers+=answers;
  const fight=estimateFight(enemy,damageFor(hero),hero.maxHealth,answerSeconds);
  rows.push({number:enemy.number,name:enemy.name,trainingAnswers:answers,level:hero.level,weapon:hero.weapon,damage:damageFor(hero),health:hero.maxHealth,fightAnswers:fight.answers,remainingHealth:hero.maxHealth-fight.incoming*enemy.damage});
  hero=awardVictory(hero,enemy.id).hero as Hero;
 }
 return {answerSeconds,kind,healthPointsPerAttack,trainingStops,trainingAnswers,longestRun:Math.max(longestRun,run),purchases,hero,rows};
}
