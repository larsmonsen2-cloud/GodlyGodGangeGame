import type { EnemyId, ArenaReward } from './enemies';
// One authoritative deadline. Pausing preserves remaining time; a delayed
// callback deals one hit, never a burst of accumulated background attacks.
export class EnemyClock {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private deadline = 0;
  private remaining: number;
  private running = false;
  constructor(private interval: number, private attack: () => void, private now: () => number = Date.now) {
    this.remaining = interval;
  }
  getRemaining = () => this.running ? Math.max(0, this.deadline - this.now()) : this.remaining;
  resume() {
    if (this.running) return;
    this.running = true;
    this.deadline = this.now() + this.remaining;
    this.timer = setTimeout(() => this.fire(), this.remaining);
  }
  pause() {
    this.remaining = this.getRemaining();
    this.running = false;
    clearTimeout(this.timer);
  }
  reset() { this.pause(); this.remaining = this.interval; }
  // A due enemy hit wins a tie against a submitted answer.
  flush() { if (this.running && this.getRemaining() === 0) this.fire(); }
  private fire() {
    if (!this.running) return;
    clearTimeout(this.timer);
    this.running = false;
    this.remaining = this.interval;
    this.attack();
  }
}

export type Combat = {
  id: number;
  enemyId: EnemyId;
  reward: ArenaReward | null;
  hp: number;
  enemyHp: number;
  outcome: 'active' | 'won' | 'lost';
  resultReady: boolean;
  paused: boolean;
};
