import {manifest,PACK_ROOT,packKey,packLayers,type PackSelection} from './heroPackGeometry';
let sourcePromise:Promise<Record<string,HTMLImageElement>>|null=null;
const composites=new Map<string,Promise<HTMLImageElement>>();
function readImage(src:string):Promise<HTMLImageElement>{
 return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Kunne ikke laste heltebildet.'));image.src=src;});
}
export function loadPackImages(){
 if(!sourcePromise)sourcePromise=Promise.all(Object.entries(manifest.assets).map(async([key,asset])=>[key,await readImage(PACK_ROOT+asset.file)] as const)).then(entries=>Object.fromEntries(entries)).catch(error=>{sourcePromise=null;throw error;});
 return sourcePromise;
}
export function loadPackComposite(selection:PackSelection){
 const key=packKey(selection);
 if(!composites.has(key))composites.set(key,(async()=>{
  const images=await loadPackImages();
  // Render at twice the logical resolution, matching the supplied source scale.
  // Preserve padding, fractional registration and alpha; no independent cropping.
  const canvas=document.createElement('canvas');canvas.width=manifest.canvas.width*2;canvas.height=manifest.canvas.height*2;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Bildevisning er ikke tilgjengelig.');
  ctx.scale(2,2);
  for(const {key,destination:r} of packLayers(selection))ctx.drawImage(images[key],r.x,r.y,r.width,r.height);
  // Shared immutable image: each Phaser instance owns its texture, not this canvas.
  return readImage(canvas.toDataURL('image/png'));
 })().catch(error=>{composites.delete(key);throw error;}));
 return composites.get(key)!;
}
