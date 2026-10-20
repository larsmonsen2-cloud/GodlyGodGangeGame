import { CONFIG, type HeroColor } from './config';
import { newHero, grantXp, damageFor, spendPoint, WEAPONS, type Hero, type Attribute, type WeaponId } from './progression';
import { browserStorage, loadHero, saveHero, type SaveStorage, type StorageStatus } from './storage';
import { isCorrect, makeQuestion, type Feedback, type Question } from './questions';

export type { Hero } from './progression';
export type GameState = {
  screen: 'create' | 'hero' | 'training';
  hero: Hero | null;
  question: Question | null;
  input: string;
  mistakes: number;
  feedback: Feedback;
  levelUp: number | null;
  storageStatus: StorageStatus;
};
export type Attack = { questionId: number; damage: number; kind: 'melee' | 'magic' };

export class GameStore {
  private state: GameState = { screen: 'create', hero: null, question: null, input: '', mistakes: 0, feedback: 'answering', levelUp: null, storageStatus: 'session' };
  private listeners = new Set<() => void>();
  private attackListeners = new Set<(event: Attack) => void>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private levelTimer: ReturnType<typeof setTimeout> | undefined;
  private serial = 0;
  private generation = 0;

  constructor(private random: () => number = Math.random, private storage: SaveStorage | null = null) {
    const saved = loadHero(storage);
    this.state = { ...this.state, hero: saved.hero, screen: saved.hero ? 'hero' : 'create', storageStatus: saved.status };
  }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  onAttack = (listener: (event: Attack) => void) => {
    this.attackListeners.add(listener);
    return () => { this.attackListeners.delete(listener); };
  };
  private update(patch: Partial<GameState>) {
    if (patch.hero) patch.storageStatus = saveHero(this.storage, patch.hero);
    this.state = { ...this.state, ...patch };
    this.listeners.forEach(listener => listener());
  }
  private cancel() {
    clearTimeout(this.timer);
    this.generation++;
  }
  private later(ms: number, callback: () => void) {
    const generation = this.generation;
    const questionId = this.state.question?.id;
    this.timer = setTimeout(() => {
      if (this.generation === generation && this.state.screen === 'training' && this.state.question?.id === questionId) callback();
    }, ms);
  }
  createHero(name: string, color: HeroColor, weapon: WeaponId = 'stick') {
    const trimmed = name.trim();
    if (this.state.screen !== 'create' || !trimmed || Array.from(trimmed).length > CONFIG.maxNameLength ||
        !CONFIG.colors.some(c => c.id === color) || !Object.hasOwn(WEAPONS, weapon)) return false;
    this.update({ hero: { ...newHero(trimmed, color), weapon }, screen: 'hero' });
    return true;
  }
  startTraining() {
    if (!this.state.hero || this.state.screen === 'training') return;
    this.cancel();
    this.update({ screen: 'training', question: makeQuestion(++this.serial, this.random), input: '', mistakes: 0, feedback: 'answering' });
  }
  leaveTraining() {
    if (!this.state.hero) return;
    this.cancel();
    clearTimeout(this.levelTimer);
    this.update({ screen: 'hero', question: null, input: '', mistakes: 0, feedback: 'answering', levelUp: null });
  }
  digit(value: string) {
    if (this.state.screen !== 'training' || this.state.feedback !== 'answering' || !/^\d$/.test(value) || this.state.input.length >= CONFIG.maxDigits) return;
    this.update({ input: this.state.input + value });
  }
  backspace() {
    if (this.state.screen === 'training' && this.state.feedback === 'answering') this.update({ input: this.state.input.slice(0, -1) });
  }
  submit() {
    const { screen, feedback, question, input, mistakes } = this.state;
    if (screen !== 'training' || feedback !== 'answering' || !question || input === '') return;
    if (isCorrect(question, input)) {
      // Lock synchronously before emitting. Rendering never grants an attack.
      const before = this.state.hero!;
      const hero = grantXp(before, CONFIG.progression.xpPerAnswer);
      this.update({ feedback: 'correct', hero });
      this.attackListeners.forEach(listener => listener({ questionId: question.id, damage: damageFor(before), kind: WEAPONS[before.weapon].kind }));
      this.later(CONFIG.timing.correct, () => {
        this.newQuestion();
        if (hero.level > before.level) {
          clearTimeout(this.levelTimer);
          this.update({ levelUp: hero.level });
          this.levelTimer = setTimeout(() => this.update({ levelUp: null }), CONFIG.timing.levelBanner);
        }
      });
    } else {
      const nextMistakes = mistakes + 1;
      this.update({ feedback: nextMistakes === 1 ? 'first-error' : 'second-error', mistakes: nextMistakes });
      this.later(CONFIG.timing.wrong, () => this.update({
        input: '', feedback: nextMistakes === 1 ? 'answering' : 'reveal',
      }));
    }
  }
  next() {
    if (this.state.screen === 'training' && this.state.feedback === 'reveal') this.newQuestion();
  }
  spend(attribute: Attribute) {
    const { hero, screen } = this.state;
    if (!hero || screen !== 'hero') return;
    const updated = spendPoint(hero, attribute);
    if (updated !== hero) this.update({ hero: updated });
  }
  private newQuestion() {
    this.cancel();
    this.update({ question: makeQuestion(++this.serial, this.random), input: '', mistakes: 0, feedback: 'answering' });
  }
  dispose() {
    this.cancel();
    clearTimeout(this.levelTimer);
    this.listeners.clear();
    this.attackListeners.clear();
  }
}

export const game = new GameStore(Math.random, browserStorage());
