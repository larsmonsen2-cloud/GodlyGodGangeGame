import type { CSSProperties } from 'react';
import { CONFIG } from './config';
export function SpecialMeter({streak,flash,brokenFrom,magic,questionId}:{streak:number;flash:boolean;brokenFrom:number;magic:boolean;questionId:number}) {
 const full=CONFIG.special.threshold,display=flash?full:streak;
 const label=magic?'Magismell':'Superslag';
 const status=brokenFrom?'Rekken brutt':flash?'SUPER!':streak===full-1?`Ett riktig til ${label.toLowerCase()}!`:`${streak}/${full} riktige på rad`;
 return <div className={`special-meter ${streak===full-1?'special-ready':''} ${flash?'special-full':''} ${brokenFrom?'special-broken':''}`} style={{'--meter-pulse':`${CONFIG.special.impact}ms`,'--meter-break':`${CONFIG.timing.wrong}ms`} as CSSProperties}>
 <span className="special-label" title={magic?'Den urimelig store magismellen':'Det fullstendig unødvendige superslaget'}>{label}</span>
 <span className="special-segments" aria-hidden="true" key={`${questionId}-${display}-${brokenFrom}`}>{Array.from({length:full},(_,i)=><i key={i} className={i<display?'filled':i<brokenFrom?'extinguished':''}>{i<display?'◆':'◇'}</i>)}</span>
 <span className="special-status" role="status" aria-live="polite">{status}</span>
 </div>;
}
