import {useEffect,useMemo,useState,useSyncExternalStore} from 'react';
import {App} from './App';
import {SceneView} from './SceneView';
import {game} from './store';
import {damageFor,WEAPONS} from './progression';
import {HeroPackContext} from './HeroPackContext';
import {loadPackComposite} from './heroPackImages';
import {ALL_PACKS,DEFAULT_PACK,packKey,type PackSelection} from './heroPackGeometry';
import './heroPackTest.css';

function usePackImage(selection:PackSelection){
 const key=packKey(selection);
 const [result,setResult]=useState<{key:string;image:HTMLImageElement|null;error:boolean}>({key:'',image:null,error:false});
 useEffect(()=>{let active=true;loadPackComposite(selection).then(image=>{if(active)setResult({key,image,error:false});}).catch(()=>{if(active)setResult({key,image:null,error:true});});return()=>{active=false;};},[key]);
 return result.key===key?result:{key,image:null,error:false};
}
function PackCard({selection}:{selection:PackSelection}){
 const {image,error}=usePackImage(selection);
 const caption=`${selection.hair==='braid'?'Flette':'Bustete'} · ${selection.outfit==='dress'?'Kjole':'Tunika'} · ${selection.weapon==='staff'?'Stav':'Sverd'}`;
 return <figure className="pack-gallery-card"><div>{image?<><img src={image.src} alt={caption}/><img className="pack-small" src={image.src} alt="Samme kombinasjon i liten størrelse"/></>:<p>{error?'Bildet kunne ikke lastes.':'Laster …'}</p>}</div><figcaption>{caption}</figcaption></figure>;
}
export default function HeroPackTest(){
 const state=useSyncExternalStore(game.subscribe,game.getSnapshot);
 const [selection,setSelection]=useState<PackSelection>(DEFAULT_PACK);
 const [builder,setBuilder]=useState(true),[gallery,setGallery]=useState(false),[original,setOriginal]=useState(false);
 const [profile,setProfile]=useState('pack-melee');
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const loaded=usePackImage(selection);
 const preview=useMemo(()=>original?null:{selection,image:loaded.image},[original,selection,loaded.image]);
 const showBuilder=builder||state.screen==='create'||state.screen==='appearance';
 useEffect(()=>{window.scrollTo(0,0);},[state.screen,showBuilder,gallery]);
 const hero=state.hero??state.profiles[0].hero;
 const back=()=>{game.leaveTraining();setProfile(game.getSnapshot().activeHeroId??'pack-melee');setGallery(false);setBuilder(true);};
 function show(view:'heroes'|'hero'|'training'|'arena'){
  game.leaveTraining();game.selectHero(profile);setBuilder(false);setGallery(false);
  if(view==='heroes')game.openHeroes();
  if(view==='training')game.startTraining();
  if(view==='arena'){game.openArena();game.selectEnemy('goran');}
 }
 return <HeroPackContext.Provider value={preview}><div className={`hero-pack-test ${!showBuilder&&!gallery&&(state.screen==='training'||state.screen==='arena')?'pack-playing':''}`}>
  <header className="pack-test-bar"><strong>Bildeprøve · isolert</strong><button type="button" onClick={back}>← Prøvevalg</button></header>
  {gallery?<main className="pack-gallery"><h1>Alle åtte kombinasjoner</h1><p>Samme bildelag i stor og liten størrelse. Ingen valg lagres på heltene dine.</p><div className="pack-gallery-grid">{ALL_PACKS.map(s=><PackCard key={packKey(s)} selection={s}/>)}</div></main>:showBuilder?<main className="pack-builder">
   <div className="pack-heading"><span className="eyebrow">KARAKTERBYGGER · FORHÅNDSVISNING</span><h1>Prøv den illustrerte helten</h1><p>Én hudtone og ett ansikt. Valgene endrer bare prøvebildet.</p></div>
   <div className="pack-builder-layout"><section className="pack-portrait" aria-label="Stor forhåndsvisning"><SceneView color={hero.color} appearance={hero.appearance} weapon={hero.weapon} reduced={reduced}/></section>
   <section className="pack-controls" aria-label="Valg for bildeprøven">
    <fieldset><legend>Hår</legend>{([['short','Bustete'],['braid','Lang flette']] as const).map(([id,label])=><button type="button" key={id} aria-pressed={selection.hair===id} onClick={()=>setSelection(s=>({...s,hair:id}))}>{label}</button>)}</fieldset>
    <fieldset><legend>Antrekk</legend>{([['tunic','Tunika'],['dress','Kjole']] as const).map(([id,label])=><button type="button" key={id} aria-pressed={selection.outfit===id} onClick={()=>setSelection(s=>({...s,outfit:id}))}>{label}</button>)}</fieldset>
    <fieldset><legend>Våpenbilde</legend>{([['sword','Sverd'],['staff','Stav']] as const).map(([id,label])=><button type="button" key={id} aria-pressed={selection.weapon===id} onClick={()=>setSelection(s=>({...s,weapon:id}))}>{label}</button>)}</fieldset>
    <p className="pack-status" role="status">{original?'Eksisterende figur vises.':loaded.error?'Bildene kunne ikke lastes. Eksisterende figur brukes.':loaded.image?'Bildelagene er klare.':'Laster bildelag … Eksisterende figur vises imens.'}</p>
    <label className="pack-check"><input type="checkbox" checked={original} onChange={e=>setOriginal(e.target.checked)}/>Sammenlign med eksisterende figur</label>
    <label className="pack-check"><input type="checkbox" checked={reduced} onChange={e=>setReduced(e.target.checked)}/>Rolig forhåndsvisning</label>
    <label className="pack-profile">Testhelt<select value={profile} onChange={e=>{setProfile(e.target.value);game.selectHero(e.target.value);}}><option value="pack-melee">Kamphelt · kampangrep</option><option value="pack-magic">Magihelt · magiangrep</option></select></label>
    <p className="pack-explanation">Spillvåpen: {WEAPONS[hero.weapon].name} · {damageFor(hero)} skade. Sverd/stav over endrer bare bildet. Oppgraderte spillvåpen bruker eksisterende grafikk.</p>
    <nav className="pack-view-buttons" aria-label="Prøv i spillets visninger"><button onClick={()=>show('heroes')}>Heltvelger</button><button onClick={()=>show('hero')}>Helteside</button><button onClick={()=>show('training')}>Trening</button><button onClick={()=>show('arena')}>Arena</button><button onClick={()=>{setGallery(true);game.leaveTraining();}}>Alle 8 kombinasjoner</button></nav>
   </section></div>
  </main>:<App/>}
 </div></HeroPackContext.Provider>;
}
