const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const menuClose=$('#menu-panel>button[data-close]');if(menuClose)menuClose.textContent='×';
// Load each requested carousel as a group near the viewport, then start all
// its muted clips together. Individual-card scrolling never selects a winner.
const autoplayGroups=$$('[data-home-autoplay],[data-section-autoplay]');
const startGroup=section=>{
 if(section.dataset.mediaStarted)return;section.dataset.mediaStarted='true';
 const clips=[...section.querySelectorAll('video[data-preview-src]')];
 for(const video of clips){video.muted=true;video.autoplay=true;video.loop=true;video.playsInline=true;video.controls=false;video.poster=video.dataset.previewPoster;video.src=video.dataset.previewSrc;}
 for(const video of clips)video.play().catch(()=>{});
};
const groupObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){startGroup(entry.target);groupObserver.unobserve(entry.target)}},{rootMargin:'350px'});
autoplayGroups.forEach(section=>groupObserver.observe(section));
const videos=$$('video[data-preview-src]').filter(v=>!v.closest('[data-home-autoplay],[data-section-autoplay]')),reduce=matchMedia('(prefers-reduced-motion:reduce)');
const sections=[...new Set(videos.map(v=>v.closest('.video-section')).filter(Boolean))];
let scheduled=false,manual=null;
const stopped=new WeakSet();
function visibleShare(video){const box=video.getBoundingClientRect(),row=video.closest('.video-grid')?.getBoundingClientRect();if(!row||!box.width||!box.height)return 0;const left=Math.max(0,row.left,box.left),right=Math.min(innerWidth,row.right,box.right),top=Math.max(0,row.top,box.top),bottom=Math.min(innerHeight,row.bottom,box.bottom);return Math.max(0,right-left)*Math.max(0,bottom-top)/(box.width*box.height)}
function playback(){
 scheduled=false;
 const visible=videos.filter(v=>visibleShare(v)>=.35);
 const distance=v=>{const b=v.getBoundingClientRect(),r=v.closest('.video-grid').getBoundingClientRect();return Math.abs(b.left+b.width/2-(r.left+r.width/2))};
 if(manual&&!visible.includes(manual))manual=null;
 const active=manual||(!reduce.matches?visible.sort((a,b)=>distance(a)-distance(b))[0]:null);
 for(const video of videos){
  if(!document.hidden&&!document.querySelector('dialog[open]')&&video===active&&!stopped.has(video)){
   if(!video.src)video.src=video.dataset.previewSrc;
   if(video.paused)video.play().catch(()=>video.closest('.clip-inline')?.classList.add('needs-play'));
  }else video.pause();
 }
}
function schedulePlayback(){if(!scheduled){scheduled=true;requestAnimationFrame(playback)}}
const observer=new IntersectionObserver(schedulePlayback,{threshold:[0,.35,.5,1]});videos.forEach(v=>observer.observe(v));
const dialogs=new MutationObserver(schedulePlayback);$$('dialog').forEach(dialog=>dialogs.observe(dialog,{attributes:true,attributeFilter:['open']}));
document.addEventListener('visibilitychange',schedulePlayback);reduce.addEventListener('change',()=>{manual=null;schedulePlayback()});
const posters=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.poster=target.dataset.previewPoster;posters.unobserve(target)}}),{rootMargin:'250px'});
videos.forEach(video=>{
 posters.observe(video);
 const box=video.closest('.clip-inline'),play=box.querySelector('[data-clip-play]'),sound=box.querySelector('[data-clip-sound]'),name=video.getAttribute('aria-label').replace(' demonstration','');
 const update=()=>{play.textContent=video.paused?'Play':'Pause';play.setAttribute('aria-label',`${video.paused?'Play':'Pause'} ${name} video`);sound.textContent=video.muted?'Sound on':'Mute';sound.setAttribute('aria-label',`${video.muted?'Unmute':'Mute'} ${name} video`)};
 play.addEventListener('click',()=>{if(video.paused){stopped.delete(video);manual=video}else{stopped.add(video);manual=null}schedulePlayback()});
 sound.addEventListener('click',()=>{video.muted=!video.muted;update()});
 video.addEventListener('play',update);video.addEventListener('pause',update);update();
});
$$('.video-grid[data-featured-clip]').forEach(row=>{if(innerWidth<=700){const target=row.querySelector(`[data-clip-handle="${row.dataset.featuredClip}"]`)?.closest('.video-card');if(target)row.scrollLeft=target.offsetLeft-row.firstElementChild.offsetLeft}});
window.addEventListener('scroll',schedulePlayback,{passive:true});window.addEventListener('resize',schedulePlayback);$$('.video-grid').forEach(row=>row.addEventListener('scroll',schedulePlayback,{passive:true}));schedulePlayback();
$$('[data-video-next],[data-video-prev]').forEach(b=>b.addEventListener('click',()=>{const row=b.closest('section').querySelector('.video-grid');row.scrollBy({left:row.clientWidth*(b.hasAttribute('data-video-next')?1:-1),behavior:reduce.matches?'instant':'smooth'})}));
$$('.video-grid').forEach(row=>{const thumb=row.closest('.video-section')?.querySelector('.video-rail i');if(!thumb)return;const rail=thumb.parentElement,update=()=>{const canScroll=row.scrollWidth>row.clientWidth+4;rail.hidden=!canScroll;if(!canScroll)return;const total=Math.max(row.scrollWidth,1),visible=Math.min(1,row.clientWidth/total),range=Math.max(0,row.scrollWidth-row.clientWidth),progress=range?row.scrollLeft/range:0;thumb.style.width=`${Math.max(18,visible*100)}%`;thumb.style.left=`${(1-visible)*progress*100}%`};row.addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update()});
const offer=$('#launch-offer');let shown=false;try{shown=sessionStorage.getItem('ss-launch-offer')==='seen'}catch{}
function showOffer(){const purchase=$('[data-by5-builder]')?.getBoundingClientRect();if(shown||!offer||document.querySelector('dialog[open]')||document.activeElement?.matches('input,textarea,select')||document.activeElement?.closest('[data-by5-builder]')||(purchase&&purchase.bottom>0&&purchase.top<innerHeight))return;if(scrollY>Math.min(600,(document.documentElement.scrollHeight-innerHeight)*.35)){shown=true;try{sessionStorage.setItem('ss-launch-offer','seen')}catch{}offer.showModal()}}
window.addEventListener('scroll',showOffer,{passive:true});

