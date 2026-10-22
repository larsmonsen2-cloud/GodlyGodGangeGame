import {TrainingHud} from './TrainingHud';
import {ARENAS,arenaIndex} from './arenas';
import { LevelEmblem } from './LevelEmblem';
import { SpecialMeter } from './SpecialMeter';
import { WEAPONS } from './weapons';
import { HeroSelect } from './HeroSelect';
import { CharacterBuilder } from './CharacterBuilder';
import { enemyById } from './enemies';
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { CONFIG } from './config';
import { game } from './store';
import { sound, bindSound } from './sound';
import { SoundButton } from './SoundButton';
import { HeroProgress, Progress } from './HeroProgress';
import { ArenaSelect, ArenaIntro, ArenaHud, ArenaOverlay } from './Arena';
import { Shop } from './WeaponShop';
import { SavingGoal } from './SavingGoal';
import { Modal } from './HeroProgress';
import { SceneView } from './SceneView';
import { makeKeyboardController } from './keyboard';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function Mark() {
  return <span className="brand-mark" aria-hidden="true">×</span>;
}
function Header() {
  return <header className="site-header"><a className="brand" href="./" aria-label="GodlyGoodGangeGame, heltesiden"><Mark />GodlyGoodGangeGame<span className="brand-dot">✦</span></a><SoundButton /></header>;
}

