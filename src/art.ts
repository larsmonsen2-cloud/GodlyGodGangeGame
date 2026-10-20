import Phaser from 'phaser';
import { CONFIG, type HeroColor } from './config';

// Original vector artwork. All screens use this same rig and attachment points.
export const ANCHORS = { head: { x: 0, y: -139 }, hand: { x: 38, y: -84 }, shield: { x: -34, y: -83 }, helmet: { x: 0, y: -173 } };
const color = (hex: string) => Phaser.Display.Color.HexStringToColor(hex).color;

export function makeHero(scene: Phaser.Scene, x: number, y: number, chosen: HeroColor) {
  const palette = CONFIG.colors.find(c => c.id === chosen)!;
  const root = scene.add.container(x, y);
  const body = scene.add.graphics();
  root.add(body);
  // Cape, trousers and oversized leather boots.
  body.fillStyle(0x284f49).fillTriangle(-28, -112, -47, -36, 30, -34);
  body.fillStyle(0x333e3c).fillRoundedRect(-24, -53, 19, 44, 7).fillRoundedRect(6, -53, 19, 44, 7);
  body.fillStyle(0x654635).fillRoundedRect(-30, -22, 28, 22, 7).fillRoundedRect(5, -22, 31, 22, 7);
  body.fillStyle(0x9c7150).fillRoundedRect(-28, -23, 24, 7, 3).fillRoundedRect(7, -23, 24, 7, 3);
  // Tunic, collar, sleeve and belt.
  body.fillStyle(color(palette.dark)).fillRoundedRect(-35, -119, 70, 72, 15);
  body.fillStyle(color(palette.value)).fillRoundedRect(-29, -121, 57, 63, 12);
  body.fillStyle(0xece2bb).fillTriangle(-14, -121, 0, -104, 14, -121);
  body.fillStyle(0x6b4935).fillRoundedRect(-33, -62, 66, 11, 3);
  body.fillStyle(0xe6bb68).fillRoundedRect(-6, -64, 14, 15, 3);
  body.fillStyle(0x8a6542).fillRect(-2, -60, 6, 7);
  body.fillStyle(color(palette.dark)).fillRoundedRect(-45, -113, 20, 33, 7);
  body.fillStyle(0xefb986).fillRoundedRect(-44, -88, 17, 24, 7);
  // Head, ears, unruly hair and a determined little smile.
  body.fillStyle(0xefb986).fillCircle(-30, -143, 10).fillCircle(30, -143, 10);
  body.fillStyle(0xf4c897).fillRoundedRect(-31, -179, 63, 68, 24);
  body.fillStyle(0x553e32).fillRoundedRect(-34, -186, 68, 34, 13);
  body.fillTriangle(-35, -160, -26, -186, -17, -150);
  body.fillTriangle(-14, -175, 9, -190, 8, -153);
  body.fillTriangle(7, -178, 29, -182, 31, -156);
  body.fillTriangle(-13, -183, 0, -202, 12, -181);
  body.fillStyle(0x273c38).fillRoundedRect(-16, -148, 5, 10, 2).fillRoundedRect(12, -148, 5, 10, 2);
  body.fillStyle(0xe6a17c).fillEllipse(-22, -133, 11, 6).fillEllipse(24, -133, 11, 6);
  body.lineStyle(2.5, 0x935940).beginPath().moveTo(-5, -127).lineTo(2, -124).lineTo(10, -128).strokePath();
  const arm = scene.add.container(ANCHORS.hand.x, ANCHORS.hand.y);
  const weapon = scene.add.graphics();
  // The stick is its own part, attached to the hand. No rules depend on its art.
  weapon.lineStyle(11, 0x674a31).beginPath().moveTo(0, 19).lineTo(3, -73).strokePath();
  weapon.lineStyle(5, 0xb28a53).beginPath().moveTo(-1, 14).lineTo(1, -72).strokePath();
  weapon.lineStyle(5, 0x88613b).beginPath().moveTo(2, -48).lineTo(15, -61).strokePath();
  weapon.fillStyle(0x9db36c).fillEllipse(15, -65, 16, 8);
  const hand = scene.add.graphics();
  hand.fillStyle(color(palette.value)).fillRoundedRect(-13, -29, 19, 24, 7);
  hand.fillStyle(0xf4c897).fillCircle(0, 0, 11);
  arm.add([weapon, hand]);
  arm.setAngle(12);
  root.add(arm);
  return { root, arm, weapon, body };
}

