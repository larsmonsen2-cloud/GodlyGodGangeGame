import { useState, type CSSProperties } from 'react';
import { CONFIG } from './config';
import { APPEARANCE_OPTIONS, DEFAULT_APPEARANCE, rerollAppearance, STYLE_PRESETS, SKINS, type Appearance } from './appearance';
import {hairParts,outfitParts,headwearParts} from './cosmeticParts';
import {ORIGINS,GOALS,emptyBackground,backgroundPreview,type Background} from './background';
import type {WeaponShape} from './weaponVisuals';
import { SceneView } from './SceneView';
import { StorageNotice } from './HeroProgress';
import { SoundButton } from './SoundButton';
import { game } from './store';
import type { Hero } from './progression';
import type { StarterId } from './weapons';
import type { StorageStatus } from './storage';
const categories:[keyof Appearance,string][][]=[
 [['skin','Hudtone'],['hairStyle','Frisyre'],['hairColor','Hårfarge'],['expression','Ansiktsuttrykk'],['detail','Ansiktsdetalj'],['beard','Skjegg']],
 [['outfit','Antrekk'],['clothes','Hovedfarge'],['accent','Detaljfarge'],['headwear','Hodeplagg'],['cape','Kappe']],
];
function Shapes({shapes}:{shapes:WeaponShape[]}){return <>{shapes.map((s,i)=>s.type==='polygon'?<polygon key={i} points={s.points.map(p=>p.join(',')).join(' ')} fill={s.fill}/>:s.type==='ellipse'?<ellipse key={i} cx={s.x} cy={s.y} rx={s.width/2} ry={s.height/2} fill={s.fill}/>:<rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} fill={s.fill}/>)}</>;}
function ChoiceIcon({category,id,look}:{category:keyof Appearance;id:string;look:Appearance}) {
 const a={...look,[category]:id},hair=hairParts(a),full=category==='outfit'||category==='cape',skin=SKINS.find(s=>s.id===look.skin)!.value;
 return <svg viewBox={full?'-85 -265 170 275':category==='hairStyle'?'-85 -240 170 230':'-65 -260 130 165'} className="choice-icon" aria-hidden="true">
 {full&&a.cape!=='none'&&<path d={a.cape==='long'?'M-29-120L-66-4L55-10Z':'M-29-120L-66-44L55-42Z'} fill="#647f65"/>}
 <Shapes shapes={hair.back}/>{full&&<><path d="M-23-53v50m43-50v50" stroke="#3d4842" strokeWidth="20"/><Shapes shapes={outfitParts(a)}/></>}
 <rect x="-31" y="-179" width="63" height="68" rx="24" fill={skin} stroke="#293d35" strokeWidth="3"/>
 <path d={a.expression==='happy'?'M-22-146q7-9 14 0m17 0q7-9 14 0M-10-127q12 18 24 0Z':a.expression==='stern'?'M-22-155l15 6m16 0l14-6M-9-124h19':a.expression==='proud'?'M-22-148h14m17 0h14M-10-128l10 6 13-6':a.expression==='worried'?'M-23-154l14-6m19 0l14 6M-8-123l9-5 9 5':a.expression==='serious'?'M-22-155h14m18 0h14M-8-123h18':'M-20-154l12-3m18-1l13 5M-8-127l10 3 12-7'} fill="none" stroke={['umber','chestnut'].includes(a.skin)?'#f2dcc0':'#273c38'} strokeWidth="3"/>
 {!['happy','proud'].includes(a.expression)&&<><ellipse cx="-14" cy="-143" rx="4" ry="6" fill="#fff2db"/><ellipse cx="15" cy="-143" rx="4" ry="6" fill="#fff2db"/></>}
 <Shapes shapes={hair.front}/><Shapes shapes={headwearParts(a)}/>
 {a.beard==='long_beard'&&<path d="M-25-120L2-78L27-120Z" fill="#614735"/>}{a.beard==='short_beard'&&<path d="M-25-122Q0-93 25-122" fill="#614735"/>}{a.beard==='moustache'&&<path d="M-22-125Q-10-139 0-126Q10-139 25-125L0-120Z" fill="#614735"/>}
 {a.detail==='glasses'&&<g stroke="#dbc389" strokeWidth="3" fill="none"><circle cx="-15" cy="-143" r="12"/><circle cx="15" cy="-143" r="12"/><path d="M-3-143h6"/></g>}{a.detail==='paint'&&<path d="M-29-136l12 7m35 0l12-7" stroke="#75abd6" strokeWidth="5"/>}{a.detail==='scar'&&<path d="M21-156l-5 26m-3-21l12 4" stroke="#dba09a" strokeWidth="3"/>}{a.detail==='freckles'&&<g fill="#8a573e"><circle cx="-22" cy="-133" r="2"/><circle cx="-16" cy="-130" r="2"/><circle cx="22" cy="-133" r="2"/><circle cx="16" cy="-130" r="2"/></g>}
 </svg>;
}
export function CharacterBuilder({hero,draft,backgroundDraft,status,reduced,canCancel=false}:{canCancel?:boolean;hero:Hero|null;draft:Appearance|null;backgroundDraft:Background|null;status:StorageStatus;reduced:boolean}) {
 const [appearance,setAppearance]=useState<Appearance>({...DEFAULT_APPEARANCE});
 const [background,setBackground]=useState<Background>(emptyBackground);
 const [step,setStep]=useState(0),[category,setCategory]=useState<keyof Appearance|null>('skin');
 const [name,setName]=useState(''),[weapon,setWeapon]=useState<StarterId>('stick'),[error,setError]=useState('');
 const selected=hero?draft??hero.appearance:appearance,bio=hero?backgroundDraft??hero.background:background;
 const choose=(value:Appearance)=>{if(hero)game.editAppearance(value);else setAppearance(value);};
 const chooseBio=(value:Background)=>{if(hero)game.editBackground(value);else setBackground(value);};
 const go=(index:number)=>{setStep(index);setCategory(index===1?'outfit':'skin');};
 const submit=()=>{if(hero)game.saveAppearance();else if(!game.createHero(name,selected.clothes,weapon,selected,bio)){setError('Gi helten et navn på 1–20 tegn.');go(0);}};
 return <main className="character-page builder-v2">
 <header className="character-header"><h1>{hero?'Form helten din':'Lag din helt'}</h1><SoundButton/></header>
 <nav className="builder-steps" aria-label="Steg i karakterbygger">{['Utseende','Antrekk','Bakgrunn'].map((label,i)=><button type="button" key={label} aria-current={step===i?'step':undefined} onClick={()=>go(i)}>{i+1}. {label}</button>)}</nav>
 <div className="character-layout"><section className="character-preview" aria-label="Forhåndsvisning"><SceneView appearance={selected} color={selected.clothes} weapon={hero?.weapon??weapon} reduced={reduced}/><div className="preview-caption"><p>{hero?.name||name.trim()||'Din neste store helt'}</p><button className="random-appearance" type="button" onClick={()=>choose(rerollAppearance(selected))}>↻ Tilfeldig utseende</button></div></section>
 <form id="hero-builder" className="character-options" onSubmit={event=>{event.preventDefault();submit();}}>
 {step===0&&<>{!hero&&<div className="builder-identity"><label htmlFor="hero-name">Heltens navn</label><input id="hero-name" value={name} autoComplete="off" maxLength={40} placeholder="Hva skal helten hete?" aria-describedby="name-error" onChange={event=>{setName(event.target.value);setError('');}}/><p id="name-error" className="form-error" role="status">{error}</p><fieldset className="weapon-picker"><legend>Startvåpen</legend><div className="weapon-options">{(['stick','wand'] as const).map(id=><label key={id} className={weapon===id?'selected':''}><input type="radio" name="start-weapon" checked={weapon===id} onChange={()=>setWeapon(id)}/><span>{id==='stick'?'Kampvåpen':'Magivåpen'}</span></label>)}</div></fieldset></div>}
 <details className="style-presets"><summary>Prøv et ferdig stilforslag</summary><div>{STYLE_PRESETS.map(p=><button type="button" key={p.name} onClick={()=>choose({...p.look,skin:selected.skin})}>{p.name}</button>)}</div></details></>}
 {step<2&&categories[step].map(([key,label])=>{const options=APPEARANCE_OPTIONS[key],chosen=options.find(o=>o.id===selected[key]);return <section className="appearance-category" key={key}><button type="button" className="category-toggle" aria-expanded={category===key} onClick={()=>setCategory(current=>current===key?null:key)}><b>{label}</b><span>{chosen?.name} {category===key?'−':'+'}</span></button>{category===key&&<fieldset><legend className="sr-only">{label}</legend><div className={`appearance-choices ${'value' in options[0]?'color-choices':''}`}>{options.map(option=><button key={option.id} type="button" aria-label={`${label}: ${option.name}`} aria-pressed={selected[key]===option.id} onClick={()=>choose({...selected,[key]:option.id})}>{'value' in option?<span className="cosmetic-swatch" style={{'--swatch':option.value} as CSSProperties}/>:<ChoiceIcon category={key} id={option.id} look={selected}/>}<span>{option.name}</span><b className="choice-check" aria-hidden="true">{selected[key]===option.id?'✓':''}</b></button>)}</div></fieldset>}</section>;})}
 {step===2&&<section className="background-options"><h2>Et personlig utgangspunkt</h2><p>Valgfritt. Du kan endre historien senere.</p><label htmlFor="origin">Hvor begynte eventyret ditt?</label><select id="origin" value={bio.origin??''} onChange={e=>chooseBio({...bio,origin:(e.target.value||null) as Background['origin']})}><option value="">Velg senere</option>{ORIGINS.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select><label htmlFor="goal">Hva er ditt store mål?</label><select id="goal" value={bio.goal??''} onChange={e=>chooseBio({...bio,goal:(e.target.value||null) as Background['goal']})}><option value="">Velg senere</option>{GOALS.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><div className="story-preview" aria-live="polite"><b>{hero?.name||name.trim()||'Helten din'}</b><p>{backgroundPreview(bio)}</p></div></section>}
 <StorageNotice status={status}/></form></div>
 <footer className="builder-actions">{step<2&&<button className="secondary" type="button" onClick={()=>go(step+1)}>Neste steg →</button>}<button form="hero-builder" className="primary" type="submit">{hero?'Lagre endringer':'Start eventyret'}</button>{(hero||canCancel)&&<button className="secondary" type="button" onClick={()=>hero?game.leaveTraining():game.cancelCreation()}>Avbryt</button>}</footer>
 </main>;
}

