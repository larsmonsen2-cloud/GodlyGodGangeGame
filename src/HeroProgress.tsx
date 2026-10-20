import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CONFIG } from './config';
import { answersToLevel, damageFor, WEAPONS, xpNeeded, type Attribute, type Hero } from './progression';
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
    : 'Den lagrede helten kunne ikke leses. Du kan lage en ny.'}</p>;
}

export function Progress({ hero, training = false, status = 'saved' }: { hero: Hero; training?: boolean; status?: StorageStatus }) {
  const remaining = answersToLevel(hero);
  return <div className={`progress-summary ${training ? 'training-progress' : ''}`}>
    <div><b>Nivå {hero.level}</b><span>{hero.xp}/{xpNeeded(hero.level)} XP</span></div>
    <progress value={hero.xp} max={xpNeeded(hero.level)} aria-label="XP til neste nivå" />
    {training && status !== 'saved' ? <StorageNotice status={status} /> : <p>{remaining} {remaining === 1 ? 'riktig svar' : 'riktige svar'} til nivå {hero.level + 1}</p>}
  </div>;
}

const attributes: { key: Attribute; label: string; effect: string }[] = [
  { key: 'strength', label: 'Styrke', effect: '+2 nærkampsskade' },
  { key: 'magic', label: 'Magi', effect: '+2 magisk skade' },
  { key: 'maxHealth', label: 'Liv', effect: '+10 maks liv' },
];

export function HeroProgress({ hero, status }: { hero: Hero; status: StorageStatus }) {
  const [choosing, setChoosing] = useState(false);
  const weapon = WEAPONS[hero.weapon];
  return <>
    <h2 className="hero-name-heading">{hero.name}</h2>
    <Progress hero={hero} />
    <dl className="hero-stats"><div><dt>Styrke</dt><dd>{hero.strength}</dd></div><div><dt>Magi</dt><dd>{hero.magic}</dd></div><div><dt>Maks liv</dt><dd>{hero.maxHealth}</dd></div></dl>
    <button className="points-button" type="button" disabled={!hero.points} onClick={() => setChoosing(true)}>{hero.points ? `Fordel ${hero.points} poeng` : '0 ubrukte poeng'}<span aria-hidden="true">{hero.points ? '+' : '✦'}</span></button>
    <div className="equipped-weapon"><h3>{weapon.name}</h3><p>{weapon.description}</p></div>
    <div className="damage-summary"><span>{weapon.stat === 'strength' ? 'Styrke' : 'Magi'} {hero[weapon.stat]} + våpen {weapon.damage}</span><b>{damageFor(hero)} skade</b></div>
    <StorageNotice status={status} />
    <button className="primary" type="button" onClick={() => game.startTraining()}><span>Tren</span><span aria-hidden="true">→</span></button>
    {choosing && <Modal title="Gjør helten sterkere" onClose={() => setChoosing(false)}>
      <p className="modal-description" role="status">{hero.points} ubrukte poeng · Hvert valg koster 1 poeng.</p>
      <div className="attribute-choices">{attributes.map(({ key, label, effect }) => <button key={key} type="button" disabled={!hero.points} onClick={() => game.spend(key)}>
        <span><b>{label}: {hero[key]} → {hero[key] + CONFIG.progression.increase[key]}</b><small>{effect}</small></span><span aria-hidden="true">+</span>
      </button>)}</div>
      <button type="button" className="primary" onClick={() => setChoosing(false)}>{hero.points ? 'Velg senere' : 'Ferdig'}</button>
    </Modal>}
  </>;
}
