import {dummyFor,dummyBonus,TRAINING_RULES,type Training} from './training';
export function TrainingHud({training,reward}:{training:Training;reward:{count:number;bonus:number}|null}){
 const d=dummyFor(training);
 return <div className={`training-hud ${d.exam?'dummy-exam':''} ${training.hp<=d.maxHp/3?'dummy-fragile':''}`}>
  <div className="dummy-rank">{d.name} · {d.exam?'EKSAMEN':`Dukke ${training.position+1} av ${TRAINING_RULES.perRank}`}</div>
  <div className="dummy-heading"><b className="dummy-name" title={d.title}>{d.title}</b>{reward&&reward.count>0?<strong className="training-bonus" role="status">{reward.count===1?'Dukke':`${reward.count} dukker`} knust! +{reward.bonus} XP</strong>:<strong className="dummy-prize">Knus dukken: +{dummyBonus(training)} XP</strong>}</div>
  <progress aria-label="Treningsdukkens liv" max={d.maxHp} value={training.hp}/>
  <span className="dummy-health">{training.hp}/{d.maxHp} liv</span>
 </div>;
}
