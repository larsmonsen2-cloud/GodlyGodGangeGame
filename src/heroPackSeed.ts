import {newHero} from './progression';
import {acknowledgeReputation,normalizeReputation} from './reputation';
import {memoryStorage} from './previewMode';
import {saveLibrary} from './storage';
export function heroPackStorage(){
 const storage=memoryStorage();
 const profiles=([['pack-melee','Prøvehelt – kamp','stick'],['pack-magic','Prøvehelt – magi','wand']] as const).map(([id,name,weapon])=>({id,seenLevel:6,hero:(()=>{const hero={...newHero(name,'forest',weapon),level:6,strength:9,magic:9,maxHealth:50};return acknowledgeReputation({...hero,reputation:normalizeReputation(hero)});})()}));
 saveLibrary(storage,{profiles,lastHeroId:'pack-melee',rejectedProfiles:[]});
 return storage;
}
