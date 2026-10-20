import { useState } from 'react';
import { damageFor, type Hero } from './progression';
import { CATALOG, type WeaponId, WEAPONS } from './weapons';
import { game } from './store';
import type { Purchase } from './shop';
import type { StorageStatus } from './storage';
import { Modal, StorageNotice } from './HeroProgress';
import { SceneView } from './SceneView';
import { WeaponIllustration } from './WeaponIllustration';
import { SoundButton } from './SoundButton';
import { SavingGoal } from './SavingGoal';

function WeaponCard({ hero, id }: { hero: Hero; id: WeaponId }) {
  const weapon = WEAPONS[id];
  const owned = hero.ownedWeapons.includes(id);
  const active = hero.weapon === id;
  const missing = Math.max(0, weapon.price - hero.gold);
  const total = damageFor(hero, id);
  const difference = total - damageFor(hero);
  const isGoal = hero.savingGoal === id;
  return <article className={`shop-card ${active ? 'equipped-card' : ''}`} aria-label={weapon.name}>
    <div className="shop-card-top"><div className="weapon-display"><WeaponIllustration weapon={id} /><span>{active ? '✓ Utstyrt' : owned ? '✓ Eid' : `Trinn ${weapon.tier}`}</span></div>
      <div><span className="shop-kind">{weapon.kind === 'melee' ? 'NÆRKAMP · STYRKE' : 'MAGI · MAGI'}</span><h2>{weapon.name}</h2><p className="weapon-joke">{weapon.description}</p></div>
    </div>
    <div className="shop-damage"><span>{weapon.stat === 'strength' ? 'Styrke' : 'Magi'} {hero[weapon.stat]} + våpen {weapon.damage}</span><strong>= {total} skade</strong></div>
    <p className={`damage-difference ${difference < 0 ? 'lower-damage' : ''}`}>{active ? 'Våpenet du bruker nå' : difference === 0 ? '= Samme skade som våpenet du bruker' : `${difference > 0 ? '+' : '−'}${Math.abs(difference)} skade sammenlignet med våpenet du bruker`}</p>
    <div className="shop-card-actions">
      <button className="primary" disabled={active || (!owned && missing > 0)} onClick={() => owned ? game.equip(id) : game.buy(id)}>
        {active ? 'Utstyrt' : owned ? 'Utstyr' : `Kjøp og utstyr · ${weapon.price} gull`}
      </button>
      {!owned && <><p className="missing-gold">{missing ? `Mangler ${missing} gull` : 'Du har råd!'}</p><button className="goal-choice" aria-pressed={isGoal} onClick={() => game.chooseGoal(isGoal ? null : id)}>{isGoal ? '✓ Sparemål valgt · fjern' : 'Spar til dette'}</button></>}
    </div>
  </article>;
}

export function Shop({ hero, purchase, status, reduced }: { hero: Hero; purchase: Purchase | null; status: StorageStatus; reduced: boolean }) {
  const [filter, setFilter] = useState<'all' | 'melee' | 'magic'>('all');
  const [ownedOnly, setOwnedOnly] = useState(false);
  const visible = CATALOG.filter(weapon => (weapon.tier > 0 || hero.ownedWeapons.includes(weapon.id)) &&
    (filter === 'all' || weapon.kind === filter) && (!ownedOnly || hero.ownedWeapons.includes(weapon.id)));
  return <main className="shop-page">
    <header className="shop-header"><div className="shop-toolbar"><button className="back-button" onClick={() => game.leaveTraining()}>← Helten</button><SoundButton /></div><div className="shop-title"><h1>Våpensmeden</h1><span key={hero.gold} className="gold-count changed-value" aria-live="polite">{hero.gold} gull</span></div><p>Nye våpen. Enda større ambisjoner.</p></header>
    <div className="shop-content">
      <StorageNotice status={status} />
      <SavingGoal hero={hero} />
      <div className="shop-filters" role="group" aria-label="Våpentype">{([['all', 'Alle'], ['melee', 'Nærkamp'], ['magic', 'Magi']] as const).map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
      <label className="owned-filter"><input type="checkbox" checked={ownedOnly} onChange={event => setOwnedOnly(event.target.checked)} /> Bare mine våpen ({hero.ownedWeapons.length})</label>
      <div className="shop-grid">{visible.map(weapon => <WeaponCard key={weapon.id} hero={hero} id={weapon.id} />)}</div>
      {!visible.length && <p className="empty-shop">Du eier ingen våpen i denne kategorien ennå.</p>}
    </div>
    {purchase && <Modal title="Nytt våpen!" onClose={() => game.finishShoppingCelebration()}>
      <div className="purchase-portrait"><SceneView appearance={hero.appearance} color={hero.color} weapon={hero.weapon} reduced={reduced} /></div>
      <h3 className="purchase-name">{WEAPONS[purchase.weapon].name}</h3>
      <p className="purchase-damage">{purchase.previousDamage} → <strong>{purchase.newDamage}</strong> skade</p>
      {purchase.newDamage < purchase.previousDamage && <p className="purchase-note">Lavere skade med dine nåværende egenskaper.</p>}
      <StorageNotice status={status} />
      {!hero.savingGoal && <p className="purchase-note">Velg gjerne et nytt sparemål i butikken.</p>}
      <button className="primary" onClick={() => game.startTraining()}>Prøv i trening</button>
      <button className="secondary" onClick={() => game.finishShoppingCelebration()}>Fortsett å handle</button>
    </Modal>}
  </main>;
}
