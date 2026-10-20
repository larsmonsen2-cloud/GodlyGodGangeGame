import { CONFIG, attackDamage, type HeroColor } from './config';
import { isCorrect, makeQuestion, type Feedback, type Question } from './questions';

export type Hero = { name: string; color: HeroColor };
export type GameState = {
  screen: 'create' | 'hero' | 'training';
  hero: Hero | null;
  question: Question | null;
  input: string;
  mistakes: number;
  feedback: Feedback;
};
export type Attack = { questionId: number; damage: number };

export class GameStore {
  private state: GameState = { screen: 'create', hero: null, question: null, input: '', mistakes: 0, feedback: 'answering' };
  private listeners = new Set<() => void>();
  private attackListeners = new Set<(event: Attack) => void>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private serial = 0;
  private generation = 0;

  constructor(private random: () => number = Math.random) {}
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
  createHero(name: string, color: HeroColor) {
    const trimmed = name.trim();
    if (this.state.screen !== 'create' || !trimmed || Array.from(trimmed).length > CONFIG.maxNameLength ||
        !CONFIG.colors.some(c => c.id === color)) return false;
    this.update({ hero: { name: trimmed, color }, screen: 'hero' });
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
    this.update({ screen: 'hero', question: null, input: '', mistakes: 0, feedback: 'answering' });
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
      this.update({ feedback: 'correct' });
      this.attackListeners.forEach(listener => listener({ questionId: question.id, damage: attackDamage }));
      this.later(CONFIG.timing.correct, () => this.newQuestion());
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
  private newQuestion() {
    this.cancel();
    this.update({ question: makeQuestion(++this.serial, this.random), input: '', mistakes: 0, feedback: 'answering' });
  }
  dispose() {
    this.cancel();
    this.listeners.clear();
    this.attackListeners.clear();
  }
}

export const game = new GameStore();
