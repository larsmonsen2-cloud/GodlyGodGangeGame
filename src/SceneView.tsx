import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { makeBackground, makeDummy, makeHero, makeSlime } from './art';
import { CONFIG, type HeroColor } from './config';
import { game, type Attack } from './store';
import { WEAPONS } from './weapons';
import { weaponEffectColor } from './weaponVisuals';
import type { WeaponId } from './progression';
import { sound } from './sound';

type Props = { color: HeroColor; weapon?: WeaponId; training?: boolean; arena?: boolean; encounter?: number; reduced: boolean };

export function SceneView({ color, weapon = 'stick', training = false, arena = false, encounter, reduced }: Props) {
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
        const homeX = training ? 195 : 290;
        const homeY = training ? 352 : 450;
        this.add.ellipse(homeX, homeY, training ? 100 : 156, 19, 0x1b3932, .35);
        const hero = makeHero(this, homeX, homeY, color, weapon);
        hero.root.setScale(training ? 1.03 : 1.62);
        const idle = reduced ? null : this.tweens.add({
          targets: hero.root, y: homeY - (training ? 4 : 6),
          duration: CONFIG.timing.idle, yoyo: true, repeat: -1, ease: 'Sine.inOut',
        });
        if (!training) return;
        this.add.ellipse(530, homeY, 110, 18, 0x1b3932, .35);
        const dummy = arena ? makeSlime(this, 530, homeY) : makeDummy(this, 530, homeY);
        if (arena && !reduced) this.tweens.add({ targets: dummy, scaleY: .96, scaleX: 1.04, duration: CONFIG.timing.idle, yoyo: true, repeat: -1 });
        const hit = (event: Attack) => {
          if (!game.getSnapshot().combat?.paused) sound.play('hit');
          const impactColor = weaponEffectColor(weapon);
          const ring = this.add.circle(527, 240, 24).setStrokeStyle(4, impactColor);
          const defeated = arena && game.getSnapshot().combat?.outcome === 'won';
          if (defeated) {
            this.tweens.killTweensOf(dummy);
            if (reduced) dummy.setAlpha(.4);
            else this.tweens.add({ targets: dummy, scaleY: .22, scaleX: 1.18, alpha: .4, duration: CONFIG.timing.defeat, ease: 'Sine.out' });
          }
          const text = this.add.text(527, 135, `−${event.damage}`, {
            fontFamily: 'Georgia, serif', fontSize: '44px', fontStyle: 'bold',
            color: '#fff3b9', stroke: '#473a2c', strokeThickness: 5,
          }).setOrigin(.5);
          if (reduced) {
            this.time.delayedCall(CONFIG.timing.impact, () => ring.destroy());
            this.time.delayedCall(CONFIG.timing.damageFloat, () => text.destroy());
            return;
          }
          this.tweens.add({ targets: ring, scale: 2, alpha: 0, duration: CONFIG.timing.impact, onComplete: () => ring.destroy() });
          for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const spark = this.add.circle(527, 240, 4, impactColor);
            this.tweens.add({ targets: spark, x: 527 + Math.cos(angle) * 60, y: 240 + Math.sin(angle) * 48, alpha: 0, duration: CONFIG.timing.impact, onComplete: () => spark.destroy() });
          }
          this.tweens.add({ targets: text, y: 87, alpha: 0, duration: CONFIG.timing.damageFloat, ease: 'Cubic.out', onComplete: () => text.destroy() });
          this.tweens.add({ targets: dummy, angle: 9, duration: CONFIG.timing.hit, yoyo: true, repeat: 1, ease: 'Sine.inOut' });
          const flash = this.add.graphics();
          flash.lineStyle(7, 0xffdf8b, .95).beginPath().moveTo(469, 218).lineTo(444, 205).moveTo(479, 188).lineTo(467, 166).moveTo(481, 248).lineTo(456, 265).strokePath();
          this.tweens.add({ targets: flash, alpha: 0, duration: CONFIG.timing.attackReturn, onComplete: () => flash.destroy() });
        };
        const unsubscribe = game.onAttack(event => {
          if (event.kind === 'magic') {
            sound.play('magic');
            const projectile = this.add.container(reduced ? 510 : 244, 217);
            const glow = this.add.graphics();
            glow.fillStyle(weaponEffectColor(weapon), .25).fillCircle(0, 0, 25);
            glow.fillStyle(weaponEffectColor(weapon)).fillCircle(0, 0, 12);
            glow.fillStyle(0xf1e8ff).fillCircle(-3, -3, 6);
            projectile.add(glow);
            if (reduced) {
              hit(event);
              this.time.delayedCall(CONFIG.timing.projectile, () => projectile.destroy());
            } else {
              this.tweens.add({ targets: hero.arm, angle: 48, duration: CONFIG.timing.attackSwing, yoyo: true });
              this.tweens.add({ targets: projectile, x: 520, duration: CONFIG.timing.projectile, ease: 'Sine.in', onComplete: () => { projectile.destroy(); hit(event); } });
            }
            return;
          }
          if (reduced) { hit(event); return; }
          idle?.pause();
          this.tweens.add({
            targets: hero.root, x: 402, duration: CONFIG.timing.attackForward, ease: 'Cubic.in',
            onComplete: () => {
              this.tweens.add({ targets: hero.arm, angle: 98, duration: CONFIG.timing.attackSwing, yoyo: true, ease: 'Cubic.out' });
              hit(event);
              this.tweens.add({ targets: hero.root, x: homeX, delay: CONFIG.timing.attackSwing, duration: CONFIG.timing.attackReturn, ease: 'Sine.out', onComplete: () => idle?.resume() });
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
      type: Phaser.AUTO,
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
  }, [color, weapon, training, arena, encounter, reduced]);

  return <div className={`scene ${training ? 'scene-training' : 'scene-portrait'}`} ref={host}
    role="img" aria-label={`${arena ? 'Helten mot slimklumpen Gøran' : training ? 'Helten mot en treningsdummy' : 'Din helt med fargede klær og skinnstøvler'}, med ${WEAPONS[weapon].name}.`} />;
}
