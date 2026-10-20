import type { Hero } from './progression';
import { WEAPONS } from './weapons';
import { game } from './store';

export function SavingGoal({ hero, actionable = false, compact = false }: { hero: Hero; actionable?: boolean; compact?: boolean }) {
  if (!hero.savingGoal) return null;
  const target = WEAPONS[hero.savingGoal];
  const missing = Math.max(0, target.price - hero.gold);
  const contents = <><span className="goal-name" title={target.name}>Neste våpen: {target.name}</span><span className="goal-amount">{hero.gold} / {target.price} gull · {missing ? `mangler ${missing}` : 'Du har råd!'}{actionable && <b aria-hidden="true"> →</b>}</span></>;
  const className = `saving-goal ${compact ? 'compact-goal' : ''} ${missing === 0 ? 'goal-ready' : ''}`;
  return actionable ? <button className={className} onClick={() => game.openShop()}>{contents}</button> : <div className={className}>{contents}</div>;
}
