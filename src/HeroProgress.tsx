import {ORIGINS,GOALS} from './background';
import {TRAINING} from './training';
import { LevelEmblem } from './LevelEmblem';
import { heroChronicle } from './reputation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { answersToLevel, damageFor, WEAPONS, xpNeeded, type Attribute, type Hero } from './progression';
import { SavingGoal } from './SavingGoal';
import { game } from './store';
import type { StorageStatus } from './storage';

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return <dialog ref={dialog} className="game-modal" aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }}>
    <h2>{title}</h2>{children}
  </dialog>;
}

export function StorageNotice({ status }: { status: StorageStatus }) {
  if (status === 'saved') return null;
  return <p className="storage-notice" role="status">{status === 'session'
    ? 'Kan ikke lagre. Fremgangen beholdes bare i denne økten.'
    : 'Lagringen kunne ikke åpnes trygt. Originalen er beholdt. Prøv igjen.'}</p>;
}

export function Progress({ hero, training = false, status = 'saved', emblem = false, celebrate = false }: { hero: Hero; training?: boolean; status?: StorageStatus; emblem?:boolean; celebrate?:boolean }) {
  const remaining = answersToLevel(hero);
  return <div className={emblem?'emblem-progress':undefined}>{emblem&&<LevelEmblem level={hero.level} celebrate={celebrate}/>}<div className={`progress-summary ${training ? 'training-progress' : ''} ${celebrate?'xp-celebrating':''}`}>
    <div>{!emblem&&<b role={training?'status':undefined}>{training&&celebrate?`Nivå ${hero.level} ↑ Poeng klare`:`Nivå ${hero.level}`}</b>}<span>{hero.xp}/{xpNeeded(hero.level)} XP</span></div>
    <progress value={hero.xp} max={xpNeeded(hero.level)} aria-label="XP til neste nivå" />
    {training && status !== 'saved' ? <StorageNotice status={status} /> : <p>Høyst {remaining} {remaining === 1 ? 'riktig svar' : 'riktige svar'} til nivå {hero.level + 1}</p>}
  </div></div>;
}

const attributes: { key: Attribute; label: string }[] = [
  { key: 'strength', label: 'Styrke' },
  { key: 'magic', label: 'Magi' },
  { key: 'maxHealth', label: 'Maks liv' },
];

export function HeroProgress({ hero, status, reputationNotice, levelCelebration }: { hero: Hero; status: StorageStatus; reputationNotice: string | null; levelCelebration:number|null }) {
  const [spent,setSpent]=useState('');
  const weapon = WEAPONS[hero.weapon];
  const chronicle = heroChronicle(hero);
  return <>
    <div className="hero-heading"><h2 className="hero-name-heading">{hero.name}</h2><span key={hero.gold} className="gold-count changed-value">{hero.gold} gull</span></div>
    <p className="hero-title">{chronicle.title}</p>
    <p className="hero-chronicle">{chronicle.story}</p>
    <details className="personal-history"><summary>Min historie</summary><p><b>Opprinnelse:</b> {ORIGINS.find(o=>o.id===hero.background.origin)?.name??'Ikke valgt ennå.'}</p><p><b>Stort mål:</b> {GOALS.find(g=>g.id===hero.background.goal)?.name??'Ikke valgt ennå.'}</p><button type="button" onClick={()=>game.openAppearance()}>Endre historie og utseende</button></details>
    {reputationNotice && <div className="reputation-notice" role="status"><strong>Ryktet ditt har vokst!</strong><button type="button" onClick={()=>game.dismissReputation()}>Fortsett</button></div>}
    <Progress hero={hero} emblem celebrate={levelCelebration===hero.level} />
    <dl className="hero-stats">{attributes.map(({key,label}) => <div key={key}>
      <dt>{label}</dt><dd className="stat-with-upgrade"><span>{hero[key]}</span>{hero.points > 0 && <button className="stat-plus" type="button" aria-label={`Øk ${label.toLowerCase()} (1 poeng)`} onClick={() => {
        game.spend(key);
        setSpent(`${label} økte til ${game.getSnapshot().hero![key]}`);
      }}><span aria-hidden="true">+</span></button>}</dd>
    </div>)}</dl>
    <p className="available-points" role="status">{hero.points} {hero.points === 1 ? 'tilgjengelig ferdighetspoeng' : 'tilgjengelige ferdighetspoeng'}</p>
    <span className="sr-only" role="status">{spent}</span>
    <div className="equipped-weapon"><h3>{weapon.name}</h3><p>{weapon.description}</p></div>
    <div key={`${hero.weapon}-${damageFor(hero)}`} className="damage-summary changed-value"><span>{weapon.stat === 'strength' ? 'Styrke' : 'Magi'} {hero[weapon.stat]} + våpen {weapon.damage}</span><b>{damageFor(hero)} skade</b></div>
    <p className="training-record">{TRAINING[hero.training.rank].name} · {hero.training.broken} dukker knust · {hero.training.medals.length} merker · {hero.claimedBossBonuses.length} bosstroféer</p>
    <SavingGoal hero={hero} actionable compact />
    <StorageNotice status={status} />
    <div className="hero-actions"><button className="primary" type="button" onClick={() => game.startTraining()}><span>Tren</span><span aria-hidden="true">→</span></button><button className="primary arena-button" type="button" onClick={() => game.openArena()}><span>Arena</span><span aria-hidden="true">⚔</span></button><button className="primary shop-button" type="button" onClick={() => game.openShop()}><span>Butikk</span><span aria-hidden="true">◇</span></button></div>
    <button className="edit-appearance" type="button" onClick={()=>game.openAppearance()}>Endre utseende og historie</button>
    <button className="edit-appearance" type="button" onClick={()=>game.openHeroes()}>Bytt helt</button>
  </>;
}

