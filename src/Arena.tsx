import { useEffect, useState } from 'react';
import { SoundButton } from './SoundButton';
import { CONFIG } from './config';
import type { Combat } from './combat';
import type { Hero } from './progression';
import { game } from './store';
import { Modal, StorageNotice } from './HeroProgress';
import { SceneView } from './SceneView';
import type { StorageStatus } from './storage';

export function ArenaIntro({ hero, reduced }: { hero: Hero; reduced: boolean }) {
  return <main className="arena-intro">
    <div className="intro-toolbar"><button className="back-button" onClick={() => game.leaveTraining()}>← Helten</button><SoundButton /></div>
    <span className="eyebrow">DIN FØRSTE ARENA</span>
    <h1>Gøran</h1><p className="enemy-title">Den lettere fornærmede slimklumpen</p>
    <div className="arena-preview"><SceneView color={hero.color} weapon={hero.weapon} training arena reduced={reduced} /></div>
    <p className="enemy-quote">«{CONFIG.enemy.description}»</p>
    <div className="enemy-facts"><span><b>{CONFIG.enemy.health}</b> liv</span><span><b>{CONFIG.enemy.damage}</b> skade / {CONFIG.enemy.interval / 1000} sek</span><span><b>{CONFIG.enemy.gold}</b> gull ved seier</span></div>
    <p className="arena-hint">Riktige svar angriper. Trenger du mer styrke? Tren først.</p>
    <button className="primary" onClick={() => game.startArena()}><span>Start kamp</span><span aria-hidden="true">→</span></button>
  </main>;
}

export function ArenaHud({ hero, combat, feedbackLocked }: { hero: Hero; combat: Combat; feedbackLocked: boolean }) {
  const [remaining, setRemaining] = useState(game.enemyRemaining);
  useEffect(() => {
    const timer = setInterval(() => setRemaining(game.enemyRemaining()), 80);
    return () => clearInterval(timer);
  }, []);
  return <>
    <div className="health-bars">
      <div><span>{hero.name}</span><progress aria-label="Heltens liv" value={combat.hp} max={hero.maxHealth} /><b>{combat.hp}/{hero.maxHealth}</b></div>
      <div><span>Gøran</span><progress aria-label="Gørans liv" value={combat.enemyHp} max={CONFIG.enemy.health} /><b>{combat.enemyHp}/{CONFIG.enemy.health}</b></div>
    </div>
    <div className="enemy-clock"><span>{combat.outcome !== 'active' ? 'Kampen er over' : combat.paused ? 'Kampen er pauset' : feedbackLocked ? 'Gøran venter mens du leser' : 'Gørans neste angrep'}</span>
      <progress aria-label="Gørans angrepsmåler" value={CONFIG.enemy.interval - remaining} max={CONFIG.enemy.interval} />
    </div>
  </>;
}

export function ArenaOverlay({ combat, status }: { combat: Combat; status: StorageStatus }) {
  if (combat.resultReady) {
    const won = combat.outcome === 'won';
    return <Modal title={won ? 'Seier!' : 'Gøran vant denne gangen'} onClose={() => game.leaveTraining()}>
      <div className={`result-emblem ${won ? 'victory' : 'defeat'}`} aria-hidden="true">{won ? '✦' : '↗'}</div>
      <p className="modal-description">{won ? `Du vant ${CONFIG.enemy.gold} gull. Gøran ber om en ny opptelling.` : 'Tren litt mer og prøv igjen!'}</p>
      <StorageNotice status={status} />
      <button className="primary" onClick={() => game.startArena()}>{won ? 'Omkamp' : 'Prøv igjen'}</button>
      {!won && <button className="secondary" onClick={() => game.startTraining()}>Gå til trening</button>}
      <button className="secondary" onClick={() => game.leaveTraining()}>Til helten</button>
    </Modal>;
  }
  if (combat.paused) return <Modal title="Kampen er pauset" onClose={() => {}}>
    <p className="modal-description">Gøran venter. Fortsett når du er klar.</p>
    <button className="primary" onClick={() => game.resumeArena()}>Fortsett</button>
    <button className="secondary" onClick={() => game.leaveTraining()}>Avslutt kamp</button>
  </Modal>;
  return null;
}
