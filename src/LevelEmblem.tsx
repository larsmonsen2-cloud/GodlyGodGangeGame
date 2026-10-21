import type { CSSProperties } from 'react';
import { CONFIG } from './config';
export const emblemTier=(level:number)=>CONFIG.emblem.thresholds.reduce((tier,min,index)=>level>=min?index:tier,0);
const materials=['Jern','Bronse','Sølv','Gull','Magisk'];
export function LevelEmblem({level,celebrate=false,compact=false}:{level:number;celebrate?:boolean;compact?:boolean}) {
 const tier=emblemTier(level),digits=String(level).length;
 const font=compact?18:digits>9?16:digits>5?22:digits>3?26:34;
 return <div className={`level-emblem emblem-${tier} ${celebrate?'emblem-celebrate':''} ${compact?'emblem-compact':''}`} role="img" aria-label={`Nivå ${level} · ${materials[tier]}emblem`} style={{'--emblem-width':`${Math.max(compact?48:78,digits*font*.7+24)}px`,'--emblem-font':`${font}px`,'--emblem-time':`${CONFIG.emblem.celebration}ms`} as CSSProperties}>
 <svg viewBox="0 0 100 110" preserveAspectRatio="none" aria-hidden="true"><path className="emblem-shield" d="M9 17L50 6L91 17V65Q88 89 50 105Q12 89 9 65Z"/>{tier>=1&&<path className="emblem-rim" d="M17 23L50 14L83 23V64Q80 83 50 96Q20 83 17 64Z"/>}{tier>=2&&<path className="emblem-decor" d="M3 40L13 48L3 56M97 40L87 48L97 56M30 84L38 87M70 84L62 87"/>}{tier>=3&&<path className="emblem-crown" d="M30 16L25 1L41 8L50 0L59 8L75 1L70 16Z"/>}{tier>=4&&<path className="emblem-decor" d="M3 68L14 71L22 89L11 82ZM97 68L86 71L78 89L89 82ZM50 90L54 95L50 100L46 95Z"/>}</svg>
 <span className="emblem-value"><small>NIVÅ</small><strong>{level}</strong></span>
 </div>;
}
