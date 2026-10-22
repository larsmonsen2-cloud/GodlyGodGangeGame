export function heroPackTestMode(search:string){return new URLSearchParams(search).get('test')==='hero-pack';}
export const isHeroPackTest=typeof window!=='undefined'&&heroPackTestMode(window.location.search);
export function memoryStorage(){
 const values=new Map<string,string>();
 return {getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}};
}
