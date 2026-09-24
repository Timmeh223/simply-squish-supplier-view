import {batchPhase} from './batch-rules.mjs';
import {previewStyles,styleAvailability,styleKey} from './preview-styles.mjs';
export const assortedPacks=Object.freeze([
 {id:'playful',name:'Playful favourites',choices:[['crunchy-peanut',null],['crunchy-soap-block','White'],['boba-bottle','Purple'],['crunchy-tofu-cube',null],['crunchy-mango',null]]},
 {id:'crunchy',name:'Crunchy favourites',choices:[['crunchy-peanut',null],['crunchy-soap-block','Pink'],['crunchy-pudding',null],['crunchy-corn-cob',null],['crunchy-potato',null]]},
 {id:'desk-break',name:'Desk break',choices:[['crunchy-peanut',null],['crunchy-tofu-cube',null],['crunchy-mango',null],['crunchy-pudding',null],['crunchy-potato',null]]},
 {id:'purple-pop',name:'Purple pop',choices:[['boba-bottle','Purple'],['crunchy-soap-block','Pink'],['crunchy-corn-cob',null],['crunchy-potato',null],['crunchy-pudding',null]]},
 {id:'soft-snacks',name:'Soft snacks',choices:[['crunchy-peanut',null],['crunchy-tofu-cube',null],['crunchy-corn-cob',null],['crunchy-mango',null],['crunchy-soap-block','Blue']]},
 {id:'happy-handful',name:'Happy handful',choices:[['boba-bottle','Purple'],['crunchy-peanut',null],['crunchy-potato',null],['crunchy-mango',null],['crunchy-pudding',null]]},
 {id:'crunch-club',name:'Crunch club',choices:[['crunchy-soap-block','White'],['crunchy-tofu-cube',null],['crunchy-corn-cob',null],['crunchy-potato',null],['crunchy-pudding',null]]},
 {id:'little-treats',name:'Little treats',choices:[['crunchy-soap-block','Blue'],['boba-bottle','Purple'],['crunchy-mango',null],['crunchy-tofu-cube',null],['crunchy-pudding',null]]}
]);
export function assortedPricing(entries){const subtotal=entries.reduce((s,p)=>s+p.price,0),total=Math.round(subtotal*0.9);return {subtotal,total,savings:subtotal-total,averageUnitPrice:Math.round(total/5),label:'SAVE 10%'};}
export const assortedPrice=(now=Date.now())=>Math.round(5*(batchPhase(now)==='next'?2639:2199)*0.9);
export const assortedEntries=pack=>pack.choices.map(([product,label])=>({product,style:label?styleKey(product,label):null,styleLabel:label,quantity:1}));

export const randomPack={id:'random-five',name:'Your random five'};
export const packDefinition=id=>id===randomPack.id?randomPack:assortedPacks.find(p=>p.id===id);
export function randomFive(catalogue,previous=[],random=Math.random){
 const pool=catalogue.filter(p=>p.eligible&&Number.isInteger(p.price)&&(!previewStyles[p.handle]||previewStyles[p.handle].some(label=>styleAvailability(p.handle,label).status==='in_stock')));
 if(pool.length<5)throw Error('Five available designs are needed.');
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const chosen=pool.slice(0,5),old=new Set(previous.map(c=>typeof c==='string'?c.split(/:(?:style|sku)-/)[0]:c.product));
 if(pool.length>5&&chosen.every(p=>old.has(p.handle)))chosen[4]=pool[5];
 return chosen.map(p=>{const labels=(previewStyles[p.handle]||[]).filter(label=>styleAvailability(p.handle,label).status==='in_stock'),label=labels.length?labels[Math.floor(random()*labels.length)]:null;return {product:p.handle,style:label?styleKey(p.handle,label):null,quantity:1};});
}
