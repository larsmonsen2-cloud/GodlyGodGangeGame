import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { CONFIG, attackDamage, type HeroColor } from './config';
import { game } from './store';
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
  return <header className="site-header"><a className="brand" href="./" aria-label="Gangriket, start på nytt"><Mark />Gangriket<span className="brand-dot">✦</span></a><span className="edition">ET LITE REGNEEVENTYR</span></header>;
}
function Weapon() {
  return <div className="weapon-card"><span className="weapon-icon" aria-hidden="true">╱</span><div><span className="eyebrow">DITT STARTVÅPEN</span><h3>{CONFIG.weapon.name}</h3><p>{CONFIG.weapon.description}</p></div></div>;
}

export function App() {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const reduced = useReducedMotion();
  const [name, setName] = useState('');
  const [chosen, setChosen] = useState<HeroColor>('forest');
  const [error, setError] = useState('');

  useEffect(() => {
    if (state.screen !== 'training') return;
    const { down, up, blur } = makeKeyboardController(game);
    window.addEventListener('keydown', down, true);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down, true);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [state.screen]);

  const timings = {
    '--correct-time': `${CONFIG.timing.correctPulse}ms`,
    '--wrong-time': `${CONFIG.timing.wrong}ms`,
    '--reveal-time': `${CONFIG.timing.reveal}ms`,
  } as CSSProperties;

  if (state.screen === 'training' && state.hero && state.question) {
    const { question, feedback, input, mistakes } = state;
    const equation = feedback === 'correct' || feedback === 'reveal';
    const wrong = feedback === 'first-error' || feedback === 'second-error';
    const locked = feedback !== 'answering';
    const message = feedback === 'correct' ? 'Fulltreffer! Godt regnet.'
      : feedback === 'reveal' ? 'Riktig svar · Ta den tiden du trenger.'
      : wrong ? (feedback === 'first-error' ? 'Ikke helt. Prøv én gang til!' : 'Vi ser på svaret sammen.')
      : mistakes ? 'Du klarer det. Prøv igjen!' : 'Regn ut og send helten i angrep.';
    return <main className="training-shell" style={timings}>
      <header className="training-header">
        <button type="button" className="back-button" onClick={() => game.leaveTraining()} aria-label="Tilbake til helten">← <span>Helten</span></button>
        <div className="training-title"><span className="eyebrow">SKOGLYSNINGEN</span><h1>Treningsplassen</h1></div>
        <span className="small-mark" aria-hidden="true">×</span>
      </header>
      <section className="battle-region" aria-label="Spillområde">
        <div className="combat-labels"><span className="hero-label">{state.hero.name}</span><span className="practice-tag"><i /> Ingen tidspress</span></div>
        <SceneView color={state.hero.color} training reduced={reduced} />
        <div className="battle-footer"><span><b>{attackDamage}</b> skade per fulltreffer</span><span>Dummyen tåler en støyt.</span></div>
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
    </main>;
  }

  return <div className={`page-shell ${state.screen === 'hero' ? 'hero-page compact-page' : 'create-page compact-page'}`}>
    <Header />
    <main className="home-main">
      <div className="intro"><span className="eyebrow">SMÅ REGNESTYKKER. STORE EVENTYR.</span><h1>{state.screen === 'create' ? <>Alle helter<br />begynner et sted.</> : <>En helt.<br />En svært lovende pinne.</>}</h1><p>{state.screen === 'create' ? 'Din historie starter med en helt, en pinne og litt hjernekraft.' : 'Hvert riktige svar blir et slag. Klar for å øve?'}</p></div>
      <div className="hero-layout">
        <section className="portrait-panel">
          <div className="portrait-top"><span className="eyebrow">{state.screen === 'create' ? 'DIN KOMMENDE HELT' : 'DIN HELT'}</span><span aria-hidden="true">✦</span></div>
          <SceneView color={state.hero?.color ?? chosen} reduced={reduced} />
          <div className="portrait-caption"><span className="little-rule" /><span>{state.hero?.name || name.trim() || 'Et eventyr venter'}</span><span className="little-rule" /></div>
          <span className="portrait-note">Liten helt. Store ambisjoner.</span>
        </section>
        <section className="details-panel">
          {state.screen === 'create' ? <form onSubmit={event => {
            event.preventDefault();
            if (!game.createHero(name, chosen)) setError('Gi helten et navn på 1–20 tegn.');
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
            <Weapon />
            <button className="primary create-button" type="submit"><span>Start eventyret</span><span aria-hidden="true">→</span></button>
          </form> : <>
            <span className="step-label">KLAR FOR ET LITE EVENTYR</span><h2 className="hero-name-heading">{state.hero!.name}</h2><p className="hero-subtitle">Skogens ferskeste eventyrer</p>
            <Weapon />
            <div className="damage-card"><div><span className="eyebrow">ANGREPSSKADE</span><p>Styrke {CONFIG.strength} + våpen {CONFIG.weapon.damage}</p></div><strong>{attackDamage}<span>skade</span></strong></div>
            <div className="training-invite"><span aria-hidden="true">✦</span><p>Tren i ditt eget tempo.<br />Dummyen har ingen andre planer.</p></div>
            <button className="primary" type="button" onClick={() => game.startTraining()}><span>Tren</span><span aria-hidden="true">→</span></button>
          </>}
        </section>
      </div>
      <footer className="home-footer"><span>1–10 × 1–10</span><span>En pinne. Uendelige muligheter.</span><span>TA DET I DITT TEMPO</span></footer>
    </main>
  </div>;
}
