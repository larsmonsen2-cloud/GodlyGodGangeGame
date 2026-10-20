import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { CONFIG, type HeroColor } from './config';
import { game } from './store';
import { sound, bindSound } from './sound';
import { SoundButton } from './SoundButton';
import { type WeaponId } from './progression';
import { HeroProgress, Progress, StorageNotice } from './HeroProgress';
import { ArenaIntro, ArenaHud, ArenaOverlay } from './Arena';
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
  return <header className="site-header"><a className="brand" href="./" aria-label="Gangriket, heltesiden"><Mark />Gangriket<span className="brand-dot">✦</span></a><SoundButton /></header>;
}

export function App() {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const reduced = useReducedMotion();
  const [name, setName] = useState('');
  const [chosen, setChosen] = useState<HeroColor>('forest');
  const [error, setError] = useState('');
  const [weapon, setWeapon] = useState<WeaponId>('stick');

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

  if (state.screen === 'arena-intro' && state.hero) return <ArenaIntro hero={state.hero} reduced={reduced} />;

  if ((state.screen === 'training' || state.screen === 'arena') && state.hero && state.question) {
    const arena = state.screen === 'arena';
    const { question, feedback, input, mistakes } = state;
    const equation = feedback === 'correct' || feedback === 'reveal';
    const wrong = feedback === 'first-error' || feedback === 'second-error';
    const locked = feedback !== 'answering' || !!state.combat?.paused || (arena && state.combat?.outcome !== 'active');
    const message = feedback === 'correct' ? (arena ? 'Fulltreffer!' : 'Fulltreffer! +10 XP')
      : feedback === 'reveal' ? 'Riktig svar · Ta den tiden du trenger.'
      : wrong ? (feedback === 'first-error' ? 'Ikke helt. Prøv én gang til!' : 'Vi ser på svaret sammen.')
      : mistakes ? 'Du klarer det. Prøv igjen!' : 'Regn ut og send helten i angrep.';
    return <main className={`training-shell ${arena ? 'arena-shell' : ''}`} style={timings}>
      <header className="training-header">
        <button type="button" className="back-button" onClick={() => game.leaveTraining()} aria-label="Tilbake til helten">← <span>Helten</span></button>
        <div className="training-title"><span className="eyebrow">{arena ? 'SLIMARENAEN' : 'SKOGLYSNINGEN'}</span><h1>{arena ? 'Kamp mot Gøran' : 'Treningsplassen'}</h1></div>
        <div className="play-controls"><SoundButton />{arena ? <button className="pause-button" disabled={state.combat?.outcome !== 'active'} onClick={() => game.pauseArena()}>Pause</button> : null}</div>
      </header>
      <section className="battle-region" aria-label="Spillområde">
        {!arena && <div className="combat-labels"><span className="hero-label">{state.hero.name}</span><span className="practice-tag"><i /> Ingen tidspress</span></div>}
        <SceneView color={state.hero.color} weapon={state.hero.weapon} training arena={arena} encounter={state.combat?.id} reduced={reduced} />
        {state.levelUp && <div key={state.levelUp} className="level-banner" role="status"><span aria-hidden="true">✦</span><div><strong>Nivå {state.levelUp}!</strong><small>Nytt egenskapspoeng</small></div></div>}
        {arena && state.combat ? <ArenaHud hero={state.hero} combat={state.combat} feedbackLocked={feedback !== 'answering'} /> : <Progress hero={state.hero} training status={state.storageStatus} />}
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
      {arena && state.combat && <ArenaOverlay combat={state.combat} status={state.storageStatus} />}
    </main>;
  }

  return <div className={`page-shell ${state.screen === 'hero' ? 'hero-page compact-page' : 'create-page compact-page'}`}>
    <Header />
    <main className="home-main">
      <div className="intro"><span className="eyebrow">SMÅ REGNESTYKKER. STORE EVENTYR.</span><h1>{state.screen === 'create' ? <>Alle helter<br />begynner et sted.</> : <>En helt.<br />En svært lovende pinne.</>}</h1><p>{state.screen === 'create' ? 'Din historie starter med en helt, en pinne og litt hjernekraft.' : 'Hvert riktige svar blir et slag. Klar for å øve?'}</p></div>
      <div className="hero-layout">
        <section className="portrait-panel">
          <div className="portrait-top"><span className="eyebrow">{state.screen === 'create' ? 'DIN KOMMENDE HELT' : 'DIN HELT'}</span><span aria-hidden="true">✦</span></div>
          <SceneView color={state.hero?.color ?? chosen} weapon={state.hero?.weapon ?? weapon} reduced={reduced} />
          <div className="portrait-caption"><span className="little-rule" /><span>{state.hero?.name || name.trim() || 'Et eventyr venter'}</span><span className="little-rule" /></div>
          <span className="portrait-note">Liten helt. Store ambisjoner.</span>
        </section>
        <section className="details-panel">
          {state.screen === 'create' ? <form onSubmit={event => {
            event.preventDefault();
            if (!game.createHero(name, chosen, weapon)) setError('Gi helten et navn på 1–20 tegn.');
          }}>
            <h2>Lag din helt</h2>
            <label className="name-label" htmlFor="hero-name">Heltens navn <span>{Array.from(name.trim()).length}/20</span></label>
            <input id="hero-name" name="hero-name" value={name} autoComplete="off" placeholder="Hva skal helten hete?" aria-describedby="name-error"
              onChange={event => { setName(event.target.value); setError(''); }} />
            <div id="name-error" className="form-error" role="status">{error}</div>
            <fieldset className="color-picker"><legend>Velg din farge</legend><div className="color-options">
              {CONFIG.colors.map(c => <label key={c.id} className={`color-option ${chosen === c.id ? 'selected' : ''}`} style={{ '--swatch': c.value } as CSSProperties}>
                <input type="radio" name="hero-color" value={c.id} checked={chosen === c.id} onChange={() => setChosen(c.id)} />
                <span className="swatch" aria-hidden="true">{chosen === c.id ? '✓' : ''}</span><span>{c.name}</span>
              </label>)}
            </div></fieldset>
            <fieldset className="weapon-picker"><legend>Velg våpen</legend><div className="weapon-options">
              {(['stick', 'wand'] as const).map(id => <label key={id} className={weapon === id ? 'selected' : ''}>
                <input type="radio" name="start-weapon" value={id} checked={weapon === id} onChange={() => setWeapon(id)} />
                <span>{id === 'stick' ? 'Kampvåpen' : 'Magivåpen'}</span>
              </label>)}
            </div></fieldset>
            <StorageNotice status={state.storageStatus} />
            <button className="primary create-button" type="submit"><span>Start eventyret</span><span aria-hidden="true">→</span></button>
          </form> : <>
            <HeroProgress hero={state.hero!} status={state.storageStatus} />
          </>}
        </section>
      </div>
      <footer className="home-footer"><span>1–10 × 1–10</span><span>En pinne. Uendelige muligheter.</span><span>TA DET I DITT TEMPO</span></footer>
    </main>
  </div>;
}
