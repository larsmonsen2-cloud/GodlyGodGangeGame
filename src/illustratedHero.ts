import type Phaser from 'phaser';
import {PACK_ANCHOR,PACK_UNIT,manifest} from './heroPackGeometry';
export function makeIllustratedHero(scene:Phaser.Scene,x:number,y:number,image:HTMLImageElement,mirror:boolean){
 const texture='illustrated-hero';if(!scene.textures.exists(texture))scene.textures.addImage(texture,image);
 const root=scene.add.container(x,y);
 const layers=scene.add.container(0,0).setScale(mirror?-1:1,1);
 layers.add(scene.add.image(-PACK_ANCHOR.x*PACK_UNIT,-PACK_ANCHOR.y*PACK_UNIT,texture).setOrigin(0).setDisplaySize(manifest.canvas.width*PACK_UNIT,manifest.canvas.height*PACK_UNIT));
 root.add(layers);
 // The supplied hand is already in the image. Existing arm tweens target an empty
 // container; whole-figure lunges and tilts retain the existing combat timeline.
 const arm=scene.add.container(0,0);root.add(arm);
 return {root,arm};
}
