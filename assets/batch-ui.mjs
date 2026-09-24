import {batch, batchPhase, remainingParts} from './batch-rules.mjs';
import {stockSnapshot, stockUpdated} from './stock-snapshot.mjs';

export function initBatch(catalogue, onPhaseChange) {
  let serverNow = null, syncedAt = 0, lastPhase = batchPhase();
  const now = () => serverNow === null ? Date.now() : serverNow + performance.now() - syncedAt;
  const current = catalogue.find(p => location.pathname.replace(/\/$/, '') === `/simply-squish-supplier-view/products/${p.handle}`);
  const boxes = [];
  let stockBanner;
  const stock = current && stockSnapshot[current.handle];
  if (stock && current && current.eligible && current.status === 'ACTIVE') {
    stockBanner = document.createElement('aside');
    stockBanner.className = 'ss-stock-banner';
    stockBanner.setAttribute('aria-label','Product sales and availability');
    stockBanner.innerHTML = `<span class="ss-stock-flash" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M13 2 4 14h7l-1 8 10-13h-7z"/></svg></span><div><p><strong>Hurry!</strong> <b>${stock.sold}</b> sold in the last month,<br class="ss-stock-wrap"> Only <b>${stock.available}</b> available</p><small>Stock updated ${stockUpdated} · availability can change</small></div>`;
    const builder = document.querySelector('[data-by5-builder]');
    if (builder) builder.before(stockBanner);
    else document.querySelector('.pdp2-buy')?.append(stockBanner);
  }
  function box(parent, compact = false) {
    if (!parent || parent.querySelector(':scope > [data-batch-message]')) return;
    const el = document.createElement('aside');
    el.className = `ss-batch${compact ? ' ss-batch-compact' : ''}`;
    el.dataset.batchMessage = '';
    el.setAttribute('aria-label', 'Current batch information');
    el.innerHTML = '<div class="ss-batch-ribbon"><strong data-batch-heading></strong><div class="ss-batch-clock" data-batch-clock hidden aria-hidden="true"><span><b data-batch-unit="days">00</b><small>DAY</small></span><span><b data-batch-unit="hours">00</b><small>HR</small></span><span><b data-batch-unit="minutes">00</b><small>MIN</small></span><span><b data-batch-unit="seconds">00</b><small>SEC</small></span></div></div><p data-batch-copy></p><p class="ss-batch-deadline">Ends 30 September, 11:59 pm Eastern Time</p>';
    const header = parent.querySelector(':scope > .drawer-top');
    if (header) header.after(el); else if(parent.querySelector('[data-by5-builder]'))parent.querySelector('[data-by5-builder]').after(el);else if(parent.querySelector('.hero'))parent.querySelector('.hero').after(el);else parent.prepend(el);
    boxes.push(el);
  }
  box(document.querySelector('[data-hero-countdown]') || document.querySelector('.pdp2-buy') || document.querySelector('main'), false);
  if (!current) box(document.querySelector('[data-by5-builder]'), true);
  box(document.querySelector('#bag-panel'), true);
  box(document.querySelector('[data-by5-preview-dialog]'), true);

  function decorate() {
    document.querySelectorAll('.sh-card, .pdp2-card, .by5-card, .by5-pick, .ss-product-card').forEach(card => {
      const link = card.matches('a') ? card : card.querySelector('a[href*="/simply-squish-supplier-view/products/"]');
      const product = catalogue.find(p => p.id === card.dataset.id || (link && new URL(link.href).pathname.replace(/\/$/, '') === `/simply-squish-supplier-view/products/${p.handle}`));
      if (!product) return;
      const snapshot = stockSnapshot[product.handle];
      const low = product.eligible && product.status === 'ACTIVE' && snapshot;
      let label = card.querySelector('[data-batch-stock]');
      if (low && !label) {
        label = document.createElement('span'); label.dataset.batchStock = ''; label.className = 'ss-low-stock';
        label.textContent = `${snapshot.available} available`;
        label.title = `Stock updated ${stockUpdated}; availability can change`;
        card.append(label);
      }
      if (label) label.hidden = !low;
    });
    if (current && batch.handles.includes(current.handle)) {
      const status = document.querySelector('.pdp2-status');
      if (status) {
        const low = current.eligible && current.status === 'ACTIVE';
        status.classList.toggle('ss-low-stock', low);
        status.textContent = !current.eligible ? 'Unavailable' : 'In stock';
      }
    }
  }
  function tick() {
    const updateText=(node,value)=>{if(node.textContent!==value)node.textContent=value};
    const phase = batchPhase(now());
    const heroPromo=document.querySelector('[data-hero-promo]');if(heroPromo)updateText(heroPromo,phase==='next'?'A fresh batch of squish awaits':'September specials · Get your squish while this batch lasts');
    if (stockBanner) stockBanner.hidden = false;
    if (phase !== lastPhase) { lastPhase = phase; onPhaseChange(now()); }
    for (const el of boxes) {
      const ended = phase === 'next';
      el.hidden = phase === 'scheduled';
      updateText(el.querySelector('[data-batch-heading]'), ended ? 'Next batch pricing now applies' : 'Still time for this batch');
      updateText(el.querySelector('[data-batch-copy]'), ended
        ? 'The September batch has closed. Explore the next batch at its new prices.'
        : 'Current prices end with this batch. Crossed-out prices apply from 1 October, Eastern Time.');
      updateText(el.querySelector('.ss-batch-deadline'),`This handmade batch closes 30 September at 11:59 pm Eastern Time.${current&&batch.handles.includes(current.handle)?' The next batch adds about four weeks before normal processing and delivery.':''}`);
      el.querySelector('.ss-batch-deadline').hidden = ended;
      const clock = el.querySelector('[data-batch-clock]');
      clock.hidden = ended || serverNow === null;
      if (!clock.hidden) {
        const p = remainingParts(now());
        for(const [unit,value] of Object.entries({days:p.days,hours:p.hours,minutes:p.minutes,seconds:p.seconds}))updateText(clock.querySelector(`[data-batch-unit="${unit}"]`),String(value).padStart(2,'0'));
      }
    }
    decorate();
  }
  async function sync() {
    try {
      const r = await fetch('/simply-squish-supplier-view/api/batch-status', {cache: 'no-store'});
      if (!r.ok) return;
      const value = await r.json();
      if (value.id !== batch.id || !Number.isFinite(value.now)) return;
      serverNow = value.now; syncedAt = performance.now(); onPhaseChange(now()); tick();
    } catch { /* The absolute dated message still works if the clock cannot be checked. */ }
  }
  tick(); sync();
  setInterval(() => {if (!document.hidden) tick();}, 1000);
  document.addEventListener('visibilitychange', () => {if (!document.hidden) sync();});
}
