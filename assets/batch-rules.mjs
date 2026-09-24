export const batch = Object.freeze({
  id: 'september-2026',
  startsAt: '2026-09-22T00:00:00-04:00',
  endsAt: '2026-09-30T23:59:00-04:00',
  timezone: 'America/New_York',
  nextBatchWaitWeeks: 4,
  // Stock counts are separately sourced in stock-snapshot.mjs.
  handles: Object.freeze(['crunchy-peanut','crunchy-soap-block','jam-toothpaste-tube','boba-bottle','crunchy-tofu-cube','crunchy-mango','marble-soda-bottle','crunchy-pudding','big-apple-jelly-ball','cracking-wax-ball','crunchy-pineapple-bun','double-decker-biscuit-sandwich','slushy-bayberry-ball','crunchy-potato','slushie-fruit-ball','chewy-sticky-rice-ball','crunchy-shapeable-mochi','mashed-potato-slushie','crunchy-corn-cob','assorted-fruit-jelly-ball','crunchy-whipping-cream','fried-egg-toast','frosted-matte-jumbo-cheese-cube','slushie-yogurt-gummy-cube','crunchy-chocolate-pie','crunchy-tangerine','strawberry-cake-taba','transparent-coconut-oil-ball']),
  // Owner explicitly approved all-SKU +20% on 23 September 2026.
  futurePriceMultiplier: 1.2,
});
export function batchPhase(now = Date.now()) {
  if (now < Date.parse(batch.startsAt)) return 'scheduled';
  return now < Date.parse(batch.endsAt) ? 'current' : 'next';
}
export function resolveBatchProduct(product, now = Date.now()) {
  const phase = batchPhase(now);
  const nextPrice = Math.round(product.price * batch.futurePriceMultiplier);
  if (phase !== 'next') return {...product, futurePrice:nextPrice, lowStock: phase === 'current' && batch.handles.includes(product.handle) && product.eligible && product.status === 'ACTIVE'};
  const ready = Number.isInteger(nextPrice) && nextPrice > product.price;
  return {...product, price: ready ? nextPrice : null, eligible: Boolean(product.eligible && ready), lowStock: false, nextBatch: batch.handles.includes(product.handle), pricePending: !ready};
}
export function remainingParts(now) {
  const seconds = Math.max(0, Math.ceil((Date.parse(batch.endsAt) - now) / 1000));
  return {days: Math.floor(seconds/86400), hours: Math.floor(seconds%86400/3600), minutes: Math.floor(seconds%3600/60), seconds: seconds%60};
}

// Shared display calculation. The cart server recalculates this from its own
// catalogue data, so a browser can never choose a price or discount.
export function bundlePricing(entries) {
 const rows=Array.isArray(entries)?entries:[], ordinary=rows.filter(r=>!r.assortedPack), packs=rows.filter(r=>r.assortedPack);
 const count=r=>Number.isInteger(r.quantity)?r.quantity:1;
 const units=ordinary.reduce((s,r)=>s+count(r),0), regular=ordinary.reduce((s,r)=>s+r.price*count(r),0);
 const percent=units>=3?8:units===2?5:0;
 const discounted=Math.max(units*2000,Math.round(regular*(100-percent)/100));
 const packTotal=packs.reduce((s,r)=>s+r.price*count(r),0), packSubtotal=packs.reduce((s,r)=>s+(r.individualSubtotal||10995)*count(r),0);
 const total=discounted+packTotal,subtotal=regular+packSubtotal,savings=subtotal-total,totalUnits=units+packs.reduce((s,r)=>s+5*count(r),0);
 const discountPercent=packTotal||discounted!==Math.round(regular*(100-percent)/100)?0:percent;
 return Object.freeze({units:totalUnits,subtotal,discountPercent,savings,total,averageUnitPrice:totalUnits?Math.round(total/totalUnits):0,label:savings?`SAVE $${(savings/100).toFixed(2)}`:''});
}
