import { useState } from 'react';
import { damageFor, type Hero } from './progression';
import { CATALOG, type WeaponId, WEAPONS } from './weapons';
import { game, type ShopContext } from './store';
import { nextWeapon, type Purchase, type WeaponKind } from './shop';
import type { StorageStatus } from './storage';
import { Modal, StorageNotice } from './HeroProgress';
import { SceneView } from './SceneView';
import { WeaponIllustration } from './WeaponIllustration';
import { SoundButton } from './SoundButton';
import { SavingGoal } from './SavingGoal';

function WeaponCard({ hero, id, context, ready }: { hero: Hero; id: WeaponId; context:ShopContext; ready:boolean }) {
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
      <button className="primary" disabled={active || (!owned && (missing > 0 || !ready))} onClick={() => owned ? game.equip(id,context) : game.buy(id,context)}>
        {active ? 'Utstyrt' : owned ? 'Utstyr' : `Kjøp og utstyr · ${weapon.price} gull`}
      </button>
      {!owned && <><p className="missing-gold">{missing ? `Mangler ${missing} gull` : 'Du har råd!'}</p><button className="goal-choice" aria-pressed={isGoal} onClick={() => game.chooseGoal(isGoal ? null : id,context)}>{isGoal ? '✓ Sparemål valgt · fjern' : 'Spar til dette'}</button></>}
    </div>
  </article>;
}

export function Shop({ hero, purchase, status, reduced, context, ready, revealed }: { hero: Hero; purchase: Purchase | null; status: StorageStatus; reduced: boolean; context:ShopContext; ready:boolean; revealed:WeaponId|null }) {
  const [ownedOnly, setOwnedOnly] = useState(false);
  const activeKind=WEAPONS[hero.weapon].kind;
  const kinds:WeaponKind[]=activeKind==='melee'?['melee','magic']:['magic','melee'];
  const closeCelebration=()=>game.finishShoppingCelebration(context);
  return <main className="shop-page">
    <header className="shop-header"><div className="shop-toolbar"><button className="back-button" onClick={() => game.leaveTraining()}>← Helten</button><SoundButton /></div><div className="shop-title"><h1>Våpensmeden</h1><span key={hero.gold} className="gold-count changed-value" aria-live="polite">{hero.gold} gull</span></div><p>Nye våpen. Enda større ambisjoner.</p></header>
    <div className="shop-content">
      <StorageNotice status={status} />
      <SavingGoal hero={hero} />
      <div className="shop-filters" role="group" aria-label="Butikkvisning"><button aria-pressed={!ownedOnly} onClick={()=>setOwnedOnly(false)}>Neste våpen</button><button aria-pressed={ownedOnly} onClick={()=>setOwnedOnly(true)}>Mitt utstyr ({hero.ownedWeapons.length})</button></div>
      {!ownedOnly&&revealed&&<p className="offer-reveal" role="status">Neste i serien: {WEAPONS[revealed].name}</p>}
      <div className="shop-grid">{ownedOnly ? CATALOG.filter(w=>hero.ownedWeapons.includes(w.id)).map(w=><WeaponCard key={w.id} hero={hero} id={w.id} context={context} ready={ready}/>) : kinds.map(kind=>{const id=nextWeapon(hero,kind);return id?<WeaponCard key={id} hero={hero} id={id} context={context} ready={ready}/>:<section className="series-complete" key={kind}><h2>{kind==='melee'?'Nærkamp':'Magi'}</h2><p>Alle nåværende oppgraderinger i serien er kjøpt.</p><span aria-hidden="true">✦</span></section>;})}</div>
    </div>
    {purchase && <Modal title="Nytt våpen!" onClose={closeCelebration}>
      <div className="purchase-portrait"><SceneView appearance={hero.appearance} color={hero.color} weapon={hero.weapon} reduced={reduced} /></div>
      <h3 className="purchase-name">{WEAPONS[purchase.weapon].name}</h3>
      <p className="purchase-damage">{purchase.previousDamage} → <strong>{purchase.newDamage}</strong> skade</p>
      {purchase.newDamage < purchase.previousDamage && <p className="purchase-note">Lavere skade med dine nåværende egenskaper.</p>}
      <StorageNotice status={status} />
      {!hero.savingGoal && <p className="purchase-note">Velg gjerne et nytt sparemål i butikken.</p>}
      <button className="primary" onClick={() => game.startTraining()}>Prøv i trening</button>
      <button className="secondary" onClick={closeCelebration}>Fortsett å handle</button>
    </Modal>}
  </main>;
}
