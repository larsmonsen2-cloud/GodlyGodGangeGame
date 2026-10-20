import { DEFAULT_APPEARANCE, SKINS, HAIR_COLORS, type Appearance } from './appearance';
import Phaser from 'phaser';
import { CONFIG, type HeroColor } from './config';
import { weaponShapes } from './weaponVisuals';
import type { WeaponId } from './progression';

// Original vector artwork. All screens use this same rig and attachment points.
export const ANCHORS = { head: { x: 0, y: -139 }, hand: { x: 38, y: -84 }, shield: { x: -34, y: -83 }, helmet: { x: 0, y: -173 } };
const color = (hex: string) => Phaser.Display.Color.HexStringToColor(hex).color;

export function makeHero(scene: Phaser.Scene, x: number, y: number, chosen: HeroColor, equipped: WeaponId = 'stick', appearance: Appearance = DEFAULT_APPEARANCE) {
  const palette = CONFIG.colors.find(c => c.id === chosen)!;
  const root = scene.add.container(x, y);
  const body = scene.add.graphics();
  root.add(body);
  const skin = color(SKINS.find(item=>item.id===appearance.skin)!.value);
  const hair = color(HAIR_COLORS.find(item=>item.id===appearance.hairColor)!.value);
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
  body.fillStyle(skin).fillRoundedRect(-44, -88, 17, 24, 7);
  // Long hair behind the head; front hair and facial detail remain separate layers.
  if (appearance.hairStyle==='long') body.fillStyle(hair).fillRoundedRect(-39,-187,78,92,20);
  body.fillStyle(skin).fillCircle(-30,-143,10).fillCircle(30,-143,10);
  body.fillStyle(skin).fillRoundedRect(-31,-179,63,68,24);
  const face=scene.add.graphics(); root.add(face);
  const faceInk = appearance.skin==='umber'||appearance.skin==='chestnut' ? 0xf2dcc0 : 0x273c38;
  if(appearance.expression==='stern'||appearance.expression==='worried') face.fillStyle(0xfff2db).fillEllipse(-14,-143,12,16).fillEllipse(15,-143,12,16);
  else if(appearance.expression==='sly') face.fillStyle(0xfff2db).fillEllipse(-14,-143,10,15);
  face.lineStyle(3,faceInk);
  if(appearance.expression==='stern') {
    face.fillStyle(0x273c38).fillRoundedRect(-17,-147,6,10,2).fillRoundedRect(12,-147,6,10,2);
    face.beginPath().moveTo(-22,-155).lineTo(-8,-150).moveTo(10,-150).lineTo(23,-155).strokePath();
    face.beginPath().moveTo(-8,-125).lineTo(10,-125).strokePath();
  } else if(appearance.expression==='worried') {
    face.fillStyle(0x273c38).fillEllipse(-14,-142,9,13).fillEllipse(15,-142,9,13);
    face.beginPath().moveTo(-23,-154).lineTo(-9,-159).moveTo(10,-159).lineTo(24,-154).strokePath();
    face.beginPath().moveTo(-8,-123).lineTo(1,-128).lineTo(10,-123).strokePath();
  } else if(appearance.expression==='proud') {
    face.beginPath().moveTo(-22,-148).lineTo(-8,-148).moveTo(9,-148).lineTo(23,-148).strokePath();
    face.beginPath().moveTo(-23,-158).lineTo(-8,-161).moveTo(10,-161).lineTo(24,-158).strokePath();
    face.beginPath().moveTo(-10,-128).lineTo(0,-122).lineTo(13,-128).strokePath();
  } else {
    face.fillStyle(0x273c38).fillRoundedRect(-16,-148,5,10,2);
    face.beginPath().moveTo(10,-141).lineTo(16,-145).lineTo(22,-141).strokePath();
    face.beginPath().moveTo(-21,-155).lineTo(-8,-157).moveTo(10,-158).lineTo(23,-153).strokePath();
    face.beginPath().moveTo(-8,-127).lineTo(2,-124).lineTo(14,-131).strokePath();
  }
  const hairLayer=scene.add.graphics(); root.add(hairLayer); hairLayer.fillStyle(hair);
  if(appearance.hairStyle==='tousled') {
    hairLayer.fillRoundedRect(-34,-186,68,31,13).fillTriangle(-35,-160,-26,-186,-17,-150).fillTriangle(-14,-175,9,-190,8,-153).fillTriangle(7,-178,29,-182,31,-156).fillTriangle(-13,-183,0,-202,12,-181);
  } else if(appearance.hairStyle==='short') {
    hairLayer.fillRoundedRect(-32,-182,65,22,11).fillRect(-32,-168,7,22).fillRect(26,-168,7,22);
  } else if(appearance.hairStyle==='curls') {
    for(const [cx,cy,r] of [[-29,-172,13],[-20,-187,15],[0,-191,16],[21,-187,15],[32,-172,13]]) hairLayer.fillCircle(cx,cy,r);
  } else if(appearance.hairStyle==='long') {
    hairLayer.fillRoundedRect(-33,-186,67,26,13).fillTriangle(-33,-174,-13,-172,-30,-137).fillTriangle(5,-177,34,-173,31,-137);
  }
  const detail=scene.add.graphics(); root.add(detail); detail.fillStyle(hair);
  if(appearance.detail==='beard') detail.fillTriangle(-26,-130,28,-130,2,-93).fillRoundedRect(-28,-139,10,22,4).fillRoundedRect(20,-139,10,22,4);
  if(appearance.detail==='moustache') detail.fillEllipse(-9,-128,23,10).fillEllipse(12,-128,23,10).fillTriangle(-20,-130,-27,-122,-8,-125).fillTriangle(23,-130,29,-122,11,-125);
  if(appearance.detail==='paint') {detail.lineStyle(5,0x6f9fcc).beginPath().moveTo(-29,-137).lineTo(-16,-131).moveTo(19,-131).lineTo(31,-137).strokePath();detail.lineStyle(3,0xf2dfac).beginPath().moveTo(-28,-129).lineTo(-18,-124).moveTo(20,-124).lineTo(30,-129).strokePath();}
  const arm = scene.add.container(ANCHORS.hand.x, ANCHORS.hand.y);
  const weapon = scene.add.graphics();
  for (const shape of weaponShapes(equipped)) {
    weapon.fillStyle(color(shape.fill), shape.opacity ?? 1);
    if (shape.type === 'polygon') weapon.fillPoints(shape.points.map(([x, y]) => ({ x, y })), true);
    else if (shape.type === 'ellipse') weapon.fillEllipse(shape.x, shape.y, shape.width, shape.height);
    else weapon.fillRect(shape.x, shape.y, shape.width, shape.height);
  }
  const hand = scene.add.graphics();
  hand.fillStyle(color(palette.value)).fillRoundedRect(-13, -29, 19, 24, 7);
  hand.fillStyle(skin).fillCircle(0, 0, 11);
  arm.add([weapon, hand]);
  arm.setAngle(12);
  root.add(arm);
  return { root, arm, weapon, body };
}

