import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { makeBackground, makeDummy, makeHero } from './art';
import { CONFIG, type HeroColor } from './config';
import { game, type Attack } from './store';

type Props = { color: HeroColor; training?: boolean; reduced: boolean };

export function SceneView({ color, training = false, reduced }: Props) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    let detachAttack = () => {};
    class ForestScene extends Phaser.Scene {
      create() {
        const width = training ? 720 : 600;
        const height = training ? 420 : 560;
        makeBackground(this, width, height, training);
        const homeX = training ? 195 : 290;
        const homeY = training ? 352 : 450;
        this.add.ellipse(homeX, homeY, training ? 100 : 156, 19, 0x1b3932, .35);
        const hero = makeHero(this, homeX, homeY, color);
        hero.root.setScale(training ? 1.03 : 1.62);
        const idle = reduced ? null : this.tweens.add({
          targets: hero.root, y: homeY - (training ? 4 : 6),
          duration: CONFIG.timing.idle, yoyo: true, repeat: -1, ease: 'Sine.inOut',
        });
        if (!training) return;
        this.add.ellipse(530, homeY, 110, 18, 0x1b3932, .35);
        const dummy = makeDummy(this, 530, homeY);
        const hit = (event: Attack) => {
          const text = this.add.text(527, 135, `−${event.damage}`, {
            fontFamily: 'Georgia, serif', fontSize: '44px', fontStyle: 'bold',
            color: '#fff3b9', stroke: '#473a2c', strokeThickness: 5,
          }).setOrigin(.5);
          if (reduced) {
            this.time.delayedCall(CONFIG.timing.damageFloat, () => text.destroy());
            return;
          }
          this.tweens.add({ targets: text, y: 87, alpha: 0, duration: CONFIG.timing.damageFloat, ease: 'Cubic.out', onComplete: () => text.destroy() });
          this.tweens.add({ targets: dummy, angle: 9, duration: CONFIG.timing.hit, yoyo: true, repeat: 1, ease: 'Sine.inOut' });
          const flash = this.add.graphics();
          flash.lineStyle(7, 0xffdf8b, .95).beginPath().moveTo(469, 218).lineTo(444, 205).moveTo(479, 188).lineTo(467, 166).moveTo(481, 248).lineTo(456, 265).strokePath();
          this.tweens.add({ targets: flash, alpha: 0, duration: CONFIG.timing.attackReturn, onComplete: () => flash.destroy() });
        };
        const unsubscribe = game.onAttack(event => {
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
        detachAttack = unsubscribe;
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
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
    return () => {
      // Phaser schedules destruction on its next frame. Detach the gameplay
      // listener and visible canvas now, including during React remounts.
      detachAttack();
      instance.canvas?.remove();
      instance.destroy(true);
    };
  }, [color, training, reduced]);

  return <div className={`scene ${training ? 'scene-training' : 'scene-portrait'}`} ref={host}
    role="img" aria-label={training ? 'Helten med trepinnen sin, vendt mot en treningsdummy i skogen.' : 'Din helt med fargede klær, skinnstøvler og en ambisiøs trepinne.'} />;
}