export function makeDummy(scene: Phaser.Scene, x: number, y: number) {
  const root = scene.add.container(x, y);
  const g = scene.add.graphics();
  root.add(g);
  g.fillStyle(0x765536).fillRoundedRect(-8, -144, 16, 143, 3);
  g.fillStyle(0x927144).fillRoundedRect(-45, -13, 90, 13, 5);
  g.lineStyle(13, 0x9f7c49).beginPath().moveTo(-59, -116).lineTo(56, -110).strokePath();
  g.lineStyle(3, 0xd6b877).beginPath().moveTo(-62, -124).lineTo(-73, -142).moveTo(-58, -121).lineTo(-82, -126).moveTo(58, -112).lineTo(77, -125).strokePath();
  g.fillStyle(0xba945b).fillRoundedRect(-34, -140, 68, 89, 20);
  g.fillStyle(0xd7b77d).fillRoundedRect(-29, -145, 58, 86, 17);
  g.lineStyle(3, 0xab824a).strokeRoundedRect(-24, -139, 48, 73, 15);
  g.fillStyle(0xa45d46).fillCircle(0, -102, 22);
  g.fillStyle(0xf0d5a0).fillCircle(0, -102, 14);
  g.fillStyle(0xa45d46).fillCircle(0, -102, 6);
  g.fillStyle(0xd7b77d).fillRoundedRect(-25, -204, 50, 53, 19);
  g.fillStyle(0x82613c).fillRoundedRect(-31, -206, 62, 10, 4);
  g.lineStyle(3, 0x694d34).beginPath().moveTo(-15, -185).lineTo(-7, -177).moveTo(-7, -185).lineTo(-15, -177).moveTo(7, -185).lineTo(15, -177).moveTo(15, -185).lineTo(7, -177).moveTo(-9, -164).lineTo(11, -164).strokePath();
  return root;
}

export function makeBackground(scene: Phaser.Scene, width: number, height: number, training: boolean) {
  const g = scene.add.graphics();
  g.fillStyle(0x264d48).fillRect(0, 0, width, height);
  g.fillStyle(0x426b5e).fillCircle(width * .72, height * .29, 83);
  g.fillStyle(0xc5d4a0, .55).fillCircle(width * .72, height * .24, 39);
  g.fillStyle(0x365e53).fillTriangle(-70, height * .72, 190, 44, 500, height * .72);
  g.fillStyle(0x31594e).fillTriangle(240, height * .73, 510, 70, width + 90, height * .73);
  for (const [x, size] of [[30, 1.1], [107, .8], [width - 38, 1.2], [width - 104, .85]]) {
    g.fillStyle(0x203e38).fillRect(x - 7, height * .25, 14, height * .55);
    g.fillStyle(0x24483e).fillTriangle(x - 64 * size, height * .58, x, height * .03, x + 64 * size, height * .58);
    g.fillStyle(0x294f43).fillTriangle(x - 51 * size, height * .43, x, -10, x + 51 * size, height * .43);
  }
  g.fillStyle(0x3b6050).fillEllipse(width * .5, height * .93, width * 1.45, height * .48);
  g.fillStyle(0x809271).fillEllipse(width * .5, height * .9, width * .77, height * .16);
  g.fillStyle(0xa5ab80, .45).fillEllipse(width * .5, height * .87, width * .67, height * .10);
  for (let i = 0; i < 15; i++) {
    const x = (i * 127 + 33) % width;
    const y = height * .83 + (i * 17 % 65);
    g.lineStyle(2, 0x91a579, .65).beginPath().moveTo(x, y).lineTo(x - 5, y - 8).moveTo(x, y).lineTo(x + 4, y - 12).strokePath();
  }
  if (training) {
    g.lineStyle(2, 0xb0a477, .7).beginPath().moveTo(112, 32).lineTo(355, 76).lineTo(612, 30).strokePath();
    for (let i = 0; i < 7; i++) {
      const x = 158 + i * 66;
      const y = 40 + (3 - Math.abs(3 - i)) * 10;
      g.fillStyle(i % 2 ? 0xd9ad62 : 0x83b3a1).fillTriangle(x, y, x + 25, y + 4, x + 11, y + 35);
    }
  } else {
    g.lineStyle(2, 0xa8b88b, .25).strokeCircle(width / 2, height * .48, 161);
    g.lineStyle(1, 0xa8b88b, .15).strokeCircle(width / 2, height * .48, 172);
  }
  return g;
}
