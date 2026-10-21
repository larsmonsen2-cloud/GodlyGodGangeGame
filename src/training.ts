export const TRAINING = [
 {name:'Sekkeknuser',dummy:'En sekk med dårlig selvfølelse',exam:'Oversekken med dobbelt knute',health:64,color:0xc6a46f},
 {name:'Slagpåleinspektør',dummy:'Den kommunalt godkjente slagpålen',exam:'Ordfører Påle med stempelrett',health:128,color:0xb89971},
 {name:'Kryssfinerridder',dummy:'Ridder Kvist av Kryssfiner',exam:'Sir Spon, garantisak nummer én',health:256,color:0x99b783},
 {name:'Jernbanker',dummy:'Den overraskende hevngjerrige jerndukken',exam:'Jernsjefen uten angrerett',health:512,color:0x8fa8b6},
 {name:'Kongelig knuser',dummy:'Hans Uknuselige Majestet, modell 4',exam:'Keiser Knekkfri den Optimistiske',health:768,color:0xcaa457},
 {name:'Krystallmester',dummy:'Den fornærmede krystallkritikeren',exam:'Diamantdirektøren med glasskjeve',health:1024,color:0x94caca},
 {name:'Vulkanveteran',dummy:'Den brannsikre katastrofepålen',exam:'General Glød med røykvarsler',health:1536,color:0xe9a274},
 {name:'Stjerneknuser',dummy:'Den kosmiske katastrofedukken med utvidet garanti',exam:'Supernovaens reklamasjonssjef',health:2048,color:0xae9cda},
 {name:'Virkelighetsrevisor',dummy:'Den tverrdimensjonale støvsamleren',exam:'Paragraf Null, universets kontrollør',health:3072,color:0xc695b7},
 {name:'Evig garantibrudd',dummy:'Den evig gjenoppbygde mestermodellen',exam:'Garantimesteren som aldri lærer',health:4096,color:0xd5bd79},
] as const;
export const TRAINING_RULES={perRank:10,examMultiplier:2,bonusDivisor:8};
export type Training={rank:number;position:number;hp:number;broken:number;bestHit:number;medals:number[]};
export const freshTraining=():Training=>({rank:0,position:0,hp:TRAINING[0].health,broken:0,bestHit:0,medals:[]});
export const dummyFor=(t:Training)=>{const r=TRAINING[t.rank],exam=t.position===TRAINING_RULES.perRank-1;return {...r,exam,title:exam?r.exam:r.dummy,maxHp:r.health*(exam?TRAINING_RULES.examMultiplier:1)};};
export const dummyBonus=(t:Training)=>dummyFor(t).maxHp/TRAINING_RULES.bonusDivisor;
export function validTraining(value:unknown):value is Training {
 const t=value as Training;
 return !!t&&[t.rank,t.position,t.hp,t.broken,t.bestHit].every(n=>Number.isSafeInteger(n)&&n>=0)&&t.rank<TRAINING.length&&t.position<TRAINING_RULES.perRank&&t.hp>0&&t.hp<=dummyFor(t).maxHp&&Array.isArray(t.medals)&&new Set(t.medals).size===t.medals.length&&t.medals.every(n=>Number.isInteger(n)&&n>=0&&n<TRAINING.length);
}
// At most 100 individual transitions, then whole repeat cycles in constant time.
export function trainHit(previous:Training,damage:number) {
 const t={...previous,medals:[...previous.medals]};let left=damage,bonus=0,count=0;
 if(!Number.isSafeInteger(damage)||damage<0)return {training:t,bonus,count};
 t.bestHit=Math.max(t.bestHit,damage);
 while(left>=t.hp){
  left-=t.hp;bonus+=dummyBonus(t);count++;t.position++;
  if(t.position===TRAINING_RULES.perRank){if(!t.medals.includes(t.rank))t.medals.push(t.rank);t.rank=Math.min(TRAINING.length-1,t.rank+1);t.position=0;}
  t.hp=dummyFor(t).maxHp;
  if(t.rank===TRAINING.length-1&&t.position===0){
   const cycle=TRAINING[t.rank].health*(TRAINING_RULES.perRank-1+TRAINING_RULES.examMultiplier),cycles=Math.floor(left/cycle);
   if(cycles){left-=cycles*cycle;bonus+=cycles*cycle/TRAINING_RULES.bonusDivisor;count+=cycles*TRAINING_RULES.perRank;if(!t.medals.includes(t.rank))t.medals.push(t.rank);}
  }
 }
 t.hp-=left;t.broken+=count;
 return {training:t,bonus,count};
}
