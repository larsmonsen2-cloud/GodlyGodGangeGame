import { useEffect, useRef, useState } from 'react';
import type { HeroProfile, StorageStatus } from './storage';
import { ENEMIES } from './enemies';
import { heroChronicle } from './reputation';
import { game } from './store';
import { SceneView } from './SceneView';
import { SoundButton } from './SoundButton';
import { StorageNotice } from './HeroProgress';

function HeroCard({profile,last}:{profile:HeroProfile;last:boolean}) {
 const host=useRef<HTMLButtonElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'180px'});if(host.current)observer.observe(host.current);return()=>observer.disconnect();},[]);
 const {hero,id}=profile;
 return <button ref={host} className={`hero-select-card ${last?'last-hero':''}`} onClick={()=>game.selectHero(id)}>
  <div className="hero-card-portrait" aria-hidden="true">{visible&&<SceneView thumbnail reduced color={hero.color} appearance={hero.appearance} weapon={hero.weapon}/>}</div>
  <div className="hero-card-copy">{last&&<span className="last-hero-tag">Sist brukt</span>}<h2>{hero.name}</h2><p>{heroChronicle(hero).title}</p><span>Nivå {hero.level}</span><small>{hero.defeatedEnemies.length} av {ENEMIES.length} kamper vunnet</small></div>
 </button>;
}
export function HeroSelect({profiles,lastHeroId,status,notice}:{profiles:HeroProfile[];lastHeroId:string|null;status:StorageStatus;notice:string|null}) {
 return <main className="hero-select-page"><header className="character-header"><h1>Velg helt</h1><SoundButton/></header><StorageNotice status={status}/>{notice&&<p className="storage-notice" role="status">{notice}</p>}
 <div className="hero-select-grid">{profiles.map(profile=><HeroCard key={profile.id} profile={profile} last={profile.id===lastHeroId}/>)}<button className="new-hero-card" onClick={()=>game.beginCreation()}><span aria-hidden="true">＋</span>Lag ny helt</button></div></main>;
}
