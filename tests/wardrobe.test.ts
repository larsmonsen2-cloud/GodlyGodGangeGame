import {describe,it,expect} from 'vitest';
import {DEFAULT_APPEARANCE,HAIR_STYLES,HEADWEAR,OUTFITS,STYLE_PRESETS,normalizeAppearance,rerollAppearance,validAppearance} from '../src/appearance';
import {ORIGINS,GOALS,emptyBackground,backgroundPreview,normalizeBackground} from '../src/background';
import {hairParts,outfitParts,headwearParts,cosmeticHeight} from '../src/cosmeticParts';
import {battleFrame,shapePoints} from '../src/sceneLayout';
import {newHero,grantXp,damageFor} from '../src/progression';
import {heroChronicle,normalizeReputation} from '../src/reputation';
import {loadLibrary,saveLibrary,SAVE_KEY,SAVE_VERSION} from '../src/storage';
import {GameStore} from '../src/store';
const memory=()=>{const m=new Map<string,string>();return {getItem:(k:string)=>m.get(k)??null,setItem:(k:string,v:string)=>{m.set(k,v);}};};
describe('wardrobe save upgrade',()=>{
 it('migrates two v7 heroes without changing progress, IDs or existing appearance',()=>{
  const storage=memory(),base=grantXp(newHero('Sol','berry'),120);
  const hero={...base,gold:300,weapon:'inferno_blade',ownedWeapons:['stick','inferno_blade'],training:{...base.training,hp:16,broken:4},appearance:{skin:'umber',hairStyle:'long',hairColor:'red',expression:'proud',detail:'beard',clothes:'berry'}};
  hero.reputation=normalizeReputation(hero as never,true);
  const raw=JSON.stringify({version:7,profiles:[{id:'old1',hero,seenLevel:hero.level},{id:'old2',hero:{...hero,name:'Måne',appearance:{...hero.appearance,detail:'moustache'}},seenLevel:hero.level}],lastHeroId:'old2',rejectedProfiles:[]});
  storage.setItem(SAVE_KEY,raw);const loaded=loadLibrary(storage);
  expect(loaded.status).toBe('saved');expect(loaded.notice).toBeUndefined();expect(loaded.lastHeroId).toBe('old2');expect(storage.getItem('gangriket.save.before-v8')).toBe(raw);
  expect(loaded.profiles[0].hero).toMatchObject({...hero,appearance:{...hero.appearance,detail:'none',beard:'long_beard',outfit:'adventurer',headwear:'none'},background:emptyBackground()});
  expect(loaded.profiles[1].hero.appearance.beard).toBe('moustache');expect(loaded.profiles[0].hero.training).toEqual(hero.training);
  const saved=storage.getItem(SAVE_KEY);expect(JSON.parse(saved!).version).toBe(SAVE_VERSION);expect(loadLibrary(storage)).toEqual(loaded);expect(storage.getItem(SAVE_KEY)).toBe(saved);
 });
 it('does not overwrite v7 data when the required backup cannot be made',()=>{
  const storage=memory(),raw=JSON.stringify({version:7,profiles:[{id:'old',hero:newHero('Sol','forest')}],lastHeroId:'old'});storage.setItem(SAVE_KEY,raw);
  const failing={getItem:storage.getItem,setItem:(k:string,v:string)=>{if(k==='gangriket.save.before-v8')throw Error('quota');storage.setItem(k,v);}};
  expect(loadLibrary(failing).status).toBe('blocked');expect(storage.getItem(SAVE_KEY)).toBe(raw);
 });
 it('repairs unknown cosmetics and background while retaining other heroes and earned stats',()=>{
  const storage=memory(),h=newHero('Sol','forest');storage.setItem(SAVE_KEY,JSON.stringify({version:8,profiles:[{id:'a',hero:{...h,gold:88,appearance:{...h.appearance,outfit:'unknown'},background:{origin:'unknown',goal:'statue'}}},{id:'b',hero:{...h,name:'Måne'}}],lastHeroId:'a'}));
  const l=loadLibrary(storage);expect(l.profiles).toHaveLength(2);expect(l.profiles[0].hero).toMatchObject({gold:88,background:{origin:null,goal:'statue'},appearance:{outfit:'adventurer'}});expect(normalizeBackground(null)).toEqual(emptyBackground());
 });
});
describe('cosmetic drafts and independent profiles',()=>{
 it('cancels both drafts, then saves both atomically without touching gameplay or another hero',()=>{
  const storage=memory(),a=newHero('Sol','forest'),b=newHero('Måne','sky');saveLibrary(storage,{profiles:[{id:'a',hero:a},{id:'b',hero:b}],lastHeroId:'a',rejectedProfiles:[]});
  const g=new GameStore(()=>0,storage);g.selectHero('a');const before=g.getSnapshot().hero,raw=storage.getItem(SAVE_KEY);g.openAppearance();
  const look={...a.appearance,outfit:'mage_dress' as const,hairStyle:'braids' as const,detail:'glasses' as const,beard:'long_beard' as const};
  g.editAppearance(look);g.editBackground({origin:'farm',goal:'statue'});expect(storage.getItem(SAVE_KEY)).toBe(raw);expect(g.getSnapshot().hero).toEqual(before);g.leaveTraining();expect(g.getSnapshot().backgroundDraft).toBeNull();expect(g.getSnapshot().hero).toEqual(before);
  g.openAppearance();g.editAppearance(look);g.editBackground({origin:'farm',goal:'statue'});expect(g.saveAppearance()).toBe(true);
  expect(g.getSnapshot().hero).toEqual({...a,appearance:look,background:{origin:'farm',goal:'statue'}});const l=loadLibrary(storage);expect(l.profiles[1].hero).toEqual(b);expect(l.profiles[0].hero.appearance).toEqual(look);g.dispose();
 });
 it('presets and repeated random draws change only appearance and never invalidate choices',()=>{
  for(const p of STYLE_PRESETS)expect(validAppearance(p.look)).toBe(true);
  let look=DEFAULT_APPEARANCE;for(let i=0;i<8;i++){const next=rerollAppearance(look,()=>.5);expect(next.hairStyle).not.toBe(look.hairStyle);expect(next.outfit).not.toBe(look.outfit);expect(validAppearance(next)).toBe(true);look=next;}
  const a=normalizeAppearance({detail:'beard',hairColor:'silver'});expect(a.beard).toBe('long_beard');expect(a.detail).toBe('none');
 });
 it('all outfit and weapon combinations are purely cosmetic',()=>{
  for(const o of OUTFITS)for(const weapon of ['stick','wand'] as const){const h=newHero('Sol','forest',weapon,{...DEFAULT_APPEARANCE,outfit:o.id});expect(damageFor(h)).toBe(8);expect(h.level).toBe(1);expect(h.maxHealth).toBe(40);expect(h.points).toBe(0);}
 });
});
describe('personal chronicles',()=>{
 it('keeps all 36 combinations deterministic, short and free of unearned victories',()=>{
  for(const origin of ORIGINS)for(const goal of GOALS)for(const level of [1,10,40]){
   const h={...newHero('Sol','forest'),level,background:{origin:origin.id,goal:goal.id}},story=heroChronicle(h).story;
   expect(story).toBe(heroChronicle(h).story);expect(story.split(/(?<=[.!?])\s/).length).toBeLessThanOrEqual(3);
   expect(story).not.toMatch(/Klask|Buldre|Gøran|har fått en statue|målet er nådd|hun |han /);
   expect(story).toContain(level>=10?origin.later:origin.early);expect(backgroundPreview(h.background)).toContain(origin.early);
  }
 });
 it('uses only real equipment and victories for progression callbacks',()=>{
  const h=newHero('Sol','forest','stick',DEFAULT_APPEARANCE,{origin:'farm',goal:'weapon'});
  expect(heroChronicle(h).story).not.toContain('Det store våpenet');expect(heroChronicle({...h,weapon:'melee_19'}).story).toContain('Det store våpenet');
  expect(heroChronicle({...h,defeatedEnemies:['goran']}).story).toContain('Gøran er beseiret');expect(heroChronicle({...h,defeatedEnemies:['goran']}).story).not.toContain('Klask');
  const statue={...h,background:{origin:'farm' as const,goal:'statue' as const},level:100};expect(heroChronicle(statue).story).toContain('Ønsker seg en statue');
 });
 it('does not assign background to existing or newly skipped heroes',()=>{const h=newHero('Sol','forest');expect(h.background).toEqual(emptyBackground());expect(heroChronicle(h).story).not.toMatch(/gården|høne|akademi|pakke på slottet/);});
});
describe('shared cosmetic geometry',()=>{
 it('has distinct silhouettes for all hairstyles and all twelve outfits',()=>{
  expect(new Set(HAIR_STYLES.map(h=>JSON.stringify(hairParts({...DEFAULT_APPEARANCE,hairStyle:h.id})))).size).toBe(15);
  expect(new Set(OUTFITS.map(o=>JSON.stringify(outfitParts({...DEFAULT_APPEARANCE,outfit:o.id})))).size).toBe(12);
 });
 it('fits hair and headwear in the combat frame with start and final weapons',()=>{
  for(const hair of HAIR_STYLES)for(const hat of HEADWEAR){const a={...DEFAULT_APPEARANCE,hairStyle:hair.id,headwear:hat.id},parts=hairParts(a);
   for(const weapon of ['stick','magic_19'] as const){const f=battleFrame(weapon,null,240,false,cosmeticHeight(a));
    for(const [x,y] of shapePoints([...parts.back,...parts.front,...headwearParts(a)])){
     expect(155+x*f.heroScale).toBeGreaterThanOrEqual(f.left);expect(155+x*f.heroScale).toBeLessThanOrEqual(f.left+f.width);
     expect(350+y*f.heroScale).toBeGreaterThanOrEqual(f.top);expect(350+y*f.heroScale).toBeLessThanOrEqual(f.top+f.height);
    }
   }
  }
 });
});