// These four owner-approved images are delivered as progressive storefront
// enhancements so the older source pages can keep their original gallery views.
const ownerHeld={
 'boba-bottle':'/simply-squish-supplier-view/assets/generated-owner-20260924/boba-held-white-hand-v2.png',
 'crunchy-peanut':'/simply-squish-supplier-view/assets/generated-owner-20260924/peanut-held-white-hand.png',
 'crunchy-tofu-cube':'/simply-squish-supplier-view/assets/generated-owner-20260924/tofu-held-white-hand.png',
 'crunchy-soap-block':'/simply-squish-supplier-view/assets/soap-styles/white.webp'
};
const currentHandle=location.pathname.split('/').filter(Boolean).pop(),currentHeld=ownerHeld[currentHandle];
if(currentHeld&&!['boba-bottle','crunchy-soap-block'].includes(currentHandle)&&location.pathname.includes('/simply-squish-supplier-view/products/')){const main=$('[data-main-image]'),thumbs=$('.thumbnails');if(main&&thumbs){const oldSrc=main.getAttribute('src');main.src=currentHeld;main.removeAttribute('srcset');const first=thumbs.querySelector('button');if(first){first.dataset.gallerySrc=currentHeld;first.setAttribute('aria-label','View styled product view');first.querySelector('img').src=currentHeld;first.querySelector('img').alt='Styled product view';}if(oldSrc&&!thumbs.querySelector(`[data-gallery-src="${oldSrc}"]`)){const original=document.createElement('button');original.dataset.gallerySrc=oldSrc;original.setAttribute('aria-label','View original product view');original.setAttribute('aria-pressed','false');original.innerHTML=`<img src="${oldSrc}" alt="Original product view" width="110" height="110" loading="lazy">`;thumbs.append(original);}const note=document.createElement('p');note.className='gallery-source-note';note.textContent='Styled product view first; the original product photo follows.';thumbs.after(note);}}
for(const story of $$('.visual-science .science-evidence'))story.innerHTML='<div class="play-benefits" aria-label="Simple sensory-play ideas"><article><span aria-hidden="true">◎</span><h3>Explore texture</h3><p>Notice the shape, surface and small details.</p></article><article><span aria-hidden="true">↺</span><h3>Make a pause</h3><p>Take a playful moment between the busy bits.</p></article><article><span aria-hidden="true">♡</span><h3>Share a smile</h3><p>Pick a funny favourite to enjoy together.</p></article><article><span aria-hidden="true">✦</span><h3>Play your way</h3><p>There is no right way to enjoy a little squish.</p></article></div><p class="research-link"><a href="https://pubmed.ncbi.nlm.nih.gov/42474403/" target="_blank" rel="noopener noreferrer">Read the research</a></p>';
