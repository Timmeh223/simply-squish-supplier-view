// Owner-supplied Product Stock Updated.numbers; remaining quantities explicitly
// confirmed by owner in Master Builder on 23 September 2026. Not live inventory.
export const stockUpdated = '23 September 2026';
export const stockSnapshot = Object.freeze(Object.fromEntries([
  ['crunchy-peanut',70,14],['crunchy-soap-block',62,12],['jam-toothpaste-tube',88,18],
  ['boba-bottle',91,18],['crunchy-tofu-cube',97,19],['crunchy-mango',96,19],
  ['marble-soda-bottle',95,19],['crunchy-pudding',69,14],['big-apple-jelly-ball',77,15],
  ['cracking-wax-ball',82,16],['crunchy-pineapple-bun',23,5],['double-decker-biscuit-sandwich',27,5],
  ['slushy-bayberry-ball',21,4],['crunchy-potato',19,4],['slushie-fruit-ball',24,5],
  ['chewy-sticky-rice-ball',26,5],['crunchy-shapeable-mochi',22,4],['mashed-potato-slushie',26,5],
  ['crunchy-corn-cob',25,5],['assorted-fruit-jelly-ball',24,5],['crunchy-whipping-cream',12,2],
  ['fried-egg-toast',16,3],['frosted-matte-jumbo-cheese-cube',10,2],['slushie-yogurt-gummy-cube',12,2],
  ['crunchy-chocolate-pie',12,2],['crunchy-tangerine',13,3],['strawberry-cake-taba',15,3],
  ['transparent-coconut-oil-ball',16,3],['super-moist-rice-cake',8,2],['fruit-jelly-strip',14,3],
  ['multi-colour-snow-skin-mochi',11,2],['frosted-juice-mochi',15,3],['multi-colour-slushie-ball',8,2],
  ['blue-clear-jumbo-jelly-cheese-cube',17,3],['glass-lemon-bottle',10,2],
].map(([handle,sold,available]) => [handle,Object.freeze({sold,available})])));
