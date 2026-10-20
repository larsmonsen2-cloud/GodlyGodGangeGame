import { enemyById, isUnlocked, awardVictory, type EnemyId } from './enemies';
import { buyWeapon, equipOwned, setGoal, type Purchase } from './shop';
import { isStarterId } from './weapons';
import { EnemyClock, type Combat } from './combat';
import { CONFIG, type HeroColor } from './config';
import { newHero, grantXp, damageFor, spendPoint, WEAPONS, type Hero, type Attribute, type WeaponId } from './progression';
import { browserStorage, loadHero, saveHero, type SaveStorage, type StorageStatus } from './storage';
import { isCorrect, makeQuestion, type Feedback, type Question } from './questions';

export type { Hero } from './progression';
export type GameState = {
  screen: 'create' | 'hero' | 'training' | 'arena-select' | 'arena-intro' | 'arena' | 'shop';
  hero: Hero | null;
  combat: Combat | null;
  selectedEnemy: EnemyId | null;
  question: Question | null;
  input: string;
  mistakes: number;
  feedback: Feedback;
  levelUp: number | null;
  storageStatus: StorageStatus;
  equipmentNotice: string | null;
  purchase: Purchase | null;
};
export type Attack = { questionId: number; damage: number; kind: 'melee' | 'magic' };

export class GameStore {
  private state: GameState = { screen: 'create', hero: null, combat: null, selectedEnemy: null, question: null, input: '', mistakes: 0, feedback: 'answering', levelUp: null, storageStatus: 'session', equipmentNotice: null, purchase: null };
  private listeners = new Set<() => void>();
  private attackListeners = new Set<(event: Attack) => void>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private levelTimer: ReturnType<typeof setTimeout> | undefined;
  private enemyListeners = new Set<(damage: number) => void>();
  private enemyClock = new EnemyClock(CONFIG.enemy.interval, () => this.enemyHit());
  private serial = 0;
  private generation = 0;