export function App() {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const reduced = useReducedMotion();

  useEffect(() => {
    if ((state.screen !== 'training' && state.screen !== 'arena') || state.combat?.paused || state.combat?.resultReady) return;
    const { down, up, blur } = makeKeyboardController(game);
    window.addEventListener('keydown', down, true);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down, true);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [state.screen, state.combat?.paused, state.combat?.resultReady]);

  useEffect(() => {
    const visibility = () => { if (document.hidden) game.pauseArena(); };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  useEffect(() => {
    const off = bindSound(game, sound);
    const unlock = () => { void sound.unlock(); };
    const hush = () => { if (document.hidden) sound.stop(); };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
    document.addEventListener('visibilitychange', hush);
    return () => {
      off(); sound.stop();
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      document.removeEventListener('visibilitychange', hush);
    };
  }, []);

  const timings = {
    '--correct-time': `${CONFIG.timing.correctPulse}ms`,
    '--wrong-time': `${CONFIG.timing.wrong}ms`,
    '--reveal-time': `${CONFIG.timing.reveal}ms`,
  } as CSSProperties;

  if (state.screen === 'recovery') return <main className="hero-select-page"><Header/><h1>Heltene dine er beholdt</h1><p className="storage-notice">Vi kunne ikke åpne eller oppgradere lagringen trygt. Ingen gammel lagring er overskrevet. Frigjør om nødvendig plass i nettleseren og prøv igjen.</p><button className="primary" onClick={()=>game.retryStorage()}>Prøv igjen</button></main>;
  if (state.screen === 'heroes') return <HeroSelect profiles={state.profiles} lastHeroId={state.activeHeroId} status={state.storageStatus} notice={state.equipmentNotice}/>;
  if (state.screen === 'create' || state.screen === 'appearance') return <CharacterBuilder canCancel={state.profiles.length>0} key={state.screen} hero={state.screen === 'appearance' ? state.hero : null} draft={state.appearanceDraft} backgroundDraft={state.backgroundDraft} status={state.storageStatus} reduced={reduced} />;

  if (state.screen === 'shop' && state.hero) return <Shop ready={state.shopReady} revealed={state.revealedOffer} key={state.activeHeroId} context={{heroId:state.activeHeroId,session:state.shopSession}} hero={state.hero} purchase={state.purchase} status={state.storageStatus} reduced={reduced} />;

  if (state.screen === 'arena-select' && state.hero) return <ArenaSelect hero={state.hero} />;
  if (state.screen === 'arena-intro' && state.hero && state.selectedEnemy) return <ArenaIntro hero={state.hero} enemyId={state.selectedEnemy} reduced={reduced} />;

  if ((state.screen === 'training' || state.screen === 'arena') && state.hero && state.question) {
    const arena = state.screen === 'arena';
    const enemy = state.combat ? enemyById(state.combat.enemyId) : null;
    const { question, feedback, input, mistakes } = state;
    const equation = feedback === 'correct' || feedback === 'reveal';
    const wrong = feedback === 'first-error' || feedback === 'second-error';
    const locked = feedback !== 'answering' || !!state.combat?.paused || (arena && state.combat?.outcome !== 'active');
    const message = feedback === 'correct' ? (arena ? 'Fulltreffer!' : `Fulltreffer! +${CONFIG.progression.xpPerAnswer+(state.trainingReward?.bonus??0)} XP`)
      : feedback === 'reveal' ? 'Riktig svar · Ta den tiden du trenger.'
      : wrong ? (feedback === 'first-error' ? 'Ikke helt. Prøv én gang til!' : 'Vi ser på svaret sammen.')
      : mistakes ? 'Du klarer det. Prøv igjen!' : 'Regn ut og send helten i angrep.';
    return <main className={`training-shell ${arena ? 'arena-shell' : ''} ${state.hero.savingGoal ? 'has-saving-goal' : ''}`} style={timings}>
      <header className="training-header">
        <button type="button" className="back-button" onClick={() => game.leaveTraining()} aria-label="Tilbake til helten">← <span>Helten</span></button>
        <div className="training-title"><span className="eyebrow">{arena ? `${ARENAS[arenaIndex(enemy!.number)].name} · ${(enemy!.number-1)%10+1}/10` : 'SKOGLYSNINGEN'}</span><h1>{arena ? enemy?.name : 'Treningsplassen'}</h1></div>
        <div className="play-controls"><SoundButton />{arena ? <button className="pause-button" disabled={state.combat?.outcome !== 'active'} onClick={() => game.pauseArena()}>Pause</button> : null}</div>
      </header>
      <section className="battle-region" aria-label="Spillområde">
        {!arena && <TrainingHud training={state.hero.training} reward={state.trainingReward}/>}
        <SceneView key={`${state.activeHeroId}-${state.sessionId}`} appearance={state.hero.appearance} color={state.hero.color} weapon={state.hero.weapon} training arena={arena} enemyId={state.combat?.enemyId} encounter={state.combat?.id} reduced={reduced} />
        {state.levelUp && arena && <div key={state.levelUp} className="level-banner" role="status"><LevelEmblem level={state.levelUp} compact/><div><strong>Nivå opp!</strong><small>Egenskapspoeng klare</small></div></div>}
        {arena && state.combat ? <ArenaHud hero={state.hero} combat={state.combat} feedbackLocked={feedback !== 'answering'} /> : <Progress hero={state.hero} training celebrate={!!state.levelUp} status={state.storageStatus} />}
        <SpecialMeter streak={state.streak} flash={state.specialFlash} brokenFrom={state.brokenFrom} magic={WEAPONS[state.hero.weapon].kind==='magic'} questionId={question.id}/>
        <div className="battle-savings"><SavingGoal hero={state.hero} compact /></div>
      </section>
      <section className={`math-region feedback-${feedback}`} aria-label="Regneområde">
        <div className="math-heading"><span className="eyebrow">DIN TUR</span><span>Den lille gangetabellen</span></div>
        <div className="question-space">
          <div key={`${question.id}-${feedback}`} className={`question-motion ${wrong ? 'shake' : ''} ${equation ? feedback : ''}`}>
            <div className="equation" aria-label={equation ? `${question.a} ganger ${question.b} er ${question.a * question.b}` : `${question.a} ganger ${question.b}`}>
              <span>{question.a}</span><span className="multiply">×</span><span>{question.b}</span>
              {equation && <><span className="equals">=</span><span>{question.a * question.b}</span><span className="result-icon" aria-hidden="true">{feedback === 'correct' ? '✓' : ''}</span></>}
            </div>
            {!equation && <div className={`answer-box ${wrong ? 'wrong-answer' : ''}`}><span className="answer-caption">DITT SVAR</span><output aria-label="Ditt svar">{input || <span className="input-caret" aria-hidden="true">?</span>}</output>{wrong && <span className="wrong-icon" aria-label="Feil svar">×</span>}</div>}
          </div>
        </div>
        <p className="feedback-message" role="status" aria-live="polite" aria-atomic="true">{equation && <span className="sr-only">{`${question.a} × ${question.b} = ${question.a * question.b}. `}</span>}{message}</p>
        <div className="keypad" aria-label="Talltastatur">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => <button key={digit} type="button" disabled={locked} onClick={() => game.digit(String(digit))}>{digit}</button>)}
          <span className="keypad-hint" aria-hidden="true">✦</span>
          <button type="button" disabled={locked} onClick={() => game.digit('0')}>0</button>
          <button type="button" className="delete-key" aria-label="Slett siste siffer" disabled={locked} onClick={() => game.backspace()}><svg width="25" height="20" viewBox="0 0 25 20" fill="none" aria-hidden="true"><path d="M9 2H23V18H9L2 10L9 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M12 6L19 14M19 6L12 14" stroke="currentColor" strokeWidth="1.7"/></svg></button>
        </div>
        <button type="button" className="primary submit" disabled={feedback !== 'reveal' && (locked || !input)}
          onClick={() => feedback === 'reveal' ? game.next() : game.submit()}>
          <span>{feedback === 'reveal' ? 'Neste' : feedback === 'correct' ? 'Fulltreffer!' : 'Svar'}</span><span aria-hidden="true">{feedback === 'correct' ? '✓' : '→'}</span>
        </button>
      </section>
      {arena && state.combat && <ArenaOverlay combat={state.combat} hero={state.hero} status={state.storageStatus} reputationNotice={state.reputationNotice} />}
    </main>;
  }

  return <div className="page-shell hero-page personal-hero-page">
    <Header />
    <main className="home-main"><div className="hero-layout">
      <section className="portrait-panel"><SceneView appearance={state.hero!.appearance} color={state.hero!.color} weapon={state.hero!.weapon} reduced={reduced} /></section>
      <section className="details-panel"><HeroProgress levelCelebration={state.levelCelebration} key={state.activeHeroId} hero={state.hero!} status={state.storageStatus} reputationNotice={state.reputationNotice} /></section>
    </div></main>
    {(state.equipmentNotice || state.profiles.find(p=>p.id===state.activeHeroId)?.notice) && <Modal title="Helten er gjenopprettet" onClose={() => game.dismissEquipmentNotice()}><p className="modal-description">{state.equipmentNotice ?? state.profiles.find(p=>p.id===state.activeHeroId)?.notice}</p><button className="primary" onClick={() => game.dismissEquipmentNotice()}>Fortsett</button></Modal>}
  </div>;
}
