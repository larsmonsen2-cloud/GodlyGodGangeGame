import { useState, type CSSProperties } from 'react';
import { CONFIG } from './config';
import { APPEARANCE_OPTIONS, DEFAULT_APPEARANCE, randomAppearance, type Appearance } from './appearance';
import { SceneView } from './SceneView';
import { StorageNotice } from './HeroProgress';
import { SoundButton } from './SoundButton';
import { game } from './store';
import type { Hero } from './progression';
import type { StarterId } from './weapons';
import type { StorageStatus } from './storage';
const categories:[keyof Appearance,string][]=[['skin','Hudtone'],['hairStyle','Hårstil'],['hairColor','Hårfarge'],['expression','Ansiktsuttrykk'],['detail','Ekstra detalj'],['clothes','Klesfarge']];
function ChoiceIcon({category,id}:{category:keyof Appearance;id:string}) {
 return <svg viewBox="0 0 48 48" className="choice-icon" aria-hidden="true"><circle cx="24" cy="25" r="14" fill="#dfbb87"/>
 {category==='hairStyle'&&id!=='bald'&&<path d={id==='long'?'M8 39V19Q8 4 24 5Q40 4 40 19V39L32 37V20H16V37Z':id==='short'?'M10 23V19Q10 7 24 8Q38 7 38 19V23L33 17H15Z':id==='curls'?'M8 21Q2 12 12 10Q12 1 22 7Q31 1 35 10Q46 11 39 23L30 17L20 19Z':'M8 22L11 10L19 12L23 2L29 11L39 9L40 25L30 18L24 21L20 15Z'} fill="#614735"/>}
 <path d={id==='proud'?'M16 24h5m6 0h5m-13 7q5 5 11 0':id==='worried'?'M15 20l6-3m6 0l6 3M19 34q5-6 10 0':id==='stern'?'M14 20l8 3m5 0l7-3M19 33h11':'M17 25h1m10 0l4-2M19 33q6 3 12-2'} stroke="#34443c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
 {category==='detail'&&id==='beard'&&<path d="M11 29L24 46L37 29L24 34Z" fill="#614735"/>}
 {category==='detail'&&id==='moustache'&&<path d="M12 33Q20 26 24 31Q29 26 37 33L26 35L24 33L22 35Z" fill="#614735"/>}
 {category==='detail'&&id==='paint'&&<path d="M10 29l9 4m10 0l9-4" stroke="#648cb7" strokeWidth="4"/>}
 </svg>;
}
export function CharacterBuilder({hero,draft,status,reduced,canCancel=false}:{canCancel?:boolean;hero:Hero|null;draft:Appearance|null;status:StorageStatus;reduced:boolean}) {
 const [appearance,setAppearance]=useState<Appearance>({...DEFAULT_APPEARANCE});
 const [name,setName]=useState('');const [weapon,setWeapon]=useState<StarterId>('stick');const [error,setError]=useState('');
 const selected=hero?draft??hero.appearance:appearance;
 const choose=(value:Appearance)=>{if(hero)game.editAppearance(value);else setAppearance(value);};
 return <main className="character-page"><header className="character-header"><h1>{hero?'Endre utseende':'Lag din helt'}</h1><SoundButton/></header><div className="character-layout">
 <section className="character-preview" aria-label="Forhåndsvisning"><SceneView appearance={selected} color={selected.clothes} weapon={hero?.weapon??weapon} reduced={reduced}/><p>{hero?.name||name.trim()||'Liten helt. Store ambisjoner.'}</p><button className="random-appearance" type="button" onClick={()=>choose(randomAppearance())}>↻ Tilfeldig utseende</button></section>
 <form className="character-options" onSubmit={event=>{event.preventDefault();if(hero)game.saveAppearance();else if(!game.createHero(name,selected.clothes,weapon,selected))setError('Gi helten et navn på 1–20 tegn.');}}>
 {!hero&&<><label className="name-label" htmlFor="hero-name">Heltens navn <span>{Array.from(name.trim()).length}/{CONFIG.maxNameLength}</span></label><input id="hero-name" value={name} autoComplete="off" placeholder="Hva skal helten hete?" aria-describedby="name-error" onChange={event=>{setName(event.target.value);setError('');}}/><p id="name-error" className="form-error" role="status">{error}</p>
 <fieldset className="weapon-picker"><legend>Velg ett startvåpen</legend><div className="weapon-options">{(['stick','wand'] as const).map(id=><label key={id} className={weapon===id?'selected':''}><input type="radio" name="start-weapon" checked={weapon===id} onChange={()=>setWeapon(id)}/><span>{id==='stick'?'Kampvåpen':'Magivåpen'}</span></label>)}</div></fieldset></>}
 {categories.map(([category,label],index)=>{
 const options=APPEARANCE_OPTIONS[category];const chosen=options.find(o=>o.id===selected[category]);const disabled=category==='hairColor'&&selected.hairStyle==='bald';
 return <details className="appearance-category" key={category} open={index===0?true:undefined}><summary>{label}<span>{disabled?'Beholdes ved skallet':chosen?.name}</span></summary><fieldset disabled={disabled}><legend className="sr-only">{label}</legend><div className={`appearance-choices ${'value' in options[0]?'color-choices':''}`}>{options.map(option=><button key={option.id} type="button" aria-label={`${label}: ${option.name}`} aria-pressed={selected[category]===option.id} onClick={()=>choose({...selected,[category]:option.id})}>
 {'value' in option?<span className="cosmetic-swatch" style={{'--swatch':option.value} as CSSProperties}/>:<ChoiceIcon category={category} id={option.id}/>}
 <span>{option.name}</span><b className="choice-check" aria-hidden="true">{selected[category]===option.id?'✓':''}</b></button>)}</div></fieldset></details>;
 })}
 <StorageNotice status={status}/><div className="builder-actions"><button className="primary" type="submit">{hero?'Lagre utseende':'Start eventyret'}</button>{(hero||canCancel)&&<button className="secondary" type="button" onClick={()=>hero?game.leaveTraining():game.cancelCreation()}>Avbryt</button>}</div>
 </form></div></main>;
}
