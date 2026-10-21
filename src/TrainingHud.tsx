import {dummyFor,TRAINING,TRAINING_RULES,type Training} from './training';
export function TrainingHud({training,reward}:{training:Training;reward:{count:number;bonus:number}|null}){
 const d=dummyFor(training);
 return <div className="training-hud">
  <div><b>{training.rank+1}. {d.name}</b><span>{training.rank===TRAINING.length-1?'Sluttrang · gjentas':`Dukke ${training.position+1}/${TRAINING_RULES.perRank}`} · {d.exam?'Eksamen':`${TRAINING_RULES.perRank-training.position-1} til eksamen`}</span></div>
  <span className="dummy-name">{d.title}</span>
  <progress aria-label="Treningsdukkens liv" max={d.maxHp} value={training.hp}/>
  <span className="dummy-health">{training.hp}/{d.maxHp} liv</span>
  {reward&&reward.count>0&&<strong className="training-bonus" role="status">{reward.count} {reward.count===1?'dukke':'dukker'} knust! +{reward.bonus} XP</strong>}
 </div>;
}
