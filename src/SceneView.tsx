import {ARENAS,arenaIndex} from './arenas';
import { DEFAULT_APPEARANCE, type Appearance } from './appearance';
import { enemyShapes } from './enemyVisuals';
import { enemyById, type EnemyId } from './enemies';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { makeBackground, makeDummy, makeHero } from './art';
import { CONFIG, type HeroColor } from './config';
import { game, type Attack } from './store';
import { WEAPONS } from './weapons';
import { weaponEffectColor } from './weaponVisuals';
import type { WeaponId } from './progression';
import { sound } from './sound';

type Props = { thumbnail?: boolean; appearance?: Appearance; color: HeroColor; weapon?: WeaponId; training?: boolean; arena?: boolean; enemyId?: EnemyId; encounter?: number; reduced: boolean };

export function SceneView({ thumbnail = false, color, appearance = DEFAULT_APPEARANCE, weapon = 'stick', training = false, arena = false, enemyId = 'goran', encounter, reduced }: Props) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    let disposed = false;
    let detachAttack = () => {};
    class ForestScene extends Phaser.Scene {
      create() {
        if (disposed) return;
        const width = training ? 720 : 600;
        const height = training ? 420 : 560;
        makeBackground(this, width, height, training);
        if (arena && enemyById(enemyId).boss) {
          const banners=this.add.graphics();
          banners.fillStyle(0x502e50,.35).fillRect(0,0,width,height);
          for(const x of [70,620]) { banners.fillStyle(0x934e65).fillRect(x,20,32,114); banners.fillStyle(0xe3c274).fillTriangle(x,134,x+32,134,x+16,157); banners.lineStyle(3,0xe3c274).strokeRect(x,20,32,114); }
        }
        if(arena){
         const theme=ARENAS[arenaIndex(enemyById(enemyId).number)],index=theme.id,ink=parseInt(theme.accent.slice(1),16),env=this.add.graphics();
         if(index)env.fillStyle(parseInt(theme.background.slice(1),16)).fillRect(0,0,width,height);
         env.lineStyle(4,ink,.35);env.fillStyle(ink,.25);
         for(let i=0;i<5;i++){const x=35+i*150;
          if(index===1){env.fillEllipse(x,345,100,24);env.lineBetween(x,340,x+12,220);env.fillCircle(x+14,205,13);}
          if(index===2){env.fillRect(x,70,80,280);env.fillRect(x-8,55,24,30);env.fillRect(x+63,55,24,30);env.strokeRect(x+23,110,35,60);}
          if(index===3){env.fillTriangle(x,0,x+45,180+(i%2)*55,x+85,0);env.fillTriangle(x,350,x+30,230,x+60,350);}
          if(index===4){env.strokeEllipse(x,320,140,30);env.strokeEllipse(x+50,350,120,24);env.fillCircle(x,95+i*15,10+i*3);}
          if(index===5){env.beginPath().moveTo(x+60,40).lineTo(x+14,130).lineTo(x+47,130).lineTo(x,215).strokePath();env.fillEllipse(x,45,145,50);}
          if(index===6){env.fillTriangle(x,330,x+35,100,x+70,330);env.strokeTriangle(x+10,330,x+35,140,x+50,330);}
          if(index===7){env.fillTriangle(x-45,350,x+40,165,x+115,350);env.lineStyle(7,0xf6ad63,.6).beginPath().moveTo(x+40,170).lineTo(x+25,230).lineTo(x+53,280).lineTo(x+38,350).strokePath();}
          if(index===8){env.fillCircle(x,55+i*25,4);env.strokeCircle(x+32,130,15+i*3);env.lineBetween(x-8,55+i*25,x+8,55+i*25);}
          if(index===9){env.fillRect(x,45,20,290);env.strokeCircle(x+10,45,28);env.lineBetween(x+10,335,x+75,380);}
         }
         if(index)env.fillStyle(ink,.15).fillEllipse(360,365,650,65);
        }
        const homeX = training ? 195 : 290;
        const homeY = training ? 352 : 450;
        this.add.ellipse(homeX, homeY, training ? 100 : 156, 19, 0x1b3932, .35);
        const hero = makeHero(this, homeX, homeY, color, weapon, appearance);
        hero.root.setScale(training ? 1.03 : 1.62);
        const idle = reduced ? null : this.tweens.add({
          targets: hero.root, y: homeY - (training ? 4 : 6),
          duration: CONFIG.timing.idle, yoyo: true, repeat: -1, ease: 'Sine.inOut',
        });
        if (!training) return;
        this.add.ellipse(530, homeY, 110, 18, 0x1b3932, .35);
        let dummy = arena ? this.add.container(530,homeY) : makeDummy(this,530,homeY,game.getSnapshot().hero?.training);
        if(arena) {
          const g=this.add.graphics(); dummy.add(g);
          for(const shape of enemyShapes(enemyId)) {
            g.fillStyle(Number.parseInt(shape.fill.slice(1),16),shape.opacity??1);
            if(shape.type==='polygon') g.fillPoints(shape.points.map(([x,y])=>new Phaser.Geom.Point(x,y)),true);
            else if(shape.type==='ellipse') g.fillEllipse(shape.x,shape.y,shape.width,shape.height);
            else g.fillRect(shape.x,shape.y,shape.width,shape.height);
          }
        }
        if (arena && !reduced) this.tweens.add({ targets: dummy, scaleY: .96, scaleX: 1.04, duration: CONFIG.timing.idle, yoyo: true, repeat: -1 });
        const restArmAngle=hero.arm.angle;
        const identity=game.getSnapshot();
        const validEvent=(event:Attack)=>!disposed && event.heroId===identity.activeHeroId && event.sessionId===identity.sessionId && game.getSnapshot().activeHeroId===event.heroId && game.getSnapshot().sessionId===event.sessionId && game.getSnapshot().question?.id===event.questionId;
        const hit = (event: Attack) => {
          if(!validEvent(event))return;
          if (!game.getSnapshot().combat?.paused) sound.play('hit');
          const impactColor = weaponEffectColor(weapon);
          const ring = this.add.circle(527, 240, event.special?40:24).setStrokeStyle(event.special?7:4, impactColor);
          const reward=!arena?game.getSnapshot().trainingReward:null;
          if(reward?.count){
           sound.play('break');
           if(reduced)dummy.setAlpha(.25);else{this.tweens.add({targets:dummy,angle:65,scaleY:.15,alpha:.25,duration:280});for(let i=0;i<6;i++){const chip=this.add.rectangle(530,250,12,19,0xdac18b);this.tweens.add({targets:chip,x:470+i*22,y:350,angle:i*51,alpha:0,duration:400,onComplete:()=>chip.destroy()});}}
          }
          if(!arena)this.time.delayedCall(reward?.count?450:120,()=>{if(!validEvent(event))return;dummy.destroy();dummy=makeDummy(this,530,homeY,game.getSnapshot().hero?.training);});
          const defeated = arena && game.getSnapshot().combat?.outcome === 'won';
          if (defeated) {
            this.tweens.killTweensOf(dummy);
            if (reduced) dummy.setAlpha(.4);
            else this.tweens.add({ targets: dummy, scaleY: .22, scaleX: 1.18, alpha: .4, duration: CONFIG.timing.defeat, ease: 'Sine.out' });
          }
          const text = this.add.text(527, 135, event.special?`SUPER!\n−${event.damage}`:`−${event.damage}`, {
            fontFamily: 'Georgia, serif', fontSize: event.special?'52px':'44px', fontStyle: 'bold', align:'center',
            color: '#fff3b9', stroke: '#473a2c', strokeThickness: 5,
          }).setOrigin(.5);
          if (reduced) {
            this.time.delayedCall(CONFIG.timing.impact, () => ring.destroy());
            this.time.delayedCall(CONFIG.timing.damageFloat, () => text.destroy());
            return;
          }
          this.tweens.add({ targets: ring, scale: 2, alpha: 0, duration: event.special?CONFIG.special.impact:CONFIG.timing.impact, onComplete: () => ring.destroy() });
          for (let i = 0; i < (event.special?8:6); i++) {
            const angle = i * Math.PI * 2 / (event.special?8:6);
            const spark = this.add.circle(527, 240, 4, impactColor);
            this.tweens.add({ targets: spark, x: 527 + Math.cos(angle) * (event.special?90:60), y: 240 + Math.sin(angle) * (event.special?70:48), alpha: 0, duration: CONFIG.timing.impact, onComplete: () => spark.destroy() });
          }
          this.tweens.add({ targets: text, y: 87, alpha: 0, duration: event.special?CONFIG.special.damageFloat:CONFIG.timing.damageFloat, ease: 'Cubic.out', onComplete: () => text.destroy() });
          this.tweens.add({ targets: dummy, angle: event.special?18:9, duration: CONFIG.timing.hit, yoyo: true, repeat: 1, ease: 'Sine.inOut' });
          const flash = this.add.graphics();
          flash.lineStyle(7, 0xffdf8b, .95).beginPath().moveTo(469, 218).lineTo(444, 205).moveTo(479, 188).lineTo(467, 166).moveTo(481, 248).lineTo(456, 265).strokePath();
          this.tweens.add({ targets: flash, alpha: 0, duration: CONFIG.timing.attackReturn, onComplete: () => flash.destroy() });
        };
        const unsubscribe = game.onAttack(event => {
          if(!validEvent(event))return;
          if (event.kind === 'magic') {
            sound.play('magic');
            const projectile = this.add.container(reduced ? 510 : 244, 217);
            const glow = this.add.graphics();
            glow.fillStyle(weaponEffectColor(weapon), .25).fillCircle(0, 0, 25);
            glow.fillStyle(weaponEffectColor(weapon)).fillCircle(0, 0, 12);
            glow.fillStyle(0xf1e8ff).fillCircle(-3, -3, 6);
            projectile.add(glow);
            if(event.special&&!reduced){
              projectile.setScale(1.8);
              const charge=this.add.circle(244,217,32,weaponEffectColor(weapon),.45);
              this.tweens.add({targets:charge,scale:1.25,alpha:0,duration:CONFIG.special.windup,onComplete:()=>charge.destroy()});
            }
            if (reduced) {
              hit(event);
              this.time.delayedCall(CONFIG.timing.projectile, () => projectile.destroy());
            } else {
              this.tweens.add({ targets: hero.arm, angle: 48, duration: CONFIG.timing.attackSwing, yoyo: true });
              this.tweens.add({ targets: projectile, x: 520, delay:event.special?CONFIG.special.windup:0, duration: event.special?CONFIG.special.projectile:CONFIG.timing.projectile, ease: 'Sine.in', onComplete: () => { projectile.destroy(); hit(event); } });
            }
            return;
          }
          if (reduced) { hit(event); return; }
          idle?.pause();
          if(event.special)this.tweens.add({targets:hero.arm,angle:-55,duration:CONFIG.special.windup,ease:'Sine.out'});
          this.tweens.add({
            targets: hero.root, x: 402, delay:event.special?CONFIG.special.windup:0, duration: CONFIG.timing.attackForward, ease: 'Cubic.in',
            onComplete: () => {
              this.tweens.add({ targets: hero.arm, angle: event.special?135:98, duration: CONFIG.timing.attackSwing, yoyo: true, ease: 'Cubic.out' });
              if(event.special){
                const arc=this.add.graphics();arc.lineStyle(12,weaponEffectColor(weapon),.85).beginPath().arc(432,225,105,-1.9,1.1).strokePath();
                this.tweens.add({targets:arc,alpha:0,duration:CONFIG.special.impact,onComplete:()=>arc.destroy()});
              }
              hit(event);
              this.tweens.add({ targets: hero.root, x: homeX, delay: CONFIG.timing.attackSwing, duration: CONFIG.timing.attackReturn, ease: 'Sine.out', onComplete: () => {hero.arm.setAngle(restArmAngle);idle?.resume();} });
            },
          });
        });
        const offEnemy = arena ? game.onEnemyAttack(damage => {
          sound.play('hurt');
          const text = this.add.text(homeX, 135, `−${damage}`, { fontFamily: 'Georgia, serif', fontSize: '44px', color: '#ffd4b8', stroke: '#473a2c', strokeThickness: 5 }).setOrigin(.5);
          if (reduced) this.time.delayedCall(CONFIG.timing.damageFloat, () => text.destroy());
          else {
            this.tweens.add({ targets: text, y: 87, alpha: 0, duration: CONFIG.timing.damageFloat, onComplete: () => text.destroy() });
            this.tweens.add({ targets: dummy, x: homeX + 80, duration: CONFIG.timing.attackForward, yoyo: true, hold: CONFIG.timing.hit });
            this.tweens.add({ targets: hero.root, angle: -8, duration: CONFIG.timing.hit, yoyo: true, repeat: 1 });
          }
        }) : () => {};
        detachAttack = () => { unsubscribe(); offEnemy(); };
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, detachAttack);
        this.events.once(Phaser.Scenes.Events.DESTROY, detachAttack);
      }
    }
    const instance = new Phaser.Game({
      type: thumbnail ? Phaser.CANVAS : Phaser.AUTO,
      parent: host.current,
      width: training ? 720 : 600,
      height: training ? 420 : 560,
      backgroundColor: '#264d48',
      transparent: false,
      antialias: true,
      scene: ForestScene,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      audio: { noAudio: true },
      input: { keyboard: false, mouse: false, touch: false },
      banner: false,
    });
    const resize = new ResizeObserver(([entry]) => {
      if (!disposed && instance.isBooted) instance.scale.setParentSize(entry.contentRect.width, entry.contentRect.height);
    });
    resize.observe(host.current);
    return () => {
      disposed = true;
      resize.disconnect();
      // Phaser schedules destruction on its next frame. Detach the gameplay
      // listener and visible canvas now, including during React remounts.
      detachAttack();
      instance.canvas?.remove();
      instance.destroy(true);
    };
  }, [thumbnail, color, appearance, weapon, training, arena, enemyId, encounter, reduced]);

  return <div className={`scene ${training ? 'scene-training' : 'scene-portrait'}`} ref={host}
    role="img" aria-label={`${arena ? `Helten mot ${enemyById(enemyId).name}` : training ? 'Helten mot en treningsdummy' : 'Din helt med fargede klær og skinnstøvler'}, med ${WEAPONS[weapon].name}.`} />;
}
