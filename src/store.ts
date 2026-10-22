import {isHeroPackTest} from './previewMode';
import {heroPackStorage} from './heroPackSeed';
import {emptyBackground,validBackground,type Background} from './background';
import {trainHit} from './training';
import { normalizeAppearance, validAppearance, type Appearance } from './appearance';
import { normalizeReputation, pendingReputation, acknowledgeReputation, heroChronicle } from './reputation';
import { enemyById, isUnlocked, awardVictory, type EnemyId } from './enemies';
import { buyWeapon, equipOwned, setGoal, nextWeapon, type Purchase } from './shop';
import { isStarterId } from './weapons';
import { EnemyClock, type Combat } from './combat';
import { CONFIG, type HeroColor } from './config';
import { newHero, grantXp, damageFor, spendPoint, WEAPONS, type Hero, type Attribute, type WeaponId } from './progression';
import { browserStorage, loadLibrary, saveLibrary, newProfileId, type HeroProfile, type SaveStorage, type StorageStatus } from './storage';
import { isCorrect, makeQuestion, type Feedback, type Question } from './questions';

export type { Hero } from './progression';
export type GameState = {
  screen: 'heroes' | 'recovery' | 'create' | 'hero' | 'training' | 'arena-select' | 'arena-intro' | 'arena' | 'shop' | 'appearance';
  hero: Hero | null;
  profiles: HeroProfile[];
  activeHeroId: string | null;
  sessionId: number;
  streak: number;
  specialFlash: boolean;
  brokenFrom: number;
  levelCelebration: number | null;
  trainingReward: {count:number;bonus:number}|null;
  shopSession: number;
  shopReady: boolean;
  revealedOffer: WeaponId | null;
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
  backgroundDraft: Background | null;
  appearanceDraft: Appearance | null;
  reputationNotice: string | null;
};
export type ShopContext = {heroId:string|null;session:number};
export type Attack = { heroId:string; sessionId:number; special:boolean; questionId: number; damage: number; kind: 'melee' | 'magic' };

export class GameStore {
  private state: GameState = { screen: 'create', hero: null, profiles: [], activeHeroId: null, sessionId:0,streak:0,trainingReward:null,specialFlash:false,brokenFrom:0,levelCelebration:null,shopSession: 0, shopReady:true, revealedOffer:null, combat: null, selectedEnemy: null, question: null, input: '', mistakes: 0, feedback: 'answering', levelUp: null, storageStatus: 'session', equipmentNotice: null, purchase: null, backgroundDraft:null,appearanceDraft: null, reputationNotice: null };
  private listeners = new Set<() => void>();
  private attackListeners = new Set<(event: Attack) => void>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private shopTimer: ReturnType<typeof setTimeout> | undefined;
  private levelTimer: ReturnType<typeof setTimeout> | undefined;
  private enemyListeners = new Set<(damage: number) => void>();
  private enemyClock = new EnemyClock(CONFIG.enemy.interval, () => this.enemyHit());
  private rejectedProfiles: unknown[] = [];
  private serial = 0;
  private generation = 0;

