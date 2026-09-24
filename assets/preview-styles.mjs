// These names come from the owner's product-copy workbook. The owner confirmed that
// every named choice can be fulfilled and is currently available in this private store.
import {styleStock} from './style-stock.mjs';
import {stockSnapshot} from './stock-snapshot.mjs';
export const previewStyles = Object.freeze({
  'boba-bottle':['Purple'],
  'frosted-matte-jumbo-cheese-cube':['Grass Cheese – Frosted Malt Sugar','Pink Cheese – Frosted Malt Sugar','Plain Boiled Water Cheese – Frosted Malt Sugar','Flour Cheese – Frosted Malt Sugar'],
  'crunchy-soap-block':['White','Pink','Blue'],
  'crunchy-chocolate-pie':['Coffee Choco Pie','Pink Choco Pie','White Choco Pie','Chocolate'],
  'big-apple-jelly-ball':['Blue','Glittering Powder','Green','Red','Pink Apple with Leaves'],
  'cracking-wax-ball':['Green Apple Paradise','Sea Salt Soda','Crispy Watermelon Rind','Crispy Pineapple','Mango Crispy Skin','Peach Crispy Skin','Grape Crispy Skin','Ocean World'],
  'crunchy-pineapple-bun':['Original Flavor','Strawberry Flavor'],
  'double-decker-biscuit-sandwich':['Triangular Blueberry Cake','Triangular Chocolate Cake','Blueberry Strawberry Cake','Chocolate Strawberry Cake','Blueberry Soufflé','Strawberry Soufflé','Sea Salt Soda Biscuit','Strawberry Soda Biscuit','Chocolate Soda Biscuit'],
  'slushie-fruit-ball':['Passion Fruit','Kiwi Fruit','Watermelon'],
  'chewy-sticky-rice-ball':['White · 4cm Child','Blue · 6cm Big Friend','Pink · 4cm Child','Orange · 4cm Child','Green · 4cm Child'],
  'crunchy-shapeable-mochi':['Pink','Blue'],
  'assorted-fruit-jelly-ball':['Banana','Apple'],
  'fried-egg-toast':['Dark Chocolate','Milk'],
  'slushie-yogurt-gummy-cube':['Cream Cherry Big Pudding','Strawberry Pudding'],
  'transparent-coconut-oil-ball':['Yellow','Strawberry','Watermelon','Kiwi Fruit','Lemon','Lime','Tangerine','Mixed Fruit'],
  'fruit-jelly-strip':['Guava','Orange','Peach','Strawberry','Watermelon'],
  'multi-colour-snow-skin-mochi':['Pink','Blue'],
  'multi-colour-slushie-ball':['Orange · 4cm','Grape · 6cm','Kiwi Fruit · 4cm','Watermelon · 4cm','Lemon · 6cm','Sea Salt Grape · 6cm'],
  'glass-lemon-bottle':['Blue','Yellow','Pink']
});
// These catalogue photos show multiple looks, but the workbook has no named
// options. A generic basket line would hide which look the customer wanted.
export const unnamedMultiStyleProducts=Object.freeze([]);
// Exact CJ choice-to-SKU matches captured 23 September 2026. Choices absent
// here remain visible but cannot be added until their supplier identity is proved.
export const supplierStyles=Object.freeze({
 'frosted-matte-jumbo-cheese-cube':{'Grass Cheese – Frosted Malt Sugar':'CJYD318450301AZ','Pink Cheese – Frosted Malt Sugar':'CJYD318450302BY','Plain Boiled Water Cheese – Frosted Malt Sugar':'CJYD318450303CX','Flour Cheese – Frosted Malt Sugar':'CJYD318450304DW'},
 'crunchy-soap-block':{'White':'CJYD315533502BY'},
 'crunchy-chocolate-pie':{'Coffee Choco Pie':'CJYD315533515OL','Pink Choco Pie':'CJYD315533517QJ','White Choco Pie':'CJYD315533516PK','Chocolate':'CJYD318480201AZ'},
 'crunchy-pineapple-bun':{'Original Flavor':'CJYD289399601AZ'},
 'slushie-fruit-ball':{'Kiwi Fruit':'CJYD318478602BY','Passion Fruit':'CJYD318478601AZ','Watermelon':'CJYD318478603CX'},
 'assorted-fruit-jelly-ball':{'Banana':'CJYZ318487101AZ','Apple':'CJYZ318487102BY'},
 'slushie-yogurt-gummy-cube':{'Cream Cherry Big Pudding':'CJYD318481801AZ','Strawberry Pudding':'CJYD318481802BY'},
 'transparent-coconut-oil-ball':{'Yellow':'CJYD318482401AZ','Strawberry':'CJYD318482402BY','Watermelon':'CJYD318482403CX','Kiwi Fruit':'CJYD318482404DW','Lemon':'CJYD318482405EV','Lime':'CJYD318482406FU','Tangerine':'CJYD318482407GT','Mixed Fruit':'CJYD318482408HS'},
 'fried-egg-toast':{'Dark Chocolate':'CJYD318483101AZ','Milk':'CJYD318483102BY'},
 'fruit-jelly-strip':{'Guava':'CJYD318483703CX','Orange':'CJYD318483705EV','Peach':'CJYD318483702BY','Strawberry':'CJYD318483701AZ','Watermelon':'CJYD318483704DW'}
 ,'chewy-sticky-rice-ball':{'White · 4cm Child':'CJYD209857001AZ','Blue · 6cm Big Friend':'CJYD209857004DW','Pink · 4cm Child':'CJYD209857005EV','Orange · 4cm Child':'CJYD209857007GT','Green · 4cm Child':'CJYD209857009IR'}
 ,'multi-colour-slushie-ball':{'Orange · 4cm':'CJYD318484701AZ','Grape · 6cm':'CJYD318484708HS','Kiwi Fruit · 4cm':'CJYD318484703CX','Watermelon · 4cm':'CJYD318484704DW','Lemon · 6cm':'CJYD318484711KP','Sea Salt Grape · 6cm':'CJYD318484712LO'}
});
export const styleImages=Object.freeze({'crunchy-soap-block':{White:'/simply-squish-supplier-view/assets/soap-styles/white.webp',Pink:'/simply-squish-supplier-view/assets/soap-styles/pink.webp',Blue:'/simply-squish-supplier-view/assets/soap-styles/blue.webp'}});
export const styleImage=(product,label)=>styleImages[product]?.[label]||null;
export const supplierSku=(product,label)=>supplierStyles[product]?.[label]||null;
export function styleAvailability(product,label,{records=styleStock,now=Date.now()}={}){
  if(!previewStyles[product]?.includes(label))return {status:'unavailable',sku:null};
  const sku=supplierSku(product,label);
  if(!sku)return {status:'in_stock',sku:null};
  const record=records[sku];
  if(!record)return {status:'in_stock',sku};
  const identity=record.sku===sku&&record.product===product&&record.label===label&&record.photoMatched===true&&typeof record.source==='string'&&record.source.length>0;
  const captured=Date.parse(record.capturedAt),fresh=Number.isFinite(captured)&&captured<=now&&now-captured<=14*86400000;
  if(!identity||!fresh||!Number.isInteger(record.available)||record.available<0)return {status:'unavailable',sku};
  if(record.available>0)return {status:'in_stock',sku,available:record.available};
  const start=Date.parse(record.dispatchStart),end=Date.parse(record.dispatchEnd);
  if(record.backorderEligible===true&&record.replenishmentConfirmed===true&&Number.isFinite(start)&&Number.isFinite(end)&&start>now&&end>=start){
    return {status:'backorder',sku,available:0,dispatchStart:record.dispatchStart,dispatchEnd:record.dispatchEnd};
  }
  return {status:'unavailable',sku,available:0};
}
export const styleInStock=(product,label)=>styleAvailability(product,label).status==='in_stock';
export const styleSelectable=(product,label,options)=>['in_stock','backorder'].includes(styleAvailability(product,label,options).status);
// These two listings moved from colour-only previews to real size-and-colour
// choices. Their old position-based keys must not silently turn into a
// different choice in a saved bag.
const skuKeyedProducts=new Set(['chewy-sticky-rice-ball','multi-colour-slushie-ball']);
export const styleKey=(product,label)=>{
  if(product==='crunchy-soap-block')return {White:product+':style-1',Pink:product+':style-2',Blue:product+':style-4'}[label]||null;
  const sku=supplierSku(product,label);
  if(skuKeyedProducts.has(product)&&sku)return `${product}:sku-${sku}`;
  const index=previewStyles[product]?.indexOf(label);
  return index>=0?`${product}:style-${index+1}`:null;
};
export const styleFromKey=(product,key)=>{
  if(product==='crunchy-soap-block')return {[product+':style-1']:'White',[product+':style-2']:'Pink',[product+':style-4']:'Blue'}[key]||null;
  const skuMatch=typeof key==='string'&&key.match(/^(.+):sku-([A-Z0-9]+)$/);
  if(skuMatch&&skuMatch[1]===product)return previewStyles[product]?.find(label=>supplierSku(product,label)===skuMatch[2])||null;
  if(skuKeyedProducts.has(product))return null;
  const match=typeof key==='string'&&key.match(/^(.+):style-(\d+)$/);
  if(!match||match[1]!==product)return null;
  return previewStyles[product]?.[Number(match[2])-1]||null;
};
