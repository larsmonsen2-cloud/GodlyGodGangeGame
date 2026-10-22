import {describe,it,expect,vi,afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fitPackFrame,ALL_PACKS,manifest,packLayers,validPack,PACK_ANCHOR,PACK_UNIT,PACK_HEIGHT} from '../src/heroPackGeometry';
import {heroPackTestMode} from '../src/previewMode';
import {heroPackStorage} from '../src/heroPackSeed';
import {loadLibrary} from '../src/storage';
import {battleFrame} from '../src/sceneLayout';

afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
describe('Illustrated hero preview',()=>{
 it('uses all eight valid combinations and preserves the supplied layer registration',()=>{
  expect(ALL_PACKS).toHaveLength(8);
  for(const s of ALL_PACKS){expect(validPack(s)).toBe(true);const layers=packLayers(s);expect(layers.map(x=>x.key)).toEqual([manifest.choices.outfit[s.outfit],'head',manifest.choices.hair[s.hair],manifest.choices.weapon[s.weapon]]);expect(layers[1].destination.height).toBe(197.5);expect(layers[0].destination.y).toBe(257.5);}
  expect(validPack({hair:'afro',outfit:'tunic',weapon:'sword'})).toBe(false);
  expect(()=>packLayers({hair:'afro'})).toThrow();
 });
 it('ships the original unmodified transparent PNGs with correct source dimensions',()=>{
  const hashes=['a27d754d40aa0aaa9fa035615d5da623bf20501ce0630c6b6a25fd6fc1d69f92','d52dfc30fae12ec7e50e5bd7c7ee36f605982daedc8830a28752fc5ea40f94d3','5552fb06644a5c47635faa0001f542eb7a92908401a3cd979b474bacff36e089','35c21200aaec88d489499852a18130966f2b1432d41586114e8a305b02d40487','ac04315429e10d79047c1be38823acdfd073d85856504b7f044b974ab6493459','db58ce38644396a3a2976c0df149f288410cc5e5127606161a5a1155ed08e375','e0ae127fcd4d7caf7ab109271c2ca06058729adbbd0407015478861361a902a3'];
  Object.values(manifest.assets).forEach((a,i)=>{const bytes=readFileSync('public/assets/hero-pack-v1/'+a.file);expect(createHash('sha256').update(bytes).digest('hex')).toBe(hashes[i]);expect(bytes.readUInt32BE(16)).toBe(a.sourceSize.width);expect(bytes.readUInt32BE(20)).toBe(a.sourceSize.height);expect(bytes[25]).toBe(6);});
 });
 it('frames the entire mirrored layer rectangles during whole-body lunges',()=>{
  const frame=fitPackFrame(battleFrame('stick',null,240,false,PACK_HEIGHT));
  for(const selection of ALL_PACKS)for(const {destination:r} of packLayers(selection))for(const x of [r.x,r.x+r.width])for(const y of [r.y,r.y+r.height])for(const angle of [-8,0,8])for(const rootX of [155,340]){
   const dx=-(x-PACK_ANCHOR.x)*PACK_UNIT,dy=(y-PACK_ANCHOR.y)*PACK_UNIT,a=angle*Math.PI/180;
   const px=rootX+1.2*(dx*Math.cos(a)-dy*Math.sin(a)),py=350+1.2*(dx*Math.sin(a)+dy*Math.cos(a));
   expect(px).toBeGreaterThanOrEqual(frame.left);expect(px).toBeLessThanOrEqual(frame.left+frame.width);expect(py).toBeGreaterThanOrEqual(frame.top);expect(py).toBeLessThanOrEqual(frame.top+frame.height);
  }
 });
 it('activates only the explicit test route and seeds independent valid memory stores',()=>{
  expect(heroPackTestMode('?test=hero-pack')).toBe(true);for(const search of ['', '?test=phase2','?test=hero','?preview=true'])expect(heroPackTestMode(search)).toBe(false);
  const first=heroPackStorage(),second=heroPackStorage();const library=loadLibrary(first);expect(library.status).toBe('saved');expect(library.notice).toBeUndefined();expect(library.profiles).toHaveLength(2);expect(library.profiles.map(p=>p.hero.weapon)).toEqual(['stick','wand']);first.setItem('probe','changed');expect(second.getItem('probe')).toBeNull();
 });
 it('never touches browser storage when loading or playing the preview',async()=>{
  vi.resetModules();const access=vi.fn(()=>{throw Error('Real storage must not be accessed');});
  vi.stubGlobal('window',{location:{search:'?test=hero-pack'},get localStorage(){return access();}});
  const {game}=await import('../src/store');const {sound}=await import('../src/sound');
  game.selectHero('pack-melee');game.startTraining();game.digit('1');game.submit();game.leaveTraining();game.openHeroes();game.selectHero('pack-magic');sound.setEnabled(false);
  expect(game.getSnapshot().hero?.weapon).toBe('wand');expect(access).not.toHaveBeenCalled();game.dispose();
 });
 it('reports image failures, retries and shares loaded source images',async()=>{
  vi.resetModules();let fail=true,count=0;
  vi.stubGlobal('Image',class {onload=()=>{};onerror=()=>{};set src(_value){count++;queueMicrotask(()=>fail?this.onerror():this.onload());}});
  const {loadPackImages}=await import('../src/heroPackImages');
  await expect(loadPackImages()).rejects.toThrow('Kunne ikke laste');fail=false;
  const [a,b]=await Promise.all([loadPackImages(),loadPackImages()]);expect(a).toBe(b);expect(Object.keys(a)).toHaveLength(7);expect(count).toBe(14);
 });
});