export function makeSlime(scene: Phaser.Scene, x: number, y: number) {
  const root = scene.add.container(x, y);
  const g = scene.add.graphics();
  root.add(g);
  g.fillStyle(0x417b72).fillEllipse(0, -30, 173, 61);
  g.fillStyle(0x8fca83).fillEllipse(0, -68, 148, 137);
  g.fillStyle(0xb5e19a).fillEllipse(-21, -95, 90, 67);
  g.fillStyle(0x8fca83).fillCircle(-65, -27, 24).fillCircle(62, -26, 23);
  g.fillStyle(0xe1efb9, .8).fillEllipse(-39, -105, 18, 30).fillCircle(29, -117, 8);
  g.fillStyle(0xf9f1ce).fillEllipse(-26, -74, 31, 35).fillEllipse(28, -74, 31, 35);
  g.fillStyle(0x24483e).fillCircle(-31, -72, 7).fillCircle(23, -72, 7);
  g.lineStyle(5, 0x42694b).beginPath().moveTo(-44, -96).lineTo(-12, -87).moveTo(11, -87).lineTo(43, -96).strokePath();
  g.lineStyle(4, 0x42694b).beginPath().moveTo(-19, -39).lineTo(1, -45).lineTo(20, -39).strokePath();
  g.fillStyle(0xd7b378).fillTriangle(-36, -140, -27, -164, -14, -141).fillTriangle(-14, -141, 1, -174, 15, -141).fillTriangle(15, -141, 30, -164, 38, -140);
  g.fillRoundedRect(-38, -143, 76, 10, 3);
  return root;
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
