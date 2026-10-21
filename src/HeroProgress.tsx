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

export function Progress({ hero, training = false, status = 'saved' }: { hero: Hero; training?: boolean; status?: StorageStatus }) {
  const remaining = answersToLevel(hero);
  return <div className={`progress-summary ${training ? 'training-progress' : ''}`}>
    <div><b>Nivå {hero.level}</b><span>{hero.xp}/{xpNeeded(hero.level)} XP</span></div>
    <progress value={hero.xp} max={xpNeeded(hero.level)} aria-label="XP til neste nivå" />
    {training && status !== 'saved' ? <StorageNotice status={status} /> : <p>{remaining} {remaining === 1 ? 'riktig svar' : 'riktige svar'} til nivå {hero.level + 1}</p>}
  </div>;
}

const attributes: { key: Attribute; label: string }[] = [
  { key: 'strength', label: 'Styrke' },
  { key: 'magic', label: 'Magi' },
  { key: 'maxHealth', label: 'Helse' },
];

export function HeroProgress({ hero, status, reputationNotice }: { hero: Hero; status: StorageStatus; reputationNotice: string | null }) {
  const [choosing, setChoosing] = useState(false);
  const weapon = WEAPONS[hero.weapon];
  const chronicle = heroChronicle(hero);
  return <>
    <div className="hero-heading"><h2 className="hero-name-heading">{hero.name}</h2><span key={hero.gold} className="gold-count changed-value">{hero.gold} gull</span></div>
    <p className="hero-title">{chronicle.title}</p>
    <p className="hero-chronicle">{chronicle.story}</p>
    {reputationNotice && !choosing && <div className="reputation-notice" role="status"><strong>Ryktet ditt har vokst!</strong><button type="button" onClick={()=>game.dismissReputation()}>Fortsett</button></div>}
    <Progress hero={hero} />
    <dl className="hero-stats"><div><dt>Styrke</dt><dd>{hero.strength}</dd></div><div><dt>Magi</dt><dd>{hero.magic}</dd></div><div><dt>Maks liv</dt><dd>{hero.maxHealth}</dd></div></dl>
    <button className="points-button" type="button" disabled={!hero.points} onClick={() => setChoosing(true)}>{hero.points ? `Fordel ${hero.points} poeng` : '0 ubrukte poeng'}<span aria-hidden="true">{hero.points ? '+' : '✦'}</span></button>
    <div className="equipped-weapon"><h3>{weapon.name}</h3><p>{weapon.description}</p></div>
    <div key={`${hero.weapon}-${damageFor(hero)}`} className="damage-summary changed-value"><span>{weapon.stat === 'strength' ? 'Styrke' : 'Magi'} {hero[weapon.stat]} + våpen {weapon.damage}</span><b>{damageFor(hero)} skade</b></div>
    <SavingGoal hero={hero} actionable compact />
    <StorageNotice status={status} />
    <div className="hero-actions"><button className="primary" type="button" onClick={() => game.startTraining()}><span>Tren</span><span aria-hidden="true">→</span></button><button className="primary arena-button" type="button" onClick={() => game.openArena()}><span>Arena</span><span aria-hidden="true">⚔</span></button><button className="primary shop-button" type="button" onClick={() => game.openShop()}><span>Butikk</span><span aria-hidden="true">◇</span></button></div>
    <button className="edit-appearance" type="button" onClick={()=>game.openAppearance()}>Endre utseende</button>
    <button className="edit-appearance" type="button" onClick={()=>game.openHeroes()}>Bytt helt</button>
    {choosing && <Modal title="Gjør helten sterkere" onClose={() => setChoosing(false)}>
      <p className="modal-description" role="status">{hero.points} ubrukte poeng · Hvert valg koster 1 poeng.</p>
      <div className="attribute-choices">{attributes.map(({ key, label }) => <button key={key} type="button" disabled={!hero.points} onClick={() => game.spend(key)}>
        <b>{label}</b><span aria-hidden="true">+</span>
      </button>)}</div>
      <button type="button" className="primary" onClick={() => setChoosing(false)}>{hero.points ? 'Velg senere' : 'Ferdig'}</button>
    </Modal>}
  </>;
}
