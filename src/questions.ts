import { CONFIG } from './config';

export type Question = { id: number; a: number; b: number };
export type Feedback = 'answering' | 'correct' | 'first-error' | 'second-error' | 'reveal';

// Each factor is drawn independently. Repeated combinations are intentional.
export function makeQuestion(id: number, random: () => number = Math.random): Question {
  const factor = () => CONFIG.minFactor + Math.floor(random() * (CONFIG.maxFactor - CONFIG.minFactor + 1));
  return { id, a: factor(), b: factor() };
}

export function isCorrect(question: Question, input: string) {
  return input !== '' && Number.parseInt(input, 10) === question.a * question.b;
}