  constructor(private random: () => number = Math.random, private storage: SaveStorage | null = null) {
    this.restore();
  }
  private restore() {
    const saved=loadLibrary(this.storage);
    this.rejectedProfiles=saved.rejectedProfiles;
    this.state={...this.state,profiles:saved.profiles,activeHeroId:saved.lastHeroId,
      hero:saved.profiles.find(p=>p.id===saved.lastHeroId)?.hero??null,
      screen:saved.status==='blocked'?'recovery':saved.profiles.length?'heroes':'create',
      storageStatus:saved.status,equipmentNotice:saved.notice??null};
  }
  retryStorage() { if(this.state.screen!=='recovery')return;this.restore();this.listeners.forEach(listener=>listener()); }

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
    const next={...this.state,...patch};
    if(patch.screen&&!['training','arena'].includes(patch.screen)){next.streak=0;next.specialFlash=false;next.brokenFrom=0;}
    if(patch.hero && next.activeHeroId) {
      const hero={...patch.hero,reputation:normalizeReputation(patch.hero)};
      next.profiles=next.profiles.map(p=>p.id===next.activeHeroId?{...p,hero}:p);
    }
    // hero is a derived reference into profiles, never an independently stored copy.
    next.hero=next.profiles.find(p=>p.id===next.activeHeroId)?.hero??null;
    if(patch.hero || patch.profiles || patch.activeHeroId) next.storageStatus=saveLibrary(this.storage,{profiles:next.profiles,lastHeroId:next.activeHeroId,rejectedProfiles:this.rejectedProfiles});
    this.state=next;
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
    const heroId = this.state.activeHeroId;
    this.timer = setTimeout(() => {
      if (this.state.activeHeroId === heroId && this.generation === generation && (this.state.screen === 'training' || this.state.screen === 'arena') && this.state.question?.id === questionId) callback();
    }, ms);
  }
  createHero(name: string, color: HeroColor, weapon: WeaponId = 'stick', appearance: Appearance = normalizeAppearance(null,color),background:Background=emptyBackground()) {
    const trimmed = name.trim();
    if (this.state.screen !== 'create' || !trimmed || Array.from(trimmed).length > CONFIG.maxNameLength ||
        !CONFIG.colors.some(c => c.id === color) || !isStarterId(weapon) || !validAppearance(appearance) || !validBackground(background) || appearance.clothes !== color) return false;
    const profile={id:newProfileId(),seenLevel:1,hero:newHero(trimmed,color,weapon,appearance,background)};
    this.update({profiles:[...this.state.profiles,profile],activeHeroId:profile.id,screen:'hero'});
    return true;
  }
  private clearSession() {
    this.cancel();clearTimeout(this.levelTimer);clearTimeout(this.shopTimer);this.enemyClock.reset();
    this.update({trainingReward:null,sessionId:++this.serial,streak:0,specialFlash:false,brokenFrom:0,levelCelebration:null,shopReady:true,revealedOffer:null,shopSession:this.state.shopSession+1,combat:null,selectedEnemy:null,question:null,input:'',mistakes:0,feedback:'answering',levelUp:null,purchase:null,backgroundDraft:null,appearanceDraft:null,reputationNotice:null});
  }
  openHeroes() {
    if(this.state.screen!=='hero')return;
    this.clearSession();this.update({screen:'heroes'});
  }
  selectHero(id: string) {
    if(this.state.screen!=='heroes'||!this.state.profiles.some(p=>p.id===id))return false;
    this.clearSession();this.update({activeHeroId:id,screen:'hero'});this.presentReputation();this.presentLevel();return true;
  }
  beginCreation() {if(this.state.screen!=='heroes')return;this.clearSession();this.update({screen:'create'});}
  cancelCreation() {if(this.state.screen!=='create'||!this.state.profiles.length)return;this.clearSession();this.update({screen:'heroes'});}
  getShopContext = () => ({heroId:this.state.activeHeroId,session:this.state.shopSession});
  private validShopContext(context: ShopContext) {
    return context.heroId===this.state.activeHeroId && context.session===this.state.shopSession;
  }
  startTraining() {
    if (!this.state.hero || !['hero','shop','arena'].includes(this.state.screen) || (this.state.screen==='arena'&&!this.state.combat?.resultReady)) return;
    this.cancel();
    this.enemyClock.reset();
    this.update({trainingReward:null,sessionId:++this.serial,streak:0,specialFlash:false,brokenFrom:0,levelCelebration:null, combat: null, purchase: null, reputationNotice: null, backgroundDraft:null,appearanceDraft: null, levelUp: null, screen: 'training', question: makeQuestion(++this.serial, this.random), input: '', mistakes: 0, feedback: 'answering' });
  }
  leaveTraining() {
    if (!this.state.hero || ['heroes','create','recovery'].includes(this.state.screen)) return;
    this.cancel();
    clearTimeout(this.levelTimer);
    this.enemyClock.reset();
    this.update({trainingReward:null,streak:0,specialFlash:false,brokenFrom:0,levelCelebration:null, combat: null, purchase: null, reputationNotice: null, backgroundDraft:null,appearanceDraft: null, screen: 'hero', question: null, input: '', mistakes: 0, feedback: 'answering', levelUp: null });
    this.presentReputation();this.presentLevel();
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
      const special=this.state.streak+1>=CONFIG.special.threshold;
      const streak=special?0:this.state.streak+1;
      const damage=damageFor(before)*(special?CONFIG.special.multiplier:1);
      const event:Attack={heroId:this.state.activeHeroId!,sessionId:this.state.sessionId,questionId:question.id,damage,kind:WEAPONS[before.weapon].kind,special};
      if (this.state.screen === 'arena') {
        const combat = this.state.combat!;
        const enemyHp = Math.max(0, combat.enemyHp - damage);
        const won = enemyHp === 0;
        const victory = won ? awardVictory(before, combat.enemyId) : null;
        this.update({streak:won?0:streak,specialFlash:special,brokenFrom:0, feedback: 'correct', combat: { ...combat, enemyHp, outcome: won ? 'won' : 'active', reward: victory?.reward ?? null },
          ...(victory ? { hero: victory.hero } : {}) });
        this.later(CONFIG.timing.correct, () => {
          if (won) { this.update({ combat: { ...this.state.combat!, resultReady: true } }); this.presentReputation(); }
          else this.newQuestion();
        });
        this.attackListeners.forEach(listener => listener(event));
        return;
      }
      const result=trainHit(before.training,damage);
      const hero = grantXp({...before,training:result.training}, CONFIG.progression.xpPerAnswer+result.bonus);
      this.update({trainingReward:{count:result.count,bonus:result.bonus},streak,specialFlash:special,brokenFrom:0, feedback: 'correct', hero });
      this.attackListeners.forEach(listener => listener(event));
      this.later(CONFIG.timing.correct, () => {
        this.newQuestion();
        if (hero.level > before.level) {
          clearTimeout(this.levelTimer);
          this.update({ levelUp: hero.level });
          const heroId=this.state.activeHeroId;
          this.levelTimer = setTimeout(() => {if(this.state.activeHeroId===heroId&&this.state.screen==='training')this.update({levelUp:null});}, CONFIG.timing.levelBanner);
        }
      });
    } else {
      const nextMistakes = mistakes + 1;
      this.update({brokenFrom:this.state.streak,streak:0,specialFlash:false, feedback: nextMistakes === 1 ? 'first-error' : 'second-error', mistakes: nextMistakes });
      this.later(CONFIG.timing.wrong, () => this.update({
        brokenFrom:0,input: '', feedback: nextMistakes === 1 ? 'answering' : 'reveal',
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
    this.update({screen:'arena-select',reputationNotice:null,selectedEnemy:null,combat:null,question:null,levelUp:null});
  }
  selectEnemy(id: EnemyId) {
    const {hero,screen,combat}=this.state;
    if (!hero || !isUnlocked(hero,id) || !(screen==='arena-select' || (screen==='arena' && combat?.resultReady))) return false;
    this.cancel(); this.enemyClock.reset();
    this.update({screen:'arena-intro',reputationNotice:null,selectedEnemy:id,combat:null,question:null});
    return true;
  }
  startArena() {
    const {hero,selectedEnemy,screen,combat}=this.state;
    if (!hero || !selectedEnemy || !isUnlocked(hero,selectedEnemy) || !(screen==='arena-intro' || (screen==='arena' && combat?.resultReady))) return;
    this.cancel(); clearTimeout(this.levelTimer); this.enemyClock.reset();
    const enemy=enemyById(selectedEnemy), id=++this.serial, heroId=this.state.activeHeroId;
    this.enemyClock=new EnemyClock(enemy.interval,()=>{if(this.state.activeHeroId===heroId&&this.state.combat?.id===id)this.enemyHit();});
    this.update({trainingReward:null,sessionId:id,streak:0,specialFlash:false,brokenFrom:0,levelCelebration:null, screen:'arena',reputationNotice:null,levelUp:null,
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
    this.update({...(hp===0?{streak:0,specialFlash:false,brokenFrom:0}:{}), combat: { ...combat, hp, outcome: hp === 0 ? 'lost' : 'active', resultReady: hp === 0 } });
    this.enemyListeners.forEach(listener => listener(damage));
  }
  openShop() {
    const { screen, hero, combat } = this.state;
    if (!hero || !(screen === 'hero' || (screen === 'arena' && combat?.resultReady))) return;
    this.cancel(); clearTimeout(this.levelTimer); this.enemyClock.reset();
    this.update({ shopReady:true,revealedOffer:null,shopSession:this.state.shopSession+1, screen: 'shop', reputationNotice: null, combat: null, question: null, purchase: null, levelUp: null });
  }
  buy(id: WeaponId, context: ShopContext) {
    if(!this.validShopContext(context)||!this.state.shopReady)return false;
    if (this.state.screen !== 'shop' || !this.state.hero || this.state.purchase) return false;
    const bought = buyWeapon(this.state.hero, id);
    if (!bought) return false;
    this.update(bought);
    return true;
  }
  finishShoppingCelebration(context: ShopContext) {
    if(!this.validShopContext(context)||this.state.screen!=='shop'||!this.state.purchase||!this.state.hero)return;
    const revealedOffer=nextWeapon(this.state.hero,WEAPONS[this.state.purchase.weapon].kind);
    this.update({purchase:null,revealedOffer,shopReady:false});
    clearTimeout(this.shopTimer);
    this.shopTimer=setTimeout(()=>{if(this.validShopContext(context)&&this.state.screen==='shop')this.update({shopReady:true});},500);
  }
  equip(id: WeaponId, context: ShopContext) {
    if(!this.validShopContext(context))return;
    if (this.state.screen !== 'shop' || !this.state.hero || this.state.purchase) return;
    const hero = equipOwned(this.state.hero, id);
    if (hero !== this.state.hero) this.update({ hero });
  }
  chooseGoal(id: WeaponId | null, context: ShopContext) {
    if(!this.validShopContext(context))return;
    if (this.state.screen !== 'shop' || !this.state.hero || this.state.purchase) return;
    const hero = setGoal(this.state.hero, id);
    if (hero !== this.state.hero) this.update({ hero });
  }
  openAppearance() {
    if (this.state.screen !== 'hero' || !this.state.hero) return;
    this.update({screen:'appearance',reputationNotice:null,appearanceDraft:{...this.state.hero.appearance},backgroundDraft:{...this.state.hero.background}});
  }
  editAppearance(appearance: Appearance) {
    if (this.state.screen !== 'appearance' || !validAppearance(appearance)) return false;
    this.update({appearanceDraft:{...appearance}}); return true;
  }
  editBackground(background:Background){
    if(this.state.screen!=='appearance'||!validBackground(background))return false;
    this.update({backgroundDraft:{...background}});return true;
  }
  saveAppearance() {
    const {hero,appearanceDraft,backgroundDraft,screen}=this.state;
    if (!hero || screen!=='appearance' || !validAppearance(appearanceDraft)||!validBackground(backgroundDraft)) return false;
    this.update({hero:{...hero,background:{...backgroundDraft},appearance:{...appearanceDraft},color:appearanceDraft.clothes},screen:'hero',backgroundDraft:null,appearanceDraft:null});
    return true;
  }
  private presentLevel() {
    const {hero,screen,activeHeroId,profiles}=this.state;
    const profile=profiles.find(p=>p.id===activeHeroId);
    if(!hero||screen!=='hero'||!profile||hero.level<=(profile.seenLevel??hero.level))return;
    this.update({levelCelebration:hero.level,profiles:profiles.map(p=>p.id===activeHeroId?{...p,seenLevel:hero.level}:p)});
  }
  private presentReputation() {
    const {hero,screen,combat}=this.state;
    if (!hero || !(screen==='hero' || (screen==='arena' && combat?.resultReady)) || !pendingReputation(hero)) return;
    this.update({hero:acknowledgeReputation(hero),reputationNotice:heroChronicle(hero).title});
  }
  dismissReputation() { this.update({reputationNotice:null}); }
  dismissEquipmentNotice() {
    this.update({equipmentNotice:null,profiles:this.state.profiles.map(p=>p.id===this.state.activeHeroId?{...p,notice:undefined}:p)});
  }
  spend(attribute: Attribute) {
    const { hero, screen } = this.state;
    if (!hero || screen !== 'hero') return;
    const updated = spendPoint(hero, attribute);
    if (updated !== hero) this.update({ hero: updated });
  }
  private newQuestion() {
    this.cancel();
    this.update({trainingReward:null,specialFlash:false,brokenFrom:0, question: makeQuestion(++this.serial, this.random), input: '', mistakes: 0, feedback: 'answering' });
  }
  dispose() {
    this.cancel();
    clearTimeout(this.shopTimer);
    clearTimeout(this.levelTimer);
    this.listeners.clear();
    this.attackListeners.clear();
    this.enemyListeners.clear();
    this.enemyClock.reset();
  }
}

export const game = new GameStore(Math.random, isHeroPackTest ? heroPackStorage() : browserStorage());