  constructor(private random: () => number = Math.random, private storage: SaveStorage | null = null) {
    const saved = loadHero(storage);
    this.state = { ...this.state, hero: saved.hero, screen: saved.hero ? 'hero' : 'create', storageStatus: saved.status, equipmentNotice: saved.notice ?? null };
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
  onEnemyAttack = (listener: (damage: number) => void) => {
    this.enemyListeners.add(listener);
    return () => { this.enemyListeners.delete(listener); };
  };
  enemyRemaining = () => this.enemyClock.getRemaining();
  private update(patch: Partial<GameState>) {
    if (patch.hero) patch.storageStatus = saveHero(this.storage, patch.hero);
    this.state = { ...this.state, ...patch };
    const { screen, feedback, combat } = this.state;
    if (screen === 'arena' && combat?.outcome === 'active' && !combat.paused && feedback === 'answering') this.enemyClock.resume();
    else this.enemyClock.pause();
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
      if (this.generation === generation && (this.state.screen === 'training' || this.state.screen === 'arena') && this.state.question?.id === questionId) callback();
    }, ms);
  }
  createHero(name: string, color: HeroColor, weapon: WeaponId = 'stick') {
    const trimmed = name.trim();
    if (this.state.screen !== 'create' || !trimmed || Array.from(trimmed).length > CONFIG.maxNameLength ||
        !CONFIG.colors.some(c => c.id === color) || !isStarterId(weapon)) return false;
    this.update({ hero: newHero(trimmed, color, weapon), screen: 'hero' });
    return true;
  }
  startTraining() {
    if (!this.state.hero || this.state.screen === 'training') return;
    this.cancel();
    this.enemyClock.reset();
    this.update({ combat: null, purchase: null, levelUp: null, screen: 'training', question: makeQuestion(++this.serial, this.random), input: '', mistakes: 0, feedback: 'answering' });
  }
  leaveTraining() {
    if (!this.state.hero) return;
    this.cancel();
    clearTimeout(this.levelTimer);
    this.enemyClock.reset();
    this.update({ combat: null, purchase: null, screen: 'hero', question: null, input: '', mistakes: 0, feedback: 'answering', levelUp: null });
  }
  digit(value: string) {
    if (!this.canAnswer() || !/^\d$/.test(value) || this.state.input.length >= CONFIG.maxDigits) return;
    this.update({ input: this.state.input + value });
  }
  backspace() {
    if (this.canAnswer()) this.update({ input: this.state.input.slice(0, -1) });
  }
  submit() {
    this.enemyClock.flush();
    const { question, input, mistakes } = this.state;
    if (!this.canAnswer() || !question || input === '') return;
    if (isCorrect(question, input)) {
      // Lock synchronously before emitting. Rendering never grants an attack.
      const before = this.state.hero!;
      if (this.state.screen === 'arena') {
        const combat = this.state.combat!;
        const enemyHp = Math.max(0, combat.enemyHp - damageFor(before));
        const won = enemyHp === 0;
        const victory = won ? awardVictory(before, combat.enemyId) : null;
        this.update({ feedback: 'correct', combat: { ...combat, enemyHp, outcome: won ? 'won' : 'active', reward: victory?.reward ?? null },
          ...(victory ? { hero: victory.hero } : {}) });
        this.later(CONFIG.timing.correct, () => {
          if (won) this.update({ combat: { ...this.state.combat!, resultReady: true } });
          else this.newQuestion();
        });
        this.attackListeners.forEach(listener => listener({ questionId: question.id, damage: damageFor(before), kind: WEAPONS[before.weapon].kind }));
        return;
      }
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
    if ((this.state.screen === 'training' || (this.state.screen === 'arena' && this.state.combat?.outcome === 'active' && !this.state.combat.paused)) && this.state.feedback === 'reveal') this.newQuestion();
  }
  private canAnswer() {
    return this.state.feedback === 'answering' && (this.state.screen === 'training' ||
      (this.state.screen === 'arena' && this.state.combat?.outcome === 'active' && !this.state.combat.paused));
  }
  openArena() {
    const {hero,screen,combat}=this.state;
    if (!hero || !(screen==='hero' || screen==='arena-intro' || (screen==='arena' && combat?.resultReady))) return;
    this.cancel(); clearTimeout(this.levelTimer); this.enemyClock.reset();
    this.update({screen:'arena-select',selectedEnemy:null,combat:null,question:null,levelUp:null});
  }
  selectEnemy(id: EnemyId) {
    const {hero,screen,combat}=this.state;
    if (!hero || !isUnlocked(hero,id) || !(screen==='arena-select' || (screen==='arena' && combat?.resultReady))) return false;
    this.cancel(); this.enemyClock.reset();
    this.update({screen:'arena-intro',selectedEnemy:id,combat:null,question:null});
    return true;
  }
  startArena() {
    const {hero,selectedEnemy,screen,combat}=this.state;
    if (!hero || !selectedEnemy || !isUnlocked(hero,selectedEnemy) || !(screen==='arena-intro' || (screen==='arena' && combat?.resultReady))) return;
    this.cancel(); clearTimeout(this.levelTimer); this.enemyClock.reset();
    const enemy=enemyById(selectedEnemy), id=++this.serial;
    this.enemyClock=new EnemyClock(enemy.interval,()=>{if(this.state.combat?.id===id)this.enemyHit();});
    this.update({ screen:'arena',levelUp:null,
      combat:{id,enemyId:selectedEnemy,reward:null,hp:hero.maxHealth,enemyHp:enemy.health,outcome:'active',resultReady:false,paused:false},
      question:makeQuestion(++this.serial,this.random),input:'',mistakes:0,feedback:'answering'});
  }
  pauseArena() {
    if (this.state.screen !== 'arena' || this.state.combat?.outcome !== 'active') return;
    this.update({ combat: { ...this.state.combat, paused: true } });
  }
  resumeArena() {
    if (this.state.screen !== 'arena' || this.state.combat?.outcome !== 'active') return;
    this.update({ combat: { ...this.state.combat, paused: false } });
  }
  private enemyHit() {
    if (this.state.screen !== 'arena' || !this.canAnswer()) return;
    const combat = this.state.combat!;
    const damage = enemyById(combat.enemyId).damage;
    const hp = Math.max(0, combat.hp - damage);
    if (hp === 0) this.cancel();
    this.update({ combat: { ...combat, hp, outcome: hp === 0 ? 'lost' : 'active', resultReady: hp === 0 } });
    this.enemyListeners.forEach(listener => listener(damage));
  }
  openShop() {
    const { screen, hero, combat } = this.state;
    if (!hero || !(screen === 'hero' || (screen === 'arena' && combat?.resultReady))) return;
    this.cancel(); clearTimeout(this.levelTimer); this.enemyClock.reset();
    this.update({ screen: 'shop', combat: null, question: null, purchase: null, levelUp: null });
  }
  buy(id: WeaponId) {
    if (this.state.screen !== 'shop' || !this.state.hero || this.state.purchase) return false;
    const bought = buyWeapon(this.state.hero, id);
    if (!bought) return false;
    this.update(bought);
    return true;
  }
  finishShoppingCelebration() { if (this.state.screen === 'shop') this.update({ purchase: null }); }
  equip(id: WeaponId) {
    if (this.state.screen !== 'shop' || !this.state.hero || this.state.purchase) return;
    const hero = equipOwned(this.state.hero, id);
    if (hero !== this.state.hero) this.update({ hero });
  }
  chooseGoal(id: WeaponId | null) {
    if (this.state.screen !== 'shop' || !this.state.hero || this.state.purchase) return;
    const hero = setGoal(this.state.hero, id);
    if (hero !== this.state.hero) this.update({ hero });
  }
  dismissEquipmentNotice() { this.update({ equipmentNotice: null }); }
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
    this.enemyListeners.clear();
    this.enemyClock.reset();
  }
}

export const game = new GameStore(Math.random, browserStorage());
