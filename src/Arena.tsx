import { heroChronicle } from './reputation';
import { useEffect, useState } from 'react';
import { SavingGoal } from './SavingGoal';
import { SoundButton } from './SoundButton';
import { ENEMIES, enemyById, isUnlocked, nextChallenge, type EnemyId } from './enemies';
import { EnemyIllustration } from './EnemyIllustration';
import type { Combat } from './combat';
import type { Hero } from './progression';
import { game } from './store';
import { Modal, StorageNotice } from './HeroProgress';
import { SceneView } from './SceneView';
import type { StorageStatus } from './storage';

export function ArenaSelect({hero}:{hero:Hero}) {
 const next=nextChallenge(hero);
 return <main className="arena-select"><header><div className="intro-toolbar"><button className="back-button" onClick={()=>game.leaveTraining()}>← Helten</button><SoundButton/></div><span className="eyebrow">FØRSTE ARENAREKKE</span><h1>Ti steg til tronen</h1><p>{next?`Neste utfordring: ${next.name}`:'Alle ti kampene er beseiret!'}</p><small>{hero.defeatedEnemies.length}/10 beseiret · {hero.gold} gull</small></header>
 <ol className="arena-route">{ENEMIES.map(enemy=>{
  const open=isUnlocked(hero,enemy.id),won=hero.defeatedEnemies.includes(enemy.id);
  return <li key={enemy.id} className={`${enemy.boss?'boss-card':''} ${next?.id===enemy.id?'next-enemy':''} ${!open?'locked-enemy':''}`}>
   <button disabled={!open} onClick={()=>game.selectEnemy(enemy.id)} aria-label={`Kamp ${enemy.number}: ${enemy.name}. ${won?'Beseiret':open?'Tilgjengelig':'Låst'}`}>
    <EnemyIllustration enemy={enemy.id}/><span className="route-info"><small>KAMP {enemy.number}{enemy.boss?' · BOSS':''}</small><strong>{enemy.name}</strong><span>{won?'✓ Beseiret':open?'→ Tilgjengelig':`Låst · beseire ${ENEMIES[enemy.number-2].name}`}</span><small>{enemy.gold} gull per seier{enemy.bonus&&!hero.claimedBossBonuses.includes(enemy.id)?` · +${enemy.bonus} første gang`:''}</small></span>
   </button>
  </li>;
 })}</ol><p className="route-note">Beseirede kamper kan spilles igjen og gir gull hver gang.</p></main>;
}
export function ArenaIntro({ hero, enemyId, reduced }: { hero: Hero; enemyId:EnemyId; reduced: boolean }) {
 const enemy=enemyById(enemyId),bonus=hero.claimedBossBonuses.includes(enemyId)?0:enemy.bonus;
 return <main className={`arena-intro ${enemy.boss?'boss-intro':''}`}>
  <div className="intro-toolbar"><button className="back-button" onClick={()=>game.openArena()}>← Arenaoversikt</button><SoundButton/></div>
  <span className="eyebrow">KAMP {enemy.number} AV 10{enemy.boss?' · BOSS':''}</span><h1>{enemy.name}</h1><p className="enemy-title">{enemy.subtitle}</p>
  <div className="arena-preview"><SceneView appearance={hero.appearance} color={hero.color} weapon={hero.weapon} training arena enemyId={enemyId} reduced={reduced}/></div>
  <p className="enemy-quote">«{enemy.description}»</p>
  <div className="enemy-facts"><span><b>{enemy.health}</b> liv</span><span><b>{enemy.damage}</b> skade / {enemy.interval/1000} sek</span><span><b>{enemy.gold}</b> gull per seier</span></div>
  {bonus>0&&<p className="boss-bonus">+{bonus} gull ved første bossseier</p>}
  <p className="arena-hint">Riktige svar angriper. Trening og våpen gjør deg sterkere.</p>
  <button className="primary" onClick={()=>game.startArena()}><span>Start kamp</span><span aria-hidden="true">→</span></button>
 </main>;
}
export function ArenaHud({hero,combat,feedbackLocked}:{hero:Hero;combat:Combat;feedbackLocked:boolean}) {
 const enemy=enemyById(combat.enemyId);
 const [remaining,setRemaining]=useState(game.enemyRemaining);
 useEffect(()=>{setRemaining(game.enemyRemaining());const timer=setInterval(()=>setRemaining(game.enemyRemaining()),80);return()=>clearInterval(timer);},[combat.id]);
 return <><div className="health-bars"><div><span>{hero.name}</span><progress aria-label="Heltens liv" value={combat.hp} max={hero.maxHealth}/><b>{combat.hp}/{hero.maxHealth}</b></div><div><span>{enemy.name}{enemy.boss?' · BOSS':''}</span><progress aria-label={`${enemy.name}s liv`} value={combat.enemyHp} max={enemy.health}/><b>{combat.enemyHp}/{enemy.health}</b></div></div>
 <div className="enemy-clock"><span>{combat.outcome!=='active'?'Kampen er over':combat.paused?'Kampen er pauset':feedbackLocked?`${enemy.name} venter mens du leser`:`${enemy.name}s neste angrep`}</span><progress aria-label={`${enemy.name}s angrepsmåler`} value={enemy.interval-remaining} max={enemy.interval}/></div></>;
}
export function ArenaOverlay({combat,hero,status,reputationNotice}:{combat:Combat;hero:Hero;status:StorageStatus;reputationNotice:string|null}) {
 const enemy=enemyById(combat.enemyId);
 if(combat.resultReady) {
  const won=combat.outcome==='won',reward=combat.reward;
  return <Modal title={won?(reward?.completed?'Tronen er din!':'Seier!'):`${enemy.name} vant denne gangen`} onClose={()=>game.openArena()}>
   <div className={`result-emblem ${won?'victory':'defeat'}`} aria-hidden="true">{reward?.completed?'♛':won?'✦':'↗'}</div>
   {won&&reward?<><p className="modal-description">{reward.completed?'Alle ti kampene er beseiret! Spill favorittene igjen, eller besøk Våpensmeden.':`${enemy.name} er beseiret!`}</p><dl className="reward-breakdown"><div><dt>Kampbelønning</dt><dd>{reward.regular} gull</dd></div>{reward.bonus>0&&<div><dt>Første bossseier</dt><dd>+{reward.bonus} gull</dd></div>}<div><dt>Totalt</dt><dd>{reward.regular+reward.bonus} gull</dd></div></dl>{reward.unlocked&&<p className="unlock-notice">Låst opp: {enemyById(reward.unlocked).name}</p>}<SavingGoal hero={hero} actionable/></>:<p className="modal-description">Tren litt mer eller prøv et bedre våpen.</p>}
   {reputationNotice&&<div className="reputation-notice"><strong>Ryktet ditt har vokst!</strong><span>{heroChronicle(hero).title}</span><button onClick={()=>game.leaveTraining()}>Se helten</button></div>}
   <StorageNotice status={status}/>
   {reward?.unlocked&&<button className="primary" onClick={()=>game.selectEnemy(reward.unlocked!)}>Neste motstander</button>}
   <button className={reward?.unlocked?'secondary':'primary'} onClick={()=>game.startArena()}>{won?'Kjemp igjen':'Prøv igjen'}</button>
   {!won&&<button className="secondary" onClick={()=>game.startTraining()}>Tren</button>}
   <button className="secondary" onClick={()=>game.openArena()}>Arenaoversikt</button>
  </Modal>;
 }
 if(combat.paused) return <Modal title="Kampen er pauset" onClose={()=>{}}><p className="modal-description">{enemy.name} venter. Fortsett når du er klar.</p><button className="primary" onClick={()=>game.resumeArena()}>Fortsett</button><button className="secondary" onClick={()=>game.leaveTraining()}>Avslutt kamp</button></Modal>;
 return null;
}
